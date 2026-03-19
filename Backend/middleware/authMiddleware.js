import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }

        // Debug check
        if (!process.env.ACCESS_TOKEN_SECRET) {
            console.error('ACCESS_TOKEN_SECRET is missing in middleware!');
            return res.status(500).json({ message: "Server configuration error: missing secret key" });
        }

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.userId = decoded.userId;
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Auth middleware error:', error.message);
        return res.status(403).json({ message: "Invalid or expired token" });
    }
};

export default authMiddleware;
