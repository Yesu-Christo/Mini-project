import os
import sys
import pickle
import pandas as pd
import numpy as np
from django.conf import settings
from apps.incidents.models import Incident
from django.utils import timezone

# Add ai-model path to sys.path
ai_model_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../ai-model'))
if ai_model_path not in sys.path:
    sys.path.append(ai_model_path)

try:
    from predict import predict_crime_risk as model_predict_crime_risk
except ImportError:
    model_predict_crime_risk = None


def _load_model():
    if model_predict_crime_risk:
        return model_predict_crime_risk
    dir_path = os.path.dirname(os.path.abspath(__file__))
    model_path = os.path.join(dir_path, '..', '..', 'ai-model', 'saved_models', 'crime_prediction.pkl')
    if not os.path.exists(model_path):
        model_path = os.path.join(dir_path, '..', '..', 'ai-model', 'crime_prediction.pkl')
    if os.path.exists(model_path):
        with open(model_path, 'rb') as f:
            return pickle.load(f)
    return None


def calculate_area_risk(location_name, hour, day_of_week):
    recent_window = timezone.now() - timezone.timedelta(days=30)
    query = Incident.objects.filter(created_at__gte=recent_window, location_name__icontains=location_name)

    same_hour = query.filter(created_at__hour=hour).count()
    same_day = query.filter(created_at__week_day=day_of_week + 1).count()
    total = query.count()

    base_score = min(total / 20.0, 1.0)
    hour_score = min(same_hour / 5.0, 1.0)
    day_score = min(same_day / 8.0, 1.0)

    risk_probability = round((base_score * 0.5) + (hour_score * 0.3) + (day_score * 0.2), 4)
    return risk_probability


def build_prediction_payload(location_name, lat, lng, hour, day_of_week, month):
    is_night = 1 if hour >= 19 or hour <= 5 else 0
    baseline_risk_numeric = max(0, min(4, int((hour >= 22 or hour <= 5) + (day_of_week in (5, 6)) + 1)))
    data = {
        'hour': hour,
        'day_of_week': day_of_week,
        'month': month,
        'is_night': is_night,
        'is_weekend': 1 if day_of_week in (5, 6) else 0,
        'latitude': lat,
        'longitude': lng,
        'baseline_risk_numeric': baseline_risk_numeric,
        'location_name': location_name,
    }
    return data


def predict_crime_risk(location_name, hour, day_of_week, month, latitude, longitude):
    payload = build_prediction_payload(location_name, latitude, longitude, hour, day_of_week, month)
    risk_probability = calculate_area_risk(location_name, hour, day_of_week)

    model = _load_model()
    if model is not None and hasattr(model, 'predict_proba'):
        try:
            input_data = pd.DataFrame([{
                'hour': hour,
                'day_of_week': day_of_week,
                'month': month,
                'is_night': payload['is_night'],
                'is_weekend': payload['is_weekend'],
                'latitude': latitude,
                'longitude': longitude,
                'baseline_risk_numeric': payload['baseline_risk_numeric'],
            }])
            probabilities = model.predict_proba(input_data)
            prob = float(probabilities[0][1])
            risk_probability = round((risk_probability + prob) / 2, 4)
        except Exception:
            pass

    risk_level = 'High' if risk_probability >= 0.6 else 'Medium' if risk_probability >= 0.3 else 'Low'
    return {
        'risk_probability': risk_probability,
        'risk_level': risk_level,
        'is_night': payload['is_night'],
        'location_name': location_name,
        'coordinates': {'lat': latitude, 'lng': longitude},
    }


def refresh_risk_scores():
    recent_incidents = Incident.objects.filter(created_at__gte=timezone.now() - timezone.timedelta(days=30))
    score_map = {}
    for inc in recent_incidents:
        key = inc.location_name.strip().lower()
        score_map[key] = score_map.get(key, 0) + 1
    return score_map
