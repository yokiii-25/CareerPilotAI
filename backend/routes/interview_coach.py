from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from services.interview_coach_service import (
    generate_interview_questions,
)


router = APIRouter()


class InterviewCoachRequest(BaseModel):
    resume_text: str = Field(min_length=1)
    job_title: str = ""
    company: str = ""
    job_description: str = Field(min_length=1)


@router.post("/interview-coach")
def interview_coach_route(
    data: InterviewCoachRequest,
):
    try:
        result = generate_interview_questions(
            resume_text=data.resume_text,
            job_title=data.job_title,
            company=data.company,
            job_description=data.job_description,
        )

        return {
            "success": True,
            **result,
        }

    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error),
        ) from error

    except Exception as error:
        print(
            "Interview coach route failed:",
            repr(error),
        )

        raise HTTPException(
            status_code=503,
            detail=(
                "Unable to generate interview questions "
                "right now."
            ),
        ) from error