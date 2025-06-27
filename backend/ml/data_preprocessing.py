import os
import pandas as pd
import fastf1


def fetch_and_clean_f1_data(year: int, gp: str, session_type: str) -> pd.DataFrame:
    cache_dir = os.path.join(os.path.dirname(__file__), 'data', 'cache')
    os.makedirs(cache_dir, exist_ok=True)
    fastf1.Cache.enable_cache(cache_dir)

    session = fastf1.get_session(year, gp, session_type)
    session.load(laps=True, telemetry=True)

    start_time = session.date
    if start_time is None:
        return pd.DataFrame()

    laps = session.laps
    valid_laps = laps[
        (laps['LapTime'].notna()) &
        (laps['IsAccurate']) &
        (laps['PitOutTime'].isna()) &
        (laps['PitInTime'].isna()) &
        (laps['TrackStatus'] == '1')
        ].copy()

    valid_laps['LapTimeSeconds'] = valid_laps['LapTime'].dt.total_seconds()
    valid_laps['LapTimestamp'] = start_time + valid_laps['LapStartTime']

    df = valid_laps[[
        'LapNumber', 'Stint', 'Driver', 'Compound', 'TyreLife',
        'LapTimeSeconds', 'Team', 'TrackStatus', 'FreshTyre', 'LapTimestamp'
    ]].copy()

    weather = getattr(session, 'weather_data', pd.DataFrame())
    if not weather.empty:
        weather = weather[['Time', 'AirTemp', 'TrackTemp', 'Humidity', 'WindSpeed']].copy()
        weather['WeatherTimestamp'] = start_time + weather['Time']

        df.sort_values('LapTimestamp', inplace=True)
        weather.sort_values('WeatherTimestamp', inplace=True)

        df = pd.merge_asof(
            df,
            weather.drop(columns='Time'),
            left_on='LapTimestamp',
            right_on='WeatherTimestamp',
            direction='nearest'
        ).drop(columns='WeatherTimestamp')
    else:
        for col in ['AirTemp', 'TrackTemp', 'Humidity', 'WindSpeed']:
            df[col] = pd.NA

    return df
