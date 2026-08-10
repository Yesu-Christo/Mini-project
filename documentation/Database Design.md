# CampusShield AI — Database Design

**Version:** 1.0.0  
**Database Engine:** SQLite 3 (development) → PostgreSQL (production)  
**ORM:** Django ORM  
**Project:** KNUST Real-Time Crime Hotspot Prediction System  
**Course:** CSM 374 — Mini Project  
**Institution:** Kwame Nkrumah University of Science and Technology, Kumasi, Ghana

---

## 1. Overview

The CampusShield AI database is managed by Django's ORM using SQLite for local development. All schema changes are version-controlled via Django migrations in each app's `migrations/` directory.

The database consists of **5 core tables** mapped to Django models across 3 apps.

---

## 2. Entity Relationship Summary

```
auth_user (Django built-in)
    │
    ├── 1:1 ──► UserProfile          (accounts app)
    │
    └── 1:N ──► Incident             (incidents app)
                    │
                    └── triggers ──► Alert (alerts app)
```

---

## 3. Table Definitions

### 3.1 `auth_user` (Django Built-in)

Standard Django user table. Extended via `UserProfile`.

| Column | Type | Description |
|--------|------|-------------|
| `id` | INTEGER PK | Auto-increment primary key |
| `username` | VARCHAR(150) | Unique login username |
| `password` | VARCHAR(128) | Hashed password (PBKDF2) |
| `email` | VARCHAR(254) | User email address |
| `first_name` | VARCHAR(150) | First name |
| `last_name` | VARCHAR(150) | Last name |
| `is_active` | BOOLEAN | Account active flag |
| `is_staff` | BOOLEAN | Django admin access flag |
| `date_joined` | DATETIME | Account creation timestamp |

---

### 3.2 `accounts_userprofile`

Extends `auth_user` with KNUST-specific role and contact information.

**App:** `apps.accounts`  
**Model:** `UserProfile`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER | PK, AUTO | Primary key |
| `user_id` | INTEGER | FK → auth_user(id), UNIQUE, CASCADE DELETE | One-to-one link to Django user |
| `role` | VARCHAR(20) | NOT NULL, DEFAULT='STUDENT' | User role: STUDENT / SECURITY / ADMIN |
| `phone_number` | VARCHAR(20) | NULLABLE | Contact phone number |
| `hall_or_department` | VARCHAR(100) | NULLABLE | Student hall or staff department |

**Role Choices:**

| Value | Label |
|-------|-------|
| `STUDENT` | Student |
| `SECURITY` | Security Personnel |
| `ADMIN` | Administrator |

---

### 3.3 `incidents_incident`

Records all campus security incidents reported by students and security personnel.

**App:** `apps.incidents`  
**Model:** `Incident`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER | PK, AUTO | Primary key |
| `incident_id` | VARCHAR(20) | UNIQUE, NOT NULL | Human-readable ID (e.g. INC0001) |
| `reporter_id` | INTEGER | FK → auth_user(id), NULLABLE, SET NULL | User who filed the report |
| `category` | VARCHAR(100) | NOT NULL | Incident type (Theft, Assault, etc.) |
| `description` | TEXT | NOT NULL | Full narrative description |
| `location_name` | VARCHAR(150) | NOT NULL | Named campus location |
| `latitude` | FLOAT | NOT NULL | GPS latitude |
| `longitude` | FLOAT | NOT NULL | GPS longitude |
| `severity` | VARCHAR(20) | NOT NULL, DEFAULT='Medium' | Low / Medium / High / Critical |
| `status` | VARCHAR(30) | NOT NULL, DEFAULT='Pending' | Pending / Under Investigation / Resolved / Dismissed |
| `image_url` | VARCHAR(255) | NULLABLE | Path or URL to uploaded evidence image |
| `created_at` | DATETIME | AUTO NOW ADD | Timestamp when report was created |

**Severity Choices:**

| Value | Description |
|-------|-------------|
| `Low` | Minor property issue, no physical harm |
| `Medium` | Moderate theft or property damage |
| `High` | Phone snatching, burglary, physical altercation |
| `Critical` | Assault, weapon involved, serious bodily harm |

**Status Choices:**

| Value | Description |
|-------|-------------|
| `Pending` | Report received, awaiting review |
| `Under Investigation` | Security actively investigating |
| `Resolved` | Case closed and resolved |
| `Dismissed` | Report dismissed (duplicate/false) |

**Indexes:**
- `created_at` (for date-range queries on the dashboard)
- `severity` (for filtering high-risk incidents)
- `status` (for status filter tabs)

---

### 3.4 `alerts_alert`

Stores security broadcast alerts sent to campus patrols and students.

**App:** `apps.alerts`  
**Model:** `Alert`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER | PK, AUTO | Primary key |
| `title` | VARCHAR(200) | NOT NULL | Short alert title |
| `message` | TEXT | NOT NULL | Detailed alert message body |
| `alert_type` | VARCHAR(30) | NOT NULL | HIGH_RISK_ZONE / INCIDENT_BROADCAST / SECURITY_DISPATCH |
| `location_name` | VARCHAR(150) | NULLABLE | Target campus location |
| `is_active` | BOOLEAN | NOT NULL, DEFAULT=True | Whether alert is still active |
| `created_at` | DATETIME | AUTO NOW ADD | Timestamp when alert was broadcast |

**Alert Type Choices:**

| Value | Description |
|-------|-------------|
| `HIGH_RISK_ZONE` | AI-triggered warning for a predicted danger zone |
| `INCIDENT_BROADCAST` | Alert derived from a submitted incident report |
| `SECURITY_DISPATCH` | Notification that a patrol unit has been deployed |

---

## 4. Entity Relationship Diagram (ERD)

```
┌─────────────────────┐         ┌──────────────────────────┐
│     auth_user        │  1   1  │    accounts_userprofile   │
│─────────────────────│◄────────│──────────────────────────│
│ id (PK)             │         │ id (PK)                  │
│ username            │         │ user_id (FK, UNIQUE)     │
│ password            │         │ role                     │
│ email               │         │ phone_number             │
│ is_active           │         │ hall_or_department       │
└─────────────────────┘         └──────────────────────────┘
          │
          │ 1
          │
          ▼ N
┌──────────────────────────────┐
│     incidents_incident        │
│──────────────────────────────│
│ id (PK)                      │
│ incident_id (UNIQUE)         │
│ reporter_id (FK → auth_user) │
│ category                     │
│ description                  │
│ location_name                │
│ latitude                     │
│ longitude                    │
│ severity                     │
│ status                       │
│ image_url                    │
│ created_at                   │
└──────────────────────────────┘

┌──────────────────────────────┐
│       alerts_alert            │
│──────────────────────────────│
│ id (PK)                      │
│ title                        │
│ message                      │
│ alert_type                   │
│ location_name                │
│ is_active                    │
│ created_at                   │
└──────────────────────────────┘
```

> **Note:** The `Prediction` module has no database table — predictions are computed on-demand and returned directly as API responses. Persisting predictions to a `predictions` table is planned for Phase 6.

---

## 5. Database Configuration

### Development (SQLite)
```python
# backend/config/settings.py
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}
```

### Production (PostgreSQL — Phase 6)
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'campusshield_db',
        'USER': 'campusshield_user',
        'PASSWORD': os.environ.get('DB_PASSWORD'),
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```

---

## 6. Migrations

All schema changes are managed through Django migrations:

```bash
# Apply all migrations
cd backend
python manage.py migrate

# Create new migration after model change
python manage.py makemigrations

# View migration history
python manage.py showmigrations
```

---

## 7. Default Seed Data

Run the following to create the default demo users:

```bash
python manage.py shell
```

```python
from django.contrib.auth.models import User
from apps.accounts.models import UserProfile

users = [
    ('admin',     'admin123',    'admin@knust.edu.gh',    'ADMIN'),
    ('security1', 'sec123',      'sec@knust.edu.gh',      'SECURITY'),
    ('student1',  'student123',  'student1@st.knust.edu.gh', 'STUDENT'),
]

for username, password, email, role in users:
    u = User.objects.create_user(username=username, password=password, email=email)
    UserProfile.objects.create(user=u, role=role)

print("Seed data created.")
```

---

*© 2026 Kwame Nkrumah University of Science and Technology, Kumasi, Ghana.*  
*Developed by University Information Technology Services (UITS), KNUST.*
