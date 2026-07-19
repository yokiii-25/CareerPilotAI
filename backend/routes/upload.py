from pathlib import Path
import shutil
import uuid

from fastapi import APIRouter, UploadFile, File, HTTPException

from services.pdf_service import extract_text_from_pdf
from services.ai_service import analyze_resume


router = APIRouter()

UPLOAD_FOLDER = Path("uploads")
UPLOAD_FOLDER.mkdir(parents=True, exist_ok=True)


@router.post("/upload")
async def upload_resume(file: UploadFile = File(...)):
    original_filename = file.filename or "resume.pdf"

    # Accept PDF files only.
    if not original_filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Please upload a PDF file.",
        )

    # Generate a safe unique filename on the server.
    safe_filename = f"{uuid.uuid4().hex}.pdf"
    file_path = UPLOAD_FOLDER / safe_filename

    try:
        # Save uploaded PDF.
        with file_path.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Extract resume text.
        resume_text = extract_text_from_pdf(str(file_path))

        if not resume_text or not resume_text.strip():
            raise HTTPException(
                status_code=422,
                detail=(
                    "No readable text was found in the PDF. "
                    "Please upload a text-based resume PDF."
                ),
            )

        print("Resume text extracted successfully.")
        print("Extracted characters:", len(resume_text))

        # Analyze resume using Gemini.
        analysis = analyze_resume(resume_text)

        return {
            "success": True,
            "filename": original_filename,
            "resume_text": resume_text,
            "analysis": analysis,
        }

    except HTTPException:
        raise

    except Exception as error:
        print("Resume upload error:", repr(error))

        raise HTTPException(
            status_code=503,
            detail="Resume analysis failed. Please try again in a few moments.",
        ) from error

    finally:
        await file.close()

        # Remove the temporary uploaded file after processing.
        if file_path.exists():
            try:
                file_path.unlink()
            except OSError as cleanup_error:
                print("Temporary file cleanup failed:", cleanup_error)