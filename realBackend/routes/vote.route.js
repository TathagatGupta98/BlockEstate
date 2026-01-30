import { Router } from "express";
import { castVote,getVotesForProposal,getVoteStats,getMyVotes } from "../controllers/vote.controller";

const router=Router()
router.post("/vote",castVote);
router.get('/getvotesforproposal',getVotesForProposal);
router.get("/getvotestats",getVoteStats);
router.get("/getmyvotes",getMyVotes);
