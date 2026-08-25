# CampusShield AI — API Documentation

**Version:** 1.0.0  
**Base URL:** `http://localhost:8000/api/`  
**Project:** KNUST Real-Time Crime Hotspot Prediction System  
**Course:** CSM 374 — Mini Project  
**Institution:** Kwame Nkrumah University of Science and Technology, Kumasi, Ghana  
**Developed by:** University Information Technology Services (UITS), KNUST

---

## Overview

The CampusShield AI backend exposes a RESTful JSON API built with Django. All request and response bodies use `application/json`. The API is consumed by the React frontend running on `http://localhost:5173`, with Vite proxying all `/api/` calls to the Django server on port `8000`.

---

## Authentication

> Current implementation uses a demo token. Full JWT integration (via `djangorestframework-simplejwt`) is planned for Phase 6.

| Method | Token Format | Notes |
|--------|-------------|-------|
| POST `/api/accounts/login/` | Returns `mock-jwt-token-for-{username}` | Include in `Authorization: Bearer <token>` header for protected routes |

---

## Endpoints

### 1. Accounts

#### POST `/api/accounts/login/`
Authenticate a user and return a token.

**Request Body:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Success Response `200 OK`:**
```json
{
  "message": "Login successful",
  "token": "mock-jwt-token-for-admin",
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@knust.edu.gh",
    "role": "ADMIN"
  }
}
```

**Error Response `401 Unauthorized`:**
```json
{
  "error": "Invalid credentials"
}
```

---

#### POST `/api/accounts/register/`
Register a new user account.

**Request Body:**
```json
{
  "role": "STUDENT",
  "school_id": "STU100",
  "first_name": "Ama",
  "last_name": "Mensah",
  "other_name": "Akosua",
  "password": "pass1234",
  "email": "ama@st.knust.edu.gh",
  "program": "BSc Computer Science"
}
```

For `STAFF`, `SECURITY`, `ADMIN`, and `IT` accounts, use `title`, `other_name`, `occupation`, and `department` as applicable. Every account requires `first_name`, `last_name`, `school_id`, `email`, and `password`. Students require `program`; `STAFF` and `ADMIN` require `department`.

**Success Response `201 Created`:**
```json
{
  "message": "Registration successful",
  "role": "STUDENT"
}
```

**Error Response `400 Bad Request`:**
```json
{
  "error": "Username already taken"
}
```

**Role options:** `STUDENT` | `STAFF` | `SECURITY` | `ADMIN` | `IT`

---

### 2. Incidents

#### GET `/api/incidents/`
Retrieve all reported incidents ordered by most recent.

**Success Response `200 OK`:**
```json
{
  "incidents": [
    {
      "id": 1,
      "incident_id": "INC0001",
      "category": "Phone Snatching",
      "description": "Phone was snatched near hostel entrance",
      "location_name": "Brunei Hostels",
      "latitude": 6.6810,
      "longitude": -1.5620,
      "severity": "High",
      "status": "Under Investigation",
      "image_url": "",
      "created_at": "2026-07-29 08:30:00"
    }
  ]
}
```

---

#### POST `/api/incidents/`
Submit a new incident report.

**Request Body:**
```json
{
  "category": "Phone Snatching",
  "description": "My phone was snatched at the gate by two individuals on a motorbike.",
  "location_name": "Ayeduase Gate Exit",
  "latitude": 6.6685,
  "longitude": -1.5610,
  "severity": "High",
  "image_url": ""
}
```

**Success Response `201 Created`:**
```json
{
  "message": "Incident reported successfully",
  "incident_id": "INC0006"
}
```

**Category options:** `Phone Snatching` | `Theft` | `Physical Assault` | `Hostel Burglary` | `Vandalism` | `Trespassing` | `Harassment`

**Severity options:** `Low` | `Medium` | `High` | `Critical`

**Status options (system-managed):** `Pending` | `Under Investigation` | `Resolved` | `Dismissed`

---

### 3. AI Crime Risk Prediction

#### POST `/api/prediction/`
Run the Random Forest crime risk inference model for a given location and time.

**Request Body:**
```json
{
  "hour": 22,
  "day_of_week": 5,
  "month": 8,
  "latitude": 6.6685,
  "longitude": -1.5610,
  "baseline_risk_numeric": 2
}
```

| Field | Type | Description |
|-------|------|-------------|
| `hour` | int | Hour of day (0–23) |
| `day_of_week` | int | Day index — 0=Monday, 6=Sunday |
| `month` | int | Month number (1–12) |
| `latitude` | float | Location latitude (KNUST range: 6.66–6.69) |
| `longitude` | float | Location longitude (KNUST range: -1.57 to -1.56) |
| `baseline_risk_numeric` | int | Historical baseline: 0=Low, 1=Medium, 2=High |

**Success Response `200 OK`:**
```json
{
  "status": "success",
  "prediction": {
    "risk_probability": 0.8821,
    "risk_level": "High",
    "is_night": 1,
    "coordinates": {
      "lat": 6.6685,
      "lng": -1.5610
    }
  }
}
```

| Risk Level | Probability Range |
|------------|------------------|
| High       | ≥ 0.60           |
| Medium     | 0.30 – 0.59      |
| Low        | < 0.30           |

**Error Response `400 Bad Request`:**
```json
{
  "error": "invalid literal for int() with base 10: 'abc'"
}
```

---

### 4. Alerts

#### GET `/api/alerts/`
Retrieve all active security alerts.

**Success Response `200 OK`:**
```json
{
  "alerts": [
    {
      "id": 1,
      "title": "High Crime Risk Alert",
      "message": "Increase patrol near Ayeduase Gate after 8 PM.",
      "alert_type": "HIGH_RISK_ZONE",
      "location_name": "Ayeduase Gate",
      "is_active": true,
      "created_at": "2026-07-29 20:10:00"
    }
  ]
}
```

---

#### POST `/api/alerts/`
Broadcast a new security alert.

**Request Body:**
```json
{
  "title": "Phone Snatching Warning",
  "message": "Multiple reports of phone snatching near Brunei Hostels. Patrol team deployed.",
  "alert_type": "INCIDENT_BROADCAST",
  "location_name": "Brunei Hostels"
}
```

**Success Response `201 Created`:**
```json
{
  "message": "Alert created successfully",
  "alert_id": 4
}
```

**Alert type options:** `HIGH_RISK_ZONE` | `INCIDENT_BROADCAST` | `SECURITY_DISPATCH`

---

### 5. Dashboard

#### GET `/api/dashboard/stats/`
Retrieve summary statistics for the main dashboard.

**Success Response `200 OK`:**
```json
{
  "total_incidents": 350,
  "todays_incidents": 5,
  "high_risk_areas_count": 4,
  "prediction_accuracy": "92.4%",
  "active_alerts_count": 3,
  "high_risk_areas": [
    { "name": "Brunei Complex Path",     "risk_level": "High",   "incidents": 42 },
    { "name": "Ayeduase Gate Exit",      "risk_level": "High",   "incidents": 38 },
    { "name": "Unity Hall Backyard",     "risk_level": "High",   "incidents": 29 },
    { "name": "Commercial Area Parking", "risk_level": "Medium", "incidents": 18 }
  ]
}
```

---

## Error Handling

All endpoints return a consistent error format:

```json
{
  "error": "Human-readable error message"
}
```

| HTTP Status | Meaning |
|-------------|---------|
| 200 | Success |
| 201 | Resource created |
| 400 | Bad request / validation error |
| 401 | Unauthorized / invalid credentials |
| 404 | Resource not found |
| 500 | Internal server error |

---

## CORS

The backend has `CORS_ALLOW_ALL_ORIGINS = True` for development. In production this should be restricted to the frontend domain only.

---

## Default Test Credentials

| Username | Password | Role |
|----------|----------|------|
| admin | admin123 | ADMIN |
| security1 | sec123 | SECURITY |
| student1 | student123 | STUDENT |

---

*© 2026 Kwame Nkrumah University of Science and Technology, Kumasi, Ghana.*  
*Developed by University Information Technology Services (UITS), KNUST.*
