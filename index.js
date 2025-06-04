import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";

import connectDB from "./config/db.js";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;


app.use(cookieParser());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Remove express.static for serverless
// app.use(express.static("public"));

app.get("/", (req, res) => {
    res.send("Welcome to the Blog API");
});

app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/posts', postRoutes);

// Connect to DB once (outside handler)
let isConnected = false;
async function ensureDB() {
    if (!isConnected) {
        await connectDB();
        isConnected = true;
    }
}
// Middleware to ensure DB connection before handling requests
app.use(async (req, res, next) => {
	try {
		await ensureDB();
		next();
	} catch (error) {
		console.error("Database connection error:", error);
		res.status(500).json({ message: "Internal Server Error" });
	}
});

// Export handler for Vercel
export default async function handler(req, res) {
    await ensureDB();
    app(req, res);
}