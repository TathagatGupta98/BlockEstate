import { Router } from "express";
import {
  registerCompany,
  loginCompany,
  getAllCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany
} from "../controllers/company.controller.js";

const router = Router();

router.post("/register", registerCompany);
router.post("/login", loginCompany);
router.get("/", getAllCompanies);
router.get("/:id", getCompanyById);
// router.put("/:id", updateCompany);
// router.delete("/:id", deleteCompany);

export default router;