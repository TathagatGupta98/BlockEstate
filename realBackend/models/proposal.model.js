import mongoose, { model, SchemaTypes } from "mongoose";

const proposal=new mongoose.Schema({
    ownerId:{
        type:SchemaTypes.ObjectId,
        ref:"User",
    },
    videoFile:{
        type:String,
    },
    imageFile:{
        type:String,
    },
    title:{
        type:String,
        required:true,

    },
    description:{
        type:String,
        required:true,
    },
    contractId:{
        type:String,
        
    },
    status:{
        type:Boolean,

    },
    acceptCount:{
        type:Number,
        default:0
        
    },
    rejectCount:{
        type:Number,
        default:0
    },
    onChainProposalId: { type: String },
    txHash: { type: String }, // optional



},{timestamps:true})

export const Proposal=mongoose.model("Proposal",proposal);