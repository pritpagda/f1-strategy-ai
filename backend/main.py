    from fastapi import FastAPI, HTTPException
    from fastapi.middleware.cors import CORSMiddleware
    from models import TrainingRequest, LapTimePredictRequest, StrategyRequest
    from inference import predict_lap_time
    from strategy import get_strategy_recommendation_from_llm
    from validate import validate_and_train

    app = FastAPI()

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:3000"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.get("/")
    async def root():
        return {"message": "Welcome to the F1 Strategy AI API!"}

    @app.post("/api/train")
    async def train_endpoint(request: TrainingRequest):
        if not validate_and_train(request.year, request.race_name, "R"):
            raise HTTPException(status_code=400, detail="Invalid race/session or no data to train.")
        return {"message": "Training completed successfully"}

    @app.post("/api/predict")
    async def predict_lap(request: LapTimePredictRequest):
        try:
            predicted_time = predict_lap_time(request.model_dump())
            return {"predicted_lap_time_seconds": predicted_time}
        except (ValueError, RuntimeError) as e:
            raise HTTPException(status_code=400 if isinstance(e, ValueError) else 500, detail=str(e))
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Unexpected error: {e}")

    @app.post("/api/strategy")
    async def get_strategy_recommendation(request: StrategyRequest):
        try:
            result = get_strategy_recommendation_from_llm(
                current_lap_data=request.current_lap_data,
                stint_history=request.stint_history,
                race_progress=request.race_progress
            )
            return {
                "recommendation": result.get("recommendation", "No recommendation generated."),
                "reasoning": f"AI model: {result.get('reasoning', 'No reasoning provided.')}",
                "confidence": result.get("confidence", "medium")
            }
        except Exception as e:
            return {
                "recommendation": "Strategy generation failed.",
                "reasoning": f"LLM error: {e}",
                "confidence": "low"
            }
