require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authenticateToken = require('./middleware/authenticateToken');
const axios = require('axios');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_LOCAL || "http://localhost:3000";
const MONGODB_URI = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET;

// ===== Check Environment Variables =====
if (!MONGODB_URI || !JWT_SECRET) {
  console.error('❌ Missing environment variables');
  process.exit(1);
}

// ===== Middleware =====
app.use(cors({ origin: FRONTEND_URL, credentials: true }));
app.use(express.json());

// ===== MongoDB Connection =====
mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });

// ===== Models =====
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  name: { type: String, default: null },
  age: { type: Number, default: null },
  gender: { type: String, default: null },
  dob: { type: Date, default: null },
  personality: { type: String, default: null },
  resetPasswordToken: { type: String, default: null },
  resetPasswordExpires: { type: Date, default: null }
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

const favoriteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  content: { type: String },
  type: { type: String, required: true } // book, music, movie
}, { timestamps: true });

const Favorite = mongoose.model('Favorite', favoriteSchema);

// ===== Mood Schema =====
const moodSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  emoji: { type: String, required: true },
  note: { type: String, default: '' },
  timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

const Mood = mongoose.model('Mood', moodSchema);

// ===== Routes =====
app.get('/', (req, res) => {
  res.send('<h1>Backend Running</h1><p>Use /api/auth endpoints.</p>');
});

// ===== Register =====
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, dob, gender, personality } = req.body;
    if (await User.findOne({ email })) return res.status(400).json({ error: 'User already exists' });

    const birthDate = dob ? new Date(dob) : null;
    let age = null;
    if (birthDate) {
      const today = new Date();
      age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    }

    const user = new User({ name, email, password, dob: birthDate, age, gender, personality });
    await user.save();

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '24h' });

    res.status(201).json({
      message: 'User created',
      token,
      user: { id: user._id, name, email, dob: birthDate, age, gender, personality }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===== Login =====
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '24h' });
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        dob: user.dob,
        age: user.age,
        gender: user.gender,
        personality: user.personality
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===== Forgot Password =====
app.post('/api/auth/forgot', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(200).json({ message: 'If that email exists, a reset link has been sent' });

    const token = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();

    res.json({ message: 'Password reset token generated', token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===== Reset Password =====
app.post('/api/auth/reset-password/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) return res.status(400).json({ error: 'Invalid or expired token' });

    user.password = password;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.json({ message: 'Password successfully reset' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===== Change Password =====
app.post('/api/auth/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) return res.status(400).json({ error: 'Both current and new passwords are required' });

    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) return res.status(400).json({ error: 'Current password is incorrect' });

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password updated successfully!' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ===== Get Profile =====
app.get('/api/auth/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===== Update Personality Only =====
app.put('/api/auth/personality', authenticateToken, async (req, res) => {
  try {
    const { personality } = req.body;
    if (!personality) return res.status(400).json({ error: "Personality is required" });

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { personality },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ message: "✅ Personality updated successfully", personality: user.personality });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// ===== Update Profile =====
app.post('/api/auth/profile', authenticateToken, async (req, res) => {
  try {
    const { name, dob, gender, personality } = req.body;
    const birthDate = dob ? new Date(dob) : null;
    let age = null;
    if (birthDate) {
      const today = new Date();
      age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    }

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { name, dob: birthDate, age, gender, personality },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({ message: 'Profile updated', user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===== Favorites =====
app.get('/api/auth/favorites', authenticateToken, async (req, res) => {
  try {
    const favorites = await Favorite.find({ userId: req.user.userId });
    res.json(favorites);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/favorites', authenticateToken, async (req, res) => {
  try {
    const { title, content, type } = req.body;
    const existing = await Favorite.findOne({ userId: req.user.userId, title });
    if (existing) return res.status(400).json({ error: 'Already favorited' });

    const favorite = new Favorite({ userId: req.user.userId, title, content, type });
    await favorite.save();
    res.status(201).json({ message: 'Favorite saved', favorite });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/auth/favorites/:id', authenticateToken, async (req, res) => {
  try {
    const fav = await Favorite.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
    if (!fav) return res.status(404).json({ error: 'Favorite not found' });
    res.json({ message: 'Favorite removed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===== Mood Routes =====
app.get('/api/auth/mood', authenticateToken, async (req, res) => {
  try {
    const moods = await Mood.find({ userId: req.user.userId }).sort({ timestamp: -1 });
    res.json(moods);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/mood', authenticateToken, async (req, res) => {
  try {
    const { emoji, note } = req.body;
    if (!emoji) return res.status(400).json({ error: 'Mood or journal content is required' });

    const mood = new Mood({
      userId: req.user.userId,
      emoji,
      note: note || ''
    });
    await mood.save();

    res.status(201).json(mood);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===== Start Server =====
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
