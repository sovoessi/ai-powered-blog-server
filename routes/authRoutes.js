import express from "express";
import { register, login, logout } from "../controllers/authController.js";

const router = express.Router();

// Register route
router.post("/register", register);
// Login route
router.post("/login", login);
// Logout route
router.post("/logout", logout);

// Export the router
export default router;
