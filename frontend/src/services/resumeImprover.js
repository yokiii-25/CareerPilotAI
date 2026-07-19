import axios from "axios";

const API_URL = "http://127.0.0.1:8000";

export async function generateImprovedResume(
  resumeText,
  analysis
) {
  const response = await axios.post(
    `${API_URL}/resume-improver/generate`,
    {
      resume_text: resumeText,
      analysis,
    }
  );

  if (!response.data?.success) {
    throw new Error("The backend did not generate an improved resume.");
  }

  return response.data.improved_resume;
}