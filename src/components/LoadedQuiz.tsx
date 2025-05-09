import clsx from "clsx";
import { FC, useEffect, useMemo, useState } from "react";
import { Quiz } from "../schema/quiz";
import ResultsQuiz from "./ResultsQuiz";
import { Button, buttonVariants } from "./ui/Button";
import { Progress } from "./ui/Progress";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";

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
    const question = questions.find((q) => q.id === questionId);

    if (!question) return;

    const valueArray = typeof answers === "string" ? [answers] : answers;

    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: valueArray,
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

  if (showResults) return <ResultsQuiz quiz={quiz} userAnswers={userAnswers} />;

  const selectedValues = userAnswers[currentQuestion.id] || [];

  return (
    <Card className="w-full max-w-2xl max-lg:max-w-md">
      <CardHeader>
        <CardTitle className="text-lg">
          {quiz.title} - Question n°{currentQuestionIndex + 1}
        </CardTitle>
      </CardHeader>
      <div className="flex items-center w-full justify-evenly">
        <Progress value={calculateProgress()} className="w-3/4" />
        <span>{Math.ceil(calculateProgress())}%</span>
      </div>
      <CardContent>
        <div className="my-4">
          <p className="font-medium pb-2 leading-tight">
            {currentQuestion.content}
          </p>
          <CardDescription className="italic">
            {currentQuestion.type === "SINGLE"
              ? "Choisissez une seule réponse"
              : "Sélectionnez toutes les réponses correctes"}
          </CardDescription>
        </div>
        {currentQuestion.type === "SINGLE" ? (
          <ToggleGroup
            type="single"
            value={userAnswers[currentQuestion.id]?.[0] || ""}
            className="space-x-4 py-3 w-4/5 mx-auto max-lg:flex-col max-lg:space-x-0 max-lg:gap-5"
            onValueChange={(values) =>
              handleToggleChange(currentQuestion.id, [values])
            }
          >
            {currentQuestion.answers.map((answer) => (
              <ToggleGroupItem
                key={answer.id}
                value={answer.id}
                className={clsx(
                  "w-full cursor-pointer",
                  buttonVariants({
                    variant: "default",
                    size: "sm",
                    className: "border-2 border-black",
                  })
                )}
              >
                {answer.content}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        ) : (
          <ToggleGroup
            type="multiple"
            value={selectedValues}
            className="w-full py-3 flex gap-4 max-lg:flex-col"
            onValueChange={(values) =>
              handleToggleChange(currentQuestion.id, values)
            }
          >
            {currentQuestion.answers.map((answer) => (
              <ToggleGroupItem
                key={answer.id}
                value={answer.id}
                className={clsx(
                  "w-full cursor-pointer max-lg:w-4/5",
                  buttonVariants({
                    variant: "default",
                    size: "sm",
                    className: "border-2 border-black",
                  })
                )}
              >
                {answer.content}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        )}
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button
          variant="destructive"
          className="cursor-pointer"
          onClick={handleNextQuestion}
          disabled={!selectedValues.length}
        >
          {currentQuestionIndex < questions.length - 1
            ? "Question suivante"
            : "Terminer le quiz"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LoadedQuiz;
