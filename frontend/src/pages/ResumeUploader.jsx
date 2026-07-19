import { useRef, useState } from "react";
import api from "../services/api";
import LoadingScreen from "../components/LoadingScreen";

function ResumeUploader({ onAnalysisComplete }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  function handleFileChange(event) {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) {
      setFile(null);
      return;
    }

    const isPdf =
      selectedFile.type === "application/pdf" ||
      selectedFile.name.toLowerCase().endsWith(".pdf");

    if (!isPdf) {
      alert("Please upload a valid PDF file.");
      event.target.value = "";
      setFile(null);
      return;
    }

    setFile(selectedFile);
  }

  async function handleUpload() {
    if (!file || loading) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);

      const response = await api.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const result = {
        ...(response.data?.analysis || {}),
        filename: response.data?.filename || file.name,
        resume_text: response.data?.resume_text || "",
      };

      if (!result.resume_text.trim()) {
        throw new Error(
          "The resume was uploaded, but no readable text could be extracted."
        );
      }

      localStorage.setItem("resumeText", result.resume_text);
      localStorage.setItem("resumeFilename", result.filename);
      localStorage.setItem(
        "resumeAnalysis",
        JSON.stringify(result)
      );

      console.log(
        "Resume text and analysis saved successfully."
      );

      if (typeof onAnalysisComplete === "function") {
        onAnalysisComplete(result);
      } else {
        console.error(
          "The onAnalysisComplete function was not provided."
        );
      }

      // Reset the selected file after successful analysis.
      setFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Resume analysis failed:", error);

      let message =
        "Failed to analyze the resume. Please try again.";

      if (error.code === "ECONNABORTED") {
        message =
          "The AI server took too long to respond. It may be waking up. Please wait a moment and try again.";
      } else if (!error.response) {
        message =
          "Unable to connect to the backend server. Please check your internet connection and try again.";
      } else {
        const detail = error.response?.data?.detail;

        if (typeof detail === "string") {
          message = detail;
        } else if (Array.isArray(detail)) {
          message = detail
            .map((item) => item.msg || "Validation error")
            .join(", ");
        } else if (error.message) {
          message = error.message;
        }
      }

      alert(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {loading && <LoadingScreen />}

      <section className="mx-auto mt-8 max-w-3xl rounded-2xl bg-white p-6 shadow-lg sm:p-10">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
            AI Resume Analyzer
          </p>

          <h2 className="mt-3 text-3xl font-bold text-slate-900">
            📄 Upload Your Resume
          </h2>

          <p className="mt-3 text-slate-500">
            Upload your resume in PDF format to receive
            an AI-powered ATS analysis.
          </p>
        </div>

        <div className="mt-8">
          <label
            htmlFor="resume-file"
            className="mb-2 block font-medium text-slate-700"
          >
            Choose your resume
          </label>

          <input
            ref={fileInputRef}
            id="resume-file"
            type="file"
            accept=".pdf,application/pdf"
            disabled={loading}
            onChange={handleFileChange}
            className="w-full rounded-lg border border-slate-300 bg-white p-3 disabled:cursor-not-allowed disabled:bg-slate-100"
          />
        </div>

        {file && (
          <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-4">
            <p className="break-words text-green-800">
              <strong>Selected File:</strong>{" "}
              {file.name}
            </p>
          </div>
        )}

        {loading && (
          <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-center">
            <p className="font-semibold text-amber-900">
              Starting AI server and analyzing your resume...
            </p>

            <p className="mt-1 text-sm text-amber-700">
              The first request may take up to a minute
              while the backend wakes up.
            </p>
          </div>
        )}

        <button
          type="button"
          disabled={!file || loading}
          onClick={handleUpload}
          className={`mt-8 w-full rounded-xl py-4 font-semibold text-white transition ${
            file && !loading
              ? "bg-blue-600 hover:bg-blue-700"
              : "cursor-not-allowed bg-slate-400"
          }`}
        >
          {loading
            ? "Analyzing Resume..."
            : "Analyze Resume"}
        </button>
      </section>
    </>
  );
}

export default ResumeUploader;