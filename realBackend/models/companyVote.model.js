import mongoose, { model, SchemaType } from "mongoose";

const companyVote=new mongoose.Schema({
    userId:{
        type:SchemaType.ObjectId,
        ref:"User",
        required:true,
    },
    bidId:{
        type:SchemaType.ObjectId,
        ref:"Bid",
        required:true,
    }

},{
    timestamps:true,
})
export const CompanyVote=model("companyVote",companyVote);