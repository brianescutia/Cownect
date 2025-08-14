// =============================================================================
// UPDATED USER MODEL - backend/models/User.js
// Replace your existing User model with this enhanced version
// =============================================================================

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    // EMAIL FIELD - UC DAVIS ONLY
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate: {
            validator: function (email) {
                // ✅ ENFORCE UC DAVIS EMAIL AT DATABASE LEVEL
                return email && email.endsWith('@ucdavis.edu');
            },
            message: 'Only UC Davis email addresses (@ucdavis.edu) are allowed'
        },
        match: [/^[a-zA-Z0-9._%+-]+@ucdavis\.edu$/, 'Please enter a valid UC Davis email address']
    },

    // PASSWORD FIELD - Optional for Google users
    password: {
        type: String,
        required: function () {
            return !this.googleId;  // Only required if not a Google user
        },
        minlength: 6
    },

    // ✅ NEW: Google OAuth fields
    googleId: {
        type: String,
        unique: true,
        sparse: true  // Allows null values to be non-unique
    },
    provider: {
        type: String,
        enum: ['local', 'google'],
        default: 'google'
    },

    lastLoginAt: {
        type: Date,
        default: null
    },

    authMethod: {
        type: String,
        enum: ['email', 'google', 'both'],
        default: 'email'
    },

    // BOOKMARKED CLUBS - Array of club IDs
    bookmarkedClubs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Club'
    }],

    // BOOKMARKED EVENTS - Array of event IDs
    bookmarkedEvents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
    }],

    // TIMESTAMP - Track when user account was created
    createdAt: {
        type: Date,
        default: Date.now
    },

    // ✅ EMAIL VERIFICATION FIELDS (apply to ALL users, including Google)
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationToken: {
        type: String,
        default: null
    },
    verificationTokenExpires: {
        type: Date,
        default: null
    },
    passwordResetToken: {
        type: String,
        default: null
    },
    passwordResetExpires: {
        type: Date,
        default: null
    },
});

// =============================================================================
// PASSWORD HASHING MIDDLEWARE (only for email users)
// =============================================================================
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        // Skip hashing for Google OAuth placeholder passwords
        if (this.password.startsWith('google-oauth-')) {
            return next();
        }

        // Hash regular passwords (if you ever add them back)
        const hashedPassword = await bcrypt.hash(this.password, 12);
        this.password = hashedPassword;
        next();
    } catch (error) {
        next(error);
    }
});

// =============================================================================
// AUTHENTICATION METHODS
// =============================================================================

// Password comparison (for email users)
userSchema.methods.comparePassword = async function (candidatePassword) {
    if (!this.password) {
        throw new Error('This account uses Google authentication');
    }
    return bcrypt.compare(candidatePassword, this.password);
};

// Check if user can use email/password login
userSchema.methods.canUsePasswordAuth = function () {
    return this.password && (this.authMethod === 'email' || this.authMethod === 'both');
};

// Check if user can use Google login
userSchema.methods.canUseGoogleAuth = function () {
    return this.googleId && (this.authMethod === 'google' || this.authMethod === 'both');
};

// Update authentication method when linking accounts
userSchema.methods.linkGoogleAccount = function (googleId) {
    this.googleId = googleId;
    this.authMethod = this.password ? 'both' : 'google';
    this.lastLoginAt = new Date();
};

userSchema.methods.linkEmailPassword = function (password) {
    this.password = password;
    this.authMethod = this.googleId ? 'both' : 'email';
};

// =============================================================================
// VERIFICATION TOKEN METHODS (apply to all users)
// =============================================================================

userSchema.methods.generateVerificationToken = function () {
    const token = crypto.randomBytes(32).toString('hex');
    this.verificationToken = token;
    this.verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    return token;
};

// Generate password reset token
userSchema.methods.generatePasswordResetToken = function () {
    if (!this.canUsePasswordAuth()) {
        throw new Error('This account uses Google authentication');
    }
    const token = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = token;
    this.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    return token;
};

// =============================================================================
// CLUB BOOKMARK METHODS (unchanged)
// =============================================================================

userSchema.methods.addBookmark = async function (clubId) {
    if (!this.bookmarkedClubs.includes(clubId)) {
        this.bookmarkedClubs.push(clubId);
        await this.save();
        console.log(`✅ Added club bookmark: ${clubId} for user ${this.email}`);
        return true;
    }
    console.log(`⚠️ Club ${clubId} already bookmarked by ${this.email}`);
    return false;
};

userSchema.methods.removeBookmark = async function (clubId) {
    const initialLength = this.bookmarkedClubs.length;
    this.bookmarkedClubs = this.bookmarkedClubs.filter(id => !id.equals(clubId));

    if (this.bookmarkedClubs.length < initialLength) {
        await this.save();
        console.log(`✅ Removed club bookmark: ${clubId} for user ${this.email}`);
        return true;
    }
    console.log(`⚠️ Club ${clubId} was not bookmarked by ${this.email}`);
    return false;
};

userSchema.methods.hasBookmarked = function (clubId) {
    return this.bookmarkedClubs.some(id => id.equals(clubId));
};

userSchema.methods.getBookmarkCount = function () {
    return this.bookmarkedClubs.length;
};

// =============================================================================
// EVENT BOOKMARK METHODS (unchanged)
// =============================================================================

userSchema.methods.addEventBookmark = async function (eventId) {
    if (!this.bookmarkedEvents.includes(eventId)) {
        this.bookmarkedEvents.push(eventId);
        await this.save();
        console.log(`✅ Added event bookmark: ${eventId} for user ${this.email}`);
        return true;
    }
    console.log(`⚠️ Event ${eventId} already bookmarked by ${this.email}`);
    return false;
};

userSchema.methods.removeEventBookmark = async function (eventId) {
    const initialLength = this.bookmarkedEvents.length;
    this.bookmarkedEvents = this.bookmarkedEvents.filter(id => !id.equals(eventId));

    if (this.bookmarkedEvents.length < initialLength) {
        await this.save();
        console.log(`✅ Removed event bookmark: ${eventId} for user ${this.email}`);
        return true;
    }
    console.log(`⚠️ Event ${eventId} was not bookmarked by ${this.email}`);
    return false;
};

userSchema.methods.hasEventBookmarked = function (eventId) {
    return this.bookmarkedEvents.some(id => id.equals(eventId));
};

userSchema.methods.getEventBookmarkCount = function () {
    return this.bookmarkedEvents.length;
};

// =============================================================================
// STATIC METHODS (unchanged)
// =============================================================================

userSchema.statics.findWithBookmarks = function (userId) {
    return this.findById(userId)
        .populate('bookmarkedClubs')
        .populate('bookmarkedEvents')
        .select('-password');
};

userSchema.statics.findWithClubBookmarks = function (userId) {
    return this.findById(userId)
        .populate('bookmarkedClubs')
        .select('-password');
};

userSchema.statics.findWithEventBookmarks = function (userId) {
    return this.findById(userId)
        .populate('bookmarkedEvents')
        .select('-password');
};

// =============================================================================
// NEW STATIC METHODS FOR OAUTH
// =============================================================================

// Find user by email or Google ID
userSchema.statics.findByEmailOrGoogleId = function (email, googleId) {
    const query = {
        $or: [
            { email: email.toLowerCase() },
            ...(googleId ? [{ googleId: googleId }] : [])
        ]
    };
    return this.findOne(query);
};

// Get user's authentication methods
userSchema.statics.getAuthMethods = function (email) {
    return this.findOne({ email: email.toLowerCase() })
        .select('authMethod googleId password')
        .then(user => {
            if (!user) return null;
            return {
                hasPassword: !!user.password,
                hasGoogle: !!user.googleId,
                authMethod: user.authMethod
            };
        });
};

module.exports = mongoose.model('User', userSchema);

// =============================================================================
// MIGRATION SCRIPT (run once to update existing users)
// =============================================================================
/*
Run this script once to update existing users:

async function migrateExistingUsers() {
    const User = require('./models/User');
    
    // Update existing users without authMethod
    await User.updateMany(
        { authMethod: { $exists: false } },
        { authMethod: 'email' }
    );
    
    console.log('Migration completed');
}

// Run: node -e "require('./backend/models/User.js'); migrateExistingUsers();"
*/