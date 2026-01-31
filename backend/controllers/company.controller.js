import { Company } from "../models/company.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";


// ================= CREATE =================

export const createCompany = asyncHandler(async (req, res) => {

  const { name, walletAddress } = req.body;

  if (!name) {
    throw new ApiError(400, "Company name required");
  }

  const exists = await Company.findOne({ name });

  if (exists) {
    throw new ApiError(409, "Company already exists");
  }

  const company = await Company.create({
    name,
    walletAddress,
    verified: "pending"   // default flow
  });

  res
    .status(201)
    .json(new ApiResponse(201, company, "Company created"));
});


// ================= GET ALL =================

export const getAllCompanies = asyncHandler(async (req, res) => {

  const companies = await Company.find()
    .sort({ createdAt: -1 });

  res.json(new ApiResponse(200, companies));
});


// ================= GET ONE =================

export const getCompanyById = asyncHandler(async (req, res) => {

  const { id } = req.params;

  const company = await Company.findById(id);

  if (!company) {
    throw new ApiError(404, "Company not found");
  }

  res.json(new ApiResponse(200, company));
});


// ================= UPDATE =================

export const updateCompany = asyncHandler(async (req, res) => {

  const { id } = req.params;

  const updated = await Company.findByIdAndUpdate(
    id,
    req.body,
    { new: true }
  );

  if (!updated) {
    throw new ApiError(404, "Company not found");
  }

  res.json(new ApiResponse(200, updated, "Updated"));
});


// ================= DELETE =================

export const deleteCompany = asyncHandler(async (req, res) => {

  const { id } = req.params;

  const company = await Company.findByIdAndDelete(id);

  if (!company) {
    throw new ApiError(404, "Company not found");
  }

  res.json(new ApiResponse(200, {}, "Deleted"));
});


// ================= VERIFY COMPANY =================

export const verifyCompany = asyncHandler(async (req, res) => {

  const { id } = req.params;

  const company = await Company.findByIdAndUpdate(
    id,
    { verified: "verified" },
    { new: true }
  );

  if (!company) {
    throw new ApiError(404, "Company not found");
  }

  res.json(new ApiResponse(200, company, "Company verified"));
});


//================= UNVERIFY / REJECT =================

export const rejectCompany = asyncHandler(async (req, res) => {

  const { id } = req.params;

  const company = await Company.findByIdAndUpdate(
    id,
    { verified: "rejected" },
    { new: true }
  );

  if (!company) {
    throw new ApiError(404, "Company not found");
  }

  res.json(new ApiResponse(200, company, "Company rejected"));
});
