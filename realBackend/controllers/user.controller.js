import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

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





  if (!email || !username || !password || !walletAddress?.trim() || HouseNo == null) {
    throw new ApiError(400, "All fields are required");
  }


  
  const exists = await User.findOne({ $or: [{ email }, { username }] });
  
  if (exists) {
    console.log("User already exists:", exists.email || exists.username);
    throw new ApiError(409, "User with email or username already exists");
  }


  
  const user = await User.create({ 
    email, 
    username, 
    password, 
    walletAddress, 
    HouseNo 
  });

  console.log("User created successfully:", user._id);

  const createdUser = await User.findById(user._id).select("-password -refreshToken");

  res.status(201).json(new ApiResponse(201, createdUser, "User registered successfully"));
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