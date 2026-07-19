function AnalysisResults({ analysis }) {
  if (!analysis) return null;

  const {
    ats_score,
    overall_rating,
    strengths = [],
    missing_skills = [],
    suggestions = [],
    recommended_roles = [],
    filename,
  } = analysis;

  function getScoreStyle(score) {
    if (score >= 80) {
      return {
        text: "text-green-700",
        background: "bg-green-50",
        border: "border-green-200",
        label: "Strong",
      };
    }

    if (score >= 60) {
      return {
        text: "text-amber-700",
        background: "bg-amber-50",
        border: "border-amber-200",
        label: "Needs Improvement",
      };
    }

    return {
      text: "text-red-700",
      background: "bg-red-50",
      border: "border-red-200",
      label: "Needs Attention",
    };
  }

  const scoreStyle = getScoreStyle(Number(ats_score) || 0);

  return (
    <section
      id="analysis-results"
      className="mx-auto max-w-6xl scroll-mt-24 px-6 pb-16"
    >
      <div className="rounded-3xl bg-white p-6 shadow-lg md:p-10">
        <div className="flex flex-col gap-6 border-b border-slate-200 pb-8 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
              Resume Analysis
            </p>

            <h2 className="mt-3 text-3xl font-bold text-slate-900">
              Your ATS Report
            </h2>

            <p className="mt-3 text-slate-500">
              {filename || "Uploaded resume"}
            </p>
          </div>

          <div
            className={`rounded-2xl border px-8 py-6 text-center ${scoreStyle.background} ${scoreStyle.border}`}
          >
            <p className="text-sm font-medium text-slate-500">
              Estimated ATS Score
            </p>

            <p className={`mt-1 text-5xl font-bold ${scoreStyle.text}`}>
              {ats_score ?? 0}%
            </p>

            <p className={`mt-2 font-semibold ${scoreStyle.text}`}>
              {scoreStyle.label}
            </p>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-blue-100 bg-blue-50 p-6">
          <h3 className="text-lg font-bold text-slate-900">
            Overall Rating
          </h3>

          <p className="mt-3 leading-7 text-slate-700">
            {overall_rating || "No overall rating was returned."}
          </p>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <ResultCard
            title="Strengths"
            items={strengths}
            emptyText="No strengths were identified."
          />

          <ResultCard
            title="Recommended Skills"
            items={missing_skills}
            emptyText="No additional skill recommendations were identified."
          />

          <ResultCard
            title="Resume Suggestions"
            items={suggestions}
            emptyText="No resume suggestions were returned."
          />

          <ResultCard
            title="Recommended Roles"
            items={recommended_roles}
            emptyText="No recommended roles were returned."
          />
        </div>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <p className="text-sm leading-6 text-slate-600">
            This ATS score is an estimate. Different employers and applicant
            tracking systems may evaluate resumes differently. Review every
            recommendation before adding it to your resume.
          </p>
        </div>
      </div>
    </section>
  );
}

function ResultCard({ title, items, emptyText }) {
  const safeItems = Array.isArray(items) ? items : [];

  return (
    <article className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
      <h3 className="text-xl font-bold text-slate-900">{title}</h3>

      {safeItems.length > 0 ? (
        <ul className="mt-5 space-y-4">
          {safeItems.map((item, index) => (
            <li
              key={`${title}-${index}`}
              className="flex gap-3 leading-7 text-slate-700"
            >
              <span className="mt-1 font-bold text-blue-600">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-slate-500">{emptyText}</p>
      )}
    </article>
  );
}

export default AnalysisResults;