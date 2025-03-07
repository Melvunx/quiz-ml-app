import { FC, useEffect, useMemo, useState } from "react";
import { Quiz } from "../schema/quiz";
import ResultsQuiz from "./ResultsQuiz";
import Button from "./ui/Button";
import Progress from "./ui/Progress";

type LoadedQuizProps = {
  quiz: Quiz;
  onFinish: (
    score: number,
    totalPossibleScore: number,
    answers: Record<string, string[]>
  ) => void;
};

const LoadedQuiz: FC<LoadedQuizProps> = ({ quiz, onFinish }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string[]>>({});
  const [showResults, setShowResults] = useState(false);

  const blockNavigation = useMemo(() => {
    return (
      Object.keys(userAnswers).length !== currentQuestionIndex + 1 &&
      !showResults
    );
  }, [userAnswers, currentQuestionIndex, showResults]);

  useEffect(() => {
    if (!blockNavigation) return () => {};

    window.addEventListener("beforeunload", (e) => e.preventDefault());

    return () => {
      window.removeEventListener("beforeunload", (e) => e.preventDefault());
    };
  }, [blockNavigation]);

  // On mappe les questions du quiz
  const questions = quiz.questions.map((q) => q);
  const currentQuestion = questions[currentQuestionIndex];

  const handleToggleChange = (questionId: string, answerId: string) => {
    setUserAnswers((prev) => {
      const currentAnswers = prev[questionId] || [];

      if (currentQuestion.type === "SINGLE") {
        return {
          ...prev,
          [questionId]: [answerId],
        };
      } else {
        if (currentAnswers.includes(answerId)) {
          return {
            ...prev,
            [questionId]: currentAnswers.filter((id) => id !== answerId),
          };
        } else {
          return {
            ...prev,
            [questionId]: [...currentAnswers, answerId],
          };
        }
      }
    });
  };

  const finishQuiz = (finalAnswers: Record<string, string[]>) => {
    let score = 0;
    let totalPossibleScore = 0;

    questions.forEach((question) => {
      const userSelectedAnswers = finalAnswers[question.id] || [];
      const correctAnswers = question.answers.filter((a) => a.isCorrect);

      if (question.type === "SINGLE") {
        if (
          userSelectedAnswers.length === 1 &&
          correctAnswers.some((a) => a.id === userSelectedAnswers[0])
        )
          score += 1;

        totalPossibleScore += 1;
      } else {
        const correctlySelected = userSelectedAnswers.filter((id) =>
          correctAnswers.some((a) => a.id === id)
        ).length;

        const incorrectlySelected = userSelectedAnswers.filter(
          (id) => !correctAnswers.some((a) => a.id === id)
        ).length;

        if (correctlySelected > 0 && incorrectlySelected === 0)
          score += correctlySelected / correctAnswers.length;

        totalPossibleScore += 1;
      }
    });

    setShowResults(true);
    onFinish(score, totalPossibleScore, finalAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1)
      setCurrentQuestionIndex((prev) => prev + 1);
    else finishQuiz(userAnswers);
  };

  const calculateProgress = () => {
    return ((currentQuestionIndex + 1) / questions.length) * 100;
  };

  if (showResults) return <ResultsQuiz />;

  const selectedValues = userAnswers[currentQuestion.id] || [];

  return (
    <div className="card">
      <div className="card-body">
        <h2 className="card-title">
          {quiz.title} - Question n°{currentQuestionIndex + 1}
        </h2>
        <div className="flex items-center">
          <Progress value={calculateProgress()} />
        </div>
        <div className="my-4">
          <p className="text-lg font-medium">{currentQuestion.content}</p>
          <p className="text-sm italic text-gray-600 mt-1">
            {currentQuestion.type === "SINGLE"
              ? "Choisissez une seule réponse"
              : "Sélectionnez toutes les réponses correctes"}
          </p>
        </div>
        <div className="flex flex-col gap-3 my-4">
          {currentQuestion.answers.map((answer) => {
            const isSelected = selectedValues.includes(answer.id);

            return (
              <label
                key={answer.id}
                htmlFor={answer.id}
                className={`btn ${
                  isSelected ? "btn-primary" : "btn-secondary"
                }`}
                onClick={() =>
                  handleToggleChange(currentQuestion.id, answer.id)
                }
              >
                <input
                  id={answer.id}
                  checked={isSelected}
                  onChange={() => {}}
                  className="hidden"
                  type={
                    currentQuestion.type === "SINGLE" ? "radio" : "checkbox"
                  }
                />
                <div
                  className={`size-6 flex items-center justify-center rounded-full border mr-3
                    ${
                      isSelected
                        ? "bg-blue-500 border-blue-500 text-white"
                        : "border-gray-400"
                    }
                    `}
                >
                  {isSelected &&
                    (currentQuestion.type === "SINGLE" ? "●" : "✓")}
                </div>
                <span>{answer.content}</span>
              </label>
            );
          })}
        </div>
        <div className="card-actions justify-end mt-4">
          <Button
            variant="btn-primary"
            onClick={handleNextQuestion}
            disabled={!selectedValues.length}
          >
            {currentQuestionIndex < questions.length - 1
              ? "Question suivante"
              : "Terminer le quiz"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LoadedQuiz;
