import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { QuizProvider } from './context/QuizContext';
import Navbar from './components/Navbar';

import Quiz from './pages/Quiz';
import Leaderboard from './pages/Leaderboard';
import './index.css';
import Login from './components/login';
import Signup from './components/signup';
import CreateHuntForm from './components/CreateQuiz';
import QuizDisplay from './components/QuizDisplay';
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import { Menu } from 'lucide-react';
import Account from './pages/Account';
import ChatRoom from './pages/ChatRoom';
import Notifications from './pages/Notification';
import Home from './pages/Home';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <AuthProvider>
      <QuizProvider>
        <div className="min-h-screen bg-gray-50 flex">
          {/* Sidebar */}
          <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

          {/* Main Content */}
          <div className="flex-1 lg:ml-64">
            {/* Header with menu button */}
            <header className="bg-white shadow-sm lg:hidden">
              <div className="p-4">
                <button
                  onClick={toggleSidebar}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <Menu className="w-6 h-6 text-gray-600" />
                </button>
              </div>
            </header>

            {/* Page Content */}
            <main className="p-6">
              <div className="min-h-screen bg-gray-100">
                {/* Navbar */}
                <Navbar />

                {/* Routes (No Router Here) */}
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/QuizDisplay/:id" element={<QuizDisplay />} />
                  <Route path="/createQuiz" element={<CreateHuntForm />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/quiz/:id" element={<Quiz />} />
                  <Route path="/leaderboard/:id" element={<Leaderboard />} />
                  <Route path="/account" element={<Account />} />
                  <Route path="/notifications" element={<Notifications />} />
                  <Route path="/chat" element={<ChatRoom />} />
                
                </Routes>
              </div>
            </main>
          </div>
        </div>
      </QuizProvider>
    </AuthProvider>
  );
}

export default App;
