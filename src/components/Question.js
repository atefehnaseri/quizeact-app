// import { useQuiz } from "../contexts/QuizContext";
import Options from "./Options.js";

function Question({ question, answer, dispatch }) {
  //   const { questions, index } = useQuiz();
  //   const question = questions.at(index);

  //   console.log(question);

  return (
    <div>
      <h4>{question.question}</h4>
      <Options question={question} answer={answer} dispatch={dispatch} />
    </div>
  );
}

export default Question;
