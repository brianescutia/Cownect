// =============================================================================
// CLUB MODEL - Database schema for tech clubs
// =============================================================================
// This file defines the structure for club data in MongoDB
// Replaces static HTML with dynamic, manageable club information

const mongoose = require('mongoose');

// =============================================================================
// CLUB SCHEMA DEFINITION
// =============================================================================
// Think of this as the "template" for what club data looks like

const clubSchema = new mongoose.Schema({
    // 📛 BASIC CLUB INFORMATION
    name: {
        type: String,
        required: true,              // Must have a name
        trim: true,                  // Remove extra spaces
        maxlength: 100,              // Reasonable name length limit
        index: true                  // Index for faster searching
    },

    description: {
        type: String,
        required: true,              // Must have description
        maxlength: 500,              // Keep descriptions concise
        trim: true
    },

    // 🏷️ TAGS FOR FILTERING AND SEARCH
    tags: [{
        type: String,
        lowercase: true,             // Consistent lowercase for searching
        trim: true,                  // Remove extra spaces
        maxlength: 20                // Individual tag length limit
    }],

    // 📂 CATEGORY FOR ORGANIZATION
    category: {
        type: String,
        enum: [                      // Only allow specific categories
            'Technology',
            'Engineering',
            'Data Science',
            'Design',
            'Hardware',
            'Software',
            'Other'
        ],
        default: 'Technology',
        index: true                  // Index for faster category filtering
    },

    // 🖼️ VISUAL ELEMENTS
    logoUrl: {
        type: String,
        default: '/assets/default-club-logo.png',  // Fallback logo
        trim: true
    },

    // 📊 METADATA AND STATUS
    isActive: {
        type: Boolean,
        default: true,               // New clubs are active by default
        index: true                  // Index for filtering active clubs
    },

    memberCount: {
        type: Number,
        default: 0,                  // Track popularity/size
        min: 0                       // Can't have negative members
    },

    // 📅 TIMESTAMPS
    createdAt: {
        type: Date,
        default: Date.now,           // When club was added to database
        index: true                  // Index for sorting by creation date
    },

    updatedAt: {
        type: Date,
        default: Date.now            // When club info was last modified
    }
}, {
    // SCHEMA OPTIONS
    timestamps: true,                // Automatically manage createdAt/updatedAt
    toJSON: { virtuals: true },      // Include virtual fields in JSON output
    toObject: { virtuals: true }     // Include virtual fields in object output
});

// =============================================================================
// SCHEMA MIDDLEWARE
// =============================================================================

// 🔄 UPDATE TIMESTAMP - Runs before saving updates
clubSchema.pre('save', function (next) {
    // Only update 'updatedAt' if document was modified
    if (this.isModified() && !this.isNew) {
        this.updatedAt = Date.now();
    }
    next();
});

// 🏷️ TAG VALIDATION - Ensure tags are properly formatted
clubSchema.pre('save', function (next) {
    // Clean up tags: remove empty strings, duplicates
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

    // Search in name, description, and tags
    return this.name.toLowerCase().includes(searchText) ||
        this.description.toLowerCase().includes(searchText) ||
        this.tags.some(tag => tag.includes(searchText));
};

// 📊 GET DISPLAY-FRIENDLY TAG STRING
clubSchema.methods.getTagString = function () {
    // Convert tags array to "#tag1 #tag2 #tag3" format
    return this.tags.map(tag => `#${tag}`).join(' ');
};

// =============================================================================
// STATIC METHODS (available on the Club model itself)
// =============================================================================

// 🔍 SEARCH CLUBS BY QUERY
clubSchema.statics.searchClubs = function (query, options = {}) {
    const {
        category,
        tags,
        isActive = true,
        limit = 50,
        skip = 0
    } = options;

    // Build search criteria
    let searchCriteria = { isActive };

    // Add text search if query provided
    if (query && query.trim()) {
        searchCriteria.$or = [
            { name: { $regex: query, $options: 'i' } },
            { description: { $regex: query, $options: 'i' } },
            { tags: { $in: [new RegExp(query, 'i')] } }
        ];
    }

    // Add category filter if specified
    if (category) {
        searchCriteria.category = category;
    }

    // Add tag filter if specified
    if (tags && tags.length > 0) {
        searchCriteria.tags = { $in: tags };
    }

    return this.find(searchCriteria)
        .sort({ createdAt: -1 })  // Newest first
        .limit(limit)
        .skip(skip);
};

// 📊 GET POPULAR CLUBS (by member count)
clubSchema.statics.getPopularClubs = function (limit = 10) {
    return this.find({ isActive: true })
        .sort({ memberCount: -1 })  // Highest member count first
        .limit(limit);
};

// 🏷️ GET ALL UNIQUE TAGS
clubSchema.statics.getAllTags = function () {
    return this.aggregate([
        { $match: { isActive: true } },
        { $unwind: '$tags' },
        { $group: { _id: '$tags', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $project: { tag: '$_id', count: 1, _id: 0 } }
    ]);
};

// =============================================================================
// EXPORT MODEL
// =============================================================================
module.exports = mongoose.model('Club', clubSchema);

// =============================================================================
// USAGE EXAMPLES:
// =============================================================================
//
// Creating a new club:
// const newClub = new Club({
//     name: "#include",
//     description: "Build real-world coding projects with fellow students.",
//     tags: ["software", "webdev", "collaboration"],
//     category: "Technology"
// });
// await newClub.save();
//
// Searching clubs:
// const clubs = await Club.searchClubs("AI", { category: "Technology" });
//
// Getting popular clubs:
// const popular = await Club.getPopularClubs(5);
//
// =============================================================================