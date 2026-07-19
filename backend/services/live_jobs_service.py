import os
from typing import Any

import httpx
from dotenv import load_dotenv

load_dotenv()

RAPIDAPI_KEY = os.getenv("RAPIDAPI_KEY", "").strip()
RAPIDAPI_HOST = os.getenv(
    "RAPIDAPI_HOST",
    "jsearch.p.rapidapi.com",
).strip()
RAPIDAPI_SEARCH_PATH = os.getenv(
    "RAPIDAPI_SEARCH_PATH",
    "/search-v2",
).strip()


def _validate_configuration() -> None:
    if not RAPIDAPI_KEY:
        raise RuntimeError(
            "RAPIDAPI_KEY is missing from the backend .env file."
        )

    if not RAPIDAPI_HOST:
        raise RuntimeError(
            "RAPIDAPI_HOST is missing from the backend .env file."
        )

    if not RAPIDAPI_SEARCH_PATH.startswith("/"):
        raise RuntimeError(
            "RAPIDAPI_SEARCH_PATH must start with '/'."
        )


def _salary_text(job: dict[str, Any]) -> str | None:
    minimum = job.get("job_min_salary")
    maximum = job.get("job_max_salary")
    currency = job.get("job_salary_currency")
    period = job.get("job_salary_period")

    if minimum is None and maximum is None:
        return None

    salary_parts: list[str] = []

    if minimum is not None and maximum is not None:
        salary_parts.append(f"{minimum:g} – {maximum:g}")
    elif minimum is not None:
        salary_parts.append(f"From {minimum:g}")
    elif maximum is not None:
        salary_parts.append(f"Up to {maximum:g}")

    if currency:
        salary_parts.append(str(currency))

    if period:
        salary_parts.append(f"per {str(period).lower()}")

    return " ".join(salary_parts)


def _format_location(job: dict[str, Any]) -> str:
    location_parts = [
        job.get("job_city"),
        job.get("job_state"),
        job.get("job_country"),
    ]

    clean_parts = [
        str(value).strip()
        for value in location_parts
        if value and str(value).strip()
    ]

    if clean_parts:
        return ", ".join(dict.fromkeys(clean_parts))

    return "Location not specified"


def _normalise_job(job: dict[str, Any]) -> dict[str, Any]:
    apply_options = job.get("apply_options") or []

    apply_links = []

    for option in apply_options:
        if not isinstance(option, dict):
            continue

        link = option.get("apply_link")

        if link:
            apply_links.append(
                {
                    "publisher": option.get(
                        "publisher",
                        "Job publisher",
                    ),
                    "apply_link": link,
                    "is_direct": bool(
                        option.get("is_direct")
                    ),
                }
            )

    primary_apply_link = (
        job.get("job_apply_link")
        or (
            apply_links[0]["apply_link"]
            if apply_links
            else None
        )
    )

    return {
        "id": job.get("job_id"),
        "title": job.get("job_title")
        or "Untitled position",
        "employer": job.get("employer_name")
        or "Employer not specified",
        "employer_logo": job.get("employer_logo"),
        "employer_website": job.get(
            "employer_website"
        ),
        "publisher": job.get("job_publisher"),
        "location": _format_location(job),
        "city": job.get("job_city"),
        "state": job.get("job_state"),
        "country": job.get("job_country"),
        "is_remote": bool(job.get("job_is_remote")),
        "employment_type": job.get(
            "job_employment_type"
        ),
        "employment_types": job.get(
            "job_employment_types"
        )
        or [],
        "description": job.get("job_description")
        or "",
        "highlights": job.get("job_highlights")
        or {},
        "required_skills": job.get(
            "job_required_skills"
        )
        or [],
        "experience": job.get(
            "job_required_experience"
        )
        or {},
        "education": job.get(
            "job_required_education"
        )
        or {},
        "salary": _salary_text(job),
        "salary_min": job.get("job_min_salary"),
        "salary_max": job.get("job_max_salary"),
        "salary_currency": job.get(
            "job_salary_currency"
        ),
        "salary_period": job.get(
            "job_salary_period"
        ),
        "posted_at": job.get(
            "job_posted_at_datetime_utc"
        ),
        "expires_at": job.get(
            "job_offer_expiration_datetime_utc"
        ),
        "apply_link": primary_apply_link,
        "apply_is_direct": bool(
            job.get("job_apply_is_direct")
        ),
        "apply_options": apply_links,
    }


async def search_live_jobs(
    query: str,
    page: int = 1,
    num_pages: int = 1,
    country: str = "in",
    date_posted: str = "all",
    remote_jobs_only: bool = False,
) -> dict[str, Any]:
    _validate_configuration()

    clean_query = query.strip()

    if not clean_query:
        raise ValueError("A job search query is required.")

    url = (
        f"https://{RAPIDAPI_HOST}"
        f"{RAPIDAPI_SEARCH_PATH}"
    )

    headers = {
        "X-RapidAPI-Key": RAPIDAPI_KEY,
        "X-RapidAPI-Host": RAPIDAPI_HOST,
    }

    params: dict[str, str | int] = {
        "query": clean_query,
        "page": page,
        "num_pages": num_pages,
        "country": country.lower(),
        "date_posted": date_posted,
    }

    if remote_jobs_only:
        params["remote_jobs_only"] = "true"

    timeout = httpx.Timeout(
        connect=10.0,
        read=30.0,
        write=10.0,
        pool=10.0,
    )

    async with httpx.AsyncClient(
        timeout=timeout
    ) as client:
        try:
            response = await client.get(
                url,
                headers=headers,
                params=params,
            )

            response.raise_for_status()

        except httpx.TimeoutException as exc:
            raise RuntimeError(
                "The live jobs provider took too long "
                "to respond."
            ) from exc

        except httpx.HTTPStatusError as exc:
            status_code = exc.response.status_code

            try:
                provider_error = exc.response.json()
            except ValueError:
                provider_error = exc.response.text

            print(
                "JSearch HTTP error:",
                status_code,
                provider_error,
            )

            if status_code in {401, 403}:
                raise RuntimeError(
                    "RapidAPI rejected the API key or "
                    "JSearch subscription."
                ) from exc

            if status_code == 429:
                raise RuntimeError(
                    "RapidAPI request limit reached. "
                    "Please try again later."
                ) from exc

            raise RuntimeError(
                f"JSearch returned HTTP {status_code}."
            ) from exc

        except httpx.RequestError as exc:
            raise RuntimeError(
                "Could not connect to the live jobs "
                "provider."
            ) from exc

    payload = response.json()

    data = payload.get("data", {})

    raw_jobs = data.get("jobs", [])

    jobs = [
        _normalise_job(job)
        for job in raw_jobs
        if isinstance(job, dict)
    ]

    return {
        "success": True,
        "query": clean_query,
        "page": page,
        "count": len(jobs),
        "jobs": jobs,
    }