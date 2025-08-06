// =============================================================================
// ENHANCED EVENT MODEL - Add imageUrl and other fields
// Update your existing backend/models/eventModel.js with these additions
// =============================================================================

const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200
    },
    date: {
        type: Date,
        required: true,
        index: true
    },
    time: {
        type: String,
        required: true,
        default: 'Time TBD'
    },
    location: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200
    },
    description: {
        type: String,
        required: true,
        maxlength: 2000
    },
    imageUrl: {
        type: String,
        default: '/assets/default-event-image.jpg',
        trim: true
    },
    category: {
        type: String,
        enum: [
            'Hackathon',
            'Workshop',
            'Career Fair',
            'Tech Talk',
            'Networking',
            'Competition',
            'Research',
            'Social',
            'Other'
        ],
        default: 'Other'
    },
    tags: [{
        type: String,
        lowercase: true,
        trim: true
    }],
    maxAttendees: {
        type: Number,
        default: null
    },
    registrationRequired: {
        type: Boolean,
        default: false
    },
    registrationUrl: {
        type: String,
        default: null
    },
    status: {
        type: String,
        enum: ['draft', 'published', 'cancelled', 'completed'],
        default: 'published'
    },

    // NEW FEATURED FIELD
    featured: {
        type: Boolean,
        default: false,
        index: true // Index for faster queries
    },

    // Featured priority (1 = highest priority)
    featuredPriority: {
        type: Number,
        default: null
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    attendees: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
// =============================================================================
// VIRTUAL FIELDS
// =============================================================================

// Check if event is in the past
eventSchema.virtual('isPast').get(function () {
    return this.date < new Date();
});

// Check if event is today
eventSchema.virtual('isToday').get(function () {
    const today = new Date();
    return this.date.toDateString() === today.toDateString();
});

// Get formatted date
eventSchema.virtual('formattedDate').get(function () {
    return this.date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
});

// Get short formatted date
eventSchema.virtual('shortDate').get(function () {
    return this.date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
    });
});

// Get attendee count
eventSchema.virtual('attendeeCount').get(function () {
    return this.attendees ? this.attendees.length : 0;
});

// Check if event is full
eventSchema.virtual('isFull').get(function () {
    if (!this.maxAttendees) return false;
    return this.attendeeCount >= this.maxAttendees;
});

// Get spots remaining
eventSchema.virtual('spotsRemaining').get(function () {
    if (!this.maxAttendees) return null;
    return Math.max(0, this.maxAttendees - this.attendeeCount);
});

// =============================================================================
// INSTANCE METHODS
// =============================================================================

// Check if a user is attending this event
eventSchema.methods.isUserAttending = function (userId) {
    return this.attendees.some(attendeeId => attendeeId.equals(userId));
};

// Add a user to the event
eventSchema.methods.addAttendee = function (userId) {
    if (this.isUserAttending(userId)) {
        return { success: false, message: 'User already attending' };
    }

    if (this.isFull) {
        return { success: false, message: 'Event is full' };
    }

    this.attendees.push(userId);
    return { success: true, message: 'Successfully joined event' };
};

// Remove a user from the event
eventSchema.methods.removeAttendee = function (userId) {
    const initialLength = this.attendees.length;
    this.attendees = this.attendees.filter(attendeeId => !attendeeId.equals(userId));

    if (this.attendees.length < initialLength) {
        return { success: true, message: 'Successfully left event' };
    }

    return { success: false, message: 'User was not attending' };
};

// =============================================================================
// STATIC METHODS
// =============================================================================

// Get upcoming events
eventSchema.statics.getUpcoming = function (limit = 10) {
    return this.find({
        isActive: true,
        status: 'published',
        date: { $gte: new Date() }
    })
        .sort({ date: 1 })
        .limit(limit)
        .populate('createdBy', 'email');
};

// Get featured events (next 3 upcoming)
eventSchema.statics.getFeatured = function () {
    return this.find({
        isActive: true,
        status: 'published',
        featured: true  // Only get events marked as featured
    })
        .sort({
            featuredPriority: 1,  // Sort by priority first (1 = highest)
            date: 1               // Then by date
        })
        .limit(3)
        .populate('createdBy', 'email');
};

// Get events by date range
eventSchema.statics.getByDateRange = function (startDate, endDate) {
    return this.find({
        isActive: true,
        status: 'published',
        date: {
            $gte: startDate,
            $lte: endDate
        }
    })
        .sort({ date: 1 })
        .populate('createdBy', 'email');
};

// Get events by category
eventSchema.statics.getByCategory = function (category) {
    return this.find({
        isActive: true,
        status: 'published',
        category: category,
        date: { $gte: new Date() }
    })
        .sort({ date: 1 })
        .populate('createdBy', 'email');
};

// Search events
eventSchema.statics.searchEvents = function (query) {
    return this.find({
        isActive: true,
        status: 'published',
        $or: [
            { title: { $regex: query, $options: 'i' } },
            { description: { $regex: query, $options: 'i' } },
            { location: { $regex: query, $options: 'i' } },
            { tags: { $in: [new RegExp(query, 'i')] } }
        ]
    })
        .sort({ date: 1 })
        .populate('createdBy', 'email');
};

// =============================================================================
// MIDDLEWARE
// =============================================================================

// Auto-populate attendees count when querying
eventSchema.pre(/^find/, function (next) {
    // You can uncomment this if you want to always populate attendees
    // this.populate({
    //     path: 'attendees',
    //     select: 'email'
    // });
    next();
});

// =============================================================================
// INDEXES
// =============================================================================

// Compound indexes for better performance
eventSchema.index({ date: 1, isActive: 1, status: 1 });
eventSchema.index({ category: 1, date: 1 });
eventSchema.index({ createdBy: 1, date: -1 });

module.exports = mongoose.model('Event', eventSchema);

// =============================================================================
// MIGRATION INSTRUCTIONS
// =============================================================================
//
// If you already have events in your database, you may need to run a migration
// to add the new fields. Here's a simple migration script:
//
// ```javascript
// // Run this once to update existing events
// async function migrateEvents() {
//     await Event.updateMany(
//         { imageUrl: { $exists: false } },
//         { 
//             $set: { 
//                 imageUrl: '/assets/default-event-image.jpg',
//                 category: 'Other',
//                 tags: [],
//                 status: 'published'
//             }
//         }
//     );
//     console.log('Events migrated successfully');
// }
// ```
//
// =============================================================================