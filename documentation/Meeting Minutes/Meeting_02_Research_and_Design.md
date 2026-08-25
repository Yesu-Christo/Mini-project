# Meeting Minutes — Meeting 2

**Project:** CampusShield AI — Real-Time Crime Hotspot Prediction System  
**Meeting Title:** Research Findings, System Design & Architecture  
**Date:** Monday, 10th February 2026  
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

1. Review of research findings from both members
2. ML algorithm selection and justification
3. Database design and entity review
4. System architecture diagram
5. Dataset planning
6. Task assignment for Phase 1 development

---

## Minutes

### 1. Research Findings Review

**Sie Kofi Eugene** presented findings from his research on ML algorithms for crime prediction:

- Reviewed published work on predictive policing systems including PredPol (USA) and SafeCity (India).
- Compared three candidate algorithms on tabular spatial-temporal data:
  - **Random Forest:** Ensemble method, handles mixed feature types well, resistant to overfitting, produces probability outputs — best suited for this use case.
  - **Decision Tree:** Simpler but prone to overfitting on small datasets.
  - **Gradient Boosting (XGBoost):** High accuracy but requires more tuning and larger datasets.
- Recommended **Random Forest Classifier** as the primary model, with a rule-based fallback for environments without scikit-learn.

Dr. Kornyo agreed with the Random Forest selection and noted that the team should document the justification clearly in the AI documentation.

**Sumani Alima Mahami** presented the compiled list of 15 KNUST campus locations:

- Locations were sourced from Google Maps and verified against KNUST campus layout.
- Each location was given a `location_id` (LOC001–LOC015), GPS coordinates (latitude/longitude), and a baseline risk level (Low / Medium / High) based on known incident patterns and campus geography.
- High-risk locations identified: Unity Hall (Conti), University Hall (Katanga), Brunei Hostels Pathway, Ayeduase Gate Exit.
- Low-risk locations identified: KNUST Main Library, College of Science Complex, Faculty of Law Quadrangle, Great Hall Forecourt.

---

### 2. Dataset Design

The team agreed on the following synthetic dataset structure to train the model:

- **350 records** covering all 15 locations, spanning different times of day, days of week, and months.
- Features to include: `timestamp`, `location_id`, `category`, `severity`, `baseline_risk`, `latitude`, `longitude`.
- A separate `knust_locations.csv` to store location metadata.
- `weather.csv` and `holidays.csv` to be collected for potential use in Phase 6.

Sumani Alima Mahami volunteered to generate the synthetic `crime_data.csv` dataset.

---

### 3. System Architecture Decision

The team presented and agreed on a three-tier architecture:

```
Frontend (React + Vite) → REST API (Django) → SQLite DB
                                  ↕
                         AI Model (Python / sklearn)
```

Key architectural decisions made:
- The AI model will live in a separate `ai-model/` directory and be called by the Django backend at runtime via `sys.path` injection.
- The frontend will communicate with the backend exclusively through `/api/` endpoints.
- Vite's proxy feature will forward all `/api/` calls from port 5173 to the Django backend on port 8000 during development.

---

### 4. Database Design

The team agreed on the following core tables:

| Table | App | Purpose |
|-------|-----|---------|
| `auth_user` | Django built-in | Core user accounts |
| `accounts_userprofile` | accounts | Role extension (STUDENT / STAFF / SECURITY / ADMIN / IT), academic and professional identity details |
| `incidents_incident` | incidents | Crime incident reports |
| `alerts_alert` | alerts | Security broadcast alerts |

Dr. Kornyo noted that a `predictions` table was not strictly necessary for Phase 1 since predictions are computed on-demand and returned as API responses. This was deferred to Phase 6.

---

### 5. Problems Discussed

| Problem | Discussion | Resolution |
|---------|-----------|-----------|
| Dataset size — only 350 records may limit model accuracy | Discussed whether to increase to 1000 records | Agreed to keep 350 for Phase 1; focus on feature quality over volume |
| GPS coordinates for KNUST may not be perfectly accurate | Google Maps coordinates have minor variance | Accepted as sufficient for prototype; real GPS data to come from live incident reports |
| Two-person team covering full stack | Risk of uneven workload | Sie Kofi Eugene to lead backend + AI; Sumani Alima Mahami to lead frontend + documentation |

---

### 6. Decisions Made

| # | Decision |
|---|---------|
| 1 | **Random Forest Classifier** selected as the primary ML algorithm |
| 2 | Rule-based `FallbackModel` to be implemented for environments without scikit-learn |
| 3 | Synthetic dataset of 350 records across 15 KNUST locations approved |
| 4 | Three-tier architecture confirmed (React → Django → SQLite + AI Model) |
| 5 | Work division: Sie Kofi Eugene (backend, AI model); Sumani Alima Mahami (frontend, dataset, documentation) |
| 6 | GitHub repository to be used for collaboration with branch-based workflow |

---

## Action Items

| Task | Assigned To | Deadline |
|------|------------|---------|
| Generate `crime_data.csv` synthetic dataset (350 records) | Sumani Alima Mahami | 17th February 2026 |
| Set up Django project structure with all 5 apps | Sie Kofi Eugene | 17th February 2026 |
| Implement `preprocess.py` and `feature_engineering.py` | Sie Kofi Eugene | 17th February 2026 |
| Scaffold React + Vite frontend with routing skeleton | Sumani Alima Mahami | 17th February 2026 |
| Create ERD diagram and Database Design document | Both members | 17th February 2026 |

---

## Next Meeting

**Scheduled Date:** Monday, 24th February 2026  
**Topic:** Phase 1 progress review — backend setup, AI pipeline, and frontend scaffolding

---

*Minutes recorded by: Sumani Alima Mahami*  
*Approved by: Dr. Oliver Kornyo*

---
*© 2026 Kwame Nkrumah University of Science and Technology, Kumasi, Ghana.*
