"use client"

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

//import axios from 'axios';
import HuntDetails from './HuntDetails';
import PuzzleCard from './PuzzleCard';
import MapComponent from './Map';
import HuntProgress from './HuntProgress';
import { useParams } from 'react-router-dom';
import { Map, Compass, Trophy, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
function QuizDisplay() {
  const navigate = useNavigate();
  const { id } = useParams();
  console.log("Fetching hunt with ID:", id); 
  const [hunt, setHunt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [attempt, setAttempt] = useState(true);
  const [error, setError] = useState(null);
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
  const [markerPosition, setMarkerPosition] = useState(null);
  const [completedPuzzles, setCompletedPuzzles] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [points, setPoints] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [startTime, setStartTime] = useState(null); 
  const { user } = useAuth();
  console.log(user._id);
  const userId=user._id
  
  //userId = user._id;
  // Fetch hunt data
  // useEffect(() => {
  //   // Mock data for development
  //   const mockHunt = {
  //     _id: '1',
  //     name: 'Downtown Adventure',
  //     description: 'Explore the hidden gems of downtown and solve puzzles to unlock the city\'s secrets.',
  //     startTime: new Date('2025-06-01T10:00:00'),
  //     endTime: new Date('2025-06-01T16:00:00'),
  //     createdBy: 'user123',
  //     level: 'medium',
  //     puzzles: [
  //       {
  //         puzzleText: 'Find the oldest building in the city square. Look for a plaque with a date from the 1800s.',
  //         location: {
  //           coordinates: [28.7041,77.1025]
  //         },
  //         hints: [
  //           { hint: 'It has a distinctive red brick facade.' },
  //           { hint: 'It\'s near a fountain.' }
  //         ],
  //         photoReq: true
  //       },
  //       {
  //         puzzleText: 'This landmark bridge connects two parts of the city. Find the viewing platform on the north side.',
  //         location: {
  //           coordinates: [-122.4194, 37.778]
  //         },
  //         hints: [
  //           { hint: 'You can see boats passing underneath.' },
  //           { hint: 'There\'s a small café nearby.' }
  //         ],
  //         photoReq: false
  //       },
  //       {
  //         puzzleText: 'Find the statue of the city\'s founder in the central park.',
  //         location: {
  //           coordinates: [-122.415, 37.771]
  //         },
  //         hints: [
  //           { hint: 'The statue is facing east.' },
  //           { hint: 'There are benches arranged in a semicircle around it.' }
  //         ],
  //         photoReq: true
  //       }
  //     ],
  //     participants: []
  //   };  }, []);
    useEffect(() => {
      const fetchHuntData = async () => {
        try {
          console.log(id);
          const response = await fetch(`http://localhost:3000/participant/getHunt/${id}`, {
            method: "GET",
            credentials: "include", // ✅ Required for Passport sessions
          }); // Adjust API endpoint as needed
          console.log(response)
          if (!response.ok) {
            throw new Error('Failed to fetch hunt data');
          }
          const data = await response.json();
          console.log(data)
          setHunt(data.hunt);
          

          setStartTime(Date.now());
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
  
      fetchHuntData();
    }, []);
    // Simulate API call
    // setTimeout(() => {
    //   setHunt(mockHunt);
    //   setLoading(false);
    // }, 1000);

    // In a real app, you would fetch from your API:
    // axios.get('/api/hunts/active')
    //   .then(response => {
    //     setHunt(response.data);
    //     setLoading(false);
    //   })
    //   .catch(err => {
    //     setError('Failed to load hunt data');
    //     setLoading(false);
    //   });


  const handleSelectLocation = (coordinates) => {
    setMarkerPosition(coordinates);
  };

  const handleOpenHint = (hintIndex) => {
    setHintsUsed(hintsUsed + 1);
    // In a real app, you would track which hints were used
  };

  const calculateDistance = (
    lat1, 
    lon1, 
    lat2, 
    lon2
  ) => {
    // Haversine formula to calculate distance between two points
    const R = 6371e3; // Earth radius in meters
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; // Distance in meters
  };

  // const handleSubmitGuess = (coordinates, imageFile) => {
  //   if (!hunt || !markerPosition) return;
    
  //   const currentPuzzle = hunt.puzzles[currentPuzzleIndex];
  //   const targetCoords = currentPuzzle.location.coordinates;
    
  //   // Calculate distance between guess and actual location
  //   const distance = calculateDistance(
  //     markerPosition[1], markerPosition[0], 
  //     targetCoords[1], targetCoords[0]
  //   );
    
  //   // Check if guess is close enough (within 100 meters)
  //   const isCorrect = distance < 100;
    
  //   if (isCorrect) {
  //     // Calculate points based on accuracy and hints used
  //     const basePoints = hunt.level === 'easy' ? 100 : 
  //                        hunt.level === 'medium' ? 200 : 300;
  //     const hintPenalty = hintsUsed * 20;
  //     const accuracyBonus = Math.max(0, 50 - Math.floor(distance));
  //     const puzzlePoints = Math.max(0, basePoints - hintPenalty + accuracyBonus);
      
  //     setPoints(points + puzzlePoints);
  //     setCompletedPuzzles([...completedPuzzles, currentPuzzleIndex]);
      
  //     // Check if this was the last puzzle
  //     if (currentPuzzleIndex === (hunt.puzzles?.length || 0) - 1) {
  //       setShowSuccess(true);
  //     } else {
  //       // Move to next puzzle
  //       setCurrentPuzzleIndex(currentPuzzleIndex + 1);
  //       setMarkerPosition(null);
  //       setHintsUsed(0);
  //     }
      
  //     // In a real app, you would submit the guess to your API:
  //     // const guessData = {
  //     //   huntId: hunt._id,
  //     //   puzzleIndex: currentPuzzleIndex,
  //     //   guessedLocation: {
  //     //     coordinates: [markerPosition[0].toString(), markerPosition[1].toString()]
  //     //   },
  //     //   hintsOpened: hintsUsed,
  //     //   // If image is required, you would upload it and get a URL
  //     //   imageUrl: imageFile ? 'url_after_upload' : ''
  //     // };
  //     // 
  //     // axios.post('/api/hunts/guess', guessData)
  //     //   .then(response => {
  //     //     // Handle success
  //     //   })
  //     //   .catch(err => {
  //     //     setError('Failed to submit guess');
  //     //   });
  //   } else {
  //     // Show incorrect guess feedback
  //     setCurrentPuzzleIndex(currentPuzzleIndex + 1);
  //     setMarkerPosition(null);
  //     setHintsUsed(0);
  //     //alert(`Your guess is ${Math.round(distance)} meters away from the target. Try again!`);
  //   }
  // };
  const handleSubmitGuess = async () => {
    if (!hunt || !markerPosition) return;

    const currentPuzzle = hunt.puzzles[currentPuzzleIndex];
    const targetCoords = currentPuzzle.location.coordinates;
    const distance = calculateDistance(
      markerPosition[1], markerPosition[0], 
      targetCoords[1], targetCoords[0]
    );
    const timeTaken = Date.now() - startTime;
    const formData = new FormData();
    formData.append("huntId", hunt._id);
    formData.append("userId", userId);
    formData.append("puzzleId", currentPuzzle._id);
    formData.append("guessedLocation", JSON.stringify(markerPosition));
    formData.append("timeTaken",timeTaken ); 
    formData.append("hintsOpened", hintsUsed);

    // if (currentPuzzle.photoReq && imageFile) {
    //   formData.append("image", imageFile);
    // }

    try {
      const response = await fetch("http://localhost:3000/participant/submitGuess", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          huntId: hunt._id,
          userId: userId,
          puzzleId: currentPuzzle._id,
          guessedLocation: markerPosition,
          timeTaken,
          hintsOpened: hintsUsed,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to submit guess");
      console.log(data);
      console.log(data.data.pointsEarned)
      setPoints(points + (data.data.pointsEarned || 0));
      setCompletedPuzzles([...completedPuzzles, currentPuzzleIndex]);

      if (currentPuzzleIndex === hunt.puzzles.length - 1) {
        setShowSuccess(true);
      } else {
        setCurrentPuzzleIndex(currentPuzzleIndex + 1);
        setMarkerPosition(null);
        setHintsUsed(0);
        setImageFile(null);
        setStartTime(Date.now());
      }
    } catch (error) {
      console.error("Error submitting guess:", error.message);
    }
  };
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <p className="text-red-500 text-lg">{error}</p>
          <button 
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!hunt) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <p className="text-gray-700 text-lg">No active hunt found.</p>
        </div>
      </div>
    );
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
          <div className="flex justify-center mb-4">
            <Trophy className="text-yellow-500" size={64} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Congratulations!</h2>
          <p className="text-gray-700 mb-4">
            You've completed the "{hunt.name}" treasure hunt!
          </p>
          <div className="bg-indigo-50 p-4 rounded-lg mb-6">
            <p className="text-lg font-semibold text-indigo-800">
              Total Points: {points}
            </p>
            <p className="text-sm text-indigo-600">
              Puzzles Completed: {completedPuzzles.length}/{hunt.puzzles.length}
            </p>
          </div>
          <button 
  className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 w-full"
  onClick={() => navigate("/")}
>
  Find Another Hunt
</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-indigo-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <Compass className="mr-2" size={24} />
            <h1 className="text-xl font-bold">TreasureQuest</h1>
          </div>
          <div className="bg-indigo-700 px-4 py-2 rounded-full">
            <span className="font-semibold">{points} Points</span>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <HuntDetails hunt={hunt} />
            
            <HuntProgress 
              totalPuzzles={hunt.puzzles.length}
              currentPuzzleIndex={currentPuzzleIndex}
              completedPuzzles={completedPuzzles}
            />
          </div>
          
          <div className="lg:col-span-2 space-y-6">
          {hunt?.puzzles?.length > 0 && hunt.puzzles[currentPuzzleIndex] && (

              <>
                <PuzzleCard 
                  puzzle={hunt.puzzles[currentPuzzleIndex]}
                  currentIndex={currentPuzzleIndex}
                  onSubmitGuess={handleSubmitGuess}
                  onOpenHint={handleOpenHint}
                />
                
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-4 bg-indigo-50 border-b border-indigo-100">
                    <div className="flex items-center">
                      <Map className="mr-2 text-indigo-600" size={20} />
                      <h3 className="text-lg font-medium text-gray-800">
                        Place your marker on the map
                      </h3>
                    </div>
                  </div>
                  
                  <MapComponent 
                    initialViewState={{
                      longitude: -122.4194,
                      latitude: 37.7749,
                      zoom: 13
                    }}
                    onSelectLocation={handleSelectLocation}
                    markerPosition={markerPosition}
                  />
                  
                  <div className="p-4 border-t border-gray-200">
                    <button
                      onClick={() => markerPosition && handleSubmitGuess(markerPosition)}
                      disabled={!markerPosition}
                      className={`w-full py-3 rounded-md font-medium ${
                        markerPosition
                          ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                          : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      Submit Location
                    </button>
                    {!markerPosition && (
                      <p className="text-sm text-gray-500 mt-2 text-center">
                        Click on the map to place your marker
                      </p>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default QuizDisplay;