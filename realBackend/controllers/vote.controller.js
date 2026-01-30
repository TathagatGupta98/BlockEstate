import { Vote } from "../models/vote.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";


// ================= CAST / UPDATE VOTE =================

export const castVote = asyncHandler(async (req, res) => {

  const { proposalId, value } = req.body;

  if (!proposalId || typeof value !== "boolean") {
    throw new ApiError(400, "proposalId and boolean value required");
  }

  // check if user already voted
  const existingVote = await Vote.findOne({
    userId: req.user._id,
    proposalId
  });

  // if voted → update
  if (existingVote) {
    existingVote.value = value;
    await existingVote.save();

    return res.json(
      new ApiResponse(200, existingVote, "Vote updated")
    );
  }

  // else create new vote
  const vote = await Vote.create({
    userId: req.user._id,
    proposalId,
    value
  });

  res
    .status(201)
    .json(new ApiResponse(201, vote, "Vote added"));
});


// ================= GET VOTES FOR PROPOSAL =================

export const getVotesForProposal = asyncHandler(async (req, res) => {

  const { proposalId } = req.params;

  const votes = await Vote.find({ proposalId })
    .populate("userId", "username email");

  res.json(new ApiResponse(200, votes));
});


// ================= COUNT ACCEPT / REJECT =================

export const getVoteStats = asyncHandler(async (req, res) => {

  const { proposalId } = req.params;

  const acceptCount = await Vote.countDocuments({
    proposalId,
    value: true
  });

  const rejectCount = await Vote.countDocuments({
    proposalId,
    value: false
  });

  res.json(
    new ApiResponse(200, {
      acceptCount,
      rejectCount
    })
  );
});


// ================= GET MY VOTES =================

export const getMyVotes = asyncHandler(async (req, res) => {

  const votes = await Vote.find({ userId: req.user._id })
    .populate("proposalId");

  res.json(new ApiResponse(200, votes));
});


// ================= REMOVE VOTE =================

// export const removeVote = asyncHandler(async (req, res) => {

//   const { proposalId } = req.params;

//   const deleted = await Vote.findOneAndDelete({
//     userId: req.user._id,
//     proposalId
//   });

//   if (!deleted) {
//     throw new ApiError(404, "Vote not found");
//   }

//   res.json(new ApiResponse(200, {}, "Vote removed"));
// });
