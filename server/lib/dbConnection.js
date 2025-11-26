import mongoose from "mongoose";

const dbConnect = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    await mongoose.connect(uri);
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
  }
};

export default dbConnect;
