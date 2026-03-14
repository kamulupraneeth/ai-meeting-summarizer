import os
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    PROJECT_NAME: str = "AI Meeting Summarizer"
   
    
    model_config = SettingsConfigDict(env_file=".env")

settings = Settings()