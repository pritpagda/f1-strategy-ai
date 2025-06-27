import pandas as pd
import numpy as np
import re


def engineer_features(df: pd.DataFrame) -> pd.DataFrame:
    df.columns = [re.sub(r'(?<=[a-z])(?=[A-Z])', '_', col).lower() for col in df.columns]

    df['lap_time_seconds'] = pd.to_numeric(df['lap_time_seconds'], errors='coerce')
    for col in ['compound', 'driver', 'team']:
        if col in df.columns:
            df[col] = df[col].astype('category')

    df['rolling_avg_lap_time'] = df.groupby('driver')['lap_time_seconds'].transform(
        lambda x: x.rolling(window=3, min_periods=1).mean()
    )
    df['delta_to_rolling_avg'] = df['lap_time_seconds'] - df['rolling_avg_lap_time']
    df['lap_number_in_stint'] = df.groupby(['driver', 'stint']).cumcount() + 1

    if 'track_temp' in df.columns:
        avg_temp = df['track_temp'].mean()
        df['track_temp_delta_avg'] = df['track_temp'] - avg_temp
    else:
        df['track_temp_delta_avg'] = np.nan

    df = pd.get_dummies(df, columns=['compound', 'team'], drop_first=True)

    if 'track_status' in df.columns:
        df['track_status_numeric'] = pd.to_numeric(df['track_status'].astype(str), errors='coerce')
        df.drop(columns=['track_status'], inplace=True)
    elif 'track_status_numeric' not in df.columns:
        df['track_status_numeric'] = np.nan

    df.rename(columns={'humidity': 'humidity_percent'}, inplace=True)

    final_columns = [
                        'lap_time_seconds',
                        'rolling_avg_lap_time',
                        'delta_to_rolling_avg',
                        'tyre_life',
                        'lap_number_in_stint',
                        'track_temp_delta_avg',
                        'track_status_numeric',
                        'air_temp',
                        'humidity_percent',
                        'wind_speed',
                        'driver',
                        'lap_number',
                        'stint',
                        'fresh_tyre',
                        'lap_timestamp',
                    ] + [col for col in df.columns if col.startswith('compound_') or col.startswith('team_')]

    return df[[col for col in final_columns if col in df.columns]].copy()
