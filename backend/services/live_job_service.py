import json
import os
import re
import time

import requests
from dotenv import load_dotenv
from google import genai

load_dotenv()

RAPIDAPI_KEY = os.getenv("RAPIDAPI_KEY")

RAPIDAPI_HOST = os.getenv(
    "RAPIDAPI_HOST",
    "jsearch.p.rapidapi.com"
)

RAPIDAPI_SEARCH_PATH = os.getenv(
    "RAPIDAPI_SEARCH_PATH",
    "/search-v2"
)

GEMINI_MODEL = os.getenv(
    "GEMINI_MODEL",
    "gemini-3.1-flash-lite-preview"
)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

client = genai.Client(
    api_key=GEMINI_API_KEY
)


def clean_json_text(text: str) -> str:
    text = text.strip()

    if text.startswith("```"):
        text = re.sub(
            r"^```(?:json)?\s*",
            "",
            text,
            flags=re.IGNORECASE
        )

        text = re.sub(
            r"\s*```$",
            "",
            text
        )

    return text.strip()


def extract_job_profile(resume: str) -> dict:
    prompt = f"""
You are a career search assistant.

Analyze the resume below and return ONLY valid JSON.

Use this exact format:

{{
  "search_query": "short job search query",
  "skills": ["skill 1", "skill 2", "skill 3"]
}}

Rules:
- The search query should describe the most suitable job role.
- Keep the search query short.
- Include only important technical or professional skills.
- Do not include explanations.

Resume:

{resume}
"""

    response = None

    for attempt in range(3):
        try:
            response = client.models.generate_content(
                model=GEMINI_MODEL,
                contents=prompt
            )
            break

        except Exception as error:
            print(
                f"Gemini profile extraction attempt "
                f"{attempt + 1} failed: {error}"
            )

            if attempt == 2:
                return {
                    "search_query": "Software Developer",
                    "skills": []
                }

            time.sleep(3)

    if response is None or not response.text:
        return {
            "search_query": "Software Developer",
            "skills": []
        }

    try:
        print("\n===== GEMINI RAW RESPONSE =====")
        print(response.text)
        print("===== END GEMINI RESPONSE =====\n")

        cleaned_text = clean_json_text(response.text)
        result = json.loads(cleaned_text)

        search_query = result.get(
            "search_query",
            "Software Developer"
        )

        skills = result.get("skills", [])

        if not isinstance(skills, list):
            skills = []

        return {
            "search_query": search_query,
            "skills": skills
        }

    except (json.JSONDecodeError, TypeError) as error:
        print(
            "Could not parse Gemini job profile:",
            error
        )

        return {
            "search_query": "Software Developer",
            "skills": []
        }


def calculate_match_score(
    resume_skills: list[str],
    job_description: str
) -> tuple[int, list[str]]:
    if not resume_skills:
        return 0, []

    description = (
        job_description or ""
    ).lower()

    matched_skills = [
        skill
        for skill in resume_skills
        if skill.lower() in description
    ]

    score = round(
        len(matched_skills)
        / len(resume_skills)
        * 100
    )

    return score, matched_skills


def search_live_jobs(
    resume: str,
    location: str = "India",
    country: str = "in",
    num_pages: int = 1
) -> dict:
    if not RAPIDAPI_KEY:
        raise ValueError(
            "RAPIDAPI_KEY is missing from the backend .env file."
        )

    if not GEMINI_API_KEY:
        raise ValueError(
            "GEMINI_API_KEY is missing from the backend .env file."
        )

    profile = extract_job_profile(resume)

    search_query = profile["search_query"]
    resume_skills = profile["skills"]

    query = f"{search_query} in {location}".strip()

    url = (
        f"https://{RAPIDAPI_HOST}"
        f"{RAPIDAPI_SEARCH_PATH}"
    )

    headers = {
        "x-rapidapi-key": RAPIDAPI_KEY,
        "x-rapidapi-host": RAPIDAPI_HOST,
        "Content-Type": "application/json"
    }

    params = {
        "query": query,
        "num_pages": str(num_pages),
        "country": country,
        "date_posted": "all"
    }

    print("Calling JSearch URL:", url)
    print("JSearch parameters:", params)

    response = requests.get(
        url,
        headers=headers,
        params=params,
        timeout=30
    )

    print(
        "JSearch response status:",
        response.status_code
    )

    if not response.ok:
        print(
            "JSearch response body:",
            response.text
        )

    response.raise_for_status()

    api_data = response.json()

    raw_data = api_data.get("data", {})

    if isinstance(raw_data, dict):
        raw_jobs = raw_data.get("jobs", [])
    elif isinstance(raw_data, list):
        raw_jobs = raw_data
    else:
        raw_jobs = []

    jobs = []

    for job in raw_jobs:
        description = job.get(
            "job_description",
            ""
        )

        match_score, matched_skills = (
            calculate_match_score(
                resume_skills,
                description
            )
        )

        salary = (
            job.get("job_salary_string")
            or job.get("job_salary")
        )

        jobs.append({
            "job_id": job.get("job_id"),

            "title": job.get(
                "job_title",
                "Job title unavailable"
            ),

            "company": job.get(
                "employer_name",
                "Company unavailable"
            ),

            "company_logo": job.get(
                "employer_logo"
            ),

            "company_website": job.get(
                "employer_website"
            ),

            "location": job.get(
                "job_location",
                "Location unavailable"
            ),

            "city": job.get("job_city"),

            "state": job.get("job_state"),

            "country": job.get(
                "job_country"
            ),

            "employment_type": job.get(
                "job_employment_type"
            ),

            "remote": job.get(
                "job_is_remote",
                False
            ),

            "publisher": job.get(
                "job_publisher"
            ),

            "posted_at": job.get(
                "job_posted_at"
            ),

            "salary": salary,

            "description": description,

            "apply_link": job.get(
                "job_apply_link"
            ),

            "google_job_link": job.get(
                "job_google_link"
            ),

            "match_score": match_score,

            "matched_skills": matched_skills
        })

    jobs.sort(
        key=lambda item: item["match_score"],
        reverse=True
    )

    return {
        "success": True,
        "search_query": query,
        "extracted_skills": resume_skills,
        "total_jobs": len(jobs),
        "jobs": jobs
    }