import mongoose, { model, SchemaTypes } from "mongoose";

const companyVote = new mongoose.Schema({
  userId: {
    type: SchemaTypes.ObjectId,
    ref: "User",
    required: true,
  },
  bidId: {
    type: SchemaTypes.ObjectId,
    ref: "Bid",
    required: true,
  }
}, {
  timestamps: true,
});

export const CompanyVote =mongoose.model("CompanyVote", companyVote);