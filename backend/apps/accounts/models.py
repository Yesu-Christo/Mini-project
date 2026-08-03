from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    ROLE_CHOICES = (
        ('STUDENT', 'Student'),
        ('SECURITY', 'Security Personnel'),
        ('ADMIN', 'Administrator'),
    )
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='STUDENT')
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    hall_or_department = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return f"{self.user.username} ({self.role})"
