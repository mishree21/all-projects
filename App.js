import { useState } from "react";

const questions = [
  {
    question: "What is React?",
    options: ["Library", "Framework", "Language", "Database"],
    answer: "Library",
  },
  {
    question: "Who maintains React?",
    options: ["Google", "Facebook", "Microsoft", "Twitter"],
    answer: "Facebook",
  },
  {
    question: "What hook is used for state?",
    options: ["useState", "useEffect", "useRef", "useMemo"],
    answer: "useState",
  },
  {
    question: "JSX stands for?",
    options: [
      "Java Syntax Extension",
      "JavaScript XML",
      "Java Source Extension",
      "None"
    ],
    answer: "JavaScript XML",
  },
];

export default function QuizApp() {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const handleAnswer = (option) => {
    setSelectedOption(option);

    if (option === questions[current].answer) {
      setScore((prev) => prev + 1);
    }

    setTimeout(() => {
      const next = current + 1;
      setSelectedOption(null);

      if (next < questions.length) {
        setCurrent(next);
      } else {
        setShowResult(true);
      }
    }, 900);
  };

  const restartQuiz = () => {
    setCurrent(0);
    setScore(0);
    setShowResult(false);
    setSelectedOption(null);
  };

  const percentage = Math.round((score / questions.length) * 100);
  const progressPercent = (current / questions.length) * 100;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>React Quiz App</h1>

        {!showResult && (
          <div style={styles.progressWrapper}>
            <p style={styles.progressText}>
              {current + 1} / {questions.length} Questions
            </p>
            <div style={styles.progressBar}>
              <div
                style={{
                  ...styles.progressFill,
                  width: `${progressPercent}%`,
                }}
              />
            </div>
          </div>
        )}

        {showResult ? (
          <div style={styles.resultBox}>
            <h2>🎉 Quiz Result</h2>
            <p style={styles.resultText}>
              Score: {score} / {questions.length}
            </p>
            <p style={styles.resultText}>Percentage: {percentage}%</p>
            <button style={styles.button} onClick={restartQuiz}>
              Restart Quiz
            </button>
          </div>
        ) : (
          <div>
            <h2 style={styles.questionNumber}>Question {current + 1}</h2>
            <p style={styles.question}>{questions[current].question}</p>

            <div>
              {questions[current].options.map((option, index) => {
                const isCorrect = option === questions[current].answer;
                const isWrongSelected = selectedOption === option && !isCorrect;
                const isCorrectReveal = selectedOption && isCorrect;

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswer(option)}
                    disabled={selectedOption !== null}
                    style={{
                      ...styles.option,
                      backgroundColor: isCorrectReveal
                        ? "#4CAF50"
                        : isWrongSelected
                        ? "#E53935"
                        : "white",
                      color:
                        isCorrectReveal || isWrongSelected ? "white" : "black",
                      border: isCorrectReveal
                        ? "2px solid #2E7D32"
                        : isWrongSelected
                        ? "2px solid #B71C1C"
                        : "1px solid #ccc",
                    }}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    fontFamily: "Arial",
    padding: "10px",
  },
  card: {
    background: "white",
    padding: "20px",
    borderRadius: "15px",
    width: "95%",
    maxWidth: "500px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
    textAlign: "center",
  },
  title: {
    marginBottom: "20px",
    color: "#333",
    fontSize: "clamp(20px, 5vw, 28px)",
  },
  questionNumber: {
    fontSize: "clamp(16px, 4vw, 20px)",
  },
  question: {
    fontSize: "clamp(16px, 4.5vw, 18px)",
    marginBottom: "15px",
  },
  option: {
    display: "block",
    width: "100%",
    margin: "10px 0",
    padding: "12px",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "0.3s",
    fontSize: "16px",
  },
  button: {
    marginTop: "15px",
    padding: "10px 20px",
    backgroundColor: "#4A90E2",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    width: "100%",
  },
  resultBox: {
    padding: "20px",
  },
  resultText: {
    fontSize: "18px",
    margin: "10px 0",
  },
  progressWrapper: {
    marginBottom: "20px",
  },
  progressText: {
    marginBottom: "5px",
    fontWeight: "bold",
  },
  progressBar: {
    width: "100%",
    height: "10px",
    backgroundColor: "#ddd",
    borderRadius: "5px",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#4CAF50",
    transition: "width 0.3s ease",
  },
};
