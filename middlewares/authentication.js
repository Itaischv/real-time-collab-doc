// Middleware verifies the user's token(JWT) and attaches the user object to the request object.

import jwt from 'jsonwebtoken';


const authenticateUser = (req, res, next) => {
    const token = req.headers["authorization"];
    if (!token) {
        return res.status(401).json({ error: "Token is required"})
    }

    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET_KEY);
        next();
    }
    catch (error) {
        return res.status(400).json({ error: "Invalid token"})
    }
}

export default authenticateUser;