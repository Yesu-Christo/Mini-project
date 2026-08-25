from django.contrib.auth.models import User
from django.test import Client, TestCase

from .models import UserProfile


class RegistrationTests(TestCase):
    def setUp(self):
        self.client = Client()

    def test_student_registration_requires_and_stores_program(self):
        response = self.client.post(
            '/api/accounts/register/',
            data={
                'role': 'STUDENT', 'school_id': 'STU100',
                'first_name': 'Ama', 'last_name': 'Mensah',
                'email': 'ama@example.com', 'program': 'BSc Computer Science',
                'password': 'strong-password',
            },
            content_type='application/json',
        )

        self.assertEqual(response.status_code, 201)
        profile = UserProfile.objects.get(school_id='STU100')
        self.assertEqual(profile.program, 'BSc Computer Science')
        self.assertEqual(profile.user.first_name, 'Ama')

    def test_staff_registration_stores_professional_details(self):
        response = self.client.post(
            '/api/accounts/register/',
            data={
                'role': 'STAFF', 'school_id': 'STF100',
                'first_name': 'Kofi', 'last_name': 'Owusu', 'other_name': 'Kojo',
                'title': 'Dr.', 'email': 'kofi@example.com',
                'occupation': 'Lecturer', 'department': 'Computer Science',
                'password': 'strong-password',
            },
            content_type='application/json',
        )

        self.assertEqual(response.status_code, 201)
        profile = UserProfile.objects.get(school_id='STF100')
        self.assertEqual(profile.role, 'STAFF')
        self.assertEqual(profile.title, 'Dr.')
        self.assertEqual(profile.other_name, 'Kojo')
        self.assertEqual(profile.occupation, 'Lecturer')
        self.assertEqual(profile.hall_or_department, 'Computer Science')

    def test_staff_registration_requires_title(self):
        response = self.client.post(
            '/api/accounts/register/',
            data={
                'role': 'STAFF', 'school_id': 'STF101',
                'first_name': 'Kofi', 'last_name': 'Owusu',
                'email': 'kofi2@example.com', 'occupation': 'Lecturer',
                'department': 'Computer Science', 'password': 'strong-password',
            },
            content_type='application/json',
        )

        self.assertEqual(response.status_code, 400)
        self.assertIn('Title is required', response.json()['error'])