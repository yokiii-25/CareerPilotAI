from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from services.live_job_service import search_live_jobs

router = APIRouter()


class LiveJobRequest(BaseModel):
    resume: str = Field(min_length=10)
    location: str = "India"
    country: str = "in"
    num_pages: int = Field(default=1, ge=1, le=3)


@router.post("/recommend-jobs")
def recommend_jobs(data: LiveJobRequest):
    try:
        return search_live_jobs(
            resume=data.resume,
            location=data.location,
            country=data.country,
            num_pages=data.num_pages
        )

    except ValueError as error:
        raise HTTPException(
            status_code=500,
            detail=str(error)
        ) from error

    except Exception as error:
        print("Live job search failed:", error)

        raise HTTPException(
            status_code=503,
            detail=(
                "Live job search is currently unavailable. "
                "Please try again."
            )
        ) from error