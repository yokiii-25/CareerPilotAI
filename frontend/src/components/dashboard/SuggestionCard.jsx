import Card from "../common/Card";

function SuggestionCard({ suggestions }) {
  return (
    <Card>
      <h2 className="text-2xl font-bold mb-5">
        🤖 AI Suggestions
      </h2>

      <ul className="space-y-3">
        {suggestions.map((item, index) => (
          <li
            key={index}
            className="bg-yellow-100 text-yellow-800 p-3 rounded-lg"
          >
            💡 {item}
          </li>
        ))}
      </ul>
    </Card>
  );
}

export default SuggestionCard;