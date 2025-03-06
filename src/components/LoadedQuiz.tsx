import { FC, useEffect, useMemo, useState } from "react";
import { Quiz } from "../schema/quiz";
import ResultsQuiz from "./ResultsQuiz";
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

  const handleToggleChange = (questionId: string, answers: string[]) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: answers,
    }));
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
        <div>
          <p className="text-lg font-medium">{currentQuestion.content}</p>
          <p>
            {currentQuestion.type === "SINGLE"
              ? "Choisissez une seule réponse"
              : "Sélectionnez toutes les réponses correctes"}
          </p>
        </div>
        {
          currentQuestion.type === "SINGLE" ? (
            <div className="flex flex-wrap">
              {
                currentQuestion.answers.map((answer) => (
                  <div key={answer.id}>
                    <input
                      type="radio"
                      id={answer.id}
                      name={currentQuestion.id}
                      checked={selectedValues.includes(answer.id)}
                      onChange={() => handleToggleChange(currentQuestion.id, [answer.id])}
                    />
                    <label htmlFor={answer.id}>{answer.content}</label>
                  </div>
                ))
              }
            </div>
          ) : ()
        }
      </div>
    </div>
  );
};

export default LoadedQuiz;
