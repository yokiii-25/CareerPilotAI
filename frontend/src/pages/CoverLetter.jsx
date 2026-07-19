import { useEffect, useState } from "react";
import api from "../services/api";
import {
  downloadCoverLetterPDF,
} from "../services/pdfService";
import "../styles/coverLetter.css";

function CoverLetter() {
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

  const [coverLetter, setCoverLetter] =
    useState("");
  const [loading, setLoading] =
    useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] =
    useState(false);

  useEffect(() => {
    const savedJob =
      sessionStorage.getItem("coverLetterJob");

    if (savedJob) {
      try {
        const job = JSON.parse(savedJob);

        setJobTitle(job.title || "");
        setCompany(job.company || "");
        setJobDescription(
          job.description || ""
        );
      } catch (parseError) {
        console.error(
          "Unable to load selected job:",
          parseError
        );
      }
    }

    const savedResumeText =
      localStorage.getItem("resumeText");

    const savedFilename =
      localStorage.getItem("resumeFilename");

    if (savedResumeText?.trim()) {
      setSavedResumeAvailable(true);
      setSavedResumeFilename(
        savedFilename || "Previously analysed resume"
      );
    }
  }, []);

  function handleFileChange(event) {
    const selectedFile =
      event.target.files?.[0];

    setError("");
    setCoverLetter("");
    setCopied(false);

    if (!selectedFile) {
      setFile(null);
      return;
    }

    if (
      selectedFile.type !== "application/pdf"
    ) {
      setError(
        "Please upload a PDF resume."
      );

      event.target.value = "";
      setFile(null);
      return;
    }

    setFile(selectedFile);
  }

  async function getResumeText() {
    /*
     * A newly selected PDF takes priority.
     * Otherwise, reuse the previously saved
     * resume text from localStorage.
     */

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
        "Please provide a job description."
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
      setCoverLetter("");
      setCopied(false);

      const resumeText =
        await getResumeText();

      const response = await api.post(
        "/generate-cover-letter",
        {
          resume_text: resumeText,
          job_title: jobTitle.trim(),
          company: company.trim(),
          job_description:
            jobDescription.trim(),
        }
      );

      const generatedLetter =
        response.data?.cover_letter || "";

      if (!generatedLetter.trim()) {
        throw new Error(
          "The AI did not return a cover letter."
        );
      }

      setCoverLetter(generatedLetter);
    } catch (requestError) {
      console.error(
        "Cover letter generation failed:",
        requestError
      );

      const detail =
        requestError.response?.data?.detail;

      let message =
        "Unable to generate the cover letter.";

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

  async function handleCopy() {
    if (!coverLetter.trim()) return;

    try {
      await navigator.clipboard.writeText(
        coverLetter
      );

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (copyError) {
      console.error(
        "Unable to copy cover letter:",
        copyError
      );

      setError(
        "Unable to copy the cover letter."
      );
    }
  }

  return (
    <main className="cover-letter-page">
      <section className="cover-letter-header">
        <p className="cover-letter-eyebrow">
          AI writing assistant
        </p>

        <h1>AI Cover Letter Generator</h1>

        <p>
          Use your previously analysed resume or
          upload a new PDF to generate a
          personalised cover letter.
        </p>
      </section>

      <section className="cover-letter-layout">
        <div className="cover-letter-form-card">
          <div className="cover-letter-field">
            <label htmlFor="job-title">
              Job title
            </label>

            <input
              id="job-title"
              type="text"
              value={jobTitle}
              onChange={(event) =>
                setJobTitle(event.target.value)
              }
              placeholder="Junior Python Developer"
            />
          </div>

          <div className="cover-letter-field">
            <label htmlFor="company">
              Company
            </label>

            <input
              id="company"
              type="text"
              value={company}
              onChange={(event) =>
                setCompany(event.target.value)
              }
              placeholder="Company name"
            />
          </div>

          <div className="cover-letter-field">
            <label htmlFor="job-description">
              Job description
            </label>

            <textarea
              id="job-description"
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

          <div className="cover-letter-field">
            <label htmlFor="cover-letter-resume">
              Resume
            </label>

            {savedResumeAvailable && !file && (
              <div className="cover-letter-saved-resume">
                <strong>
                  Saved resume available
                </strong>

                <span>
                  {savedResumeFilename}
                </span>

                <small>
                  You can generate the letter
                  without uploading it again.
                </small>
              </div>
            )}

            <input
              id="cover-letter-resume"
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileChange}
            />

            {file && (
              <p className="cover-letter-file-name">
                New resume selected: {file.name}
              </p>
            )}
          </div>

          {error && (
            <div className="cover-letter-error">
              {error}
            </div>
          )}

          <button
            type="button"
            className="cover-letter-generate"
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
              ? "Generating Cover Letter..."
              : "Generate Cover Letter"}
          </button>
        </div>

        <div className="cover-letter-output-card">
          <div className="cover-letter-output-header">
            <div>
              <p className="cover-letter-output-label">
                Generated letter
              </p>

              <h2>Your Cover Letter</h2>
            </div>

            {coverLetter && (
              <div className="cover-letter-actions">
                <button
                  type="button"
                  className="cover-letter-copy"
                  onClick={handleCopy}
                >
                  {copied
                    ? "Copied!"
                    : "Copy"}
                </button>

                <button
                  type="button"
                  className="cover-letter-download"
                  onClick={() =>
                    downloadCoverLetterPDF({
                      coverLetter,
                      candidateName:
                        "CareerPilot AI User",
                      companyName:
                        company ||
                        "Company",
                      jobTitle:
                        jobTitle ||
                        "Position",
                    })
                  }
                >
                  📥 Download PDF
                </button>
              </div>
            )}
          </div>

          {loading ? (
            <div className="cover-letter-empty">
              Generating a personalized cover
              letter...
            </div>
          ) : coverLetter ? (
            <textarea
              className="cover-letter-editor"
              value={coverLetter}
              onChange={(event) =>
                setCoverLetter(
                  event.target.value
                )
              }
            />
          ) : (
            <div className="cover-letter-empty">
              Your generated cover letter will
              appear here.
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default CoverLetter;