function ResumeDecision({
  analysis,
  onImproveResume,
  onContinueToJobs,
}) {
  if (!analysis) return null;

  const atsScore = Number(analysis.ats_score) || 0;
  const isReady = atsScore >= 80;

  return (
    <section
      id="resume-decision"
      className="mx-auto max-w-6xl scroll-mt-24 px-6 pb-16"
    >
      <div
        className={`rounded-3xl border p-6 shadow-lg md:p-10 ${
          isReady
            ? "border-green-200 bg-green-50"
            : "border-amber-200 bg-amber-50"
        }`}
      >
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="max-w-3xl">
            <p
              className={`text-sm font-semibold uppercase tracking-[0.2em] ${
                isReady ? "text-green-700" : "text-amber-700"
              }`}
            >
              Resume Decision
            </p>

            <h2 className="mt-3 text-3xl font-bold text-slate-900">
              {isReady
                ? "Your resume is ready for job matching"
                : "Your resume could benefit from improvement"}
            </h2>

            <p className="mt-4 leading-7 text-slate-700">
              {isReady
                ? "Your estimated ATS score is already strong. You can continue directly to live job recommendations or improve the resume further."
                : "Improving the resume before applying may help strengthen keyword matching, project descriptions, and overall presentation."}
            </p>
          </div>

          <div className="min-w-56 rounded-2xl bg-white px-8 py-6 text-center shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Estimated ATS Score
            </p>

            <p
              className={`mt-2 text-5xl font-bold ${
                isReady ? "text-green-600" : "text-amber-600"
              }`}
            >
              {atsScore}%
            </p>

            <p
              className={`mt-2 font-semibold ${
                isReady ? "text-green-700" : "text-amber-700"
              }`}
            >
              {isReady ? "Application Ready" : "Improvement Recommended"}
            </p>
          </div>
        </div>

        <div className="mt-8 rounded-2xl bg-white/80 p-5">
          <h3 className="font-bold text-slate-900">
            Choose your next step
          </h3>

          <p className="mt-2 leading-7 text-slate-600">
            CareerPilot AI will never force changes to your resume. You can
            improve it first or continue directly to matching jobs.
          </p>
        </div>

        <div className="mt-7 flex flex-col gap-4 sm:flex-row">
          {isReady ? (
            <>
              <button
                type="button"
                onClick={onContinueToJobs}
                className="rounded-xl bg-green-600 px-7 py-3 font-semibold text-white transition hover:bg-green-700"
              >
                Find Live Jobs
              </button>

              <button
                type="button"
                onClick={onImproveResume}
                className="rounded-xl border border-green-600 bg-white px-7 py-3 font-semibold text-green-700 transition hover:bg-green-100"
              >
                Improve Anyway
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={onImproveResume}
                className="rounded-xl bg-blue-600 px-7 py-3 font-semibold text-white transition hover:bg-blue-700"
              >
                Improve My Resume
              </button>

              <button
                type="button"
                onClick={onContinueToJobs}
                className="rounded-xl border border-slate-400 bg-white px-7 py-3 font-semibold text-slate-700 transition hover:border-blue-500 hover:text-blue-600"
              >
                Continue to Jobs Anyway
              </button>
            </>
          )}
        </div>

        <p className="mt-5 text-sm leading-6 text-slate-500">
          ATS scores are estimates. Different employers may evaluate resumes
          differently.
        </p>
      </div>
    </section>
  );
}

export default ResumeDecision;