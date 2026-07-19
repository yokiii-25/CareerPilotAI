import { useState } from "react";

function InterviewQuestionCard({
  question,
  answer,
  number,
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    if (!answer?.trim()) return;

    try {
      await navigator.clipboard.writeText(answer);
      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error(
        "Unable to copy interview answer:",
        error
      );
    }
  }

  return (
    <article className="interview-question-card">
      <div className="interview-question-heading">
        <span className="interview-question-number">
          Question {number}
        </span>

        <button
          type="button"
          className="interview-copy-button"
          onClick={handleCopy}
        >
          {copied ? "Copied!" : "Copy Answer"}
        </button>
      </div>

      <h3>{question}</h3>

      <div className="interview-answer">
        <p className="interview-answer-label">
          Suggested answer
        </p>

        <p>{answer}</p>
      </div>
    </article>
  );
}

export default InterviewQuestionCard;