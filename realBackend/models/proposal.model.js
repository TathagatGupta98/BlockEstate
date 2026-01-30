import mongoose, { model, SchemaTypes } from "mongoose";

const proposal=new mongoose.Schema({
    ownerId:{
        type:SchemaTypes.ObjectId,
        ref:"User",
        required:true,
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
    }


},{timestamps:true})

export const Proposal=mongoose.model("Proposal",proposal);