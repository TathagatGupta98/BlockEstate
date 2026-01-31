import { Router } from "express";
import { getProposalFeasibility } from "../controllers/ai.controller.js";

const router = Router();

console.log("✅ AI routes mounted");

// Public
router.post("/proposal/feasibility", getProposalFeasibility);

router.get("/ping", (req, res) => {
    res.json({ success: true, message: "AI route working" });
});


export default router;
