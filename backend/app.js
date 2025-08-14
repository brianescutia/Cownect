require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const session = require('express-session');  // For user session management
const MongoStore = require('connect-mongo');  // Store sessions in MongoDB
const User = require('../backend/models/User');        // Import our User model
const Club = require('./models/Club');
const { CareerField, QuizQuestion, QuizResult } = require('./models/nicheQuizModels');
const Event = require('./models/eventModel'); // Import Event model for events API
// Add this with your other imports (around line 10)
const passport = require('passport');
require('./googleAuth');
const GoogleStrategy = require('passport-google-oauth20').Strategy;




const app = express();
const port = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';


// =============================================================================
// MIDDLEWARE SETUP
// =============================================================================

// Basic Express Middleware
app.use(express.static(path.join(__dirname, '../frontend')));  // Serve static files
app.use(express.urlencoded({ extended: true }));               // Parse form data
app.use(express.json());                                       // Parse JSON data

// SESSION CONFIGURATION - Like setting up a wristband system at a concert
app.use(session({
  secret: process.env.SESSION_SECRET || 'change-this-in-production',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    collectionName: 'sessions',
    ttl: 24 * 60 * 60 // 24 hours in seconds
  }),
  cookie: {
    secure: false, // Set to false for now (even in production) to test
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24, // 24 hours
    sameSite: 'lax' // Add this for better compatibility
  },
  name: 'cownect.sid' // Custom session name
}));

// Add session debugging middleware RIGHT AFTER session middleware
app.use((req, res, next) => {
  console.log('🔍 Session Debug:', {
    sessionID: req.sessionID,
    userId: req.session?.userId,
    userEmail: req.session?.userEmail,
    path: req.path,
    method: req.method
  });
  next();
});

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('MongoDB connection error:', err));

// AUTHENTICATION MIDDLEWARE - Our "bouncer" function
// This checks if someone has a valid wristband before letting them into protected areas
const requireAuth = (req, res, next) => {
  console.log('🔒 Auth check for:', req.path);
  console.log('🔍 Session:', {
    sessionID: req.sessionID,
    userId: req.session?.userId,
    userEmail: req.session?.userEmail
  });

  if (req.session && req.session.userId) {
    console.log('✅ User authenticated:', req.session.userEmail);
    return next();
  } else {
    console.log('❌ User not authenticated, redirecting to login');
    return res.redirect('/login');
  }
};

function redirectLoggedInUsers(req, res, next) {
  if (req.session && req.session.userId) {
    console.log(` Redirecting logged-in user ${req.session.userEmail} to tech-clubs`);
    return res.redirect('/tech-clubs');
  }
  next();
}

app.use('/assets', express.static(path.join(__dirname, '../frontend/assets'), {
  maxAge: '1d', // Cache for 1 day
  etag: false,
  setHeaders: (res, path) => {
    console.log('📁 Serving static file:', path);
  }
}));

// Serve all frontend files
app.use(express.static(path.join(__dirname, '../frontend'), {
  maxAge: '1d'
}));

// Add a catch-all for missing assets (for debugging)
app.get('/assets/*filename', (req, res) => {
  console.log('❌ Missing asset requested:', req.path);
  res.status(404).json({
    error: 'Asset not found',
    path: req.path,
    suggestion: 'Check if the file exists in frontend/assets/'
  });
});

console.log('🔍 Starting route validation...');

// Wrap your route definitions to catch errors
const originalGet = app.get;
const originalPost = app.post;
const originalPut = app.put;
const originalDelete = app.delete;

app.get = function (path, ...handlers) {
  try {
    console.log('✅ Registering GET route:', path);
    return originalGet.call(this, path, ...handlers);
  } catch (error) {
    console.error('❌ Error registering GET route:', path);
    console.error('💥 Error details:', error.message);
    throw error;
  }
};

app.post = function (path, ...handlers) {
  try {
    console.log('✅ Registering POST route:', path);
    return originalPost.call(this, path, ...handlers);
  } catch (error) {
    console.error('❌ Error registering POST route:', path);
    console.error('💥 Error details:', error.message);
    throw error;
  }
};

app.put = function (path, ...handlers) {
  try {
    console.log('✅ Registering PUT route:', path);
    return originalPut.call(this, path, ...handlers);
  } catch (error) {
    console.error('❌ Error registering PUT route:', path);
    console.error('💥 Error details:', error.message);
    throw error;
  }
};

app.delete = function (path, ...handlers) {
  try {
    console.log('✅ Registering DELETE route:', path);
    return originalDelete.call(this, path, ...handlers);
  } catch (error) {
    console.error('❌ Error registering DELETE route:', path);
    console.error('💥 Error details:', error.message);
    throw error;
  }
};



// 4. PASSPORT SERIALIZATION
passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// 5. ADD PASSPORT MIDDLEWARE (after your session middleware)
app.use(passport.initialize());
app.use(passport.session());

// 6. REPLACE YOUR AUTH ROUTES WITH THESE:

app.get('/login', (req, res) => {
  // Redirect if already logged in
  if (req.session && req.session.userId) {
    return res.redirect('/tech-clubs');
  }
  res.sendFile(path.join(__dirname, '../frontend/pages/login.html'));
});

// Signup page (Google-only)
app.get('/signup', (req, res) => {
  // Redirect if already logged in
  if (req.session && req.session.userId) {
    return res.redirect('/tech-clubs');
  }
  res.sendFile(path.join(__dirname, '../frontend/pages/signup.html'));
});

app.get('/', (req, res) => {
  if (req.session && req.session.userId) {
    res.redirect('/tech-clubs');
  } else {
    res.redirect('/login');
  }
});

// Google OAuth login route
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login?error=google_auth_failed' }),
  (req, res) => {
    console.log('✅ Google OAuth success for:', req.user.email);

    // Check if user is verified (should be true for Google users)
    if (!req.user.isVerified) {
      console.log('❌ Google user not verified (unexpected):', req.user.email);
      return res.redirect('/verify-email-prompt?email=' + encodeURIComponent(req.user.email));
    }

    // Set session
    req.session.userId = req.user._id;
    req.session.userEmail = req.user.email;

    console.log('🎉 Google OAuth login successful, redirecting to tech-clubs');
    res.redirect('/tech-clubs?google_auth=success');
  }
);


// In your backend directory

// =============================================================================
// ROUTES
// =============================================================================

// HOME ROUTE
app.get('/', redirectLoggedInUsers, (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/pages/index.html'));
});

// =============================================================================
// AUTHENTICATION ROUTES
// =============================================================================




// LOGIN ROUTES
app.get('/login', redirectLoggedInUsers, (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/pages/login.html'));
});



// SIGNUP ROUTES
app.use((err, req, res, next) => {
  console.error(' Unhandled error:', err);

  // Check if response was already sent
  if (res.headersSent) {
    console.error(' Headers already sent, cannot send error response');
    return next(err);
  }

  // Send error response
  res.status(500).json({ error: 'Something went wrong!' });
});

app.use((req, res, next) => {
  console.log(` ${req.method} ${req.path} - ${new Date().toISOString()}`);

  // Log when response is finished
  res.on('finish', () => {
    console.log(` Response sent: ${res.statusCode} for ${req.method} ${req.path}`);
  });

  next();
});
app.get('/signup', redirectLoggedInUsers, (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/pages/signup.html'));
});



// Replace your existing /signup POST route in backend/app.js with this:




//  LOGOUT ROUTE
app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
    }
    console.log('User logged out');
    res.redirect('/login?logged_out=true');
  });
});


// Add this TEMPORARY test route to debug sessions
// Remove after fixing the issue

app.get('/api/test-session', (req, res) => {
  console.log('🧪 Session test route accessed');

  const sessionInfo = {
    sessionID: req.sessionID,
    sessionExists: !!req.session,
    userId: req.session?.userId,
    userEmail: req.session?.userEmail,
    sessionData: req.session,
    cookies: req.headers.cookie,
    userAgent: req.headers['user-agent']
  };

  console.log('📊 Session info:', sessionInfo);

  res.json({
    success: true,
    message: 'Session test route',
    sessionInfo: sessionInfo,
    isAuthenticated: !!(req.session && req.session.userId),
    timestamp: new Date().toISOString()
  });
});

// Have your friend visit this after logging in:
// https://your-app.railway.app/api/test-session
// =============================================================================
// PROTECTED ROUTES - Only for users with valid wristbands!
// =============================================================================

//  TECH CLUBS PAGE - Protected route example
app.get('/tech-clubs', requireAuth, (req, res) => {
  // This line only runs if the user passed the requireAuth bouncer check
  console.log('Tech clubs accessed by:', req.session.userEmail);
  res.sendFile(path.join(__dirname, '../frontend/pages/tech-clubs.html'));
});

app.get('/api/bookmarks', requireAuth, async (req, res) => {
  try {
    console.log(` Fetching bookmarks for user: ${req.session.userEmail}`);

    // Get user with populated bookmark details
    const userWithBookmarks = await User.findWithBookmarks(req.session.userId);

    if (!userWithBookmarks) {
      return res.status(404).json({ error: 'User not found' });
    }

    console.log(` Found ${userWithBookmarks.bookmarkedClubs.length} bookmarks`);

    res.json({
      bookmarks: userWithBookmarks.bookmarkedClubs,
      totalBookmarks: userWithBookmarks.bookmarkedClubs.length
    });

  } catch (error) {
    console.error(' Error fetching bookmarks:', error);
    res.status(500).json({ error: 'Failed to fetch bookmarks' });
  }
});

// =============================================================================
// EVENTS PAGE ROUTES - Add these to your backend/app.js
// Replace the commented out event routes with these enhanced versions
// =============================================================================

//  EVENTS PAGE ROUTE - Serve the events HTML page
app.get('/events', requireAuth, (req, res) => {
  console.log('Events page accessed by:', req.session.userEmail);
  res.sendFile(path.join(__dirname, '../frontend/pages/events.html'));
});

//  GET ALL EVENTS - Enhanced version with filtering
app.get('/api/events', requireAuth, async (req, res) => {
  try {
    console.log(' Fetching events...');

    const {
      limit = 50,
      featured = false,
      upcoming = true,
      month,
      year
    } = req.query;

    let query = { isActive: true };

    // Filter for upcoming events only
    if (upcoming === 'true') {
      query.date = { $gte: new Date() };
    }

    // Filter by specific month/year for calendar
    if (month && year) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59);
      query.date = { $gte: startDate, $lte: endDate };
    }

    let eventsQuery = Event.find(query)
      .populate('createdBy', 'email')
      .sort({ date: 1 });

    // Limit results if specified
    if (limit) {
      eventsQuery = eventsQuery.limit(parseInt(limit));
    }

    const events = await eventsQuery.lean();

    console.log(` Found ${events.length} events`);

    // Add additional computed fields
    const enhancedEvents = events.map(event => ({
      ...event,
      isPast: new Date(event.date) < new Date(),
      isToday: new Date(event.date).toDateString() === new Date().toDateString(),
      formattedDate: new Date(event.date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      formattedTime: event.time || 'Time TBD'
    }));

    res.json(enhancedEvents);

  } catch (error) {
    console.error(' Error fetching events:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

//  GET FEATURED EVENTS - Top 3 events for the main display
app.get('/api/events/featured', requireAuth, async (req, res) => {
  try {
    console.log(' Fetching featured events...');

    const featuredEvents = await Event.find({
      isActive: true,
      date: { $gte: new Date() } // Only upcoming events
    })
      .populate('createdBy', 'email')
      .sort({
        date: 1,           // Soonest first
        createdAt: -1      // Then newest first
      })
      .limit(3)
      .lean();

    // Add enhanced data for featured events
    const enhancedFeaturedEvents = featuredEvents.map(event => ({
      ...event,
      formattedDate: new Date(event.date).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      }),
      formattedTime: event.time || 'Time TBD',
      daysUntil: Math.ceil((new Date(event.date) - new Date()) / (1000 * 60 * 60 * 24)),
      imageUrl: event.imageUrl || '/assets/default-event-image.jpg'
    }));

    console.log(` Found ${enhancedFeaturedEvents.length} featured events`);
    res.json(enhancedFeaturedEvents);

  } catch (error) {
    console.error(' Error fetching featured events:', error);
    res.status(500).json({ error: 'Failed to fetch featured events' });
  }
});

//  GET EVENTS BY DATE - For calendar functionality
app.get('/api/events/date/:date', requireAuth, async (req, res) => {
  try {
    const { date } = req.params;
    console.log(` Fetching events for date: ${date}`);

    // Parse the date and get events for that day
    const targetDate = new Date(date);
    const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

    const events = await Event.find({
      isActive: true,
      status: 'published',
      date: {
        $gte: startOfDay,
        $lte: endOfDay
      }
    })
      .populate('createdBy', 'email')
      .sort({ date: 1 })
      .lean();

    // Format events for frontend
    const formattedEvents = events.map(event => ({
      id: event._id.toString(),
      title: event.title,
      time: event.time || 'Time TBD',
      location: event.location,
      description: event.description,
      category: event.category || 'Event',
      imageUrl: event.imageUrl || '/assets/default-event-image.jpg',
      attendeeCount: event.attendees ? event.attendees.length : 0,
      maxAttendees: event.maxAttendees,
      registrationRequired: event.registrationRequired || false,
      registrationUrl: event.registrationUrl,
      formattedDate: event.date.toLocaleDateString(),
      formattedTime: event.time || 'Time TBD'
    }));

    console.log(`✅ Found ${events.length} events for ${date}`);
    res.json(formattedEvents);

  } catch (error) {
    console.error('💥 Error fetching events by date:', error);
    res.status(500).json({ error: 'Failed to fetch events for date' });
  }
});


//  GET CALENDAR DATA - Event counts by date for calendar visualization
app.get('/api/events/calendar/:year/:month', requireAuth, async (req, res) => {
  try {
    const { year, month } = req.params;
    console.log(` Fetching calendar data for ${year}-${month}`);

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    // Get events for the month
    const events = await Event.find({
      isActive: true,
      status: 'published',
      date: { $gte: startDate, $lte: endDate }
    })
      .populate('createdBy', 'email')
      .sort({ date: 1 })
      .lean();

    // Group events by date
    const eventsByDate = {};

    events.forEach(event => {
      const dateKey = event.date.toISOString().split('T')[0]; // YYYY-MM-DD format

      if (!eventsByDate[dateKey]) {
        eventsByDate[dateKey] = [];
      }

      // Format event for frontend
      eventsByDate[dateKey].push({
        id: event._id.toString(),
        title: event.title,
        time: event.time || 'Time TBD',
        location: event.location,
        description: event.description,
        category: event.category || 'Event',
        imageUrl: event.imageUrl || '/assets/default-event-image.jpg',
        attendeeCount: event.attendees ? event.attendees.length : 0,
        maxAttendees: event.maxAttendees,
        registrationRequired: event.registrationRequired || false,
        registrationUrl: event.registrationUrl
      });
    });

    // Convert to array format for frontend
    const calendarData = Object.keys(eventsByDate).map(dateKey => ({
      _id: dateKey,
      count: eventsByDate[dateKey].length,
      events: eventsByDate[dateKey]
    }));

    console.log(` Found events for ${calendarData.length} days in ${year}-${month}`);
    res.json(calendarData);

  } catch (error) {
    console.error(' Error fetching calendar data:', error);
    res.status(500).json({ error: 'Failed to fetch calendar data' });
  }
});

//  CREATE NEW EVENT - Enhanced version
app.post('/api/events', requireAuth, async (req, res) => {
  try {
    const { title, date, time, location, description, imageUrl } = req.body;

    // Validate required fields
    if (!title || !date || !location || !description) {
      return res.status(400).json({
        error: 'Title, date, location, and description are required'
      });
    }

    const newEvent = new Event({
      title,
      date: new Date(date),
      time: time || 'Time TBD',
      location,
      description,
      imageUrl: imageUrl || '/assets/default-event-image.jpg',
      createdBy: req.session.userId
    });

    await newEvent.save();

    console.log(' New event created:', newEvent.title);
    res.status(201).json(newEvent);

  } catch (error) {
    console.error(' Error creating event:', error);
    res.status(500).json({ error: 'Failed to create event' });
  }
});

// =============================================================================
// EVENT BOOKMARK API ENDPOINTS
// Add these to your main backend file (app.js or routes file)
// =============================================================================

// ADD EVENT BOOKMARK
app.post('/api/events/:eventId/bookmark', requireAuth, async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.session.userId;

    console.log(`📌 User ${req.session.userEmail} bookmarking event ${eventId}`);

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Get user and add bookmark
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const wasAdded = await user.addEventBookmark(eventId);

    res.json({
      success: true,
      message: wasAdded ? 'Event bookmarked successfully' : 'Event already bookmarked',
      eventTitle: event.title,
      isBookmarked: true,
      eventId: eventId
    });

  } catch (error) {
    console.error('💥 Error bookmarking event:', error);
    res.status(500).json({ error: 'Failed to bookmark event' });
  }
});

// REMOVE EVENT BOOKMARK
app.delete('/api/events/:eventId/bookmark', requireAuth, async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.session.userId;

    console.log(`🗑️ User ${req.session.userEmail} removing event bookmark ${eventId}`);

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const wasRemoved = await user.removeEventBookmark(eventId);

    res.json({
      success: true,
      message: wasRemoved ? 'Event bookmark removed' : 'Event was not bookmarked',
      isBookmarked: false,
      eventId: eventId
    });

  } catch (error) {
    console.error('💥 Error removing event bookmark:', error);
    res.status(500).json({ error: 'Failed to remove event bookmark' });
  }
});

// GET EVENT BOOKMARKS
app.get('/api/event-bookmarks', requireAuth, async (req, res) => {
  try {
    console.log(`📋 Fetching event bookmarks for user: ${req.session.userEmail}`);

    const user = await User.findWithEventBookmarks(req.session.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    console.log(`✅ Found ${user.bookmarkedEvents.length} event bookmarks`);

    res.json({
      bookmarks: user.bookmarkedEvents,
      totalBookmarks: user.bookmarkedEvents.length
    });

  } catch (error) {
    console.error('💥 Error fetching event bookmarks:', error);
    res.status(500).json({ error: 'Failed to fetch event bookmarks' });
  }
});

// UPDATE CLUB IMAGES - Add this route
app.put('/api/clubs/:id/images', requireAuth, async (req, res) => {
  try {
    const clubId = req.params.id;
    const { logoUrl, heroImageUrl } = req.body;

    // Validate input
    if (!logoUrl && !heroImageUrl) {
      return res.status(400).json({
        error: 'At least one image URL (logoUrl or heroImageUrl) is required'
      });
    }

    console.log(`Updating images for club ID: ${clubId}`);

    const updateData = {};
    if (logoUrl) updateData.logoUrl = logoUrl;
    if (heroImageUrl) {
      updateData.heroImageUrl = heroImageUrl;
      updateData.hasCustomHeroImage = true; // 🔑 Mark as manually set
    }
    updateData.updatedAt = new Date();

    const club = await Club.findByIdAndUpdate(
      clubId,
      updateData,
      { new: true }
    );

    if (!club) {
      return res.status(404).json({ error: 'Club not found' });
    }

    console.log(`Updated images for: ${club.name}`);
    if (heroImageUrl) console.log(`   New hero image: ${heroImageUrl}`);

    res.json({
      success: true,
      message: 'Club images updated successfully',
      club: {
        id: club._id,
        name: club.name,
        logoUrl: club.logoUrl,
        heroImageUrl: club.heroImageUrl,
        hasCustomHeroImage: club.hasCustomHeroImage
      }
    });

  } catch (error) {
    console.error(' Error updating club images:', error);
    res.status(500).json({ error: 'Failed to update club images' });
  }
});

// Unique hero images for each club
// Replace the problematic global code with this route handler:
app.post('/api/clubs/set-hero-images', requireAuth, async (req, res) => {
  try {
    // Unique hero images for each club
    const heroImages = {
      "#include": "https://includedavis.com/_next/image?url=%2Fabout%2Fimages%2FdescPic.jpg&w=3840&q=75",
      "Davis Filmmaking Society": "https://scontent-sjc3-1.xx.fbcdn.net/v/t39.30808-6/484339313_9598920923463421_8129779707304310584_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=3a1ebe&_nc_ohc=HKWUi9c4fYUQ7kNvwH7NXcU&_nc_oc=AdnaVLTjTam22xwP-_5I7fBdhvRowq3fOEoHxXdZaO9Sqyyy8nCvDJ3Wwl4aDkh4wXu0F594PzqNqaspGJXy0XZk&_nc_zt=23&_nc_ht=scontent-sjc3-1.xx&_nc_gid=b-pUQTSfmhjwsQJZz4S_Ng&oh=00_AfQERQglKyUNngpTJaKoARKmgG-6fQBaQV0SrToJEhVxVg&oe=688F51CA",
      "Google Developer Student Club": "https://storage.googleapis.com/creatorspace-public/users%2Fcln22djyd00i1p301whvmgxbp%2FAXLN0jmEde3yHgMf-IMG_4612.JPG",
      "HackDavis": "https://miro.medium.com/v2/resize:fit:1400/1*YQl_MmSsFEmQUGleWrX1LA.jpeg",
      "Women in Computer Science": "https://engineering.ucdavis.edu/sites/g/files/dgvnsk2151/files/styles/sf_landscape_16x9/public/media/images/wics-04.jpg?h=a1e1a043&itok=1dnFRIkJ",
      "Design Interactive": "https://davisdi.org/wp-content/uploads/2023/01/BDF3EBAA-352B-419A-BBF1-39BC872177FC_1_105_c-1.jpeg",
      "Quantum Computing Society at Davis": "https://engineering.ucdavis.edu/sites/g/files/dgvnsk2151/files/styles/sf_landscape_16x9/public/media/images/52490699602_769427698e_k_0.jpg?h=a1e1a043&itok=9C8m4Wmr",
      "AI Student Collective": "https://engineering.ucdavis.edu/sites/g/files/dgvnsk2151/files/media/images/Next%20to%20_The%20annual%20CS%20Research%20Symposium_.jpeg",
      "Aggie Sports Analytics": "https://aggiesportsanalytics.com/_next/image?url=%2Fhp3bw.png&w=3840&q=75",
      "Cyber Security Club at UC Davis": "https://cs.ucdavis.edu/sites/g/files/dgvnsk8441/files/styles/sf_landscape_16x9/public/images/article/cybersecurity2.png?h=c673cd1c&itok=JK2rjPXu",
      "AggieWorks": "https://framerusercontent.com/images/0aiCYbgzl1BvB9G6sioq0BFcoo4.jpg",
      "BAJA SAE": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQAlBYvGyxMiFiiCF8ARVCZqaTyX2_X9Y7-sQ&s",
      "Club of Future Female Engineers": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTdEQiLE7rPuTguN5R7upgv1ubDzwC4Q17EKw&s",
      "CodeLab": "https://codelabdavis.com/_astro/GroupPhoto.BmIde2tY_Z1vc07W.webp",
      "Computer Science Tutoring Club": "https://media.licdn.com/dms/image/v2/D5616AQGFLxjjcHGaXg/profile-displaybackgroundimage-shrink_200_800/profile-displaybackgroundimage-shrink_200_800/0/1738706218012?e=2147483647&v=beta&t=F2dou-FQe5SYLy6ny6aR1HFaA4r9fT499-WFNevkrmE",
      "Davis Data Science Club": "https://media.licdn.com/dms/image/v2/C561BAQEKjNmWZGeiug/company-background_10000/company-background_10000/0/1649187010603/data_science_club_at_utdallas_cover?e=2147483647&v=beta&t=Xy4BZ4WGD_eEmJTBCTZCaHqIspUJbxRjxzqlr80dW6E",
      "Game Development and Arts Club": "https://cdn.downloadgram.org/?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmaWxlbmFtZSI6ImRvd25sb2FkZ3JhbS5vcmdfNDA1MjQ2Mjg5XzEwNzY2MTA5MDAzNjM0ODBfNzUxMTY2OTY1NDAyODUzOTg5X24uanBnIiwidXJsIjoiaHR0cHM6Ly9zY29udGVudC1sZ2EzLTIuY2RuaW5zdGFncmFtLmNvbS92L3Q1MS4yOTM1MC0xNS80MDUyNDYyODlfMTA3NjYxMDkwMDM2MzQ4MF83NTExNjY5NjU0MDI4NTM5ODlfbi5qcGc_c3RwPWRzdC1qcGdfZTM1X3MxMDgweDEwODBfdHQ2Jl9uY19odD1zY29udGVudC1sZ2EzLTIuY2RuaW5zdGFncmFtLmNvbSZfbmNfY2F0PTEwMCZfbmNfb2M9UTZjWjJRRjZHRU13V0RqbUJsMGJlUFJFTjhHRDZXQUdZY1hPeE8yQ2Q0SDJFN243N1BXTVdiRVdWeFd3eTZnS0J0N2lnbUZEaGZheGJEb0NESWFsWGU2UEh6bXcmX25jX29oYz1feTJJUTE4THh4b1E3a052d0ViRVBrLSZfbmNfZ2lkPWMxVjh2MEZDUTVXTWJ6TWN4RE9fTncmZWRtPUFOVEtJSW9CQUFBQSZjY2I9Ny01Jm9oPTAwX0FmUW05QUZaakN6U1k1NGxZNFloRmNnOEVVMV9DS01JUXlwRU1lZUNwODMtdkEmb2U9Njg4RjdEQTMmX25jX3NpZD1kODg1YTIiLCJleHAiOjE3NTM4NDkxODksImZvcmNlIjpmYWxzZSwiaWF0IjoxNzUzODQ1NTg5fQ.OR4OgVkgCxnLfPCqwA5tjAhrt3gkqqFPVX_-PZKT9IU",
      "Girls Who Code at UC Davis": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQC_ba7agblrtPuQEBU9FK6fpXtrrLccc0tg&s",
      "Cognitive Science Student Association": "https://cogsci.ucdavis.edu/sites/g/files/dgvnsk11466/files/media/images/2022-23-cog-sci-club-officers.png",
      "ColorStack": "https://media.licdn.com/dms/image/v2/D5622AQEfs-uFPz86aw/feedshare-shrink_800/feedshare-shrink_800/0/1729541929880?e=2147483647&v=beta&t=M7aQ6Xhb1Ab2reJBGBTiV7OsOb67me4L0BsgyOrzZes",
      "Cyclone RoboSub": "https://cyclone-robosub.github.io/gallery/dirty-hands.jpg",
      "Davis Data Driven Change": "https://media.licdn.com/dms/image/v2/D4E22AQHWDIuQwkKudQ/feedshare-shrink_800/B4EZS10hwLHUAg-/0/1738217234622?e=2147483647&v=beta&t=N3mxF_75Ibr87pwTV9n5V2xeB6LnZCfzhX3t2L3ccoc",
      "Engineering Collaborative Council": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJzCB5J0JKVV2ID9B1DiqztpfJONHo-CiHdA&s",
      "Engineers Without Borders at UC Davis": "https://engineering.ucdavis.edu/sites/g/files/dgvnsk2151/files/styles/sf_landscape_4x3/public/media/images/Bolivia%202.JPG?h=c660573c&itok=QD3O8Rck",
      "Food Tech Club": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTg2hkuQzm_lbgmTTOwzl6rywfi6EkopjCOVA&s",
      "Green Innovation Network": "https://substackcdn.com/image/fetch/f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F319388ee-7303-4641-bf46-a76c171d6905_1796x1170.png",
      "Human Resources Managment Association (HRMA)": "https://media.licdn.com/dms/image/v2/D4D0BAQFPWZ8uQQYfyQ/company-logo_200_200/company-logo_200_200/0/1727326225643?e=2147483647&v=beta&t=h4AF50RdNmOt1sUPKwX8JzlLurWmkchAPread4GuZuE",
      "Nuerotech @ UCDavis": "https://neurotechdavis.com/assets/aboutheader20232024-DjZ4AXfB.jpeg",
      "Product Space @ UC Davis": "https://www.davisproductspace.org/images/WhoWeAre/capstone-pres.png",
      "SacHacks": "https://miro.medium.com/v2/resize:fill:320:214/1*ZLnH1YoLY2RvsdqS-W_kiw.png",
      "The Davis Consulting Group": "https://images.squarespace-cdn.com/content/v1/5d71898a6704a60001e27c6c/1661475566819-9WV1TLMNDQNGUJ9ZNHU2/IMG_2084+1.png?format=1500w",
      "The Hardware Club @ UC Davis": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJfcBwQXEFnb1XQhVFQiPRvjnKPuP119iCdg&s",
      "Women in Gaming at UC Davis": "https://campusrecreation.ucdavis.edu/sites/g/files/dgvnsk6556/files/styles/sf_landscape_16x9/public/media/images/51606528997_183fb3175b_c.jpg?h=827069f2&itok=ebRnUAG0",
      "Aggie Space initiative": "https://engineering.ucdavis.edu/sites/g/files/dgvnsk2151/files/styles/sf_slideshow_full/public/media/images/ASI%2015.jpg?h=7a8a8cdf&itok=ijUelDyM",
      "Biomedical Engineering Society (BES)": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTBS-FKjHdM5VMmhs3H1GuGSF0nRkyVjk8RaA&s",
      "IEEE (Institute of Electrical & Electronics Engineers)": "https://scontent-sjc3-1.xx.fbcdn.net/v/t39.30808-6/472462935_10171062722225193_2476418674163943373_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=127cfc&_nc_ohc=spYpFN3D3jkQ7kNvwEHKQqU&_nc_oc=AdnzPUNTgU1N6PKizqM__WEZYPxTOFlemDBLAHbOuy_CiyTXy--pt2t5CCiIzphd_Wt9G6mUlpIhzFtpqXYOuA1d&_nc_zt=23&_nc_ht=scontent-sjc3-1.xx&_nc_gid=Mxl2V4ZPLY6FokVfpGjt9Q&oh=00_AfRg4_o0_Aco6pot2LN-Sndx9QslE15-A68VRgs2xrPavQ&oe=6890EBFC",
      "Tau Beta Pi": "https://tbp.engineering.ucdavis.edu/files/2023/09/tbpwebsitepic2-300x151.jpg",
      "Swift Coding Club": "https://swiftcodingucd.org/homepageImages/image2.jpeg",
      "Finance and Investment Club": "https://images.squarespace-cdn.com/content/v1/6397cf97e73677755585fd57/38d3a78c-3610-4bb4-a887-d47957076b18/DSC05856-2.jpg",
      "IDSA at UC Davis": "https://media.licdn.com/dms/image/v2/D5622AQE41VQnrm7V5Q/feedshare-shrink_800/B56ZUaSY9RHsAk-/0/1739902783962?e=2147483647&v=beta&t=P7rsYp8XTjLCKAnd4VKCw3sv8vZy0epSPMFVG7nv6pU",
      "Project Catalyst": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTX6ceYLR1WlV1wXxB4fbO62rw_xoJRKtitw&s",
      "SACNAS": "https://lettersandsciencemag.ucdavis.edu/sites/g/files/dgvnsk15406/files/styles/sf_landscape_16x9/public/media/images/SACNAS-Group-Photo-2-Jace-Kuske.jpg?h=6eb229a4&itok=Lamhp2tc",
      "Science Says": "https://davissciencesays.ucdavis.edu/sites/g/files/dgvnsk6006/files/inline-images/EEOXdGEUwAMP_1Z.jpg",
      "Construction Management Club": "https://engineering.ucdavis.edu/sites/g/files/dgvnsk2151/files/styles/sf_landscape_4x3/public/media/images/IMG_9715.jpeg?h=640cca5b&itok=sKGtVvIx",
      "EBSA": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSFZcm6GJ8aKQJleiqz0gUSauYSYoYb9f1EUQ&s",
      "Materials Advantage Student Chapter": "https://mse.engineering.ucdavis.edu/sites/g/files/dgvnsk4451/files/media/images/MaterialsMagicShow2023.jpg",
      "American Institute of Chemical Engineers": "https://aiche.ucdavis.edu/sites/g/files/dgvnsk5996/files/styles/sf_image_banner/public/media/images/IMG_2282_1_80.jpeg?itok=9hOLB5ns"
    };

    let updated = 0;
    let skipped = 0;

    for (const [clubName, defaultHeroUrl] of Object.entries(heroImages)) {
      const club = await Club.findOne({ name: clubName });

      if (!club) {
        console.log(`❌ Club not found: ${clubName}`);
        continue;
      }

      // ONLY update if club doesn't have a custom hero image
      if (!club.hasCustomHeroImage && (!club.heroImageUrl || club.heroImageUrl.includes('default-club-hero'))) {
        await Club.findOneAndUpdate(
          { name: clubName },
          {
            heroImageUrl: defaultHeroUrl,
            hasCustomHeroImage: false // Mark as default, not custom
          }
        );
        updated++;
        console.log(`✅ Set default image for: ${clubName}`);
      } else {
        skipped++;
        console.log(`⏭️ Skipped (has custom image): ${clubName}`);
      }
    }

    res.json({
      success: true,
      message: `Set defaults for ${updated} clubs, protected ${skipped} custom images`,
      updated,
      skipped,
      total: Object.keys(heroImages).length
    });

  } catch (error) {
    console.error('❌ Error setting default images:', error);
    res.status(500).json({ error: 'Failed to set default images' });
  }
});
app.get('/api/clubs/image-management', requireAuth, async (req, res) => {
  try {
    const clubs = await Club.find({ isActive: true })
      .select('name logoUrl heroImageUrl hasCustomHeroImage')
      .sort({ name: 1 });

    const imageData = clubs.map(club => ({
      id: club._id,
      name: club.name,
      logoUrl: club.logoUrl,
      heroImageUrl: club.heroImageUrl,
      hasCustomHeroImage: club.hasCustomHeroImage || false,
      imageStatus: getImageStatus(club)
    }));

    res.json({
      clubs: imageData,
      summary: {
        total: clubs.length,
        withCustomHero: clubs.filter(c => c.hasCustomHeroImage).length,
        withDefaultHero: clubs.filter(c => c.heroImageUrl && !c.hasCustomHeroImage).length,
        withoutHero: clubs.filter(c => !c.heroImageUrl).length
      }
    });

  } catch (error) {
    console.error(' Error fetching image management data:', error);
    res.status(500).json({ error: 'Failed to fetch image management data' });
  }
});

function getImageStatus(club) {
  if (club.hasCustomHeroImage) return 'custom';
  if (club.heroImageUrl) return 'default';
  return 'none';
}
app.post('/api/clubs/migrate', requireAuth, async (req, res) => {
  try {
    const result = await Club.updateMany(
      { hasCustomHeroImage: { $exists: false } },
      { hasCustomHeroImage: false }
    );

    res.json({
      success: true,
      message: `Updated ${result.modifiedCount} clubs`,
      modifiedCount: result.modifiedCount
    });

  } catch (error) {
    console.error(' Migration error:', error);
    res.status(500).json({ error: 'Migration failed' });
  }
});

app.put('/api/clubs/bulk-update', requireAuth, async (req, res) => {
  try {
    const { updates } = req.body;

    if (!updates || !Array.isArray(updates)) {
      return res.status(400).json({
        error: 'updates array is required',
        example: {
          updates: [
            { clubName: "Club Name 1", heroImageUrl: "https://..." },
            { clubName: "Club Name 2", heroImageUrl: "https://..." }
          ]
        }
      });
    }

    console.log(` Bulk updating ${updates.length} clubs...`);

    const results = [];

    for (const update of updates) {
      try {
        const { clubName, heroImageUrl } = update;

        if (!clubName || !heroImageUrl) {
          results.push({
            clubName: clubName || 'Unknown',
            success: false,
            error: 'Missing clubName or heroImageUrl'
          });
          continue;
        }

        const club = await Club.findOneAndUpdate(
          { name: { $regex: new RegExp(`^${clubName}$`, 'i') } },
          {
            heroImageUrl: heroImageUrl,
            hasCustomHeroImage: true,
            updatedAt: new Date()
          },
          { new: true }
        );

        if (club) {
          results.push({
            clubName: club.name,
            success: true,
            heroImageUrl: club.heroImageUrl
          });
          console.log(` Updated: ${club.name}`);
        } else {
          results.push({
            clubName,
            success: false,
            error: 'Club not found'
          });
        }

      } catch (error) {
        results.push({
          clubName: update.clubName || 'Unknown',
          success: false,
          error: error.message
        });
      }
    }

    const successCount = results.filter(r => r.success).length;
    const failCount = results.filter(r => !r.success).length;

    console.log(` Bulk update complete: ${successCount} success, ${failCount} failed`);

    res.json({
      success: true,
      message: `Updated ${successCount}/${updates.length} clubs`,
      successCount,
      failCount,
      results
    });

  } catch (error) {
    console.error(' Bulk update error:', error);
    res.status(500).json({ error: 'Bulk update failed: ' + error.message });
  }
});
app.put('/api/test/bulk-update', async (req, res) => {
  try {
    const { updates } = req.body;

    if (!updates || !Array.isArray(updates)) {
      return res.status(400).json({
        error: 'updates array is required',
        example: {
          updates: [
            { clubName: "Club Name 1", heroImageUrl: "https://..." },
            { clubName: "Club Name 2", heroImageUrl: "https://..." }
          ]
        }
      });
    }

    console.log(` TEST: Bulk updating ${updates.length} clubs...`);

    const results = [];

    for (const update of updates) {
      try {
        const { clubName, heroImageUrl } = update;

        if (!clubName || !heroImageUrl) {
          results.push({
            clubName: clubName || 'Unknown',
            success: false,
            error: 'Missing clubName or heroImageUrl'
          });
          continue;
        }

        const club = await Club.findOneAndUpdate(
          { name: { $regex: new RegExp(`^${clubName}$`, 'i') } },
          {
            heroImageUrl: heroImageUrl,
            hasCustomHeroImage: true,
            updatedAt: new Date()
          },
          { new: true }
        );

        if (club) {
          results.push({
            clubName: club.name,
            success: true,
            heroImageUrl: club.heroImageUrl
          });
          console.log(` TEST: Updated ${club.name}`);
        } else {
          results.push({
            clubName,
            success: false,
            error: 'Club not found'
          });
          console.log(` TEST: Club not found: ${clubName}`);
        }

      } catch (error) {
        results.push({
          clubName: update.clubName || 'Unknown',
          success: false,
          error: error.message
        });
        console.error(` TEST: Error updating ${update.clubName}:`, error);
      }
    }

    const successCount = results.filter(r => r.success).length;
    const failCount = results.filter(r => !r.success).length;

    console.log(` TEST: Bulk update complete - ${successCount} success, ${failCount} failed`);

    res.json({
      success: true,
      message: `TEST: Updated ${successCount}/${updates.length} clubs`,
      successCount,
      failCount,
      results
    });

  } catch (error) {
    console.error(' TEST: Bulk update error:', error);
    res.status(500).json({ error: 'Test bulk update failed: ' + error.message });
  }
});
//  JOIN EVENT - Enhanced version
app.post('/api/events/:id/join', requireAuth, async (req, res) => {
  try {
    const eventId = req.params.id;
    const userId = req.session.userId;

    console.log(`User ${req.session.userEmail} attempting to join event ${eventId}`);

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    if (!event.isActive || event.status !== 'published') {
      return res.status(400).json({ error: 'Event is not available for registration' });
    }

    // Check if user already joined
    if (event.attendees.includes(userId)) {
      return res.status(409).json({
        error: 'You have already joined this event',
        isJoined: true
      });
    }

    // Check if event is full
    if (event.maxAttendees && event.attendees.length >= event.maxAttendees) {
      return res.status(400).json({
        error: 'Event is full',
        isFull: true,
        maxAttendees: event.maxAttendees,
        currentAttendees: event.attendees.length
      });
    }

    // Add user to attendees
    event.attendees.push(userId);
    await event.save();

    console.log(` User ${req.session.userEmail} successfully joined event: ${event.title}`);

    res.json({
      success: true,
      message: 'Successfully joined event',
      eventTitle: event.title,
      attendeeCount: event.attendees.length,
      eventId: eventId,
      isJoined: true
    });

  } catch (error) {
    console.error(' Error joining event:', error);
    res.status(500).json({ error: 'Failed to join event' });
  }
});


//  LEAVE EVENT
app.delete('/api/events/:id/join', requireAuth, async (req, res) => {
  try {
    const eventId = req.params.id;
    const userId = req.session.userId;

    console.log(` User ${req.session.userEmail} attempting to leave event ${eventId}`);

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Check if user is actually attending
    if (!event.attendees.includes(userId)) {
      return res.status(400).json({
        error: 'You are not registered for this event',
        isJoined: false
      });
    }

    // Remove user from attendees
    event.attendees = event.attendees.filter(id => !id.equals(userId));
    await event.save();

    console.log(` User ${req.session.userEmail} successfully left event: ${event.title}`);

    res.json({
      success: true,
      message: 'Successfully left event',
      eventTitle: event.title,
      attendeeCount: event.attendees.length,
      eventId: eventId,
      isJoined: false
    });

  } catch (error) {
    console.error(' Error leaving event:', error);
    res.status(500).json({ error: 'Failed to leave event' });
  }
});
app.get('/niche-landing', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/pages/niche-landing.html'));
});

//  ADD BOOKMARK - Save a club to user's bookmarks
app.post('/api/bookmarks', requireAuth, async (req, res) => {
  try {
    const { clubId } = req.body;

    // Validate input
    if (!clubId) {
      return res.status(400).json({ error: 'Club ID is required' });
    }

    console.log(` Adding bookmark: ${clubId} for user: ${req.session.userEmail}`);

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
    console.error(' Error adding bookmark:', error);
    res.status(500).json({ error: 'Failed to add bookmark' });
  }
});

//  REMOVE BOOKMARK - Remove a club from user's bookmarks
app.delete('/api/bookmarks/:clubId', requireAuth, async (req, res) => {
  try {
    const { clubId } = req.params;

    console.log(` Removing bookmark: ${clubId} for user: ${req.session.userEmail}`);

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
    console.error(' Error removing bookmark:', error);
    res.status(500).json({ error: 'Failed to remove bookmark' });
  }
});

//  CHECK BOOKMARK STATUS - Check if a specific club is bookmarked
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
    console.error(' Error checking bookmark:', error);
    res.status(500).json({ error: 'Failed to check bookmark status' });
  }
});

app.get('/api/events/:id/status', requireAuth, async (req, res) => {
  try {
    const eventId = req.params.id;
    const userId = req.session.userId;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const isJoined = event.attendees.includes(userId);
    const isFull = event.maxAttendees && event.attendees.length >= event.maxAttendees;

    res.json({
      eventId: eventId,
      isJoined: isJoined,
      isFull: isFull,
      attendeeCount: event.attendees.length,
      maxAttendees: event.maxAttendees,
      registrationRequired: event.registrationRequired || false,
      isActive: event.isActive,
      status: event.status
    });

  } catch (error) {
    console.error(' Error checking event status:', error);
    res.status(500).json({ error: 'Failed to check event status' });
  }
});

app.get('/api/events/stats', requireAuth, async (req, res) => {
  try {
    const now = new Date();

    // Get various statistics
    const [
      totalEvents,
      upcomingEvents,
      todayEvents,
      thisWeekEvents,
      totalAttendees
    ] = await Promise.all([
      Event.countDocuments({ isActive: true, status: 'published' }),
      Event.countDocuments({
        isActive: true,
        status: 'published',
        date: { $gte: now }
      }),
      Event.countDocuments({
        isActive: true,
        status: 'published',
        date: {
          $gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
          $lt: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
        }
      }),
      Event.countDocuments({
        isActive: true,
        status: 'published',
        date: {
          $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
          $lt: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
        }
      }),
      Event.aggregate([
        { $match: { isActive: true, status: 'published' } },
        { $group: { _id: null, total: { $sum: { $size: '$attendees' } } } }
      ])
    ]);

    res.json({
      totalEvents,
      upcomingEvents,
      todayEvents,
      thisWeekEvents,
      totalAttendees: totalAttendees[0]?.total || 0,
      generatedAt: new Date()
    });

  } catch (error) {
    console.error('💥 Error fetching event statistics:', error);
    res.status(500).json({ error: 'Failed to fetch event statistics' });
  }
});


//  USER DASHBOARD - Protected route for user profile and management
app.get('/dashboard', requireAuth, (req, res) => {
  console.log('Dashboard accessed by:', req.session.userEmail);
  res.sendFile(path.join(__dirname, '../frontend/pages/dashboard.html'));
});

//  GET ALL CLUBS - Replace static HTML cards
app.get('/api/clubs', async (req, res) => {
  try {
    const clubs = await Club.find({ isActive: true }).lean();

    // Custom sorting: #include first, then alphabetical
    const sortedClubs = clubs.sort((a, b) => {
      // #include always comes first
      if (a.name === '#include') return -1;
      if (b.name === '#include') return 1;

      // Then sort alphabetically (case-insensitive)
      return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
    });

    console.log(`📊 Serving ${sortedClubs.length} clubs (alphabetically sorted, #include first)`);
    res.json(sortedClubs);
  } catch (error) {
    console.error('❌ Error fetching clubs:', error);
    res.status(500).json({ error: 'Failed to fetch clubs' });
  }
});

//  SEARCH CLUBS - Database-powered search  
app.get('/api/clubs/search', async (req, res) => {
  try {
    const {
      q,           // Search query
      tags,        // Comma-separated tags
      category,    // Single category
      sortBy,      // Sort field: 'name', 'members', 'newest'
      sortOrder,   // 'asc' or 'desc'
      page,        // Page number (default 1)
      limit        // Results per page (default 10)
    } = req.query;

    console.log(' Advanced search request:', req.query);

    //  BUILD SEARCH PIPELINE
    let searchCriteria = { isActive: true };
    let sortCriteria = {};

    //  TEXT SEARCH - Search across multiple fields
    if (q && q.trim()) {
      searchCriteria.$or = [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { tags: { $in: [new RegExp(q, 'i')] } }
      ];
    }

    //  TAG FILTERING - Support multiple tags
    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim().toLowerCase());
      // Use $in for "OR" logic (club has ANY of these tags)
      searchCriteria.tags = { $in: tagArray };

      // For "AND" logic (club has ALL tags), use:
      // searchCriteria.tags = { $all: tagArray };
    }

    //  CATEGORY FILTERING
    if (category && category !== 'all') {
      searchCriteria.category = category;
    }

    //  SORTING LOGIC
    switch (sortBy) {
      case 'name':
        sortCriteria.name = sortOrder === 'desc' ? -1 : 1;
        break;
      case 'members':
        sortCriteria.memberCount = sortOrder === 'desc' ? -1 : 1;
        break;
      case 'newest':
        sortCriteria.createdAt = -1; // Always newest first
        break;
      default:
        sortCriteria.memberCount = -1; // Default: most popular first
    }

    //  PAGINATION SETUP
    const pageNum = parseInt(page) || 1;
    const pageLimit = parseInt(limit) || 10;
    const skip = (pageNum - 1) * pageLimit;

    //  EXECUTE SEARCH WITH PAGINATION
    const [clubs, totalCount] = await Promise.all([
      Club.find(searchCriteria)
        .sort(sortCriteria)
        .skip(skip)
        .limit(pageLimit)
        .lean(), // .lean() for better performance

      Club.countDocuments(searchCriteria) // Get total for pagination
    ]);

    //  CALCULATE PAGINATION INFO
    const totalPages = Math.ceil(totalCount / pageLimit);
    const hasNextPage = pageNum < totalPages;
    const hasPreviousPage = pageNum > 1;

    console.log(` Search found ${totalCount} clubs, returning page ${pageNum}/${totalPages}`);

    //  SEND COMPREHENSIVE RESPONSE
    res.json({
      clubs,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalCount,
        hasNextPage,
        hasPreviousPage,
        limit: pageLimit
      },
      searchInfo: {
        query: q || '',
        tags: tags ? tags.split(',') : [],
        category: category || 'all',
        sortBy: sortBy || 'members',
        sortOrder: sortOrder || 'desc'
      }
    });

  } catch (error) {
    console.error(' Search error:', error);
    res.status(500).json({
      error: 'Search failed',
      message: error.message
    });
  }
});

//  GET SEARCH METADATA - Categories, popular tags, etc.
app.get('/api/clubs/metadata', async (req, res) => {
  try {
    console.log(' Fetching club metadata...');

    const [categories, tagStats, totalClubs] = await Promise.all([
      // Get all unique categories
      Club.distinct('category'),

      // Get tag statistics (most popular tags)
      Club.aggregate([
        { $match: { isActive: true } },
        { $unwind: '$tags' },
        { $group: { _id: '$tags', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 20 } // Top 20 tags
      ]),

      // Get total active clubs
      Club.countDocuments({ isActive: true })
    ]);

    res.json({
      categories: categories.sort(),
      popularTags: tagStats.map(tag => ({
        name: tag._id,
        count: tag.count
      })),
      totalClubs,
      sortOptions: [
        { value: 'members', label: 'Most Popular' },
        { value: 'name', label: 'Alphabetical' },
        { value: 'newest', label: 'Newest First' }
      ]
    });

    console.log(` Metadata: ${categories.length} categories, ${tagStats.length} tags, ${totalClubs} clubs`);

  } catch (error) {
    console.error(' Metadata error:', error);
    res.status(500).json({ error: 'Failed to fetch metadata' });
  }
});

// =============================================================================
// ADD THESE ROUTES TO YOUR backend/app.js FILE
// =============================================================================
// Insert these routes after your existing club routes

//  CLUB DETAIL PAGE - Serve the club detail HTML
app.get('/club/:clubId', requireAuth, (req, res) => {
  console.log('Club detail page accessed for ID:', req.params.clubId);
  res.sendFile(path.join(__dirname, '../frontend/pages/club-detail.html'));
});

//  GET SINGLE CLUB DETAILS - API endpoint for club data
app.get('/api/clubs/:id', async (req, res) => {
  try {
    const clubId = req.params.id;
    console.log(` Fetching club details for ID: ${clubId}`);

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(clubId)) {
      return res.status(400).json({ error: 'Invalid club ID format' });
    }

    // Find the club by ID
    const club = await Club.findById(clubId);

    if (!club) {
      return res.status(404).json({ error: 'Club not found' });
    }

    // Check if club is active
    if (!club.isActive) {
      return res.status(404).json({ error: 'Club not available' });
    }

    console.log(` Club found: ${club.name}`);

    // Return club data
    res.json(club);

  } catch (error) {
    console.error(' Error fetching club details:', error);
    res.status(500).json({
      error: 'Failed to fetch club details',
      message: error.message
    });
  }
});

//  GET CLUB EVENTS - API endpoint for club events (placeholder for now)
app.get('/api/clubs/:id/events', async (req, res) => {
  try {
    const clubId = req.params.id;
    console.log(` Fetching events for club ID: ${clubId}`);

    // For now, return sample events
    // In the future, you could create an Events model and fetch real events
    const sampleEvents = [
      {
        id: 1,
        title: "AI Workshop: Getting Started with TensorFlow",
        date: "2025-12-15",
        time: "6:00 PM - 8:00 PM",
        location: "Kemper Hall 1131",
        description: "Learn the basics of machine learning with hands-on TensorFlow exercises.",
        registrationUrl: "#"
      },
      {
        id: 2,
        title: "Research Paper Discussion",
        date: "2025-12-22",
        time: "7:00 PM - 9:00 PM",
        location: "Virtual Meeting",
        description: "Deep dive into the latest research in computer vision and neural networks.",
        registrationUrl: "#"
      },
      {
        id: 3,
        title: "Industry Speaker: AI in Healthcare",
        date: "2025-12-29",
        time: "6:30 PM - 8:00 PM",
        location: "Sciences Lecture Hall",
        description: "Guest speaker from UCSF discusses real-world AI applications in medicine.",
        registrationUrl: "#"
      },
      {
        id: 4,
        title: "Project Showcase",
        date: "2026-01-05",
        time: "5:00 PM - 7:00 PM",
        location: "Engineering Building",
        description: "Members present their AI projects and get feedback from peers and faculty.",
        registrationUrl: "#"
      }
    ];

    res.json({
      clubId: clubId,
      events: sampleEvents,
      totalEvents: sampleEvents.length
    });

  } catch (error) {
    console.error(' Error fetching club events:', error);
    res.status(500).json({
      error: 'Failed to fetch club events',
      message: error.message
    });
  }
});
//last route

// =============================================================================
// UPDATED DASHBOARD API - Replace your existing /api/user/profile route
// =============================================================================

//  ENHANCED USER API - More detailed user information for dashboard
app.get('/api/user/profile', requireAuth, async (req, res) => {
  try {
    console.log(`📋 Fetching profile for user: ${req.session.userEmail}`);

    // Find user with all profile fields
    const user = await User.findById(req.session.userId)
      .select('-password -verificationToken -passwordResetToken')
      .populate('bookmarkedClubs')
      .populate('bookmarkedEvents');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    console.log(`✅ Profile loaded for: ${user.email}`);

    // Return comprehensive user data
    res.json({
      id: user._id,
      email: user.email,
      name: user.name || '',
      year: user.year || '',
      major: user.major || '',
      bio: user.bio || '',
      hobbies: user.hobbies || '',
      linkedinUrl: user.linkedinUrl || '',
      profilePictureUrl: user.profilePictureUrl || '',
      lookingFor: user.lookingFor || [],
      skills: user.skills || [],
      learningGoals: user.learningGoals || [],
      availability: user.availability || '',
      contactPreferences: user.contactPreferences || [],
      joinDate: user.createdAt,

      // Computed fields
      displayName: user.getDisplayName(),
      profileCompleteness: user.getProfileCompleteness(),

      // Bookmarks
      bookmarkedClubs: user.bookmarkedClubs || [],
      bookmarkedEvents: user.bookmarkedEvents || [],
      totalBookmarks: user.getBookmarkCount(),

      // Stats
      daysActive: Math.ceil((new Date() - user.createdAt) / (1000 * 60 * 60 * 24))
    });

  } catch (error) {
    console.error('💥 Error fetching profile:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// =============================================================================
// PROFILE UPDATE API ENDPOINT - Add this to your backend/app.js
// Place this after your existing /api/user/profile GET route
// =============================================================================

// UPDATE USER PROFILE - Enhanced version with new fields
app.put('/api/user/profile', requireAuth, async (req, res) => {
  try {
    const {
      name, year, major, bio, hobbies, linkedinUrl,
      lookingFor, skills, learningGoals, availability, contactPreferences
    } = req.body;
    const userId = req.session.userId;

    console.log(`📝 Updating profile for user: ${req.session.userEmail}`);
    console.log('📊 Profile data received:', req.body);

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Validate LinkedIn URL if provided
    if (linkedinUrl && linkedinUrl.trim()) {
      const linkedinRegex = /^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9\-]+\/?$/;
      if (!linkedinRegex.test(linkedinUrl.trim())) {
        return res.status(400).json({
          error: 'Please enter a valid LinkedIn profile URL (e.g., https://linkedin.com/in/yourname)'
        });
      }
    }

    // Update profile fields
    const profileData = {
      name: name?.trim() || '',
      year: year || '',
      major: major?.trim() || '',
      bio: bio?.trim() || '',
      hobbies: hobbies?.trim() || '',
      linkedinUrl: linkedinUrl?.trim() || '',
      lookingFor: Array.isArray(lookingFor) ? lookingFor : [],
      skills: Array.isArray(skills) ? skills : [],
      learningGoals: Array.isArray(learningGoals) ? learningGoals : [],
      availability: availability?.trim() || '',
      contactPreferences: Array.isArray(contactPreferences) ? contactPreferences : []
    };

    // Update the user profile using the model method
    const updatedUser = await user.updateProfile(profileData);

    console.log(`✅ Profile updated successfully for: ${user.email}`);

    // Return updated user data
    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: updatedUser._id,
        email: updatedUser.email,
        name: updatedUser.name,
        year: updatedUser.year,
        major: updatedUser.major,
        bio: updatedUser.bio,
        hobbies: updatedUser.hobbies,
        linkedinUrl: updatedUser.linkedinUrl,
        profilePictureUrl: updatedUser.profilePictureUrl,
        lookingFor: updatedUser.lookingFor,
        skills: updatedUser.skills,
        learningGoals: updatedUser.learningGoals,
        availability: updatedUser.availability,
        contactPreferences: updatedUser.contactPreferences,
        displayName: updatedUser.getDisplayName(),
        profileCompleteness: updatedUser.getProfileCompleteness()
      }
    });

  } catch (error) {
    console.error('💥 Error updating profile:', error);

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errorMessages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        error: 'Validation failed',
        details: errorMessages
      });
    }

    res.status(500).json({ error: 'Failed to update profile' });
  }
});

app.post('/api/user/profile-picture', requireAuth, async (req, res) => {
  try {
    const { imageData } = req.body; // Base64 image data
    const userId = req.session.userId;

    console.log(`📷 Updating profile picture for user: ${req.session.userEmail}`);

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // For now, store base64 data directly (in production, upload to cloud storage)
    user.profilePictureUrl = imageData;
    await user.save();

    console.log(`✅ Profile picture updated for: ${user.email}`);

    res.json({
      success: true,
      message: 'Profile picture updated successfully',
      profilePictureUrl: user.profilePictureUrl
    });

  } catch (error) {
    console.error('💥 Error updating profile picture:', error);
    res.status(500).json({ error: 'Failed to update profile picture' });
  }
});

app.get('/api/user/matches', requireAuth, async (req, res) => {
  try {
    const userId = req.session.userId;
    const { limit = 10, lookingFor, major, year, skills } = req.query;

    console.log(`🔍 Finding matches for user: ${req.session.userEmail}`);

    // Build match criteria
    let matchCriteria = {
      _id: { $ne: userId }, // Exclude current user
      isVerified: true
    };

    // Filter by what they're looking for
    if (lookingFor) {
      matchCriteria.lookingFor = { $in: [lookingFor] };
    }

    // Filter by major
    if (major) {
      matchCriteria.major = { $regex: major, $options: 'i' };
    }

    // Filter by year
    if (year) {
      matchCriteria.year = year;
    }

    // Filter by skills
    if (skills) {
      matchCriteria.skills = { $in: [skills] };
    }

    // Find potential matches
    const matches = await User.find(matchCriteria)
      .select('name year major bio hobbies skills lookingFor profilePictureUrl')
      .limit(parseInt(limit))
      .lean();

    // Calculate match scores (simple algorithm)
    const currentUser = await User.findById(userId);
    const scoredMatches = matches.map(match => {
      let score = 0;

      // Same major = +30 points
      if (match.major && currentUser.major &&
        match.major.toLowerCase() === currentUser.major.toLowerCase()) {
        score += 30;
      }

      // Same year = +20 points
      if (match.year === currentUser.year) {
        score += 20;
      }

      // Common skills = +10 points each
      if (match.skills && currentUser.skills) {
        const commonSkills = match.skills.filter(skill =>
          currentUser.skills.includes(skill)
        );
        score += commonSkills.length * 10;
      }

      // Common interests in hobbies = +5 points each
      if (match.hobbies && currentUser.hobbies) {
        const matchHobbies = match.hobbies.toLowerCase().split(',').map(h => h.trim());
        const userHobbies = currentUser.hobbies.toLowerCase().split(',').map(h => h.trim());
        const commonHobbies = matchHobbies.filter(hobby =>
          userHobbies.some(userHobby => userHobby.includes(hobby) || hobby.includes(userHobby))
        );
        score += commonHobbies.length * 5;
      }

      return {
        ...match,
        matchScore: score,
        displayName: match.name || match.email?.split('@')[0] || 'UC Davis Student'
      };
    });

    // Sort by match score
    scoredMatches.sort((a, b) => b.matchScore - a.matchScore);

    console.log(`✅ Found ${scoredMatches.length} potential matches`);

    res.json({
      matches: scoredMatches,
      totalMatches: scoredMatches.length
    });

  } catch (error) {
    console.error('💥 Error finding matches:', error);
    res.status(500).json({ error: 'Failed to find matches' });
  }
});

// =============================================================================
// API ROUTES - For frontend JavaScript to check authentication status
// =============================================================================

//  USER STATUS API - Let frontend know if someone is logged in

// REPLACE your current /api/user endpoint with this:

app.get('/api/user', async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      // Fetch the full user data including profilePictureUrl
      const user = await User.findById(req.user._id);

      res.json({
        isLoggedIn: true,
        email: req.user.email,
        name: req.user.name,
        userId: req.user._id,
        isVerified: req.user.isVerified,
        profilePictureUrl: user?.profilePictureUrl || null, // ✅ ADD THIS LINE
        displayName: user?.name || req.user.name || req.user.email.split('@')[0]
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Fallback response if database query fails
      res.json({
        isLoggedIn: true,
        email: req.user.email,
        name: req.user.name,
        userId: req.user._id,
        isVerified: req.user.isVerified,
        profilePictureUrl: null
      });
    }
  } else {
    res.json({ isLoggedIn: false });
  }
});

// =============================================================================
// NICHE QUIZ ROUTES - Add these AFTER app creation
// =============================================================================

//  NICHE QUIZ PAGE
app.get('/niche-quiz', requireAuth, (req, res) => {
  console.log('Niche quiz accessed by:', req.session.userEmail);
  res.sendFile(path.join(__dirname, '../frontend/pages/niche-quiz.html'));
});

//  GET QUIZ INTRO - Show available levels and preview
app.get('/api/quiz/intro', async (req, res) => {
  try {
    const levels = [
      {
        level: 'beginner',
        title: 'Tech Explorer',
        description: 'New to tech? Discover what interests you most.',
        duration: '5-7 minutes',
        questionCount: 8,
        icon: '🌱'
      },
      {
        level: 'intermediate',
        title: 'Tech Curious',
        description: 'Some tech experience? Find your ideal specialization.',
        duration: '8-10 minutes',
        questionCount: 6,
        icon: '🚀'
      },
      {
        level: 'advanced',
        title: 'Tech Insider',
        description: 'Experienced in tech? Optimize your career path.',
        duration: '10-12 minutes',
        questionCount: 6,
        icon: '⚡'
      }
    ];

    // Get sample career fields for preview
    const sampleCareers = await CareerField.find({ isActive: true })
      .select('name category')
      .limit(6);

    res.json({
      levels,
      sampleCareers,
      totalCareers: await CareerField.countDocuments({ isActive: true })
    });

  } catch (error) {
    console.error(' Quiz intro error:', error);
    res.status(500).json({ error: 'Failed to load quiz introduction' });
  }
});

//  GET QUIZ QUESTIONS - Load questions for specific level
app.get('/api/quiz/questions/:level', async (req, res) => {
  try {
    const { level } = req.params;

    if (!['beginner', 'intermediate', 'advanced'].includes(level)) {
      return res.status(400).json({ error: 'Invalid quiz level' });
    }

    console.log(` Loading ${level} quiz questions...`);

    const questions = await QuizQuestion.find({
      questionLevel: level,
      isActive: true
    }).sort({ order: 1, _id: 1 });

    if (questions.length === 0) {
      return res.status(404).json({ error: 'No questions found for this level' });
    }

    // Format questions for frontend
    const formattedQuestions = questions.map((q, index) => ({
      id: q._id,
      questionNumber: index + 1,
      questionText: q.questionText,
      questionType: q.questionType,
      category: q.category,
      options: q.options.map((option, optIndex) => ({
        id: optIndex,
        text: option.text,
        description: option.description
        // Don't send weights to frontend for security
      })),
      totalQuestions: questions.length
    }));

    res.json({
      level,
      questions: formattedQuestions,
      metadata: {
        totalQuestions: questions.length,
        estimatedTime: `${Math.ceil(questions.length * 0.75)}-${Math.ceil(questions.length * 1)} minutes`
      }
    });

  } catch (error) {
    console.error(' Quiz questions error:', error);
    res.status(500).json({ error: 'Failed to load quiz questions' });
  }
});

// =============================================================================
// ENHANCED NICHE QUIZ BACKEND ROUTES - Add to your backend/app.js
// =============================================================================

//  SUBMIT QUIZ AND CALCULATE RESULTS
// =============================================================================
// QUIZ SCORING SYSTEM - Add to backend/app.js
// =============================================================================
// Replace your existing /api/quiz/submit route with this enhanced version

//  ENHANCED QUIZ SUBMISSION WITH REAL SCORING
//  SUBMIT QUIZ AND CALCULATE DYNAMIC RESULTS
app.post('/api/quiz/submit', requireAuth, async (req, res) => {
  try {
    const { level, answers, completionTime } = req.body;
    const userId = req.session.userId;

    console.log(`📊 Processing quiz submission for user: ${req.session.userEmail}`);
    console.log(`📝 Received ${answers.length} answers for ${level} level`);

    // Validate input
    if (!level || !answers || !Array.isArray(answers)) {
      return res.status(400).json({ error: 'Invalid submission data' });
    }

    // Load all career fields and questions
    const [careerFields, questions] = await Promise.all([
      CareerField.find({ isActive: true }),
      QuizQuestion.find({ questionLevel: level, isActive: true }).sort({ order: 1 })
    ]);

    if (careerFields.length === 0) {
      throw new Error('No career fields found');
    }

    console.log(`🎯 Loaded ${careerFields.length} career fields`);
    console.log(`❓ Loaded ${questions.length} questions`);

    // Calculate user skill scores from answers
    const userSkillScores = calculateUserSkillScores(answers, questions);
    console.log('🧮 Calculated user skill scores:', userSkillScores);

    // Calculate matches with all career fields
    const careerMatches = careerFields.map(field => {
      const matchPercentage = calculateCareerMatch(userSkillScores, field.skillWeights);
      const confidence = getConfidenceLevel(matchPercentage);

      return {
        field: field._id,
        career: field.name,
        category: field.category,
        percentage: matchPercentage,
        confidence: confidence,
        description: field.description,
        skillWeights: field.skillWeights,
        progression: field.progression,
        marketData: field.marketData,
        relatedClubs: field.relatedClubs
      };
    });

    // Sort by match percentage
    careerMatches.sort((a, b) => b.percentage - a.percentage);

    const topMatch = careerMatches[0];
    console.log(`🥇 Top match: ${topMatch.career} (${topMatch.percentage}%)`);

    // Generate next steps for top match
    const nextSteps = generateNextSteps(topMatch, userSkillScores);

    // Save result to database if user is logged in
    if (userId) {
      try {
        const quizResult = new QuizResult({
          user: userId,
          quizLevel: level,
          answers: answers,
          skillScores: userSkillScores,
          careerMatches: careerMatches.slice(0, 10).map(match => ({
            field: match.field,
            matchPercentage: match.percentage,
            confidence: match.confidence
          })),
          topMatch: {
            careerName: topMatch.career,
            percentage: topMatch.percentage,
            nextSteps: nextSteps
          },
          completionTime: completionTime
        });

        await quizResult.save();
        console.log('💾 Quiz result saved to database');
      } catch (saveError) {
        console.error('⚠️ Failed to save quiz result:', saveError);
        // Continue without saving - don't fail the entire request
      }
    }

    // Format response with dynamic results
    const response = {
      success: true,
      results: {
        topMatch: {
          career: topMatch.career,
          description: topMatch.description,
          percentage: topMatch.percentage,
          category: topMatch.category,
          confidence: topMatch.confidence,
          careerProgression: topMatch.progression || [],
          marketData: topMatch.marketData || {},
          nextSteps: nextSteps,
          recommendedClubs: [] // TODO: Populate with actual clubs
        },
        allMatches: careerMatches.slice(0, 8).map(match => ({
          career: match.career,
          category: match.category,
          percentage: match.percentage,
          confidence: match.confidence
        })),
        skillBreakdown: userSkillScores,
        level: level,
        completionTime: completionTime
      }
    };

    console.log('🎉 Sending dynamic quiz results');
    res.json(response);

  } catch (error) {
    console.error('💥 Error processing quiz submission:', error);
    res.status(500).json({
      error: 'Failed to process quiz submission',
      details: error.message
    });
  }
});

// =============================================================================
// QUIZ CALCULATION FUNCTIONS
// =============================================================================

function calculateUserSkillScores(answers, questions) {
  console.log('🔧 Calculating user skill scores with HIGH DIFFERENTIATION...');

  const skillTotals = {
    technical: 0, creative: 0, social: 0, leadership: 0,
    research: 0, pace: 0, risk: 0, structure: 0
  };

  const skillWeights = {
    technical: 0, creative: 0, social: 0, leadership: 0,
    research: 0, pace: 0, risk: 0, structure: 0
  };

  answers.forEach((answer, answerIndex) => {
    const question = questions[answerIndex];
    if (!question) {
      console.warn(`⚠️ Question ${answerIndex} not found`);
      return;
    }

    const questionWeight = question.difficultyWeight || 1;

    // 🚀 MUCH MORE AGGRESSIVE preference scoring
    // Top choice gets 10x weight, 2nd gets 3x, 3rd gets 1x, last gets 0.1x
    const preferenceMultipliers = [10, 3, 1, 0.1];

    answer.ranking.forEach((optionIndex, rankPosition) => {
      const option = question.options[optionIndex];
      if (!option || !option.weights) return;

      // Apply aggressive preference multiplier
      const preferenceScore = preferenceMultipliers[rankPosition] || 0.1;
      const finalWeight = preferenceScore * questionWeight;

      Object.keys(option.weights).forEach(skill => {
        if (skillTotals.hasOwnProperty(skill)) {
          skillTotals[skill] += option.weights[skill] * finalWeight;
          skillWeights[skill] += finalWeight;
        }
      });
    });
  });

  // Calculate final scores with better spread
  const userSkillScores = {};
  Object.keys(skillTotals).forEach(skill => {
    if (skillWeights[skill] > 0) {
      let rawScore = skillTotals[skill] / skillWeights[skill];

      // Apply amplification to create more spread
      rawScore = Math.max(1, Math.min(10, rawScore));
      userSkillScores[skill] = Math.round(rawScore * 10) / 10;
    } else {
      userSkillScores[skill] = 5.0;
    }
  });

  console.log('✅ HIGH DIFFERENTIATION user scores:', userSkillScores);
  return userSkillScores;
}

function calculateCareerMatch(userScores, careerWeights) {
  let totalSimilarity = 0;
  let totalWeight = 0;

  Object.keys(userScores).forEach(skill => {
    if (careerWeights[skill] !== undefined) {
      // Calculate similarity (10 - absolute difference)
      const difference = Math.abs(userScores[skill] - careerWeights[skill]);
      const similarity = Math.max(0, 10 - difference);

      // Weight by career field's importance for this skill
      const weight = careerWeights[skill] / 10; // Normalize career weight

      totalSimilarity += similarity * weight;
      totalWeight += weight;
    }
  });

  // Calculate final percentage (0-100%)
  const matchScore = totalWeight > 0 ? (totalSimilarity / totalWeight) : 0;
  return Math.max(10, Math.min(100, Math.round(matchScore * 10)));
}

function getConfidenceLevel(percentage) {
  if (percentage >= 80) return 'High';
  if (percentage >= 60) return 'Medium';
  return 'Low';
}

function generateNextSteps(topMatch, userSkillScores) {
  const steps = [];

  // Skill-based recommendations
  const lowSkills = Object.entries(userSkillScores)
    .filter(([skill, score]) => score < topMatch.skillWeights[skill] - 2)
    .sort(([, a], [, b]) => a - b)
    .slice(0, 2);

  lowSkills.forEach(([skill, score]) => {
    switch (skill) {
      case 'technical':
        steps.push('Build technical skills through coding bootcamps or online courses');
        break;
      case 'creative':
        steps.push('Develop creative problem-solving through design projects');
        break;
      case 'social':
        steps.push('Improve communication skills by joining clubs and networking events');
        break;
      case 'leadership':
        steps.push('Gain leadership experience through project management or team roles');
        break;
      case 'research':
        steps.push('Strengthen research abilities through academic projects or internships');
        break;
    }
  });

  // Career-specific recommendations
  if (topMatch.progression && topMatch.progression.length > 0) {
    const entryLevel = topMatch.progression.find(p => p.level === 'Entry') || topMatch.progression[0];
    if (entryLevel.roles) {
      steps.push(`Look for ${entryLevel.roles[0]} positions or internships`);
    }
  }

  // UC Davis specific
  steps.push('Connect with UC Davis career services for industry guidance');
  steps.push('Join relevant student organizations and tech clubs');

  return steps.slice(0, 4); // Return top 4 recommendations
}

// Helper function for fallback results
function getFallbackResults() {
  return {
    topMatch: {
      career: "Software Engineering",
      description: "Build software systems and applications that solve real-world problems.",
      percentage: 78,
      category: "Engineering",
      careerProgression: [
        {
          level: "Entry",
          roles: ["Junior Developer", "Software Engineer I"],
          timeline: "0-2 years",
          salary: { min: 85, max: 110 }
        },
        {
          level: "Mid",
          roles: ["Software Engineer II", "Senior Developer"],
          timeline: "2-5 years",
          salary: { min: 110, max: 150 }
        },
        {
          level: "Senior",
          roles: ["Staff Engineer", "Principal Engineer"],
          timeline: "5+ years",
          salary: { min: 150, max: 220 }
        }
      ],
      marketData: {
        jobGrowthRate: "+22% (2022-2032)",
        annualOpenings: 189200,
        workLifeBalance: "7.5/10",
        avgSalary: "$110k - $180k"
      },
      nextSteps: [
        "Master fundamental programming concepts",
        "Build 3-5 portfolio projects",
        "Join UC Davis programming clubs like #include",
        "Apply for software engineering internships"
      ],
      recommendedClubs: []
    },
    allMatches: [
      { career: "Software Engineering", category: "Engineering", percentage: 78 },
      { career: "Data Science", category: "Data", percentage: 71 },
      { career: "Product Management", category: "Product", percentage: 68 },
      { career: "UX Design", category: "Design", percentage: 64 }
    ],
    skillBreakdown: {
      technical: 8.2,
      creative: 6.8,
      social: 6.1,
      leadership: 5.9,
      research: 7.1,
      pace: 7.4,
      risk: 6.2,
      structure: 7.8
    }
  };
}

// =============================================================================
// SCORING ALGORITHM FUNCTIONS
// =============================================================================

function calculateUserSkillProfile(answers, questions) {
  console.log(' Calculating user skill profile...');

  // Initialize skill scores
  const skillScores = {
    technical: 0,
    creative: 0,
    social: 0,
    leadership: 0,
    research: 0,
    pace: 0,
    risk: 0,
    structure: 0
  };

  let totalWeight = 0;

  // Process each answer
  answers.forEach((answer, answerIndex) => {
    const question = questions[answerIndex];
    if (!question) {
      console.warn(` No question found for answer index ${answerIndex}`);
      return;
    }

    console.log(` Processing answer for question: "${question.questionText}"`);

    // Get the user's ranking (array of option indices in order of preference)
    const userRanking = answer.ranking;

    // Calculate weighted scores based on ranking position
    userRanking.forEach((optionIndex, rankPosition) => {
      const option = question.options[optionIndex];
      if (!option || !option.weights) {
        console.warn(` Invalid option or weights for option index ${optionIndex}`);
        return;
      }

      // Higher preference = higher weight (invert rank position)
      // Rank 0 (most preferred) gets highest weight, last rank gets lowest
      const positionWeight = (userRanking.length - rankPosition) / userRanking.length;

      // Question difficulty weight (from schema)
      const questionWeight = question.difficultyWeight || 1;

      // Final weight for this option
      const finalWeight = positionWeight * questionWeight;

      // Add weighted scores to user profile
      Object.keys(option.weights).forEach(skill => {
        if (skillScores.hasOwnProperty(skill)) {
          skillScores[skill] += option.weights[skill] * finalWeight;
          totalWeight += finalWeight;
        }
      });
    });
  });

  // Normalize scores to 1-10 scale
  Object.keys(skillScores).forEach(skill => {
    skillScores[skill] = Math.max(1, Math.min(10,
      (skillScores[skill] / (totalWeight / Object.keys(skillScores).length)) * 5 + 5
    ));
    skillScores[skill] = Math.round(skillScores[skill] * 10) / 10; // Round to 1 decimal
  });

  return skillScores;
}

function calculateCareerMatches(userSkillProfile, careerFields) {
  console.log(' Calculating career matches...');

  const matches = careerFields.map(career => {
    let totalMatch = 0;
    let totalWeight = 0;

    // Calculate similarity between user profile and career requirements
    Object.keys(userSkillProfile).forEach(skill => {
      if (career.skillWeights && career.skillWeights[skill] !== undefined) {
        const userScore = userSkillProfile[skill];
        const careerRequirement = career.skillWeights[skill];

        // Calculate similarity (closer scores = higher match)
        const difference = Math.abs(userScore - careerRequirement);
        const similarity = Math.max(0, 10 - difference); // 0-10 scale

        // Weight by career requirement importance
        const weight = careerRequirement;

        totalMatch += similarity * weight;
        totalWeight += weight;
      }
    });

    // Calculate final percentage
    const percentage = totalWeight > 0 ?
      Math.round((totalMatch / totalWeight) * 10) : 50;

    return {
      career: career,
      percentage: Math.max(30, Math.min(100, percentage)), // Ensure 30-100% range
      confidence: getConfidenceLevel(percentage)
    };
  });

  // Sort by percentage (highest first)
  return matches.sort((a, b) => b.percentage - a.percentage);
}

function generatePersonalizedNextSteps(career, userSkillProfile, level) {
  const steps = [];

  // Analyze user's weakest skills relative to career requirements
  const skillGaps = [];
  if (career.skillWeights) {
    Object.keys(career.skillWeights).forEach(skill => {
      const userScore = userSkillProfile[skill];
      const careerNeed = career.skillWeights[skill];
      const gap = careerNeed - userScore;

      if (gap > 1) { // Significant gap
        skillGaps.push({ skill, gap, careerNeed });
      }
    });
  }

  // Sort by largest gaps first
  skillGaps.sort((a, b) => b.gap - a.gap);

  // Generate specific recommendations based on gaps
  skillGaps.slice(0, 2).forEach(gap => {
    switch (gap.skill) {
      case 'technical':
        steps.push(`Strengthen technical skills through coding bootcamps or online courses`);
        break;
      case 'creative':
        steps.push(`Develop creative problem-solving through design thinking workshops`);
        break;
      case 'social':
        steps.push(`Build communication skills through presentation practice and team projects`);
        break;
      case 'leadership':
        steps.push(`Gain leadership experience through club officer positions or project management`);
        break;
      case 'research':
        steps.push(`Enhance research skills by joining faculty research projects or academic clubs`);
        break;
    }
  });

  // Add level-specific recommendations
  if (level === 'beginner') {
    steps.push(`Explore ${career.name} through introductory courses and informational interviews`);
    steps.push(`Join relevant UC Davis clubs to build experience and network`);
  } else if (level === 'intermediate') {
    steps.push(`Build a portfolio showcasing your ${career.name} skills`);
    steps.push(`Seek internships or part-time opportunities in ${career.name}`);
  } else if (level === 'advanced') {
    steps.push(`Pursue advanced certifications or specializations in ${career.name}`);
    steps.push(`Network with industry professionals and consider mentorship opportunities`);
  }

  // Always include UC Davis specific step
  steps.push(`Connect with UC Davis Career Center for ${career.name} guidance`);

  return steps.slice(0, 4); // Return top 4 steps
}

async function getRecommendedClubs(relatedClubIds) {
  if (!relatedClubIds || relatedClubIds.length === 0) {
    // Get some general tech clubs as fallback
    return await Club.find({ isActive: true })
      .sort({ memberCount: -1 })
      .limit(3)
      .lean();
  }

  try {
    const clubs = await Club.find({
      _id: { $in: relatedClubIds },
      isActive: true
    }).limit(3).lean();

    return clubs;
  } catch (error) {
    console.error('Error fetching recommended clubs:', error);
    return [];
  }
}

function getConfidenceLevel(percentage) {
  if (percentage >= 80) return 'High';
  if (percentage >= 65) return 'Medium';
  return 'Low';
}

// =============================================================================
// FALLBACK DATA FUNCTIONS
// =============================================================================

function getFallbackResults() {
  return {
    topMatch: {
      career: "Web Development",
      description: "Build responsive websites and web applications using modern frameworks and technologies.",
      percentage: 75,
      category: "Engineering",
      careerProgression: getDefaultProgression("Web Development"),
      marketData: getDefaultMarketData("Web Development"),
      nextSteps: [
        "Master JavaScript fundamentals",
        "Build a portfolio with 3+ projects",
        "Join UC Davis coding clubs",
        "Apply for frontend development internships"
      ],
      recommendedClubs: []
    },
    allMatches: [
      { career: "Web Development", category: "Engineering", percentage: 75 },
      { career: "Data Science", category: "Data", percentage: 68 },
      { career: "UX/UI Design", category: "Design", percentage: 62 },
      { career: "Product Management", category: "Product", percentage: 58 }
    ],
    skillBreakdown: {
      technical: 7.2,
      creative: 6.8,
      social: 6.1,
      leadership: 5.4,
      research: 6.7,
      pace: 7.5,
      risk: 6.0,
      structure: 6.3
    }
  };
}

function getDefaultProgression(careerName) {
  const progressions = {
    "Web Development": [
      {
        level: "Entry",
        roles: ["Junior Frontend Developer", "Web Developer"],
        timeline: "0-2 years",
        salary: { min: 65, max: 85 }
      },
      {
        level: "Mid",
        roles: ["Frontend Developer", "Full-Stack Developer"],
        timeline: "2-5 years",
        salary: { min: 85, max: 120 }
      },
      {
        level: "Senior",
        roles: ["Senior Developer", "Lead Engineer"],
        timeline: "5+ years",
        salary: { min: 120, max: 160 }
      }
    ],
    "Data Science": [
      {
        level: "Entry",
        roles: ["Data Analyst", "Junior Data Scientist"],
        timeline: "0-2 years",
        salary: { min: 70, max: 95 }
      },
      {
        level: "Mid",
        roles: ["Data Scientist", "ML Engineer"],
        timeline: "2-5 years",
        salary: { min: 95, max: 140 }
      },
      {
        level: "Senior",
        roles: ["Senior Data Scientist", "Data Science Manager"],
        timeline: "5+ years",
        salary: { min: 140, max: 200 }
      }
    ]
  };

  return progressions[careerName] || progressions["Web Development"];
}

function getDefaultMarketData(careerName) {
  const marketData = {
    "Web Development": {
      jobGrowthRate: "+13% (2021-2031)",
      annualOpenings: 28900,
      workLifeBalance: "7.5/10",
      avgSalary: "$85k - $140k"
    },
    "Data Science": {
      jobGrowthRate: "+22% (2021-2031)",
      annualOpenings: 13500,
      workLifeBalance: "7.8/10",
      avgSalary: "$95k - $165k"
    },
    "UX/UI Design": {
      jobGrowthRate: "+13% (2021-2031)",
      annualOpenings: 5200,
      workLifeBalance: "7.2/10",
      avgSalary: "$80k - $130k"
    }
  };

  return marketData[careerName] || marketData["Web Development"];
}

// =============================================================================
// GET USER'S QUIZ HISTORY
// =============================================================================

app.get('/api/quiz/results', requireAuth, async (req, res) => {
  try {
    const { limit = 5, recent = 'true' } = req.query;
    console.log(`🧠 Fetching quiz results for user: ${req.session.userEmail}, limit: ${limit}`);

    let query = { user: req.session.userId };

    const results = await QuizResult.find(query)
      .populate('careerMatches.field') // If you have this reference
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .lean();

    console.log(`✅ Found ${results.length} quiz results`);
    res.json(results); // Return array directly, not wrapped in object

  } catch (error) {
    console.error('💥 Error fetching quiz results:', error);
    res.status(500).json({ error: 'Failed to fetch quiz results' });
  }
});
// =============================================================================
//Email Verification
// =============================================================================
const { requireAuth: requireAuthentication, requireVerification } = require('../backend/authMiddleware');





// Add this route for testing
app.get('/api/test/db', async (req, res) => {
  try {
    const User = require('./models/User');
    const userCount = await User.countDocuments();
    res.json({
      database: 'connected',
      userCount: userCount,
      mongoUri: process.env.MONGO_URI ? 'set' : 'missing'
    });
  } catch (error) {
    res.json({
      database: 'failed',
      error: error.message
    });
  }
});
// =============================================================================
// START SERVER
// =============================================================================


// 🧪 SIMPLE TEST ROUTE - Add this right before app.listen
app.get('/api/test/hello', (req, res) => {
  res.json({ message: 'Hello! Routes are working!' });
});

app.get('/api/test/bulk-update', (req, res) => {
  res.json({
    message: 'Bulk update route exists!',
    note: 'Use PUT method with updates array to actually update clubs'
  });
});

// =============================================================================
// START SERVER
// =============================================================================
app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Cownect server running at port ${port}`);
  console.log(`🌍 Environment: ${isProduction ? 'Production' : 'Development'}`);
  console.log(`📊 Database: MongoDB Atlas`);
  console.log(`🔐 Authentication: bcrypt + sessions`);
  console.log(`🎯 Quiz system: Ready!`);
});
