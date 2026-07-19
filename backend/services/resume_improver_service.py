import json
import os
import time
from typing import Any

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


def normalize_string_list(value: Any) -> list[str]:
    if value is None:
        return []

    if isinstance(value, list):
        return [
            str(item).strip()
            for item in value
            if str(item).strip()
        ]

    if isinstance(value, str):
        return [value.strip()] if value.strip() else []

    return [str(value).strip()]


def generate_improved_resume(
    resume_text: str,
    analysis: dict,
) -> dict:
    if not resume_text or not resume_text.strip():
        raise ValueError("Resume text cannot be empty.")

    analysis = analysis or {}

    ats_score = analysis.get("ats_score", 0)
    overall_rating = analysis.get("overall_rating", "")
    strengths = normalize_string_list(
        analysis.get("strengths", [])
    )
    missing_skills = normalize_string_list(
        analysis.get("missing_skills", [])
    )
    suggestions = normalize_string_list(
        analysis.get("suggestions", [])
    )
    recommended_roles = normalize_string_list(
        analysis.get("recommended_roles", [])
    )

    prompt = f"""
You are a professional ATS resume writer.

Improve the uploaded resume while preserving the candidate's real
information.

Important rules:

1. Do not invent skills, employment, education, certifications, projects,
   achievements, dates, companies, job titles, percentages, or statistics.
2. Use only information clearly present in the original resume.
3. Missing skills are recommendations only. Do not add them to the resume
   unless they already appear in the original resume.
4. Improve grammar, wording, structure, clarity, action verbs, and ATS
   readability.
5. Preserve all contact details accurately.
6. Do not remove important factual information.
7. Do not add fake measurable results.
8. When a section is absent, return an empty string or empty list.
9. Keep the writing suitable for the candidate's actual experience level.
10. Return only valid JSON.
11. Do not include markdown code fences or extra explanations.

Return exactly this JSON structure:

{{
  "contact": {{
    "name": "",
    "email": "",
    "phone": "",
    "location": "",
    "linkedin": "",
    "github": "",
    "portfolio": ""
  }},
  "professional_summary": "",
  "skills": [],
  "education": [],
  "experience": [],
  "projects": [],
  "certifications": [],
  "achievements": [],
  "additional_sections": [],
  "changes_made": [],
  "estimated_ats_score": 0
}}

For education, experience, projects, certifications, achievements, and
additional_sections, return each item as a readable string.

Previous ATS analysis:

ATS score:
{ats_score}

Overall rating:
{overall_rating}

Strengths:
{json.dumps(strengths)}

Recommended skills:
{json.dumps(missing_skills)}

Suggestions:
{json.dumps(suggestions)}

Recommended roles:
{json.dumps(recommended_roles)}

Original resume:

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
                raise ValueError(
                    "Gemini returned an empty response."
                )

            cleaned_text = remove_code_fences(response.text)
            result = json.loads(cleaned_text)

            required_fields = [
                "contact",
                "professional_summary",
                "skills",
                "education",
                "experience",
                "projects",
                "certifications",
                "achievements",
                "additional_sections",
                "changes_made",
                "estimated_ats_score",
            ]

            missing_fields = [
                field
                for field in required_fields
                if field not in result
            ]

            if missing_fields:
                raise ValueError(
                    "AI response is missing fields: "
                    f"{missing_fields}"
                )

            if not isinstance(result["contact"], dict):
                result["contact"] = {}

            contact_fields = [
                "name",
                "email",
                "phone",
                "location",
                "linkedin",
                "github",
                "portfolio",
            ]

            result["contact"] = {
                field: str(
                    result["contact"].get(field, "")
                ).strip()
                for field in contact_fields
            }

            result["professional_summary"] = str(
                result.get("professional_summary", "")
            ).strip()

            list_fields = [
                "skills",
                "education",
                "experience",
                "projects",
                "certifications",
                "achievements",
                "additional_sections",
                "changes_made",
            ]

            for field in list_fields:
                result[field] = normalize_string_list(
                    result.get(field, [])
                )

            try:
                improved_score = int(
                    result.get("estimated_ats_score", ats_score)
                )
            except (TypeError, ValueError):
                improved_score = int(ats_score or 0)

            result["estimated_ats_score"] = max(
                0,
                min(100, improved_score),
            )

            return result

        except Exception as error:
            last_error = error

            print(
                f"Resume improvement attempt "
                f"{attempt + 1} failed:",
                repr(error),
            )

            if attempt < 2:
                time.sleep(3)

    raise RuntimeError(
        "Gemini resume improvement failed after "
        f"3 attempts: {last_error}"
    )