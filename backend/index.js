<<<<<<< HEAD
=======
// Load environment variables
>>>>>>> 5d18cdf (Save local changes before syncing with remote)
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const authenticateToken = require('./middleware/authenticateToken');

const app = express();
const PORT = process.env.PORT || 5000;

// =======================
// Middleware
// =======================
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(express.json());

// =======================
<<<<<<< HEAD
// MongoDB Connection
// =======================
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
=======
// Database Connection
// =======================
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('❌ Missing MONGODB_URI in .env file');
  process.exit(1);
}

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ Connected to MongoDB Atlas');
  console.log('📂 Database Name:', mongoose.connection.name);
>>>>>>> 5d18cdf (Save local changes before syncing with remote)
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// =======================
// Schemas & Models
// =======================
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  age: { type: Number, default: null },
  gender: { type: String, default: null },
  personality: { type: String, default: null }
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

<<<<<<< HEAD
userSchema.methods.comparePassword = function(candidatePassword) {
=======
userSchema.methods.comparePassword = async function(candidatePassword) {
>>>>>>> 5d18cdf (Save local changes before syncing with remote)
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

const moodSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  emoji: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const Mood = mongoose.model('Mood', moodSchema);

// =======================
// Routes
// =======================
<<<<<<< HEAD

// Test root
=======
>>>>>>> 5d18cdf (Save local changes before syncing with remote)
app.get('/', (req, res) => {
  res.json({ message: 'API is running' });
});

// Register
app.post('/api/register', async (req, res) => {
  try {
<<<<<<< HEAD
    const { email, password, age, gender, dateOfBirth } = req.body;

    // Check if user already exists
=======
    const { email, password } = req.body;

>>>>>>> 5d18cdf (Save local changes before syncing with remote)
    if (await User.findOne({ email })) {
      return res.status(400).json({ error: 'User already exists' });
    }

<<<<<<< HEAD
    // Create new user with additional fields
    const user = new User({
      email,
      password,
      age: age || null,
      gender: gender || null,
      dateOfBirth: dateOfBirth || null
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User created',
      token,
      user: {
        id: user._id,
        email: user.email,
        age: user.age,
        gender: user.gender,
        dateOfBirth: user.dateOfBirth
      }
    });
=======
    const user = new User({ email, password });
    await user.save();

    const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '24h' });

    res.status(201).json({ message: 'User created successfully', token, user: { id: user._id, email: user.email } });
>>>>>>> 5d18cdf (Save local changes before syncing with remote)
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
<<<<<<< HEAD

    if (!user) {
    
      return res.status(404).json({ error: 'User not found' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Incorrect email or password' });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ message: 'Login successful', token, user: { id: user._id, email: user.email } });
=======

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.json({ message: 'Login successful', token, user: { id: user._id, email: user.email } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Profile
app.post('/api/profile', authenticateToken, async (req, res) => {
  try {
    const { age, gender, personality } = req.body;

    const user = await User.findByIdAndUpdate(req.user.userId, { age, gender, personality }, { new: true, runValidators: true })
                           .select('-password');

    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({ message: 'Profile updated successfully', user });
>>>>>>> 5d18cdf (Save local changes before syncing with remote)
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
//forgot password
app.post("/api/auth/forgot", async (req, res) => {
  try {
    const { email } = req.body;

<<<<<<< HEAD
    if (!email) return res.status(400).json({ error: "Email is required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });
    const resetToken = Math.random().toString(36).substring(2, 15);
    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 3600000; // 1 hour
    await user.save();

    console.log(`Reset link: http://localhost:3000/resetpage?token=${resetToken}`);

    res.json({ message: "Reset link has been sent to your email" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});
// reset password

app.post("/api/auth/reset", async (req, res) => {
  try {
    const { password, token } = req.body;

    if (!password || !token) {
      return res.status(400).json({ error: "Password and token are required" });
    }

    // Find user by reset token and check expiry
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() }, // Token expired nahi hua
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    user.password = password; // bcrypt pre-save hook automatically hash karega agar model me set hai
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.json({ message: "Password has been reset successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});
//personality
app.post('/api/auth/personality', authenticateToken, async (req, res) => {
  try {
    const { personality } = req.body;
    if (!personality) return res.status(400).json({ error: 'Personality is required' });

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { personality },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({ message: 'Profile updated', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Save mood
=======
// Mood Tracking
>>>>>>> 5d18cdf (Save local changes before syncing with remote)
app.post('/api/mood', authenticateToken, async (req, res) => {
  try {
    const { emoji } = req.body;
    if (!emoji) return res.status(400).json({ error: 'Emoji is required' });

    const mood = new Mood({ userId: req.user.userId, emoji });
    await mood.save();
<<<<<<< HEAD
    res.status(201).json({ message: 'Mood saved', mood });
=======

    res.status(201).json({ message: 'Mood saved successfully', mood });
>>>>>>> 5d18cdf (Save local changes before syncing with remote)
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

<<<<<<< HEAD
// Get moods
=======
>>>>>>> 5d18cdf (Save local changes before syncing with remote)
app.get('/api/mood', authenticateToken, async (req, res) => {
  try {
    const moods = await Mood.find({ userId: req.user.userId }).sort({ timestamp: -1 });
    res.json(moods);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

<<<<<<< HEAD
// Recommendations
app.get('/api/auth/recommendations', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user || !user.personality) {
      return res.status(400).json({ error: 'Please set your personality first' });
=======
// Book Recommendations
app.get('/api/recommendations', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('personality');
    if (!user || !user.personality) {
      return res.status(400).json({ error: 'Please set your personality first.' });
>>>>>>> 5d18cdf (Save local changes before syncing with remote)
    }

    const personalityToSubject = {
      Friendly: 'fiction',
      Adventurous: 'travel',
      Curious: 'science',
      Romantic: 'romance',
      Creative: 'art',
      Thoughtful: 'philosophy'
    };

    const subject = personalityToSubject[user.personality] || 'general';
    const response = await axios.get(`https://openlibrary.org/search.json?q=subject:${subject}`);

    const books = response.data.docs.slice(0, 10).map(book => ({
      title: book.title,
      author: book.author_name ? book.author_name.join(', ') : 'Unknown',
      first_publish_year: book.first_publish_year || 'N/A'
    }));

    res.json({ personality: user.personality, subject, recommendations: books });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =======================
// Start Server
// =======================
<<<<<<< HEAD
app.listen(PORT, '0.0.0.0', () => console.log(`🚀 Server running on port ${PORT}`));
=======
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
>>>>>>> 5d18cdf (Save local changes before syncing with remote)
