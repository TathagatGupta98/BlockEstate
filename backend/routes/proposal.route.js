import { Router } from "express";
import { 
  createProposal, 
  getAllProposals,
  getProposalById,
  updateProposal, 
  deleteProposal,
  acceptProposal, 
  rejectProposal,
  syncProposalStatus // <--- IMPORT THIS
} from "../controllers/proposal.controller.js";

const router = Router();

router.post("/create", createProposal);
router.get("/", getAllProposals);
router.get("/:id", getProposalById);
router.patch("/:id/accept", acceptProposal);
router.patch("/:id/reject", rejectProposal);

// New Route for Lazy Sync
router.post("/:id/sync", syncProposalStatus);

export default router;