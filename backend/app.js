const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const session = require('express-session');  // For user session management
const MongoStore = require('connect-mongo');  // Store sessions in MongoDB
const User = require('./models/User');        // Import our User model
const Club = require('./models/Club');


dotenv.config();

const app = express();
const port = 3000;

// =============================================================================
// MIDDLEWARE SETUP
// =============================================================================

// Basic Express Middleware
app.use(express.static(path.join(__dirname, '../frontend')));  // Serve static files
app.use(express.urlencoded({ extended: true }));               // Parse form data
app.use(express.json());                                       // Parse JSON data

// 🎟️ SESSION CONFIGURATION - Like setting up a wristband system at a concert
app.use(session({
  // This is the "ink" used to create secure wristbands - keep it secret!
  secret: process.env.SESSION_SECRET || 'change-this-in-production',

  // Don't save empty sessions (saves database space)
  resave: false,
  saveUninitialized: false,

  // Store sessions in MongoDB (like a filing cabinet for wristbands)
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    collectionName: 'sessions'  // Creates a 'sessions' collection in your DB
  }),

  // Wristband settings
  cookie: {
    secure: false,      // Set to true when using HTTPS in production
    httpOnly: true,     // Prevents JavaScript from accessing the cookie (security)
    maxAge: 1000 * 60 * 60 * 24  // 24 hours (wristband expires after 1 day)
  }
}));

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('MongoDB connection error:', err));

// 🎟️ AUTHENTICATION MIDDLEWARE - Our "bouncer" function
// This checks if someone has a valid wristband before letting them into protected areas
const requireAuth = (req, res, next) => {
  if (req.session.userId) {
    // They have a wristband with a valid userId! Let them in
    next();
  } else {
    // No wristband? Send them to get one (login page)
    res.redirect('/login');
  }
};

// =============================================================================
// ROUTES
// =============================================================================

// 🏠 HOME ROUTE
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// =============================================================================
// AUTHENTICATION ROUTES
// =============================================================================

// 🚪 LOGIN ROUTES
app.get('/login', (req, res) => {
  // If user already has a wristband (logged in), send them home
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

    if (!user) {
      return res.redirect('/login?error=invalid');
    }

    // Step 2: Use our secure password comparison (the ID checker!)
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.redirect('/login?error=invalid');
    }

    // Step 3: 🎟️ ISSUE THE WRISTBAND! Store user info in session
    req.session.userId = user._id;
    req.session.userEmail = user.email;

    console.log('Login successful, session created for:', user.email);
    res.redirect('/');

  } catch (err) {
    console.error('Login error:', err);
    res.redirect('/login?error=server');
  }
});

// 📝 SIGNUP ROUTES
app.get('/signup', (req, res) => {
  // If user already has a wristband (logged in), send them home
  if (req.session.userId) {
    return res.redirect('/');
  }
  res.sendFile(path.join(__dirname, '../frontend/pages/signup.html'));
});

app.post('/signup', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Step 1: Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      return res.redirect('/signup?error=exists');
    }

    // Step 2: Validate UC Davis email domain (customize for your school!)
    if (!email.toLowerCase().endsWith('@ucdavis.edu')) {
      return res.redirect('/signup?error=email');
    }

    // Step 3: Create new user (password gets hashed automatically by our User model!)
    const newUser = new User({
      email: email.toLowerCase(),
      password: password  // This gets transformed into a hash by bcrypt
    });

    await newUser.save();

    // Step 4: 🎟️ AUTO-LOGIN: Give them a wristband immediately after signup
    req.session.userId = newUser._id;
    req.session.userEmail = newUser.email;

    console.log('New user created and logged in:', newUser.email);
    res.redirect('/');

  } catch (err) {
    console.error('Signup error:', err);
    if (err.code === 11000) {
      // MongoDB duplicate key error (shouldn't happen due to our check above)
      return res.redirect('/signup?error=exists');
    }
    res.redirect('/signup?error=server');
  }
});

// 🚪 LOGOUT ROUTE
app.get('/logout', (req, res) => {
  // 🗑️ REMOVE THE WRISTBAND - Destroy the session completely
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
    }
    console.log('User logged out');
    res.redirect('/login');
  });
});

// =============================================================================
// PROTECTED ROUTES - Only for users with valid wristbands!
// =============================================================================

// 🏛️ TECH CLUBS PAGE - Protected route example
app.get('/tech-clubs', requireAuth, (req, res) => {
  // This line only runs if the user passed the requireAuth bouncer check
  console.log('Tech clubs accessed by:', req.session.userEmail);
  res.sendFile(path.join(__dirname, '../frontend/pages/tech-clubs.html'));
});

app.get('/api/bookmarks', requireAuth, async (req, res) => {
  try {
    console.log(`📖 Fetching bookmarks for user: ${req.session.userEmail}`);

    // Get user with populated bookmark details
    const userWithBookmarks = await User.findWithBookmarks(req.session.userId);

    if (!userWithBookmarks) {
      return res.status(404).json({ error: 'User not found' });
    }

    console.log(`✅ Found ${userWithBookmarks.bookmarkedClubs.length} bookmarks`);

    res.json({
      bookmarks: userWithBookmarks.bookmarkedClubs,
      totalBookmarks: userWithBookmarks.bookmarkedClubs.length
    });

  } catch (error) {
    console.error('💥 Error fetching bookmarks:', error);
    res.status(500).json({ error: 'Failed to fetch bookmarks' });
  }
});

// 🔖 ADD BOOKMARK - Save a club to user's bookmarks
app.post('/api/bookmarks', requireAuth, async (req, res) => {
  try {
    const { clubId } = req.body;

    // Validate input
    if (!clubId) {
      return res.status(400).json({ error: 'Club ID is required' });
    }

    console.log(`📌 Adding bookmark: ${clubId} for user: ${req.session.userEmail}`);

    // Check if club exists
    const Club = require('./models/Club');
    const club = await Club.findById(clubId);
    if (!club) {
      return res.status(404).json({ error: 'Club not found' });
    }

    // Get user and add bookmark
    const user = await User.findById(req.session.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Add bookmark (method handles duplicates)
    const wasAdded = await user.addBookmark(clubId);

    if (wasAdded) {
      res.json({
        message: 'Bookmark added successfully',
        clubId: clubId,
        clubName: club.name,
        totalBookmarks: user.getBookmarkCount()
      });
    } else {
      res.status(409).json({
        error: 'Club already bookmarked',
        clubId: clubId
      });
    }

  } catch (error) {
    console.error('💥 Error adding bookmark:', error);
    res.status(500).json({ error: 'Failed to add bookmark' });
  }
});

// 🗑️ REMOVE BOOKMARK - Remove a club from user's bookmarks
app.delete('/api/bookmarks/:clubId', requireAuth, async (req, res) => {
  try {
    const { clubId } = req.params;

    console.log(`🗑️ Removing bookmark: ${clubId} for user: ${req.session.userEmail}`);

    // Get user and remove bookmark
    const user = await User.findById(req.session.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Remove bookmark (method handles if not bookmarked)
    const wasRemoved = await user.removeBookmark(clubId);

    if (wasRemoved) {
      res.json({
        message: 'Bookmark removed successfully',
        clubId: clubId,
        totalBookmarks: user.getBookmarkCount()
      });
    } else {
      res.status(404).json({
        error: 'Club was not bookmarked',
        clubId: clubId
      });
    }

  } catch (error) {
    console.error('💥 Error removing bookmark:', error);
    res.status(500).json({ error: 'Failed to remove bookmark' });
  }
});

// 🔍 CHECK BOOKMARK STATUS - Check if a specific club is bookmarked
app.get('/api/bookmarks/check/:clubId', requireAuth, async (req, res) => {
  try {
    const { clubId } = req.params;

    const user = await User.findById(req.session.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isBookmarked = user.hasBookmarked(clubId);

    res.json({
      clubId: clubId,
      isBookmarked: isBookmarked
    });

  } catch (error) {
    console.error('💥 Error checking bookmark:', error);
    res.status(500).json({ error: 'Failed to check bookmark status' });
  }
});


// 👤 USER DASHBOARD - Protected route for user profile and management
app.get('/dashboard', requireAuth, (req, res) => {
  console.log('Dashboard accessed by:', req.session.userEmail);
  res.sendFile(path.join(__dirname, '../frontend/pages/dashboard.html'));
});

// 🏛️ GET ALL CLUBS - Replace static HTML cards
app.get('/api/clubs', async (req, res) => {
  try {
    const clubs = await Club.find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(50);

    console.log(`📊 Serving ${clubs.length} clubs from database`);
    res.json(clubs);
  } catch (error) {
    console.error('Error fetching clubs:', error);
    res.status(500).json({ error: 'Failed to fetch clubs' });
  }
});

// 🔍 SEARCH CLUBS - Database-powered search  
app.get('/api/clubs/search', async (req, res) => {
  try {
    const { q, category, tags } = req.query;

    let searchCriteria = { isActive: true };

    // Add search query if provided
    if (q && q.trim()) {
      searchCriteria.$or = [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { tags: { $in: [new RegExp(q, 'i')] } }
      ];
    }

    // Add category filter if provided
    if (category) {
      searchCriteria.category = category;
    }

    // Add tag filter if provided  
    if (tags) {
      const tagArray = tags.split(',');
      searchCriteria.tags = { $in: tagArray };
    }

    const clubs = await Club.find(searchCriteria)
      .sort({ memberCount: -1 })
      .limit(50);

    console.log(`🔍 Search for "${q}" found ${clubs.length} clubs`);
    res.json(clubs);
  } catch (error) {
    console.error('Error searching clubs:', error);
    res.status(500).json({ error: 'Failed to search clubs' });
  }
});

// =============================================================================
// UPDATED DASHBOARD API - Replace your existing /api/user/profile route
// =============================================================================

// 📊 ENHANCED USER API - More detailed user information for dashboard
app.get('/api/user/profile', requireAuth, async (req, res) => {
  try {
    // Find the user with populated bookmarks
    const userWithBookmarks = await User.findWithBookmarks(req.session.userId);

    if (!userWithBookmarks) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Calculate additional stats
    const bookmarkCount = userWithBookmarks.getBookmarkCount();
    const joinDate = userWithBookmarks.createdAt;
    const daysActive = Math.ceil((new Date() - joinDate) / (1000 * 60 * 60 * 24));

    console.log(`📊 Dashboard data for ${userWithBookmarks.email}: ${bookmarkCount} bookmarks, ${daysActive} days active`);

    // Return comprehensive user data for dashboard
    res.json({
      id: userWithBookmarks._id,
      email: userWithBookmarks.email,
      joinDate: joinDate,

      // 🔖 REAL BOOKMARK DATA
      bookmarkedClubs: userWithBookmarks.bookmarkedClubs, // Full club objects
      totalBookmarks: bookmarkCount,

      // 📊 CALCULATED STATS
      daysActive: daysActive,

      // 🎯 FUTURE: Additional user stats
      clubsViewed: 12,      // Placeholder - could track this later
      eventsInterested: 3,  // Placeholder - for events feature
      searchesPerformed: 8  // Placeholder - could track this later
    });

  } catch (error) {
    console.error('Profile API error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// =============================================================================
// API ROUTES - For frontend JavaScript to check authentication status
// =============================================================================

// 🔍 USER STATUS API - Let frontend know if someone is logged in
app.get('/api/user', (req, res) => {
  if (req.session.userId) {
    // User has a valid wristband - send their info
    res.json({
      isLoggedIn: true,
      email: req.session.userEmail,
      userId: req.session.userId
    });
  } else {
    // No wristband - they're not logged in
    res.json({ isLoggedIn: false });
  }
});

// =============================================================================
// START SERVER
// =============================================================================

app.listen(port, () => {
  console.log(`🚀 Cownect server running at http://localhost:${port}`);
  console.log(`📊 Database: MongoDB Atlas`);
  console.log(`🔐 Authentication: bcrypt + sessions`);
});