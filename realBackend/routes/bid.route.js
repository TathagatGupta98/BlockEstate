import { Router } from "express";
import { 
  createBid, 
  getBidsForProposal, 
  getBidsByCompany, 
  getBidById, 
  updateBid, 
  deleteBid 
} from "../controllers/bid.controller.js";

const router = Router();

router.post("/create", createBid);
router.get("/proposal/:proposalId", getBidsForProposal);
router.get("/company/:companyId", getBidsByCompany);
router.get("/:id", getBidById);
router.put("/:id", updateBid);
router.delete("/:id", deleteBid);

export default router;