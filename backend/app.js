const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const User = require('./models/User'); // Import the User model

dotenv.config();

const app = express();
const port = 3000;

// Middleware
app.use(express.static(path.join(__dirname, '../frontend')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key-change-this',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    collectionName: 'sessions'
  }),
  cookie: {
    secure: false, // Set to true in production with HTTPS
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 // 24 hours
  }
}));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware to check if user is authenticated
const requireAuth = (req, res, next) => {
  if (req.session.userId) {
    next();
  } else {
    res.redirect('/login');
  }
};

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.get('/login', (req, res) => {
  // Redirect to home if already logged in
  if (req.session.userId) {
    return res.redirect('/');
  }
  res.sendFile(path.join(__dirname, '../frontend/pages/login.html'));
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.redirect('/login?error=invalid');
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.redirect('/login?error=invalid');
    }

    // Create session
    req.session.userId = user._id;
    req.session.userEmail = user.email;

    res.redirect('/');
  } catch (err) {
    console.error('Login error:', err);
    res.redirect('/login?error=server');
  }
});

app.get('/signup', (req, res) => {
  // Redirect to home if already logged in
  if (req.session.userId) {
    return res.redirect('/');
  }
  res.sendFile(path.join(__dirname, '../frontend/pages/signup.html'));
});

app.post('/signup', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      return res.redirect('/signup?error=exists');
    }

    // Validate UC Davis email (optional)
    if (!email.toLowerCase().endsWith('@ucdavis.edu')) {
      return res.redirect('/signup?error=email');
    }

    // Create new user
    const newUser = new User({
      email: email.toLowerCase(),
      password: password
    });

    await newUser.save();

    // Auto-login after signup
    req.session.userId = newUser._id;
    req.session.userEmail = newUser.email;

    res.redirect('/');
  } catch (err) {
    console.error('Signup error:', err);
    if (err.code === 11000) {
      // Duplicate key error
      return res.redirect('/signup?error=exists');
    }
    res.redirect('/signup?error=server');
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
    }
    res.redirect('/login');
  });
});

// Protected route example
app.get('/tech-clubs', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/pages/tech-clubs.html'));
});

// API endpoint to get current user info
app.get('/api/user', (req, res) => {
  if (req.session.userId) {
    res.json({
      isLoggedIn: true,
      email: req.session.userEmail
    });
  } else {
    res.json({ isLoggedIn: false });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});