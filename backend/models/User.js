// =============================================================================
// UPDATED USER MODEL - backend/models/User.js
// Add profile fields for dashboard
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
                return email && email.endsWith('@ucdavis.edu');
            },
            message: 'Only UC Davis email addresses (@ucdavis.edu) are allowed'
        }
    },

    // ✅ BASIC PROFILE FIELDS
    name: {
        type: String,
        trim: true,
        maxlength: 100,
        default: ''
    },

    year: {
        type: String,
        enum: ['freshman', 'sophomore', 'junior', 'senior', 'graduate', 'phd', 'postdoc', ''],
        default: ''
    },

    major: {
        type: String,
        trim: true,
        maxlength: 100,
        default: ''
    },

    bio: {
        type: String,
        trim: true,
        maxlength: 500,
        default: ''
    },

    hobbies: {
        type: String,
        trim: true,
        maxlength: 300,
        default: ''
    },

    linkedinUrl: {
        type: String,
        trim: true,
        validate: {
            validator: function (url) {
                if (!url) return true;
                return /^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9\-]+\/?$/.test(url);
            },
            message: 'Please enter a valid LinkedIn profile URL'
        },
        default: ''
    },

    // ✅ PROFILE PICTURE
    profilePictureUrl: {
        type: String,
        default: ''
    },

    // ✅ MATCHING & NETWORKING FIELDS
    lookingFor: [{
        type: String,
        enum: [
            'study-partners',
            'project-collaborators',
            'research-partners',
            'internship-referrals',
            'mentorship',
            'friends',
            'networking',
            'startup-cofounders',
            'hackathon-teammates',
            'career-guidance'
        ]
    }],

    skills: [{
        type: String,
        trim: true,
        maxlength: 50
    }],

    learningGoals: [{
        type: String,
        trim: true,
        maxlength: 50
    }],

    availability: {
        type: String,
        enum: ['very-available', 'moderately-available', 'limited-availability', 'busy', ''],
        default: ''
    },

    contactPreferences: [{
        type: String,
        enum: ['email', 'linkedin', 'discord', 'instagram', 'in-person']
    }],

    // ✅ PRIVACY SETTINGS
    profileVisibility: {
        type: String,
        enum: ['public', 'ucdavis-only', 'connections-only'],
        default: 'ucdavis-only'
    },

    showEmail: {
        type: Boolean,
        default: false
    },

    showLinkedIn: {
        type: Boolean,
        default: true
    },

    // AUTHENTICATION FIELDS
    password: {
        type: String,
        required: function () {
            return !this.googleId;
        },
        minlength: 6
    },

    googleId: {
        type: String,
        unique: true,
        sparse: true
    },

    provider: {
        type: String,
        enum: ['local', 'google'],
        default: 'google'
    },

    authMethod: {
        type: String,
        enum: ['email', 'google', 'both'],
        default: 'email'
    },

    // BOOKMARKS
    bookmarkedClubs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Club'
    }],

    bookmarkedEvents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
    }],

    // VERIFICATION & SECURITY
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

    // TIMESTAMPS
    createdAt: {
        type: Date,
        default: Date.now
    },

    lastLoginAt: {
        type: Date,
        default: null
    },

    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// ✅ NEW PROFILE METHODS
userSchema.methods.updateProfile = async function (profileData) {
    const allowedFields = [
        'name', 'year', 'major', 'bio', 'hobbies', 'linkedinUrl',
        'lookingFor', 'skills', 'learningGoals', 'availability',
        'contactPreferences', 'profileVisibility', 'showEmail', 'showLinkedIn'
    ];

    allowedFields.forEach(field => {
        if (profileData[field] !== undefined) {
            this[field] = profileData[field];
        }
    });

    this.updatedAt = new Date();

    return await this.save();
};

userSchema.methods.getDisplayName = function () {
    if (this.name && this.name.trim()) {
        return this.name;
    }
    return this.email.split('@')[0].replace(/\./g, ' ');
};

userSchema.methods.getInitials = function () {
    if (this.name && this.name.trim()) {
        return this.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    }
    return this.email.substring(0, 2).toUpperCase();
};

userSchema.methods.getProfileCompleteness = function () {
    const requiredFields = ['name', 'year', 'major', 'bio'];
    const optionalFields = ['hobbies', 'linkedinUrl', 'lookingFor', 'skills'];

    let score = 0;
    let totalPossible = 0;

    // Required fields (worth 20 points each)
    requiredFields.forEach(field => {
        totalPossible += 20;
        if (this[field] && this[field].toString().trim()) {
            score += 20;
        }
    });

    // Optional fields (worth 5 points each)
    optionalFields.forEach(field => {
        totalPossible += 5;
        if (this[field] &&
            ((Array.isArray(this[field]) && this[field].length > 0) ||
                this[field].toString().trim())) {
            score += 5;
        }
    });

    // Profile picture (worth 10 points)
    totalPossible += 10;
    if (this.profilePictureUrl) {
        score += 10;
    }

    return Math.round((score / totalPossible) * 100);
};

userSchema.methods.getMatchingProfile = function () {
    return {
        id: this._id,
        name: this.getDisplayName(),
        year: this.year,
        major: this.major,
        bio: this.bio,
        hobbies: this.hobbies,
        skills: this.skills,
        lookingFor: this.lookingFor,
        profilePictureUrl: this.profilePictureUrl,
        availability: this.availability,
        contactInfo: this.getContactInfo()
    };
};

userSchema.methods.getContactInfo = function () {
    const contact = {};

    if (this.showEmail && this.contactPreferences.includes('email')) {
        contact.email = this.email;
    }

    if (this.showLinkedIn && this.linkedinUrl && this.contactPreferences.includes('linkedin')) {
        contact.linkedin = this.linkedinUrl;
    }

    return contact;
};

// =============================================================================
// EXISTING METHODS (unchanged)
// =============================================================================

// Password hashing middleware
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        if (this.password.startsWith('google-oauth-')) {
            return next();
        }

        const hashedPassword = await bcrypt.hash(this.password, 12);
        this.password = hashedPassword;
        next();
    } catch (error) {
        next(error);
    }
});

// Authentication methods
userSchema.methods.comparePassword = async function (candidatePassword) {
    if (!this.password) {
        throw new Error('This account uses Google authentication');
    }
    return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.canUsePasswordAuth = function () {
    return this.password && (this.authMethod === 'email' || this.authMethod === 'both');
};

userSchema.methods.canUseGoogleAuth = function () {
    return this.googleId && (this.authMethod === 'google' || this.authMethod === 'both');
};

userSchema.methods.linkGoogleAccount = function (googleId) {
    this.googleId = googleId;
    this.authMethod = this.password ? 'both' : 'google';
    this.lastLoginAt = new Date();
};

userSchema.methods.linkEmailPassword = function (password) {
    this.password = password;
    this.authMethod = this.googleId ? 'both' : 'email';
};

// Verification token methods
userSchema.methods.generateVerificationToken = function () {
    const token = crypto.randomBytes(32).toString('hex');
    this.verificationToken = token;
    this.verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    return token;
};

userSchema.methods.generatePasswordResetToken = function () {
    if (!this.canUsePasswordAuth()) {
        throw new Error('This account uses Google authentication');
    }
    const token = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = token;
    this.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000);
    return token;
};

// Bookmark methods
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

// Event bookmark methods
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

// Static methods
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

userSchema.statics.findByEmailOrGoogleId = function (email, googleId) {
    const query = {
        $or: [
            { email: email.toLowerCase() },
            ...(googleId ? [{ googleId: googleId }] : [])
        ]
    };
    return this.findOne(query);
};

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