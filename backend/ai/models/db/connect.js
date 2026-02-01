import mongoose from "mongoose";

export async function connectDB() {
  if (mongoose.connection.readyState === 1) return;

  await mongoose.connect(process.env.MONGO_URI, {
    dbName: "agent_results"
  });

  console.log("✅ MongoDB connected");
}
