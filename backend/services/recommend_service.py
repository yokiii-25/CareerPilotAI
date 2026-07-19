import json
import os


def recommend_jobs(resume_text):

    path = os.path.join("data", "jobs.json")

    with open(path, "r") as file:
        jobs = json.load(file)

    resume = resume_text.lower()

    recommendations = []

    for job in jobs:

        score = 0

        matched = []

        for skill in job["skills"]:

            if skill.lower() in resume:
                score += 20
                matched.append(skill)

        recommendations.append({
            "title": job["title"],
            "company": job["company"],
            "score": score,
            "matched_skills": matched
        })

    recommendations.sort(
        key=lambda x: x["score"],
        reverse=True
    )

    return recommendations[:5]