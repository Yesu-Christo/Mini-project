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

        last_week = now - timezone.timedelta(days=7)
        weekly_trends = (
            Incident.objects
                .filter(created_at__gte=last_week)
                .annotate(day=TruncDate('created_at'))
                .values('day')
                .order_by('day')
                .annotate(count=Count('id'))
        )

        area_scores = (
            Incident.objects
                .values('location_name')
                .annotate(recent_count=Count('id'))
                .order_by('-recent_count')[:6]
        )

        high_risk_areas = [
            {
                'name': item['location_name'],
                'risk_level': 'High' if item['recent_count'] >= 3 else 'Medium',
                'incidents': item['recent_count'],
            }
            for item in area_scores
        ]

        return JsonResponse({
            'total_incidents': total_incidents,
            'todays_incidents': today_incidents,
            'high_risk_areas_count': len(high_risk_areas),
            'prediction_accuracy': 'N/A',
            'active_alerts_count': active_alerts_count,
            'high_risk_areas': high_risk_areas,
            'weekly_trends': [
                {'day': item['day'].strftime('%a'), 'count': item['count']} for item in weekly_trends
            ],
        }, status=200)
