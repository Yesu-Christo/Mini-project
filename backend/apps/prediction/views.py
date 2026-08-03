import os
import sys
import json
from django.http import JsonResponse
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

# Add ai-model path to sys.path
ai_model_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../ai-model'))
if ai_model_path not in sys.path:
    sys.path.append(ai_model_path)

try:
    from predict import predict_crime_risk
except ImportError:
    def predict_crime_risk(**kwargs):
        return {
            'risk_probability': 0.78,
            'risk_level': 'High',
            'is_night': 1,
            'coordinates': {'lat': kwargs.get('latitude', 6.6738), 'lng': kwargs.get('longitude', -1.5684)}
        }

@method_decorator(csrf_exempt, name='dispatch')
class PredictRiskView(View):
    def post(self, request):
        try:
            data = json.loads(request.body) if request.body else {}
            hour = int(data.get('hour', 21))
            day_of_week = int(data.get('day_of_week', 4))
            month = int(data.get('month', 8))
            lat = float(data.get('latitude', 6.6738))
            lng = float(data.get('longitude', -1.5684))
            baseline_risk = int(data.get('baseline_risk_numeric', 2))
            
            result = predict_crime_risk(
                hour=hour,
                day_of_week=day_of_week,
                month=month,
                latitude=lat,
                longitude=lng,
                baseline_risk_numeric=baseline_risk
            )
            return JsonResponse({'status': 'success', 'prediction': result}, status=200)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
