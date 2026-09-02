from django.urls import path
from .views import LoginView, RegisterView, ForgotPasswordView, ResetPasswordView, UserListView

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('register/', RegisterView.as_view(), name='register'),
    path('forgot-password/', ForgotPasswordView.as_view(), name='forgot-password'),
    path('reset-password/', ResetPasswordView.as_view(), name='reset-password'),
    path('', UserListView.as_view(), name='user-list'),
]
