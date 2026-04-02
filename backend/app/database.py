import urllib.parse
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

raw_password = "Chintu@3511"

safe_password = urllib.parse.quote_plus(raw_password)

SQLALCHEMY_DATABASE_URL = f"postgresql://postgres:{safe_password}@localhost:5432/meeting_db"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()