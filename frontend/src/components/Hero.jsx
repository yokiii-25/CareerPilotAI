import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">
        <p className="hero-badge">
          Your AI Career Companion
        </p>

        <h1>
          Land Your Dream Job With AI
        </h1>

        <p className="hero-description">
          Analyse your resume, discover matching
          jobs, generate cover letters and prepare
          for interviews using AI.
        </p>

        <div className="hero-actions">
          <a
            href="#resume-upload"
            className="hero-primary-button"
          >
            Upload Resume
          </a>

          <Link
            to="/jobs"
            className="hero-secondary-button"
          >
            Explore Jobs
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Hero;