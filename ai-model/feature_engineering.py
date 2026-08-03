import pandas as pd
import numpy as np

def extract_features(df):
    df_feat = df.copy()
    
    # Extract temporal features
    df_feat["hour"] = df_feat["timestamp"].dt.hour
    df_feat["day_of_week"] = df_feat["timestamp"].dt.dayofweek
    df_feat["month"] = df_feat["timestamp"].dt.month
    df_feat["is_night"] = df_feat["hour"].apply(lambda h: 1 if (h >= 19 or h <= 5) else 0)
    df_feat["is_weekend"] = df_feat["day_of_week"].apply(lambda d: 1 if d >= 5 else 0)
    
    # Encoding high risk categories
    severity_map = {"Low": 1, "Medium": 2, "High": 3, "Critical": 4}
    df_feat["severity_numeric"] = df_feat["severity"].map(severity_map).fillna(2)
    
    risk_map = {"Low": 0, "Medium": 1, "High": 2}
    df_feat["baseline_risk_numeric"] = df_feat["baseline_risk"].map(risk_map).fillna(1)
    
    # Target variable: High Risk Incident (severity >= 3 or baseline risk High at night)
    df_feat["target_high_risk"] = ((df_feat["severity_numeric"] >= 3) | 
                                   ((df_feat["baseline_risk_numeric"] == 2) & (df_feat["is_night"] == 1))).astype(int)
    
    return df_feat
