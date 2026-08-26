import json
import math
import os
from django.conf import settings
from django.db.models import Count
from django.db.models.functions import TruncDate
from django.http import JsonResponse
from django.views import View
from django.utils import timezone
from apps.incidents.models import Incident
from apps.alerts.models import Alert

class DashboardStatsView(View):
    def get(self, request):
        now = timezone.now()
        total_incidents = Incident.objects.count()
        today_incidents = Incident.objects.filter(created_at__date=now.date()).count()
        active_alerts_count = Alert.objects.filter(is_active=True).count()

        # Generate last 7 days dynamically (from 6 days ago through today)
        days_list = [now.date() - timezone.timedelta(days=i) for i in range(6, -1, -1)]

        # Map incident count per date
        incidents_by_day = {
            item['day']: item['count']
            for item in Incident.objects
                .filter(created_at__date__gte=days_list[0])
                .annotate(day=TruncDate('created_at'))
                .values('day')
                .annotate(count=Count('id'))
        }

        weekly_trends = [
            {
                'day': d.strftime('%a'),
                'date': d.strftime('%Y-%m-%d'),
                'incidents': incidents_by_day.get(d, 0)
            }
            for d in days_list
        ]

        thirty_days_ago = now - timezone.timedelta(days=30)
        sixty_days_ago = now - timezone.timedelta(days=60)
        severity_weights = {'Low': 1, 'Medium': 2, 'High': 3, 'Critical': 4}
        locations = Incident.objects.values_list('location_name', flat=True).distinct()
        area_scores = []
        for location in locations:
            recent = Incident.objects.filter(location_name=location, created_at__gte=thirty_days_ago)
            prior_count = Incident.objects.filter(
                location_name=location,
                created_at__gte=sixty_days_ago,
                created_at__lt=thirty_days_ago,
            ).count()
            weighted_score = sum(
                severity_weights.get(incident.severity, 2)
                * math.exp(-((now - incident.created_at).total_seconds() / 86400) / 30)
                for incident in recent
            )
            area_scores.append({
                'location_name': location,
                'recent_count': recent.count(),
                'prior_count': prior_count,
                'risk_score': round(weighted_score, 2),
                'rising': recent.count() > prior_count,
            })
        area_scores.sort(key=lambda item: item['risk_score'], reverse=True)

        metrics_path = os.path.join(settings.BASE_DIR, '..', 'ai-model', 'saved_models', 'metrics.json')
        prediction_accuracy = 'N/A'
        if os.path.exists(metrics_path):
            with open(metrics_path, encoding='utf-8') as metrics_file:
                accuracy = json.load(metrics_file).get('accuracy')
                if accuracy is not None:
                    prediction_accuracy = f"{accuracy * 100:.1f}%"

        high_risk_areas = [
            {
                'name': item['location_name'],
                'risk_level': 'High' if item['risk_score'] >= 8 else 'Medium' if item['risk_score'] >= 4 else 'Low',
                'incidents': item['recent_count'],
                'risk_score': item['risk_score'],
                'prior_incidents': item['prior_count'],
                'rising': item['rising'],
            }
            for item in area_scores
        ]

        return JsonResponse({
            'total_incidents': total_incidents,
            'todays_incidents': today_incidents,
            'high_risk_areas_count': len(high_risk_areas),
            'prediction_accuracy': prediction_accuracy,
            'active_alerts_count': active_alerts_count,
            'high_risk_areas': high_risk_areas,
            'weekly_trends': weekly_trends,
        }, status=200)
