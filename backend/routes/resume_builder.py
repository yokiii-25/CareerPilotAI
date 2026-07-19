from fastapi import APIRouter
from pydantic import BaseModel
from fastapi import HTTPException

from services.resume_builder_service import generate_resume

router = APIRouter()


class ResumeRequest(BaseModel):
    name: str
    email: str
    phone: str
    summary: str
    skills: str
    education: str
    projects: str


@router.post("/generate-resume")
def build_resume(data: ResumeRequest):

    try:

        result = generate_resume(data.dict())

        return result

    except Exception as e:

        print(e)

        raise HTTPException(
            status_code=503,
            detail="AI is busy. Try again."
        )