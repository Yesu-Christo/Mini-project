# Meeting Minutes — Meeting 3

**Project:** CampusShield AI — Real-Time Crime Hotspot Prediction System  
**Meeting Title:** Phase 1 & 2 Review — Backend API, AI Pipeline & Incident Reporting  
**Date:** Monday, 24th February 2026  
**Time:** 2:00 PM – 4:00 PM  
**Venue:** Department of Computer Science, KNUST — Study Room B  
**Course:** CSM 374 — Mini Project  

---

## Attendees

| Name | Role | Present |
|------|------|---------|
| Sie Kofi Eugene | Team Member / Project Lead | ✅ Yes |
| Sumani Alima Mahami | Team Member | ✅ Yes |
| Dr. Oliver Kornyo | Project Supervisor | ✅ Yes |

---

## Agenda

1. Demo of Django backend and AI pipeline progress
2. Review of synthetic dataset quality
3. Incident reporting module discussion
4. Frontend scaffolding progress
5. Problems and blockers
6. Task assignment for Phase 3

---

## Minutes

### 1. Backend Progress Demo

Sie Kofi Eugene demonstrated the progress on the Django backend:

- Django project successfully scaffolded with 5 apps: `accounts`, `incidents`, `prediction`, `alerts`, `dashboard`.
- `UserProfile` model implemented extending Django's built-in `auth_user` with `role`, `phone_number`, and `hall_or_department` fields.
- `Incident` model implemented with all required fields: `incident_id`, `reporter`, `category`, `description`, `location_name`, `latitude`, `longitude`, `severity`, `status`, `image_url`, `created_at`.
- `Alert` model implemented with `title`, `message`, `alert_type`, `location_name`, `is_active`, `created_at`.
- Login and Register endpoints functional at `/api/accounts/login/` and `/api/accounts/register/`.
- Incident CRUD at `/api/incidents/` (GET and POST) working.
- `django-cors-headers` configured to allow all origins for development.
- Django migrations applied and SQLite database seeded with test users.

Dr. Kornyo tested the login endpoint and requested that error messages be more descriptive (e.g. distinguish between "wrong password" and "user not found").

---

### 2. AI Pipeline Progress Demo

Sie Kofi Eugene demonstrated the complete AI pipeline:

- `preprocess.py`: Loads `crime_data.csv` and `knust_locations.csv`, merges on `location_id`, parses timestamps, fills nulls.
- `feature_engineering.py`: Extracts `hour`, `day_of_week`, `month`, `is_night`, `is_weekend`, `baseline_risk_numeric`, `severity_numeric`, and creates the binary `target_high_risk` column.
- `train.py`: Trains `RandomForestClassifier(n_estimators=100)` with 80/20 train-test split. Model accuracy on test set reported at **92.4%**. Model saved as `saved_models/crime_prediction.pkl`.
- `predict.py`: Loads the `.pkl` model, builds a single-row DataFrame from input parameters, runs `predict_proba()`, and returns `risk_probability`, `risk_level`, `is_night`, and `coordinates`.
- `FallbackModel` implemented as a failsafe — uses a rule-based heuristic when scikit-learn is not available.

Dr. Kornyo was impressed with the model accuracy and asked about the risk level thresholds. Sie Kofi Eugene explained:
- **High:** probability ≥ 0.60
- **Medium:** 0.30 ≤ probability < 0.60
- **Low:** probability < 0.30

Dr. Kornyo approved the thresholds and suggested they be documented clearly in the AI documentation.

---

### 3. Synthetic Dataset Review

Sumani Alima Mahami presented the `crime_data.csv` dataset:

- 350 records generated covering all 15 KNUST campus locations.
- Records distributed across all hours of the day, all days of the week, and all months of the year.
- Severity distribution: Low (25%), Medium (40%), High (25%), Critical (10%).
- Night-time incidents (is_night=1) make up approximately 55% of records, reflecting real-world patterns.

The team noted that `weather.csv` and `holidays.csv` were also collected but feature integration is deferred to Phase 6.

---

### 4. Frontend Scaffolding Progress

Sumani Alima Mahami demonstrated the React frontend scaffold:

- React 18 + Vite project initialised with all page components created.
- Login page functional with local state-based authentication.
- Sidebar navigation rendering all 9 pages.
- Basic card, table, and chart components implemented.
- Leaflet map loaded via CDN with hardcoded KNUST location markers.

**Issue raised:** The map was loading via `window.L` (CDN approach) which is fragile and unreliable in some environments. The team agreed this should be migrated to an npm-installed Leaflet package.

---

### 5. Problems Discussed

| Problem | Discussion | Resolution |
|---------|-----------|-----------|
| Frontend not connected to backend API | All page data was hardcoded in local state | Agreed to wire all pages to API in Phase 5 using Axios |
| Leaflet CDN approach brittle | Risk of CDN downtime and no module system benefits | Migrate to `npm install leaflet` — planned for Phase 5 upgrade |
| `django==6.0.7` in requirements.txt did not exist | `pip install` was failing for group members trying to set up | Fixed to `django==4.2.16` (current LTS) |
| Dashboard stats view crashing on empty DB | `Incident.objects.first().created_at.date()` threw `AttributeError` when no incidents existed | Fixed to use `timezone.now().date()` instead |
| No React Router — page switching via `useState` | Browser back/forward buttons didn't work; URLs not shareable with team | Agreed to migrate to `react-router-dom` in Phase 5 upgrade |

---

### 6. Decisions Made

| # | Decision |
|---|---------|
| 1 | AI model accuracy of 92.4% accepted as satisfactory for Phase 1 |
| 2 | Risk thresholds confirmed: High ≥ 0.60, Medium ≥ 0.30, Low < 0.30 |
| 3 | Frontend-to-API wiring deferred to Phase 5 after core pages are complete |
| 4 | Leaflet CDN migration to npm package approved for Phase 5 |
| 5 | Django version corrected to 4.2.16 LTS |
| 6 | React Router to be added in Phase 5 full upgrade |
| 7 | Recharts library selected for dashboard bar charts (replaces hand-rolled div bars) |

---

## Action Items

| Task | Assigned To | Deadline |
|------|------------|---------|
| Complete all 9 frontend page components (Prediction, HeatMap, Alerts, Users, Profile, Settings) | Sumani Alima Mahami | 10th March 2026 |
| Build prediction API endpoint at `/api/prediction/` | Sie Kofi Eugene | 10th March 2026 |
| Build alerts API endpoint at `/api/alerts/` | Sie Kofi Eugene | 10th March 2026 |
| Build dashboard stats endpoint at `/api/dashboard/stats/` | Sie Kofi Eugene | 10th March 2026 |
| Research KNUST brand colours for UI consistency | Sumani Alima Mahami | 10th March 2026 |

---

## Next Meeting

**Scheduled Date:** Monday, 17th March 2026  
**Topic:** Phase 3 & 4 review — Prediction page, GIS heatmap, and full page completion

---

*Minutes recorded by: Sie Kofi Eugene*  
*Approved by: Dr. Oliver Kornyo*

---
*© 2026 Kwame Nkrumah University of Science and Technology, Kumasi, Ghana.*
