from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional

class APIModel(BaseModel):
    model_config = ConfigDict(
        populate_by_name=True, 
        str_strip_whitespace=True
    )

class Participant(APIModel):
    name: str = Field(..., alias="Name") 
    role: str = Field(default="Participant", alias="Role")

class DiscussionPoint(APIModel):
    topic: str = Field(..., alias="Topic")
    description: str = Field(..., alias="Description")
    action_item: Optional[str] = Field(None, alias="Action") 

class ActionItem(APIModel):
    assignee: str = Field(..., alias="Assignee") 
    task: str = Field(..., alias="Description") 
    priority: str = Field(default="Medium") 

class MeetingMetadata(APIModel):
    title: str = Field(..., alias="MeetingName")
    date: str = Field(default="Unknown Date", alias="Date")
    sentiment: str = Field(default="Neutral")

class MeetingSummaryResponse(APIModel):
    meeting_info: MeetingMetadata = Field(..., alias="MeetingInfo")
    participants: List[Participant] = Field(default_factory=list, alias="Participants")
    discussion: List[DiscussionPoint] = Field(default_factory=list, alias="Discussion")
    action_items: List[ActionItem] = Field(default_factory=list, alias="ActionItems")

class TranscriptRequest(BaseModel):
    transcript: str = Field(..., min_length=10)