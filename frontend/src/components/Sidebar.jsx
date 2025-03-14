import React from 'react';
import { User, Bell, MessageSquare, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const menuItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: User, label: 'Account', path: '/account' },
    { icon: Bell, label: 'Notifications', path: '/notifications' },
    { icon: MessageSquare, label: 'Chat Room', path: '/chat' },
  ];

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-20 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-[#f9f9f9] shadow-md z-30 transition-transform duration-300 transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 w-64 border-r border-gray-200`}
      >
        <div className="p-5">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Campus Quest</h2>
          <nav>
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.path}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-gray-900 transition-colors duration-200"
                    onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                  >
                    <item.icon className="w-5 h-5 text-gray-600" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
