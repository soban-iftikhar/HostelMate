import dotenv from 'dotenv';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

dotenv.config();

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

const registerUser = async (req, res) => {
    try {
        const { email } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Create and Save
        const userData = new User(req.body);
        const savedUser = await userData.save();

        // Generate tokens
        const { accessToken, refreshToken } = generateTokens(savedUser._id);

        // Convert to object and remove password for security
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

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });

        // Check if user exists AND password matches
        if (!user || user.password !== password) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Generate tokens
        const { accessToken, refreshToken } = generateTokens(user._id);

        // Success! Return user data (minus password) and tokens
        const userResponse = user.toObject();
        delete userResponse.password;
        
        res.status(200).json({ 
            user: userResponse,
            accessToken,
            refreshToken
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}


const getUserProfile = async (req, res) => {
    try {
        // Get userId from JWT middleware
        const userId = req.userId || req.params.userId;

        // Find user by ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Return user data (minus password)
        const userResponse = user.toObject();
        delete userResponse.password;

        res.status(200).json(userResponse);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getLeaderboard = async (req, res) => {
    try {
        // Fetch top users sorted by score in descending order
        const topUsers = await User.find().sort({ karmaPoints: -1 }).limit(10);

        // Remove passwords from the response
        const leaderboard = topUsers.map(user => {
            const userObj = user.toObject();
            delete userObj.password;
            delete userObj.email; // Optionally remove email for privacy
            return userObj;
        });

        res.status(200).json(leaderboard);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
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

export { registerUser, loginUser, getUserProfile, getLeaderboard, refreshTokenHandler};