from typing import Literal

from fastapi import APIRouter, HTTPException, Query

from services.live_jobs_service import (
    search_live_jobs,
)

router = APIRouter(
    prefix="/jobs",
    tags=["Live Jobs"],
)


@router.get("/search")
async def search_jobs_route(
    query: str = Query(
        ...,
        min_length=2,
        max_length=120,
        description=(
            "Job title, skills and optional location."
        ),
    ),
    page: int = Query(
        default=1,
        ge=1,
        le=10,
    ),
    num_pages: int = Query(
        default=1,
        ge=1,
        le=3,
    ),
    country: str = Query(
        default="in",
        min_length=2,
        max_length=2,
    ),
    date_posted: Literal[
        "all",
        "today",
        "3days",
        "week",
        "month",
    ] = "all",
    remote_jobs_only: bool = False,
):
    try:
        return await search_live_jobs(
            query=query,
            page=page,
            num_pages=num_pages,
            country=country,
            date_posted=date_posted,
            remote_jobs_only=remote_jobs_only,
        )

    except ValueError as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc),
        ) from exc

    except RuntimeError as exc:
        raise HTTPException(
            status_code=503,
            detail=str(exc),
        ) from exc

    except Exception as exc:
        print("Unexpected live jobs error:", exc)

        raise HTTPException(
            status_code=500,
            detail=(
                "An unexpected error occurred while "
                "searching for jobs."
            ),
        ) from exc