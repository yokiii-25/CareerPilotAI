const steps = [
  {
    title: "Upload Resume",
    description: "Upload your PDF resume",
  },
  {
    title: "AI Analysis",
    description: "Review ATS score and feedback",
  },
  {
    title: "Improve Resume",
    description: "Edit and optimize your resume",
  },
  {
    title: "Live Jobs",
    description: "Find matching job openings",
  },
  {
    title: "Cover Letter",
    description: "Generate a tailored application",
  },
  {
    title: "Interview Coach",
    description: "Prepare for interviews",
  },
];

function CareerPipeline({ currentStep = 1 }) {
  return (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
            Your Career Journey
          </p>

          <h2 className="mt-3 text-3xl font-bold text-slate-900">
            One guided pipeline from resume to interview
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-600">
            CareerPilot AI guides you through every stage of the job
            application process.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {steps.map((step, index) => {
            const stepNumber = index + 1;
            const completed = stepNumber < currentStep;
            const active = stepNumber === currentStep;

            return (
              <div
                key={step.title}
                className={`relative rounded-2xl border p-5 text-center transition duration-300 ${
                  completed
                    ? "border-green-200 bg-green-50"
                    : active
                      ? "border-blue-500 bg-blue-50 shadow-lg shadow-blue-100"
                      : "border-slate-200 bg-white"
                }`}
              >
                <div
                  className={`mx-auto flex h-11 w-11 items-center justify-center rounded-full font-bold transition ${
                    completed
                      ? "bg-green-600 text-white"
                      : active
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {completed ? "✓" : stepNumber}
                </div>

                <h3 className="mt-4 font-semibold text-slate-900">
                  {step.title}
                </h3>

                <p className="mt-2 min-h-10 text-sm leading-5 text-slate-500">
                  {step.description}
                </p>

                <p
                  className={`mt-4 text-xs font-semibold uppercase tracking-wider ${
                    completed
                      ? "text-green-700"
                      : active
                        ? "text-blue-700"
                        : "text-slate-400"
                  }`}
                >
                  {completed
                    ? "Completed"
                    : active
                      ? "Current step"
                      : "Coming next"}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default CareerPipeline;