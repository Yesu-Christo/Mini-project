from django.test import TestCase

from apps.incidents.models import Incident


class IncidentStatusChoicesTests(TestCase):
    def test_status_choices_include_admin_review_values(self):
        allowed = dict(Incident.STATUS_CHOICES)

        self.assertIn('Reported', allowed)
        self.assertIn('Under Review', allowed)
        self.assertIn('Verified', allowed)
        self.assertIn('Resolved', allowed)
        self.assertIn('Dismissed', allowed)
