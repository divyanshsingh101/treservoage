import React from 'react';
import { Bell } from 'lucide-react';

function Notifications() {
  const notifications = [
    {
      id: 1,
      title: 'New Quiz Available',
      message: 'A new campus exploration quiz has been added!',
      time: '2 hours ago',
      unread: true,
    },
    {
      id: 2,
      title: 'Quiz Reminder',
      message: 'The "History of MNNIT" quiz starts in 1 hour!',
      time: '3 hours ago',
      unread: false,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Notifications</h1>
      
      <div className="space-y-4">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`bg-white rounded-xl shadow-md p-6 ${
              notification.unread ? 'border-l-4 border-blue-600' : ''
            }`}
          >
            <div className="flex items-start">
              <div className={`p-2 rounded-full ${
                notification.unread ? 'bg-blue-100' : 'bg-gray-100'
              }`}>
                <Bell className={`w-5 h-5 ${
                  notification.unread ? 'text-blue-600' : 'text-gray-600'
                }`} />
              </div>
              <div className="ml-4 flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{notification.title}</h3>
                <p className="text-gray-600 mt-1">{notification.message}</p>
                <span className="text-sm text-gray-500 mt-2 block">{notification.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Notifications;