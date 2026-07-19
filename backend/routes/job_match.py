from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from services.job_match_service import match_job

router = APIRouter()


class JobRequest(BaseModel):
    resume_text: str
    job_description: str


@router.post("/match-job")
def match_job_route(data: JobRequest):

    try:
        result = match_job(
        data.resume_text,
        data.job_description
)
        return result

    except Exception as e:

        print(e)

        raise HTTPException(
            status_code=503,
            detail="AI service is busy. Please try again later."
        )