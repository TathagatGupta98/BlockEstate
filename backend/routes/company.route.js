import { Router } from "express";
import { 
  createCompany, 
  getAllCompanies, 
  getCompanyById, 
  updateCompany, 
  deleteCompany, 
  verifyCompany,
  rejectCompany 
} from "../controllers/company.controller.js";

const router = Router();

router.post("/create", createCompany);
router.get("/", getAllCompanies);
router.get("/:id", getCompanyById);
router.put("/:id", updateCompany);

export default router;