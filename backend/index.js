require('dotenv').config();
const axios = require('axios');

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
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB Atlas'))
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1); // Stop if DB connection fails
});

// User Schema
// Extend schema
const userSchema = new mongoose.Schema({
  name: { type: String, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  age: Number,
  gender: String,
  personality: mongoose.Schema.Types.Mixed // stores trait scores object
}, { timestamps: true });

// Profile route




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

// JWT middleware
function authenticateToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access token required' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
}

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Express server with MongoDB is running!' });
});

app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (await User.findOne({ email })) {
      return res.status(400).json({ error: 'User already exists' });
    }
    const user = new User({ name, email, password });
    await user.save();
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    res.status(201).json({
      message: 'User created successfully',
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.json({ message: 'Login successful', token, user: { id: user._id, email: user.email, name: user.name } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.post('/api/profile', authenticateToken, async (req, res) => {
  try {
    const { age, gender, personality } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user.userId,
      { age, gender, personality },
      { new: true, select: '-password' }
    );
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get profile (protected)
app.get('/api/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/recommendations', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user || !user.personality) {
      return res.status(400).json({ error: 'User profile or personality not found' });
    }

    const traits = Object.entries(user.personality);
    traits.sort((a, b) => b[1] - a[1]);
    const topTraits = traits.slice(0, 2).map(t => t[0]);

    const traitToSubject = {
      Openness: 'philosophy',
      Conscientiousness: 'self-help',
      Extraversion: 'adventure',
      Agreeableness: 'relationships',
      Neuroticism: 'psychology'
    };

    const traitToMusic = {
      Openness: [
        { title: 'Bohemian Rhapsody', artist: 'Queen' },
        { title: 'Imagine', artist: 'John Lennon' }
      ],
      Conscientiousness: [
        { title: 'Eye of the Tiger', artist: 'Survivor' },
        { title: 'Stronger', artist: 'Kanye West' }
      ],
      Extraversion: [
        { title: 'Happy', artist: 'Pharrell Williams' },
        { title: 'Uptown Funk', artist: 'Mark Ronson ft. Bruno Mars' }
      ],
      Agreeableness: [
        { title: 'Count on Me', artist: 'Bruno Mars' },
        { title: 'What a Wonderful World', artist: 'Louis Armstrong' }
      ],
      Neuroticism: [
        { title: 'Someone Like You', artist: 'Adele' },
        { title: 'Let It Be', artist: 'The Beatles' }
      ]
    };

    let allBooks = [];
    for (const trait of topTraits) {
      const subject = traitToSubject[trait] || 'fiction';
      const response = await axios.get(
        `https://openlibrary.org/search.json?subject=${encodeURIComponent(subject)}&limit=5`
      );
      const books = response.data.docs.map(book => ({
        title: book.title,
        author_name: book.author_name || [],
        first_publish_year: book.first_publish_year,
        subject
      }));
      allBooks = allBooks.concat(books);
    }

    // Music from top 2 traits
    let music = [];
    for (const trait of topTraits) {
      music = music.concat(traitToMusic[trait] || []);
    }

    res.json({ books: allBooks, music });
  } catch (error) {
    console.error('Recommendation error:', error.message);
    res.status(500).json({ error: 'Failed to fetch recommendations' });
  }
});



app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
