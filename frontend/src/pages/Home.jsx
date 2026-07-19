import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import Footer from "../components/Footer";
import ResumeUploader from "./ResumeUploader";

function Home() {
  const navigate = useNavigate();

  function handleAnalysisComplete(result) {
    console.log("Analysis received in Home:", result);

    navigate("/dashboard", {
      state: result,
    });
  }

  return (
    <>
      <Navbar />

      <Hero />

      <section id="features">
        <Features />
      </section>

      <section id="resume-upload">
        <ResumeUploader
          onAnalysisComplete={handleAnalysisComplete}
        />
      </section>

      <section id="about" className="about-section">
        <div className="about-content">
          <p className="about-eyebrow">
            About CareerPilot AI
          </p>

          <h2>Your Complete AI Career Assistant</h2>

          <p>
            CareerPilot AI helps users analyse resumes,
            discover jobs, check job compatibility and
            generate personalised cover letters.
          </p>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default Home;