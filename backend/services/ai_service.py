import json
import os
import time

from dotenv import load_dotenv
from google import genai


load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
MODEL_NAME = os.getenv("GEMINI_MODEL", "gemini-2.5-flash-lite")

if not GEMINI_API_KEY:
    raise RuntimeError(
        "GEMINI_API_KEY is missing. Add it to the backend .env file."
    )

client = genai.Client(api_key=GEMINI_API_KEY)


def remove_code_fences(text: str) -> str:
    cleaned_text = text.strip()

    if cleaned_text.startswith("```"):
        lines = cleaned_text.splitlines()

        cleaned_text = "\n".join(
            line
            for line in lines
            if not line.strip().startswith("```")
        )

    return cleaned_text.strip()


def analyze_resume(resume_text: str) -> dict:
    if not resume_text or not resume_text.strip():
        raise ValueError("Resume text cannot be empty.")

    prompt = f"""
You are an ATS resume analysis expert.

Analyze the resume below fairly and accurately.

Important rules:
1. Do not invent information that is not present in the resume.
2. Treat the ATS score as an estimate.
3. Give practical suggestions suitable for the candidate's experience level.
4. Missing skills should be recommendations, not claims that the candidate
   definitely lacks those skills.
5. Return only valid JSON.
6. Do not include markdown code fences or additional explanations.

Return exactly this JSON structure:

{{
  "ats_score": 0,
  "overall_rating": "",
  "strengths": [],
  "missing_skills": [],
  "suggestions": [],
  "recommended_roles": []
}}

Resume:

{resume_text}
"""

    last_error = None

    for attempt in range(3):
        try:
            response = client.models.generate_content(
                model=MODEL_NAME,
                contents=prompt,
            )

            if not response.text:
                raise ValueError("Gemini returned an empty response.")

            cleaned_text = remove_code_fences(response.text)

            analysis = json.loads(cleaned_text)

            required_fields = [
                "ats_score",
                "overall_rating",
                "strengths",
                "missing_skills",
                "suggestions",
                "recommended_roles",
            ]

            missing_fields = [
                field
                for field in required_fields
                if field not in analysis
            ]

            if missing_fields:
                raise ValueError(
                    f"AI response is missing fields: {missing_fields}"
                )

            analysis["ats_score"] = max(
                0,
                min(100, int(analysis["ats_score"])),
            )

            for field in [
                "strengths",
                "missing_skills",
                "suggestions",
                "recommended_roles",
            ]:
                if not isinstance(analysis[field], list):
                    analysis[field] = [str(analysis[field])]

            return analysis

        except Exception as error:
            last_error = error

            print(
                f"Gemini analysis attempt {attempt + 1} failed:",
                repr(error),
            )

            if attempt < 2:
                time.sleep(3)

    raise RuntimeError(
        f"Gemini resume analysis failed after 3 attempts: {last_error}"
    )