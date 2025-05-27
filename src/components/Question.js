import { useQuizContext } from "../contexts/QuizContext.jsx";
import Options from "./Options.js";

function Question() {
  const { questions, currentQuestionIndex } = useQuizContext();
  const question = questions.at(currentQuestionIndex);

  return (
    <div>
      <h4>{question.question}</h4>
      <Options question={question} />
    </div>
  );
}

export default Question;
