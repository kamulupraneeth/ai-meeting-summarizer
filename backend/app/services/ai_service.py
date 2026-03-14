import os
import json
import logging
from groq import AsyncGroq
from fastapi import HTTPException
from ..schemas import MeetingSummaryResponse
from dotenv import load_dotenv
load_dotenv() 


api_key = os.getenv("GROQ_API_KEY")
if not api_key:
    print("CRITICAL ERROR: GROQ_API_KEY is missing from .env!")
else:
    print(f"SUCCESS: GROQ_API_KEY starts with {api_key[:8]}...")

logger = logging.getLogger(__name__)

client = AsyncGroq(api_key=api_key)

SYSTEM_PROMPT = """
You are a professional meeting assistant. Summarize the transcript into a STRICT JSON format.
REQUIRED JSON KEYS:
{
    "MeetingInfo": { "MeetingName": "string", "Date": "string" },
    "Participants": [ { "Name": "string", "Role": "string" } ],
    "Discussion": [ { "Topic": "string", "Description": "string", "Action": "string" } ],
    "ActionItems": [ { "Assignee": "string", "Description": "string" } ]
}
"""

async def get_structured_summary(transcript: str) -> MeetingSummaryResponse:
    """
    Analyzes transcript using LLM and validates against Pydantic schema.
    """
    if not transcript.strip():
        raise HTTPException(status_code=400, detail="Transcript is empty")

    try:
        completion = await client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": f"Transcript to analyze: \n\n{transcript}"}
            ],
            response_format={"type": "json_object"},
            temperature=0.2, 
        )

        raw_content = completion.choices[0].message.content
        
        if not raw_content:
            raise ValueError("AI returned an empty response")

        json_data = json.loads(raw_content)

        return MeetingSummaryResponse.model_validate(json_data)

    except json.JSONDecodeError as e:
        logger.error(f"Failed to parse AI JSON: {str(e)}")
        raise HTTPException(status_code=500, detail="AI returned invalid JSON format")
    
    except Exception as e:
        logger.error(f"AI Service Error: {str(e)}")
        raise HTTPException(
            status_code=500, 
            detail="An error occurred while processing the summary with AI"
        )