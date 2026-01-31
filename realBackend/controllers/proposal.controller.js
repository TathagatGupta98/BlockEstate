import { Proposal } from "../models/proposal.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";


// ================= CREATE =================

export const createProposal = asyncHandler(async (req, res) => {

  const { title, description, videoFile, imageFile, onChainProposalId, txHash ,status_stage} = req.body;

  if (!title || !description) {
    throw new ApiError(400, "Title and description required");
  }

  const proposal = await Proposal.create({
    // ownerId: req.user._id,   // coming from JWT middleware
    title,
    description,
    videoFile,
    imageFile,
    onChainProposalId,
    txHash,
    status_stage,
    status: false
  });

  res
    .status(201)
    .json(new ApiResponse(201, proposal, "Proposal created"));
});


// ================= GET ALL =================

export const getAllProposals = asyncHandler(async (req, res) => {

  const proposals = await Proposal.find()
    .populate("ownerId", "username email")
    .sort({ createdAt: -1 });

  res.json(new ApiResponse(200, proposals));
});


// ================= GET ONE =================

export const getProposalById = asyncHandler(async (req, res) => {

  const { id } = req.params;

  const proposal = await Proposal.findById(id)
    .populate("ownerId", "username email");

  if (!proposal) {
    throw new ApiError(404, "Proposal not found");
  }

  res.json(new ApiResponse(200, proposal));
});


// ================= UPDATE =================

export const updateProposal = asyncHandler(async (req, res) => {

  const { id } = req.params;

  const proposal = await Proposal.findById(id);

  if (!proposal) {
    throw new ApiError(404, "Proposal not found");
  }

  // Only owner can update
  if (proposal.ownerId.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Not allowed");
  }

  const updated = await Proposal.findByIdAndUpdate(
    id,
    req.body,
    { new: true }
  );

  res.json(new ApiResponse(200, updated, "Updated"));
});


// ================= DELETE =================

export const deleteProposal = asyncHandler(async (req, res) => {

  const { id } = req.params;

  const proposal = await Proposal.findById(id);

  if (!proposal) {
    throw new ApiError(404, "Proposal not found");
  }

  if (proposal.ownerId.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Not allowed");
  }

  await proposal.deleteOne();

  res.json(new ApiResponse(200, {}, "Deleted"));
});


// ================= ACCEPT =================

export const acceptProposal = asyncHandler(async (req, res) => {

  const { id } = req.params;

  const proposal = await Proposal.findByIdAndUpdate(
    id,
    { $inc: { acceptCount: 1 } },
    { new: true }
  );

  if (!proposal) {
    throw new ApiError(404, "Proposal not found");
  }

  res.json(new ApiResponse(200, proposal, "Accepted"));
});


// ================= REJECT =================

export const rejectProposal = asyncHandler(async (req, res) => {

  const { id } = req.params;

  const proposal = await Proposal.findByIdAndUpdate(
    id,
    { $inc: { rejectCount: 1 } },
    { new: true }
  );

  if (!proposal) {
    throw new ApiError(404, "Proposal not found");
  }

  res.json(new ApiResponse(200, proposal, "Rejected"));
});
