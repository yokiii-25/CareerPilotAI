import Card from "../common/Card";

function MissingSkillsCard({ skills }) {
  return (
    <Card>
      <h2 className="text-2xl font-bold mb-5">
        ⚠ Missing Skills
      </h2>

      <div className="space-y-3">
        {skills.map((item, index) => (
          <div
            key={index}
            className="bg-red-100 text-red-700 px-4 py-3 rounded-xl"
          >
            ✖ {item}
          </div>
        ))}
      </div>
    </Card>
  );
}

export default MissingSkillsCard;