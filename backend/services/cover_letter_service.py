import time

from services.ai_service import MODEL_NAME, client


def generate_cover_letter(
    resume_text: str,
    job_title: str,
    company: str,
    job_description: str,
) -> str:
    if not resume_text or not resume_text.strip():
        raise ValueError("Resume text cannot be empty.")

    if not job_description or not job_description.strip():
        raise ValueError("Job description cannot be empty.")

    clean_job_title = job_title.strip() or "the advertised position"
    clean_company = company.strip() or "the company"

    prompt = f"""
You are an expert career coach and professional cover letter writer.

Write a personalized cover letter for the candidate using only information
present in the resume and job description below.

Important rules:
1. Do not invent skills, experience, achievements, qualifications, or dates.
2. Match the candidate's real experience to the job requirements.
3. Use a confident but honest professional tone.
4. Keep the letter concise, approximately 300 to 450 words.
5. Use 4 to 6 short paragraphs.
6. Do not use markdown headings, bullet points, code fences, or placeholders.
7. Do not include the candidate's address, date, hiring manager address,
   subject line, or fake hiring manager name.
8. Begin with "Dear Hiring Manager,".
9. End with "Sincerely," followed by the candidate's name when the name can
   be confidently identified from the resume.
10. Return only the completed cover letter.

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
                raise ValueError("Gemini returned an empty cover letter.")

            cover_letter = response.text.strip()

            if cover_letter.startswith("```"):
                lines = cover_letter.splitlines()

                cover_letter = "\n".join(
                    line
                    for line in lines
                    if not line.strip().startswith("```")
                ).strip()

            if len(cover_letter) < 100:
                raise ValueError(
                    "Gemini returned an unexpectedly short cover letter."
                )

            return cover_letter

        except Exception as error:
            last_error = error

            print(
                f"Cover letter generation attempt {attempt + 1} failed:",
                repr(error),
            )

            if attempt < 2:
                time.sleep(3)

    raise RuntimeError(
        "Cover letter generation failed after 3 attempts: "
        f"{last_error}"
    )