from sqlalchemy import Column, Integer, String, Text
from app.database import Base

class Summary(Base):
    __tablename__ = "summaries"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    content = Column(Text)