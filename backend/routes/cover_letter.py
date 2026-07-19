from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from services.cover_letter_service import generate_cover_letter


router = APIRouter()


class CoverLetterRequest(BaseModel):
    resume_text: str = Field(min_length=1)
    job_title: str = ""
    company: str = ""
    job_description: str = Field(min_length=1)


@router.post("/generate-cover-letter")
def generate_cover_letter_route(data: CoverLetterRequest):
    try:
        letter = generate_cover_letter(
            resume_text=data.resume_text,
            job_title=data.job_title,
            company=data.company,
            job_description=data.job_description,
        )

        return {
            "success": True,
            "cover_letter": letter,
        }

    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error),
        ) from error

    except Exception as error:
        print("Cover letter route failed:", repr(error))

        raise HTTPException(
            status_code=503,
            detail="Unable to generate the cover letter right now.",
        ) from error