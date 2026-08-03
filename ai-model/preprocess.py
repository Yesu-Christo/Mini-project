import pandas as pd
import os

def load_and_preprocess_data(dataset_dir="dataset"):
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    target_dir = os.path.join(base_dir, "dataset")
    if not os.path.exists(target_dir):
        target_dir = os.path.abspath(dataset_dir)
    
    crime_path = os.path.join(target_dir, "crime_data.csv")
    loc_path = os.path.join(target_dir, "knust_locations.csv")
    
    crime_df = pd.read_csv(crime_path)
    loc_df = pd.read_csv(loc_path)
    
    # Merge crime data with location details
    df = pd.merge(crime_df, loc_df, on="location_id", how="left", suffixes=('_crime', '_location'))
    
    # Convert timestamp
    df["timestamp"] = pd.to_datetime(df["timestamp"])
    
    # Clean nulls
    if "severity" in df.columns:
        df["severity"] = df["severity"].fillna("Medium")
    if "category_crime" in df.columns:
        df["category"] = df["category_crime"].fillna("Other")
    
    return df

if __name__ == "__main__":
    df = load_and_preprocess_data()
    print(f"Preprocessed {len(df)} rows. Columns: {list(df.columns)}")
