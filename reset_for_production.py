#!/usr/bin/env python
"""
Reset CampusShield-AI for real data collection
This script clears demo data while preserving user accounts and system structure
"""

import os
import sys
import django
from pathlib import Path

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.core.management import call_command
from apps.incidents.models import Incident
from apps.alerts.models import Alert, Notification
from django.db import connection

def reset_database():
    """Clear all demo/test data from the database"""
    print("🔄 Resetting database...")
    
    # Clear incidents
    deleted_incidents = Incident.objects.all().delete()
    print(f"   ✓ Deleted {deleted_incidents[0]} incidents")
    
    # Clear alerts
    deleted_alerts = Alert.objects.all().delete()
    print(f"   ✓ Deleted {deleted_alerts[0]} alerts")
    
    # Clear notifications
    deleted_notifications = Notification.objects.all().delete()
    print(f"   ✓ Deleted {deleted_notifications[0]} notifications")
    
    # Reset incident ID sequence
    with connection.cursor() as cursor:
        cursor.execute("DELETE FROM sqlite_sequence WHERE name='incidents_incident'")
    print("   ✓ Reset incident counter")


def clear_ai_cache():
    """Clear AI model predictions and cache"""
    print("\n🧠 Clearing AI model cache...")
    
    prediction_dir = Path(__file__).parent / 'ai-model' / 'prediction'
    if prediction_dir.exists():
        for file in prediction_dir.glob('*.pkl'):
            try:
                file.unlink()
                print(f"   ✓ Deleted {file.name}")
            except Exception as e:
                print(f"   ⚠ Could not delete {file.name}: {e}")


def reset_frontend_state():
    """Generate instructions for clearing frontend state"""
    print("\n🎨 Frontend state reset instructions:")
    print("   • Users should clear browser localStorage: Open DevTools > Application > Local Storage > Clear All")
    print("   • Or the application will auto-load clean state on first visit")
    print("   • Clear browser cache for the domain")


def verify_reset():
    """Verify the reset was successful"""
    print("\n✅ Verification:")
    incident_count = Incident.objects.count()
    alert_count = Alert.objects.count()
    notification_count = Notification.objects.count()
    
    print(f"   • Incidents in database: {incident_count}")
    print(f"   • Alerts in database: {alert_count}")
    print(f"   • Notifications in database: {notification_count}")
    
    if incident_count == 0 and alert_count == 0 and notification_count == 0:
        print("   ✓ Database successfully reset for production!")
    else:
        print("   ⚠ Warning: Some data still remains")


def main():
    print("=" * 60)
    print("CampusShield-AI PRODUCTION RESET")
    print("=" * 60)
    
    confirmation = input("\n⚠️  This will delete all demo incidents and alerts. Continue? (yes/no): ").strip().lower()
    
    if confirmation != 'yes':
        print("Reset cancelled.")
        return
    
    try:
        reset_database()
        clear_ai_cache()
        reset_frontend_state()
        verify_reset()
        
        print("\n" + "=" * 60)
        print("✅ System is ready for real data collection!")
        print("=" * 60)
        print("\nNext steps:")
        print("  1. Notify users to clear browser cache")
        print("  2. Restart backend: python manage.py runserver")
        print("  3. Restart frontend dev server or redeploy")
        print("  4. Test with real incident reports")
        
    except Exception as e:
        print(f"\n❌ Error during reset: {e}")
        sys.exit(1)


if __name__ == '__main__':
    main()
