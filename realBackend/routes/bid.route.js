import { Router } from "express";
import { createBid,getBidsForProposal,getBidsByCompany,getBidById,updateBid,deleteBid } from "../controllers/bid.controller";

const router=Router();
router.post("/creatbid",createBid),
router.get("/getbidssforpropsal",getBidsForProposal),
router.get("/getbidsbycompany",getBidsByCompany),
router.get("/getbidbyid",getBidById)
