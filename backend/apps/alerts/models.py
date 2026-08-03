from django.db import models

class Alert(models.Model):
    ALERT_TYPES = (
        ('HIGH_RISK_ZONE', 'High Risk Zone Warning'),
        ('INCIDENT_BROADCAST', 'Incident Broadcast'),
        ('SECURITY_DISPATCH', 'Security Dispatch'),
    )
    title = models.CharField(max_length=150)
    message = models.TextField()
    alert_type = models.CharField(max_length=50, choices=ALERT_TYPES, default='HIGH_RISK_ZONE')
    location_name = models.CharField(max_length=150)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} - {self.location_name}"
