const tools = [
  {
    title: "Resume Analyzer",
    description: "Check ATS score, strengths, missing skills, and suggestions.",
    target: "resume-analyzer",
  },
  {
    title: "Resume Improvement",
    description: "Generate a humanized and editable ATS-friendly resume.",
    target: "resume-analyzer",
  },
  {
    title: "Live Job Matching",
    description: "Find relevant jobs based on your resume and skills.",
    target: "resume-analyzer",
  },
  {
    title: "Cover Letter",
    description: "Generate a tailored cover letter for a selected job.",
    target: "resume-analyzer",
  },
  {
    title: "Interview Coach",
    description: "Practice role-specific interview questions and answers.",
    target: "resume-analyzer",
  },
];

function CareerTools() {
  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <section className="bg-white px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
            Career Tools
          </p>

          <h2 className="mt-3 text-3xl font-bold text-slate-900">
            Everything needed for your job search
          </h2>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <article
              key={tool.title}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm"
            >
              <h3 className="text-xl font-bold text-slate-900">
                {tool.title}
              </h3>

              <p className="mt-3 leading-7 text-slate-600">
                {tool.description}
              </p>

              <button
                type="button"
                onClick={() => scrollToSection(tool.target)}
                className="mt-6 font-semibold text-blue-600 hover:text-blue-700"
              >
                Get Started →
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CareerTools;