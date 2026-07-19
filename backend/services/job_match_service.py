import os
import json
import time

from dotenv import load_dotenv
from google import genai

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)

MODEL_NAME = os.getenv("GEMINI_MODEL", "gemini-3.5-flash")


def match_job(resume: str, job_description: str):

    prompt = f"""
You are an ATS Job Matching Expert.

Compare the resume with the job description.

Return ONLY valid JSON.

Format:

{{
    "match_score": 0,
    "matched_skills": [],
    "missing_skills": [],
    "recommendations": []
}}

Resume:

{resume}

Job Description:

{job_description}
"""

    response = None

    # Retry Gemini up to 3 times
    for attempt in range(3):

        try:

            response = client.models.generate_content(
                model=MODEL_NAME,
                contents=prompt
            )

            break

        except Exception as e:

            print(f"Attempt {attempt + 1} failed: {e}")

            if attempt == 2:
                raise

            time.sleep(3)

    if response is None:
        raise Exception("No response received from Gemini.")

    text = response.text.strip()

    # Remove markdown code fences if Gemini returns them
    if text.startswith("```"):

        lines = text.splitlines()

        text = "\n".join(
            line
            for line in lines
            if not line.strip().startswith("```")
        )

    # Parse JSON safely
    try:

        return json.loads(text)

    except json.JSONDecodeError:

        print("Invalid JSON returned by Gemini:")
        print(text)

        return {
            "match_score": 0,
            "matched_skills": [],
            "missing_skills": [],
            "recommendations": [
                "AI returned an invalid response. Please try again."
            ]
        }