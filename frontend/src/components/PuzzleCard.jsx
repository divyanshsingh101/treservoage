import React, { useState } from 'react';
import { Lightbulb, Camera, Check } from 'lucide-react';

const PuzzleCard = ({ 
  puzzle, 
  currentIndex, 
  onSubmitGuess, 
  onOpenHint 
}) => {
  const [openHints, setOpenHints] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleOpenHint = (hintIndex) => {
    if (!openHints.includes(hintIndex)) {
      setOpenHints([...openHints, hintIndex]);
      onOpenHint(hintIndex);
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-800">Puzzle #{currentIndex + 1}</h3>
      </div>
      
      <div className="mb-6">
        <p className="text-gray-700 whitespace-pre-line">{puzzle.puzzleText}</p>
      </div>
      
      {/* Hints Section */}
      <div className="mb-6">
        <h4 className="text-lg font-medium text-gray-800 mb-2">Hints</h4>
        <div className="space-y-2">
          {puzzle.hints.map((hint, index) => (
            <div key={index} className="flex items-start">
              <button
                onClick={() => handleOpenHint(index)}
                disabled={openHints.includes(index)}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  openHints.includes(index)
                    ? 'bg-gray-100 text-gray-600'
                    : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                }`}
              >
                <Lightbulb size={16} className="mr-2" />
                {openHints.includes(index) ? 'Hint Revealed' : `Reveal Hint ${index + 1}`}
              </button>
              
              {openHints.includes(index) && (
                <div className="ml-4 p-3 bg-yellow-50 rounded-md text-gray-700">
                  {hint.hint}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Photo Upload Section (if required) */}
      {puzzle.photoReq && (
        <div className="mb-6">
          <h4 className="text-lg font-medium text-gray-800 mb-2">Photo Evidence Required</h4>
          <div className="flex items-center space-x-4">
            <label className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer">
              <Camera size={16} className="mr-2" />
              Upload Photo
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
            {imagePreview && (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-16 w-16 object-cover rounded-md"
                />
                <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1">
                  <Check size={12} className="text-white" />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PuzzleCard;