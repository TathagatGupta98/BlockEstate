import mongoose, { model, SchemaTypes, Types } from "mongoose";

const bid=new mongoose.Schema({
    proposalId:{
        type:SchemaTypes.ObjectId,
        ref:"Proposal",
    },
    companyId:{
        type:SchemaTypes.ObjectId,
        ref:"Company"
    },
    estimatedId:{
        type:String,

    },
    description:{
        type:String,
        required:true,
    }
},{timestamps:true})

export const Bid=mongoose.model("Bid",bid);

