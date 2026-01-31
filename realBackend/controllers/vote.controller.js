import { Vote } from "../models/vote.model.js";
import { Proposal } from "../models/proposal.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

export const castVote = asyncHandler(async (req, res) => {
  const { proposalId, value } = req.body;

  if (!proposalId || typeof value !== "boolean") {
    throw new ApiError(400, "proposalId and boolean value required");
  }

  // ensure proposal exists
  const proposal = await Proposal.findById(proposalId);
  if (!proposal) {
    throw new ApiError(404, "Proposal not found");
  }

  // check if user already voted
  const existingVote = await Vote.findOne({
    userId: req.user._id,
    proposalId,
  });

  // ======================
  // CASE 1: update vote
  // ======================
  if (existingVote) {
    const prevValue = existingVote.value;

    // if same vote again -> do nothing
    if (prevValue === value) {
      return res.json(new ApiResponse(200, existingVote, "Vote unchanged"));
    }

    // update vote
    existingVote.value = value;
    await existingVote.save();

    // update proposal counts (reverse previous, apply new)
    if (prevValue === true) {
      proposal.acceptCount = Math.max(0, (proposal.acceptCount || 0) - 1);
    } else if (prevValue === false) {
      proposal.rejectCount = Math.max(0, (proposal.rejectCount || 0) - 1);
    }

    if (value === true) proposal.acceptCount = (proposal.acceptCount || 0) + 1;
    if (value === false) proposal.rejectCount = (proposal.rejectCount || 0) + 1;

    await proposal.save();

    return res.json(
        new ApiResponse(
            200,
            { vote: existingVote, proposal },
            "Vote updated"
        )
    );
  }

  // ======================
  // CASE 2: create vote
  // ======================
  const vote = await Vote.create({
    userId: req.user._id,
    proposalId,
    value,
  });

  // increment proposal counter
  if (value === true) proposal.acceptCount = (proposal.acceptCount || 0) + 1;
  else proposal.rejectCount = (proposal.rejectCount || 0) + 1;

  await proposal.save();

  res.status(201).json(
      new ApiResponse(201, { vote, proposal }, "Vote added")
  );
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
