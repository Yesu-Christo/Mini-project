#!/usr/bin/env bash
# Exit on error
set -o errexit

pip install -r requirements.txt
python manage.py collectstatic --no-input
python manage.py migrate

# ── DO NOT run loaddata here ──────────────────────────────────────────────
# Loading fixtures on every deploy would wipe all real user/incident data
# back to the 4 seeded demo accounts each time the service restarts.
#
# To seed a brand-new Postgres DB for the first time, run manually once:
#   python manage.py loaddata fixtures/initial_data.json
