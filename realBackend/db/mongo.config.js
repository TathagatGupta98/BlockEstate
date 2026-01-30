import mongoose from "mongoose";
import "dotenv/config";

 


const mongoDb = async () => {
  try {
    console.log(process.env.MONGODB_URL)
    const conn = await mongoose.connect(
      process.env.MONGODB_URL
    );

    console.log("MongoDB connected:", conn.connection.host);
  } catch (error) {
    console.error("MongoDB not connected:", error.message);
    process.exit(1);
  }
};

export default mongoDb;