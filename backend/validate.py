import fastf1 as ff1
from ml.train_model import run_training


def is_valid_race_session(year: int, race_name: str, session: str) -> bool:
    try:
        schedule = ff1.get_event_schedule(year)
        if not any(schedule['EventName'].str.lower() == race_name.lower()):
            return False
        ff1.get_session(year, race_name, session)
        return True
    except Exception:
        return False


def validate_and_train(year: int, race_name: str, session: str) -> bool:
    if not is_valid_race_session(year, race_name, session):
        return False
    return run_training(year, race_name, session)
