import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuiz } from '../context/QuizContext';
import { useAuth } from '../context/AuthContext';

function Quiz() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { quizzes, updateLeaderboard } = useQuiz();
  const { user } = useAuth();
  const [answers, setAnswers] = useState({});

  const quiz = quizzes.find(q => q.id === id);

  if (!quiz) {
    return <div>Quiz not found</div>;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const score = calculateScore(answers, quiz.questions);
    updateLeaderboard(quiz.id, {
      userId: user.id,
      username: user.username,
      score,
      timestamp: new Date().toISOString()
    });
    navigate(`/leaderboard/${quiz.id}`);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">{quiz.title}</h1>
      <form onSubmit={handleSubmit}>
        {quiz.questions.map((question, index) => (
          <div key={index} className="mb-6">
            <p className="font-semibold mb-2">{question.text}</p>
            {question.options.map((option, optIndex) => (
              <label key={optIndex} className="block mb-2">
                <input
                  type="radio"
                  name={`question-${index}`}
                  value={option}
                  onChange={(e) => setAnswers({
                    ...answers,
                    [index]: e.target.value
                  })}
                  className="mr-2"
                />
                {option}
              </label>
            ))}
          </div>
        ))}
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Submit Quiz
        </button>
      </form>
    </div>
  );
}

export default Quiz