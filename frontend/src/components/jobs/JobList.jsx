import JobCard from "./JobCard";

function JobList({ jobs, loading }) {
  if (loading) {
    return (
      <div className="jobs-message">
        Loading live jobs...
      </div>
    );
  }

  if (!Array.isArray(jobs) || jobs.length === 0) {
    return (
      <div className="jobs-message">
        No jobs found. Try another search.
      </div>
    );
  }

  return (
    <div className="job-list">
      {jobs.map((job, index) => (
        <JobCard
          key={job.job_id || job.id || index}
          job={job}
        />
      ))}
    </div>
  );
}

export default JobList;