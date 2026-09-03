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

# ── DO NOT run loaddata here ──────────────────────────────────────────────
# Loading fixtures on every deploy would wipe all real user/incident data
# back to the 4 seeded demo accounts each time the service restarts.
#
# To seed a brand-new Postgres DB for the first time, run manually once:
#   python manage.py loaddata fixtures/initial_data.json
