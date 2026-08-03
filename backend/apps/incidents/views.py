import json
from django.http import JsonResponse
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from .models import Incident

@method_decorator(csrf_exempt, name='dispatch')
class IncidentListView(View):
    def get(self, request):
        incidents = Incident.objects.all().order_by('-created_at')
        data = []
        for inc in incidents:
            data.append({
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
            })
        return JsonResponse({'incidents': data}, status=200)

    def post(self, request):
        try:
            data = json.loads(request.body)
            count = Incident.objects.count() + 1
            inc_id = f"INC{count:04d}"
            
            inc = Incident.objects.create(
                incident_id=inc_id,
                category=data.get('category', 'General'),
                description=data.get('description', ''),
                location_name=data.get('location_name', 'KNUST Campus'),
                latitude=float(data.get('latitude', 6.6738)),
                longitude=float(data.get('longitude', -1.5684)),
                severity=data.get('severity', 'Medium'),
                status='Pending',
                image_url=data.get('image_url', '')
            )
            return JsonResponse({'message': 'Incident reported successfully', 'incident_id': inc.incident_id}, status=201)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
