import json
import time

from services.ai_service import MODEL_NAME, client


def generate_interview_questions(
    resume_text: str,
    job_title: str,
    company: str,
    job_description: str,
) -> dict:
    if not resume_text or not resume_text.strip():
        raise ValueError("Resume text cannot be empty.")

    if not job_description or not job_description.strip():
        raise ValueError("Job description cannot be empty.")

    clean_job_title = (
        job_title.strip() or "the advertised position"
    )
    clean_company = company.strip() or "the company"

    prompt = f"""
You are an expert technical interviewer and career coach.

Create a personalized interview preparation set using only the candidate's
resume and the job description below.

Important rules:
1. Do not invent skills, experience, achievements, qualifications, or dates.
2. Tailor the questions to the candidate's real background and the job.
3. Include technical, behavioral, and resume-based questions.
4. Provide concise suggested answers that help the candidate prepare.
5. Suggested answers must remain honest and must not claim experience that
   is missing from the resume.
6. Return valid JSON only.
7. Do not use markdown, code fences, or explanatory text outside the JSON.

Return this exact JSON structure:

{{
  "technical_questions": [
    {{
      "question": "Question text",
      "suggested_answer": "Suggested answer text"
    }}
  ],
  "behavioral_questions": [
    {{
      "question": "Question text",
      "suggested_answer": "Suggested answer text"
    }}
  ],
  "resume_questions": [
    {{
      "question": "Question text",
      "suggested_answer": "Suggested answer text"
    }}
  ],
  "preparation_tips": [
    "Tip 1",
    "Tip 2"
  ]
}}

Requirements:
- Generate 5 technical questions.
- Generate 4 behavioral questions.
- Generate 4 resume-based questions.
- Generate 5 practical preparation tips.
- Keep each suggested answer between 40 and 100 words.
- Make the questions useful for a real interview.

Job title:
{clean_job_title}

Company:
{clean_company}

Job description:
{job_description}

Candidate resume:
{resume_text}
"""

    last_error = None

    for attempt in range(3):
        try:
            response = client.models.generate_content(
                model=MODEL_NAME,
                contents=prompt,
            )

            if not response.text or not response.text.strip():
                raise ValueError(
                    "Gemini returned an empty interview response."
                )

            raw_text = response.text.strip()

            if raw_text.startswith("```"):
                lines = raw_text.splitlines()

                raw_text = "\n".join(
                    line
                    for line in lines
                    if not line.strip().startswith("```")
                ).strip()

            result = json.loads(raw_text)

            required_keys = {
                "technical_questions",
                "behavioral_questions",
                "resume_questions",
                "preparation_tips",
            }

            if not required_keys.issubset(result.keys()):
                raise ValueError(
                    "Gemini returned incomplete interview data."
                )

            return result

        except Exception as error:
            last_error = error

            print(
                f"Interview coach generation attempt "
                f"{attempt + 1} failed:",
                repr(error),
            )

            if attempt < 2:
                time.sleep(3)

    raise RuntimeError(
        "Interview coach generation failed after 3 attempts: "
        f"{last_error}"
    )