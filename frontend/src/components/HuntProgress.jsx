import React from 'react';
import { CheckCircle, Circle } from 'lucide-react';

const HuntProgress = ({
  totalPuzzles,
  currentPuzzleIndex,
  completedPuzzles
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Hunt Progress</h3>
      
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-600">
          {completedPuzzles.length} of {totalPuzzles} puzzles completed
        </span>
        <span className="text-sm font-medium text-indigo-600">
          {Math.round((completedPuzzles.length / totalPuzzles) * 100)}%
        </span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
        <div 
          className="bg-indigo-600 h-2.5 rounded-full" 
          style={{ width: `${(completedPuzzles.length / totalPuzzles) * 100}%` }}
        ></div>
      </div>
      
      <div className="flex flex-wrap gap-2 mt-4">
        {Array.from({ length: totalPuzzles }).map((_, index) => (
          <div 
            key={index}
            className={`flex items-center justify-center w-10 h-10 rounded-full ${
              completedPuzzles.includes(index)
                ? 'bg-green-100'
                : index === currentPuzzleIndex
                ? 'bg-indigo-100 border-2 border-indigo-500'
                : 'bg-gray-100'
            }`}
          >
            {completedPuzzles.includes(index) ? (
              <CheckCircle className="text-green-600" size={20} />
            ) : (
              <Circle 
                className={index === currentPuzzleIndex ? "text-indigo-600" : "text-gray-400"} 
                size={20} 
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HuntProgress;