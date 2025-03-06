import { useState, useContext, useEffect } from "react";
import { useAuth } from "../context/AuthContext"; // Adjust the path as needed


import { MapPin, Clock, AlertCircle, Plus, Trash2, HelpCircle, Camera } from "lucide-react";

const CreateHuntForm = () => {
  const { user } = useAuth() // Get the logged-in user from context
  console.log(user);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    startTime: "",
    endTime: "",
    level: "easy",
    puzzles: [],
    createdBy: "", // Include createdBy in formData
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeTab, setActiveTab] = useState(0);
 

  const levelOptions = ["easy", "medium", "hard"];

  // Update createdBy when user is available
  useEffect(() => {
    if (user && user._id) {
      setFormData((prevData) => ({ ...prevData, createdBy: user._id }));
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePuzzleChange = (index, field, value) => {
    const updatedPuzzles = [...formData.puzzles];
  
    if (field === "latitude") {
      updatedPuzzles[index].location.coordinates[0] = value;
    } else if (field === "longitude") {
      updatedPuzzles[index].location.coordinates[1] = value;
    } else {
      updatedPuzzles[index][field] = value;
    }
  
    setFormData({ ...formData, puzzles: updatedPuzzles });
  };
  

  const handleAddPuzzle = () => {
    setFormData({
      ...formData,
      puzzles: [
        ...formData.puzzles,
        { puzzleText: "", location: { coordinates: ["", ""] }, hints: [], photoReq: false },
      ],
    });
  };

  const handleAddHint = (index) => {
    const updatedPuzzles = [...formData.puzzles];
    updatedPuzzles[index].hints.push({ hint: "" });
    setFormData({ ...formData, puzzles: updatedPuzzles });
  };

  const handleHintChange = (puzzleIndex, hintIndex, value) => {
    const updatedPuzzles = [...formData.puzzles];
    updatedPuzzles[puzzleIndex].hints[hintIndex].hint = value;
    setFormData({ ...formData, puzzles: updatedPuzzles });
  };

  const validateForm = () => {
    if (!formData.name.trim() || !formData.description.trim()) {
      return "Name and description are required.";
    }

    if (!formData.startTime || !formData.endTime) {
      return "Start and end time are required.";
    }

    if (new Date(formData.startTime) >= new Date(formData.endTime)) {
      return "Start time must be before end time.";
    }

    if (formData.puzzles.length === 0) {
      return "At least one puzzle is required.";
    }

    for (const puzzle of formData.puzzles) {
      if (!puzzle.puzzleText.trim()) {
        return "Each puzzle must have a question.";
      }

      if (!puzzle.location.coordinates[0] || !puzzle.location.coordinates[1]) {
        return "Each puzzle must have valid coordinates.";
      }

      if (puzzle.hints.length === 0 || puzzle.hints.some((hint) => !hint.hint.trim())) {
        return "Each puzzle must have at least one hint.";
      }
    }

    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    console.log(formData);
    if (!formData.createdBy) {
      setError("User must be logged in to create a hunt.");
      return;
    }

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/participant/createHunt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData), // Ensure createdBy is included
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.message || "Failed to create hunt.");
      } else {
        alert("Hunt created successfully!");
        setFormData({
          name: "",
          description: "",
          startTime: "",
          endTime: "",
          level: "easy",
          puzzles: [],
          createdBy: user.id, // Reset createdBy with logged-in user
        });
      }
    } catch (error) {
      setError("Error submitting form. Please try again.");
    }
  };

  return (
        <div className="max-w-4xl mx-auto">
          <div className="bg-white shadow-xl rounded-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-6 px-8">
              <h2 className="text-3xl font-bold text-white">Create a Treasure Hunt</h2>
              <p className="text-blue-100 mt-2">Design an exciting adventure for participants to discover</p>
            </div>
    
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 m-6">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
            )}
    
            {success && (
              <div className="bg-green-50 border-l-4 border-green-500 p-4 m-6">
                <p className="text-green-700">{success}</p>
              </div>
            )}
    
            <form onSubmit={handleSubmit} className="p-8">
              <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Hunt Details</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Hunt Name</label>
                      <input
                        type="text"
                        name="name"
                        placeholder="e.g., Downtown Adventure"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty Level</label>
                      <select
                        name="level"
                        value={formData.level}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      >
                        {levelOptions.map((lvl) => (
                          <option key={lvl} value={lvl}>
                            {lvl.charAt(0).toUpperCase() + lvl.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
    
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      name="description"
                      placeholder="Provide details about your hunt..."
                      value={formData.description}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      required
                    ></textarea>
                  </div>
    
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div>
                      <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                        <Clock className="h-4 w-4 mr-1" />
                        Start Time
                      </label>
                      <input
                        type="datetime-local"
                        name="startTime"
                        value={formData.startTime}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                        <Clock className="h-4 w-4 mr-1" />
                        End Time
                      </label>
                      <input
                        type="datetime-local"
                        name="endTime"
                        value={formData.endTime}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        required
                      />
                    </div>
                  </div>
                </div>
    
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Puzzles</h3>
                    <button 
                      type="button" 
                      onClick={handleAddPuzzle} 
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Puzzle
                    </button>
                  </div>
    
                  {formData.puzzles.length === 0 ? (
                    <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                      <HelpCircle className="h-12 w-12 mx-auto text-gray-400" />
                      <p className="mt-2 text-sm text-gray-500">No puzzles added yet. Click "Add Puzzle" to create your first puzzle.</p>
                    </div>
                  ) : (
                    <div>
                      <div className="flex overflow-x-auto space-x-2 mb-4 pb-2">
                        {formData.puzzles.map((_, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => setActiveTab(index)}
                            className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap ${
                              activeTab === index
                                ? "bg-blue-600 text-white"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                          >
                            Puzzle {index + 1}
                          </button>
                        ))}
                      </div>
    
                      {formData.puzzles.map((puzzle, index) => (
                        <div key={index} className={`${activeTab === index ? "block" : "hidden"}`}>
                          <div className="bg-white p-5 rounded-lg border border-gray-200">
                            <div className="flex justify-between items-center mb-4">
                              <h4 className="font-medium text-gray-900">Puzzle {index + 1}</h4>
                              <button
                                type="button"
                                onClick={() => handleRemovePuzzle(index)}
                                className="text-red-500 hover:text-red-700 focus:outline-none"
                              >
                                <Trash2 className="h-5 w-5" />
                              </button>
                            </div>
    
                            <div className="space-y-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Puzzle Question</label>
                                <textarea
                                  placeholder="What's hidden behind the old oak tree?"
                                  value={puzzle.puzzleText}
                                  onChange={(e) => handlePuzzleChange(index, "puzzleText", e.target.value)}
                                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                  required
                                  rows={2}
                                />
                              </div>
    
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                    <MapPin className="h-4 w-4 mr-1" />
                                    Latitude
                                  </label>
                                  <input
                                    type="text"
                                    placeholder="e.g., 40.7128"
                                    value={puzzle.location.coordinates[0]}
                                    onChange={(e) => handlePuzzleChange(index, "latitude", e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    required
                                  />
                                </div>
                                <div>
                                  <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                    <MapPin className="h-4 w-4 mr-1" />
                                    Longitude
                                  </label>
                                  <input
                                    type="text"
                                    placeholder="e.g., -74.0060"
                                    value={puzzle.location.coordinates[1]}
                                    onChange={(e) => handlePuzzleChange(index, "longitude", e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    required
                                  />
                                </div>
                              </div>
    
                              <div className="flex items-center">
                                <input
                                  type="checkbox"
                                  id={`photoReq-${index}`}
                                  checked={puzzle.photoReq}
                                  onChange={(e) => handlePuzzleChange(index, "photoReq", e.target.checked)}
                                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor={`photoReq-${index}`} className="ml-2 block text-sm text-gray-700 flex items-center">
                                  <Camera className="h-4 w-4 mr-1" />
                                  Require photo submission
                                </label>
                              </div>
    
                              <div>
                                <div className="flex justify-between items-center mb-2">
                                  <label className="block text-sm font-medium text-gray-700">Hints</label>
                                  <button
                                    type="button"
                                    onClick={() => handleAddHint(index)}
                                    className="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                                  >
                                    <Plus className="h-3 w-3 mr-1" />
                                    Add Hint
                                  </button>
                                </div>
                                
                                {puzzle.hints.map((hint, hintIndex) => (
                                  <div key={hintIndex} className="flex items-center space-x-2 mb-2">
                                    <input
                                      type="text"
                                      placeholder={`Hint ${hintIndex + 1}`}
                                      value={hint.hint}
                                      onChange={(e) => handleHintChange(index, hintIndex, e.target.value)}
                                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                      required
                                    />
                                    {puzzle.hints.length > 1 && (
                                      <button
                                        type="button"
                                        onClick={() => handleRemoveHint(index, hintIndex)}
                                        className="text-red-500 hover:text-red-700 focus:outline-none"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </button>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
    
              <div className="mt-8">
                <button
                  type="submit"
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Create Hunt
                </button>
              </div>
            </form>
          </div>
        </div>
      );
    
};

export default CreateHuntForm;
