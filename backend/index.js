

// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const authenticateToken = require('./middleware/authenticateToken');
// const axios = require('axios');

// const app = express();
// const PORT = process.env.PORT || 5000;
// const MONGODB_URI = process.env.MONGODB_URI;
// const JWT_SECRET = process.env.JWT_SECRET;

// if (!MONGODB_URI || !JWT_SECRET) {
//   console.error('❌ Missing environment variables');
//   process.exit(1);
// }

// // Allowed origins
// const allowedOrigins = [
//   process.env.FRONTEND_LOCAL,
//   process.env.FRONTEND_GITHUB
// ].filter(Boolean);

// // CORS setup
// app.use(cors({
//   origin: (origin, callback) => {
//     // direct request (Postman or server-to-server)
//     if (!origin) return callback(null, true);

//     // check if origin is allowed
//     const allowed = allowedOrigins.some(url => origin === url || origin.endsWith(".github.dev"));
//     if (allowed) return callback(null, true);

//     console.warn("Blocked by CORS:", origin);
//     return callback(new Error("Not allowed by CORS: " + origin));
//   },
//   credentials: true,
// }));

// // handle preflight globally
// app.options("*", cors());

// app.use(express.json());

// // Connect MongoDB
// mongoose.connect(MONGODB_URI)
//   .then(() => console.log('✅ Connected to MongoDB'))
//   .catch(err => {
//     console.error(err);
//     process.exit(1);
//   });

// // User schema
// const userSchema = new mongoose.Schema({
//   email: { type: String, required: true, unique: true, lowercase: true, trim: true },
//   password: { type: String, required: true, minlength: 6 },
//   name: { type: String, default: null },
//   age: { type: Number, default: null },
//   gender: { type: String, default: null },
//   dob: { type: Date, default: null },
//   personality: { type: String, default: null },
// }, { timestamps: true });

// userSchema.pre('save', async function(next) {
//   if (!this.isModified('password')) return next();
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

// userSchema.methods.comparePassword = async function(candidatePassword) {
//   return bcrypt.compare(candidatePassword, this.password);
// };

// const User = mongoose.model('User', userSchema);

// // Routes

// app.get('/', (req, res) => {
//   res.send('<h1>Backend Running</h1><p>Use /api endpoints.</p>');
// });

// // Register
// app.post('/api/auth/register', async (req, res) => {
//   try {
//     const { name, email, password, dob, gender } = req.body;
//     if (await User.findOne({ email })) return res.status(400).json({ error: 'User already exists' });

//     const birthDate = new Date(dob);
//     const today = new Date();
//     let age = today.getFullYear() - birthDate.getFullYear();
//     const m = today.getMonth() - birthDate.getMonth();
//     if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;

//     const user = new User({ name, email, password, dob: birthDate, age, gender });
//     await user.save();

//     const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '24h' });

//     res.status(201).json({
//       message: 'User created',
//       token,
//       user: { id: user._id, name, email, dob: birthDate, age, gender }
//     });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Login
// app.post('/api/auth/login', async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email });
//     if (!user || !(await user.comparePassword(password))) return res.status(401).json({ error: 'Invalid credentials' });

//     const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '24h' });
//     res.json({
//       message: 'Login successful',
//       token,
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         dob: user.dob,
//         age: user.age,
//         gender: user.gender,
//         personality: user.personality
//       }
//     });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Profile routes
// app.get('/api/auth/profile', authenticateToken, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.userId).select('-password');
//     if (!user) return res.status(404).json({ error: 'User not found' });
//     res.json(user);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// app.post('/api/auth/profile', authenticateToken, async (req, res) => {
//   try {
//     const { name, dob, gender, personality } = req.body;
//     const birthDate = new Date(dob);
//     const today = new Date();
//     let age = today.getFullYear() - birthDate.getFullYear();
//     const m = today.getMonth() - birthDate.getMonth();
//     if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;

//     const user = await User.findByIdAndUpdate(
//       req.user.userId,
//       { name, dob: birthDate, age, gender, personality },
//       { new: true, runValidators: true }
//     ).select('-password');

//     res.json({ message: 'Profile updated', user });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Recommendations
// app.get('/api/auth/recommendations', authenticateToken, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.userId).select('personality');
//     if (!user?.personality) return res.status(400).json({ error: 'Set personality first' });

//     const personalityMap = {
//       Friendly: 'fiction',
//       Adventurous: 'travel',
//       Curious: 'science',
//       Romantic: 'romance',
//       Creative: 'art',
//       Thoughtful: 'philosophy'
//     };
//     const subject = personalityMap[user.personality] || 'general';

//     const booksResp = await axios.get(`https://openlibrary.org/search.json?q=subject:${subject}`);
//     const books = booksResp.data.docs.slice(0, 10).map(book => ({
//       title: book.title,
//       author: book.author_name?.join(', ') || 'Unknown',
//       first_publish_year: book.first_publish_year || 'N/A',
//       subject
//     }));

//     res.json({ personality: user.personality, books });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: err.message });
//   }
// });

// // Start server
// app.listen(PORT, '0.0.0.0', () => {
//   console.log(`🚀 Server running on port ${PORT}`);
// });


require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authenticateToken = require('./middleware/authenticateToken');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_LOCAL || "http://localhost:3000";
const MONGODB_URI = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET;

if (!MONGODB_URI || !JWT_SECRET) {
  console.error('❌ Missing environment variables');
  process.exit(1);
}

app.use(cors({ origin: FRONTEND_URL, credentials: true }));
app.use(express.json());


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
  type: { type: String, required: true }, // book, music, movie
}, { timestamps: true });

const Favorite = mongoose.model('Favorite', favoriteSchema);

// ===== Routes =====
app.get('/', (req, res) => {
  res.send('<h1>Backend Running</h1><p>Use /api/auth endpoints.</p>');
});

// ===== Register =====
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, dob, gender } = req.body;
    if (await User.findOne({ email })) return res.status(400).json({ error: 'User already exists' });

    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;

    const user = new User({ name, email, password, dob: birthDate, age, gender });
    await user.save();

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '24h' });

    res.status(201).json({
      message: 'User created',
      token,
      user: { id: user._id, name, email, dob: birthDate, age, gender }
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

// ===== Update Profile =====
app.post('/api/auth/profile', authenticateToken, async (req, res) => {
  try {
    const { name, dob, gender, personality } = req.body;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;

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

// ===== Recommendations =====
app.get('/api/auth/recommendations', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('personality');
    if (!user?.personality) return res.status(400).json({ error: 'Set personality first' });

    const personalityMap = {
      Friendly: 'fiction',
      Adventurous: 'travel',
      Curious: 'science',
      Romantic: 'romance',
      Creative: 'art',
      Thoughtful: 'philosophy'
    };
    const subject = personalityMap[user.personality] || 'general';

    // ==== Books ====
    const booksResp = await axios.get(`https://openlibrary.org/search.json?q=subject:${subject}`);
    const books = booksResp.data.docs.slice(0, 10).map(book => ({
      title: book.title,
      author: book.author_name?.join(', ') || 'Unknown',
      first_publish_year: book.first_publish_year || 'N/A',
      subject
    }));

    // ==== Music (mocked) ====
    const musicMap = {
      Friendly: ['Pop', 'Indie'],
      Adventurous: ['Rock', 'Electronic'],
      Curious: ['Jazz', 'Classical'],
      Romantic: ['R&B', 'Soul'],
      Creative: ['Alternative', 'Experimental'],
      Thoughtful: ['Ambient', 'Instrumental']
    };
    const music = (musicMap[user.personality] || ['Pop']).map((genre, idx) => ({
      title: `${genre} Hits`,
      artist: 'Various Artists',
      genre
    }));

    // ==== Movies (mocked) ====
    const movieMap = {
      Friendly: ['Comedy'],
      Adventurous: ['Action', 'Adventure'],
      Curious: ['Documentary', 'Biography'],
      Romantic: ['Romance', 'Drama'],
      Creative: ['Fantasy', 'Animation'],
      Thoughtful: ['Mystery', 'Thriller']
    };
    const movies = (movieMap[user.personality] || ['Drama']).map((genre, idx) => ({
      title: `${genre} Movie ${idx + 1}`,
      director: 'Various Directors',
      genre
    }));

    res.json({ personality: user.personality, books, music, movies });

  } catch (err) {
    console.error(err);
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

// ===== Start Server =====
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
