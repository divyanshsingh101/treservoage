import React from 'react';
import { User, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function Account() {
  const { user, logout } = useAuth();
  console.log(user);

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Account Settings</h1>
      
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex items-center mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-blue-600" />
          </div>
          <div className="ml-4">
            <h2 className="text-xl font-semibold text-gray-900">{user?.name || 'Guest'}</h2>
            <p className="text-gray-600">{user?.email || 'No email provided'}</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <button className="w-full flex items-center p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200">
            <Settings className="w-5 h-5 text-gray-600 mr-3" />
            <span>Settings</span>
          </button>
          <button 
            onClick={logout}
            className="w-full flex items-center p-4 rounded-lg hover:bg-red-50 text-red-600 transition-colors duration-200"
          >
            <LogOut className="w-5 h-5 mr-3" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Account;
