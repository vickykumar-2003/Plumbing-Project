const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const crypto = require('crypto');

// Captcha store (in-memory)
const captchaStore = new Map();

// Helper: generate JWT
const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Generate CAPTCHA utilities
function generateCaptchaText(length = 6) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < length; i++) result += chars.charAt(Math.floor(Math.random() * chars.length));
  return result;
}

function generateCaptchaSVG(text) {
  const width = 160;
  const height = 50;
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <rect width="100%" height="100%" fill="#f8fafc" rx="6" />`;
  // Noise lines
  for (let i = 0; i < 6; i++) {
    const x1 = Math.random() * width, y1 = Math.random() * height;
    const x2 = Math.random() * width, y2 = Math.random() * height;
    const color = ['#cbd5e1', '#94a3b8', '#64748b'][Math.floor(Math.random() * 3)];
    svg += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="1.5" />`;
  }
  // Text
  for (let i = 0; i < text.length; i++) {
    const x = 15 + i * 22;
    const y = 32 + (Math.random() * 8 - 4);
    const angle = Math.random() * 30 - 15;
    svg += `<text x="${x}" y="${y}" transform="rotate(${angle} ${x} ${y})" font-size="24" font-family="monospace" font-weight="900" fill="#334155">${text[i]}</text>`;
  }
  return svg + `</svg>`;
}

setInterval(() => {
  const now = Date.now();
  for (const [id, data] of captchaStore.entries()) {
    if (now > data.expiresAt) captchaStore.delete(id);
  }
}, 60 * 1000);

// @route   GET /api/auth/captcha
// @desc    Get CAPTCHA challenge
// @access  Public
router.get('/captcha', (req, res) => {
  const text = generateCaptchaText();
  const svg = generateCaptchaSVG(text);
  const captchaId = crypto.randomBytes(16).toString('hex');

  captchaStore.set(captchaId, { text, expiresAt: Date.now() + 5 * 60 * 1000 });
  const base64Svg = Buffer.from(svg).toString('base64');

  res.json({ captchaId, image: `data:image/svg+xml;base64,${base64Svg}` });
});


// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, captchaId, captchaAnswer } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please fill all fields' });
    }

    if (!captchaId || !captchaAnswer) {
      return res.status(400).json({ message: 'CAPTCHA is required' });
    }

    const storedCaptcha = captchaStore.get(captchaId);
    if (storedCaptcha) captchaStore.delete(captchaId);

    if (!storedCaptcha || storedCaptcha.expiresAt < Date.now()) {
      return res.status(400).json({ message: 'CAPTCHA expired. Please refresh and try again.' });
    }

    if (storedCaptcha.text !== captchaAnswer.toUpperCase().trim()) {
      return res.status(400).json({ message: 'Invalid CAPTCHA' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const user = await User.create({ name, email, password, phone });

    const token = generateToken({ id: user._id, name: user.name, email: user.email, role: user.role });

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone },
    });
  } catch (error) {
    const fs = require('fs');
    fs.appendFileSync('debug_error.log', `Register error at ${new Date().toISOString()}: ${error.stack}\n`);
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/auth/login
// @desc    Login a user
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password, captchaId, captchaAnswer } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    if (!captchaId || !captchaAnswer) {
      return res.status(400).json({ message: 'CAPTCHA is required' });
    }

    const storedCaptcha = captchaStore.get(captchaId);
    if (storedCaptcha) captchaStore.delete(captchaId);

    if (!storedCaptcha || storedCaptcha.expiresAt < Date.now()) {
      return res.status(400).json({ message: 'CAPTCHA expired. Please refresh and try again.' });
    }

    if (storedCaptcha.text !== captchaAnswer.toUpperCase().trim()) {
      return res.status(400).json({ message: 'Invalid CAPTCHA' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken({ id: user._id, name: user.name, email: user.email, role: user.role });

    res.json({
      message: 'Login successful',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/auth/admin-login
// @desc    Admin login with env credentials
// @access  Public
router.post('/admin-login', async (req, res) => {
  try {
    const { email, password, captchaId, captchaAnswer } = req.body;

    if (!captchaId || !captchaAnswer) {
      return res.status(400).json({ message: 'CAPTCHA is required' });
    }

    const storedCaptcha = captchaStore.get(captchaId);
    if (storedCaptcha) captchaStore.delete(captchaId);

    if (!storedCaptcha || storedCaptcha.expiresAt < Date.now()) {
      return res.status(400).json({ message: 'CAPTCHA expired. Please refresh and try again.' });
    }

    if (storedCaptcha.text !== captchaAnswer.toUpperCase().trim()) {
      return res.status(400).json({ message: 'Invalid CAPTCHA' });
    }

    if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ message: 'Invalid admin credentials' });
    }

    const token = generateToken({ id: 'admin', name: 'Admin', email, role: 'admin' });

    res.json({
      message: 'Admin login successful',
      token,
      user: { id: 'admin', name: 'Admin', email, role: 'admin' },
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
