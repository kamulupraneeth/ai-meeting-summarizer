import os
from urllib.parse import quote_plus
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

# 1. Load environment variables
load_dotenv()

user = os.getenv("DB_USER")
password = os.getenv("DB_PASSWORD")
host = os.getenv("DB_HOST")
port = os.getenv("DB_PORT")
db_name = os.getenv("DB_NAME")

# 2. URL encode the password (handles symbols like @ or :)
safe_password = quote_plus(password) if password else ""

# 3. Construct the PostgreSQL URL
SQLALCHEMY_DATABASE_URL = f"postgresql://{user}:{safe_password}@{host}:{port}/{db_name}"

# 4. Create the SQLAlchemy engine
engine = create_engine(SQLALCHEMY_DATABASE_URL)

# 5. Create a Session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 6. Define the Base class for models
Base = declarative_base()

# --- THE SENIOR MOVE: Dependency Injection Helper ---
def get_db():
    """
    Creates a new database session for each request 
    and ensures it is closed after the request is done.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()