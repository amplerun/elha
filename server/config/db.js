import mongoose from 'mongoose';
import dotenv from 'dotenv'; // <-- ADD THIS LINE

dotenv.config(); // <-- ADD THIS LINE

const connectDB = async () => {
  try {
    // The MONGO_URI will now be correctly loaded from the .env file
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;