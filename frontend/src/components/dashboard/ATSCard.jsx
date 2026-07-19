import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

function ATSCard({ score, rating }) {
  const getGrade = (score) => {
    if (score >= 90) return "A+";
    if (score >= 80) return "A";
    if (score >= 70) return "B";
    if (score >= 60) return "C";
    return "D";
  };

  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl shadow-xl p-8 text-white">

      <h2 className="text-2xl font-bold mb-6">
        ATS Score
      </h2>

      <div className="grid grid-cols-2 gap-8 items-center">

        <div className="w-40 h-40 mx-auto">

          <CircularProgressbar
            value={score}
            text={`${score}%`}
            styles={buildStyles({
              textColor: "#fff",
              pathColor: "#fff",
              trailColor: "#5B7FFF",
              textSize: "18px",
            })}
          />

        </div>

        <div>

          <h1 className="text-5xl font-bold">
            {getGrade(score)}
          </h1>

          <p className="mt-3 text-blue-100">
            {rating}
          </p>

        </div>

      </div>

    </div>
  );
}

export default ATSCard;