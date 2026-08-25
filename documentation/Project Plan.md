# CampusShield AI — Project Plan

**Project Title:** CampusShield AI — Real-Time Crime Hotspot Prediction System  
**Course:** CSM 374 — Mini Project  
**Institution:** Kwame Nkrumah University of Science and Technology (KNUST), Kumasi, Ghana  
**Department:** Department of Computer Science  
**Academic Year:** 2025/2026  
**Version:** 1.0.0

> ⚠️ **Note to team:** Please fill in your names, student IDs, and supervisor name in the Team section below.

---

## 1. Team

| Name | Student ID | Role |
|------|-----------|------|
| [Team Member 1] | [ID] | Project Lead / Full Stack |
| [Team Member 2] | [ID] | Frontend Developer |
| [Team Member 3] | [ID] | Backend Developer |
| [Team Member 4] | [ID] | AI / ML Engineer |
| [Team Member 5] | [ID] | Documentation / Testing |

**Project Supervisor:** [Supervisor Name, Title]

---

## 2. Project Overview

CampusShield AI is a full-stack AI-powered campus security platform designed for KNUST. It uses machine learning to predict crime hotspots across the campus in real time, enabling proactive deployment of security resources.

### Problem Statement
KNUST is a large campus with over 60,000 students. Security incidents — including phone snatching, theft, burglary, and physical assault — are a persistent concern, particularly at night near hostels and peripheral campus gates. Security personnel currently respond reactively. There is no data-driven system to predict where and when incidents are most likely to occur.

### Proposed Solution
A web-based platform that:
- Accepts real-time incident reports from students and security staff
- Uses a trained Random Forest ML model to predict crime risk at any campus location and time
- Visualises hotspots on an interactive GIS map
- Broadcasts security alerts to patrol units
- Provides an analytics dashboard for security management

---

## 3. Objectives

1. Develop a machine learning model trained on KNUST campus spatial-temporal crime data to predict high-risk zones
2. Build a REST API backend using Django to handle incident reporting, user management, predictions, and alerts
3. Build a modern, responsive React frontend dashboard for students, university staff, security personnel, administrators, and IT support
4. Integrate an interactive Leaflet GIS map with colour-coded crime risk overlays
5. Provide a role-based access control system (Student / Staff / Security / Admin / IT)
6. Document the full system for academic submission and future development

---

## 4. System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                       Frontend (React + Vite)                │
│   Login │ Dashboard │ Reports │ Map │ Prediction │ Alerts    │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP /api/ (Axios)
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                   Backend (Django REST API)                   │
│   accounts │ incidents │ prediction │ alerts │ dashboard     │
└────────────────────────┬────────────────────────────────────┘
              ┌──────────┴──────────┐
              ▼                     ▼
┌─────────────────────┐   ┌─────────────────────────────────┐
│   SQLite Database   │   │     AI Model (Python / sklearn)  │
│  Users, Incidents,  │   │  preprocess → train → predict    │
│  Alerts             │   │  crime_prediction.pkl            │
└─────────────────────┘   └─────────────────────────────────┘
```

---

## 5. Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Frontend Framework | React | 18.3.1 |
| Frontend Build Tool | Vite | 5.4.1 |
| Frontend Routing | React Router DOM | 6.x |
| HTTP Client | Axios | latest |
| Charts | Recharts | latest |
| Map | Leaflet (npm) | 1.9.4 |
| Icons | Lucide React | latest |
| Backend Framework | Django | 4.2.16 |
| CORS | django-cors-headers | 4.3.1 |
| Database (dev) | SQLite 3 | built-in |
| ML Algorithm | Random Forest Classifier | scikit-learn 1.3+ |
| Data Processing | pandas, numpy | 2.0+, 1.24+ |
| Serialization | pickle | built-in |
| Version Control | Git / GitHub | 2.x |

---

## 6. Module Breakdown

### Module 1 — Authentication & User Management
| Feature | Description | Status |
|---------|-------------|--------|
| User Login | Authenticate with username and password | ✅ Done |
| Quick Demo Access | One-click login for Admin/Security/Student/Staff/IT | ✅ Done |
| User Registration | Role-specific identity and academic/professional details | ✅ Done |
| Role-Based Access | STUDENT / STAFF / SECURITY / ADMIN / IT roles | ✅ Done |
| Auth Context | Persistent login via localStorage | ✅ Done |
| Protected Routes | Unauthenticated users redirected to login | ✅ Done |
| User Management Page | Admin view of all users with search | ✅ Done |

---

### Module 2 — Incident Reporting
| Feature | Description | Status |
|---------|-------------|--------|
| Report Form | Category, severity, location, description | ✅ Done |
| GPS Coordinates | Manual lat/lng input | ✅ Done |
| Evidence Upload | Image file upload field | ✅ Done |
| API Submission | POST to `/api/incidents/` | ✅ Done |
| Ticket ID | Auto-generated INC#### identifier | ✅ Done |
| Success Feedback | Alert with ticket ID on submission | ✅ Done |
| Incident History | Table with status filter tabs | ✅ Done |
| Status Tracking | Pending / Under Investigation / Resolved | ✅ Done |

---

### Module 3 — AI Crime Risk Prediction Engine
| Feature | Description | Status |
|---------|-------------|--------|
| Data Preprocessing | Load, merge, clean KNUST datasets | ✅ Done |
| Feature Engineering | Temporal + spatial feature extraction | ✅ Done |
| Model Training | Random Forest Classifier (100 trees) | ✅ Done |
| Model Persistence | Saved as `crime_prediction.pkl` | ✅ Done |
| Fallback Model | Rule-based heuristic if sklearn unavailable | ✅ Done |
| Prediction API | POST `/api/prediction/` endpoint | ✅ Done |
| Frontend Inference | Parameter form + risk gauge display | ✅ Done |
| Security Recommendations | Dynamic advice based on risk level | ✅ Done |

---

### Module 4 — Dashboard & Analytics
| Feature | Description | Status |
|---------|-------------|--------|
| Stat Cards | Total incidents, today's incidents, risk zones, accuracy | ✅ Done |
| Weekly Bar Chart | Recharts BarChart with tooltips | ✅ Done |
| Risk Zone Table | Top 4 predicted hotspots | ✅ Done |
| Live API Integration | Dashboard stats from `/api/dashboard/stats/` | ✅ Done |
| Auto Fallback | Mock data if backend unreachable | ✅ Done |

---

### Module 5 — GIS Campus Crime Map
| Feature | Description | Status |
|---------|-------------|--------|
| Interactive Map | Leaflet map centred on KNUST | ✅ Done |
| Risk Zone Circles | Colour-coded overlays (Red/Amber/Green) | ✅ Done |
| Location Popups | Click to see location name + risk level | ✅ Done |
| Heatmap Page | Dedicated full-screen map view | ✅ Done |
| Danger Zone List | Named high-risk zones with descriptions | ✅ Done |
| Safe Zone List | Named safe zones with descriptions | ✅ Done |

---

### Module 6 — Alerts & Notifications
| Feature | Description | Status |
|---------|-------------|--------|
| Alert Feed | Live list of active security alerts | ✅ Done |
| Broadcast Form | Create and send new alerts | ✅ Done |
| Alert Types | HIGH_RISK_ZONE / INCIDENT_BROADCAST / SECURITY_DISPATCH | ✅ Done |
| API Integration | POST/GET `/api/alerts/` | ✅ Done |
| Settings Page | Toggle switches for notification preferences | ✅ Done |

---

## 7. Development Phases & Timeline

| Phase | Description | Status |
|-------|-------------|--------|
| Phase 1 | Project setup, React + Django scaffolding, authentication | ✅ Complete |
| Phase 2 | Incident reporting CRUD, GPS, image upload, API wiring | ✅ Complete |
| Phase 3 | AI model training pipeline + prediction API integration | ✅ Complete |
| Phase 4 | GIS campus map + crime heatmap visualisation | ✅ Complete |
| Phase 5 | Dashboard analytics, charts, alerts system, KNUST branding | ✅ Complete |
| Phase 6 | Real JWT auth, PostgreSQL, live data, deployment, SMS alerts | 🔲 Planned |

---

## 8. KNUST Campus Locations in Dataset

| Location ID | Name | Baseline Risk |
|-------------|------|---------------|
| LOC001 | Unity Hall (Conti) | High |
| LOC003 | University Hall (Katanga) | High |
| LOC010 | Brunei Hostels Pathway | High |
| LOC011 | Ayeduase Gate Exit | High |
| LOC005 | Africa Hall Block B | Medium |
| LOC009 | Commercial Area Parking | Medium |
| LOC007 | KNUST Main Library | Low |
| LOC006 | College of Science Complex | Low |
| LOC012 | Faculty of Law Quadrangle | Low |
| LOC013 | Great Hall Forecourt | Low |

---

## 9. Risk Assessment

| Risk | Impact | Likelihood | Mitigation |
|------|--------|-----------|------------|
| scikit-learn not installed | High | Low | FallbackModel heuristic built in |
| Backend not running | Medium | Medium | Frontend demo fallback data for all pages |
| Small dataset (350 records) | Medium | High | Synthetic data covers 15 locations; real data improves accuracy |
| SQLite in production | High | Low | Migrate to PostgreSQL for Phase 6 |
| No real JWT auth | Medium | High | Mock tokens work for demo; real JWT planned Phase 6 |

---

## 10. Repository

**GitHub:** [https://github.com/Yesu-Christo/CampusShield-AI](https://github.com/Yesu-Christo/CampusShield-AI)

```
CampusShield-AI/
├── frontend/         # React + Vite SPA (Port 5173)
├── backend/          # Django REST API (Port 8000)
├── ai-model/         # ML Pipeline: preprocess → train → predict
├── dataset/          # KNUST crime, location, weather, holiday CSVs
├── documentation/    # All project docs (this folder)
└── design/           # UI mockups, ERDs, Architecture diagrams
```

---

*© 2026 Kwame Nkrumah University of Science and Technology, Kumasi, Ghana.*  
*Developed by University Information Technology Services (UITS), KNUST.*
