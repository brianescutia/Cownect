// =============================================================================
// MENTOR MATCH RESULT MODEL
// Save as: backend/models/MentorMatchResult.js
// =============================================================================

const mongoose = require('mongoose');

const mentorMatchResultSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    // Quiz answers
    answers: {
        type: Map,
        of: String,
        required: true
    },

    // Matched mentors
    matchedMentors: [{
        mentorId: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        matchScore: {
            type: Number,
            required: true,
            min: 0,
            max: 100
        },
        expressoUrl: {
            type: String,
            required: true
        },
        // Track if user clicked to schedule
        clicked: {
            type: Boolean,
            default: false
        },
        clickedAt: {
            type: Date
        },
        // Track if user actually scheduled (manual update)
        scheduled: {
            type: Boolean,
            default: false
        },
        scheduledAt: {
            type: Date
        },
        // User notes about the mentor
        notes: {
            type: String,
            default: ''
        }
    }],

    // Metadata
    quizCompletionTime: {
        type: Number, // in seconds
        default: 0
    },

    // Feedback
    helpful: {
        type: Boolean,
        default: null
    },

    feedbackText: {
        type: String,
        default: ''
    },

    // Analytics
    viewCount: {
        type: Number,
        default: 1
    },

    lastViewedAt: {
        type: Date,
        default: Date.now
    },

    // Timestamps
    createdAt: {
        type: Date,
        default: Date.now
    },

    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Instance methods
mentorMatchResultSchema.methods.trackMentorClick = async function (mentorId) {
    const mentor = this.matchedMentors.find(m => m.mentorId === mentorId);
    if (mentor) {
        mentor.clicked = true;
        mentor.clickedAt = new Date();
        await this.save();
        console.log(`✅ Tracked click for mentor ${mentor.name}`);
        return true;
    }
    return false;
};

mentorMatchResultSchema.methods.markAsScheduled = async function (mentorId) {
    const mentor = this.matchedMentors.find(m => m.mentorId === mentorId);
    if (mentor) {
        mentor.scheduled = true;
        mentor.scheduledAt = new Date();
        await this.save();
        console.log(`✅ Marked as scheduled with mentor ${mentor.name}`);
        return true;
    }
    return false;
};

mentorMatchResultSchema.methods.addMentorNote = async function (mentorId, note) {
    const mentor = this.matchedMentors.find(m => m.mentorId === mentorId);
    if (mentor) {
        mentor.notes = note;
        this.updatedAt = new Date();
        await this.save();
        return true;
    }
    return false;
};

mentorMatchResultSchema.methods.incrementViewCount = async function () {
    this.viewCount += 1;
    this.lastViewedAt = new Date();
    await this.save();
};

mentorMatchResultSchema.methods.submitFeedback = async function (helpful, feedbackText) {
    this.helpful = helpful;
    this.feedbackText = feedbackText;
    this.updatedAt = new Date();
    await this.save();
    console.log(`✅ Feedback submitted: ${helpful ? 'Helpful' : 'Not helpful'}`);
};

// Static methods
mentorMatchResultSchema.statics.getUserMatches = function (userId) {
    return this.find({ user: userId })
        .sort({ createdAt: -1 })
        .limit(10)
        .lean();
};

mentorMatchResultSchema.statics.getMostPopularMentors = async function () {
    const results = await this.aggregate([
        { $unwind: '$matchedMentors' },
        {
            $group: {
                _id: '$matchedMentors.mentorId',
                name: { $first: '$matchedMentors.name' },
                timesMatched: { $sum: 1 },
                timesClicked: {
                    $sum: { $cond: ['$matchedMentors.clicked', 1, 0] }
                },
                timesScheduled: {
                    $sum: { $cond: ['$matchedMentors.scheduled', 1, 0] }
                },
                avgMatchScore: { $avg: '$matchedMentors.matchScore' }
            }
        },
        { $sort: { timesMatched: -1 } },
        { $limit: 10 }
    ]);

    return results;
};

mentorMatchResultSchema.statics.getMatchingStats = async function () {
    const totalMatches = await this.countDocuments();
    const uniqueUsers = await this.distinct('user');
    const totalClicks = await this.aggregate([
        { $unwind: '$matchedMentors' },
        { $match: { 'matchedMentors.clicked': true } },
        { $count: 'clicks' }
    ]);

    const totalScheduled = await this.aggregate([
        { $unwind: '$matchedMentors' },
        { $match: { 'matchedMentors.scheduled': true } },
        { $count: 'scheduled' }
    ]);

    return {
        totalMatches,
        uniqueUsers: uniqueUsers.length,
        totalClicks: totalClicks[0]?.clicks || 0,
        totalScheduled: totalScheduled[0]?.scheduled || 0
    };
};

// Indexes for performance
mentorMatchResultSchema.index({ user: 1, createdAt: -1 });
mentorMatchResultSchema.index({ 'matchedMentors.mentorId': 1 });
mentorMatchResultSchema.index({ createdAt: -1 });

module.exports = mongoose.model('MentorMatchResult', mentorMatchResultSchema);