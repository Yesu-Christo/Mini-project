import json
from django.conf import settings
from django.core.mail import send_mail
from django.http import JsonResponse
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.utils import timezone
from django.contrib.auth import get_user_model
from django.db import models
from .models import Incident
from apps.core.decorators import require_auth, require_role
from apps.alerts.models import Alert, Notification
from apps.accounts.models import UserProfile

User = get_user_model()

STATUS_CHOICES = ['Reported', 'Under Review', 'Verified', 'Resolved', 'Dismissed']
LEGACY_STATUS_MAP = {
    'Pending': 'Reported',
    'Under Investigation': 'Under Review',
    'Investigation Ongoing': 'Under Review',
    'False Alarm': 'Dismissed',
}


def _reporter_details(user):
    profile = getattr(user, 'profile', None)
    return (
        f"Reporter: {user.get_full_name() or user.username}\n"
        f"Role: {profile.role if profile else 'UNKNOWN'}\n"
        f"School ID: {profile.school_id if profile else 'N/A'}\n"
        f"Email: {user.email or 'Not provided'}\n"
    )


def _notify_relevant_users(subject, message):
    recipients = list(
        UserProfile.objects.filter(role__in=['ADMIN', 'SECURITY'])
        .exclude(user__email='')
        .values_list('user__email', flat=True)
    )
    if not recipients:
        return

    send_mail(
        subject,
        message,
        settings.DEFAULT_FROM_EMAIL,
        recipients,
        fail_silently=True,
    )

@method_decorator(csrf_exempt, name='dispatch')
class EmergencyAlertView(View):
    @method_decorator(require_auth)
    def post(self, request):
        try:
            profile = getattr(request.user, 'profile', None)
            if not profile or profile.role not in ['STUDENT', 'STAFF']:
                return JsonResponse({'error': 'Only students and university staff can activate an emergency alert.'}, status=403)

            data = json.loads(request.body or '{}')
            latitude = float(data.get('latitude', settings.CAMPUS_DEFAULT_LAT))
            longitude = float(data.get('longitude', settings.CAMPUS_DEFAULT_LNG))
            location_name = data.get('location_name') or f'Live location ({latitude:.6f}, {longitude:.6f})'
            count = Incident.objects.count() + 1
            inc = Incident.objects.create(
                incident_id=f'INC{count:04d}', reporter=request.user, category='Emergency',
                description='Emergency SOS activated by a student or university staff member. Dispatch patrol immediately.',
                location_name=location_name, latitude=latitude, longitude=longitude,
                severity='Critical', status='Reported',
            )

            reporter_info = _reporter_details(request.user)
            dispatch_message = (
                f'EMERGENCY: Dispatch patrol immediately to {location_name}.\n'
                f'Coordinates: {latitude:.6f}, {longitude:.6f}.\n'
                f'{reporter_info}'
            )
            Alert.objects.create(
                title=f'EMERGENCY DISPATCH: {inc.incident_id}', message=dispatch_message,
                alert_type='EMERGENCY', location_name=location_name,
            )
            Notification.objects.create(
                title=f'Emergency dispatch: {inc.incident_id}', message=dispatch_message,
                notification_type='EMERGENCY', location_name=location_name,
            )
            _notify_relevant_users(
                f'EMERGENCY DISPATCH: {inc.incident_id}',
                dispatch_message,
            )

            return JsonResponse({
                'message': 'Emergency alert sent. Patrol has been notified.',
                'incident': {
                    'id': inc.id, 'incident_id': inc.incident_id, 'category': inc.category,
                    'description': inc.description, 'location_name': inc.location_name,
                    'latitude': inc.latitude, 'longitude': inc.longitude, 'severity': inc.severity,
                    'status': inc.status, 'reporter_id': inc.reporter_id,
                    'reporter_username': request.user.username,
                    'reporter_school_id': request.user.profile.school_id,
                    'reporter_email': request.user.email,
                    'created_at': inc.created_at.strftime('%Y-%m-%d %H:%M:%S'),
                },
            }, status=201)
        except (TypeError, ValueError, json.JSONDecodeError) as error:
            return JsonResponse({'error': f'Invalid emergency location: {error}'}, status=400)
        except Exception as error:
            return JsonResponse({'error': str(error)}, status=400)


@method_decorator(csrf_exempt, name='dispatch')
class IncidentListView(View):
    @method_decorator(require_auth)
    def get(self, request):
        user = request.user
        own_first = 0 if hasattr(user, 'profile') and user.profile.role == 'STUDENT' else None
        incidents = Incident.objects.all()
        if own_first is not None:
            incidents = incidents.order_by(
                models.Case(when=models.Q(reporter=user), then=models.Value(0), default=models.Value(1)),
                '-created_at',
            )
        else:
            incidents = incidents.order_by('-created_at')

        data = [
            {
                'id': inc.id,
                'incident_id': inc.incident_id,
                'category': inc.category,
                'description': inc.description,
                'location_name': inc.location_name,
                'latitude': inc.latitude,
                'longitude': inc.longitude,
                'severity': inc.severity,
                'status': inc.status,
                'reporter_id': inc.reporter_id,
                'reporter_username': inc.reporter.username if inc.reporter else None,
                'image_url': inc.image_url,
                'created_at': inc.created_at.strftime('%Y-%m-%d %H:%M:%S'),
            }
            for inc in incidents
        ]
        return JsonResponse({'incidents': data}, status=200)

    @method_decorator(require_auth)
    def post(self, request):
        try:
            data = json.loads(request.body)
            count = Incident.objects.count() + 1
            inc_id = f"INC{count:04d}"
            user = request.user
            status = data.get('status', 'Reported')
            status = LEGACY_STATUS_MAP.get(status, status)
            if status not in STATUS_CHOICES:
                status = 'Reported'

            if request.user.profile.role != 'ADMIN':
                status = 'Reported'

            inc = Incident.objects.create(
                incident_id=inc_id,
                reporter=user,
                category=data.get('category', 'General'),
                description=data.get('description', ''),
                location_name=data.get('location_name', 'KNUST Campus'),
                latitude=float(data.get('latitude', settings.CAMPUS_DEFAULT_LAT)),
                longitude=float(data.get('longitude', settings.CAMPUS_DEFAULT_LNG)),
                severity=data.get('severity', 'Medium'),
                status=status,
                image_url=data.get('image_url', '')
            )

            Alert.objects.create(
                title=f"New incident reported: {inc.incident_id}",
                message=inc.description[:180] or 'A new campus incident has been reported.',
                alert_type='INCIDENT_BROADCAST',
                location_name=inc.location_name,
            )
            _notify_relevant_users(
                f'New incident {inc.incident_id} reported',
                f'Location: {inc.location_name}\nStatus: {inc.status}\nTime: {inc.created_at.strftime("%Y-%m-%d %H:%M:%S")}'
            )

            return JsonResponse({'message': 'Incident reported successfully', 'incident_id': inc.incident_id}, status=201)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

@method_decorator(csrf_exempt, name='dispatch')
class IncidentDetailView(View):
    @method_decorator(require_auth)
    def patch(self, request, incident_id):
        try:
            # Check authentication and authorization first
            profile = getattr(request.user, 'profile', None)
            if profile is None or profile.role not in ['ADMIN', 'SECURITY']:
                return JsonResponse({'error': 'Only administrators and security staff can update incident status.'}, status=403)
            
            # Parse the request body
            try:
                data = json.loads(request.body)
            except json.JSONDecodeError:
                return JsonResponse({'error': 'Invalid request format.'}, status=400)
            
            # Validate status value
            status = LEGACY_STATUS_MAP.get(data.get('status'), data.get('status'))
            if status not in STATUS_CHOICES:
                return JsonResponse({'error': f'Invalid status value. Must be one of: {', '.join(STATUS_CHOICES)}'}, status=400)

            # Find the incident
            incident = Incident.objects.filter(incident_id=incident_id).first()
            if not incident:
                return JsonResponse({'error': f'Incident {incident_id} not found.'}, status=404)

            # Update status
            incident.status = status
            incident.save()

            # Create notification
            Notification.objects.create(
                title=f"Incident {incident.incident_id} status updated",
                message=f"Status changed to {incident.status} for {incident.location_name}.",
                notification_type='INCIDENT_UPDATE',
                location_name=incident.location_name,
            )
            _notify_relevant_users(
                f'Incident {incident.incident_id} status changed',
                f'Location: {incident.location_name}\nStatus: {incident.status}\nTime: {timezone.now().strftime("%Y-%m-%d %H:%M:%S")}'
            )

            return JsonResponse({'message': 'Incident status updated', 'status': incident.status}, status=200)
        except json.JSONDecodeError as e:
            return JsonResponse({'error': f'Invalid JSON: {str(e)}'}, status=400)
        except Exception as e:
            import traceback
            traceback.print_exc()  # Log the full error for debugging
            return JsonResponse({'error': f'Status update failed: {str(e)}'}, status=500)
