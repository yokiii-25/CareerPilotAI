import { useState } from "react";
import api from "../../services/api";

function ResumeMatchModal({ job, onClose, onMatchComplete }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  function handleFileChange(event) {
    const selectedFile = event.target.files?.[0];

    setError("");

    if (!selectedFile) {
      setFile(null);
      return;
    }

    if (selectedFile.type !== "application/pdf") {
      setError("Please choose a PDF resume.");
      event.target.value = "";
      setFile(null);
      return;
    }

    setFile(selectedFile);
  }

  async function handleAnalyzeMatch() {
    if (!file || loading) return;

    try {
      setLoading(true);
      setError("");

      setStatus("Uploading and analysing your resume...");

      const formData = new FormData();
      formData.append("file", file);

      const uploadResponse = await api.post(
        "/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const resumeText =
        uploadResponse.data?.resume_text || "";

      if (!resumeText.trim()) {
        throw new Error(
          "The resume was uploaded, but no text could be extracted."
        );
      }

      const jobDescription =
        job.description ||
        job.job_description ||
        "";

      if (!jobDescription.trim()) {
        throw new Error(
          "This job does not contain a description."
        );
      }

      setStatus(
        "Comparing your resume with this job..."
      );

      const matchResponse = await api.post(
        "/match-job",
        {
          resume_text: resumeText,
          job_description: jobDescription,
        }
      );

      if (
        typeof onMatchComplete === "function"
      ) {
        onMatchComplete(matchResponse.data);
      }

      onClose();
    } catch (requestError) {
      console.error(
        "Resume match failed:",
        requestError
      );

      const detail =
        requestError.response?.data?.detail;

      let errorMessage =
        "Unable to check the resume match.";

      if (typeof detail === "string") {
        errorMessage = detail;
      } else if (Array.isArray(detail)) {
        errorMessage = detail
          .map((item) => {
            const field = Array.isArray(item.loc)
              ? item.loc[item.loc.length - 1]
              : "field";

            return `${field}: ${item.msg}`;
          })
          .join(", ");
      } else if (
        requestError.response?.data?.message
      ) {
        errorMessage =
          requestError.response.data.message;
      } else if (requestError.message) {
        errorMessage = requestError.message;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
      setStatus("");
    }
  }

  const fileInputId = `resume-match-file-${
    job.id || job.job_id || "job"
  }`;

  return (
    <div
      className="resume-match-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="resume-match-title"
      onMouseDown={(event) => {
        if (
          event.target === event.currentTarget &&
          !loading
        ) {
          onClose();
        }
      }}
    >
      <div className="resume-match-modal">
        <button
          type="button"
          className="resume-match-close"
          onClick={onClose}
          disabled={loading}
          aria-label="Close"
        >
          ×
        </button>

        <p className="resume-match-label">
          AI job matching
        </p>

        <h2 id="resume-match-title">
          Match your resume
        </h2>

        <p className="resume-match-subtitle">
          Upload a PDF resume to compare it with{" "}
          <strong>
            {job.title ||
              job.job_title ||
              "this opportunity"}
          </strong>
          .
        </p>

        <label
          className="resume-match-upload"
          htmlFor={fileInputId}
        >
          <span className="resume-match-upload-icon">
            📄
          </span>

          <span>
            {file
              ? file.name
              : "Choose your resume"}
          </span>

          <small>PDF files only</small>
        </label>

        <input
          id={fileInputId}
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleFileChange}
          disabled={loading}
          hidden
        />

        {error && (
          <div className="resume-match-modal-error">
            {error}
          </div>
        )}

        {status && (
          <div className="resume-match-modal-status">
            <span className="resume-match-spinner" />
            {status}
          </div>
        )}

        <div className="resume-match-modal-actions">
          <button
            type="button"
            className="resume-match-cancel"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>

          <button
            type="button"
            className="resume-match-analyze"
            onClick={handleAnalyzeMatch}
            disabled={!file || loading}
          >
            {loading
              ? "Checking Match..."
              : "Analyze Match"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ResumeMatchModal;