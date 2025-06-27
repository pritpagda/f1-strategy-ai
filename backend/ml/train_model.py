import os
import joblib
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor

from .data_preprocessing import fetch_and_clean_f1_data
from .feature_engineering import engineer_features


def train_and_evaluate_model(df: pd.DataFrame):
    exclude = ['lap_time_seconds', 'driver', 'lap_number', 'stint', 'lap_timestamp']
    X = df.drop(columns=[col for col in exclude if col in df.columns])
    y = df['lap_time_seconds']

    X_train, X_test, y_train, _ = train_test_split(X, y, test_size=0.2, random_state=42)

    model = RandomForestRegressor(n_estimators=100, random_state=42, n_jobs=-1)
    model.fit(X_train, y_train)

    model_path = os.path.join('models', 'f1_laptime_model.joblib')
    os.makedirs(os.path.dirname(model_path), exist_ok=True)
    joblib.dump(model, model_path)


def run_training(year: int, race_name: str, session: str):
    raw_df = fetch_and_clean_f1_data(year, race_name, session)
    if raw_df.empty:
        return False

    processed_df = engineer_features(raw_df)
    train_and_evaluate_model(processed_df)
    return True
