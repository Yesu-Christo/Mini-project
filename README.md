# CampusShield AI 🛡️
### Real-Time Crime Hotspot Prediction System — KNUST

> A full-stack AI-powered campus security platform built with React, Django REST Framework, and a Random Forest machine learning model trained on synthetic KNUST spatial-temporal crime data.

---

## 🗂️ Project Structure
```
CampusShield-AI/
├── frontend/         # React + Vite SPA (Port 5173)
├── backend/          # Django REST API (Port 8000)
├── ai-model/         # ML Pipeline (preprocess → train → predict)
├── dataset/          # KNUST crime, location, weather, holiday CSVs
├── documentation/    # Project Plan, API Docs, DB Design
└── design/           # UI mockups, ERDs, Architecture diagrams
```

---

## 🚀 Getting Started

### 1. AI Model — Train the Crime Prediction Model
```bash
cd ai-model
python train.py
# Outputs: saved_models/crime_prediction.pkl
```

### 2. Backend — Django REST API
```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 8000
```
API runs at **http://localhost:8000/api/**

### 3. Frontend — React Application
```bash
cd frontend
npm install
npm run dev
```
App runs at **http://localhost:5173/**

### 4. Deploy the Frontend to Vercel
Create a Vercel project from this repository with **`frontend`** as the root directory. Vercel will detect the Vite build automatically; the included `frontend/vercel.json` keeps React Router routes working on refresh.

Add these environment variables in the Vercel project settings:

```text
VITE_API_BASE_URL=https://<your-deployed-backend-domain>/api
VITE_API_TIMEOUT=10000
VITE_TOKEN_KEY=cs_token
VITE_USER_KEY=cs_user
```

The Django backend must be deployed separately and configured to allow the Vercel domain through CORS and CSRF trusted origins. Do not use the local `VITE_BACKEND_TARGET` value in the Vercel deployment.

---

## 🔑 Default Test Credentials
| Username   | Password    | Role      |
|------------|-------------|-----------|
| admin      | admin123    | Admin     |
| security1  | sec123      | Security  |
| student1   | student123  | Student   |

---

## 📡 API Endpoints
| Endpoint                    | Method | Description                   |
|-----------------------------|--------|-------------------------------|
| `/api/accounts/login/`      | POST   | User login                    |
| `/api/accounts/register/`   | POST   | User registration             |
| `/api/incidents/`           | GET    | List all incidents            |
| `/api/incidents/`           | POST   | Create new incident report    |
| `/api/prediction/`          | POST   | Run AI crime risk prediction  |
| `/api/alerts/`              | GET    | List active alerts            |
| `/api/alerts/`              | POST   | Create broadcast alert        |
| `/api/dashboard/stats/`     | GET    | Dashboard summary statistics  |

---

## 🤖 AI Model
- **Algorithm**: Random Forest Classifier (fallback: rule-based heuristic)
- **Features**: Hour of day, day of week, month, is_night, is_weekend, latitude, longitude, baseline_risk
- **Target**: Binary high-risk incident prediction
- **Dataset**: 350 synthetic KNUST campus incident records across 15 landmark locations

---

## 📋 Development Roadmap
- [x] Phase 1 — Setup React, Django, AI Pipeline & Authentication
- [x] Phase 2 — Incident Reporting (CRUD, GPS, Image Upload)
- [x] Phase 3 — AI Training & Prediction API Integration
- [x] Phase 4 — GIS Campus Map & Crime Heatmap
- [ ] Phase 5 — Analytics Charts & Reports
- [ ] Phase 6 — Testing, Deployment & Presentation

---

## 👥 Team — CSM 374 Mini Project
**KNUST Department of Computer Science**
