import { createContext, useContext, useState } from 'react';

const QuizContext = createContext(null);

export const QuizProvider = ({ children }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [leaderboard, setLeaderboard] = useState({});

  const addQuiz = (quiz) => {
    setQuizzes([...quizzes, { ...quiz, id: Date.now().toString() }]);
  };

  const updateLeaderboard = (quizId, entry) => {
    setLeaderboard(prev => ({
      ...prev,
      [quizId]: [...(prev[quizId] || []), entry].sort((a, b) => b.score - a.score)
    }));
  };

  return (
    <QuizContext.Provider value={{ quizzes, leaderboard, addQuiz, updateLeaderboard }}>
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = () => useContext(QuizContext);