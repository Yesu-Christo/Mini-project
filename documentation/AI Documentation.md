# CampusShield AI — AI Model Documentation

**Version:** 1.0.0  
**Algorithm:** Random Forest Classifier (scikit-learn)  
**Project:** KNUST Real-Time Crime Hotspot Prediction System  
**Course:** CSM 374 — Mini Project  
**Institution:** Kwame Nkrumah University of Science and Technology, Kumasi, Ghana

---

## 1. Overview

The CampusShield AI prediction engine is a supervised machine learning pipeline that estimates the probability of a high-risk crime incident occurring at a given campus location during a specific time window. It powers the **AI Predictions** page of the dashboard and the **GIS Heatmap** risk overlays.

The model is a **Random Forest Classifier** trained on synthetic spatial-temporal crime data representing 350 incidents across 15 landmark locations on the KNUST campus.

---

## 2. Pipeline Architecture

```
dataset/crime_data.csv
dataset/knust_locations.csv
        │
        ▼
  preprocess.py          ← Load, merge, clean, parse timestamps
        │
        ▼
  feature_engineering.py ← Extract temporal + spatial features, create target
        │
        ▼
  train.py               ← Train RandomForestClassifier, evaluate, save .pkl
        │
        ▼
  saved_models/
  crime_prediction.pkl   ← Serialized trained model
        │
        ▼
  predict.py             ← Load model, build input row, run inference, return result
        │
        ▼
  backend/apps/prediction/views.py  ← Django API endpoint calls predict.py
```

---

## 3. Dataset

### 3.1 Files

| File | Description |
|------|-------------|
| `dataset/crime_data.csv` | 350 synthetic KNUST campus incident records with timestamp, location, category, and severity |
| `dataset/knust_locations.csv` | 15 KNUST landmark locations with coordinates and baseline risk level |
| `dataset/weather.csv` | Weather data (collected, reserved for Phase 2 feature expansion) |
| `dataset/holidays.csv` | Academic calendar holidays (reserved for Phase 2 feature expansion) |

### 3.2 crime_data.csv Schema

| Column | Type | Description |
|--------|------|-------------|
| `incident_id` | string | Unique incident identifier (e.g. INC0001) |
| `timestamp` | datetime | Date and time of the incident |
| `location_id` | string | Foreign key to knust_locations.csv |
| `category` | string | Crime type (Theft, Assault, Vandalism, etc.) |
| `severity` | string | Low / Medium / High / Critical |
| `baseline_risk` | string | Location's historical risk level |
| `latitude` | float | Incident latitude |
| `longitude` | float | Incident longitude |

### 3.3 knust_locations.csv Schema

| Column | Type | Description |
|--------|------|-------------|
| `location_id` | string | Unique location code (LOC001–LOC015) |
| `location_name` | string | Campus location name |
| `latitude` | float | Location latitude |
| `longitude` | float | Location longitude |
| `baseline_risk` | string | Historical risk: Low / Medium / High |

---

## 4. Preprocessing (`preprocess.py`)

Steps performed:
1. Load `crime_data.csv` and `knust_locations.csv`
2. Merge datasets on `location_id`
3. Parse `timestamp` column to `datetime` type
4. Fill null values with appropriate defaults
5. Return a clean merged DataFrame ready for feature engineering

---

## 5. Feature Engineering (`feature_engineering.py`)

The following features are extracted from the merged dataset:

| Feature | Type | Description |
|---------|------|-------------|
| `hour` | int | Hour of the incident (0–23) |
| `day_of_week` | int | Day index (0=Monday, 6=Sunday) |
| `month` | int | Month number (1–12) |
| `is_night` | binary | 1 if hour ≥ 19 or hour ≤ 5, else 0 |
| `is_weekend` | binary | 1 if day_of_week ≥ 5, else 0 |
| `latitude` | float | Incident latitude |
| `longitude` | float | Incident longitude |
| `baseline_risk_numeric` | int | 0=Low, 1=Medium, 2=High |
| `severity_numeric` | int | 1=Low, 2=Medium, 3=High, 4=Critical |

### Target Variable

```
target_high_risk = 1  if  (severity_numeric >= 3)
                       OR  (baseline_risk_numeric == 2 AND is_night == 1)
               = 0  otherwise
```

This binary target identifies incidents that are classified as **High Risk** events.

---

## 6. Model Training (`train.py`)

### Algorithm
**Random Forest Classifier** — an ensemble of decision trees that aggregates predictions via majority voting, well-suited for tabular datasets with mixed numerical and categorical features.

### Hyperparameters

| Parameter | Value |
|-----------|-------|
| `n_estimators` | 100 |
| `random_state` | 42 |
| `test_size` | 20% |
| `train_size` | 80% |

### Training Process
1. Load and preprocess the dataset
2. Extract features using `feature_engineering.py`
3. Select the 8 input features listed above
4. Fill remaining nulls with 0
5. Split 80% train / 20% test with `train_test_split`
6. Fit `RandomForestClassifier` on training set
7. Evaluate with `accuracy_score` on test set
8. Serialize the model with `pickle` to `saved_models/crime_prediction.pkl`

### Model Performance
- **Reported Accuracy:** ~92.4% on the held-out 20% test split
- **Note:** Performance is measured on synthetic data. Real-world accuracy will vary as live incident data accumulates.

### Fallback Model
If `scikit-learn` is not installed, a `FallbackModel` class is used instead. It computes risk probability using a rule-based heuristic:

```
score = (is_night × 0.4) + (baseline_risk_numeric × 0.2) + (is_weekend × 0.15) + 0.1
probability = clamp(score, 0.05, 0.95)
```

---

## 7. Inference (`predict.py`)

### Input Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `hour` | int | 22 | Hour of day (0–23) |
| `day_of_week` | int | 5 | Day index (0=Monday) |
| `month` | int | 8 | Month number |
| `latitude` | float | 6.6738 | Location latitude |
| `longitude` | float | -1.5684 | Location longitude |
| `baseline_risk_numeric` | int | 2 | Historical baseline (0/1/2) |

### Inference Steps
1. Load `crime_prediction.pkl` from `saved_models/`
2. Derive `is_night` and `is_weekend` from input params
3. Build a single-row `pandas.DataFrame` with all 8 features
4. Call `model.predict_proba()` and extract the positive class probability
5. Map probability to risk level: High ≥ 0.60, Medium ≥ 0.30, Low < 0.30

### Output

```python
{
    "risk_probability": 0.8821,   # float, 0.0–1.0
    "risk_level": "High",          # "High" | "Medium" | "Low"
    "is_night": 1,                 # 1 = night-time, 0 = day-time
    "coordinates": {
        "lat": 6.6685,
        "lng": -1.5610
    }
}
```

---

## 8. Integration with Backend

The Django prediction endpoint (`backend/apps/prediction/views.py`) integrates the AI model by:

1. Adding the `ai-model/` directory to `sys.path` at runtime
2. Importing `predict_crime_risk` from `predict.py`
3. Accepting POST parameters from the frontend
4. Calling `predict_crime_risk()` and returning the JSON result
5. Gracefully falling back to a hardcoded demo result if the model import fails

---

## 9. KNUST Campus Locations Used in Model

| Location ID | Location Name | Baseline Risk |
|-------------|---------------|---------------|
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

## 10. Running the AI Pipeline

```bash
# Step 1 — Train the model (run once)
cd ai-model
python train.py
# Output: saved_models/crime_prediction.pkl

# Step 2 — Test a prediction manually
python predict.py
# Output: {'risk_probability': 0.88, 'risk_level': 'High', ...}
```

---

## 11. Future Improvements (Phase 6)

- Incorporate **weather data** (`dataset/weather.csv`) as additional features
- Incorporate **holiday/academic calendar** data to detect peak risk periods
- Retrain model incrementally as live incident reports accumulate
- Replace Random Forest with a **Gradient Boosting** model (XGBoost/LightGBM) for improved accuracy
- Add **SHAP explainability** to show which features drove a particular prediction
- Implement **time-series forecasting** to predict risk windows 24–48 hours ahead

---

*© 2026 Kwame Nkrumah University of Science and Technology, Kumasi, Ghana.*  
*Developed by University Information Technology Services (UITS), KNUST.*
