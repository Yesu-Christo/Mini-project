#!/usr/bin/env bash
# Exit on error
set -o errexit

echo ">>> Installing Python dependencies..."
pip install -r requirements.txt

echo ">>> Collecting static files..."
python manage.py collectstatic --no-input

echo ">>> Running database migrations..."
python manage.py migrate --run-syncdb
echo ">>> Migrations complete."

# ── Seed demo accounts on first deploy only ───────────────────────────────
# Checks if any users exist before loading — safe to run on every deploy.
# On a fresh Postgres DB (e.g. after migration) this seeds the 4 demo
# accounts. On subsequent deploys with real user data it does nothing.
echo ">>> Checking if demo seed is needed..."
python manage.py shell -c "
from django.contrib.auth.models import User
if User.objects.count() == 0:
    from django.core.management import call_command
    call_command('loaddata', 'fixtures/initial_data.json')
    print('Demo accounts seeded.')
else:
    print(f'Skipping seed — {User.objects.count()} user(s) already exist.')
"
echo ">>> Done."
