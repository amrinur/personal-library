import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.connect(process.env.MONGO);
    console.log(`MongoDB connected: ${mongoose.connection.host}`); 
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}

export default connectDB;