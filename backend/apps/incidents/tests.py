from django.test import TestCase
from django.contrib.auth.models import User
from django.test import Client
from django.core import mail

from apps.incidents.models import Incident
from apps.alerts.models import Alert, Notification
from apps.accounts.models import UserProfile


class IncidentStatusChoicesTests(TestCase):
    def test_status_choices_include_admin_review_values(self):
        allowed = dict(Incident.STATUS_CHOICES)

        self.assertIn('Reported', allowed)
        self.assertIn('Under Review', allowed)
        self.assertIn('Verified', allowed)
        self.assertIn('Resolved', allowed)
        self.assertIn('Dismissed', allowed)


class EmergencyAlertTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.student = User.objects.create_user(username='student', password='test', email='student@example.com')
        UserProfile.objects.create(user=self.student, school_id='STU999', role='STUDENT')

    def test_student_emergency_creates_critical_dispatch(self):
        response = self.client.post(
            '/api/incidents/emergency/',
            data={'latitude': 6.6745, 'longitude': -1.5716},
            content_type='application/json',
            HTTP_AUTHORIZATION='Bearer STU999',
        )

        self.assertEqual(response.status_code, 201)
        incident = Incident.objects.get()
        self.assertEqual(incident.severity, 'Critical')
        self.assertEqual(incident.latitude, 6.6745)
        self.assertEqual(Alert.objects.get().alert_type, 'EMERGENCY')
        self.assertEqual(Notification.objects.get().notification_type, 'EMERGENCY')
        self.assertEqual(response.json()['incident']['reporter_school_id'], 'STU999')
        self.assertEqual(response.json()['incident']['reporter_email'], 'student@example.com')

    def test_emergency_email_targets_security_and_admin_with_reporter_details(self):
        security = User.objects.create_user(username='security', email='security@example.com')
        UserProfile.objects.create(user=security, school_id='SEC999', role='SECURITY')
        admin = User.objects.create_user(username='admin', email='admin@example.com')
        UserProfile.objects.create(user=admin, school_id='ADM999', role='ADMIN')

        response = self.client.post(
            '/api/incidents/emergency/',
            data={'latitude': 6.6745, 'longitude': -1.5716},
            content_type='application/json',
            HTTP_AUTHORIZATION='Bearer STU999',
        )

        self.assertEqual(response.status_code, 201)
        self.assertEqual(len(mail.outbox), 1)
        self.assertCountEqual(mail.outbox[0].to, ['security@example.com', 'admin@example.com'])
        self.assertIn('Student ID: STU999', mail.outbox[0].body)
        self.assertIn('Student email: student@example.com', mail.outbox[0].body)

    def test_non_student_cannot_activate_emergency(self):
        security = User.objects.create_user(username='security', password='test')
        UserProfile.objects.create(user=security, school_id='SEC999', role='SECURITY')

        response = self.client.post(
            '/api/incidents/emergency/',
            data={'latitude': 6.6745, 'longitude': -1.5716},
            content_type='application/json',
            HTTP_AUTHORIZATION='Bearer SEC999',
        )

        self.assertEqual(response.status_code, 403)
        self.assertFalse(Incident.objects.exists())

    def test_university_staff_can_activate_emergency(self):
        staff = User.objects.create_user(username='staff', email='staff@example.com')
        UserProfile.objects.create(user=staff, school_id='STF999', role='STAFF')

        response = self.client.post(
            '/api/incidents/emergency/',
            data={'latitude': 6.6745, 'longitude': -1.5716},
            content_type='application/json',
            HTTP_AUTHORIZATION='Bearer STF999',
        )

        self.assertEqual(response.status_code, 201)
        self.assertEqual(Incident.objects.get().reporter, staff)
