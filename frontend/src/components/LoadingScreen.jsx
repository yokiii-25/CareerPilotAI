function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl p-10 w-96 text-center">

        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto"></div>

        <h2 className="text-2xl font-bold mt-6">
          Analyzing Resume...
        </h2>

        <p className="text-gray-500 mt-3">
          Gemini AI is reviewing your resume.
        </p>

        <div className="mt-6 space-y-2 text-left text-gray-600">
          <p>📄 Reading PDF...</p>
          <p>🧠 Analyzing ATS Score...</p>
          <p>💪 Finding Strengths...</p>
          <p>⚠ Finding Missing Skills...</p>
          <p>🤖 Generating Suggestions...</p>
        </div>

      </div>
    </div>
  );
}

export default LoadingScreen;