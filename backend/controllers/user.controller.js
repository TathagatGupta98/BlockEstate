import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ethers } from "ethers";

// Keep static ABI constant at top
const CONTRACT_ABI = ["function safeMint(address to) public"];

const generateTokens = async (user) => {
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });
  return { accessToken, refreshToken };
};

export const registerUser = asyncHandler(async (req, res) => {
  console.log("=== REGISTER USER ===");
  console.log("Request body:", req.body);
  
  const { email, username, password, walletAddress, HouseNo } = req.body;

  // 1. Validation
  if (!email || !username || !password || !walletAddress || !HouseNo) {
    throw new ApiError(400, "All fields are required");
  }

  // 2. Check Existence
  const exists = await User.findOne({ $or: [{ email }, { username }] });
  if (exists) {
    throw new ApiError(409, "User with email or username already exists");
  }

  // 3. Create User in DB
  const user = await User.create({ 
    email, 
    username, 
    password, 
    walletAddress, 
    HouseNo 
  });

  console.log("User created successfully:", user._id);

  // ============================================================
  // START: GOVERNANCE TOKEN MINTING LOGIC
  // ============================================================
  let mintStatus = "Minting successful";
  
  // FIX: Read env variables inside the function to ensure they are loaded
  const rpcUrl = process.env.SEPOLIA_RPC_URL;
  const privateKey = process.env.ADMIN_PRIVATE_KEY;
  const contractAddress = process.env.HOUSING_TOKEN_ADDRESS;

  try {
    // Check if blockchain config exists
    if (!rpcUrl || !privateKey || !contractAddress) {
      console.warn("⚠️ Blockchain env variables missing. Skipping token minting.");
      mintStatus = "Minting skipped (Server Config Missing)";
    } else {
      console.log(`Initiating Governance Token mint for ${walletAddress}...`);
      
      // 1. Connect to Blockchain
      const provider = new ethers.JsonRpcProvider(rpcUrl);
      const adminWallet = new ethers.Wallet(privateKey, provider);
      const contract = new ethers.Contract(contractAddress, CONTRACT_ABI, adminWallet);

      // 2. Call Smart Contract
      // We don't await tx.wait() to keep the UI snappy
      const tx = await contract.safeMint(walletAddress);
      console.log(`Minting Transaction Sent: ${tx.hash}`);
      
      mintStatus = "Minting initiated";
    }
  } catch (err) {
    console.error("❌ Token Minting Failed:", err.message);
    // We swallow the error so the user is still registered in the database.
    mintStatus = "User registered, but Minting Failed. Contact Admin.";
  }
  // ============================================================
  // END: GOVERNANCE TOKEN MINTING LOGIC
  // ============================================================

  const createdUser = await User.findById(user._id).select("-password -refreshToken");

  res.status(201).json(
    new ApiResponse(201, { user: createdUser, mintStatus }, "User registered successfully")
  );
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  if (!email && !username) {
    console.log("Validation failed - no email or username");
    throw new ApiError(400, "Username or email is required");
  }

  if (!password) {
    console.log("Validation failed - no password");
    throw new ApiError(400, "Password is required");
  }

  const user = await User.findOne({ $or: [{ email }, { username }] });
  
  if (!user) {
    console.log("User not found");
    throw new ApiError(401, "Invalid credentials");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  
  if (!isPasswordValid) {
    console.log("Invalid password");
    throw new ApiError(401, "Invalid credentials");
  }

  const tokens = await generateTokens(user);

  const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax"
  };

  console.log("Login successful, sending response");

  res
    .status(200)
    .cookie("accessToken", tokens.accessToken, cookieOptions)
    .cookie("refreshToken", tokens.refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken: tokens.accessToken },
        "User logged in successfully"
      )
    );
});

export const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    { $set: { refreshToken: null } },
    { new: true }
  );

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax"
  };

  console.log("Logout successful");

  res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});