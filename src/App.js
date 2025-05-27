import { useQuizContext } from "./contexts/QuizContext";
import Header from "./components/Header";
import Main from "./components/Main";
import Loader from "./components/Loader";
import Error from "./components/Error";
import StartScreen from "./components/StartScreen";
import Question from "./components/Question";
import ProgressBar from "./components/ProgressBar";
import FinishScreen from "./components/FinishScreen";
import Footer from "./components/Footer";
import TimeCounter from "./components/TimeCounter";
import NextButton from "./components/NextButton";

export default function App() {
  const { status, timer } = useQuizContext();

  return (
    <div className="app">
      <Header />
      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && <StartScreen />}
        {status === "active" && (
          <>
            <ProgressBar />
            <Question />
            <Footer>
              <TimeCounter mode="timer" seconds={timer} />
              <NextButton />
            </Footer>
          </>
        )}
        {status === "finish" && <FinishScreen />}
      </Main>
    </div>
  );
}
