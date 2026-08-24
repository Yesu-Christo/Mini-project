from django.urls import path
from .views import EmergencyAlertView, IncidentListView, IncidentDetailView

urlpatterns = [
    path('emergency/', EmergencyAlertView.as_view(), name='emergency-alert'),
    path('', IncidentListView.as_view(), name='incidents-list'),
    path('<str:incident_id>/', IncidentDetailView.as_view(), name='incident-detail'),
]
