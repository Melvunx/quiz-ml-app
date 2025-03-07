import LoadedQuiz from "./components/LoadedQuiz";
import quiz from "./data/quiz";

export default function App() {
  const handleFinishQuiz = (
    score: number,
    total: number,
    answers: Record<string, string[]>
  ) => {
    console.log(`Score: ${(score / total) * 100}%`);
    if (process.env.NODE_ENV === "development")
      console.log({ quizAnswers: answers });
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <LoadedQuiz
        quiz={quiz}
        onFinish={(score, total, answers) =>
          handleFinishQuiz(score, total, answers)
        }
      />
    </div>
  );
}
