import os
from pathlib import Path
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / '.env')

# ── Security ──────────────────────────────────────────────────────────────
SECRET_KEY = os.environ.get('SECRET_KEY', 'django-insecure-fallback-key-replace-in-production')
DEBUG = os.environ.get('DEBUG', 'True') == 'True'

_ALLOWED = os.environ.get('ALLOWED_HOSTS', 'localhost,127.0.0.1')
ALLOWED_HOSTS = [h.strip() for h in _ALLOWED.split(',') if h.strip()]

# ── Installed Apps ────────────────────────────────────────────────────────
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'corsheaders',
    'apps.accounts',
    'apps.incidents',
    'apps.prediction',
    'apps.alerts',
    'apps.dashboard',
    'apps.core',
]

# ── Middleware ────────────────────────────────────────────────────────────
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'apps.core.middleware.TokenAuthMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# ── CORS ──────────────────────────────────────────────────────────────────
_CORS_ORIGINS = os.environ.get('CORS_ALLOWED_ORIGINS', '')
if _CORS_ORIGINS:
    CORS_ALLOW_ALL_ORIGINS = False
    CORS_ALLOWED_ORIGINS = [o.strip() for o in _CORS_ORIGINS.split(',') if o.strip()]
else:
    CORS_ALLOW_ALL_ORIGINS = DEBUG  # open only in dev

# ── CSRF ──────────────────────────────────────────────────────────────────
# Required when DEBUG=False — Django rejects cross-origin unsafe requests
# without a matching CSRF_TRUSTED_ORIGINS entry.
# Reuse CORS_ALLOWED_ORIGINS if set, otherwise fall back to FRONTEND_URL.
_CSRF_ORIGINS = os.environ.get('CORS_ALLOWED_ORIGINS', os.environ.get('FRONTEND_URL', ''))
CSRF_TRUSTED_ORIGINS = [o.strip() for o in _CSRF_ORIGINS.split(',') if o.strip()]

# ── URLs / Templates / WSGI ───────────────────────────────────────────────
ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'

# ── Database ──────────────────────────────────────────────────────────────
# In production (Render), DATABASE_URL is set as an environment variable
# pointing to the managed Postgres instance. dj_database_url parses it
# automatically. Local dev falls back to SQLite if DATABASE_URL is unset.
import dj_database_url

_db_default = f"sqlite:///{os.path.join(BASE_DIR, 'db.sqlite3')}"
_db_url = os.environ.get('DATABASE_URL', '')
DATABASES = {
    'default': dj_database_url.config(
        default=_db_default,
        conn_max_age=600,
        ssl_require=_db_url.startswith('postgres'),
    )
}
# psycopg3 (psycopg[binary]) uses the django.db.backends.postgresql engine
# which works with both psycopg2 and psycopg3 — no engine override needed.

# ── Password Hashers ──────────────────────────────────────────────────────
PASSWORD_HASHERS = [
    'django.contrib.auth.hashers.BCryptSHA256PasswordHasher',
    'django.contrib.auth.hashers.PBKDF2PasswordHasher',
]

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
]

# ── Localisation ──────────────────────────────────────────────────────────
LANGUAGE_CODE = 'en-us'
TIME_ZONE = os.environ.get('TIME_ZONE', 'Africa/Accra')
USE_I18N = True
USE_TZ = True

# ── Email ─────────────────────────────────────────────────────────────────
EMAIL_HOST        = os.environ.get('EMAIL_HOST', 'smtp.gmail.com')
EMAIL_PORT        = int(os.environ.get('EMAIL_PORT', '587'))
EMAIL_HOST_USER   = os.environ.get('EMAIL_HOST_USER', '')
EMAIL_HOST_PASSWORD = os.environ.get('EMAIL_HOST_PASSWORD', '')
EMAIL_USE_TLS     = os.environ.get('EMAIL_USE_TLS', 'True') == 'True'
EMAIL_USE_SSL     = os.environ.get('EMAIL_USE_SSL', 'False') == 'True'
DEFAULT_FROM_EMAIL = os.environ.get('DEFAULT_FROM_EMAIL', 'CampusShield AI <noreply@campusshield.local>')
FRONTEND_URL      = os.environ.get('FRONTEND_URL', 'http://localhost:5173')

# Automatically use SMTP if a password is provided, otherwise default to console (for local dev)
if EMAIL_HOST_PASSWORD and 'EMAIL_BACKEND' not in os.environ:
    EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
else:
    EMAIL_BACKEND = os.environ.get('EMAIL_BACKEND', 'django.core.mail.backends.console.EmailBackend')

# ── Static & Media ────────────────────────────────────────────────────────
STATIC_URL  = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

MEDIA_URL   = '/media/'
MEDIA_ROOT  = os.path.join(BASE_DIR, 'media')

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# ── Campus Defaults ───────────────────────────────────────────────────────
CAMPUS_DEFAULT_LAT = float(os.environ.get('CAMPUS_DEFAULT_LAT', '6.6738'))
CAMPUS_DEFAULT_LNG = float(os.environ.get('CAMPUS_DEFAULT_LNG', '-1.5684'))
