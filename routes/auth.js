// Handling user login and register

import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jwt';
import User from '../models/User';

const router = express.Router();
router.post('/register', async (req,res) => {
    const { name, password, email } = req.body;
    try {
        const encryptedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, encryptedPassword });
        await newUser.save();
    } catch (error) {
        console.error(error);
    }
});

router.post('/login', async (req,res) => {
    const { email, password } = req.body;
    try {
        // Find the user
        const user = await User.findOne({ email: email});
        // Check if the user exists
        if(!user) return res.status(404).json({ error: `User ${email} not found`});
        if (await bcrypt.compare(password, user.password)) {
            const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
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