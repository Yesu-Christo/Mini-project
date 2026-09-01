# CampusShield-AI Quick Start Guide

## 🚀 Running the Application

### Prerequisites
- Python 3.13
- Node.js & npm
- Virtual environment activated: `.venv\Scripts\Activate.ps1`

### Option 1: Run Locally (Current Setup)

#### Terminal 1 - Start Backend:
```bash
cd backend
python manage.py runserver
```
Expected output:
```
Starting development server at http://127.0.0.1:8000/
```

#### Terminal 2 - Start Frontend:
```bash
cd frontend
npm run dev
```
Expected output:
```
VITE v5.4.21 ready in 1297 ms
➜ Local: http://localhost:5173/
```

#### Access Application:
- **Frontend**: http://localhost:5173/
- **Backend API**: http://127.0.0.1:8000/
- **Django Admin**: http://127.0.0.1:8000/admin/

### Demo Login Credentials
Click the demo buttons on login page:
- **Admin**: ADM001 / admin123
- **Security**: SEC001 / sec123
- **Student**: STU001 / stu123
- **Staff**: STF001 / stf123
- **IT**: IT001 / it123

---

## 📊 Key Pages & URLs

| Feature | URL | Purpose |
|---------|-----|---------|
| Dashboard | http://localhost:5173/ | Real-time metrics and overview |
| Report Incident | http://localhost:5173/report | Submit new incident |
| Incident History | http://localhost:5173/incidents | View all reported incidents |
| AI Predictions | http://localhost:5173/prediction | Run risk prediction model |
| Crime Heatmap | http://localhost:5173/heatmap | Visualize crime hotspots |
| Live Alerts | http://localhost:5173/alerts | View active alerts |
| User Management | http://localhost:5173/users | Manage user accounts |

---

## 🔄 Database Management

### Clear All Data (Reset):
```bash
cd backend
python manage.py shell -c "
from apps.incidents.models import Incident
from apps.alerts.models import Alert, Notification
Incident.objects.all().delete()
Alert.objects.all().delete()
Notification.objects.all().delete()
print('✅ Database cleared')
"
```

### View Data:
```bash
cd backend
python manage.py shell -c "
from apps.incidents.models import Incident
print(f'Incidents: {Incident.objects.count()}')
"
```

### Create Superuser (if needed):
```bash
cd backend
python manage.py createsuperuser
```

---

## 📝 Testing Workflow

### 1. Submit a Test Incident:
1. Go to http://localhost:5173/report
2. Select category: "Phone Snatching"
3. Select location: "Brunei Hostels"
4. Set severity: "High"
5. Add description
6. Click "Submit Report"

### 2. Verify in Dashboard:
1. Go to http://localhost:5173/
2. Check "Total Incidents" (should increment)
3. Check "Today's Incidents"
4. Verify incident appears on map

### 3. Test Predictions:
1. Go to http://localhost:5173/prediction
2. Select same location
3. Click "Run AI Inference"
4. View risk prediction output

### 4. Check Incident History:
1. Go to http://localhost:5173/incidents
2. Verify incident appears in table
3. Check status and details

---

## 🐛 Troubleshooting

### Backend Connection Issues
**Problem**: Frontend shows 401 Unauthorized errors

**Solutions**:
1. Restart backend: `Ctrl+C` then `python manage.py runserver`
2. Check CORS settings in `backend/config/settings.py`
3. Verify ALLOWED_HOSTS includes `localhost:5173`

### Frontend Not Loading
**Problem**: http://localhost:5173 shows connection refused

**Solutions**:
1. Check if Vite server is running (should show "Local:" message)
2. Clear browser cache: `Ctrl+Shift+Delete` → Clear all
3. Restart Vite: `npm run dev`

### Database Issues
**Problem**: "database is locked" error

**Solutions**:
1. Kill any running Django processes
2. Delete `db.sqlite3` and run migrations: `python manage.py migrate`
3. Restart backend server

### Port Already in Use
**Problem**: "Address already in use" error

**Solutions**:
```bash
# Find process using port 8000
netstat -ano | findstr :8000

# Kill process (replace PID)
taskkill /PID <PID> /F
```

---

## 📦 Production Deployment

### Using Vercel (Frontend):
```bash
cd frontend
npm run build
vercel deploy
```

### Using Gunicorn (Backend):
```bash
cd backend
gunicorn config.wsgi -b 0.0.0.0:8000
```

### Environment Variables (.env):
Create `.env` file in backend directory:
```
DEBUG=False
SECRET_KEY=your-secret-key-here
ALLOWED_HOSTS=yourdomain.com,api.yourdomain.com
CORS_ALLOWED_ORIGINS=https://yourdomain.com
DATABASE_URL=postgresql://user:password@localhost/dbname
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
```

---

## 📚 Important Files

### Backend Configuration:
- `backend/config/settings.py` - Django settings
- `backend/config/urls.py` - API routes
- `backend/requirements.txt` - Python dependencies
- `backend/db.sqlite3` - Database

### Frontend Configuration:
- `frontend/vite.config.js` - Vite build config
- `frontend/src/services/api.js` - API client
- `frontend/package.json` - npm dependencies
- `frontend/vercel.json` - Vercel deployment config

### Documentation:
- `RESET_CHECKLIST.md` - Database reset procedure
- `APPLICATION_REVIEW.md` - Full system review
- `README.md` - Project overview

---

## 🆘 Support

For issues:
1. Check the error messages in browser console (F12)
2. Check backend logs in terminal
3. Review `APPLICATION_REVIEW.md` for detailed documentation
4. Check Django admin at http://127.0.0.1:8000/admin/

---

**Last Updated**: September 1, 2026  
**Status**: ✅ Ready for Production
