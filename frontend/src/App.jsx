import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { QuizProvider } from './context/QuizContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Quiz from './pages/Quiz';
import Leaderboard from './pages/Leaderboard';
import './index.css';
import Login from './components/login';
import Signup from './components/signup';
import CreateHuntForm from './components/CreateQuiz';
import QuizDisplay from './components/QuizDisplay';

function App() {
  return (
    <AuthProvider>
      <QuizProvider>
        <Router>
          <div className="min-h-screen bg-gray-100">
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/QuizDisplay/:id" element ={<QuizDisplay />}/>
              <Route path="/createQuiz" element={<CreateHuntForm/>}/>
              <Route path="/login" element={<Login />}/>
              <Route path="/signup" element={<Signup />} />
              <Route path="/quiz/:id" element={<Quiz />} />
              <Route path="/leaderboard/:id" element={<Leaderboard />} />
            </Routes>
          </div>
        </Router>
      </QuizProvider>
    </AuthProvider>
  );
}

export default App;