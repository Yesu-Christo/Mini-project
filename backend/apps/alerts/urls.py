from django.urls import path
from .views import AlertListView, NotificationListView

urlpatterns = [
    path('', AlertListView.as_view(), name='alerts-list'),
    path('notifications/', NotificationListView.as_view(), name='notifications-list'),
]
