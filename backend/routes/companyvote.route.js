import { Router } from "express";
import { 
  addVote, 
  getVotesByBid, 
  getVotesByUser 
} from "../controllers/companyvote.controller.js";

const router = Router();

router.post("/", addVote);
router.get("/bid/:bidId", getVotesByBid);
router.get("/user", getVotesByUser);

export default router;