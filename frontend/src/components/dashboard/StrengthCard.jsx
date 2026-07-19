import Card from "../common/Card";

function StrengthCard({ strengths }) {
  return (
    <Card>
      <h2 className="text-2xl font-bold mb-5">
        💪 Strengths
      </h2>

      <div className="space-y-3">
        {strengths.map((item, index) => (
          <div
            key={index}
            className="bg-green-100 text-green-700 px-4 py-3 rounded-xl"
          >
            ✔ {item}
          </div>
        ))}
      </div>
    </Card>
  );
}

export default StrengthCard;