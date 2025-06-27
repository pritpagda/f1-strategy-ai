import os
import joblib
import pandas as pd

LAP_TIME_MODEL = None
MODEL_FEATURES = []

MODEL_PATH = os.path.join(
    os.path.dirname(os.path.abspath(__file__)),
    'models',
    'f1_laptime_model.joblib'
)


def load_model():
    global LAP_TIME_MODEL, MODEL_FEATURES
    try:
        LAP_TIME_MODEL = joblib.load(MODEL_PATH)
        MODEL_FEATURES = list(getattr(LAP_TIME_MODEL, 'feature_names_in_', []))
    except Exception:
        LAP_TIME_MODEL = None
        MODEL_FEATURES = []


def prepare_features(input_data: dict) -> pd.DataFrame:
    if LAP_TIME_MODEL is None:
        raise RuntimeError("Model is not loaded.")

    df = pd.DataFrame([input_data])

    if 'fresh_tyre' in df.columns:
        df['fresh_tyre'] = df['fresh_tyre'].astype(int)

    for comp in ['HARD', 'MEDIUM', 'SOFT']:
        df[f'compound_{comp}'] = (df.get('compound', '').str.upper() == comp).astype(int)
    df.drop(columns=['compound'], inplace=True, errors='ignore')

    teams = [
        'AlphaTauri', 'Alpine', 'Aston Martin', 'Ferrari', 'Haas F1 Team',
        'McLaren', 'Mercedes', 'Red Bull Racing', 'Williams'
    ]
    team_col = df.get('team', '').fillna('').astype(str)
    for team in teams:
        col_name = f'team_{team.replace(" ", "")}'
        df[col_name] = (team_col == team).astype(int)
    df.drop(columns=['team'], inplace=True, errors='ignore')

    if 'track_status' in df.columns:
        df['trackstatus_numeric'] = pd.to_numeric(df['track_status'], errors='coerce').fillna(0)
        df.drop(columns=['track_status'], inplace=True)

    if not MODEL_FEATURES:
        raise RuntimeError("Model features missing.")

    for feature in MODEL_FEATURES:
        if feature not in df.columns:
            df[feature] = 0

    for col in MODEL_FEATURES:
        df[col] = pd.to_numeric(df[col], errors='coerce').fillna(0)

    return df[MODEL_FEATURES].copy()


def predict_lap_time(input_data: dict) -> float:
    if LAP_TIME_MODEL is None:
        load_model()
    if LAP_TIME_MODEL is None:
        raise RuntimeError("Model could not be loaded.")
    features = prepare_features(input_data)
    prediction = LAP_TIME_MODEL.predict(features)
    return float(prediction[0])
