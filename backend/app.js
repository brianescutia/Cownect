const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const session = require('express-session');  // For user session management
const MongoStore = require('connect-mongo');  // Store sessions in MongoDB
const User = require('../backend/models/User');        // Import our User model
const Club = require('./models/Club');
const { CareerField, QuizQuestion, QuizResult } = require('./models/nicheQuizModels');
const Event = require('./models/eventModel'); // Import Event model for events API
// Add this with your other imports (around line 10)
const { processQuizSubmission } = require('./quiz-scoring');
const { sendVerificationEmail, sendPasswordResetEmail } = require('./emailService');

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

function redirectLoggedInUsers(req, res, next) {
  if (req.session && req.session.userId) {
    console.log(`🔀 Redirecting logged-in user ${req.session.userEmail} to tech-clubs`);
    return res.redirect('/tech-clubs');
  }
  next();
}

// =============================================================================
// ROUTES
// =============================================================================

// 🏠 HOME ROUTE
app.get('/', redirectLoggedInUsers, (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/pages/index.html'));
});

// =============================================================================
// AUTHENTICATION ROUTES
// =============================================================================

// 🚪 LOGIN ROUTES
app.get('/login', redirectLoggedInUsers, (req, res) => {
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

    //Check EMAIL Verification
    if (!user.isVerified) {
      console.log(`🔍 User ${user.email} is not verified. Redirecting to verification page.`);
      return res.redirect(`/verify-email-prompt?email=${encodeURIComponent(user.email)}&error=not_verified`);
    }

    // Step 3: 🎟️ ISSUE THE WRISTBAND! Store user info in session
    req.session.userId = user._id;
    req.session.userEmail = user.email;

    console.log('Login successful, session created for:', user.email);
    res.redirect('/tech-clubs');

  } catch (err) {
    console.error('Login error:', err);
    res.redirect('/login?error=server');
  }
});

// 📝 SIGNUP ROUTES
app.use((err, req, res, next) => {
  console.error('💥 Unhandled error:', err);

  // Check if response was already sent
  if (res.headersSent) {
    console.error('⚠️ Headers already sent, cannot send error response');
    return next(err);
  }

  // Send error response
  res.status(500).json({ error: 'Something went wrong!' });
});

app.use((req, res, next) => {
  console.log(`🔍 ${req.method} ${req.path} - ${new Date().toISOString()}`);

  // Log when response is finished
  res.on('finish', () => {
    console.log(`✅ Response sent: ${res.statusCode} for ${req.method} ${req.path}`);
  });

  next();
});
app.get('/signup', redirectLoggedInUsers, (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/pages/signup.html'));
});

app.get('/verify-email-prompt', (req, res) => {
  console.log('📧 Verify email prompt accessed');
  res.sendFile(path.join(__dirname, '../frontend/pages/verify-email-prompt.html'));
});

app.post('/signup', async (req, res) => {
  const { email, password } = req.body;

  console.log('📝 JSON Signup attempt for:', email);

  try {
    // Step 1: Basic validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      });
    }

    // Step 2: Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      console.log('❌ User already exists:', email);
      return res.status(409).json({
        success: false,
        error: 'An account with this email already exists',
        redirectTo: '/login'
      });
    }

    // Step 3: Validate UC Davis email domain
    if (!email.toLowerCase().endsWith('@ucdavis.edu')) {
      console.log('❌ Invalid email domain:', email);
      return res.status(400).json({
        success: false,
        error: 'Please use your UC Davis email address (@ucdavis.edu)'
      });
    }

    // Step 4: Validate password
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters long'
      });
    }

    // Step 5: Create new user
    console.log('🔨 Creating new user...');
    const newUser = new User({
      email: email.toLowerCase(),
      password: password,
      isVerified: false
    });

    // Step 6: Generate verification token
    console.log('🎟️ Generating verification token...');
    const verificationToken = newUser.generateVerificationToken();

    // Step 7: Save user to database  
    await newUser.save();
    console.log('✅ User saved to database');

    // Step 8: Send verification email
    console.log('📧 Attempting to send verification email...');
    let emailSent = false;

    try {
      const { sendVerificationEmail } = require('./emailService');
      const emailResult = await sendVerificationEmail(newUser.email, verificationToken);
      emailSent = emailResult.success;

      if (emailSent) {
        console.log('✅ Verification email sent successfully');
      } else {
        console.error('⚠️ Failed to send verification email:', emailResult.error);
      }
    } catch (emailError) {
      console.error('💥 Email service error:', emailError);
    }

    // Step 9: Return success response with redirect info
    console.log('✅ Signup successful, sending JSON response');
    return res.status(201).json({
      success: true,
      message: 'Account created successfully! Please check your email.',
      user: {
        email: newUser.email,
        isVerified: newUser.isVerified
      },
      emailSent: emailSent,
      redirectTo: `/verify-email-prompt?email=${encodeURIComponent(newUser.email)}`
    });

  } catch (err) {
    console.error('💥 Signup error:', err);

    // Handle MongoDB duplicate key error
    if (err.code === 11000) {
      return res.status(409).json({
        success: false,
        error: 'An account with this email already exists',
        redirectTo: '/login'
      });
    }

    // Handle validation errors
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid user data: ' + err.message
      });
    }

    // Handle other errors
    return res.status(500).json({
      success: false,
      error: 'Server error occurred. Please try again later.'
    });
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

// =============================================================================
// EVENTS PAGE ROUTES - Add these to your backend/app.js
// Replace the commented out event routes with these enhanced versions
// =============================================================================

// 📅 EVENTS PAGE ROUTE - Serve the events HTML page
app.get('/events', requireAuth, (req, res) => {
  console.log('Events page accessed by:', req.session.userEmail);
  res.sendFile(path.join(__dirname, '../frontend/pages/events.html'));
});

// 🔍 GET ALL EVENTS - Enhanced version with filtering
app.get('/api/events', requireAuth, async (req, res) => {
  try {
    console.log('📅 Fetching events...');

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

    console.log(`✅ Found ${events.length} events`);

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
    console.error('💥 Error fetching events:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// 🌟 GET FEATURED EVENTS - Top 3 events for the main display
app.get('/api/events/featured', requireAuth, async (req, res) => {
  try {
    console.log('🌟 Fetching featured events...');

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

    console.log(`✅ Found ${enhancedFeaturedEvents.length} featured events`);
    res.json(enhancedFeaturedEvents);

  } catch (error) {
    console.error('💥 Error fetching featured events:', error);
    res.status(500).json({ error: 'Failed to fetch featured events' });
  }
});

// 📅 GET EVENTS BY DATE - For calendar functionality
app.get('/api/events/date/:date', requireAuth, async (req, res) => {
  try {
    const { date } = req.params;
    console.log(`📅 Fetching events for date: ${date}`);

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


// 📊 GET CALENDAR DATA - Event counts by date for calendar visualization
app.get('/api/events/calendar/:year/:month', requireAuth, async (req, res) => {
  try {
    const { year, month } = req.params;
    console.log(`📊 Fetching calendar data for ${year}-${month}`);

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

    console.log(`✅ Found events for ${calendarData.length} days in ${year}-${month}`);
    res.json(calendarData);

  } catch (error) {
    console.error('💥 Error fetching calendar data:', error);
    res.status(500).json({ error: 'Failed to fetch calendar data' });
  }
});

// 📝 CREATE NEW EVENT - Enhanced version
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

    console.log('📅 New event created:', newEvent.title);
    res.status(201).json(newEvent);

  } catch (error) {
    console.error('💥 Error creating event:', error);
    res.status(500).json({ error: 'Failed to create event' });
  }
});

// 🖼️ UPDATE CLUB IMAGES - Add this route
app.put('/api/clubs/:id/images', requireAuth, async (req, res) => {
  try {
    const clubId = req.params.id;
    const { logoUrl, heroImageUrl } = req.body;

    const updateData = {};
    if (logoUrl) updateData.logoUrl = logoUrl;
    if (heroImageUrl) updateData.heroImageUrl = heroImageUrl;

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
      "American Institute of Chemical Engineers": "https://aiche.ucdavis.edu/sites/g/files/dgvnsk5996/files/styles/sf_image_banner/public/media/images/IMG_2282_1_80.jpeg?itok=9hOLB5ns",
    };

    let updated = 0;

    for (const [clubName, heroUrl] of Object.entries(heroImages)) {
      const club = await Club.findOneAndUpdate(
        { name: clubName },
        { heroImageUrl: heroUrl },
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

//RESIZE A CLUBS HERO IMAGE 
app.get('/api/apply-custom-hero-sizing', requireAuth, async (req, res) => {
  try {
    console.log('🎨 Applying custom hero image sizing...');

    // Club-specific customizations
    const clubCustomizations = [
      {
        name: "#include",
        heroImageUrl: "https://includedavis.com/_next/image?url=%2Fabout%2Fimages%2FdescPic.jpg&w=1200&q=75", // Reduced from w=3840
        customCSS: { backgroundSize: '10%', backgroundPosition: 'center' }
      },
      {
        name: "Aggie Sports Analytics",
        heroImageUrl: "https://aggiesportsanalytics.com/_next/image?url=%2Fhp3bw.png&w=1200&q=75", // Reduced from w=3840
        customCSS: { backgroundSize: 'cover', backgroundPosition: 'center bottom' }
      },
      {
        name: "Google Developer Student Club",
        heroImageUrl: "https://storage.googleapis.com/creatorspace-public/users%2Fcln22djyd00i1p301whvmgxbp%2FAXLN0jmEde3yHgMf-IMG_4612.JPG=s1200", // Added =s1200
        customCSS: { backgroundSize: '120%', backgroundPosition: 'center' }
      },
      {
        name: "HackDavis",
        heroImageUrl: "https://miro.medium.com/v2/resize:fit:1200/1*YQl_MmSsFEmQUGleWrX1LA.jpeg", // Changed fit:1400 to fit:1200
        customCSS: { backgroundSize: 'contain', backgroundPosition: 'center' }
      },
      {
        name: "Women in Computer Science",
        heroImageUrl: "https://engineering.ucdavis.edu/sites/g/files/dgvnsk2151/files/styles/sf_landscape_16x9/public/media/images/wics-04.jpg?h=a1e1a043&itok=1dnFRIkJ&width=1200", // Added &width=1200
        customCSS: { backgroundSize: 'cover', backgroundPosition: '30% 40%' }
      },
      {
        name: "AI Student Collective",
        heroImageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=600&fit=crop&crop=center", // Added sizing params
        customCSS: { backgroundSize: 'cover', backgroundPosition: 'left center' }
      },
      {
        name: "CodeLab",
        heroImageUrl: "https://codelabdavis.com/_astro/GroupPhoto.BmIde2tY_Z1vc07W.webp",
        customCSS: { backgroundSize: '100% 100%', backgroundPosition: 'center' } // Stretch to fit
      },
      {
        name: "Design Interactive",
        heroImageUrl: "https://davisdi.org/wp-content/uploads/2023/01/BDF3EBAA-352B-419A-BBF1-39BC872177FC_1_105_c-1.jpeg",
        customCSS: { backgroundSize: '70%', backgroundPosition: 'center' }
      }
    ];

    let updated = 0;
    const results = [];

    for (const customization of clubCustomizations) {
      // Update the club with new hero URL and custom CSS properties
      const updateData = {
        heroImageUrl: customization.heroImageUrl
      };

      // Add custom CSS properties if they exist
      if (customization.customCSS) {
        updateData.heroImageCSS = customization.customCSS;
      }

      const club = await Club.findOneAndUpdate(
        { name: customization.name },
        updateData,
        { new: true }
      );

      if (club) {
        updated++;
        results.push(`✅ ${customization.name}: Updated with custom sizing`);
        console.log(`✅ Updated with custom sizing: ${customization.name}`);
      } else {
        results.push(`❌ ${customization.name}: Not found`);
        console.log(`❌ Not found: ${customization.name}`);
      }
    }

    res.json({
      message: `Applied custom sizing to ${updated} clubs`,
      updated: updated,
      total: clubCustomizations.length,
      details: results
    });

  } catch (error) {
    console.error('💥 Error applying custom sizing:', error);
    res.status(500).json({ error: 'Failed to apply custom sizing' });
  }
});

// METHOD 4: Individual club resizing route
app.put('/api/clubs/:id/resize', requireAuth, async (req, res) => {
  try {
    const { clubId } = req.params;
    const {
      heroImageUrl,
      backgroundSize = 'cover',
      backgroundPosition = 'center'
    } = req.body;

    // Update club with new sizing
    const club = await Club.findByIdAndUpdate(
      clubId,
      {
        heroImageUrl: heroImageUrl,
        heroImageCSS: {
          backgroundSize: backgroundSize,
          backgroundPosition: backgroundPosition
        }
      },
      { new: true }
    );

    if (!club) {
      return res.status(404).json({ error: 'Club not found' });
    }

    console.log(`✅ Updated sizing for: ${club.name}`);
    res.json({
      message: 'Club hero image sizing updated successfully',
      club: club
    });

  } catch (error) {
    console.error('💥 Error updating club sizing:', error);
    res.status(500).json({ error: 'Failed to update club sizing' });
  }
});

// 🎟️ JOIN EVENT - Enhanced version
app.post('/api/events/:id/join', requireAuth, async (req, res) => {
  try {
    const eventId = req.params.id;
    const userId = req.session.userId;

    console.log(`🎟️ User ${req.session.userEmail} attempting to join event ${eventId}`);

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

    console.log(`✅ User ${req.session.userEmail} successfully joined event: ${event.title}`);

    res.json({
      success: true,
      message: 'Successfully joined event',
      eventTitle: event.title,
      attendeeCount: event.attendees.length,
      eventId: eventId,
      isJoined: true
    });

  } catch (error) {
    console.error('💥 Error joining event:', error);
    res.status(500).json({ error: 'Failed to join event' });
  }
});


// 🗑️ LEAVE EVENT
app.delete('/api/events/:id/join', requireAuth, async (req, res) => {
  try {
    const eventId = req.params.id;
    const userId = req.session.userId;

    console.log(`🚪 User ${req.session.userEmail} attempting to leave event ${eventId}`);

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

    console.log(`✅ User ${req.session.userEmail} successfully left event: ${event.title}`);

    res.json({
      success: true,
      message: 'Successfully left event',
      eventTitle: event.title,
      attendeeCount: event.attendees.length,
      eventId: eventId,
      isJoined: false
    });

  } catch (error) {
    console.error('💥 Error leaving event:', error);
    res.status(500).json({ error: 'Failed to leave event' });
  }
});
app.get('/niche-landing', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/pages/niche-landing.html'));
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
    console.error('💥 Error checking event status:', error);
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


// 👤 USER DASHBOARD - Protected route for user profile and management
app.get('/dashboard', requireAuth, (req, res) => {
  console.log('Dashboard accessed by:', req.session.userEmail);
  res.sendFile(path.join(__dirname, '../frontend/pages/dashboard.html'));
});

// 🏛️ GET ALL CLUBS - Replace static HTML cards
app.get('/api/clubs', async (req, res) => {
  try {
    const clubs = await Club.find({ isActive: true })
      .sort({ name: 1 })
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
    const {
      q,           // Search query
      tags,        // Comma-separated tags
      category,    // Single category
      sortBy,      // Sort field: 'name', 'members', 'newest'
      sortOrder,   // 'asc' or 'desc'
      page,        // Page number (default 1)
      limit        // Results per page (default 10)
    } = req.query;

    console.log('🔍 Advanced search request:', req.query);

    // 📊 BUILD SEARCH PIPELINE
    let searchCriteria = { isActive: true };
    let sortCriteria = {};

    // 🔤 TEXT SEARCH - Search across multiple fields
    if (q && q.trim()) {
      searchCriteria.$or = [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { tags: { $in: [new RegExp(q, 'i')] } }
      ];
    }

    // 🏷️ TAG FILTERING - Support multiple tags
    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim().toLowerCase());
      // Use $in for "OR" logic (club has ANY of these tags)
      searchCriteria.tags = { $in: tagArray };

      // For "AND" logic (club has ALL tags), use:
      // searchCriteria.tags = { $all: tagArray };
    }

    // 📂 CATEGORY FILTERING
    if (category && category !== 'all') {
      searchCriteria.category = category;
    }

    // 📈 SORTING LOGIC
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

    // 📄 PAGINATION SETUP
    const pageNum = parseInt(page) || 1;
    const pageLimit = parseInt(limit) || 10;
    const skip = (pageNum - 1) * pageLimit;

    // 🗃️ EXECUTE SEARCH WITH PAGINATION
    const [clubs, totalCount] = await Promise.all([
      Club.find(searchCriteria)
        .sort(sortCriteria)
        .skip(skip)
        .limit(pageLimit)
        .lean(), // .lean() for better performance

      Club.countDocuments(searchCriteria) // Get total for pagination
    ]);

    // 📊 CALCULATE PAGINATION INFO
    const totalPages = Math.ceil(totalCount / pageLimit);
    const hasNextPage = pageNum < totalPages;
    const hasPreviousPage = pageNum > 1;

    console.log(`✅ Search found ${totalCount} clubs, returning page ${pageNum}/${totalPages}`);

    // 📤 SEND COMPREHENSIVE RESPONSE
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
    console.error('💥 Search error:', error);
    res.status(500).json({
      error: 'Search failed',
      message: error.message
    });
  }
});

// 📊 GET SEARCH METADATA - Categories, popular tags, etc.
app.get('/api/clubs/metadata', async (req, res) => {
  try {
    console.log('📊 Fetching club metadata...');

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

    console.log(`📊 Metadata: ${categories.length} categories, ${tagStats.length} tags, ${totalClubs} clubs`);

  } catch (error) {
    console.error('💥 Metadata error:', error);
    res.status(500).json({ error: 'Failed to fetch metadata' });
  }
});

// =============================================================================
// ADD THESE ROUTES TO YOUR backend/app.js FILE
// =============================================================================
// Insert these routes after your existing club routes

// 🏛️ CLUB DETAIL PAGE - Serve the club detail HTML
app.get('/club/:id', requireAuth, (req, res) => {
  console.log('Club detail page accessed for ID:', req.params.id);
  res.sendFile(path.join(__dirname, '../frontend/pages/club-detail.html'));
});

// 🔍 GET SINGLE CLUB DETAILS - API endpoint for club data
app.get('/api/clubs/:id', async (req, res) => {
  try {
    const clubId = req.params.id;
    console.log(`📡 Fetching club details for ID: ${clubId}`);

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

    console.log(`✅ Club found: ${club.name}`);

    // Return club data
    res.json(club);

  } catch (error) {
    console.error('💥 Error fetching club details:', error);
    res.status(500).json({
      error: 'Failed to fetch club details',
      message: error.message
    });
  }
});

// 🔍 GET CLUB EVENTS - API endpoint for club events (placeholder for now)
app.get('/api/clubs/:id/events', async (req, res) => {
  try {
    const clubId = req.params.id;
    console.log(`📅 Fetching events for club ID: ${clubId}`);

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
    console.error('💥 Error fetching club events:', error);
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
// NICHE QUIZ ROUTES - Add these AFTER app creation
// =============================================================================

// 🎯 NICHE QUIZ PAGE
app.get('/niche-quiz', requireAuth, (req, res) => {
  console.log('Niche quiz accessed by:', req.session.userEmail);
  res.sendFile(path.join(__dirname, '../frontend/pages/niche-quiz.html'));
});

// 🎯 GET QUIZ INTRO - Show available levels and preview
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
    console.error('💥 Quiz intro error:', error);
    res.status(500).json({ error: 'Failed to load quiz introduction' });
  }
});

// 📝 GET QUIZ QUESTIONS - Load questions for specific level
app.get('/api/quiz/questions/:level', async (req, res) => {
  try {
    const { level } = req.params;

    if (!['beginner', 'intermediate', 'advanced'].includes(level)) {
      return res.status(400).json({ error: 'Invalid quiz level' });
    }

    console.log(`📋 Loading ${level} quiz questions...`);

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
    console.error('💥 Quiz questions error:', error);
    res.status(500).json({ error: 'Failed to load quiz questions' });
  }
});

// =============================================================================
// ENHANCED NICHE QUIZ BACKEND ROUTES - Add to your backend/app.js
// =============================================================================

// 📝 SUBMIT QUIZ AND CALCULATE RESULTS
// =============================================================================
// QUIZ SCORING SYSTEM - Add to backend/app.js
// =============================================================================
// Replace your existing /api/quiz/submit route with this enhanced version

// 📤 ENHANCED QUIZ SUBMISSION WITH REAL SCORING
app.post('/api/quiz/submit', requireAuth, async (req, res) => {
  try {
    const { level, answers, completionTime } = req.body;
    const userId = req.session.userId;

    console.log(`📝 Processing quiz submission for user: ${req.session.userEmail}`);
    console.log(`📊 Received ${answers.length} answers for ${level} level`);

    // Validate input
    if (!level || !answers || !Array.isArray(answers)) {
      return res.status(400).json({ error: 'Invalid submission data' });
    }

    // Get questions and clubs from database
    const questions = await QuizQuestion.find({
      questionLevel: level,
      isActive: true
    }).sort({ order: 1 });

    const allClubs = await Club.find({ isActive: true });

    if (questions.length === 0) {
      console.log('⚠️ No questions found, using fallback results');
      return res.json({
        success: true,
        results: getFallbackResults()
      });
    }

    // 🎯 USE REAL SCORING ALGORITHM
    console.log('🚀 Using real scoring algorithm...');
    const results = await processQuizSubmission(answers, questions, level, allClubs);

    // 💾 SIMPLIFIED DATABASE SAVING (Fixed)
    try {
      const newResult = new QuizResult({
        user: userId,
        quizLevel: level,
        answers: answers,
        skillScores: results.skillBreakdown,
        completionTime: completionTime,
        // Store top match as simple strings instead of ObjectId references
        topMatch: {
          careerName: results.topMatch.career,        // Store as string
          percentage: results.topMatch.percentage,
          nextSteps: results.topMatch.nextSteps,
          // Don't store club references for now to avoid ObjectId issues
        }
      });

      await newResult.save();
      console.log('✅ Quiz result saved successfully with real algorithm');
    } catch (saveError) {
      console.error('⚠️ Failed to save quiz result to database:', saveError.message);
      // Continue anyway - the important part is returning results to user
      console.log('✅ Continuing without saving to database');
    }

    res.json({
      success: true,
      results: results
    });

  } catch (error) {
    console.error('💥 Quiz submission error:', error);

    // Always return fallback results to ensure quiz works
    res.json({
      success: true,
      results: getFallbackResults()
    });
  }
});

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
  console.log('🧮 Calculating user skill profile...');

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
      console.warn(`⚠️ No question found for answer index ${answerIndex}`);
      return;
    }

    console.log(`📝 Processing answer for question: "${question.questionText}"`);

    // Get the user's ranking (array of option indices in order of preference)
    const userRanking = answer.ranking;

    // Calculate weighted scores based on ranking position
    userRanking.forEach((optionIndex, rankPosition) => {
      const option = question.options[optionIndex];
      if (!option || !option.weights) {
        console.warn(`⚠️ Invalid option or weights for option index ${optionIndex}`);
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
  console.log('🎯 Calculating career matches...');

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

app.get('/api/quiz/results/:userId', requireAuth, async (req, res) => {
  try {
    const results = await QuizResult.find({ user: req.session.userId })
      .populate('topMatch.field')
      .populate('topMatch.recommendedClubs')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({ results });
  } catch (error) {
    console.error('Error fetching quiz results:', error);
    res.status(500).json({ error: 'Failed to fetch quiz results' });
  }
});
// =============================================================================
//Email Verification
// =============================================================================
const { requireAuth: requireAuthentication, requireVerification } = require('../backend/authMiddleware');

// Replace your existing signup route
app.post('/signup', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Step 1: Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      return res.redirect('/signup?error=exists');
    }

    // Step 2: Validate UC Davis email domain
    if (!email.toLowerCase().endsWith('@ucdavis.edu')) {
      return res.redirect('/signup?error=email');
    }

    // Step 3: Create new user (NOT VERIFIED initially)
    const newUser = new User({
      email: email.toLowerCase(),
      password: password,
      isVerified: false  // ✅ Start unverified
    });

    // Step 4: Generate verification token
    const verificationToken = newUser.generateVerificationToken();
    await newUser.save();

    // Step 5: Send verification email
    const emailResult = await sendVerificationEmail(newUser.email, verificationToken);

    if (!emailResult.success) {
      console.error('Failed to send verification email:', emailResult.error);
      // Continue anyway - user can request resend later
    }

    // Step 6: DON'T auto-login - redirect to verification prompt
    console.log('New user created, verification email sent:', newUser.email);
    res.redirect('/verify-email-prompt?email=' + encodeURIComponent(newUser.email));

  } catch (err) {
    console.error('Signup error:', err);
    if (err.code === 11000) {
      return res.redirect('/signup?error=exists');
    }
    res.redirect('/signup?error=server');
  }
});

// ✅ EMAIL VERIFICATION ROUTES

// Show verification prompt page
app.get('/verify-email-prompt', (req, res) => {
  // Allow both logged-in and non-logged-in users
  res.sendFile(path.join(__dirname, '../frontend/pages/verify-email-prompt.html'));
});

// Verify email token
app.get('/verify-email', async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.redirect('/verify-email-prompt?error=missing_token');
    }

    // Find user with this verification token
    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.redirect('/verify-email-prompt?error=invalid_token');
    }

    // Mark user as verified
    user.isVerified = true;
    user.verificationToken = null;
    user.verificationTokenExpires = null;
    await user.save();

    // Auto-login the verified user
    req.session.userId = user._id;
    req.session.userEmail = user.email;

    console.log('✅ Email verified and user logged in:', user.email);
    res.redirect('/tech-clubs?verified=true');

  } catch (error) {
    console.error('Email verification error:', error);
    res.redirect('/verify-email-prompt?error=server');
  }
});

// Resend verification email
app.post('/api/resend-verification', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
      isVerified: false
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found or already verified' });
    }

    // Generate new verification token
    const verificationToken = user.generateVerificationToken();
    await user.save();

    // Send new verification email
    const emailResult = await sendVerificationEmail(user.email, verificationToken);

    if (emailResult.success) {
      res.json({ message: 'Verification email sent successfully' });
    } else {
      res.status(500).json({ error: 'Failed to send verification email' });
    }

  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});
// =============================================================================
// START SERVER
// =============================================================================

app.listen(port, () => {
  console.log(`🚀 Cownect server running at http://localhost:${port}`);
  console.log(`📊 Database: MongoDB Atlas`);
  console.log(`🔐 Authentication: bcrypt + sessions`);
  console.log(`🎯 Quiz system: Ready!`);

});
