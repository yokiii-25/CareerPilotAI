import { useEffect, useState } from "react";

import api from "../services/api";
import InterviewQuestionCard from "../components/InterviewQuestionCard";

import "../styles/interviewCoach.css";

const EMPTY_RESULTS = {
  technical_questions: [],
  behavioral_questions: [],
  resume_questions: [],
  preparation_tips: [],
};

function InterviewCoach() {
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [
    jobDescription,
    setJobDescription,
  ] = useState("");

  const [file, setFile] = useState(null);

  const [
    savedResumeAvailable,
    setSavedResumeAvailable,
  ] = useState(false);

  const [
    savedResumeFilename,
    setSavedResumeFilename,
  ] = useState("");

  const [results, setResults] =
    useState(EMPTY_RESULTS);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    const savedResumeText =
      localStorage.getItem("resumeText");

    const savedFilename =
      localStorage.getItem("resumeFilename");

    if (savedResumeText?.trim()) {
      setSavedResumeAvailable(true);

      setSavedResumeFilename(
        savedFilename ||
          "Previously analysed resume"
      );
    }

    const selectedJob =
      sessionStorage.getItem("interviewCoachJob");

    if (selectedJob) {
      try {
        const job = JSON.parse(selectedJob);

        setJobTitle(job.title || "");
        setCompany(job.company || "");
        setJobDescription(
          job.description || ""
        );
      } catch (parseError) {
        console.error(
          "Unable to load the selected job:",
          parseError
        );
      }
    }
  }, []);

  function clearResults() {
    setResults({
      technical_questions: [],
      behavioral_questions: [],
      resume_questions: [],
      preparation_tips: [],
    });
  }

  function handleFileChange(event) {
    const selectedFile =
      event.target.files?.[0];

    setError("");
    clearResults();

    if (!selectedFile) {
      setFile(null);
      return;
    }

    if (
      selectedFile.type !== "application/pdf"
    ) {
      setError(
        "Please select a PDF resume."
      );

      event.target.value = "";
      setFile(null);
      return;
    }

    setFile(selectedFile);
  }

  async function getResumeText() {
    if (file) {
      const formData = new FormData();

      formData.append("file", file);

      const uploadResponse = await api.post(
        "/upload",
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      const extractedText =
        uploadResponse.data?.resume_text || "";

      if (!extractedText.trim()) {
        throw new Error(
          "The resume was uploaded, but no text could be extracted."
        );
      }

      const filename =
        uploadResponse.data?.filename ||
        file.name;

      localStorage.setItem(
        "resumeText",
        extractedText
      );

      localStorage.setItem(
        "resumeFilename",
        filename
      );

      setSavedResumeAvailable(true);
      setSavedResumeFilename(filename);

      return extractedText;
    }

    const savedResumeText =
      localStorage.getItem("resumeText") || "";

    if (!savedResumeText.trim()) {
      throw new Error(
        "Please upload a resume or analyse one from the Home page first."
      );
    }

    return savedResumeText;
  }

  async function handleGenerate() {
    if (loading) return;

    if (!jobTitle.trim()) {
      setError(
        "Please provide the job title."
      );
      return;
    }

    if (!jobDescription.trim()) {
      setError(
        "Please provide the job description."
      );
      return;
    }

    if (!file && !savedResumeAvailable) {
      setError(
        "Please upload a resume or analyse one from the Home page first."
      );
      return;
    }

    try {
      setLoading(true);
      setError("");
      clearResults();

      const resumeText =
        await getResumeText();

      const response = await api.post(
        "/interview-coach",
        {
          resume_text: resumeText,
          job_title: jobTitle.trim(),
          company: company.trim(),
          job_description:
            jobDescription.trim(),
        }
      );

      const data = response.data;

      const generatedResults = {
        technical_questions:
          data?.technical_questions || [],
        behavioral_questions:
          data?.behavioral_questions || [],
        resume_questions:
          data?.resume_questions || [],
        preparation_tips:
          data?.preparation_tips || [],
      };

      const totalQuestions =
        generatedResults
          .technical_questions.length +
        generatedResults
          .behavioral_questions.length +
        generatedResults
          .resume_questions.length;

      if (totalQuestions === 0) {
        throw new Error(
          "The AI did not return interview questions."
        );
      }

      setResults(generatedResults);
    } catch (requestError) {
      console.error(
        "Interview question generation failed:",
        requestError
      );

      const detail =
        requestError.response?.data?.detail;

      let message =
        "Unable to generate interview questions.";

      if (typeof detail === "string") {
        message = detail;
      } else if (Array.isArray(detail)) {
        message = detail
          .map((item) => item.msg)
          .join(", ");
      } else if (requestError.message) {
        message = requestError.message;
      }

      setError(message);
    } finally {
      setLoading(false);
    }
  }

  const hasResults =
    results.technical_questions.length > 0 ||
    results.behavioral_questions.length >
      0 ||
    results.resume_questions.length > 0;

  return (
    <main className="interview-coach-page">
      <section className="interview-coach-header">
        <p className="interview-coach-eyebrow">
          AI-powered interview preparation
        </p>

        <h1>AI Interview Coach</h1>

        <p>
          Generate personalised technical,
          behavioural and resume-based interview
          questions using your saved resume and a
          job description.
        </p>
      </section>

      <section className="interview-coach-layout">
        <div className="interview-coach-form-card">
          <div className="interview-coach-field">
            <label htmlFor="interview-job-title">
              Job title
            </label>

            <input
              id="interview-job-title"
              type="text"
              value={jobTitle}
              onChange={(event) =>
                setJobTitle(event.target.value)
              }
              placeholder="Frontend Developer"
            />
          </div>

          <div className="interview-coach-field">
            <label htmlFor="interview-company">
              Company
            </label>

            <input
              id="interview-company"
              type="text"
              value={company}
              onChange={(event) =>
                setCompany(event.target.value)
              }
              placeholder="Company name"
            />
          </div>

          <div className="interview-coach-field">
            <label htmlFor="interview-description">
              Job description
            </label>

            <textarea
              id="interview-description"
              value={jobDescription}
              onChange={(event) =>
                setJobDescription(
                  event.target.value
                )
              }
              placeholder="Paste the job description here..."
              rows={12}
            />
          </div>

          <div className="interview-coach-field">
            <label htmlFor="interview-resume">
              Resume
            </label>

            {savedResumeAvailable && !file && (
              <div className="interview-saved-resume">
                <strong>
                  Saved resume available
                </strong>

                <span>
                  {savedResumeFilename}
                </span>

                <small>
                  You can generate interview
                  questions without uploading it
                  again.
                </small>
              </div>
            )}

            <input
              id="interview-resume"
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileChange}
            />

            {file && (
              <p className="interview-file-name">
                New resume selected: {file.name}
              </p>
            )}
          </div>

          {error && (
            <div className="interview-coach-error">
              {error}
            </div>
          )}

          <button
            type="button"
            className="interview-generate-button"
            onClick={handleGenerate}
            disabled={
              (!file &&
                !savedResumeAvailable) ||
              !jobTitle.trim() ||
              !jobDescription.trim() ||
              loading
            }
          >
            {loading
              ? "Generating Questions..."
              : "Generate Interview Questions"}
          </button>
        </div>

        <div className="interview-coach-results">
          {loading ? (
            <div className="interview-empty-state">
              <div className="interview-loader" />

              <h2>
                Preparing your interview
              </h2>

              <p>
                Analysing your resume and job
                description to create personalised
                questions.
              </p>
            </div>
          ) : hasResults ? (
            <>
              <QuestionSection
                title="Technical Questions"
                description="Role-specific questions based on the job requirements."
                questions={
                  results.technical_questions
                }
              />

              <QuestionSection
                title="Behavioral Questions"
                description="Questions about communication, teamwork and problem-solving."
                questions={
                  results.behavioral_questions
                }
              />

              <QuestionSection
                title="Resume-Based Questions"
                description="Questions based on your projects, skills and experience."
                questions={
                  results.resume_questions
                }
              />

              {results.preparation_tips.length >
                0 && (
                <section className="interview-tips-section">
                  <div className="interview-section-heading">
                    <p>Final preparation</p>

                    <h2>
                      Interview Preparation Tips
                    </h2>
                  </div>

                  <ol className="interview-tips-list">
                    {results.preparation_tips.map(
                      (tip, index) => (
                        <li key={`${tip}-${index}`}>
                          <span>{index + 1}</span>
                          <p>{tip}</p>
                        </li>
                      )
                    )}
                  </ol>
                </section>
              )}
            </>
          ) : (
            <div className="interview-empty-state">
              <div className="interview-empty-icon">
                🎤
              </div>

              <h2>
                Your interview preparation will
                appear here
              </h2>

              <p>
                Enter the job details and generate
                personalised questions with
                suggested answers.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function QuestionSection({
  title,
  description,
  questions,
}) {
  if (!questions?.length) {
    return null;
  }

  return (
    <section className="interview-question-section">
      <div className="interview-section-heading">
        <p>{description}</p>
        <h2>{title}</h2>
      </div>

      <div className="interview-question-list">
        {questions.map((item, index) => (
          <InterviewQuestionCard
            key={`${title}-${index}`}
            number={index + 1}
            question={item.question}
            answer={item.suggested_answer}
          />
        ))}
      </div>
    </section>
  );
}

export default InterviewCoach;