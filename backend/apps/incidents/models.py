from django.db import models
from django.contrib.auth.models import User

class Incident(models.Model):
    STATUS_CHOICES = (
        ('Reported', 'Reported'),
        ('Investigation Ongoing', 'Investigation Ongoing'),
        ('Resolved', 'Resolved'),
        ('False Alarm', 'False Alarm'),
    )
    SEVERITY_CHOICES = (
        ('Low', 'Low'),
        ('Medium', 'Medium'),
        ('High', 'High'),
        ('Critical', 'Critical'),
    )
    
    incident_id = models.CharField(max_length=20, unique=True)
    reporter = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    category = models.CharField(max_length=100)
    description = models.TextField()
    location_name = models.CharField(max_length=150)
    latitude = models.FloatField()
    longitude = models.FloatField()
    severity = models.CharField(max_length=20, choices=SEVERITY_CHOICES, default='Medium')
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='Pending')
    image_url = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.incident_id} - {self.category} ({self.status})"
