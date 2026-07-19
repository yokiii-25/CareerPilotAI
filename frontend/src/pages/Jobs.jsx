import { useState } from "react";
import "../styles/jobs.css";

import JobFilters from "../components/jobs/JobFilters";
import JobList from "../components/jobs/JobList";
import JobSearch from "../components/jobs/JobSearch";


const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

function Jobs({ resumeText = "" }) {
  const [jobs, setJobs] = useState([]);
  const [query, setQuery] = useState("Python Developer");
  const [country, setCountry] = useState("in");
  const [datePosted, setDatePosted] = useState("all");
  const [remoteOnly, setRemoteOnly] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  const searchJobs = async () => {
    const cleanQuery = query.trim();

    if (!cleanQuery) {
      setError("Please enter a job title or skill.");
      return;
    }

    setLoading(true);
    setError("");
    setSearched(true);

    const params = new URLSearchParams({
      query: cleanQuery,
      page: "1",
      num_pages: "1",
      country,
      date_posted: datePosted,
      remote_jobs_only: String(remoteOnly),
    });

    try {
      const response = await fetch(
        `${API_BASE_URL}/jobs/search?${params.toString()}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Unable to search for jobs."
        );
      }

      setJobs(Array.isArray(data.jobs) ? data.jobs : []);
    } catch (requestError) {
      console.error("Job search failed:", requestError);
      setJobs([]);
      setError(
        requestError.message ||
          "Something went wrong while searching for jobs."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="jobs-page">
      <section className="jobs-hero">
        <p className="jobs-eyebrow">Live opportunities</p>

        <h1>Find jobs that match your career goals</h1>

        <p>
          Search current job openings, review the role details,
          and compare each opportunity with your resume.
        </p>
      </section>

      <section className="jobs-search-panel">
        <JobSearch
          query={query}
          setQuery={setQuery}
          onSearch={searchJobs}
          loading={loading}
        />

        <JobFilters
          country={country}
          setCountry={setCountry}
          datePosted={datePosted}
          setDatePosted={setDatePosted}
          remoteOnly={remoteOnly}
          setRemoteOnly={setRemoteOnly}
          onApply={searchJobs}
          loading={loading}
        />
      </section>

      {error && (
        <div className="jobs-message jobs-error">
          {error}
        </div>
      )}

      <JobList
        jobs={jobs}
        loading={loading}
      />
    </main>
  );
}

export default Jobs;