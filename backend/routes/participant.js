import { Router } from "express";
import { getHunt,getLiveHunts, getUpcomingEvents, createHunt, participate, yourHunts, submitGuess, getParticipant, isImageCorrect} from "../controllers/participant.js";
import { isVerified } from "../middlewares/auth.js";
import {upload} from "../middlewares/multer.js"
const router= Router()
router.route("/liveHunts", isVerified).get(getLiveHunts)
router.route("/upcomingHunts", isVerified).get(getUpcomingEvents)
router.route("/createHunt").post(createHunt)
router.route("/participate/:huntId", isVerified).post(participate)
router.route("/yourHunts", isVerified).get(yourHunts)
router.route("/verifyImage", isVerified).post(isImageCorrect)
router.route("/submitGuess", isVerified).post(submitGuess)
router.route("/getParticipants/:huntId", isVerified).get(getParticipant)
router.route("/getHunt/:id",isVerified).get(getHunt)

export default router