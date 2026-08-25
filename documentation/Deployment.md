# CampusShield AI — Deployment Guide

**Version:** 1.0.0  
**Project:** KNUST Real-Time Crime Hotspot Prediction System  
**Course:** CSM 374 — Mini Project  
**Institution:** Kwame Nkrumah University of Science and Technology, Kumasi, Ghana

---

## 1. System Requirements

### Minimum Local Development Requirements

| Component | Minimum Version |
|-----------|----------------|
| Python | 3.10+ |
| Node.js | 18+ |
| npm | 9+ |
| Git | 2.x |
| OS | Windows 10 / macOS 12 / Ubuntu 20.04 |
| RAM | 4 GB |
| Disk | 500 MB free |

---

## 2. Local Development Setup (Full Stack)

### Step 1 — Clone the Repository

```bash
git clone https://github.com/Yesu-Christo/CampusShield-AI.git
cd CampusShield-AI
```

---

### Step 2 — Train the AI Model (run once)

```bash
cd ai-model
python train.py
```

Expected output:
```
Loading data...
Random Forest Model trained successfully! Accuracy: 92.40%
Model saved to saved_models/crime_prediction.pkl
```

---

### Step 3 — Set Up the Django Backend

```bash
cd ../backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 8000
```

The API will be live at: **http://localhost:8000/api/**

To create demo users (first time only):
```bash
python manage.py shell -c "
from django.contrib.auth.models import User
from apps.accounts.models import UserProfile
users = [('admin','admin123','admin@knust.edu.gh','ADMIN','Dr.','Oliver','Kornyo','Administrator','Administration',''),('security1','sec123','sec@knust.edu.gh','SECURITY','Mr.','Kojo','Mensah','Security Officer','Security Services',''),('student1','student123','student1@st.knust.edu.gh','STUDENT','','Ama','Owusu','','','BSc Computer Science')]
for u,p,e,r,title,first_name,last_name,occupation,department,program in users:
   usr = User.objects.create_user(username=u,password=p,email=e,first_name=first_name,last_name=last_name)
   UserProfile.objects.create(user=usr,role=r,title=title,occupation=occupation,hall_or_department=department,program=program)
print('Users created.')
"
```

---

### Step 4 — Set Up the React Frontend

Open a **new terminal** (keep the Django terminal running):

```bash
cd ../frontend
npm install
npm run dev
```

The app will be live at: **http://localhost:5173**

> The Vite dev server automatically proxies all `/api/` requests to `http://localhost:8000`.

---

### Step 5 — Login

Open **http://localhost:5173** in your browser and log in with:

| Username | Password | Role |
|----------|----------|------|
| admin | admin123 | ADMIN |
| security1 | sec123 | SECURITY |
| student1 | student123 | STUDENT |

Registration also supports `STAFF` and `IT` accounts. Run migrations before creating users so the title, program, occupation, and other-name profile fields are available.

Or click the **ADMIN / SECURITY / STUDENT** quick-access buttons on the login page.

---

## 3. Environment Variables

For production, create a `.env` file in `backend/` and load it via `python-dotenv`:

```env
SECRET_KEY=your-secure-random-secret-key-here
DEBUG=False
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
DB_NAME=campusshield_db
DB_USER=campusshield_user
DB_PASSWORD=your-db-password
DB_HOST=localhost
DB_PORT=5432
```

> **Never commit the `.env` file.** It is already listed in `.gitignore`.

---

## 4. Production Deployment (Recommended: Render + Vercel)

### 4.1 Backend — Deploy to Render (Free Tier)

1. Push the repo to GitHub: `https://github.com/Yesu-Christo/CampusShield-AI`
2. Go to [https://render.com](https://render.com) → New → Web Service
3. Connect your GitHub repo
4. Configure:

| Setting | Value |
|---------|-------|
| Root Directory | `backend` |
| Runtime | Python 3 |
| Build Command | `pip install -r requirements.txt` |
| Start Command | `gunicorn config.wsgi:application` |
| Environment | Add `SECRET_KEY`, `DEBUG=False`, `ALLOWED_HOSTS` |

5. Add `gunicorn` to `requirements.txt`:
   ```
   gunicorn==21.2.0
   ```

6. Update `settings.py` for production:
   ```python
   import os
   SECRET_KEY = os.environ.get('SECRET_KEY')
   DEBUG = os.environ.get('DEBUG', 'False') == 'True'
   ALLOWED_HOSTS = os.environ.get('ALLOWED_HOSTS', '').split(',')
   CORS_ALLOW_ALL_ORIGINS = False
   CORS_ALLOWED_ORIGINS = ['https://your-frontend-domain.vercel.app']
   ```

---

### 4.2 Frontend — Deploy to Vercel (Free Tier)

1. Go to [https://vercel.com](https://vercel.com) → New Project
2. Import from GitHub → select `CampusShield-AI`
3. Configure:

| Setting | Value |
|---------|-------|
| Root Directory | `frontend` |
| Framework Preset | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist` |

4. Add environment variable:
   ```
   VITE_API_BASE_URL=https://your-render-backend.onrender.com/api
   ```

5. Update `frontend/src/services/api.js`:
   ```js
   const api = axios.create({
     baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
   });
   ```

6. Update `vite.config.js` to only proxy in development:
   ```js
   server: {
     proxy: process.env.NODE_ENV === 'development' ? {
       '/api': { target: 'http://localhost:8000', changeOrigin: true }
     } : {}
   }
   ```

---

## 5. Demo-Only Mode (No Backend Required)

The frontend includes built-in fallback data for all pages — the app is fully functional for demonstration purposes without running the Django backend. Simply run:

```bash
cd frontend
npm install
npm run dev
```

All API calls gracefully fall back to hardcoded mock data when the backend is unreachable.

---

## 6. Build for Production (Static Files)

```bash
cd frontend
npm run build
# Output: frontend/dist/
```

Serve the `dist/` folder with any static file host (Nginx, Vercel, Netlify, GitHub Pages).

---

## 7. Project Port Reference

| Service | Port | URL |
|---------|------|-----|
| React Frontend (dev) | 5173 | http://localhost:5173 |
| Django Backend | 8000 | http://localhost:8000 |
| Django Admin Panel | 8000 | http://localhost:8000/admin/ |

---

## 8. Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| `ModuleNotFoundError: No module named 'sklearn'` | Run `pip install scikit-learn` |
| `django.db.utils.OperationalError: no such table` | Run `python manage.py migrate` |
| Map not rendering | Leaflet requires a DOM element — ensure the component is mounted before initialization |
| CORS error in browser | Confirm `django-cors-headers` is installed and `CORS_ALLOW_ALL_ORIGINS = True` in `settings.py` |
| `npm run dev` — port 5173 already in use | Run `npm run dev -- --port 5174` |
| AI model not found | Run `python train.py` from the `ai-model/` directory |

---

*© 2026 Kwame Nkrumah University of Science and Technology, Kumasi, Ghana.*  
*Developed by University Information Technology Services (UITS), KNUST.*
