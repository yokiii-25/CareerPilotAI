import { useState } from "react";
import api from "../services/api";
import RecommendedJobs from "../components/dashboard/RecommendedJobs";

function JobMatcher() {
  const [resume, setResume] =useState("");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  async function handleRecommend() {
    if (!resume.trim()) {
      alert("Please paste your resume.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/recommend-jobs", {
        resume,
      });

      console.log(response.data);

      setJobs(response.data);
    } catch (err) {
      console.error(err);
      alert("Unable to fetch recommendations.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-5xl mx-auto py-10 px-6">

      <h1 className="text-4xl font-bold mb-6">
        🎯 AI Job Recommendation
      </h1>

      <textarea
        rows={12}
        value={resume}
        onChange={(e) => setResume(e.target.value)}
        placeholder="Paste your resume here..."
        className="w-full border rounded-xl p-5"
      />

      <button
        onClick={handleRecommend}
        className="mt-5 bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition"
      >
        {loading ? "Finding Jobs..." : "Recommend Jobs"}
      </button>

      <div className="mt-10">
        <RecommendedJobs jobs={jobs} />
      </div>

    </div>
  );
}

export default JobMatcher;