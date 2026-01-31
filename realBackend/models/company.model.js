import mongoose, { model } from "mongoose";

const company = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  walletAddress: {
    type: String,
  },
  verified: {
    type: String,
    enum: ["pending", "verified", "rejected"],
    default: "verified"
  },
}, { timestamps: true });

export const Company =mongoose.model("Company", company);