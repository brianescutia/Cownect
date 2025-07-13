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
    // Step 1: Find user by email (convert to lowercase for consistency)
    const user = await User.findOne({ email: email.toLowerCase() });

    // Step 2: If no user found, show error
    if (!user) {
      return res.redirect('/login?error=invalid');
    }

    // Step 3: Use our new comparePassword method (the ID checker!)
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.redirect('/login?error=invalid');
    }

    // Step 4: Password is correct! (We'll add sessions next week)
    console.log('Login successful for:', user.email);
    res.redirect('/');

  } catch (err) {
    console.error('Login error:', err);
    res.redirect('/login?error=server');
  }
});

// Add this to your app.js file, after your login routes

// GET route for signup page
app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/pages/signup.html'));
});

// POST route to handle user registration
app.post('/signup', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      return res.redirect('/signup?error=exists');
    }

    // Optional: Validate UC Davis email domain
    if (!email.toLowerCase().endsWith('@ucdavis.edu')) {
      return res.redirect('/signup?error=email');
    }

    // Create new user (password will be automatically hashed by our pre-save middleware!)
    const newUser = new User({
      email: email.toLowerCase(),
      password: password  // This gets hashed automatically!
    });

    await newUser.save();

    console.log('New user created:', newUser.email);

    // For now, just redirect to login (next week we'll add auto-login)
    res.redirect('/login?success=1');

  } catch (err) {
    console.error('Signup error:', err);

    if (err.code === 11000) {
      // MongoDB duplicate key error
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