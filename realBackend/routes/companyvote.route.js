import { Router } from "express";
import { addVote,getVotesByBid,getVotesByUser } from "../controllers/companyvote.controller";

const router=Router();
router.post("/addvote",addVote),
router.get("/getvotesbyid",getVotesByBid),
router.get("/getvotebyuser",getVotesByUser)

