import Card from "../common/Card";

function ResumeCard({ filename, roles }) {
  return (
    <Card>
      <h2 className="text-2xl font-bold mb-5">
        📄 Resume
      </h2>

      <div className="border rounded-xl p-5">

        <p className="font-semibold text-lg">
          {filename}
        </p>

        <p className="text-green-600 mt-2">
          ✅ Uploaded Successfully
        </p>

        <div className="mt-6">

          <h3 className="font-semibold text-gray-700 mb-3">
            🎯 Recommended Roles
          </h3>

          {roles && roles.length > 0 ? (

            <div className="flex flex-wrap gap-2">

              {roles.map((role, index) => (

                <span
                  key={index}
                  className="bg-blue-100 text-blue-700 px-3 py-2 rounded-full text-sm"
                >
                  {role}
                </span>

              ))}

            </div>

          ) : (

            <p className="text-gray-500">
              No recommended roles available.
            </p>

          )}

        </div>

      </div>
    </Card>
  );
}

export default ResumeCard;