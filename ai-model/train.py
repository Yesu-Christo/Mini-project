import os
import json
import pickle
import numpy as np
import pandas as pd
from preprocess import load_and_preprocess_data
from feature_engineering import extract_features

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

def train_model():
    print("Loading data...")
    df = load_and_preprocess_data(dataset_dir="../dataset")
    df_feat = extract_features(df)
    
    feature_cols = ["hour", "day_of_week", "month", "is_night", "is_weekend", "latitude", "longitude", "baseline_risk_numeric"]
    X = df_feat[feature_cols].fillna(0)
    y = df_feat["target_high_risk"]
    
    try:
        from sklearn.ensemble import RandomForestClassifier
        from sklearn.model_selection import train_test_split
        from sklearn.metrics import accuracy_score
        
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        model = RandomForestClassifier(n_estimators=100, random_state=42)
        model.fit(X_train, y_train)
        
        preds = model.predict(X_test)
        acc = accuracy_score(y_test, preds)
        print(f"Random Forest Model trained successfully! Accuracy: {acc * 100:.2f}%")
    except ImportError:
        print("scikit-learn not found. Using Fallback AI Model.")
        model = FallbackModel()
        acc = None
    
    save_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "saved_models")
    os.makedirs(save_dir, exist_ok=True)
    model_path = os.path.join(save_dir, "crime_prediction.pkl")
    
    with open(model_path, "wb") as f:
        pickle.dump(model, f)

    with open(os.path.join(save_dir, "metrics.json"), "w", encoding="utf-8") as f:
        json.dump({'accuracy': acc}, f)
    
    # Save a copy in root ai-model
    root_pkl = os.path.join(os.path.dirname(os.path.abspath(__file__)), "crime_prediction.pkl")
    with open(root_pkl, "wb") as f:
        pickle.dump(model, f)
        
    print(f"Model saved to {model_path} and {root_pkl}")

if __name__ == "__main__":
    train_model()
