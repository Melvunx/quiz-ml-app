import { useEffect, useState } from "react";
import LoadedQuiz from "./components/LoadedQuiz";
import { Button } from "./components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import quiz from "./data/quiz";
import { formatedDate, LocalStorageItem } from "./lib/utils";

export default function App() {
  const [isItemStored, setIsItemStored] = useState(false);

  useEffect(() => {
    const localScore = new LocalStorageItem<number>("score");
    const localDate = new LocalStorageItem<string>("completed_date");
    let isMounted = true;

    const verifyLocalStorage = () => {
      if (isMounted) {
        if (localScore.get() && localDate.get()) {
          setIsItemStored(true);
        }
      }
    };

    verifyLocalStorage();

    return () => {
      isMounted = false;
    };
  }, []);

  const localUserScore = new LocalStorageItem<number>("score");
  const localCompletedDate = new LocalStorageItem<string>("completed_date");

  const handleFinishQuiz = (
    score: number,
    total: number,
    answers: Record<string, string[]>
  ) => {
    console.log("Quiz finished!");

    if (process.env.NODE_ENV === "development") {
      console.log(`Score: ${Math.ceil((score / total) * 100)}%`);
      console.log({ userAnswers: answers });
    }
  };

  const handleRestartQuiz = () => {
    console.log("Restarting quiz...");

    localUserScore.remove();
    localCompletedDate.remove();

    window.location.reload();
  };

  const userScore = localUserScore.get();
  const completedDate = localCompletedDate.get();

  if (!localUserScore || !localCompletedDate) {
    return (
      <div className="h-screen flex items-center justify-center bg-accent">
        <Card className="w-full max-w-lg h-86 flex flex-col justify-between">
          <CardHeader>
            <CardTitle>Résultat du Quiz {quiz.title}</CardTitle>
            <CardDescription>
              Vous n'avez pas encore fait le quiz, cliquez sur le bouton pour
              commencer !
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button>Commencer</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-screen flex items-center justify-center bg-accent">
      {isItemStored ? (
        <Card className="w-full max-w-lg h-86 flex flex-col justify-between">
          <CardHeader>
            <CardTitle>Résultat du Quiz {quiz.title}</CardTitle>
            <CardDescription>
              Vous pouvez recomencer le quiz si les résultas ne vous plaisent
              pas !
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-8">
            <p>Voici votre score !</p>
            <div className="flex justify-center items-center">
              <div
                className="radial-progress"
                style={
                  { "--value": userScore as number } as React.CSSProperties
                }
                aria-valuenow={userScore as number}
                role="progressbar"
              >
                {userScore}%
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <div className="flex w-full justify-between items-center">
              <CardDescription>
                Quiz fait le {formatedDate(completedDate as string)}
              </CardDescription>
              <Button onClick={handleRestartQuiz} className="cursor-pointer">
                Recommencer
              </Button>
            </div>
          </CardFooter>
        </Card>
      ) : (
        <LoadedQuiz
          quiz={quiz}
          onFinish={(score, total, answers) =>
            handleFinishQuiz(score, total, answers)
          }
        />
      )}
    </div>
  );
}
