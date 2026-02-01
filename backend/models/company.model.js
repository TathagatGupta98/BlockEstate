import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const companySchema = new mongoose.Schema({
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
  password:{
    type:String,
    required:true,
  }
}, { timestamps: true });


companySchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});


companySchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      name: this.name,
      verified: this.verified
    },
    process.env.JWT_ACCESS_TOKEN || "fallback-secret-key",
    { expiresIn: "7d" }
  );
};


export const Company = mongoose.model("Company", companySchema);
