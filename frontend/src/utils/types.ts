export interface PredictionData {
    compound: string;
    stint: number;
    lap_number: number;
    tyre_life: number;
    track_status: number;
    air_temp: number;
    track_temp: number;
    humidity: number;
    wind_speed: number;
    fresh_tyre: boolean;
    team: string;
    driver: string;
}

export const defaultPredictionData: PredictionData = {
  compound: '',
  stint: 0,
  lap_number: 0,
  tyre_life: 0,
  track_status: 0,
  air_temp: 0,
  track_temp: 0,
  humidity: 0,
  wind_speed: 0,
  fresh_tyre: true,
  team: '',
  driver: '',
};


export interface CurrentLapData {
  lap_number: number;
  compound: string;
  tyre_life: number;
  lap_pace: number;
  driver: string;
  stint: number;
}

export interface StintLapData {
  lap: number;
  compound: string;
  tyre_life: number;
  lap_pace: number;
  track_status: number;
}

export interface StrategyData {
  current_lap_data: CurrentLapData;
  stint_history: StintLapData[];
  race_progress: number; // from 0 to 1
}


export interface StrategyResult {
  recommendation: string;
  reasoning: string;
  confidence: 'high' | 'medium' | 'low';
}

