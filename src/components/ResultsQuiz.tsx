import { LocalStorageItem } from "@/lib/utils";
import { Quiz } from "@/schema/quiz";
import { FC, useEffect } from "react";
import { Button } from "./ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { ScrollArea } from "./ui/scroll-area";

type DropDownMenuResultsProps = {
  quiz: Quiz;
  userAnswers: Record<string, string[]>;
};

const DropDownMenuResults: FC<DropDownMenuResultsProps> = ({
  quiz,
  userAnswers,
}) => {
  return (
    <Dialog>
      <DialogTrigger>
        <Button>Voir les résultats !</Button>
      </DialogTrigger>
      <DialogContent>
        <Card>
          <CardHeader>
            <CardTitle>Résultas du Quiz {quiz.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="ml-4 space-y-1">
              <ScrollArea className="h-96 rounded-lg border">
                {quiz.questions.map((question, idx) => {
                  if (!question.answers) return null;

                  const userSelectedIds = userAnswers[question.id] || [];
                  const correctAnswerIds = question.answers
                    .filter((a) => a.isCorrect)
                    .map((a) => a.id);

                  const isQuestionCorrect =
                    question.type === "SINGLE"
                      ? userSelectedIds.length === 1 &&
                        correctAnswerIds.includes(userSelectedIds[0])
                      : userSelectedIds.length === correctAnswerIds.length &&
                        userSelectedIds.every((id) =>
                          correctAnswerIds.includes(id)
                        );

                  return (
                    <div
                      key={question.id}
                      className={`border p-5 ${
                        isQuestionCorrect
                          ? "bg-green-50 dark:bg-green-50/85"
                          : "bg-red-50 dark:bg-red-50/85"
                      }`}
                    >
                      <p className="mb-2 font-medium dark:text-black">
                        {idx + 1}. {question.content}
                        {isQuestionCorrect ? (
                          <span className="ml-2 text-green-500">
                            ✓ Correcte
                          </span>
                        ) : (
                          <span className="ml-2 text-red-500">
                            ✗ Incorrecte
                          </span>
                        )}
                      </p>

                      <div className="ml-4 space-y-1">
                        {question.answers.map((answer) => {
                          const isSelected = userSelectedIds.includes(
                            answer.id
                          );
                          const { isCorrect } = answer;

                          let textColorClassName = "";
                          if (isSelected && isCorrect)
                            textColorClassName = "text-green-500";
                          else if (isSelected && !isCorrect)
                            textColorClassName = "text-red-500";
                          else if (!isSelected && isCorrect)
                            textColorClassName = "text-accent";
                          else textColorClassName = "dark:text-black";

                          return (
                            <p
                              key={answer.id}
                              className={`${textColorClassName}`}
                            >
                              {isSelected ? "✔ " : "⚬ "}
                              {answer.content}
                              {isCorrect && " (Correcte)"}
                            </p>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </ScrollArea>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

type ResultsQuizProps = {
  quiz: Quiz;
  userAnswers: Record<string, string[]>;
};

const ResultsQuiz: FC<ResultsQuizProps> = ({ quiz, userAnswers }) => {
  useEffect(() => {
    const score = quiz.questions.reduce((acc, question) => {
      const userSelectedIds = userAnswers[question.id] || [];
      const correctAnswerIds = question.answers
        .filter((a) => a.isCorrect)
        .map((a) => a.id);

      const isQuestionCorrect =
        question.type === "SINGLE"
          ? userSelectedIds.length === 1 &&
            correctAnswerIds.includes(userSelectedIds[0])
          : userSelectedIds.length === correctAnswerIds.length &&
            userSelectedIds.every((id) => correctAnswerIds.includes(id));

      return isQuestionCorrect ? acc + 1 : acc;
    }, 0);

    const totalPossibleScore = quiz.questions.length;

    const localScore = new LocalStorageItem<number>("score");
    const localCompletedDate = new LocalStorageItem<string>("completed_date");

    if (localCompletedDate.get() === null) {
      localCompletedDate.set(new Date().toISOString());
    } else {
      const prevCompletedDate = new Date(localCompletedDate.get() as string);
      const currentCompletedDate = new Date();

      if (currentCompletedDate > prevCompletedDate) {
        localCompletedDate.set(currentCompletedDate.toISOString());
      }
    }

    if (localScore.get() === null || localScore.get() === score) {
      localScore.remove();

      localScore.set(
        score > 0 ? Math.ceil((score / totalPossibleScore) * 100) : 0
      );
    }
  }, [quiz, userAnswers]);

  return (
    <Card className="flex flex-col justify-evenly h-40">
      <CardHeader>
        <CardTitle>Bravo vous avez terminé le quiz ! 👏</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center">
        <DropDownMenuResults quiz={quiz} userAnswers={userAnswers} />
      </CardContent>
    </Card>
  );
};

export default ResultsQuiz;
