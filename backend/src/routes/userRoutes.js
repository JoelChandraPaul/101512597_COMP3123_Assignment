import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// SIGNUP
router.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const user = new User({ username, email, password }); 
    await user.save(); 
    return res.status(201).json({ message: 'User registered' });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }
    console.error('Signup error:', err);
    return res.status(500).json({ message: 'Signup failed' });
  }
});


// LOGIN (username OR email accepted)
router.post('/login', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if ((!username && !email) || !password) {
      return res
        .status(400)
        .json({ message: 'Username/email & password required' });
    }

    const user = await User.findOne(
      username ? { username } : { email }
    );
    if (!user) return res.status(400).json({ message: 'User not found' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ message: 'Wrong password' });

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    return res.status(200).json({ message: 'Login success', token });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Login failed' });
  }
});

export default router;
