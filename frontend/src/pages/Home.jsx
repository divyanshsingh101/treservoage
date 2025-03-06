import { Link } from 'react-router-dom';
import { useState,useEffect } from 'react';
//import { useQuiz } from '../context/QuizContext';
import { useAuth } from '../context/AuthContext';
import QuizCard from '../components/QuizCard';
import { PlusIcon, MapIcon, PuzzlePieceIcon, GiftIcon } from '@heroicons/react/24/outline';

function FeatureCard({ icon: Icon, title, description }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
        <Icon className="h-6 w-6 text-blue-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function Home() {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState([]);
  const [uquizzes,setUquizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [upQuiz, setUpQuiz] = useState(false);
  useEffect(() => {
    const fetchQuizzes = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("http://localhost:3000/participant/liveHunts");
        if (!response.ok) throw new Error("Failed to fetch quizzes");
        const data = await response.json();
        setQuizzes(data.data || []);
      } catch (error) {
        setError(error.message);
        console.error("Failed to fetch quizzes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, []);

  useEffect(() => {
    const fetchUQuizzes = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("http://localhost:3000/participant/upcomingHunts");
        if (!response.ok) throw new Error("Failed to fetch quizzes");
        const data = await response.json();
        setUquizzes(data.data || []);
      } catch (error) {
        setError(error.message);
        console.error("Failed to fetch quizzes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUQuizzes();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Campus Adventure Awaits You</h1>
            <p className="text-xl text-blue-100 mb-8">
              Explore MNNIT like never before. Solve riddles, find hidden spots, and compete with fellow students.
            </p>
            {!user && (
              <Link
                to="/signup"
                className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-200"
              >
                Start Your Adventure
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <FeatureCard
            icon={MapIcon}
            title="Campus Explorer"
            description="Discover hidden spots and secret locations across MNNIT campus."
          />
          <FeatureCard
            icon={PuzzlePieceIcon}
            title="Solve Riddles"
            description="Challenge yourself with creative puzzles about MNNIT history and culture."
          />
          <FeatureCard
            icon={GiftIcon}
            title="Win Rewards"
            description="Compete with other students and earn exclusive MNNIT merchandise."
          />
        </div>

        {/* Quizzes Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Active Quizzes</h2>
              <p className="text-gray-600 mt-2">Discover and participate in exciting treasure hunts</p>
            </div>
            {user && (
              <Link
                to="/CreateQuiz"
                className="inline-flex items-center bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium shadow-sm hover:shadow-md"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Create New Quiz
              </Link>
            )}
          </div>
        </div>

        {quizzes.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-md">
            <h3 className="text-xl text-gray-600">No quizzes available yet</h3>
            {user && (
              <p className="text-gray-500 mt-2">
                Be the first to create a quiz for your fellow students!
              </p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map(quiz => {
 
  const hasAttempted = quiz.participants.some(p => 
    p.user.toString() === user?._id && p.hasAttempted
);


           return <QuizCard key={quiz.id} quiz={quiz} hasAttempted={hasAttempted} />;
})}
          </div>
        )}
         <div>
              <h2 className="text-3xl font-bold text-gray-900">Upcoming Quizzes</h2>
              <p className="text-gray-600 mt-2">Discover and participate in exciting treasure hunts</p>
        </div>
        {uquizzes.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-md">
            <h3 className="text-xl text-gray-600">No quizzes available yet</h3>
            {user && (
              <p className="text-gray-500 mt-2">
                Be the first to create a quiz for your fellow students!
              </p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {uquizzes.map(quiz => {
             
            const hasAttempted = quiz.participants.some(p => p.user === user?._id);
 
            return <QuizCard key={quiz.id} quiz={quiz} hasAttempted={hasAttempted} upQuiz={upQuiz} />;
})}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;