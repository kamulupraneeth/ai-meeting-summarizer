from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

# 1. Database Imports
from app.database import engine, Base
from app import models  

# 2. Router Imports
from app.api.v1.endpoints import summarize

@asynccontextmanager
async def lifespan(app: FastAPI):
    # This runs when the app starts
    print("Initializing Database...")
    Base.metadata.create_all(bind=engine)
    yield
    # This runs when the app stops
    print("Shutting down...")

app = FastAPI(
    title="AI Meeting Summarizer API",
    description="Professional Enterprise AI Summarization Engine",
    version="2.0.0",
    lifespan=lifespan
)

# 3. CORS Setup (Professional Config)
origins = [
    "http://localhost:3000", 
    "https://your-production-domain.com" 
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 4. Include Routers
app.include_router(
    summarize.router, 
    prefix="/api/v1/summarize", 
    tags=["summarize"]
)

@app.get("/")
async def root():
    return {
        "status": "online",
        "message": "AI Meeting Summarizer API is running",
        "version": "2.0.0"
    }