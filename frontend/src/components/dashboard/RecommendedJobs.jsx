import Card from "../common/Card";

function RecommendedJobs({ jobs = [] }) {
  return (
    <Card>
      <h2 className="text-2xl font-bold mb-5">
        ⭐ Recommended Jobs
      </h2>

      {jobs.length === 0 ? (
        <p className="text-gray-500">
          No recommendations yet.
        </p>
      ) : (
        <div className="space-y-4">
          {jobs.map((job, index) => (
            <div
              key={index}
              className="border rounded-xl p-5 hover:bg-gray-50 transition"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-lg">
                    {job.title}
                  </h3>

                  <p className="text-gray-500">
                    {job.company}
                  </p>
                </div>

                <div className="text-blue-600 font-bold text-xl">
                  {job.score}%
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {job.matched_skills?.map((skill) => (
                  <span
                    key={skill}
                    className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

export default RecommendedJobs;