from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import List
from fastapi.responses import StreamingResponse

# Internal Imports
from app.services.ai_service import generate_streaming_summary, get_structured_summary
from app.database import get_db
from app.api.v1 import crud 
from app.schemas import MeetingSummaryResponse 

router = APIRouter()

class TranscriptRequest(BaseModel):
    transcript: str

@router.get("/history", response_model=List[MeetingSummaryResponse])
async def get_summary_history(db: Session = Depends(get_db)):
    """Fetch all previous summaries from PostgreSQL."""
    return crud.get_all_summaries(db)

@router.post("/")
async def summarize_transcript(
    request: TranscriptRequest, 
    db: Session = Depends(get_db)
):
    """Generates a structured JSON summary and persists it to the database."""
    summary_data = await get_structured_summary(request.transcript)
    
    crud.save_summary(db, summary_data, request.transcript)
    
    return summary_data

@router.post("/stream")
async def summarize_stream(request: TranscriptRequest):
    """Real-time streaming for the 'Live Feed' UI."""
    return StreamingResponse(
        generate_streaming_summary(request.transcript), 
        media_type="text/plain"
    )