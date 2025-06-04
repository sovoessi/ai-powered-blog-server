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
app.use(express.static("./public")); // Serve static files from the uploads directory

app.get("/", (req, res) => {
    res.send("Welcome to the Blog API");
});

app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/posts', postRoutes);


const startServer = async () => {
	try {
		await connectDB();
		app.listen(PORT, () => {
			console.log(`🚀 Server is running on port ${PORT}`);
		});
	} catch (error) {
		console.error("Error starting server:", error.message);
		process.exit(1); // Exit the process with failure
	}
};

startServer();
