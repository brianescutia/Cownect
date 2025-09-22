const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./models/User');

const callbackURL = process.env.NODE_ENV === 'production'
    ? 'https://cownect-production.up.railway.app/auth/google/callback'
    : 'http://localhost:3000/auth/google/callback';

// Debug logging
console.log('🔐 Google OAuth Configuration:');
console.log('   Environment:', process.env.NODE_ENV);
console.log('   Callback URL:', callbackURL);
console.log('   Client ID exists:', !!process.env.GOOGLE_CLIENT_ID);
console.log('   Client Secret exists:', !!process.env.GOOGLE_CLIENT_SECRET);

// Configure Google OAuth Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: callbackURL,  // Fixed: now using the variable with HTTPS
    proxy: true
},
    async (accessToken, refreshToken, profile, done) => {
        try {
            console.log('🔍 Google OAuth Profile:', profile.emails[0].value);

            const email = profile.emails[0].value;

            // CRITICAL: Only allow UC Davis emails
            if (!email.endsWith('@ucdavis.edu')) {
                console.log('❌ Non-UC Davis email attempted:', email);
                return done(null, false, {
                    message: 'Please use your UC Davis email address (@ucdavis.edu)'
                });
            }

            // Check if user already exists
            let user = await User.findOne({ email: email.toLowerCase() });

            if (user) {
                // User exists - check verification status
                if (!user.isVerified) {
                    console.log('⚠️ Google user exists but not verified:', email);
                    // Auto-verify Google users since Google already verified the email
                    user.isVerified = true;
                    user.googleId = profile.id;
                    await user.save();
                    console.log('✅ Auto-verified Google user:', email);
                } else {
                    // Just update Google ID if not set
                    if (!user.googleId) {
                        user.googleId = profile.id;
                        await user.save();
                    }
                }
                return done(null, user);
            } else {
                // Create new user - auto-verified since it's Google OAuth
                const newUser = new User({
                    email: email.toLowerCase(),
                    password: 'google-oauth-' + profile.id, // Placeholder password
                    isVerified: true, // ✅ Auto-verify Google users
                    googleId: profile.id,
                    provider: 'google'
                });

                await newUser.save();
                console.log('✅ Created new verified Google user:', email);
                return done(null, newUser);
            }
        } catch (error) {
            console.error('💥 Google OAuth error:', error);
            return done(error, null);
        }
    }));

// Serialize user for session
passport.serializeUser((user, done) => {
    done(null, user._id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

module.exports = passport;