from django.urls import path
from .views import PredictRiskView

urlpatterns = [
    path('', PredictRiskView.as_view(), name='predict-risk'),
]
