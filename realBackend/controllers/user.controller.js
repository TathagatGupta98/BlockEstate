import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

const generateTokens = async (user) => {
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });
  return { accessToken, refreshToken };
};

export const registerUser = asyncHandler(async (req, res) => {
  const { email, username, password,walletAddress,HouseNo } = req.body;
  if (!email || !username || !password || !walletAddress || !HouseNo )
    throw new ApiError(400, "All fields required");

  const exists = await User.findOne({ $or: [{ email }, { username }] });
  if (exists) throw new ApiError(409, "User exists");

  const user = await User.create({ email, username, password,walletAddress,HouseNo });
  res.status(201).json(new ApiResponse(201, user, "Registered"));
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;
  const user = await User.findOne({ $or: [{ email }, { username }] });
  if (!user || !(await user.isPasswordCorrect(password)))
    throw new ApiError(401, "Invalid credentials");

  const tokens = await generateTokens(user);

  res
    .cookie("accessToken", tokens.accessToken, { httpOnly: true })
    .cookie("refreshToken", tokens.refreshToken, { httpOnly: true })
    .json(new ApiResponse(200, { user }, "Logged in"));
});

export const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { refreshToken: null });
  res.clearCookie("accessToken").clearCookie("refreshToken");
  res.json(new ApiResponse(200, {}, "Logged out"));
});