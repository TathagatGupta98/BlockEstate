import { Router } from "express";
import { 
  castVote, 
  getVotesForProposal, 
  getVoteStats, 
  getMyVotes 
} from "../controllers/vote.controller.js";

const router = Router();

router.post("/", castVote);
router.get("/proposal/:proposalId", getVotesForProposal);
router.get("/stats/:proposalId", getVoteStats);
router.get("/my-votes", getMyVotes);

export default router;