import { Bid } from "../models/bid.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";


// ================= CREATE BID =================

export const createBid = asyncHandler(async (req, res) => {

  const { proposalId, companyId, estimatedId, description } = req.body;

  // Enhanced validation with better error messages
  if (!proposalId) {
    throw new ApiError(400, "proposalId is required");
  }

  if (!companyId) {
    throw new ApiError(400, "companyId is required");
  }

  if (!description) {
    throw new ApiError(400, "description is required");
  }

  console.log("Creating bid with data:", { proposalId, companyId, estimatedId, description });

  // Prevent same company bidding twice on same proposal
  const exists = await Bid.findOne({ proposalId, companyId });

  if (exists) {
    throw new ApiError(409, "Company already bid on this proposal");
  }

  const bid = await Bid.create({
    proposalId,
    companyId,
    estimatedId: estimatedId || "", // Make it optional
    description
  });

  console.log("Bid created successfully:", bid);

  res
    .status(201)
    .json(new ApiResponse(201, bid, "Bid created"));
});


// ================= GET ALL BIDS FOR PROPOSAL =================

export const getBidsForProposal = asyncHandler(async (req, res) => {

  const { proposalId } = req.params;

  const bids = await Bid.find({ proposalId })
    .populate("companyId", "name walletAddress verified")
    .sort({ createdAt: -1 });

  res.json(new ApiResponse(200, bids));
});


// ================= GET ALL BIDS BY COMPANY =================

export const getBidsByCompany = asyncHandler(async (req, res) => {

  const { companyId } = req.params;

  const bids = await Bid.find({ companyId })
    .populate("proposalId", "title description status");

  res.json(new ApiResponse(200, bids));
});


// ================= GET SINGLE BID =================

export const getBidById = asyncHandler(async (req, res) => {

  const { id } = req.params;

  const bid = await Bid.findById(id)
    .populate("companyId", "name")
    .populate("proposalId", "title");

  if (!bid) {
    throw new ApiError(404, "Bid not found");
  }

  res.json(new ApiResponse(200, bid));
});


// ================= UPDATE BID =================

export const updateBid = asyncHandler(async (req, res) => {

  const { id } = req.params;

  const updated = await Bid.findByIdAndUpdate(
    id,
    req.body,
    { new: true }
  );

  if (!updated) {
    throw new ApiError(404, "Bid not found");
  }

  res.json(new ApiResponse(200, updated, "Bid updated"));
});


// ================= DELETE BID =================

export const deleteBid = asyncHandler(async (req, res) => {

  const { id } = req.params;

  const bid = await Bid.findByIdAndDelete(id);

  if (!bid) {
    throw new ApiError(404, "Bid not found");
  }

  res.json(new ApiResponse(200, {}, "Bid deleted"));
});