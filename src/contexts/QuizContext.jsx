import { useEffect, useReducer, createContext, useContext } from "react";
import { BASE_URL, SECS_PER_QUESTIONS } from "../constants/constants";

const QuizContext = createContext();
const initialState = {
  questions: [],
  //'loading', 'error', 'ready', 'active', 'finished'
  status: "loading",
  currentQuestionIndex: 0,
  answer: null,
  points: 0,
  highscore: 0,
  timer: null,
};
const reducer = (state, action) => {
  switch (action.type) {
    case "dataRecieved":
      return { ...state, questions: action.payload, status: "ready" };
    case "dataFailed":
      return { ...state, status: "error" };
    case "start":
      return {
        ...state,
        status: "active",
        timer: state.questions.length * SECS_PER_QUESTIONS,
      };
    case "newAnswer":
      const currentQuestion = state.questions.at(state.currentQuestionIndex);
      return {
        ...state,
        answer: action.payload,
        points:
          currentQuestion.correctOption === action.payload
            ? state.points + currentQuestion.points
            : state.points,
      };
    case "nextQuestion":
      return {
        ...state,
        currentQuestionIndex: state.currentQuestionIndex + 1,
        answer: null,
      };
    case "finish":
      return {
        ...state,
        status: "finish",
        highscore:
          state.points > state.highscore ? state.points : state.highscore,
      };
    case "restart":
      return {
        ...state,
        status: "ready",
        currentQuestionIndex: 0,
        answer: null,
        points: 0,
        highscore: 0,
        timer: 1,
      };
    case "setTimer":
      return {
        ...state,
        timer: action.payload,
        status: action.payload === 0 ? "finish" : state.status,
      };
    default:
      throw new Error("Action unknown");
  }
};

function QuizProvider({ children }) {
  const [
    {
      questions,
      status,
      currentQuestionIndex,
      answer,
      points,
      highscore,
      timer,
    },
    dispatch,
  ] = useReducer(reducer, initialState);
  const numQuestions = questions.length;
  const maxPossiblePoints = questions.reduce(
    (acc, item) => acc + item.points,
    0
  );

  useEffect(() => {
    try {
      //fetch mock data from json-server API
      const fetchQuestions = async () => {
        const res = await fetch(`${BASE_URL}/questions`);
        const data = await res.json();
        dispatch({ type: "dataRecieved", payload: data });
      };
      fetchQuestions();
    } catch (error) {
      dispatch({ type: "dataFailed" });
    }
  }, []);

  return (
    <QuizContext.Provider
      value={{
        questions,
        status,
        currentQuestionIndex,
        answer,
        points,
        highscore,
        timer,
        numQuestions,
        maxPossiblePoints,
        dispatch,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}

export function useQuizContext() {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error("useQuizContext must be used within a QuizProvider");
  }
  return context;
}

export default QuizProvider;
