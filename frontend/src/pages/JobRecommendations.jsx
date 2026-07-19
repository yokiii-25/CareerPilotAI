import { useEffect, useState } from "react";

export default function JobRecommendations() {
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchJobs();
  }, []);

  async function fetchJobs() {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/recommend-jobs",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            resume:
              "Full Stack Developer skilled in Java, Python, React.js, Node.js, FastAPI, MongoDB, PostgreSQL, Docker and AWS.",
            location: "Chennai",
            country: "in",
            num_pages: 1,
          }),
        }
      );

      const data = await response.json();

      setJobs(data.jobs || []);
      setSearchQuery(data.search_query || "");
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  }

  if (loading)
    return (
      <div className="text-center mt-20 text-xl">
        Loading Jobs...
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto p-8">

      <h1 className="text-4xl font-bold mb-3">
        AI Job Recommendations
      </h1>

      <p className="text-gray-500 mb-8">
        Search Query: {searchQuery}
      </p>

      <div className="grid gap-6">

        {jobs.map((job) => (

          <div
            key={job.job_id}
            className="border rounded-xl shadow-md p-6 bg-white"
          >

            <h2 className="text-2xl font-semibold">
              {job.title}
            </h2>

            <p className="text-gray-600">
              {job.company}
            </p>

            <p className="mt-2">
              📍 {job.location}
            </p>

            <p className="mt-2">
              ⭐ Match Score:
              <span className="font-bold text-green-600">
                {" "}
                {job.match_score}%
              </span>
            </p>

            <p className="mt-2">
              💰 Salary:
              {" "}
              {job.salary || "Not Mentioned"}
            </p>

            <div className="mt-4">
              <h3 className="font-semibold">
                Matched Skills
              </h3>

              <div className="flex flex-wrap gap-2 mt-2">

                {job.matched_skills.map((skill) => (

                  <span
                    key={skill}
                    className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                  >
                    {skill}
                  </span>

                ))}

              </div>
            </div>

            <a
              href={job.apply_link}
              target="_blank"
              rel="noreferrer"
              className="inline-block mt-6 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
            >
              Apply Now
            </a>

          </div>

        ))}

      </div>

    </div>
  );
}