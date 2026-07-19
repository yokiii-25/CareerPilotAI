import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  downloadATSReport,
} from "../services/pdfService";

import Sidebar from "../components/layout/Sidebar";

import "../styles/dashboard.css";

function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();

  if (!location.state) {
    return (
      <div className="dashboard-empty-page">
        <div className="dashboard-empty-card">
          <div className="dashboard-empty-icon">
            📄
          </div>

          <h1>No Resume Analysis Found</h1>

          <p>
            Upload and analyse a resume before
            opening the dashboard.
          </p>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="dashboard-primary-button"
          >
            Upload Resume
          </button>
        </div>
      </div>
    );
  }

  const {
    ats_score = 0,
    overall_rating = "Not rated",
    strengths = [],
    missing_skills = [],
    suggestions = [],
    recommended_roles = [],
    filename = "Uploaded Resume",
  } = location.state;

  const normalizedScore = Math.min(
    100,
    Math.max(
      0,
      Number(ats_score) || 0
    )
  );

  function getScoreLabel() {
    if (normalizedScore >= 80) {
      return "Excellent";
    }

    if (normalizedScore >= 65) {
      return "Good";
    }

    if (normalizedScore >= 45) {
      return "Needs improvement";
    }

    return "Low ATS compatibility";
  }

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-main">
        <section className="dashboard-hero">
          <div>
            <p className="dashboard-eyebrow">
              AI Resume Intelligence
            </p>

            <h1>
              Resume Analysis Dashboard
            </h1>

            <p className="dashboard-hero-description">
              Review your ATS score, strengths,
              missing skills and personalised
              recommendations.
            </p>
          </div>

          <div className="dashboard-hero-actions">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="dashboard-secondary-button"
            >
              Upload New Resume
            </button>

            <button
              type="button"
              onClick={() => navigate("/jobs")}
              className="dashboard-primary-button"
            >
              Explore Jobs
            </button>
          </div>
        </section>

        <section className="dashboard-summary-grid">
          <article className="dashboard-score-card">
            <div className="dashboard-card-heading">
              <div>
                <p className="dashboard-card-label">
                  ATS Score
                </p>

                <h2>
                  Resume Compatibility
                </h2>
              </div>

              <span className="dashboard-status-badge">
                {getScoreLabel()}
              </span>
            </div>

            <div className="dashboard-score-content">
              <div
                className="dashboard-score-ring"
                style={{
                  "--score":
                    `${normalizedScore * 3.6}deg`,
                }}
              >
                <div className="dashboard-score-ring-inner">
                  <strong>
                    {normalizedScore}%
                  </strong>

                  <span>ATS Score</span>
                </div>
              </div>

              <div className="dashboard-score-details">
                <div>
                  <span>
                    Overall rating
                  </span>

                  <strong>
                    {overall_rating}
                  </strong>
                </div>

                <div>
                  <span>
                    Detected strengths
                  </span>

                  <strong>
                    {strengths.length}
                  </strong>
                </div>

                <div>
                  <span>
                    Missing skills
                  </span>

                  <strong>
                    {missing_skills.length}
                  </strong>
                </div>
              </div>
            </div>
          </article>

          <article className="dashboard-resume-card">
            <div className="dashboard-resume-icon">
              📄
            </div>

            <div>
              <p className="dashboard-card-label">
                Analysed Resume
              </p>

              <h2>{filename}</h2>

              <p>
                Your resume has been processed
                successfully and is ready for job
                matching, cover-letter generation,
                and interview preparation.
              </p>
            </div>

            <div className="dashboard-resume-actions">
              <button
                type="button"
                onClick={() =>
                  navigate("/job-matcher")
                }
              >
                AI Job Recommendation
              </button>

              <button
                type="button"
                onClick={() =>
                  navigate("/cover-letter")
                }
              >
                Generate Cover Letter
              </button>

              <button
                type="button"
                onClick={() =>
                  navigate("/interview-coach")
                }
              >
                Start Interview Practice
              </button>
            </div>
          </article>
        </section>

        <section className="dashboard-analysis-grid">
          <article className="dashboard-section-card">
            <div className="dashboard-section-heading">
              <div className="dashboard-heading-icon success-icon">
                ✓
              </div>

              <div>
                <p className="dashboard-card-label">
                  What works well
                </p>

                <h2>Resume Strengths</h2>
              </div>
            </div>

            <div className="dashboard-list">
              {strengths.length > 0 ? (
                strengths.map(
                  (strength, index) => (
                    <div
                      className="dashboard-list-item success-item"
                      key={`${strength}-${index}`}
                    >
                      <span>✓</span>

                      <p>{strength}</p>
                    </div>
                  )
                )
              ) : (
                <p className="dashboard-empty-text">
                  No strengths were returned by
                  the analysis.
                </p>
              )}
            </div>
          </article>

          <article className="dashboard-section-card">
            <div className="dashboard-section-heading">
              <div className="dashboard-heading-icon warning-icon">
                !
              </div>

              <div>
                <p className="dashboard-card-label">
                  Skills to develop
                </p>

                <h2>Missing Skills</h2>
              </div>
            </div>

            <div className="dashboard-skill-tags">
              {missing_skills.length > 0 ? (
                missing_skills.map(
                  (skill, index) => (
                    <span
                      key={`${skill}-${index}`}
                    >
                      {skill}
                    </span>
                  )
                )
              ) : (
                <p className="dashboard-empty-text">
                  No major missing skills were
                  detected.
                </p>
              )}
            </div>
          </article>
        </section>

        <section className="dashboard-section-card dashboard-wide-card">
          <div className="dashboard-section-heading">
            <div className="dashboard-heading-icon suggestion-icon">
              ✦
            </div>

            <div>
              <p className="dashboard-card-label">
                Personalised guidance
              </p>

              <h2>
                AI Improvement Suggestions
              </h2>
            </div>
          </div>

          <div className="dashboard-suggestion-grid">
            {suggestions.length > 0 ? (
              suggestions.map(
                (suggestion, index) => (
                  <div
                    className="dashboard-suggestion"
                    key={`${suggestion}-${index}`}
                  >
                    <span>{index + 1}</span>

                    <p>{suggestion}</p>
                  </div>
                )
              )
            ) : (
              <p className="dashboard-empty-text">
                No suggestions were returned by
                the analysis.
              </p>
            )}
          </div>
        </section>

        <section className="dashboard-bottom-grid">
          <article className="dashboard-section-card">
            <div className="dashboard-section-heading">
              <div className="dashboard-heading-icon role-icon">
                💼
              </div>

              <div>
                <p className="dashboard-card-label">
                  Best-fit opportunities
                </p>

                <h2>Recommended Roles</h2>
              </div>
            </div>

            <div className="dashboard-role-list">
              {recommended_roles.length > 0 ? (
                recommended_roles.map(
                  (role, index) => (
                    <button
                      type="button"
                      key={`${role}-${index}`}
                      onClick={() =>
                        navigate("/jobs")
                      }
                    >
                      <span>{role}</span>
                      <span>→</span>
                    </button>
                  )
                )
              ) : (
                <p className="dashboard-empty-text">
                  No recommended roles were
                  returned.
                </p>
              )}
            </div>
          </article>

          <article className="dashboard-section-card">
            <div className="dashboard-section-heading">
              <div className="dashboard-heading-icon action-icon">
                ⚡
              </div>

              <div>
                <p className="dashboard-card-label">
                  Continue your journey
                </p>

                <h2>Quick Actions</h2>
              </div>
            </div>

            <div className="dashboard-quick-actions">
              <button
                type="button"
                onClick={() =>
                  navigate("/jobs")
                }
              >
                <span>💼</span>

                <div>
                  <strong>
                    Explore Jobs
                  </strong>

                  <small>
                    Find relevant live openings
                  </small>
                </div>
              </button>

              <button
                type="button"
                onClick={() =>
                  navigate("/cover-letter")
                }
              >
                <span>✉️</span>

                <div>
                  <strong>
                    Create Cover Letter
                  </strong>

                  <small>
                    Generate a tailored application
                  </small>
                </div>
              </button>

              <button
                type="button"
                onClick={() =>
                  navigate("/interview-coach")
                }
              >
                <span>🎤</span>

                <div>
                  <strong>
                    Interview Coach
                  </strong>

                  <small>
                    Practice technical and HR
                    interview questions
                  </small>
                </div>
              </button>

              <button
                type="button"
                onClick={() =>
                  navigate("/resume-builder")
                }
              >
                <span>📝</span>

                <div>
                  <strong>
                    Improve Resume
                  </strong>

                  <small>
                    Build a stronger resume
                  </small>
                </div>
              </button>

              <button
                type="button"
                onClick={() =>
                  downloadATSReport(
                    location.state
                  )
                }
              >
                <span>📥</span>

                <div>
                  <strong>
                    Download ATS Report
                  </strong>

                  <small>
                    Save your analysis as a PDF
                  </small>
                </div>
              </button>
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;