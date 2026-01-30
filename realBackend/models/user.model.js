import mongoose, { Types } from "mongoose";
import bcrypt from "bcrypt"

const user=new mongoose.Schema({
    username:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    walletAddress:{
        type:String,
        required:true,
    }




},{
    timestamps:true
})

user.pre("save",async function (next) {
    if(!this.isModified("password")) return next();
    this.password=await bcrypt.hash(this.password,10)
    next()
    
})
user.methods.isPasswordCorrect=async function (password) {
    return await bcrypt.compare(password,this.password)
}
user.methods.generateAccessToken = function () {
  return jwt.sign(
    { _id: this._id, username: this.username },
    process.env.JWT_ACCESSES_TOKEN,
    { expiresIn: process.env.JWT_ACCESSES_EXP }
  );
};
user.methods.generateRefreshToken = function () {
  return jwt.sign(
    { _id: this._id },
    process.env.JWT_REFRESH_TOKEN,
    { expiresIn: process.env.JWT_REFRESH_EXP }
  );
};



export const User=mongoose.model('User',user);