import os
import json
import logging
from groq import AsyncGroq
from fastapi import HTTPException
from app.schemas import MeetingSummaryResponse
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)
client = AsyncGroq(api_key=os.getenv("GROQ_API_KEY"))

SYSTEM_PROMPT = """
You are an expert meeting analyst. Return ONLY a valid JSON object.
REQUIRED JSON STRUCTURE:
{
    "MeetingInfo": { "MeetingName": "string", "Date": "string" },
    "Participants": [ { "Name": "string", "Role": "string" } ],
    "Discussion": [ { "Topic": "string", "Description": "string", "Action": "string" } ],
    "ActionItems": [ { "Assignee": "string", "Description": "string" } ]
}
"""

# --- FUNCTION 1: STRUCTURED SUMMARY (For Database/JSON) ---
async def get_structured_summary(transcript: str) -> MeetingSummaryResponse:
    try:
        completion = await client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": f"Analyze this transcript:\n\n{transcript}"}
            ],
            response_format={"type": "json_object"},
            temperature=0.1
        )
        
        raw_content = completion.choices[0].message.content
        json_data = json.loads(raw_content)
        return MeetingSummaryResponse.model_validate(json_data)
        
    except Exception as e:
        logger.error(f"Structured Analysis Error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to generate structured summary")

async def generate_streaming_summary(transcript: str):
    try:
        stream = await client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {"role": "system", "content": "Summarize the following meeting transcript in concise bullet points."},
                {"role": "user", "content": transcript}
            ],
            stream=True,
            temperature=0.7
        )

        async for chunk in stream:
            content = chunk.choices[0].delta.content
            if content:
                yield content
                
    except Exception as e:
        logger.error(f"Streaming Error: {str(e)}")
        yield "Error: AI Service interrupted."