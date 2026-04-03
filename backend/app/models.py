from sqlalchemy import Column, Integer, String, Text, DateTime, JSON
from sqlalchemy.sql import func
from app.database import Base

class Summary(Base):
    __tablename__ = "summaries"

    id = Column(Integer, primary_key=True, index=True)
    meeting_name = Column(String, index=True)
    date = Column(String)
    
    transcript = Column(Text)
    
    participants = Column(JSON)      # List of {name, role}
    discussion = Column(JSON)        # List of {topic, desc, action}
    action_items = Column(JSON)      # List of {assignee, desc}
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())