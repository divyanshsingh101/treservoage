import React from 'react';
import { Calendar, Clock, MapPin, Award } from 'lucide-react';

const HuntDetails = ({ hunt }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">{hunt.name}</h2>
      <p className="text-gray-600 mb-4">{hunt.description}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="flex items-center">
          <Calendar className="mr-2 text-indigo-600" size={20} />
          <span className="text-gray-700">
            {formatDate(hunt.startTime)} - {formatDate(hunt.endTime)}
          </span>
        </div>
        <div className="flex items-center">
          <Clock className="mr-2 text-indigo-600" size={20} />
          <span className="text-gray-700">
            {formatTime(hunt.startTime)} - {formatTime(hunt.endTime)}
          </span>
        </div>
      </div>
      
      <div className="flex items-center mb-4">
        <MapPin className="mr-2 text-indigo-600" size={20} />
        <span className="text-gray-700">{hunt.puzzles?.length} locations to discover</span>
      </div>
      
      <div className="flex items-center">
        <Award className="mr-2 text-indigo-600" size={20} />
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getLevelColor(hunt.level)}`}>
          {hunt?.level.charAt(0).toUpperCase() + hunt.level.slice(1)} Level
        </span>
      </div>
    </div>
  );
};

export default HuntDetails;