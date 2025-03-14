import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, LogOut, UserPlus, Home } from 'lucide-react';

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-[#f5f5f5] shadow-sm p-4 border-b border-gray-200">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 text-gray-800 font-medium text-lg">
          <Home className="w-5 h-5 text-gray-700" /> College Treasure Hunt
        </Link>
        <div className="flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Welcome, {user.name}</span>
              <button
                onClick={logout}
                className="flex items-center px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition shadow-sm"
              >
                <LogOut className="w-5 h-5 mr-2 text-gray-700" /> Logout
              </button>
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="flex items-center px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition shadow-sm"
              >
                <LogIn className="w-5 h-5 mr-2 text-gray-700" /> Login
              </Link>
              <Link
                to="/signup"
                className="flex items-center px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition shadow-sm"
              >
                <UserPlus className="w-5 h-5 mr-2 text-gray-700" /> Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
