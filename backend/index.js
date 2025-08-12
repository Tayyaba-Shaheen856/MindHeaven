require('dotenv').config();
console.log('MONGODB_URI:', process.env.MONGODB_URI);
console.log('JWT_SECRET:', process.env.JWT_SECRET);
console.log('PORT:', process.env.PORT);

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority';
console.log("Connecting to MongoDB with URI:", MONGODB_URI);

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ Connected to MongoDB Atlas');
  console.log('📂 Database Name:', mongoose.connection.name);
  console.log('🌐 Cluster Host:', mongoose.connection.host);
})
.catch(err => console.error('❌ MongoDB connection error:', err));

// =======================
// Schemas
// =======================

// User Schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  age: {
    type: Number,
    default: null
  },
  gender: {
    type: String,
    default: null
  },
  personality: {
    type: String,
    default: null
  }
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

// Mood Schema
const moodSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  emoji: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const Mood = mongoose.model('Mood', moodSchema);

// =======================
// Routes
// =======================

app.get('/', (req, res) => {
  res.json({ message: 'Express server with MongoDB is running!' });
});

// Register route
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    // Create new user
    const user = new User({ email, password });
    await user.save();
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.status(201).json({
      message: 'User created successfully',
      token,
      user: { id: user._id, email: user.email }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login route
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({
      message: 'Login successful',
      token,
      user: { id: user._id, email: user.email }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// JWT middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }
  
  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
}

// Profile update route
app.post('/api/profile', authenticateToken, async (req, res) => {
  try {
    const { age, gender, personality } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { age, gender, personality },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mood tracking route
app.post('/api/mood', authenticateToken, async (req, res) => {
  try {
    const { emoji } = req.body;
    if (!emoji) {
      return res.status(400).json({ error: 'Emoji is required' });
    }

    const mood = new Mood({
      userId: req.user.userId,
      emoji
    });

    await mood.save();
    res.status(201).json({
      message: 'Mood saved successfully',
      mood
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all moods for the logged-in user
app.get('/api/mood', authenticateToken, async (req, res) => {
  try {
    const moods = await Mood.find({ userId: req.user.userId }).sort({ timestamp: -1 });
    res.json(moods);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const axios = require('axios');

// Book recommendations route
app.get('/api/recommendations', authenticateToken, async (req, res) => {
  try {
    // Step 1: Find the logged-in user
    const user = await User.findById(req.user.userId);
    if (!user || !user.personality) {
      return res.status(400).json({ error: 'Personality not set in profile' });
    }

    // Step 2: Map personality to subject
    const personalityToSubject = {
      "Friendly": "fiction",
      "Adventurous": "travel",
      "Curious": "science",
      "Romantic": "romance",
      "Thoughtful": "philosophy"
    };
    const subject = personalityToSubject[user.personality] || "fiction";

    // Step 3: Fetch books from Open Library
    const response = await axios.get(`https://openlibrary.org/search.json?q=subject:${subject}`);
    const books = response.data.docs.slice(0, 10).map(book => ({
      title: book.title,
      author: book.author_name ? book.author_name.join(", ") : "Unknown Author",
      first_publish_year: book.first_publish_year || "N/A"
    }));

    // Step 4: Send recommendations
    res.json({
      personality: user.personality,
      subject,
      recommendations: books
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/recommendations - fetch books based on logged-in user's profile
app.get('/api/recommendations', authenticateToken, async (req, res) => {
  try {
    // Find the logged-in user
    const user = await User.findById(req.user.userId).select('personality');
    if (!user || !user.personality) {
      return res.status(400).json({ error: 'User profile incomplete. Please set your personality first.' });
    }

    // Map personality to book subject
    const personalityToSubject = {
      Friendly: 'fiction',
      Adventurous: 'travel',
      Curious: 'science',
      Romantic: 'romance',
      Creative: 'art',
      Thoughtful: 'philosophy'
    };

    const subject = personalityToSubject[user.personality] || 'general';

    // Fetch from Open Library
    const axios = require('axios');
    const response = await axios.get(`https://openlibrary.org/search.json?q=subject:${subject}`);

    // Return top 10 recommendations
    const books = response.data.docs.slice(0, 10).map(book => ({
      title: book.title,
      author: book.author_name ? book.author_name.join(', ') : 'Unknown',
      first_publish_year: book.first_publish_year || 'N/A'
    }));

    res.json({
      personality: user.personality,
      subject,
      recommendations: books
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});