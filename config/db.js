import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

// Connect to MongoDB using Mongoose
const connectDB = async () => {
	try {
		await mongoose.connect(process.env.MONGO_DB);
		console.log("✅MongoDB connected successfully");
	} catch (error) {
		console.error("❌MongoDB connection error:", error.message);
		process.exit(1); // Exit the process with failure
	}
};

export default connectDB;
