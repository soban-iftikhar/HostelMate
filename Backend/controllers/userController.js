import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// Generates access and refresh JWT tokens for authenticated users
const generateTokens = (userId) => {
    const accessToken = jwt.sign(
        { userId },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
        { userId },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }
    );

    return { accessToken, refreshToken };
};

// Registers a new user with email, password, name and room number.
// Returns user data and JWT tokens on success.
const registerUser = async (req, res) => {
    try {
        const { email } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const userData = new User(req.body);
        const savedUser = await userData.save();

        const { accessToken, refreshToken } = generateTokens(savedUser._id);

        const userResponse = savedUser.toObject();
        delete userResponse.password;

        res.status(201).json({ 
            user: userResponse,
            accessToken,
            refreshToken
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Authenticates user with email and password credentials.
// Verifies credentials and returns user data with JWT tokens.
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user || user.password !== password) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const { accessToken, refreshToken } = generateTokens(user._id);

        const userResponse = user.toObject();
        delete userResponse.password;
        
        res.status(200).json({ 
            user: userResponse,
            accessToken,
            refreshToken
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Retrieves the profile information of the authenticated user.
// Used to fetch user details for display in navbar and other components.
const getUserProfile = async (req, res) => {
    try {
        const userId = req.userId;

        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const userResponse = user.toObject();
        delete userResponse.password;

        res.status(200).json(userResponse);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Fetches top 10 users ranked by karma points for the leaderboard.
// Returns user rankings with names, room numbers and karma points.
const getLeaderboard = async (req, res) => {
    try {
        const topUsers = await User.find().sort({ karmaPoints: -1 }).limit(10);

        const leaderboard = topUsers.map(user => {
            const userObj = user.toObject();
            delete userObj.password;
            delete userObj.email;
            return userObj;
        });

        res.status(200).json(leaderboard);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Handles refresh token requests to generate new access tokens.
// Validates refresh token and returns new access and refresh tokens.
const refreshTokenHandler = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({ message: "Refresh token is required" });
        }

        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const { accessToken, refreshToken: newRefreshToken } = generateTokens(decoded.userId);

        res.status(200).json({ 
            accessToken,
            refreshToken: newRefreshToken
        });
    } catch (error) {
        res.status(403).json({ message: "Invalid refresh token" });
    }
};

export { registerUser, loginUser, getUserProfile, getLeaderboard, refreshTokenHandler };