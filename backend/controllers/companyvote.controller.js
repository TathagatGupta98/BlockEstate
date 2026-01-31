import { CompanyVote } from "../models/companyVote.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";


// ================= ADD VOTE =================

export const addVote = asyncHandler(async (req, res) => {

  const { bidId } = req.body;

  if (!bidId) {
    throw new ApiError(400, "bidId required");
  }

  // prevent duplicate vote
  const alreadyVoted = await CompanyVote.findOne({
    userId: req.user._id,
    bidId
  });

  if (alreadyVoted) {
    throw new ApiError(409, "Already voted");
  }

  const vote = await CompanyVote.create({
    userId: req.user._id,
    bidId
  });

  res
    .status(201)
    .json(new ApiResponse(201, vote, "Vote added"));
});


// ================= GET VOTES FOR A BID =================

export const getVotesByBid = asyncHandler(async (req, res) => {

  const { bidId } = req.params;

  const votes = await CompanyVote.find({ bidId })
    .populate("userId", "username email");

  res.json(new ApiResponse(200, votes));
});


// ================= GET VOTES BY USER =================

export const getVotesByUser = asyncHandler(async (req, res) => {

  const votes = await CompanyVote.find({ userId: req.user._id })
    .populate("bidId");

  res.json(new ApiResponse(200, votes));
});


// ================= REMOVE VOTE =================

// export const removeVote = asyncHandler(async (req, res) => {

//   const { bidId } = req.params;

//   const vote = await CompanyVote.findOneAndDelete({
//     userId: req.user._id,
//     bidId
//   });

//   if (!vote) {
//     throw new ApiError(404, "Vote not found");
//   }

//   res.json(new ApiResponse(200, {}, "Vote removed"));
// });
