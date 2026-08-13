import json
from django.conf import settings
from django.http import JsonResponse
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from .services import predict_crime_risk

@method_decorator(csrf_exempt, name='dispatch')
class PredictRiskView(View):
    def post(self, request):
        try:
            data = json.loads(request.body) if request.body else {}
            hour = int(data.get('hour', 0))
            day_of_week = int(data.get('day_of_week', 0))
            month = int(data.get('month', 1))
            location_name = data.get('location_name', 'KNUST Campus')
            lat = float(data.get('latitude', settings.CAMPUS_DEFAULT_LAT))
            lng = float(data.get('longitude', settings.CAMPUS_DEFAULT_LNG))

            result = predict_crime_risk(
                location_name=location_name,
                hour=hour,
                day_of_week=day_of_week,
                month=month,
                latitude=lat,
                longitude=lng,
            )
            return JsonResponse({'status': 'success', 'prediction': result}, status=200)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
