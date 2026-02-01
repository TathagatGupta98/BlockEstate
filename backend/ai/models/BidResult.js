import mongoose from "mongoose";

const BidResultSchema = new mongoose.Schema(
  {
    bids: Array,
    winner: String,
    ranking: Array,
    explanation: String
  },
  { timestamps: true }
);

export const BidResult = mongoose.model("BidResult", BidResultSchema);
