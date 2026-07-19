import FeatureCard from "./FeatureCard";

function Features() {
  return (
    <section className="max-w-7xl mx-auto py-20 px-8">

      <h2 className="text-4xl font-bold text-center mb-14">
        Why Choose CareerPilot AI?
      </h2>

      <div className="grid md:grid-cols-3 gap-8">

        <FeatureCard
          emoji="📄"
          title="Resume Analysis"
          description="Get an AI-powered ATS score with detailed suggestions."
        />

        <FeatureCard
          emoji="🎯"
          title="Job Matching"
          description="Compare your resume with any job description."
        />

        <FeatureCard
          emoji="🎤"
          title="Interview Coach"
          description="Practice interview questions generated from your resume."
        />

      </div>

    </section>
  );
}

export default Features;
