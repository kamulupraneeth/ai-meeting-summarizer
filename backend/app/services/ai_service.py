import os
import json
import logging
from typing import Any, Dict
from groq import AsyncGroq, RateLimitError, APIConnectionError, APIStatusError
from fastapi import HTTPException
from pydantic import ValidationError
from ..schemas import MeetingSummaryResponse
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging to show timestamps and levels
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize API Key and Client
api_key = os.getenv("GROQ_API_KEY")
if not api_key:
    logger.critical("GROQ_API_KEY is missing from environment variables!")
else:
    # Use logger instead of print for production-grade tracking
    logger.info(f"Groq Client initialized with key: {api_key[:8]}...")

client = AsyncGroq(api_key=api_key)

# Optimized System Prompt for better JSON extraction
SYSTEM_PROMPT = """
You are an expert meeting analyst. Your task is to extract structured insights from transcripts.
Return ONLY a valid JSON object. Do not include markdown formatting or extra text.

REQUIRED JSON STRUCTURE:
{
    "MeetingInfo": { "MeetingName": "string", "Date": "string" },
    "Participants": [ { "Name": "string", "Role": "string" } ],
    "Discussion": [ { "Topic": "string", "Description": "string", "Action": "string" } ],
    "ActionItems": [ { "Assignee": "string", "Description": "string" } ]
}
"""

async def get_structured_summary(transcript: str) -> MeetingSummaryResponse:
    """
    Analyzes transcript using Groq LLM and validates output against Pydantic schema.
    Handles rate limits, connection issues, and malformed AI responses.
    """
    
    # 1. Input Validation
    if not transcript.strip():
        raise HTTPException(status_code=400, detail="Transcript is empty. Please provide text.")
    
    if len(transcript) < 50:
        raise HTTPException(status_code=400, detail="Transcript is too short for meaningful analysis.")

    try:
        # 2. LLM Call with specific configuration
        completion = await client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": f"Transcript to analyze:\n\n{transcript}"}
            ],
            response_format={"type": "json_object"},
            temperature=0.1, # Lower temperature = higher consistency for JSON
            max_tokens=2048
        )

        raw_content = completion.choices[0].message.content
        
        if not raw_content:
            logger.error("Groq returned empty content")
            raise HTTPException(status_code=500, detail="AI service failed to generate content.")

        # 3. JSON Parsing
        try:
            json_data = json.loads(raw_content)
        except json.JSONDecodeError as je:
            logger.error(f"JSON Parse Error: {str(je)} | Raw Content: {raw_content}")
            raise HTTPException(status_code=500, detail="AI returned an invalid data format.")

        # 4. Pydantic Validation (Ensures data matches your frontend interface)
        try:
            return MeetingSummaryResponse.model_validate(json_data)
        except ValidationError as ve:
            logger.error(f"Pydantic Validation Error: {ve.json()}")
            raise HTTPException(
                status_code=500, 
                detail="AI data does not match the required meeting summary structure."
            )

    # 5. Specific Error Handling for the AI Provider (Shows Seniority)
    except RateLimitError:
        logger.warning("Groq Rate Limit Hit")
        raise HTTPException(status_code=429, detail="Too many requests. Please wait a moment before trying again.")
    
    except APIConnectionError:
        logger.error("Failed to connect to Groq API")
        raise HTTPException(status_code=503, detail="AI service is currently unreachable. Check your connection.")

    except APIStatusError as e:
        logger.error(f"Groq API Error: {e.status_code} | {e.message}")
        raise HTTPException(status_code=e.status_code, detail=f"AI Service Error: {e.message}")

    except Exception as e:
        logger.exception("Unexpected error in get_structured_summary")
        raise HTTPException(
            status_code=500, 
            detail="An unexpected error occurred during analysis."
        )