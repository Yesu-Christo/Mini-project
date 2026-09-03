import os
from django.http import JsonResponse
from django.db import connection
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings


@csrf_exempt
def health_check(request):
    """
    Public diagnostic endpoint — visit /api/health/ in your browser to see
    exactly what is configured on the live server without needing dashboard access.
    """
    # ── Database ──────────────────────────────────────────────────────────
    db_status = 'ok'
    db_error = None
    db_engine = settings.DATABASES.get('default', {}).get('ENGINE', 'unknown')
    table_count = 0
    try:
        with connection.cursor() as cursor:
            cursor.execute(
                "SELECT count(*) FROM information_schema.tables WHERE table_schema = 'public';"
                if 'postgres' in db_engine else
                "SELECT count(*) FROM sqlite_master WHERE type='table';"
            )
            table_count = cursor.fetchone()[0]
    except Exception as e:
        db_status = 'error'
        db_error = str(e)

    # Check auth_user table specifically (key indicator migrations ran)
    migrations_ran = False
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1 FROM auth_user LIMIT 1;")
            migrations_ran = True
    except Exception:
        migrations_ran = False

    # ── Email ──────────────────────────────────────────────────────────────
    email_backend = settings.EMAIL_BACKEND
    email_host = settings.EMAIL_HOST
    email_user = settings.EMAIL_HOST_USER
    email_password_set = bool(settings.EMAIL_HOST_PASSWORD)

    # ── Database URL hint (masked) ─────────────────────────────────────────
    db_url_raw = os.environ.get('DATABASE_URL', '')
    if db_url_raw:
        # Show only the host portion, mask credentials
        try:
            from urllib.parse import urlparse
            parsed = urlparse(db_url_raw)
            db_url_hint = f"{parsed.scheme}://***:***@{parsed.hostname}{parsed.path}"
        except Exception:
            db_url_hint = 'set (could not parse)'
    else:
        db_url_hint = 'NOT SET — using SQLite fallback'

    return JsonResponse({
        'status': 'online',
        'database': {
            'status': db_status,
            'engine': db_engine,
            'url_hint': db_url_hint,
            'table_count': table_count,
            'migrations_ran': migrations_ran,
            'error': db_error,
        },
        'email': {
            'backend': email_backend,
            'host': email_host,
            'user': email_user,
            'password_configured': email_password_set,
            'will_send_real_emails': 'smtp' in email_backend.lower() and email_password_set,
        },
        'debug_mode': settings.DEBUG,
        'allowed_hosts': settings.ALLOWED_HOSTS,
    })
