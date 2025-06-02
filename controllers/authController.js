import User from "../models/User.js";

export const register = async (req, res) => {
	try {
		const { username, email, password } = req.body;

		if (!username || !email || !password) {
			return res
				.status(400)
				.json({ message: "Please provide all required fields" });
		}

		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(400).json({ message: "User already exists" });
		}

		const user = new User({ username, email, password });
		await user.save();

		const token = user.createJWT();
		// Set the token as a cookie
		res.cookie("token", token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "none", // Required for cross-site cookies
			maxAge: 24 * 60 * 60 * 1000, // 1 day
		});
		res
			.status(201)
			.json({ user: { username: user.username, email: user.email }, token });
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const login = async (req, res) => {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			return res
				.status(400)
				.json({ message: "Please provide all required fields" });
		}

		const user = await User.findOne({ email });
		if (!user) {
			return res.status(401).json({ message: "Invalid credentials" });
		}

		const isPasswordValid = await user.comparePassword(password);
		if (!isPasswordValid) {
			return res.status(401).json({ message: "Invalid credentials" });
		}

		const token = user.createJWT();

		// Set the token as a cookie
		res.cookie("token", token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			signed: true, // Sign the cookie for security
			sameSite: "none", // Required for cross-site cookies
			maxAge: 24 * 60 * 60 * 1000, // 1 day
		});
		res.status(200).json({
			user: {
				username: user.username,
				email: user.email,
				role: user.role,
			},
			token,
		});
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const logout = (req, res) => {
	try {
		// Clear the cookie
		res.clearCookie("token");
		res.status(200).json({ message: "Logged out successfully" });
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message });
	}
};
