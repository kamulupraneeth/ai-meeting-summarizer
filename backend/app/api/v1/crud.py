from sqlalchemy.orm import Session
from app.schemas import MeetingSummaryResponse
from app.models import Summary

def save_summary(db: Session, data: MeetingSummaryResponse, raw_transcript: str):
    """Logic to insert a new summary into PostgreSQL."""
    db_summary = Summary(
        meeting_name=data.meeting_info.meeting_name,
        date=data.meeting_info.date,
        transcript=raw_transcript,
        # Convert Pydantic objects to dicts for JSONB storage
        participants=[p.model_dump() for p in data.participants],
        discussion=[d.model_dump() for d in data.discussion],
        action_items=[a.model_dump() for a in data.action_items]
    )
    db.add(db_summary)
    db.commit()
    db.refresh(db_summary)
    return db_summary

def get_all_summaries(db: Session):
    """Fetch history, sorted by newest first."""
    return db.query(Summary).order_by(Summary.id.desc()).all()