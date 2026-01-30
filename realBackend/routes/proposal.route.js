import { Router } from "express";
import { 
  createProposal, 
  getAllProposals,
  getProposalById,
  updateProposal, 
  deleteProposal,
  acceptProposal, 
  rejectProposal 
} from "../controllers/proposal.controller.js";

const router = Router();

router.post("/create", createProposal);
router.get("/", getAllProposals);
router.get("/:id", getProposalById);
router.patch("/:id/accept", acceptProposal);
router.patch("/:id/reject", rejectProposal);

export default router;