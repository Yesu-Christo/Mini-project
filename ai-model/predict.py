import os
import pickle
import pandas as pd
import numpy as np

# Needed for unpickling FallbackModel if scikit-learn is not installed
class FallbackModel:
    def predict_proba(self, X_input):
        probs = []
        for _, row in X_input.iterrows():
            score = (row["is_night"] * 0.4) + (row["baseline_risk_numeric"] * 0.2) + (row["is_weekend"] * 0.15) + 0.1
            prob = min(max(score, 0.05), 0.95)
            probs.append([1 - prob, prob])
        return np.array(probs)
        
    def predict(self, X_input):
        return (self.predict_proba(X_input)[:, 1] > 0.5).astype(int)

def predict_crime_risk(hour=22, day_of_week=5, month=8, latitude=6.6738, longitude=-1.5684, baseline_risk_numeric=2):
    dir_path = os.path.dirname(os.path.abspath(__file__))
    model_path = os.path.join(dir_path, "saved_models", "crime_prediction.pkl")
    if not os.path.exists(model_path):
        model_path = os.path.join(dir_path, "crime_prediction.pkl")
        
    with open(model_path, "rb") as f:
        model = pickle.load(f)
        
    is_night = 1 if (hour >= 19 or hour <= 5) else 0
    is_weekend = 1 if day_of_week >= 5 else 0
    
    input_data = pd.DataFrame([{
        "hour": hour,
        "day_of_week": day_of_week,
        "month": month,
        "is_night": is_night,
        "is_weekend": is_weekend,
        "latitude": latitude,
        "longitude": longitude,
        "baseline_risk_numeric": baseline_risk_numeric
    }])
    
    if hasattr(model, "predict_proba"):
        prob = model.predict_proba(input_data)[0][1]
    else:
        prob = 0.65
        
    risk_level = "High" if prob >= 0.6 else "Medium" if prob >= 0.3 else "Low"
    
    return {
        "risk_probability": round(float(prob), 4),
        "risk_level": risk_level,
        "is_night": is_night,
        "coordinates": {"lat": latitude, "lng": longitude}
    }

if __name__ == "__main__":
    res = predict_crime_risk()
    print("Prediction Result:", res)
