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
  password:{
    type:String,
    required:true,
  }
}, { timestamps: true });

company.pre("save",async function() {
  if(!this.isModified("password")) return;
  this.password=await brcypt.hash(this.password,10)
  
});

company.methods.generateAccessToken=function(){
  return JsonWebTokenError.sign(
    {
      _id:this._id,
      name:this.name,
      verified:this.verified
    },
    process.env.JWT_ACCESSES_TOKEN || "fallback-refresh-key-change-this",
    {expiresIn:process.env.JWT_REFRESH_EXP || "7d"}

  );
}

export const Company =mongoose.model("Company", company);