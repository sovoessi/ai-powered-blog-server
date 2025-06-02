import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const userSchema = mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
			minLength: 3,
			maxLength: 20,
		},
		email: {
			type: String,
			required: [true, "Please provide an email"],
			match: [
				/^([a-zA-Z0-9_.+-]+)@([a-zA-Z0-9-]+\.)+([a-zA-Z0-9]{2,4})$/,
				"Please provide a valid email",
			],
			unique: true,
		},
		password: {
			type: String,
			required: [true, "Please provide a password"],
			minLength: 6,
			select: false, // Do not return password in queries
		},
		role: {
			type: String,
			enum: ["member", "moderator", "admin"],
			default: "member",
		},
	},
	{
		timestamps: true,
	}
);

// Middleware to hash password before saving
userSchema.pre("save", async function () {
	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
	try {
		return await bcrypt.compare(candidatePassword, this.password);
	} catch (error) {
		throw new Error("Password comparison failed");
	}
};

// Create JWT token
userSchema.methods.createJWT = function () {
	try {
		return jwt.sign(
			{ userId: this._id, username: this.username },
			process.env.JWT_SECRET,
			{
				expiresIn: process.env.JWT_EXPIRATION || "30d",
			}
		);
	} catch (error) {
		throw new Error("Token creation failed");
	}
};

const User = mongoose.model("User", userSchema);

export default User;