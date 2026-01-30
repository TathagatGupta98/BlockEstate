import mongoose, { SchemaTypes } from "mongoose";

const vote=new mongoose.Schema({
    userId:{
        type:SchemaTypes.ObjectId,
        ref:"User",
        require:true,
    },
    proposalId:{
        type:SchemaTypes.ObjectId,
        ref:"Proposal",
    },
    value:{
        type:Boolean,
    },

},{timestamps:true})

const Vote=model("Vote",vote);