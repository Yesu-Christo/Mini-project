from django.urls import path
from .views import IncidentListView, IncidentDetailView

urlpatterns = [
    path('', IncidentListView.as_view(), name='incidents-list'),
    path('<str:incident_id>/', IncidentDetailView.as_view(), name='incident-detail'),
]
