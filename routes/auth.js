// Handling user login and register

import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();
router.post('/register', async (req,res) => {
    const { name, password, email } = req.body;
    try {
        await new User({ name: name, email: email, password: password }).save();
        return res.status(201).json({ message: "User created successfully", user: { name, password, email } });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: `Internal server error: ${error}` });
    }
});

router.post('/login', async (req,res) => {
    const { email, password } = req.body;
    try {
        // Find the user
        const user = await User.findOne({ email: email});
        if(!user) return res.status(404).json({ error: `User ${email} not found`});
        if (await bcrypt.compare(password, user.password)) {
            const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET_KEY, { expiresIn: '15m',
            httpOnly: true, secure: true, sameSite: true });
            res.status(200).json({ token });
        }
        else {
            res.status(401).json({ error: 'Invalid password' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: `Internal server error: ${error}` });
    }
});

export default router;