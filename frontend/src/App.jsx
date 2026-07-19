import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./App.css";

import Home from "./pages/Home";
import ResumeUploader from "./pages/ResumeUploader";
import Dashboard from "./pages/Dashboard";
import JobMatcher from "./pages/JobMatcher";
import ResumeBuilder from "./pages/ResumeBuilder";
import CoverLetter from "./pages/CoverLetter";
import JobRecommendations from "./pages/JobRecommendations";
import Jobs from "./pages/Jobs";
import InterviewCoach from "./pages/InterviewCoach";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/upload" element={<ResumeUploader />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/job-matcher" element={<JobMatcher />} />
        <Route path="/resume-builder" element={<ResumeBuilder />} />
        <Route path="/cover-letter" element={<CoverLetter />} />
        <Route
          path="/job-recommendations"
          element={<JobRecommendations />}
        />
        <Route path="/jobs" element={<Jobs />} />
        <Route
          path="/interview-coach"
          element={<InterviewCoach />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;