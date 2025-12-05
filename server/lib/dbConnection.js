import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const dbConnect = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    console.log(uri)
    await mongoose.connect(uri);
    console.log("DB connected");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
  }
};

export default dbConnect;
