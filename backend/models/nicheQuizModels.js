// =============================================================================
// NICHE QUIZ DATABASE MODELS
// =============================================================================
// Save as backend/models/nicheQuizModels.js

const mongoose = require('mongoose');

// =============================================================================
// CAREER FIELD SCHEMA - Master list of tech careers
// =============================================================================
const careerFieldSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
        // e.g., "Web Development", "Data Science", "Cybersecurity"
    },

    description: {
        type: String,
        required: true,
        maxlength: 500
    },

    category: {
        type: String,
        enum: ['Engineering', 'Data', 'Product', 'Design', 'Security', 'Research', 'Management'],
        required: true
    },

    // Career progression pathway
    progression: [{
        level: {
            type: String,
            enum: ['Entry', 'Mid', 'Senior', 'Lead', 'Executive']
        },
        roles: [String], // e.g., ["Junior Developer", "Frontend Developer"] 
        yearsExperience: String, // e.g., "0-2 years"
        avgSalary: {
            min: Number,
            max: Number
        },
        requirements: {
            education: String,
            skills: [String],
            experience: String
        }
    }],

    // Market data for credibility
    marketData: {
        jobGrowthRate: String, // e.g., "+13% (2021-2031)"
        annualOpenings: Number,
        workLifeBalance: Number, // 1-10 scale
        avgSatisfaction: Number, // 1-10 scale
        roiTimeframe: String, // e.g., "2-4 years"
        sources: [{
            name: String, // e.g., "Bureau of Labor Statistics"
            url: String,
            lastUpdated: Date
        }]
    },

    // Skill mapping for quiz algorithm
    skillWeights: {
        technical: Number,     // How technical is this field (1-10)
        creative: Number,      // Creative vs analytical (1-10)
        social: Number,        // People interaction level (1-10)
        leadership: Number,    // Management potential (1-10)
        research: Number,      // Research/innovation focus (1-10)
        pace: Number,         // Fast-paced vs steady (1-10)
        risk: Number,         // Risk tolerance needed (1-10)
        structure: Number     // Structured vs flexible (1-10)
    },

    // Related UC Davis clubs for integration
    relatedClubs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Club'
    }],

    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// =============================================================================
// QUIZ QUESTION SCHEMA - Multi-level questions
// =============================================================================
const quizQuestionSchema = new mongoose.Schema({
    questionText: {
        type: String,
        required: true,
        maxlength: 200
    },

    questionLevel: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
        required: true
    },

    questionType: {
        type: String,
        enum: ['ranking', 'multiple_choice', 'scenario', 'preference'],
        default: 'ranking'
    },

    // For ranking questions (drag & drop)
    options: [{
        text: String,
        description: String, // Optional explanation
        weights: {
            // Map to skillWeights in careerFieldSchema
            technical: Number,
            creative: Number,
            social: Number,
            leadership: Number,
            research: Number,
            pace: Number,
            risk: Number,
            structure: Number
        }
    }],

    // Question metadata
    category: {
        type: String,
        enum: ['work_style', 'interests', 'skills', 'values', 'environment', 'goals', 'leadership']
    },

    difficultyWeight: {
        type: Number,
        default: 1,
        min: 0.5,
        max: 2
        // Higher weight = more important for final score
    },

    isActive: {
        type: Boolean,
        default: true
    },

    order: {
        type: Number,
        default: 0
        // For controlling question sequence
    }
}, {
    timestamps: true
});

// =============================================================================
// QUIZ RESULT SCHEMA - Store user results
// =============================================================================
const quizResultSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    quizLevel: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced', 'enhanced-beginner', 'enhanced-intermediate', 'enhanced-advanced'],
        required: true
    },

    // Store user answers for analysis
    answers: [{
        questionId: {
            type: String,  // Changed from ObjectId to String
            required: true
        },
        ranking: [mongoose.Schema.Types.Mixed], // More flexible for different answer types
        timeTaken: Number
    }],

    // Calculated results
    skillScores: {
        technical: Number,
        creative: Number,
        social: Number,
        leadership: Number,
        research: Number,
        pace: Number,
        risk: Number,
        structure: Number
    },

    // Career field matches with percentages
    careerMatches: [{
        field: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'CareerField'
        },
        matchPercentage: Number,
        confidence: String // "High", "Medium", "Low"
    }],

    // Top recommendation
    topMatch: {
        careerName: {
            type: String,
            required: true
        },
        percentage: {
            type: Number,
            required: true
        },
        nextSteps: [String], // Personalized action items
        // Remove complex references for now to avoid ObjectId issues
    },

    // Quiz metadata
    completionTime: Number, // Total time in minutes
    retakeNumber: {
        type: Number,
        default: 1
    },

    // For analytics
    isShared: {
        type: Boolean,
        default: false
    },

    shareToken: {
        type: String,
        unique: true,
        sparse: true
        // For sharing results
    }
}, {
    timestamps: true
});

// =============================================================================
// INSTANCE METHODS
// =============================================================================

// Career Field Methods
careerFieldSchema.methods.getEntryLevelInfo = function () {
    const entryLevel = this.progression.find(level => level.level === 'Entry');
    return entryLevel || this.progression[0];
};

careerFieldSchema.methods.getAdvancementPath = function () {
    return this.progression.map(level => ({
        level: level.level,
        roles: level.roles,
        timeline: level.yearsExperience,
        salary: level.avgSalary
    }));
};

// Quiz Result Methods
quizResultSchema.methods.calculateMatch = function (careerField) {
    const userScores = this.skillScores;
    const fieldWeights = careerField.skillWeights;

    let totalMatch = 0;
    let totalWeight = 0;

    // Calculate weighted similarity
    for (const skill in userScores) {
        if (fieldWeights[skill] !== undefined) {
            const difference = Math.abs(userScores[skill] - fieldWeights[skill]);
            const similarity = 10 - difference; // Convert to similarity score
            totalMatch += similarity * fieldWeights[skill];
            totalWeight += fieldWeights[skill];
        }
    }

    return totalWeight > 0 ? Math.round((totalMatch / totalWeight) * 10) : 0;
};

quizResultSchema.methods.generateNextSteps = function (topField) {
    const steps = [];
    const entryLevel = topField.getEntryLevelInfo();

    // Add skill-building recommendations
    if (entryLevel.requirements.skills) {
        steps.push(`Learn ${entryLevel.requirements.skills.slice(0, 2).join(' and ')}`);
    }

    // Add UC Davis specific recommendations
    if (topField.relatedClubs && topField.relatedClubs.length > 0) {
        steps.push(`Join ${topField.relatedClubs[0].name} to get hands-on experience`);
    }

    // Add entry role recommendations
    if (entryLevel.roles && entryLevel.roles.length > 0) {
        steps.push(`Look for ${entryLevel.roles[0]} opportunities or internships`);
    }

    return steps;
};

// =============================================================================
// STATIC METHODS
// =============================================================================

careerFieldSchema.statics.getByCategory = function (category) {
    return this.find({ category, isActive: true }).sort({ name: 1 });
};

careerFieldSchema.statics.searchFields = function (query) {
    return this.find({
        $or: [
            { name: { $regex: query, $options: 'i' } },
            { description: { $regex: query, $options: 'i' } }
        ],
        isActive: true
    });
};

quizQuestionSchema.statics.getQuestionsByLevel = function (level) {
    return this.find({ questionLevel: level, isActive: true }).sort({ order: 1 });
};

// =============================================================================
// EXPORT MODELS
// =============================================================================

const CareerField = mongoose.model('CareerField', careerFieldSchema);
const QuizQuestion = mongoose.model('QuizQuestion', quizQuestionSchema);
const QuizResult = mongoose.model('QuizResult', quizResultSchema);

module.exports = {
    CareerField,
    QuizQuestion,
    QuizResult
};