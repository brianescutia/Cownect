// backend/models/UserSettings.js
const mongoose = require('mongoose');

const userSettingsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    profile: {
        firstName: { type: String, trim: true },
        lastName: { type: String, trim: true },
        displayName: { type: String, trim: true },
        bio: { type: String, maxlength: 500 },
        major: { type: String, trim: true },
        graduationYear: { type: Number, min: 2020, max: 2030 },
        profilePicture: { type: String }, // URL or file path
        linkedIn: { type: String, trim: true },
        github: { type: String, trim: true },
        website: { type: String, trim: true }
    },
    preferences: {
        emailNotifications: {
            clubUpdates: { type: Boolean, default: true },
            eventReminders: { type: Boolean, default: true },
            weeklyDigest: { type: Boolean, default: false },
            recommendations: { type: Boolean, default: true }
        },
        privacy: {
            profileVisibility: {
                type: String,
                enum: ['public', 'ucDavisOnly', 'private'],
                default: 'ucDavisOnly'
            },
            showEmail: { type: Boolean, default: false },
            showSocialLinks: { type: Boolean, default: true }
        },
        interface: {
            theme: { type: String, enum: ['light', 'dark', 'auto'], default: 'auto' },
            compactView: { type: Boolean, default: false },
            cardsPerPage: { type: Number, default: 12, min: 6, max: 24 }
        },
        interests: [{
            type: String,
            enum: ['AI/ML', 'Web Development', 'Mobile Development', 'Data Science',
                'Cybersecurity', 'Hardware', 'Robotics', 'Gaming', 'Blockchain',
                'UI/UX', 'DevOps', 'Research']
        }]
    },
    security: {
        twoFactorEnabled: { type: Boolean, default: false },
        lastPasswordChange: { type: Date, default: Date.now },
        loginNotifications: { type: Boolean, default: true }
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Update the updatedAt field before saving
userSettingsSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

// Create indexes for better performance
userSettingsSchema.index({ userId: 1 });
userSettingsSchema.index({ 'preferences.interests': 1 });

module.exports = mongoose.model('UserSettings', userSettingsSchema);