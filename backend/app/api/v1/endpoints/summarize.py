from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.ai_service import get_structured_summary

router = APIRouter()

class TranscriptRequest(BaseModel):
    transcript: str

@router.post("/")
async def summarize_transcript(request: TranscriptRequest):
    summary = await get_structured_summary(request.transcript) 
    return {"summary": summary}