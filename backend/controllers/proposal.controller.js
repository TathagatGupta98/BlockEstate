import { Proposal } from "../models/proposal.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { ethers } from "ethers";

// Ensure these are loaded correctly
const GOVERNOR_ADDRESS = process.env.GOVERNOR_ADDRESS; 
const RPC_URL = process.env.SEPOLIA_RPC_URL;

const GOVERNOR_ABI = [
  "function state(uint256 proposalId) public view returns (uint8)"
];

export const createProposal = asyncHandler(async (req, res) => {
  const { title, description, videoFile, imageFile, onChainProposalId, txHash,status_stage } = req.body;

  if (!title || !description) {
    throw new ApiError(400, "Title and description required");
  }

  const proposal = await Proposal.create({
    title,
    description,
    videoFile,
    imageFile,
    onChainProposalId,
    txHash,
    status: false,
    status_stage: status_stage || "stage-1"
  });

  res.status(201).json(new ApiResponse(201, proposal, "Proposal created"));
});

export const getAllProposals = asyncHandler(async (req, res) => {
  const proposals = await Proposal.find()
    .populate("ownerId", "username email")
    .sort({ createdAt: -1 });

  res.json(new ApiResponse(200, proposals));
});

// ================= GET ONE =================
export const getProposalById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const proposal = await Proposal.findById(id).populate("ownerId", "username email");

  if (!proposal) {
    throw new ApiError(404, "Proposal not found");
  }

  res.json(new ApiResponse(200, proposal));
});

// ================= UPDATE =================
export const updateProposal = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  // Use findByIdAndUpdate to ensure we get the fresh document back
  const updated = await Proposal.findByIdAndUpdate(
    id, 
    req.body, 
    { new: true, runValidators: true }
  );

  if (!updated) {
    throw new ApiError(404, "Proposal not found");
  }

  res.json(new ApiResponse(200, updated, "Updated"));
});

// ================= DELETE =================
export const deleteProposal = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const proposal = await Proposal.findById(id);

  if (!proposal) throw new ApiError(404, "Proposal not found");

  await proposal.deleteOne();
  res.json(new ApiResponse(200, {}, "Deleted"));
});

// ================= ACCEPT VOTE =================
export const acceptProposal = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const proposal = await Proposal.findByIdAndUpdate(
    id,
    { $inc: { acceptCount: 1 } },
    { new: true }
  );
  if (!proposal) throw new ApiError(404, "Proposal not found");
  res.json(new ApiResponse(200, proposal, "Accepted"));
});

// ================= REJECT VOTE =================
export const rejectProposal = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const proposal = await Proposal.findByIdAndUpdate(
    id,
    { $inc: { rejectCount: 1 } },
    { new: true }
  );
  if (!proposal) throw new ApiError(404, "Proposal not found");
  res.json(new ApiResponse(200, proposal, "Rejected"));
});

// ================= SYNC STATUS (FIXED) =================
export const syncProposalStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  // 1. Fetch from DB
  const proposal = await Proposal.findById(id);
  if (!proposal) throw new ApiError(404, "Proposal not found");

  // Validate inputs
  if (!proposal.onChainProposalId) {
     return res.status(200).json(new ApiResponse(200, proposal, "Skipped: No on-chain ID"));
  }

  console.log(`[SYNC] Checking Proposal: ${proposal.title} (ChainID: ${proposal.onChainProposalId})`);

  try {
    // 2. Connect to Blockchain
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const governor = new ethers.Contract(GOVERNOR_ADDRESS, GOVERNOR_ABI, provider);

    // 3. Get State (Handle BigInt conversion safely)
    const stateRaw = await governor.state(proposal.onChainProposalId);
    const stateEnum = Number(stateRaw); // Convert BigInt to Number
    
    console.log(`[SYNC] Chain State is: ${stateEnum} (Current DB Stage: ${proposal.status_stage})`);

    // 4. Determine Target Stage
    // States: 0:Pending, 1:Active, 2:Canceled, 3:Defeated, 4:Succeeded, 5:Queued, 6:Expired, 7:Executed
    let targetStage = proposal.status_stage;

    if (stateEnum === 4) { // SUCCEEDED
      targetStage = "stage-2";
    } else if (stateEnum === 3) { // DEFEATED
      targetStage = "defeated";
    } else if (stateEnum === 7) { // EXECUTED
      targetStage = "stage-4";
    }

    // 5. Update DB ONLY if changed
    if (targetStage !== proposal.status_stage) {
      console.log(`[SYNC] UPGRADING STATUS: ${proposal.status_stage} -> ${targetStage}`);
      
      const updatedProposal = await Proposal.findByIdAndUpdate(
        id,
        { 
          $set: { 
            status_stage: targetStage,
            // If succeeded, ensure general status is true
            status: (stateEnum === 4 || stateEnum === 7) ? true : proposal.status 
          } 
        },
        { new: true } // IMPORTANT: Returns the updated document to the frontend
      );

      return res.json(new ApiResponse(200, { 
        proposal: updatedProposal, 
        chainState: stateEnum 
      }, `Status updated to ${targetStage}`));
    }

    // No change needed
    return res.json(new ApiResponse(200, { 
      proposal, 
      chainState: stateEnum 
    }, "Synced: No change"));

  } catch (error) {
    console.error("[SYNC ERROR]:", error.message);
    // Return existing data on error so UI doesn't crash
    res.json(new ApiResponse(200, proposal, "Sync failed (RPC Error)"));
  }
});