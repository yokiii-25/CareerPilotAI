from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.upload import router as upload_router
from routes.job_match import router as job_match_router
from routes.recommend import router as recommend_router
from routes.resume_builder import router as resume_builder_router
from routes.cover_letter import router as cover_letter_router
from routes.resume_improver import router as resume_improver_router
from routes.live_jobs import router as live_jobs_router
from routes.interview_coach import (
    router as interview_coach_router,
)


app = FastAPI(title="CareerPilot AI API")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(upload_router)
app.include_router(job_match_router)
app.include_router(recommend_router)
app.include_router(resume_builder_router)
app.include_router(cover_letter_router)
app.include_router(resume_improver_router)
app.include_router(live_jobs_router)
app.include_router(interview_coach_router)


@app.get("/")
def root():
    return {
        "message": "CareerPilot AI Backend Running 🚀"
    }