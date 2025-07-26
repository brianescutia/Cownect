// =============================================================================
// UPDATED USER MODEL - Now with Bookmarks Support
// =============================================================================

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    // 📧 EMAIL FIELD - User's login identifier
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address']
    },

    // 🔒 PASSWORD FIELD - Hashed before storage
    password: {
        type: String,
        required: true,
        minlength: 6
    },

    // 🔖 BOOKMARKED CLUBS - NEW! Array of club IDs
    bookmarkedClubs: [{
        type: mongoose.Schema.Types.ObjectId,  // References Club _id
        ref: 'Club'  // Tells Mongoose this refers to Club model
    }],

    // 📅 TIMESTAMP - Track when user account was created
    createdAt: {
        type: Date,
        default: Date.now
    },

    //New Email Verification Fields
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
// PASSWORD HASHING MIDDLEWARE - Same as before
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
// PASSWORD COMPARISON METHOD - Same as before
// =============================================================================
userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

// =============================================================================
// NEW: BOOKMARK METHODS
// =============================================================================

// 🔖 ADD BOOKMARK - Add club to user's bookmarks
userSchema.methods.addBookmark = async function (clubId) {
    // Check if already bookmarked
    if (!this.bookmarkedClubs.includes(clubId)) {
        this.bookmarkedClubs.push(clubId);
        await this.save();
        console.log(`✅ Added bookmark: ${clubId} for user ${this.email}`);
        return true;
    }
    console.log(`⚠️ Club ${clubId} already bookmarked by ${this.email}`);
    return false;
};

// 🗑️ REMOVE BOOKMARK - Remove club from user's bookmarks
userSchema.methods.removeBookmark = async function (clubId) {
    const initialLength = this.bookmarkedClubs.length;
    this.bookmarkedClubs = this.bookmarkedClubs.filter(id => !id.equals(clubId));

    if (this.bookmarkedClubs.length < initialLength) {
        await this.save();
        console.log(`✅ Removed bookmark: ${clubId} for user ${this.email}`);
        return true;
    }
    console.log(`⚠️ Club ${clubId} was not bookmarked by ${this.email}`);
    return false;
};

// 🔍 CHECK IF BOOKMARKED - Check if user has bookmarked a specific club
userSchema.methods.hasBookmarked = function (clubId) {
    return this.bookmarkedClubs.some(id => id.equals(clubId));
};

// 📊 GET BOOKMARK COUNT - Get total number of bookmarks
userSchema.methods.getBookmarkCount = function () {
    return this.bookmarkedClubs.length;
};

// =============================================================================
// STATIC METHODS - Available on User model itself
// =============================================================================

// 📊 GET USER WITH POPULATED BOOKMARKS - Get user with full club details
userSchema.statics.findWithBookmarks = function (userId) {
    return this.findById(userId)
        .populate('bookmarkedClubs')  // Get full club objects, not just IDs
        .select('-password');         // Exclude password from result
};

module.exports = mongoose.model('User', userSchema);

// =============================================================================
// USAGE EXAMPLES:
// =============================================================================
//
// Add bookmark:
// await user.addBookmark(clubId);
//
// Remove bookmark:
// await user.removeBookmark(clubId);
//
// Check if bookmarked:
// const isBookmarked = user.hasBookmarked(clubId);
//
// Get user with bookmarks:
// const userWithBookmarks = await User.findWithBookmarks(userId);
//
// =============================================================================

// =============================================================================
//User Email Verification System
// =============================================================================


module.exports = mongoose.model('User', userSchema);
// =============================================================================