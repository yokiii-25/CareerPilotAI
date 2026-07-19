from typing import Any

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from services.resume_improver_service import (
    generate_improved_resume,
)


router = APIRouter(
    prefix="/resume-improver",
    tags=["Resume Improver"],
)


class ImproveResumeRequest(BaseModel):
    resume_text: str = Field(
        ...,
        min_length=50,
    )
    analysis: dict[str, Any] = Field(
        default_factory=dict,
    )


@router.post("/generate")
def improve_resume(data: ImproveResumeRequest):
    try:
        improved_resume = generate_improved_resume(
            resume_text=data.resume_text,
            analysis=data.analysis,
        )

        return {
            "success": True,
            "improved_resume": improved_resume,
        }

    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error),
        ) from error

    except Exception as error:
        print("Resume improvement error:", repr(error))

        raise HTTPException(
            status_code=503,
            detail=(
                "Unable to improve the resume right now. "
                "Please try again."
            ),
        ) from error