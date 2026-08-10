# CampusShield AI — Testing Documentation

**Version:** 1.0.0  
**Project:** KNUST Real-Time Crime Hotspot Prediction System  
**Course:** CSM 374 — Mini Project  
**Institution:** Kwame Nkrumah University of Science and Technology, Kumasi, Ghana

---

## 1. Testing Strategy

CampusShield AI uses a layered testing approach covering:

| Layer | Type | Tool |
|-------|------|------|
| AI Model | Unit testing of pipeline functions | Python `unittest` / manual |
| Backend API | Endpoint testing | `curl` / Postman / Django test client |
| Frontend | Component & integration testing | Manual browser testing |
| End-to-End | Full user flow testing | Manual test scripts |

---

## 2. AI Model Tests

### 2.1 Preprocessing Test

**Test:** Verify `load_and_preprocess_data()` returns a non-empty DataFrame with expected columns.

```python
# Run from ai-model/
import unittest
from preprocess import load_and_preprocess_data

class TestPreprocess(unittest.TestCase):
    def test_load_returns_dataframe(self):
        df = load_and_preprocess_data(dataset_dir="../dataset")
        self.assertGreater(len(df), 0)
        self.assertIn('timestamp', df.columns)
        self.assertIn('latitude', df.columns)
        self.assertIn('severity', df.columns)

if __name__ == '__main__':
    unittest.main()
```

**Expected Result:** PASS — DataFrame with 350+ rows and all required columns present.

---

### 2.2 Feature Engineering Test

**Test:** Verify feature extraction produces all required model input columns.

```python
from preprocess import load_and_preprocess_data
from feature_engineering import extract_features

df = load_and_preprocess_data(dataset_dir="../dataset")
df_feat = extract_features(df)

required = ['hour','day_of_week','month','is_night','is_weekend',
            'latitude','longitude','baseline_risk_numeric','target_high_risk']

for col in required:
    assert col in df_feat.columns, f"Missing column: {col}"

print("Feature engineering test: PASS")
```

**Expected Result:** PASS — All 9 required columns present.

---

### 2.3 Prediction Output Test

**Test:** Verify `predict_crime_risk()` returns all expected keys with correct value types.

```python
from predict import predict_crime_risk

result = predict_crime_risk(hour=22, day_of_week=5, month=8,
                             latitude=6.6685, longitude=-1.5610,
                             baseline_risk_numeric=2)

assert 'risk_probability' in result
assert 'risk_level' in result
assert 'is_night' in result
assert 'coordinates' in result
assert isinstance(result['risk_probability'], float)
assert result['risk_level'] in ['High', 'Medium', 'Low']
assert result['is_night'] == 1   # hour=22 is night

print("Prediction test: PASS")
print("Result:", result)
```

**Expected Result:**
```json
{
  "risk_probability": 0.88,
  "risk_level": "High",
  "is_night": 1,
  "coordinates": { "lat": 6.6685, "lng": -1.5610 }
}
```

---

### 2.4 Prediction Test Cases

| Test ID | Hour | Day | Month | Baseline Risk | Expected Level |
|---------|------|-----|-------|---------------|----------------|
| AI-TC-01 | 22 | 5 (Sat) | 8 | 2 (High) | High |
| AI-TC-02 | 10 | 1 (Tue) | 3 | 0 (Low) | Low |
| AI-TC-03 | 23 | 6 (Sun) | 12 | 1 (Medium) | Medium/High |
| AI-TC-04 | 3 | 4 (Fri) | 7 | 2 (High) | High (night) |
| AI-TC-05 | 14 | 2 (Wed) | 5 | 0 (Low) | Low (daytime) |

---

## 3. Backend API Tests

### 3.1 Login Endpoint

**Test ID:** API-TC-01  
**Endpoint:** `POST /api/accounts/login/`

| Scenario | Input | Expected Status | Expected Response |
|----------|-------|-----------------|-------------------|
| Valid credentials | `{"username":"admin","password":"admin123"}` | 200 | `{"message":"Login successful","token":"..."}` |
| Wrong password | `{"username":"admin","password":"wrong"}` | 401 | `{"error":"Invalid credentials"}` |
| Missing fields | `{}` | 400 | `{"error":"..."}` |

**Manual test with curl:**
```bash
curl -X POST http://localhost:8000/api/accounts/login/ \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

---

### 3.2 Incident Submission

**Test ID:** API-TC-02  
**Endpoint:** `POST /api/incidents/`

| Scenario | Expected Status | Expected Response |
|----------|-----------------|-------------------|
| Valid incident data | 201 | `{"incident_id":"INC000X"}` |
| Missing description | 400 | `{"error":"..."}` |
| Invalid latitude | 400 | `{"error":"..."}` |

**Manual test with curl:**
```bash
curl -X POST http://localhost:8000/api/incidents/ \
  -H "Content-Type: application/json" \
  -d '{
    "category": "Phone Snatching",
    "description": "Phone snatched near gate",
    "location_name": "Ayeduase Gate Exit",
    "latitude": 6.6685,
    "longitude": -1.5610,
    "severity": "High"
  }'
```

---

### 3.3 Prediction Endpoint

**Test ID:** API-TC-03  
**Endpoint:** `POST /api/prediction/`

| Scenario | Input | Expected Status | Expected risk_level |
|----------|-------|-----------------|---------------------|
| Night + High baseline | `hour=22, day=5, baseline=2` | 200 | High |
| Day + Low baseline | `hour=10, day=1, baseline=0` | 200 | Low |
| Invalid input type | `hour="abc"` | 400 | error message |

---

### 3.4 Dashboard Stats

**Test ID:** API-TC-04  
**Endpoint:** `GET /api/dashboard/stats/`

```bash
curl http://localhost:8000/api/dashboard/stats/
```

**Expected:** JSON with `total_incidents`, `todays_incidents`, `high_risk_areas_count`, `prediction_accuracy`, `active_alerts_count`, `high_risk_areas`.

---

## 4. Frontend Manual Test Checklist

### 4.1 Authentication

| Test ID | Test Description | Expected Result | Status |
|---------|-----------------|-----------------|--------|
| FE-TC-01 | Login with valid credentials (`admin`/`admin123`) | Redirected to Dashboard | ✅ Pass |
| FE-TC-02 | Login with invalid credentials | Error message "Invalid credentials" shown | ✅ Pass |
| FE-TC-03 | Click "ADMIN" quick-access button | Form auto-fills and logs in | ✅ Pass |
| FE-TC-04 | Click "SECURITY" quick-access button | Logs in as security1 | ✅ Pass |
| FE-TC-05 | Click "STUDENT" quick-access button | Logs in as student1 | ✅ Pass |
| FE-TC-06 | Click Logout from sidebar | Returns to Login page | ✅ Pass |
| FE-TC-07 | Refresh browser while logged in | Stays logged in (localStorage) | ✅ Pass |

---

### 4.2 Dashboard

| Test ID | Test Description | Expected Result | Status |
|---------|-----------------|-----------------|--------|
| FE-TC-08 | Open Dashboard page | 4 stat cards visible | ✅ Pass |
| FE-TC-09 | Leaflet map loads | Campus map renders with coloured risk circles | ✅ Pass |
| FE-TC-10 | Click a map marker | Popup shows location name and risk level | ✅ Pass |
| FE-TC-11 | Bar chart renders | Weekly incident data displayed with axes | ✅ Pass |
| FE-TC-12 | Risk zones table populated | 4 rows with badge indicators | ✅ Pass |

---

### 4.3 Report Incident

| Test ID | Test Description | Expected Result | Status |
|---------|-----------------|-----------------|--------|
| FE-TC-13 | Submit form with all fields | Success alert with ticket ID shown | ✅ Pass |
| FE-TC-14 | Submit without description | Browser validation prevents submission | ✅ Pass |
| FE-TC-15 | Change category dropdown | Selection updates correctly | ✅ Pass |
| FE-TC-16 | Change severity to Critical | Dropdown shows Critical | ✅ Pass |

---

### 4.4 AI Prediction

| Test ID | Test Description | Expected Result | Status |
|---------|-----------------|-----------------|--------|
| FE-TC-17 | Set hour=22, click Run AI Inference | High Risk result shown | ✅ Pass |
| FE-TC-18 | Set hour=10, click Run AI Inference | Low Risk result shown | ✅ Pass |
| FE-TC-19 | Risk gauge renders correctly | Coloured circular gauge matches risk level | ✅ Pass |
| FE-TC-20 | Recommendations list populated | 3–4 bullet recommendations shown | ✅ Pass |

---

### 4.5 Heatmap

| Test ID | Test Description | Expected Result | Status |
|---------|-----------------|-----------------|--------|
| FE-TC-21 | Heatmap page loads | Full-screen Leaflet map with overlays | ✅ Pass |
| FE-TC-22 | Danger zone cards visible | 4 high-risk zones listed | ✅ Pass |
| FE-TC-23 | Safe zone cards visible | 4 safe zones listed | ✅ Pass |

---

### 4.6 Alerts

| Test ID | Test Description | Expected Result | Status |
|---------|-----------------|-----------------|--------|
| FE-TC-24 | Alerts feed loads | 3 mock alerts displayed | ✅ Pass |
| FE-TC-25 | Fill and submit broadcast form | New alert appears at top of feed | ✅ Pass |
| FE-TC-26 | Submit without title | Required field prevents submission | ✅ Pass |

---

### 4.7 Navigation & Routing

| Test ID | Test Description | Expected Result | Status |
|---------|-----------------|-----------------|--------|
| FE-TC-27 | Click all sidebar nav items | Each page loads without error | ✅ Pass |
| FE-TC-28 | Navigate to `/prediction` directly in URL bar | Page loads correctly (React Router) | ✅ Pass |
| FE-TC-29 | Navigate to unknown route `/xyz` | 404 Not Found page displays | ✅ Pass |
| FE-TC-30 | Access `/` without login | Redirected to `/login` | ✅ Pass |

---

### 4.8 Responsive / Mobile

| Test ID | Test Description | Expected Result | Status |
|---------|-----------------|-----------------|--------|
| FE-TC-31 | View on 768px width | Sidebar collapses | ✅ Pass |
| FE-TC-32 | View on 480px width | Cards stack to single column | ✅ Pass |
| FE-TC-33 | Hamburger menu on mobile | Opens/closes sidebar overlay | ✅ Pass |

---

## 5. Known Limitations

| ID | Limitation | Planned Fix |
|----|-----------|-------------|
| LIM-01 | Authentication uses mock tokens, not real JWT | Integrate `djangorestframework-simplejwt` in Phase 6 |
| LIM-02 | Model trained on synthetic data only | Retrain with real KNUST incident data after deployment |
| LIM-03 | No pagination on incident list | Add limit/offset pagination in Phase 6 |
| LIM-04 | Weather and holiday features not yet used in model | Incorporate in Phase 6 feature expansion |
| LIM-05 | Predictions not persisted to DB | Add `Prediction` model and table in Phase 6 |

---

## 6. How to Run the Test Suite

### Backend
```bash
cd backend
python manage.py test
```

### AI Model
```bash
cd ai-model
python -m pytest tests/ -v
# or manually:
python predict.py
```

### Frontend (manual)
```bash
cd frontend
npm run dev
# Then open http://localhost:5173 and run through the checklist above
```

---

*© 2026 Kwame Nkrumah University of Science and Technology, Kumasi, Ghana.*  
*Developed by University Information Technology Services (UITS), KNUST.*
