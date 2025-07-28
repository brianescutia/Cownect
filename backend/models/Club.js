// =============================================================================
// ENHANCED CLUB MODEL - Now with Real Club Data Fields
// =============================================================================

const mongoose = require('mongoose');

// =============================================================================
// OFFICER SCHEMA - For club leadership information
// =============================================================================
const officerSchema = new mongoose.Schema({
    position: {
        type: String,
        required: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    }
}, { _id: false });

// =============================================================================
// MEETING INFO SCHEMA - For meeting details
// =============================================================================
const meetingInfoSchema = new mongoose.Schema({
    frequency: {
        type: String,
        enum: ['Daily', 'Weekly', 'Bi-weekly', 'Monthly', 'Quarterly', 'As Needed'],
        default: 'Weekly'
    },
    day: {
        type: String,
        default: 'TBD'
    },
    time: {
        type: String,
        default: 'TBD'
    },
    location: {
        type: String,
        default: 'TBD'
    }
}, { _id: false });

// =============================================================================
// ENHANCED CLUB SCHEMA
// =============================================================================
const clubSchema = new mongoose.Schema({
    // 📛 BASIC CLUB INFORMATION
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100,
        index: true
    },

    description: {
        type: String,
        required: true,
        maxlength: 1000,  // Increased for longer descriptions
        trim: true
    },

    // 🏷️ TAGS FOR FILTERING AND SEARCH
    tags: [{
        type: String,
        lowercase: true,
        trim: true,
        maxlength: 20
    }],

    // 📂 CATEGORY FOR ORGANIZATION
    category: {
        type: String,
        enum: [
            'Technology',
            'Engineering',
            'Data Science',
            'Design',
            'Hardware',
            'Software',
            'Other'
        ],
        default: 'Technology',
        index: true
    },

    // 🖼️ VISUAL ELEMENTS
    logoUrl: {
        type: String,
        default: '/assets/default-club-logo.png',
        trim: true
    },
    heroImageUrl: {
        type: String,
        default: '/assets/default-club-hero.jpg',  // Fallback hero image
        trim: true
    },

    // 🌐 WEB PRESENCE
    websiteUrl: {
        type: String,
        trim: true,
        default: null
    },

    instagramUrl: {
        type: String,
        trim: true,
        default: null
    },

    contactEmail: {
        type: String,
        trim: true,
        lowercase: true,
        default: null
    },

    // 📅 MEETING INFORMATION
    meetingInfo: {
        type: meetingInfoSchema,
        default: () => ({})
    },

    // 🎯 FOCUS AREAS
    focusAreas: [{
        type: String,
        trim: true,
        maxlength: 50
    }],

    // 👥 CLUB OFFICERS
    officers: [officerSchema],

    // 📊 METADATA AND STATUS
    isActive: {
        type: Boolean,
        default: true,
        index: true
    },

    memberCount: {
        type: Number,
        default: 0,
        min: 0
    },

    // 📅 TIMESTAMPS
    createdAt: {
        type: Date,
        default: Date.now,
        index: true
    },

    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// =============================================================================
// VIRTUAL FIELDS
// =============================================================================

// Get formatted tag string
clubSchema.virtual('tagString').get(function () {
    return this.tags.map(tag => `#${tag}`).join(' ');
});

// Get primary contact
clubSchema.virtual('primaryContact').get(function () {
    if (this.officers && this.officers.length > 0) {
        const president = this.officers.find(officer =>
            officer.position.toLowerCase().includes('president')
        );
        return president || this.officers[0];
    }
    return null;
});

// Get formatted meeting time
clubSchema.virtual('meetingString').get(function () {
    const { frequency, day, time, location } = this.meetingInfo;
    if (day === 'TBD' || time === 'TBD') {
        return 'Meeting times TBD';
    }
    return `${frequency} on ${day}s, ${time} at ${location}`;
});

// =============================================================================
// SCHEMA MIDDLEWARE
// =============================================================================

// 🔄 UPDATE TIMESTAMP
clubSchema.pre('save', function (next) {
    if (this.isModified() && !this.isNew) {
        this.updatedAt = Date.now();
    }
    next();
});

// 🏷️ TAG CLEANUP
clubSchema.pre('save', function (next) {
    if (this.tags && this.tags.length > 0) {
        this.tags = [...new Set(this.tags.filter(tag => tag.trim().length > 0))];
    }
    next();
});

// =============================================================================
// INSTANCE METHODS
// =============================================================================

// 🔍 CHECK IF CLUB MATCHES SEARCH QUERY
clubSchema.methods.matchesQuery = function (query) {
    const searchText = query.toLowerCase();

    return this.name.toLowerCase().includes(searchText) ||
        this.description.toLowerCase().includes(searchText) ||
        this.tags.some(tag => tag.includes(searchText)) ||
        this.focusAreas.some(area => area.toLowerCase().includes(searchText));
};

// 📊 GET DISPLAY-FRIENDLY TAG STRING  
clubSchema.methods.getTagString = function () {
    return this.tags.map(tag => `#${tag}`).join(' ');
};

// 👥 GET OFFICER BY POSITION
clubSchema.methods.getOfficerByPosition = function (position) {
    return this.officers.find(officer =>
        officer.position.toLowerCase().includes(position.toLowerCase())
    );
};

// 📧 GET CONTACT INFO
clubSchema.methods.getContactInfo = function () {
    const primaryContact = this.primaryContact;
    return {
        email: this.contactEmail || (primaryContact ? primaryContact.email : null),
        officer: primaryContact,
        website: this.websiteUrl,
        instagram: this.instagramUrl
    };
};

// =============================================================================
// STATIC METHODS
// =============================================================================

// 🔍 ENHANCED SEARCH WITH NEW FIELDS
clubSchema.statics.searchClubs = function (query, options = {}) {
    const {
        category,
        tags,
        isActive = true,
        limit = 50,
        skip = 0,
        sortBy = 'memberCount',
        sortOrder = 'desc'
    } = options;

    let searchCriteria = { isActive };

    // Text search across multiple fields
    if (query && query.trim()) {
        searchCriteria.$or = [
            { name: { $regex: query, $options: 'i' } },
            { description: { $regex: query, $options: 'i' } },
            { tags: { $in: [new RegExp(query, 'i')] } },
            { focusAreas: { $in: [new RegExp(query, 'i')] } }
        ];
    }

    // Category filter
    if (category) {
        searchCriteria.category = category;
    }

    // Tag filter
    if (tags && tags.length > 0) {
        searchCriteria.tags = { $in: tags };
    }

    // Sorting
    let sort = {};
    if (sortBy === 'name') {
        sort.name = sortOrder === 'desc' ? -1 : 1;
    } else if (sortBy === 'newest') {
        sort.createdAt = -1;
    } else {
        sort.memberCount = sortOrder === 'desc' ? -1 : 1;
    }

    return this.find(searchCriteria)
        .sort(sort)
        .limit(limit)
        .skip(skip);
};

// 📊 GET CLUBS BY CATEGORY
clubSchema.statics.getClubsByCategory = function (category) {
    return this.find({
        isActive: true,
        category: category
    }).sort({ memberCount: -1 });
};

// 🏷️ GET ALL UNIQUE TAGS WITH COUNTS
clubSchema.statics.getAllTags = function () {
    return this.aggregate([
        { $match: { isActive: true } },
        { $unwind: '$tags' },
        { $group: { _id: '$tags', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $project: { tag: '$_id', count: 1, _id: 0 } }
    ]);
};

// 🎯 GET ALL FOCUS AREAS
clubSchema.statics.getAllFocusAreas = function () {
    return this.aggregate([
        { $match: { isActive: true } },
        { $unwind: '$focusAreas' },
        { $group: { _id: '$focusAreas', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $project: { area: '$_id', count: 1, _id: 0 } }
    ]);
};

// 📊 GET CLUB STATISTICS
clubSchema.statics.getClubStats = function () {
    return this.aggregate([
        { $match: { isActive: true } },
        {
            $group: {
                _id: null,
                totalClubs: { $sum: 1 },
                totalMembers: { $sum: '$memberCount' },
                avgMemberCount: { $avg: '$memberCount' },
                categories: { $addToSet: '$category' }
            }
        }
    ]);
};

// =============================================================================
// EXPORT MODEL
// =============================================================================
module.exports = mongoose.model('Club', clubSchema);

// =============================================================================
// USAGE EXAMPLES WITH REAL DATA:
// =============================================================================
//
// Find clubs with officers:
// const clubsWithPresidents = await Club.find({
//     'officers.position': { $regex: 'president', $options: 'i' }
// });
//
// Search by focus area:
// const aiClubs = await Club.find({
//     focusAreas: { $in: ['Machine Learning', 'AI Research'] }
// });
//
// Get club with full contact info:
// const club = await Club.findById(clubId);
// const contactInfo = club.getContactInfo();
//
// =============================================================================