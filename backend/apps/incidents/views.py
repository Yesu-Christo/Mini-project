import json
from django.conf import settings
from django.core.mail import send_mail
from django.http import JsonResponse
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.utils import timezone
from django.contrib.auth import get_user_model
from .models import Incident
from apps.core.decorators import require_auth, require_role
from apps.alerts.models import Alert
from apps.accounts.models import UserProfile

User = get_user_model()

STATUS_CHOICES = ['Reported', 'Investigation Ongoing', 'Resolved', 'False Alarm']


def _notify_security_staff(subject, message):
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
class IncidentListView(View):
    @method_decorator(require_auth)
    def get(self, request):
        user = request.user
        if hasattr(user, 'profile') and user.profile.role == 'STUDENT':
            incidents = Incident.objects.filter(reporter=user).order_by('-created_at')
        else:
            incidents = Incident.objects.all().order_by('-created_at')

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
            _notify_security_staff(
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
            data = json.loads(request.body)
            status = data.get('status')
            if status not in STATUS_CHOICES:
                return JsonResponse({'error': 'Invalid status value.'}, status=400)

            incident = Incident.objects.filter(incident_id=incident_id).first()
            if not incident:
                return JsonResponse({'error': 'Incident not found.'}, status=404)

            if request.user.profile.role != 'ADMIN':
                return JsonResponse({'error': 'Only administrators can update incident status.'}, status=403)

            incident.status = status
            incident.save()

            Alert.objects.create(
                title=f"Incident {incident.incident_id} status updated",
                message=f"Status changed to {incident.status} for {incident.location_name}.",
                alert_type='SECURITY_DISPATCH',
                location_name=incident.location_name,
            )
            _notify_security_staff(
                f'Incident {incident.incident_id} status changed',
                f'Location: {incident.location_name}\nStatus: {incident.status}\nTime: {timezone.now().strftime("%Y-%m-%d %H:%M:%S")}'
            )

            return JsonResponse({'message': 'Incident status updated', 'status': incident.status}, status=200)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
