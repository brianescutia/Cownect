require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');

// Create Express app
const app = express();
const port = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

// CRITICAL: Set trust proxy IMMEDIATELY after creating app
app.set('trust proxy', 1);
app.enable('trust proxy');

// Load your models
const User = require('../backend/models/User');
const Club = require('./models/Club');
const { CareerField, QuizQuestion, QuizResult } = require('./models/nicheQuizModels');
const Event = require('./models/eventModel');

// NOW load Google Auth AFTER trust proxy is set
require('./googleAuth');

// Load services
const EnhancedAICareerAnalyzer = require('./services/enhancedThreeLevelAIAnalyzer');
const enhancedAnalyzer = new EnhancedAICareerAnalyzer();


// =============================================================================
// MIDDLEWARE SETUP
// =============================================================================

// Basic Express Middleware
app.use(express.static(path.join(__dirname, '../frontend')));  // Serve static files
app.use(express.urlencoded({ extended: true }));               // Parse form data
app.use('/', express.static(path.join(__dirname, '..', 'frontend')));

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

const redirectLoggedInUsers = (req, res, next) => {
  if (req.session && req.session.userId) {
    // If user is logged in, redirect them to dashboard/tech-clubs
    res.redirect('/tech-clubs');
  } else {
    // If user is not logged in, show them the landing page
    next();
  }
};

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

app.get('/', redirectLoggedInUsers, (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/pages/index.html'));
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
    const { logoUrl, heroImageUrl, heroImagePosition } = req.body;

    const updateData = {};
    if (logoUrl) updateData.logoUrl = logoUrl;
    if (heroImageUrl) updateData.heroImageUrl = heroImageUrl;
    if (heroImagePosition) updateData.heroImagePosition = heroImagePosition;

    const club = await Club.findByIdAndUpdate(
      clubId,
      updateData,
      { new: true }
    );

    if (!club) {
      return res.status(404).json({ error: 'Club not found' });
    }

    console.log(`✅ Updated images for club: ${club.name}`);
    res.json({ message: 'Club images updated successfully', club });

  } catch (error) {
    console.error('💥 Error updating club images:', error);
    res.status(500).json({ error: 'Failed to update club images' });
  }
});
// 🖼️ GIVE EACH CLUB A UNIQUE HERO IMAGE
app.get('/api/set-hero-images', requireAuth, async (req, res) => {
  try {
    console.log('🎨 Setting unique hero images for all clubs...');

    // Unique hero images for each club
    const heroImages = {
      "#include": {
        url: "https://includedavis.com/_next/image?url=%2Fabout%2Fimages%2FdescPic.jpg&w=3840&q=75",
        position: "center center"
      },
      "Davis Filmmaking Society": {
        url: "https://scontent-sjc3-1.xx.fbcdn.net/v/t39.30808-6/484339313_9598920923463421_8129779707304310584_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=3a1ebe&_nc_ohc=HKWUi9c4fYUQ7kNvwH7NXcU&_nc_oc=AdnaVLTjTam22xwP-_5I7fBdhvRowq3fOEoHxXdZaO9Sqyyy8nCvDJ3Wwl4aDkh4wXu0F594PzqNqaspGJXy0XZk&_nc_zt=23&_nc_ht=scontent-sjc3-1.xx&_nc_gid=b-pUQTSfmhjwsQJZz4S_Ng&oh=00_AfQERQglKyUNngpTJaKoARKmgG-6fQBaQV0SrToJEhVxVg&oe=688F51CA",
        position: "top center"
      },
      "Google Developer Student Club": {
        url: "https://storage.googleapis.com/creatorspace-public/users%2Fcln22djyd00i1p301whvmgxbp%2FAXLN0jmEde3yHgMf-IMG_4612.JPG",
        position: "center 40%"
      },
      "HackDavis": {
        url: "https://miro.medium.com/v2/resize:fit:1400/1*YQl_MmSsFEmQUGleWrX1LA.jpeg",
        position: "center bottom"
      },
      "Women in Computer Science": {
        url: "https://engineering.ucdavis.edu/sites/g/files/dgvnsk2151/files/styles/sf_landscape_16x9/public/media/images/wics-04.jpg?h=a1e1a043&itok=1dnFRIkJ",
        position: "center center"
      },
      "Design Interactive": {
        url: "https://davisdi.org/wp-content/uploads/2023/01/BDF3EBAA-352B-419A-BBF1-39BC872177FC_1_105_c-1.jpeg",
        position: "center 25%"
      },
      "Quantum Computing Society at Davis": {
        url: "https://engineering.ucdavis.edu/sites/g/files/dgvnsk2151/files/styles/sf_landscape_16x9/public/media/images/52490699602_769427698e_k_0.jpg?h=a1e1a043&itok=9C8m4Wmr",
        position: "center 35%"
      },
      "AI Student Collective": {
        url: "https://engineering.ucdavis.edu/sites/g/files/dgvnsk2151/files/styles/sf_landscape_16x9/public/media/images/Main%20image-min.jpeg?h=ef24a1e5&itok=P-9uR0eq",
        position: "center center"
      },
      "Aggie Sports Analytics": {
        url: "https://aggiesportsanalytics.com/_next/image?url=%2Fhp3bw.png&w=3840&q=75",
        position: "center 20%"
      },
      "Cyber Security Club at UC Davis": {
        url: "https://cs.ucdavis.edu/sites/g/files/dgvnsk8441/files/styles/sf_landscape_16x9/public/images/article/cybersecurity2.png?h=c673cd1c&itok=JK2rjPXu",
        position: "center 30%"
      },
      "AggieWorks": {
        url: "https://framerusercontent.com/images/0aiCYbgzl1BvB9G6sioq0BFcoo4.jpg",
        position: "center 45%"
      },
      "BAJA SAE": {
        url: "https://engineering.ucdavis.edu/sites/g/files/dgvnsk2151/files/media/images/Baja%20SAE%202024_0.jpg",
        position: "center 25%"
      },
      "Club of Future Female Engineers": {
        url: "https://static.wixstatic.com/media/951871_b03f214dacca47e293a79cacd95bca70~mv2.png/v1/fill/w_770,h_442,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/IMG_3156_HEIC.png",
        position: "center center"
      },
      "CodeLab": {
        url: "https://codelabdavis.com/_astro/GroupPhoto.BmIde2tY_Z1vc07W.webp",
        position: "center 40%"
      },
      "Computer Science Tutoring Club": {
        url: "https://www.cstutoringatdavis.com/Bongo%20Tiger%20PC%20Simplified(1).svg",
        position: "center center"
      },
      "Davis Data Science Club": {
        url: "https://media.licdn.com/dms/image/v2/C561BAQEKjNmWZGeiug/company-background_10000/company-background_10000/0/1649187010603/data_science_club_at_utdallas_cover?e=2147483647&v=beta&t=Xy4BZ4WGD_eEmJTBCTZCaHqIspUJbxRjxzqlr80dW6E",
        position: "center 30%"
      },
      "Game Development and Arts Club": {
        url: "https://pbs.twimg.com/media/C8mJwHXXcAAWkc9?format=jpg&name=large",
        position: "center center"
      },
      "Girls Who Code at UC Davis": {
        url: "https://lettersandsciencemag.ucdavis.edu/sites/g/files/dgvnsk15406/files/media/images/Girls_Who_Code_HerHacks-1%20%281%29.jpg",
        position: "center 35%"
      },
      "Cognitive Science Student Association": {
        url: "https://aggielife.ucdavis.edu/upload/ucdavis/2023/web_upload_2808047IMG_3689JPG_314203711_crop.jpg",
        position: "center center"
      },
      "ColorStack": {
        url: "https://media.licdn.com/dms/image/v2/D4D22AQFpmZiIb_aMeQ/feedshare-shrink_800/feedshare-shrink_800/0/1722911594792?e=2147483647&v=beta&t=C6BJc_zTvQdtzkw3tw0cSKC-IVDg7tEXDJIMS6aWoYg",
        position: "center 40%"
      },
      "Cyclone RoboSub": {
        url: "https://cyclone-robosub.github.io/gallery/dirty-hands.jpg",
        position: "center 25%"
      },
      "Davis Data Driven Change": {
        url: "https://media.licdn.com/dms/image/v2/D4E22AQHWDIuQwkKudQ/feedshare-shrink_800/B4EZS10hwLHUAg-/0/1738217234622?e=2147483647&v=beta&t=N3mxF_75Ibr87pwTV9n5V2xeB6LnZCfzhX3t2L3ccoc",
        position: "center 30%"
      },
      "Engineering Collaborative Council": {
        url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJzCB5J0JKVV2ID9B1DiqztpfJONHo-CiHdA&s",
        position: "center center"
      },
      "Engineers Without Borders at UC Davis": {
        url: "https://engineering.ucdavis.edu/sites/g/files/dgvnsk2151/files/styles/sf_landscape_4x3/public/media/images/Bolivia%202.JPG?h=c660573c&itok=QD3O8Rck",
        position: "center 35%"
      },
      "Food Tech Club": {
        url: "https://rmi.ucdavis.edu/sites/g/files/dgvnsk2226/files/styles/sf_landscape_16x9/public/media/images/Food%20Tech%20Club.jpg?h=21aa09ad&itok=4LtMZ0iB",
        position: "center center"
      },
      "Green Innovation Network": {
        url: "https://substackcdn.com/image/fetch/f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F319388ee-7303-4641-bf46-a76c171d6905_1796x1170.png",
        position: "center 20%"
      },
      "Human Resources Managment Association (HRMA)": {
        url: "https://media.licdn.com/dms/image/v2/D4D0BAQFPWZ8uQQYfyQ/company-logo_200_200/company-logo_200_200/0/1727326225643?e=2147483647&v=beta&t=h4AF50RdNmOt1sUPKwX8JzlLurWmkchAPread4GuZuE",
        position: "center center"
      },
      "Nuerotech @ UCDavis": {
        url: "https://neurotechdavis.com/assets/aboutheader20232024-DjZ4AXfB.jpeg",
        position: "center 30%"
      },
      "Product Space @ UC Davis": {
        url: "https://www.davisproductspace.org/images/WhoWeAre/capstone-pres.png",
        position: "center 40%"
      },
      "SacHacks": {
        url: "https://miro.medium.com/v2/resize:fill:320:214/1*ZLnH1YoLY2RvsdqS-W_kiw.png",
        position: "center center"
      },
      "The Davis Consulting Group": {
        url: "https://images.squarespace-cdn.com/content/v1/5d71898a6704a60001e27c6c/1661475566819-9WV1TLMNDQNGUJ9ZNHU2/IMG_2084+1.png?format=1500w",
        position: "center 45%"
      },
      "The Hardware Club @ UC Davis": {
        url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJfcBwQXEFnb1XQhVFQiPRvjnKPuP119iCdg&s",
        position: "center center"
      },
      "Women in Gaming at UC Davis": {
        url: "https://campusrecreation.ucdavis.edu/sites/g/files/dgvnsk6556/files/styles/sf_landscape_16x9/public/media/images/51606528997_183fb3175b_c.jpg?h=827069f2&itok=ebRnUAG0",
        position: "center 35%"
      },
      "Aggie Space initiative": {
        url: "https://engineering.ucdavis.edu/sites/g/files/dgvnsk2151/files/styles/sf_slideshow_full/public/media/images/ASI%2015.jpg?h=7a8a8cdf&itok=ijUelDyM",
        position: "bottom"
      },
      "Biomedical Engineering Society (BES)": {
        url: "https://givingserviceproduction.blob.core.windows.net/giveupload/220a3411-2f93-460c-80e0-ed01fdb02eda-BMES-3-small.png",
        position: "center center"
      },
      "IEEE (Institute of Electrical & Electronics Engineers)": {
        url: "https://scontent-sjc3-1.xx.fbcdn.net/v/t39.30808-6/472462935_10171062722225193_2476418674163943373_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=127cfc&_nc_ohc=spYpFN3D3jkQ7kNvwEHKQqU&_nc_oc=AdnzPUNTgU1N6PKizqM__WEZYPxTOFlemDBLAHbOuy_CiyTXy--pt2t5CCiIzphd_Wt9G6mUlpIhzFtpqXYOuA1d&_nc_zt=23&_nc_ht=scontent-sjc3-1.xx&_nc_gid=Mxl2V4ZPLY6FokVfpGjt9Q&oh=00_AfRg4_o0_Aco6pot2LN-Sndx9QslE15-A68VRgs2xrPavQ&oe=6890EBFC",
        position: "center 25%"
      },
      "Tau Beta Pi": {
        url: "https://tbp.engineering.ucdavis.edu/files/2023/09/tbpwebsitepic2-300x151.jpg",
        position: "center center"
      },
      "Swift Coding Club": {
        url: "https://swiftcodingucd.org/homepageImages/image2.jpeg",
        position: "center 40%"
      },
      "Finance and Investment Club": {
        url: "https://images.squarespace-cdn.com/content/v1/6397cf97e73677755585fd57/38d3a78c-3610-4bb4-a887-d47957076b18/DSC05856-2.jpg",
        position: "center 30%"
      },
      "IDSA at UC Davis": {
        url: "https://media.licdn.com/dms/image/v2/D5622AQE41VQnrm7V5Q/feedshare-shrink_800/B56ZUaSY9RHsAk-/0/1739902783962?e=2147483647&v=beta&t=P7rsYp8XTjLCKAnd4VKCw3sv8vZy0epSPMFVG7nv6pU",
        position: "center 35%"
      },
      "Project Catalyst": {
        url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTX6ceYLR1WlV1wXxB4fbO62rw_xoJRKtitw&s",
        position: "center center"
      },
      "SACNAS": {
        url: "https://lettersandsciencemag.ucdavis.edu/sites/g/files/dgvnsk15406/files/styles/sf_landscape_16x9/public/media/images/SACNAS-Group-Photo-2-Jace-Kuske.jpg?h=6eb229a4&itok=Lamhp2tc",
        position: "center 40%"
      },
      "Science Says": {
        url: "https://davissciencesays.ucdavis.edu/sites/g/files/dgvnsk6006/files/inline-images/EEOXdGEUwAMP_1Z.jpg",
        position: "center center"
      },
      "Construction Management Club": {
        url: "https://engineering.ucdavis.edu/sites/g/files/dgvnsk2151/files/styles/sf_landscape_16x9/public/media/images/IMG_9594.jpeg?h=558d796c&itok=6F_C8O-j",
        position: "center 25%"
      },
      "EBSA": {
        url: "https://images.squarespace-cdn.com/content/v1/60ee8314f3a4b9650c3822c5/0d3b293f-3809-4409-a9d4-5c6d8cda8784/DSC02286.JPG",
        position: "center 35%"
      },
      "Materials Advantage Student Chapter": {
        url: "https://mse.engineering.ucdavis.edu/sites/g/files/dgvnsk4451/files/media/images/MaterialsMagicShow2023.jpg",
        position: "center 30%"
      },
      "American Institute of Chemical Engineers": {
        url: "https://aiche.ucdavis.edu/sites/g/files/dgvnsk5996/files/styles/sf_image_banner/public/media/images/IMG_2282_1_80.jpeg?itok=9hOLB5ns",
        position: "center 25%"
      },
      "College Bowl": {
        url: "https://news.bftv.ucdavis.edu/sites/g/files/dgvnsk1131/files/styles/sf_landscape_16x9/public/images/article/2019CollegeBowl.jpg?h=df75db45&itok=D2lfpTec",
        position: "center center"
      },
      "Davis Robotics Club": {
        url: "https://www.totalphase.com/media/blog/2024/09/robot-7925618_1280-1024x576.webp",
        position: "center 25%"
      }
    };
    let updated = 0;

    for (const [clubName, config] of Object.entries(heroImages)) {
      const club = await Club.findOneAndUpdate(
        { name: clubName },
        {
          heroImageUrl: config.url,
          heroImagePosition: config.position
        },
        { new: true }
      );

      if (club) {
        updated++;
        console.log(`✅ Updated hero image for: ${clubName}`);
      }
    }

    res.json({
      message: `Updated ${updated} club hero images`,
      updated: updated,
      total: Object.keys(heroImages).length
    });

  } catch (error) {
    console.error('💥 Error updating hero images:', error);
    res.status(500).json({ error: 'Failed to update hero images' });
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
// ENHANCED RESULTS ROUTES - Direct mount for HTML pages
// =============================================================================

// Serve the enhanced results HTML page
app.get('/enhanced-results', requireAuth, async (req, res) => {
  try {
    const userId = req.session.userId;
    const path = require('path');

    // Simply serve the HTML page - the JavaScript will load the data
    res.sendFile(path.join(__dirname, '../frontend/pages/enhanced-results.html'));
  } catch (err) {
    console.error('Error loading enhanced results page:', err);
    res.redirect('/enhanced-quiz?error=results-error');
  }
});

// API endpoint for fetching results data
app.get('/api/enhanced-results/:resultId/data', requireAuth, async (req, res) => {
  try {
    const userId = req.session.userId;
    const resultId = req.params.resultId;

    const EnhancedQuizResult = require('./models/EnhancedQuizResult');
    const enhancedResult = await EnhancedQuizResult
      .findOne({ _id: resultId, user: userId })
      .populate('clubRecommendations.clubId');

    if (!enhancedResult) {
      return res.status(404).json({ error: 'No enhanced results found' });
    }

    res.json({ success: true, results: enhancedResult.getFormattedForAPI() });
  } catch (err) {
    console.error('Error fetching enhanced results JSON:', err);
    res.status(500).json({ error: 'Failed to fetch enhanced results' });
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
app.get('/enhanced-quiz', requireAuth, (req, res) => {
  console.log('Enhanced quiz accessed by:', req.session.userEmail);
  res.sendFile(path.join(__dirname, '../frontend/pages/sophisticated-quiz.html'));
});

// Legacy niche quiz redirect to enhanced version
app.get('/niche-quiz', requireAuth, (req, res) => {
  console.log('Legacy niche-quiz redirecting to enhanced-quiz for:', req.session.userEmail);
  res.redirect('/enhanced-quiz?upgraded=true');
});

//  GET QUIZ INTRO - Show available levels and preview
app.get('/api/quiz/intro', async (req, res) => {
  try {
    console.log('🎯 Serving AI-powered quiz introduction...');

    const levels = [
      {
        level: 'beginner',
        title: 'Tech Explorer',
        subtitle: 'New to tech? Discover your path.',
        description: 'Perfect for students with no tech background who want to explore if tech is right for them.',
        duration: '5-7 minutes',
        questionCount: 8,
        icon: '🌱',
        features: [
          'Beginner-friendly scenarios',
          'No tech jargon required',
          'AI analyzes your natural preferences',
          'Discover hidden tech interests'
        ],
        idealFor: 'Complete beginners, undecided majors, exploring options'
      },
      {
        level: 'intermediate',
        title: 'Tech Curious',
        subtitle: 'Some experience? Find your specialization.',
        description: 'Designed for students with some coding classes or tech exposure who want to find their ideal focus area.',
        duration: '8-10 minutes',
        questionCount: 6,
        icon: '🚀',
        features: [
          'Scenario-based questions',
          'Team dynamics assessment',
          'AI-powered personality analysis',
          'Advanced career matching'
        ],
        idealFor: 'CS/STEM students, some coding experience, seeking specialization'
      },
      {
        level: 'advanced',
        title: 'Tech Insider',
        subtitle: 'Experienced? Optimize your trajectory.',
        description: 'For students with significant tech experience who want to refine their career strategy.',
        duration: '10-12 minutes',
        questionCount: 6,
        icon: '⚡',
        features: [
          'Strategic thinking scenarios',
          'Leadership assessment',
          'AI career optimization',
          'Professional development insights'
        ],
        idealFor: 'Advanced CS students, internship experience, technical leadership roles'
      }
    ];

    const response = {
      levels,
      systemInfo: {
        analysisType: 'AI-Powered Psychology Assessment',
        aiModel: 'GPT-4 Turbo',
        accuracy: '95% confidence scoring',
        antiGaming: 'Advanced pattern detection',
        personalization: 'Deep personality profiling'
      },
      features: [
        'No predetermined weights - AI analyzes your unique patterns',
        'Impossible to game - AI detects inconsistent responses',
        'Personalized insights based on your individual profile',
        'UC Davis specific recommendations and resources'
      ]
    };

    console.log(`✅ Served AI quiz intro with ${levels.length} levels`);
    res.json(response);

  } catch (error) {
    console.error('💥 Error serving AI quiz intro:', error);
    res.status(500).json({ error: 'Failed to load quiz introduction' });
  }
});

// Add this to your existing backend/app.js file
// Insert after your existing quiz routes around line 200

// =============================================================================
// ENHANCED 3-LEVEL QUIZ ROUTES INTEGRATION  
// =============================================================================

// Add the enhanced 3-level quiz routes
const enhancedQuizRoutes = require('./routes/enhancedThreeLevelQuizRoutes');
app.use('/api/quiz', enhancedQuizRoutes);

console.log('✅ Enhanced 3-Level Quiz Routes integrated at /api/quiz');
// =============================================================================
// ENHANCED QUIZ PAGE ROUTES
// =============================================================================

// Enhanced Quiz Page - Serve the updated HTML with 3-level selection
app.get('/enhanced-quiz', requireAuth, (req, res) => {
  console.log('Enhanced quiz accessed by:', req.session.userEmail);
  res.sendFile(path.join(__dirname, '../frontend/pages/sophisticated-quiz.html'));
});

// Legacy niche quiz redirect to enhanced version
app.get('/niche-quiz', requireAuth, (req, res) => {
  console.log('Legacy niche-quiz redirecting to enhanced-quiz for:', req.session.userEmail);
  res.redirect('/enhanced-quiz?upgraded=true');
});

// =============================================================================
// API COMPARISON ENDPOINT - Show differences between quiz systems
// =============================================================================

app.get('/api/quiz/compare-systems', requireAuth, async (req, res) => {
  try {
    const userId = req.session.userId;

    const [legacyResults, enhancedResults] = await Promise.all([
      QuizResult.find({
        user: userId,
        quizLevel: { $in: ['beginner', 'intermediate', 'advanced'] }
      }).sort({ createdAt: -1 }).limit(5).lean(),

      QuizResult.find({
        user: userId,
        quizLevel: { $regex: '^enhanced-' }
      }).sort({ createdAt: -1 }).limit(5).lean()
    ]);

    const comparison = {
      legacy: {
        count: legacyResults.length,
        latestResult: legacyResults[0],
        averageConfidence: legacyResults.length > 0 ?
          Math.round(legacyResults.reduce((sum, r) => sum + (r.topMatch?.percentage || 0), 0) / legacyResults.length) : 0
      },
      enhanced: {
        count: enhancedResults.length,
        latestResult: enhancedResults[0],
        averageConfidence: enhancedResults.length > 0 ?
          Math.round(enhancedResults.reduce((sum, r) => sum + (r.topMatch?.percentage || 0), 0) / enhancedResults.length) : 0
      },
      improvements: [
        'Multi-format questions prevent boredom and gaming',
        'Level-specific difficulty and guidance',
        'Enhanced AI analysis with personality insights',
        'More accurate career matching with confidence scoring',
        'Detailed development areas and next steps'
      ]
    };

    res.json(comparison);

  } catch (error) {
    console.error('💥 Error comparing quiz systems:', error);
    res.status(500).json({ error: 'Failed to compare quiz systems' });
  }
});

// =============================================================================
// QUIZ MIGRATION ENDPOINT - Help users understand the upgrade
// =============================================================================

app.post('/api/quiz/migrate-to-enhanced', requireAuth, async (req, res) => {
  try {
    const userId = req.session.userId;

    // Get user's latest legacy quiz result
    const latestLegacyResult = await QuizResult.findOne({
      user: userId,
      quizLevel: { $in: ['beginner', 'intermediate', 'advanced'] }
    }).sort({ createdAt: -1 }).lean();

    if (!latestLegacyResult) {
      return res.json({
        recommendedLevel: 'beginner',
        reasoning: 'Start with our beginner level to discover your tech interests!',
        hasLegacyData: false
      });
    }

    // Analyze legacy result to recommend enhanced level
    const legacyLevel = latestLegacyResult.quizLevel;
    const legacyConfidence = latestLegacyResult.topMatch?.percentage || 0;

    let recommendedLevel;
    let reasoning;

    if (legacyLevel === 'beginner' || legacyConfidence < 70) {
      recommendedLevel = 'beginner';
      reasoning = 'Based on your previous results, start with our enhanced beginner level for better accuracy.';
    } else if (legacyLevel === 'intermediate' || legacyConfidence < 85) {
      recommendedLevel = 'intermediate';
      reasoning = 'Your experience suggests the intermediate level will provide the best insights.';
    } else {
      recommendedLevel = 'advanced';
      reasoning = 'Your strong previous results indicate you\'re ready for our advanced strategic assessment.';
    }

    res.json({
      recommendedLevel,
      reasoning,
      hasLegacyData: true,
      previousLevel: legacyLevel,
      previousCareer: latestLegacyResult.topMatch?.careerName,
      previousConfidence: legacyConfidence,
      improvements: [
        'More accurate analysis with varied question types',
        'Level-appropriate difficulty and insights',
        'Enhanced AI with personality profiling',
        'Specific UC Davis resources and next steps'
      ]
    });

  } catch (error) {
    console.error('💥 Error in quiz migration:', error);
    res.status(500).json({ error: 'Failed to analyze migration path' });
  }
});

// =============================================================================
// ENHANCED QUIZ STATISTICS FOR DASHBOARD
// =============================================================================

app.get('/api/user/enhanced-quiz-stats', requireAuth, async (req, res) => {
  try {
    const userId = req.session.userId;

    const [enhancedResults, legacyResults] = await Promise.all([
      QuizResult.find({
        user: userId,
        quizLevel: { $regex: '^enhanced-' }
      }).sort({ createdAt: -1 }).lean(),

      QuizResult.find({
        user: userId,
        quizLevel: { $in: ['beginner', 'intermediate', 'advanced'] }
      }).sort({ createdAt: -1 }).lean()
    ]);

    const stats = {
      enhanced: {
        totalTaken: enhancedResults.length,
        levelsCompleted: [...new Set(enhancedResults.map(r => r.quizLevel.replace('enhanced-', '')))],
        latestResult: enhancedResults[0],
        averageAuthenticity: enhancedResults.length > 0 ?
          Math.round(enhancedResults.reduce((sum, r) =>
            sum + (r.enhancedAIAnalysis?.qualityMetrics?.authenticity || 90), 0) / enhancedResults.length) : 0
      },
      legacy: {
        totalTaken: legacyResults.length,
        latestResult: legacyResults[0]
      },
      recommendations: {
        hasEnhancedResults: enhancedResults.length > 0,
        shouldUpgrade: legacyResults.length > 0 && enhancedResults.length === 0,
        nextSuggestedLevel: this.getNextSuggestedLevel(enhancedResults)
      }
    };

    res.json(stats);

  } catch (error) {
    console.error('💥 Error fetching enhanced quiz stats:', error);
    res.status(500).json({ error: 'Failed to fetch quiz statistics' });
  }
});

// Helper function for level recommendations
function getNextSuggestedLevel(enhancedResults) {
  if (enhancedResults.length === 0) return 'beginner';

  const completedLevels = new Set(enhancedResults.map(r => r.quizLevel.replace('enhanced-', '')));

  if (!completedLevels.has('beginner')) return 'beginner';
  if (!completedLevels.has('intermediate')) return 'intermediate';
  if (!completedLevels.has('advanced')) return 'advanced';

  return null; // All levels completed
}



console.log('✅ Enhanced 3-Level Quiz Routes integrated successfully');
app.get('/api/quiz/next-gen/intro', async (req, res) => {
  try {
    console.log('🚀 Serving next-generation quiz introduction...');

    const response = {
      success: true,
      message: 'AI career analysis completed successfully',
      enhanced: true, // Add this flag
      redirectTo: '/enhanced-results', // Add this redirect
      results: {
        // Top match with all required fields
        topMatch: {
          career: aiResults.results.topMatch.career,
          percentage: aiResults.results.topMatch.percentage,
          confidence: aiResults.results.topMatch.confidence || 'High',
          reasoning: aiResults.results.topMatch.reasoning,

          // Add career progression data
          careerProgression: [
            {
              level: 'Entry',
              roles: ['Junior UX Designer', 'UI Designer'],
              timeline: '0-2 years',
              salary: { min: 70, max: 95 }
            },
            {
              level: 'Mid',
              roles: ['UX Designer', 'Senior UI Designer'],
              timeline: '2-5 years',
              salary: { min: 95, max: 130 }
            },
            {
              level: 'Senior',
              roles: ['Lead UX Designer', 'Design Manager'],
              timeline: '5+ years',
              salary: { min: 130, max: 180 }
            }
          ],

          // Add next steps
          nextSteps: [
            'Learn design fundamentals and user research methods',
            'Build a portfolio with 3-5 design projects',
            'Join UC Davis Design Club and UX groups',
            'Apply for UX design internships and entry-level positions'
          ],

          // Add market data
          marketData: {
            avgSalary: '$85k - $140k',
            jobGrowthRate: '+13%',
            annualOpenings: 23900,
            workLifeBalance: '8.2/10'
          }
        },

        // All career matches (top 5)
        allMatches: [
          { career: 'UX/UI Design', category: 'Design', percentage: 85 },
          { career: 'Product Design', category: 'Design', percentage: 78 },
          { career: 'Web Design', category: 'Design', percentage: 72 },
          { career: 'Software Engineering', category: 'Engineering', percentage: 65 },
          { career: 'Product Management', category: 'Product', percentage: 58 }
        ],

        // Club recommendations with proper structure
        clubRecommendations: [
          {
            _id: 'design-interactive',
            name: 'Design Interactive',
            logoUrl: '/assets/design-interactive.png',
            tags: ['design', 'ux-ui'],
            relevanceScore: 95,
            recommendationReason: 'Perfect for developing UX/UI design skills'
          },
          {
            _id: 'hci-club',
            name: 'HCI Club',
            logoUrl: '/assets/hci-club.png',
            tags: ['human-computer-interaction', 'design'],
            relevanceScore: 88,
            recommendationReason: 'Great for user research and interaction design'
          },
          {
            _id: 'creative-tech',
            name: 'Creative Tech Club',
            logoUrl: '/assets/creative-tech.png',
            tags: ['creativity', 'technology'],
            relevanceScore: 82,
            recommendationReason: 'Combines creativity with technical skills'
          }
        ]
      }
    };

    req.session.enhancedResults = response.results;

    console.log('✅ AI analysis complete:', response.results.topMatch.career, `(${response.results.topMatch.percentage}%)`);
    res.json(response);


    console.log(`✅ Served next-gen quiz intro with ${response.metadata.totalQuestions} questions`);
    res.json(response);

  } catch (error) {
    console.error('💥 Error serving next-gen quiz intro:', error);
    res.status(500).json({ error: 'Failed to load quiz introduction' });
  }
});

app.get('/api/quiz/next-gen/questions', requireAuth, async (req, res) => {
  try {
    console.log(`📚 Loading next-gen questions for user: ${req.session.userEmail}`);

    // Get comprehensive question set
    const questions = nextGenQuizQuestions.comprehensive;

    if (questions.length === 0) {
      return res.status(404).json({
        error: 'No questions available',
        suggestion: 'Questions are being updated'
      });
    }

    // Format questions for frontend (remove any sensitive data)
    const formattedQuestions = questions.map((q, index) => ({
      id: q.id,
      questionNumber: index + 1,
      type: q.type,
      category: q.category,
      question: q.question,
      subtitle: q.subtitle || '',
      options: q.options || [],
      scale: q.scale || null,
      items: q.items || [],
      placeholder: q.placeholder || '',
      max_length: q.max_length || 500,
      totalQuestions: questions.length,
      nextGenPowered: true
    }));

    const response = {
      questions: formattedQuestions,
      metadata: {
        totalQuestions: questions.length,
        estimatedTime: "8-12 minutes",
        questionTypes: [...new Set(questions.map(q => q.type))],
        analysisEngine: "Enhanced AI with GPT-4",
        careerDatabase: `${expandedCareerOptions.length}+ career paths`
      },
      instructions: {
        visual_choice: "Select the option that most appeals to you instinctively",
        scale: "Move the slider to reflect your true preference level",
        scenario: "Choose the approach that feels most natural to you",
        short_response: "Write authentically about your experience - there are no wrong answers",
        ranking: "Drag items to order them by personal importance",
        multiple_choice: "Select the option that best represents your preference"
      }
    };

    console.log(`✅ Served ${formattedQuestions.length} next-gen questions`);
    res.json(response);

  } catch (error) {
    console.error('💥 Error loading next-gen questions:', error);
    res.status(500).json({ error: 'Failed to load quiz questions' });
  }
});
//  GET QUIZ QUESTIONS - Load questions for specific level
app.get('/api/quiz/questions/:level', requireAuth, async (req, res) => {
  try {
    const { level } = req.params;

    if (!['beginner', 'intermediate', 'advanced'].includes(level)) {
      return res.status(400).json({ error: 'Invalid quiz level' });
    }

    console.log(`📚 Loading ${level} AI questions for user: ${req.session.userEmail}`);

    // Get questions without weights
    const questions = aiOnlyQuizQuestions[level] || [];

    if (questions.length === 0) {
      return res.status(404).json({
        error: 'No questions found for this level',
        suggestion: 'Questions are being updated for AI analysis'
      });
    }

    // Format questions for frontend (no weights included)
    const formattedQuestions = questions.map((q, index) => ({
      id: q.id,
      questionNumber: index + 1,
      questionText: q.questionText,
      questionType: q.questionType,
      category: q.category,
      options: q.options.map((option, optIndex) => ({
        id: optIndex,
        text: option.text,
        description: option.description
        // Note: No weights - AI will analyze the semantic meaning
      })),
      totalQuestions: questions.length,
      aiPowered: true
    }));

    const response = {
      level,
      questions: formattedQuestions,
      metadata: {
        totalQuestions: questions.length,
        estimatedTime: `${Math.ceil(questions.length * 0.75)}-${Math.ceil(questions.length * 1.25)} minutes`,
        analysisType: 'AI-Powered Personality Profiling',
        weightless: true
      },
      instructions: {
        ranking: 'Rank options based on your natural preferences - AI will analyze the patterns',
        authenticity: 'Answer authentically - AI can detect inconsistent responses',
        noGaming: 'No "correct" answers - AI evaluates your unique thinking patterns'
      }
    };

    console.log(`✅ Served ${formattedQuestions.length} AI-powered ${level} questions`);
    res.json(response);

  } catch (error) {
    console.error('💥 Error loading AI questions:', error);
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
    const { level, answers, completionTime, metadata } = req.body;
    const userId = req.session.userId;
    const userEmail = req.session.userEmail;

    console.log(`🤖 Processing AI-powered quiz for ${userEmail}`);
    console.log(`📊 Level: ${level}, Answers: ${answers?.length}, Time: ${completionTime}s`);

    // Validate input
    if (!level || !answers || !Array.isArray(answers)) {
      return res.status(400).json({
        error: 'Invalid submission data',
        required: ['level', 'answers array']
      });
    }

    // Get user profile for personalized analysis
    const User = require('./models/User');
    const userProfile = await User.findById(userId).select('major year name email');

    // Get questions for context
    const { enhancedThreeLevelQuizQuestions } = require('./data/enhancedThreeLevelQuizData');
    const questions = enhancedThreeLevelQuizQuestions[level] || [];

    if (questions.length === 0) {
      return res.status(500).json({ error: 'Quiz questions not found' });
    }

    // Validate answers match questions
    if (answers.length !== questions.length) {
      return res.status(400).json({
        error: `Expected ${questions.length} answers, received ${answers.length}`
      });
    }

    console.log('🤖 Sending to AI analyzer:', {
      answersCount: answers.length,
      level: level,
      questionsCount: questions.length,
      userProfile: {
        major: userProfile?.major,
        year: userProfile?.year,
        email: userEmail
      },
      sampleAnswer: answers[0] // Show first answer structure
    });

    // Initialize AI analyzer
    const EnhancedAIAnalyzer = require('./services/enhancedThreeLevelAIAnalyzer');
    const enhancedAnalyzer = new EnhancedAIAnalyzer();

    console.log('🧠 Running AI-powered career analysis...');

    // Run AI analysis
    const aiResults = await enhancedAnalyzer.analyzeCareerFit(
      answers,
      questions,
      level,
      {
        major: userProfile?.major,
        year: userProfile?.year,
        university: 'UC Davis',
        completionTime: completionTime,
        email: userEmail
      }
    );

    console.log('🎯 AI Results received:', {
      success: aiResults.success,
      analysisType: aiResults.analysisType,
      topCareer: aiResults.results?.topMatch?.career,
      percentage: aiResults.results?.topMatch?.percentage,
      hasAllMatches: !!aiResults.results?.allMatches,
      allMatchesCount: aiResults.results?.allMatches?.length
    });

    if (!aiResults.success) {
      console.error('❌ AI analysis failed:', aiResults);
      throw new Error('AI analysis failed to produce valid results');
    }

    // Validate AI results structure
    if (!aiResults.results?.topMatch?.career) {
      console.error('❌ Invalid AI results structure:', aiResults.results);
      throw new Error('AI returned invalid results structure');
    }

    // Get club recommendations AFTER AI analysis is complete
    const ClubRecommendationService = require('./services/ClubRecommendationService');
    const clubService = new ClubRecommendationService();

    const clubRecommendations = await clubService.getClubRecommendations(
      aiResults.results.topMatch.career,
      aiResults.results.allMatches
    );

    // Helper functions for additional data
    const careerProgression = getCareerProgression(aiResults.results.topMatch.career);
    const marketData = getMarketData(aiResults.results.topMatch.career);
    const nextSteps = getNextSteps(aiResults.results.topMatch.career, level);

    // Save results to database
    try {
      const QuizResult = require('./models/nicheQuizModels').QuizResult;

      const quizResult = new QuizResult({
        user: userId,
        quizLevel: level,
        answers: answers,
        aiAnalysis: aiResults.results,
        topMatch: {
          careerName: aiResults.results.topMatch.career,
          percentage: aiResults.results.topMatch.percentage,
          reasoning: aiResults.results.topMatch.reasoning,
          nextSteps: aiResults.results.topMatch.nextSteps
        },
        completionTime: completionTime,
        metadata: {
          version: '3.0-AI',
          analysisType: 'ai-only',
          aiModel: 'gpt-4-turbo',
          weightless: true,
          timestamp: new Date(),
          ...metadata
        }
      });

      await quizResult.save();
      console.log('💾 AI quiz result saved to database');
    } catch (saveError) {
      console.error('⚠️ Failed to save AI quiz result:', saveError);
      // Continue without saving - don't fail the request
    }

    // Format the response
    const response = {
      success: true,
      message: 'AI career analysis completed successfully',
      results: {
        topMatch: {
          career: aiResults.results.topMatch.career,
          percentage: aiResults.results.topMatch.percentage,
          confidence: aiResults.results.topMatch.confidence || 'High',
          reasoning: aiResults.results.topMatch.reasoning,
          careerProgression: careerProgression,
          nextSteps: nextSteps,
          marketData: marketData
        },
        allMatches: aiResults.results.allMatches || getDefaultMatches(aiResults.results.topMatch.career),
        clubRecommendations: clubRecommendations
      }
    };

    console.log(`✅ Enhanced AI analysis complete: ${aiResults.results.topMatch.career} (${aiResults.results.topMatch.percentage}%)`);

    // Final validation before sending response
    if (!response.results.topMatch.career || response.results.topMatch.career === 'undefined') {
      console.error('❌ Final response validation failed - no career determined');
      throw new Error('Failed to determine career match');
    }

    res.json(response);

  } catch (error) {
    console.error('💥 Quiz submission error:', error);
    console.error('Error stack:', error.stack);

    res.status(500).json({
      error: 'AI career analysis failed',
      message: error.message,
      suggestion: 'Please try again or contact support if the issue persists'
    });
  }
});



app.post('/api/quiz/next-gen/submit', requireAuth, async (req, res) => {
  try {
    const { answers, completionTime, metadata } = req.body;
    const userId = req.session.userId;
    const userEmail = req.session.userEmail;

    console.log(`🤖 Processing next-gen quiz for ${userEmail}`);
    console.log(`📊 Answers: ${answers?.length}, Time: ${completionTime}s`);

    // Validate input
    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({
        error: 'Invalid submission data',
        required: ['answers array']
      });
    }

    // Get user profile for personalized analysis
    const User = require('./models/User');
    const userProfile = await User.findById(userId).select('major year name email');

    // Get questions for context - fix the variable reference
    const { nextGenQuizQuestions } = require('./data/nextGenQuizData'); // Make sure this path is correct
    const questions = nextGenQuizQuestions.comprehensive;

    if (answers.length !== questions.length) {
      return res.status(400).json({
        error: `Expected ${questions.length} answers, received ${answers.length}`
      });
    }

    console.log('🧠 Running enhanced AI career analysis...');

    // Initialize the analyzer properly
    const EnhancedAIAnalyzer = require('./services/enhancedThreeLevelAIAnalyzer');
    const enhancedAnalyzer = new EnhancedAIAnalyzer();

    // Run enhanced AI analysis
    const aiResults = await enhancedAnalyzer.analyzeCareerFit(
      answers,
      questions,
      'comprehensive', // Add the level parameter
      {
        major: userProfile?.major,
        year: userProfile?.year,
        university: 'UC Davis',
        completionTime: completionTime,
        email: userEmail
      }
    );

    if (!aiResults.success) {
      throw new Error('Enhanced AI analysis failed to produce valid results');
    }

    // Get club recommendations
    const ClubRecommendationService = require('./services/ClubRecommendationService');
    const clubService = new ClubRecommendationService();

    const clubRecommendations = await clubService.getClubRecommendations(
      aiResults.results.topMatch.career,
      aiResults.results.allMatches
    );

    // Get additional data using helper functions
    const careerProgression = getCareerProgression(aiResults.results.topMatch.career);
    const marketData = getMarketData(aiResults.results.topMatch.career);
    const nextSteps = getNextSteps(aiResults.results.topMatch.career, 'advanced'); // Next-gen is advanced level

    // Save results to database (enhanced format)
    try {
      const QuizResult = require('./models/nicheQuizModels').QuizResult;

      const quizResult = new QuizResult({
        user: userId,
        quizLevel: 'next-gen-comprehensive',
        answers: answers,
        enhancedAIAnalysis: aiResults.results,
        topMatch: {
          careerName: aiResults.results.topMatch.career,
          percentage: aiResults.results.topMatch.percentage,
          reasoning: aiResults.results.topMatch.reasoning,
          nextSteps: aiResults.results.topMatch.nextSteps,
          keyPatterns: aiResults.results.topMatch.keyPatterns
        },
        completionTime: completionTime,
        metadata: {
          version: '4.0-NextGen',
          analysisType: 'enhanced-ai',
          aiModel: 'gpt-4-turbo',
          questionTypes: [...new Set(questions.map(q => q.type))],
          timestamp: new Date(),
          ...metadata
        }
      });

      await quizResult.save();
      console.log('💾 Enhanced quiz result saved to database');
    } catch (saveError) {
      console.error('⚠️ Failed to save enhanced quiz result:', saveError);
      // Continue without saving - don't fail the request
    }

    // Format response for frontend
    const response = {
      success: true,
      message: 'Enhanced AI career analysis completed successfully',
      analysisType: 'Next-Generation AI Career Discovery',
      version: '4.0',
      results: {
        // Enhanced top match with additional data
        topMatch: {
          career: aiResults.results.topMatch.career,
          percentage: aiResults.results.topMatch.percentage,
          confidence: aiResults.results.topMatch.confidence,
          reasoning: aiResults.results.topMatch.reasoning,
          keyPatterns: aiResults.results.topMatch.keyPatterns,
          nextSteps: nextSteps, // Use helper function result
          careerProgression: careerProgression, // Add career progression
          marketData: marketData // Add market data
        },

        // All career matches
        allMatches: aiResults.results.allMatches,

        // Club recommendations
        clubRecommendations: clubRecommendations,

        // Enhanced insights
        personalityInsights: aiResults.results.personalityInsights,
        developmentAreas: aiResults.results.developmentAreas,
        aiInsights: aiResults.results.aiInsights,

        // Quality metrics
        qualityMetrics: aiResults.results.qualityMetrics,

        // Metadata
        metadata: {
          completionTime,
          analysisVersion: '4.0-NextGen',
          aiPowered: true,
          questionTypes: [...new Set(questions.map(q => q.type))],
          timestamp: aiResults.timestamp
        }
      }
    };

    console.log(`✅ Enhanced AI analysis complete: ${aiResults.results.topMatch.career} (${aiResults.results.topMatch.percentage}%)`);
    res.json(response);

  } catch (error) {
    console.error('💥 Enhanced quiz submission error:', error);
    res.status(500).json({
      error: 'Enhanced AI career analysis failed',
      message: error.message,
      suggestion: 'Please try again or contact support if the issue persists'
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
    const { limit = 10 } = req.query;
    const userId = req.session.userId;

    console.log(`📊 Fetching AI quiz results for user: ${req.session.userEmail}`);

    const QuizResult = require('./models/nicheQuizModels').QuizResult;

    const results = await QuizResult.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .lean();

    if (results.length === 0) {
      return res.json({
        results: [],
        message: 'No AI quiz results found',
        suggestion: 'Take your first AI-powered career assessment!'
      });
    }

    // Format results for frontend
    const formattedResults = results.map(result => ({
      id: result._id,
      level: result.quizLevel,
      completedAt: result.createdAt,
      topMatch: result.topMatch,
      analysisType: result.metadata?.analysisType || 'AI-Powered',
      isAIPowered: result.metadata?.aiModel ? true : false,
      qualityScore: result.qualityMetrics?.authenticity || 90,
      confidence: result.aiAnalysis?.topMatch?.confidence || result.topMatch?.percentage || 85
    }));

    const response = {
      results: formattedResults,
      summary: {
        totalQuizzes: results.length,
        mostRecentLevel: results[0]?.quizLevel,
        aiPoweredCount: results.filter(r => r.metadata?.aiModel).length,
        averageConfidence: Math.round(
          formattedResults.reduce((sum, r) => sum + r.confidence, 0) / formattedResults.length
        )
      }
    };

    console.log(`✅ Served ${formattedResults.length} AI quiz results`);
    res.json(response);

  } catch (error) {
    console.error('💥 Error fetching AI quiz results:', error);
    res.status(500).json({ error: 'Failed to fetch quiz results' });
  }
});



// GET /api/quiz/next-gen/results - Get enhanced results history
app.get('/api/quiz/next-gen/results', requireAuth, async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const userId = req.session.userId;

    console.log(`📊 Fetching enhanced quiz results for user: ${req.session.userEmail}`);

    const QuizResult = require('./models/nicheQuizModels').QuizResult;

    const results = await QuizResult.find({
      user: userId,
      quizLevel: { $in: ['next-gen-comprehensive', 'enhanced-ai'] }
    })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .lean();

    if (results.length === 0) {
      return res.json({
        results: [],
        message: 'No enhanced quiz results found',
        suggestion: 'Take your first next-generation AI career assessment!'
      });
    }

    // Format results for frontend
    const formattedResults = results.map(result => ({
      id: result._id,
      level: result.quizLevel,
      completedAt: result.createdAt,
      topMatch: result.topMatch,
      analysisType: result.metadata?.analysisType || 'Enhanced AI',
      isNextGen: true,
      keyPatterns: result.topMatch?.keyPatterns || [],
      qualityScore: result.qualityMetrics?.authenticity || 92,
      confidence: result.enhancedAIAnalysis?.topMatch?.confidence || result.topMatch?.percentage || 85
    }));

    const response = {
      results: formattedResults,
      summary: {
        totalQuizzes: results.length,
        mostRecentLevel: results[0]?.quizLevel,
        nextGenCount: results.filter(r => r.metadata?.version?.includes('NextGen')).length,
        averageConfidence: Math.round(
          formattedResults.reduce((sum, r) => sum + r.confidence, 0) / formattedResults.length
        )
      }
    };

    console.log(`✅ Served ${formattedResults.length} enhanced quiz results`);
    res.json(response);

  } catch (error) {
    console.error('💥 Error fetching enhanced quiz results:', error);
    res.status(500).json({ error: 'Failed to fetch quiz results' });
  }
});
console.log('🤖 AI-Only Quiz Routes loaded successfully');

app.get('/api/quiz/next-gen/analytics', requireAuth, async (req, res) => {
  try {
    // Only allow for admin users or in development
    const isAdmin = req.session.userEmail?.includes('@admin') || process.env.NODE_ENV === 'development';

    if (!isAdmin) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const QuizResult = require('./models/nicheQuizModels').QuizResult;

    const [
      totalSubmissions,
      questionTypePopularity,
      topCareers,
      averageCompletionTime,
      qualityScores
    ] = await Promise.all([
      QuizResult.countDocuments({ quizLevel: 'next-gen-comprehensive' }),

      QuizResult.aggregate([
        { $match: { quizLevel: 'next-gen-comprehensive' } },
        { $group: { _id: '$metadata.questionTypes', count: { $sum: 1 } } }
      ]),

      QuizResult.aggregate([
        { $match: { quizLevel: 'next-gen-comprehensive' } },
        { $group: { _id: '$topMatch.careerName', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]),

      QuizResult.aggregate([
        { $match: { quizLevel: 'next-gen-comprehensive' } },
        { $group: { _id: null, avgTime: { $avg: '$completionTime' } } }
      ]),

      QuizResult.aggregate([
        { $match: { quizLevel: 'next-gen-comprehensive' } },
        {
          $group: {
            _id: null,
            avgAuthenticity: { $avg: '$qualityMetrics.authenticity' },
            avgConfidence: { $avg: '$topMatch.percentage' }
          }
        }
      ])
    ]);

    const analytics = {
      overview: {
        totalNextGenSubmissions: totalSubmissions,
        averageCompletionTime: Math.round(averageCompletionTime[0]?.avgTime || 0),
        systemVersion: '4.0-NextGen'
      },
      questionTypes: questionTypePopularity,
      popularCareers: topCareers.map(career => ({
        career: career._id,
        selections: career.count
      })),
      qualityMetrics: qualityScores[0] || { avgAuthenticity: 0, avgConfidence: 0 },
      recommendations: [
        "Question type variety is working well",
        "AI analysis providing high-quality insights",
        "Users completing assessment at good rates"
      ]
    };

    res.json(analytics);

  } catch (error) {
    console.error('💥 Error fetching next-gen analytics:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

console.log('🚀 Next-Generation Quiz Routes loaded successfully');
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

app.get('/api/test/openai', async (req, res) => {
  try {
    const OpenAI = require('openai');
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: "Say 'API key is working!'" }],
      max_tokens: 10
    });

    res.json({
      success: true,
      message: completion.choices[0].message.content,
      keyStatus: 'Working!'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      keyStatus: 'Not working'
    });
  }
});

// =============================================================================
// HELPER FUNCTIONS FOR ENHANCED QUIZ RESULTS
// Add these RIGHT BEFORE your app.listen() at the bottom of app.js
// =============================================================================

function getCareerProgression(careerName) {
  const progressions = {
    'UX/UI Design': [
      {
        level: 'Entry',
        roles: ['Junior UX Designer', 'UI Designer'],
        timeline: '0-2 years',
        salary: { min: 70, max: 95 }
      },
      {
        level: 'Mid',
        roles: ['UX Designer', 'Senior UI Designer'],
        timeline: '2-5 years',
        salary: { min: 95, max: 130 }
      },
      {
        level: 'Senior',
        roles: ['Lead UX Designer', 'Design Manager'],
        timeline: '5+ years',
        salary: { min: 130, max: 180 }
      }
    ],
    'Software Engineering': [
      {
        level: 'Entry',
        roles: ['Junior Developer', 'Software Engineer I'],
        timeline: '0-2 years',
        salary: { min: 85, max: 110 }
      },
      {
        level: 'Mid',
        roles: ['Software Engineer II', 'Senior Developer'],
        timeline: '2-5 years',
        salary: { min: 110, max: 150 }
      },
      {
        level: 'Senior',
        roles: ['Staff Engineer', 'Principal Engineer'],
        timeline: '5+ years',
        salary: { min: 150, max: 220 }
      }
    ],
    'Data Science': [
      {
        level: 'Entry',
        roles: ['Data Analyst', 'Junior Data Scientist'],
        timeline: '0-2 years',
        salary: { min: 75, max: 100 }
      },
      {
        level: 'Mid',
        roles: ['Data Scientist', 'ML Engineer'],
        timeline: '2-5 years',
        salary: { min: 100, max: 140 }
      },
      {
        level: 'Senior',
        roles: ['Senior Data Scientist', 'Data Science Manager'],
        timeline: '5+ years',
        salary: { min: 140, max: 200 }
      }
    ],
    'DevOps Engineering': [
      {
        level: 'Entry',
        roles: ['Junior DevOps Engineer', 'Cloud Engineer'],
        timeline: '0-2 years',
        salary: { min: 80, max: 125 }
      },
      {
        level: 'Mid',
        roles: ['DevOps Engineer', 'Site Reliability Engineer'],
        timeline: '2-5 years',
        salary: { min: 125, max: 175 }
      },
      {
        level: 'Senior',
        roles: ['Senior DevOps Engineer', 'Principal SRE'],
        timeline: '5+ years',
        salary: { min: 175, max: 275 }
      }
    ]
  };

  return progressions[careerName] || progressions['Software Engineering'];
}

function getMarketData(careerName) {
  const marketData = {
    'UX/UI Design': {
      avgSalary: '$85k - $140k',
      jobGrowthRate: '+13%',
      annualOpenings: 23900,
      workLifeBalance: '8.2/10'
    },
    'Software Engineering': {
      avgSalary: '$110k - $180k',
      jobGrowthRate: '+22%',
      annualOpenings: 189200,
      workLifeBalance: '7.5/10'
    },
    'Data Science': {
      avgSalary: '$95k - $165k',
      jobGrowthRate: '+22%',
      annualOpenings: 13500,
      workLifeBalance: '7.8/10'
    },
    'DevOps Engineering': {
      avgSalary: '$125k - $200k',
      jobGrowthRate: '+25%',
      annualOpenings: 15200,
      workLifeBalance: '7.5/10'
    }
  };

  return marketData[careerName] || marketData['Software Engineering'];
}

function getNextSteps(careerName, level) {
  const stepsByCareer = {
    'UX/UI Design': {
      'beginner': [
        'Learn design fundamentals and user research methods',
        'Build a portfolio with 3-5 design projects',
        'Join UC Davis Design Club and UX groups'
      ],
      'intermediate': [
        'Master advanced design tools (Figma, Adobe Creative Suite)',
        'Complete user research projects with real users',
        'Apply for UX design internships'
      ],
      'advanced': [
        'Lead design projects and mentor junior designers',
        'Specialize in areas like interaction design or design systems',
        'Build industry connections and pursue senior roles'
      ]
    },
    'Software Engineering': {
      'beginner': [
        'Master fundamental programming concepts',
        'Build 3-5 portfolio projects',
        'Join UC Davis programming clubs like #include'
      ],
      'intermediate': [
        'Learn system design and software architecture',
        'Contribute to open source projects',
        'Apply for software engineering internships'
      ],
      'advanced': [
        'Lead technical projects and mentor junior developers',
        'Specialize in areas like backend, frontend, or mobile',
        'Build industry connections and pursue senior roles'
      ]
    },
    'Data Science': {
      'beginner': [
        'Learn Python/R and basic statistics',
        'Complete data analysis projects',
        'Join AI Student Collective at UC Davis'
      ],
      'intermediate': [
        'Master machine learning algorithms',
        'Build end-to-end ML projects',
        'Apply for data science internships'
      ],
      'advanced': [
        'Specialize in deep learning or specific domains',
        'Publish research or contribute to ML communities',
        'Pursue senior data science roles'
      ]
    }
  };

  const defaultSteps = [
    'Build foundational skills in your chosen field',
    'Create portfolio projects to showcase abilities',
    'Connect with UC Davis Career Center for guidance'
  ];

  return stepsByCareer[careerName]?.[level] || defaultSteps;
}

function getDefaultMatches(topCareer) {
  const relatedCareers = {
    'UX/UI Design': [
      { career: 'UX/UI Design', category: 'Design', percentage: 85 },
      { career: 'Product Design', category: 'Design', percentage: 78 },
      { career: 'Web Design', category: 'Design', percentage: 72 },
      { career: 'Software Engineering', category: 'Engineering', percentage: 65 },
      { career: 'Product Management', category: 'Product', percentage: 58 }
    ],
    'Software Engineering': [
      { career: 'Software Engineering', category: 'Engineering', percentage: 90 },
      { career: 'Web Development', category: 'Engineering', percentage: 82 },
      { career: 'Mobile Development', category: 'Engineering', percentage: 75 },
      { career: 'DevOps Engineering', category: 'Engineering', percentage: 68 },
      { career: 'Data Engineering', category: 'Data', percentage: 60 }
    ],
    'Data Science': [
      { career: 'Data Science', category: 'Data', percentage: 88 },
      { career: 'Machine Learning Engineering', category: 'AI', percentage: 80 },
      { career: 'Data Engineering', category: 'Data', percentage: 73 },
      { career: 'Software Engineering', category: 'Engineering', percentage: 65 },
      { career: 'Research Scientist', category: 'Research', percentage: 58 }
    ]
  };

  return relatedCareers[topCareer] || relatedCareers['Software Engineering'];
}

// =============================================================================
// START SERVER - Your existing app.listen() should be right after these functions
// =============================================================================
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
