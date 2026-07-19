import { useState } from "react";
import ResumeMatchModal from "./ResumeMatchModal";

function JobCard({ job }) {
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [matchResult, setMatchResult] = useState(null);
  const [expanded, setExpanded] = useState(false);

  const description =
    job?.description ||
    job?.job_description ||
    "No description available.";

  const shortDescription =
    description.length > 320
      ? `${description.slice(0, 320)}...`
      : description;

  const jobTitle =
    job?.title ||
    job?.job_title ||
    "Job opportunity";

  const employer =
    job?.employer ||
    job?.company ||
    job?.employer_name ||
    "Company";

  function handleOpenCoverLetter() {
    const coverLetterJob = {
      title: jobTitle,
      company: employer,
      description,
    };

    sessionStorage.setItem(
      "coverLetterJob",
      JSON.stringify(coverLetterJob)
    );

    window.location.href = "/cover-letter";
  }

  return (
    <article className="job-card">
      <div className="job-card-header">
        <div className="job-company-logo">
          {job?.employer_logo ? (
            <img
              src={job.employer_logo}
              alt={`${employer} logo`}
            />
          ) : (
            <span>
              {employer.charAt(0).toUpperCase()}
            </span>
          )}
        </div>

        <div className="job-card-heading">
          <h3>{jobTitle}</h3>
          <p>{employer}</p>
        </div>
      </div>

      <div className="job-meta">
        <span>
          {job?.location || "Location not specified"}
        </span>

        {job?.employment_type && (
          <span>{job.employment_type}</span>
        )}

        {job?.is_remote && (
          <span>Remote</span>
        )}

        {job?.posted_at && (
          <span>
            Posted{" "}
            {new Date(
              job.posted_at
            ).toLocaleDateString()}
          </span>
        )}
      </div>

      {job?.salary && (
        <p className="job-salary">
          {job.salary}
        </p>
      )}

      <p className="job-description">
        {expanded
          ? description
          : shortDescription}
      </p>

      {description.length > 320 && (
        <button
          type="button"
          className="job-text-button"
          onClick={() =>
            setExpanded((current) => !current)
          }
        >
          {expanded
            ? "Show less"
            : "Read full description"}
        </button>
      )}

      <div className="job-card-actions">
        <button
          type="button"
          onClick={() =>
            setShowMatchModal(true)
          }
        >
          Check My Match
        </button>

        {job?.apply_link ? (
          <a
            href={job.apply_link}
            target="_blank"
            rel="noreferrer"
          >
            Apply Now
          </a>
        ) : (
          <button
            type="button"
            disabled
          >
            Apply link unavailable
          </button>
        )}
      </div>

      {matchResult && (
        <div className="job-match-result">
          <div className="job-match-score-row">
            <div>
              <span className="job-match-label-text">
                Resume match
              </span>

              <strong className="job-match-percentage">
                {Number(
                  matchResult?.match_score
                ) || 0}
                %
              </strong>
            </div>

            <MatchVerdict
              score={
                Number(
                  matchResult?.match_score
                ) || 0
              }
            />
          </div>

          <MatchSection
            title="Matched skills"
            items={
              matchResult?.matched_skills
            }
          />

          <MatchSection
            title="Missing skills"
            items={
              matchResult?.missing_skills
            }
          />

          <MatchSection
            title="Recommendations"
            items={
              matchResult?.recommendations
            }
          />

          <button
            type="button"
            className="job-cover-letter-button"
            onClick={handleOpenCoverLetter}
          >
            Generate Cover Letter for This Job
          </button>
        </div>
      )}

      {showMatchModal && (
        <ResumeMatchModal
          job={job}
          onClose={() =>
            setShowMatchModal(false)
          }
          onMatchComplete={(result) => {
            console.log(
              "Match result:",
              result
            );

            setMatchResult(result);
            setShowMatchModal(false);
          }}
        />
      )}
    </article>
  );
}

function MatchVerdict({ score }) {
  const numericScore = Number(score) || 0;

  let label = "Low match";
  let className =
    "job-match-verdict low";

  if (numericScore >= 75) {
    label = "Strong match";
    className =
      "job-match-verdict strong";
  } else if (numericScore >= 50) {
    label = "Moderate match";
    className =
      "job-match-verdict moderate";
  }

  return (
    <span className={className}>
      {label}
    </span>
  );
}

function MatchSection({ title, items }) {
  const safeItems = Array.isArray(items)
    ? items
    : [];

  return (
    <div className="job-match-section">
      <h4>{title}</h4>

      {safeItems.length > 0 ? (
        <ul>
          {safeItems.map(
            (item, index) => (
              <li
                key={`${title}-${index}`}
              >
                {typeof item === "string"
                  ? item
                  : JSON.stringify(item)}
              </li>
            )
          )}
        </ul>
      ) : (
        <p>
          No information available.
        </p>
      )}
    </div>
  );
}

export default JobCard;