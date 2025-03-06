import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
//import redis from 'ioredis';
import { HuntModel } from "../models/hunt.js";

// export const joinEvent = asyncHandler(async (req, res) => {
//     const { userId, huntId } = req.body;

//     if (!userId || !huntId) {
//         throw new ApiError(400, 'User ID and Hunt ID are required');
//     }

//     const currentTime = new Date();

//     const hunt = await HuntModel.findByIdAndUpdate(
//         huntId,
//         {
//             $addToSet: { participants: { user: userId, guesses: [] } },
//             $push: {
//                 leaderboard: {
//                     user: userId,
//                     score: 0,
//                     timeCompleted: currentTime
//                 }
//             }
//         },
//         { new: true, runValidators: true }
//     );

//     if (!hunt) {
//         throw new ApiError(404, 'Hunt not found');
//     }

//     await redis.del(`leaderboard_${huntId}`);
//     res.status(201).json(new ApiResponse(201, hunt, 'Joined event successfully'));
// });

const getLeaderboard = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const hunt = await HuntModel.findById(id)
        .populate({
            path: "participants.user", // ✅ Populate user inside participants
            select: "name email", // Fetch only name & email
        })
        .lean(); // Convert Mongoose object to plain JSON

    if (!hunt) {
        return res.status(404).json({ message: "Hunt not found" });
    }

    res.json({ message: "Access granted", hunt });

});

// export const updateGuess = asyncHandler(async (req, res) => {
//     const { huntId, userId, puzzleId, guessedLocation, points, timeTaken } = req.body;

//     if (!huntId || !userId || !puzzleId || !guessedLocation || !points || !timeTaken) {
//         throw new ApiError(400, 'Missing required fields');
//     }

//     const hunt = await HuntModel.findOneAndUpdate(
//         {
//             _id: huntId,
//             'participants.user': userId
//         },
//         {/*  */
//             $push: {
//                 'participants.$.guesses': {
//                     puzzleId,
//                     guessedLocation,
//                     timestamp: new Date(),
//                     points
//                 }
//             },
//             $inc: {
//                 'leaderboard.$[user].score': points,
//                 'leaderboard.$[user].timeCompleted': timeTaken
//             }
//         },
//         {
//             new: true,
//             arrayFilters: [{ 'user.user': userId }],
//             runValidators: true
//         }
//     );

//     if (!hunt) {
//         throw new ApiError(404, 'Hunt or participant not found');
//     }

//     await redis.del(`leaderboard_${huntId}`);
//     res.status(200).json(new ApiResponse(200, hunt, 'Guess updated successfully'));
// });

const getScore= asyncHandler(async(req,res)=>{
    try {
        const {huntId}= req.params

    } catch (error) {
        throw new Error(error)
    }
    

})

export{
    getLeaderboard,
    getScore
};