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
  origin: 'http://localhost:3000', // React frontend
  credentials: true
}));
app.use(express.json());

// =======================
// MongoDB Connection
// =======================
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
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
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePassword = function(candidatePassword) {
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

// Test root
app.get('/', (req, res) => {
  res.json({ message: 'API is running' });
});



// register
// app.post('/api/auth/register', async (req, res) => {
//   try {
//     const { email, password, age, gender, dateOfBirth } = req.body;

//     // Check if user already exists
//     if (await User.findOne({ email })) {
//       return res.status(400).json({ error: 'User already exists' });
//     }

//     // Create new user with additional fields
//     const user = new User({
//       email,
//       password,
//       age: age || null,
//       gender: gender || null,
//       dateOfBirth: dateOfBirth || null
//     });

//     await user.save();

//     // Generate JWT token
//     const token = jwt.sign(
//       { userId: user._id, email: user.email },
//       process.env.JWT_SECRET,
//       { expiresIn: '24h' }
//     );

//     res.status(201).json({
//       message: 'User created',
//       token,
//       user: {
//         id: user._id,
//         email: user.email,
//         age: user.age,
//         gender: user.gender,
//         dateOfBirth: user.dateOfBirth
//       }
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });


app.post('/api/auth/register', async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      age,
      gender,
      dateOfBirth,
      openness,
      conscientiousness,
      extraversion,
      agreeableness,
      neuroticism
    } = req.body;

    // Check if user already exists
    if (await User.findOne({ email })) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
      gender: gender || null,
      dateOfBirth: dateOfBirth || null,
      openness,
      conscientiousness,
      extraversion,
      agreeableness,
      neuroticism
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
      user
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


//login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

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
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
//forgot password
app.post("/api/auth/forgot", async (req, res) => {
  try {
    const { email } = req.body;

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
app.post('/api/mood', authenticateToken, async (req, res) => {
  try {
    const { emoji } = req.body;
    if (!emoji) return res.status(400).json({ error: 'Emoji is required' });

    const mood = new Mood({ userId: req.user.userId, emoji });
    await mood.save();
    res.status(201).json({ message: 'Mood saved', mood });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get moods
app.get('/api/mood', authenticateToken, async (req, res) => {
  try {
    const moods = await Mood.find({ userId: req.user.userId }).sort({ timestamp: -1 });
    res.json(moods);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Recommendations
app.get('/api/auth/recommendations', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user || !user.personality) {
      return res.status(400).json({ error: 'Please set your personality first' });
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
app.listen(PORT, '0.0.0.0', () => console.log(`🚀 Server running on port ${PORT}`));


// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const multer = require('multer');
// const path = require('path');
// const axios = require('axios');
// const authenticateToken = require('./middleware/authenticateToken');

// const app = express();
// const PORT = process.env.PORT || 5000;

// // =======================
// // Middleware
// // =======================
// app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
// app.use(express.json());
// app.use('/uploads', express.static('uploads')); // Serve profile pics

// // =======================
// // MongoDB Connection
// // =======================
// mongoose.connect(process.env.MONGODB_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// })
// .then(() => console.log('✅ Connected to MongoDB'))
// .catch(err => console.error('❌ MongoDB connection error:', err));

// // =======================
// // Schemas & Models
// // =======================
// const userSchema = new mongoose.Schema({
//   email: { type: String, required: true, unique: true, lowercase: true, trim: true },
//   password: { type: String, required: true, minlength: 6 },
//   age: { type: Number, default: null },
//   gender: { type: String, default: null },
//   dateOfBirth: { type: Date, default: null },
//   personality: { type: String, default: null },
//   profilePic: { type: String, default: null },
//   resetToken: { type: String },
//   resetTokenExpiry: { type: Date }
// }, { timestamps: true });

// userSchema.pre('save', async function(next) {
//   if (!this.isModified('password')) return next();
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

// userSchema.methods.comparePassword = function(candidatePassword) {
//   return bcrypt.compare(candidatePassword, this.password);
// };

// const User = mongoose.model('User', userSchema);

// const moodSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   emoji: { type: String, required: true },
//   timestamp: { type: Date, default: Date.now }
// });
// const Mood = mongoose.model('Mood', moodSchema);

// const taskSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   task: { type: String, required: true },
//   done: { type: Boolean, default: false }
// }, { timestamps: true });
// const Task = mongoose.model('Task', taskSchema);

// const favouriteSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   item: { type: String, required: true }
// }, { timestamps: true });
// const Favourite = mongoose.model('Favourite', favouriteSchema);

// const contactSchema = new mongoose.Schema({
//   name: String,
//   email: String,
//   message: String,
//   date: { type: Date, default: Date.now }
// });
// const Contact = mongoose.model('Contact', contactSchema);

// // =======================
// // Multer for profile pic
// // =======================
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, 'uploads/'),
//   filename: (req, file, cb) => cb(null, `${req.params.userId}${path.extname(file.originalname)}`)
// });
// const upload = multer({ storage });

// // =======================
// // Routes
// // =======================

// // Test root
// app.get('/', (req, res) => res.json({ message: 'API is running' }));

// // ---------- Register ----------
// app.post('/api/auth/register', async (req, res) => {
//   try {
//     const { email, password, age, gender, dateOfBirth } = req.body;
//     if (await User.findOne({ email })) return res.status(400).json({ error: 'User already exists' });

//     const user = new User({ email, password, age, gender, dateOfBirth });
//     await user.save();

//     const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '24h' });
//     res.status(201).json({
//       message: 'User created',
//       token,
//       user: { id: user._id, email: user.email, age: user.age, gender: user.gender, dateOfBirth: user.dateOfBirth }
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // ---------- Login ----------
// app.post('/api/auth/login', async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email });
//     if (!user) return res.status(404).json({ error: 'User not found' });

//     const isMatch = await user.comparePassword(password);
//     if (!isMatch) return res.status(401).json({ error: 'Incorrect email or password' });

//     const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '24h' });
//     res.json({ message: 'Login successful', token, user: { id: user._id, email: user.email } });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // ---------- Forgot Password ----------
// app.post("/api/auth/forgot", async (req, res) => {
//   try {
//     const { email } = req.body;
//     if (!email) return res.status(400).json({ error: "Email is required" });

//     const user = await User.findOne({ email });
//     if (!user) return res.status(404).json({ error: "User not found" });

//     const resetToken = Math.random().toString(36).substring(2, 15);
//     user.resetToken = resetToken;
//     user.resetTokenExpiry = Date.now() + 3600000; // 1 hour
//     await user.save();

//     console.log(`Reset link: http://localhost:3000/resetpage?token=${resetToken}`);
//     res.json({ message: "Reset link has been sent to your email" });
//   } catch (err) {
//     res.status(500).json({ error: "Server error" });
//   }
// });

// // ---------- Reset Password ----------
// app.post("/api/auth/reset", async (req, res) => {
//   try {
//     const { password, token } = req.body;
//     if (!password || !token) return res.status(400).json({ error: "Password and token are required" });

//     const user = await User.findOne({ resetToken: token, resetTokenExpiry: { $gt: Date.now() } });
//     if (!user) return res.status(400).json({ error: "Invalid or expired token" });

//     user.password = password;
//     user.resetToken = undefined;
//     user.resetTokenExpiry = undefined;
//     await user.save();

//     res.json({ message: "Password has been reset successfully!" });
//   } catch (err) {
//     res.status(500).json({ error: "Server error" });
//   }
// });

// // ---------- Update Profile ----------
// app.put('/api/profile/:userId', authenticateToken, upload.single('profilePic'), async (req, res) => {
//   try {
//     const { age, gender, dateOfBirth, personality } = req.body;
//     const updateData = { age, gender, dateOfBirth, personality };
//     if (req.file) updateData.profilePic = `/uploads/${req.file.filename}`;

//     const user = await User.findByIdAndUpdate(req.params.userId, updateData, { new: true }).select('-password');
//     if (!user) return res.status(404).json({ error: 'User not found' });

//     res.json({ message: 'Profile updated', user });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // ---------- Personality ----------
// app.post('/api/auth/personality', authenticateToken, async (req, res) => {
//   try {
//     const { personality } = req.body;
//     if (!personality) return res.status(400).json({ error: 'Personality is required' });

//     const user = await User.findByIdAndUpdate(req.user.userId, { personality }, { new: true }).select('-password');
//     if (!user) return res.status(404).json({ error: 'User not found' });

//     res.json({ message: 'Personality updated', user });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // ---------- Mood Tracking ----------
// app.post('/api/auth/mood', authenticateToken, async (req, res) => {
//   try {
//     const { emoji } = req.body;
//     if (!emoji) return res.status(400).json({ error: 'Emoji is required' });

//     const mood = new Mood({ userId: req.user.userId, emoji });
//     await mood.save();
//     res.status(201).json({ message: 'Mood saved', mood });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// app.get('/api/auth/mood', authenticateToken, async (req, res) => {
//   try {
//     const moods = await Mood.find({ userId: req.user.userId }).sort({ timestamp: -1 });
//     res.json(moods);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // ---------- Tasks / Goals ----------
// app.post('/api/auth/tasks', authenticateToken, async (req, res) => {
//   try {
//     const { task } = req.body;
//     if (!task) return res.status(400).json({ error: 'Task is required' });

//     const newTask = new Task({ userId: req.user.userId, task });
//     await newTask.save();
//     res.status(201).json({ message: 'Task added', newTask });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// app.get('/api/auth/tasks', authenticateToken, async (req, res) => {
//   try {
//     const tasks = await Task.find({ userId: req.user.userId }).sort({ createdAt: -1 });
//     res.json(tasks);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // ---------- Favourites ----------
// app.post('/api/auth/favourites', authenticateToken, async (req, res) => {
//   try {
//     const { item } = req.body;
//     if (!item) return res.status(400).json({ error: 'Item is required' });

//     const fav = new Favourite({ userId: req.user.userId, item });
//     await fav.save();
//     res.status(201).json({ message: 'Favourite added', fav });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// app.get('/api/auth/favourites', authenticateToken, async (req, res) => {
//   try {
//     const favs = await Favourite.find({ userId: req.user.userId });
//     res.json(favs);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // ---------- Contact ----------
// app.post('/api/auth/contact', async (req, res) => {
//   try {
//     const { name, email, message } = req.body;
//     if (!name || !email || !message) return res.status(400).json({ error: 'All fields are required' });

//     const contact = new Contact({ name, email, message });
//     await contact.save();
//     res.status(201).json({ message: 'Message received', contact });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // ---------- Recommendations ----------
// app.get('/api/auth/recommendations', authenticateToken, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.userId);
//     if (!user || !user.personality) return res.status(400).json({ error: 'Please set your personality first' });

//     const personalityToSubject = {
//       Friendly: 'fiction',
//       Adventurous: 'travel',
//       Curious: 'science',
//       Romantic: 'romance',
//       Creative: 'art',
//       Thoughtful: 'philosophy'
//     };

//     const subject = personalityToSubject[user.personality] || 'general';
//     const response = await axios.get(`https://openlibrary.org/search.json?q=subject:${subject}`);

//     const books = response.data.docs.slice(0, 10).map(book => ({
//       title: book.title,
//       author: book.author_name ? book.author_name.join(', ') : 'Unknown',
//       first_publish_year: book.first_publish_year || 'N/A'
//     }));

//     res.json({ personality: user.personality, subject, recommendations: books });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // =======================
// // Start Server
// // =======================
// app.listen(PORT, '0.0.0.0', () => console.log(`🚀 Server running on port ${PORT}`));
