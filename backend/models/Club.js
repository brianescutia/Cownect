// =============================================================================
// CLUB MODEL - Simple Version
// =============================================================================

const mongoose = require('mongoose');

const clubSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        maxlength: 500
    },
    tags: [{
        type: String,
        lowercase: true
    }],
    category: {
        type: String,
        enum: ['Technology', 'Engineering', 'Data Science', 'Design', 'Hardware', 'Software', 'Other'],
        default: 'Technology'
    },
    logoUrl: {
        type: String,
        default: '/assets/default-club-logo.png'
    },
    memberCount: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Club', clubSchema);