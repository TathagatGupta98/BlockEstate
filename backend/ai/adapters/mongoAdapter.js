import { connectDB } from "../db/connect.js";
import { BidResult } from "../models/BidResult.js";
import { evaluateBids } from "../index.js";

export async function evaluateBidsWithMongo(bids) {
  await connectDB();

  const result = await evaluateBids(bids);

  const saved = await BidResult.create({
    bids,
    winner: result.winner,
    ranking: result.ranking,
    explanation: result.explanation
  });

  return {
    ...result,
    mongoId: saved._id
  };
}
