import mongoose from "mongoose";

const company=new mongoose.Schema({
    name:{
        type:String,
        required:true,

    },
    walletAddress:{
        type:String,
    },
    verified:{
        type:String,
    },

},{timestamps:true})

export const Company=model("Company",company);