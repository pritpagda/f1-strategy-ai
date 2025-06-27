import os
import json
import re
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
GEMINI_MODEL = genai.GenerativeModel("gemini-1.5-flash")


def get_strategy_recommendation_from_llm(current_lap_data: dict, stint_history: list, race_progress: float) -> dict:
    prompt = """
You are an F1 strategist AI.

Given:
- Current lap data (tyre, stint, pace)
- Recent stint history (last 3 laps)
- Race progress (0.0–1.0)

Return a JSON with:
{
  "recommendation": "<Action>",
  "reasoning": "<Justification>",
  "confidence": "<High|Medium|Low>"
}
"""

    context = f"""
Current Lap Data: {current_lap_data}
Stint History: {stint_history[-3:]}
Race Progress: {race_progress * 100:.1f}%
"""

    try:
        response = GEMINI_MODEL.generate_content(f"{prompt.strip()}\n\n{context}\n\nFinal strategy advice:")
        match = re.search(r'\{[\s\S]*?\}', response.text.strip())
        if not match:
            raise ValueError("No valid JSON block in LLM response.")
        data = json.loads(match.group())
        return {
            "recommendation": data.get("recommendation", "Continue"),
            "reasoning": data.get("reasoning", "No reasoning provided."),
            "confidence": data.get("confidence", "Medium"),
        }
    except Exception as e:
        return {
            "recommendation": "Continue",
            "reasoning": f"(Fallback: Gemini error — {e})",
            "confidence": "Low",
        }
