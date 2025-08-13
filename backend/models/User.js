// =============================================================================
// UPDATED USER MODEL - Now with Club AND Event Bookmarks Support
// =============================================================================

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    // EMAIL FIELD - User's login identifier
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },

    googleId: {
        type: String,
        unique: true,
        sparse: true // Allows null values to be non-unique
    },
    name: {
        type: String,
        trim: true
    },

    isVerified: {
        type: Boolean,
        default: true // Google accounts are pre-verified
    },

    // Keep your existing bookmark fields
    bookmarkedClubs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Club'
    }],

    bookmarkedEvents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
    }],

    createdAt: {
        type: Date,
        default: Date.now
    }
});
userSchema.methods.generateVerificationToken = function () {
    const token = crypto.randomBytes(32).toString('hex');
    this.verificationToken = token;
    this.verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    return token;
};

// Generate password reset token
userSchema.methods.generatePasswordResetToken = function () {
    const token = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = token;
    this.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    return token;
};

// =============================================================================
// PASSWORD HASHING MIDDLEWARE
// =============================================================================
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        const hashedPassword = await bcrypt.hash(this.password, 12);
        this.password = hashedPassword;
        next();
    } catch (error) {
        next(error);
    }
});

// =============================================================================
// PASSWORD COMPARISON METHOD
// =============================================================================
userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

// =============================================================================
// CLUB BOOKMARK METHODS
// =============================================================================

// ADD CLUB BOOKMARK - Add club to user's bookmarks
userSchema.methods.addBookmark = async function (clubId) {
    // Check if already bookmarked
    if (!this.bookmarkedClubs.includes(clubId)) {
        this.bookmarkedClubs.push(clubId);
        await this.save();
        console.log(`✅ Added club bookmark: ${clubId} for user ${this.email}`);
        return true;
    }
    console.log(`⚠️ Club ${clubId} already bookmarked by ${this.email}`);
    return false;
};

// REMOVE CLUB BOOKMARK - Remove club from user's bookmarks
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

// CHECK IF CLUB BOOKMARKED - Check if user has bookmarked a specific club
userSchema.methods.hasBookmarked = function (clubId) {
    return this.bookmarkedClubs.some(id => id.equals(clubId));
};

// GET CLUB BOOKMARK COUNT - Get total number of club bookmarks
userSchema.methods.getBookmarkCount = function () {
    return this.bookmarkedClubs.length;
};

// =============================================================================
// EVENT BOOKMARK METHODS - NEW!
// =============================================================================

// ADD EVENT BOOKMARK - Add event to user's bookmarks
userSchema.methods.addEventBookmark = async function (eventId) {
    // Check if already bookmarked
    if (!this.bookmarkedEvents.includes(eventId)) {
        this.bookmarkedEvents.push(eventId);
        await this.save();
        console.log(`✅ Added event bookmark: ${eventId} for user ${this.email}`);
        return true;
    }
    console.log(`⚠️ Event ${eventId} already bookmarked by ${this.email}`);
    return false;
};

// REMOVE EVENT BOOKMARK - Remove event from user's bookmarks
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

// CHECK IF EVENT BOOKMARKED - Check if user has bookmarked a specific event
userSchema.methods.hasEventBookmarked = function (eventId) {
    return this.bookmarkedEvents.some(id => id.equals(eventId));
};

// GET EVENT BOOKMARK COUNT - Get total number of event bookmarks
userSchema.methods.getEventBookmarkCount = function () {
    return this.bookmarkedEvents.length;
};

// =============================================================================
// STATIC METHODS - Available on User model itself
// =============================================================================

// GET USER WITH POPULATED BOOKMARKS - Get user with full club AND event details
userSchema.statics.findWithBookmarks = function (userId) {
    return this.findById(userId)
        .populate('bookmarkedClubs')   // Get full club objects, not just IDs
        .populate('bookmarkedEvents')  // Get full event objects, not just IDs
        .select('-password');          // Exclude password from result
};

// GET USER WITH ONLY CLUB BOOKMARKS
userSchema.statics.findWithClubBookmarks = function (userId) {
    return this.findById(userId)
        .populate('bookmarkedClubs')
        .select('-password');
};

// GET USER WITH ONLY EVENT BOOKMARKS
userSchema.statics.findWithEventBookmarks = function (userId) {
    return this.findById(userId)
        .populate('bookmarkedEvents')
        .select('-password');
};

module.exports = mongoose.model('User', userSchema);

// =============================================================================
// USAGE EXAMPLES:
// =============================================================================
//
// CLUB BOOKMARKS:
// await user.addBookmark(clubId);
// await user.removeBookmark(clubId);
// const isClubBookmarked = user.hasBookmarked(clubId);
// const clubCount = user.getBookmarkCount();
//
// EVENT BOOKMARKS:
// await user.addEventBookmark(eventId);
// await user.removeEventBookmark(eventId);
// const isEventBookmarked = user.hasEventBookmarked(eventId);
// const eventCount = user.getEventBookmarkCount();
//
// GET USER WITH BOOKMARKS:
// const userWithAllBookmarks = await User.findWithBookmarks(userId);
// const userWithClubs = await User.findWithClubBookmarks(userId);
// const userWithEvents = await User.findWithEventBookmarks(userId);
//
// =============================================================================