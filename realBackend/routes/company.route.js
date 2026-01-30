import { Router } from "express";
import { createCompany,getAllCompanies,getCompanyById,updateCompany,deleteCompany,verifyCompany } from "../controllers/company.controller";

const router=Router();
router.post("/creatcompany",createCompany),
router.get("/getallcompanyes",getAllCompanies),
router.get("/getcompantbyid",getCompanyById)