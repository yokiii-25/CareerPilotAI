import os
import json
import time
from dotenv import load_dotenv
from google import genai

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)

MODEL_NAME = os.getenv("GEMINI_MODEL", "gemini-3.1-flash-lite-preview")


def generate_resume(data):

    prompt = f"""
You are a Professional Resume Writer.

Generate an ATS-friendly resume.

Return ONLY JSON.

{{
    "summary":"",
    "skills":[],
    "projects":[],
    "experience":[],
    "education":""
}}

User Information:

Name:
{data["name"]}

Email:
{data["email"]}

Phone:
{data["phone"]}

Summary:
{data["summary"]}

Skills:
{data["skills"]}

Education:
{data["education"]}

Projects:
{data["projects"]}
"""

    response = None

    for attempt in range(3):

        try:

            response = client.models.generate_content(
                model=MODEL_NAME,
                contents=prompt
            )

            break

        except Exception as e:

            print(e)

            if attempt == 2:
                raise

            time.sleep(3)

    text = response.text.strip()

    if text.startswith("```"):

        lines = text.splitlines()

        text = "\n".join(
            line
            for line in lines
            if not line.startswith("```")
        )

    return json.loads(text)