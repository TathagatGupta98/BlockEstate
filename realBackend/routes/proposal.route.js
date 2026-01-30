import { createProposal,getAllProposals,updateProposal,acceptProposal,rejectProposal } from "../controllers/propasal.controller";
import { Router } from "express";

const router=Router();
router.post("/creatproposal",createProposal),
router.get("/getallproposal",getAllProposals),
router.post("/acceptproposal",acceptProposal),
router.post("/rejectproposal",rejectProposal)