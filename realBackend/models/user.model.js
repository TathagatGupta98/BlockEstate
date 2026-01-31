import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required:true,
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        required:true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required:true, 
    },
    walletAddress: {
        type: String,
        required: true,
        trim: true,
    },
    HouseNo: {
        type: Number,
        required:true,
    },
    refreshToken: {
        type: String,
    }
}, {
    timestamps: true
});


userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 10);
    
});


userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};


userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        { 
            _id: this._id, 
            username: this.username,
            email: this.email 
        },
        process.env.JWT_ACCESSES_TOKEN || "fallback-secret-key-change-this",
        { expiresIn: process.env.JWT_ACCESSES_EXP || "1d" }
    );
};


userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        { _id: this._id },
        process.env.JWT_REFRESH_TOKEN || "fallback-refresh-key-change-this",
        { expiresIn: process.env.JWT_REFRESH_EXP || "7d" }
    );
};

export const User = mongoose.model('User', userSchema);