from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.endpoints import summarize


app = FastAPI(title="AI Meeting Summarizer API")

# CORS Setup
origins = ["http://localhost:3000"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Make sure the prefix here matches your frontend URL
app.include_router(summarize.router, prefix="/api/v1/summarize", tags=["summarize"])

@app.get("/")
async def root():
    return {"message": "API is running"}