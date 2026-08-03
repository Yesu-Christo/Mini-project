import json
from django.http import JsonResponse
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from .models import Alert

@method_decorator(csrf_exempt, name='dispatch')
class AlertListView(View):
    def get(self, request):
        alerts = Alert.objects.filter(is_active=True).order_by('-created_at')
        data = [{
            'id': a.id,
            'title': a.title,
            'message': a.message,
            'alert_type': a.alert_type,
            'location_name': a.location_name,
            'created_at': a.created_at.strftime('%Y-%m-%d %H:%M:%S')
        } for a in alerts]
        return JsonResponse({'alerts': data}, status=200)

    def post(self, request):
        try:
            data = json.loads(request.body)
            alert = Alert.objects.create(
                title=data.get('title', 'Security Alert'),
                message=data.get('message', ''),
                alert_type=data.get('alert_type', 'HIGH_RISK_ZONE'),
                location_name=data.get('location_name', 'Campus Wide')
            )
            return JsonResponse({'message': 'Alert created', 'id': alert.id}, status=201)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
