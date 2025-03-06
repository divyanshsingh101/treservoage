import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { HuntModel } from "../models/hunt.js";
//import redis from "ioredis";
import multer from "multer";
const storage = multer.memoryStorage(); // Stores file in memory, change as needed
const upload = multer({ storage });
const createHunt = asyncHandler(async(req,res)=>{
    const{name, description, puzzles, startTime, endTime ,createdBy,level}= req.body
    console.log(req.body)
try {
        console.log("1")
        if([name, description, puzzles, startTime, endTime,level ].some((field)=> field?.trim)===""){
            throw new ApiError(500, "All fields are required")
        }
        console.log("2")
        if (!puzzles || puzzles.length === 0) {
            throw new ApiError(500, "At least one puzzle is required");
        }
        console.log("3")
        puzzles.forEach((puzzle, index) => {
            const { puzzleText, location, hints, photoReq } = puzzle;
            console.log("4")
            if (!puzzleText || puzzleText.trim() === "") {
                throw new ApiError(500, `Puzzle ${index + 1}: puzzleText is required`);
            }
            // if (!photoReq ) {
            //     throw new ApiError(500, `Puzzle ${index + 1}: photoReq is required`);
            // }
            if (!location ||  location.coordinates.length !== 2 ) {
                throw new ApiError(500, `Puzzle ${index + 1}: valid location with latitude and longitude is required`);
            }
            if (!Array.isArray(hints)) {
                throw new ApiError(500, `Puzzle ${index + 1}: hints must be an array`);
            }
        });
        if(new Date(startTime)>= new Date(endTime)){
            throw new ApiError(400, "Start time must be before end time")
        }
      const hunt = await HuntModel.create({
        name, description, puzzles, startTime, endTime ,createdBy, level
      })
      if(!hunt){
        throw new ApiError(500, "Failed to create the hunt")
      }
      return res.status(200)
      .json(new ApiResponse(200,hunt, "Hunt craeted successfully"))
} catch (error) {
    throw new Error(error)
}
})


const getLiveHunts = asyncHandler(async (req, res) => {
    try {
        const currentTime = new Date();
        const currentTimeUTC = new Date(currentTime.getTime());

        // Fetch live hunts and populate only the participants field
        const liveHunts = await HuntModel.find({
            startTime: { $lte: currentTimeUTC },
            endTime: { $gte: currentTimeUTC },
        })
        .populate("participants") // ✅ Populates only participants (including hasAttempted field)
        .lean(); // Convert to plain JSON for efficiency

        if (!liveHunts) {
            throw new ApiError(500, "Failed to fetch live hunts");
        }

        res.status(200).json(new ApiResponse(200, liveHunts, "Fetched live hunts successfully"));
    } catch (error) {
        throw new Error(error);
    }
});


const getUpcomingEvents= asyncHandler(async(req, res)=>{
       try {
        const currentTime= new Date()
        const upcomingEvents = await HuntModel.find({
            startTime: {$gte: currentTime}
        })
        if(!upcomingEvents){
            throw new ApiError(500, "Failed to fetch Upcoming Events")
        }
        res.status(200)
        .json(new ApiResponse(200, upcomingEvents, "Fetched upcomimg events sucessfully"))
       } catch (error) {
        throw new Error(error)
       }
})

const participate= asyncHandler(async(req,res)=>{
try {
        const userId= req.user._id
        //console.log(participant)
       // console.log(req.body)
       console.log(userId);
        if(!userId){
            throw new ApiError(400, "Failed to fetch participant")
        }
        const {huntId}= req.params
        console.log(huntId)
        const hunt= await HuntModel.findById(huntId)
        console.log(hunt)
        if(!hunt){
            throw new ApiError(500, "Failed to fetch the hunt")
        }
        if (hunt.participants.some(participant => participant.user.toString() === userId.toString())) {
            throw new ApiError(400, "User already registered in the Hunt");
          }
        hunt.participants.push({user:userId})
        await hunt.save()

     
        
        return res.status(200)
        .json(new ApiResponse(200,{huntId:hunt._id, participantsCount: hunt.participants.length, puzzles: hunt}, "User participated sucessfully in the hunt"))
} catch (error) {
    throw new Error(error)
}

})
// const calculateDistance = (coords1, coords2) => {
//     const R = 6371e3; // Earth's radius in meters
//     const lat1 = (coords1.lat * Math.PI) / 180;
//     const lat2 = (coords2.lat * Math.PI) / 180;
//     const deltaLat = ((coords2.lat - coords1.lat) * Math.PI) / 180;
//     const deltaLng = ((coords2.lng - coords1.lng) * Math.PI) / 180;

//     const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
//               Math.cos(lat1) * Math.cos(lat2) *
//               Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);
//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

//     return R * c; // Distance in meters
// };
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

const submitGuess = asyncHandler(async (req, res) => {
    try {
        //console.log("started ")
        const { huntId, userId, puzzleId, guessedLocation, timeTaken, hintsOpened } = req.body;
        console.log("Received req.body:", req);  // Debugging
        

        if (!huntId || !userId || !puzzleId || !guessedLocation || !timeTaken || hintsOpened == null) {
            throw new ApiError(400, 'Missing required fields');
        }

        const hunt = await HuntModel.findById(huntId);
        if (!hunt) {
            throw new ApiError(404, 'Hunt not found');
        }

        const puzzle = hunt.puzzles.id(puzzleId);
        if (!puzzle) {
            throw new ApiError(404, 'Puzzle not found');
        }

        let imageUrl = '';
        if (puzzle.photoReq) {
            const huntImagePath = req.files?.image?.[0]?.path;
            if (!huntImagePath) {
                throw new ApiError(400, "Image is required for this puzzle");
            }

            const uploadImage = await uploadOnCloudinary(huntImagePath);
            if (!uploadImage) {
                throw new ApiError(500, "Failed to upload image to Cloudinary");
            }
            imageUrl = uploadImage.url;
        }

        const accuracyMargin = 1000; // 10 meters
        const { coordinates: originalCoordinates } = puzzle.location;
        let isCorrect = false;
        let scoreAdjustment = 0;
        console.log(guessedLocation, originalCoordinates);
        const distance = calculateDistance(guessedLocation[0],guessedLocation[1],originalCoordinates[0],originalCoordinates[1]);
        console.log(distance);
        if (distance <= accuracyMargin) {
            isCorrect = true;
            scoreAdjustment += 50; 
        }
       // scoreAdjustment=50;
        console.log(scoreAdjustment);
        if (hintsOpened === 1) {
            scoreAdjustment -= 10;
        } else if (hintsOpened === 2) {
            scoreAdjustment -= 30;
        }
        console.log(scoreAdjustment);
        // Adjust score based on time taken (> 15 minutes)
        const timeLimit = 15 * 60 * 1000; // 15 minutes in milliseconds
        if (timeTaken > timeLimit) {
            const extraMinutes = Math.floor((timeTaken - timeLimit) / (2 * 60 * 1000)); // Every 2 extra minutesgit 
            scoreAdjustment -= extraMinutes;
        }
        console.log(scoreAdjustment);
        // Check if participant exists in hunt
         // Find participant
         let participant = hunt.participants.find((p) => p.user.toString() === userId);
         if (!participant) {
             participant = { user: userId, guesses: [], points: 0, hasAttempted: true }; // ✅ Initialize hasAttempted as true
             hunt.participants.push(participant);
         } else {
             participant.hasAttempted = true; // ✅ Ensure hasAttempted is set to true
         }

        // Update participant's score
        participant.points = (participant.points || 0) + scoreAdjustment;

        // Add guess data to participant's guesses array
        participant.guesses.push({
            guessedLocation: {
                coordinates: guessedLocation,
            },
            imageUrl,
            hintsOpened,
            timestamp: new Date(),
        });

        // Save hunt document
        await hunt.save();

        // Clear leaderboard cache in Redis
        // await redis.del(`leaderboard_${huntId}`);
        console.log(scoreAdjustment);
        return res.status(200).json(new ApiResponse('Guess submitted successfully', { imageUrl, isCorrect, pointsEarned: scoreAdjustment }));
    } catch (error) {
        throw new Error(error);
    }
});



const yourHunts= asyncHandler(async(req, res)=>{
try {
        const createdBy= req.user._id
        if(!createdBy){
            throw new ApiError(500, "Failed to fetch user")
        } 
    const hunts = await HuntModel.find({createdBy})
    if(!hunts){
        throw new ApiError(404, "No hunts found")
    }
    return res.status(200)
    .json(new ApiResponse(200, hunts, "Hunts fetched sucessfully"))
} catch (error) {
    throw new Error(error)
}
})

const getParticipant= asyncHandler(async(req,res)=>{
    try {
        const { huntId } = req.params;
        const userId = req.user._id;

        const hunt = await HuntModel.findOne({ _id: huntId, createdBy: userId }).populate('participants.user', 'guesses.imageUrl');
        if (!hunt) {
            throw new ApiError(404, "Hunt not found or you're not authorized to view participants.");
        }
        const sortedParticipants = hunt.participants
            .map(participant => ({
                user: participant.user,
                score: participant.leaderboard.score,
                imageUrl: participant.user.guesses?.[0]?.imageUrl || null // Get the first image URL if it exists
            }))
            .sort((a, b) => b.score - a.score); 

        return res.status(200).json(new ApiResponse(200, sortedParticipants, "Participants fetched successfully"));
    
}catch (error) {
   throw new Error(error) 
}
})
const getHunt = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        console.log(id);
        console.log(req.user._id);
        const userId = req.user._id;
        console.log(userId.toString())
        // Find the hunt by ID
        const hunt = await HuntModel.findOne({ _id: id });
        //console.log(hunt);
        if (!hunt) {
            return res.status(404).json({ message: "Hunt not found" });
        }
        hunt.participants.some(participant => console.log(participant.user))

        // Check if the user is registered for the hunt
        if (!hunt.participants.some(participant => participant.user.toString() === userId.toString())) {
            console.log("hehe");
            return res.status(403).json({ message: "Access denied. You are not registered for this hunt." });
        }
        
        // If the user is registered, return the hunt details
        res.status(200).json({ message: "Access granted", hunt });
    } catch (error) {
        console.log(error);

        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

const isImageCorrect = asyncHandler(async (req, res) => {
    const { isCorrect, huntId, userId } = req.body;
    if (!isCorrect || !huntId || !userId) {
        throw new ApiError(400, "All fields are required");
    }
    try {
        let scoreAdj = 0;
        if (isCorrect === true) {
            scoreAdj += 30;
        } else {
            throw new ApiError(400, "Incorrect image uploaded");
        }

        const hunt = await HuntModel.findById(huntId);
        if (!hunt) {
            throw new ApiError(400, "Failed to fetch hunt");
        }
        const participant = hunt.participants.find(p => p.user.toString() === userId);
        if (!participant) {
            throw new ApiError(400, "Failed to fetch participant");
        }

        participant.points = (participant.points || 0) + scoreAdj;
        await hunt.save();

        return res.status(200).json(new ApiResponse(200, participant.points, "Points updated successfully"));
    } catch (error) {
        throw new Error(error);
    }
});




export{
    createHunt,
    getLiveHunts,
    getUpcomingEvents,
    participate,
    yourHunts,
    submitGuess,
    getParticipant,
    isImageCorrect,
    getHunt
}