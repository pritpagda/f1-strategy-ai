from pydantic import BaseModel, Field


class TrainingRequest(BaseModel):
    year: int
    race_name: str


class LapTimePredictRequest(BaseModel):
    compound: str
    stint: int
    lap_number: int
    tyre_life: int
    track_status: float
    air_temp: float
    track_temp: float
    humidity: float
    wind_speed: float
    fresh_tyre: bool
    team: str
    driver: str


class StrategyRequest(BaseModel):
    current_lap_data: dict
    stint_history: list
    race_progress: float = Field(..., ge=0.0, le=1.0)
