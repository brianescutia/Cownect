// =============================================================================
// ENHANCED QUIZ RESULTS MODEL
// Stores enhanced quiz results with club recommendations and detailed insights
// =============================================================================

const mongoose = require('mongoose');

// Enhanced Club Recommendation Schema
const clubRecommendationSchema = new mongoose.Schema({
    clubId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Club',
        required: true
    },
    clubName: {
        type: String,
        required: true
    },
    relevanceScore: {
        type: Number,
        min: 0,
        max: 100
    },
    careerRelevance: String,
    recommendationReason: String,
    suggestedActions: [String],
    userInteraction: {
        viewed: { type: Boolean, default: false },
        bookmarked: { type: Boolean, default: false },
        joined: { type: Boolean, default: false },
        feedback: {
            helpful: { type: Boolean, default: null },
            rating: { type: Number, min: 1, max: 5 }
        }
    }
}, { _id: false });

// Market Insights Schema
const marketInsightsSchema = new mongoose.Schema({
    avgSalary: String,
    salaryRange: {
        min: Number,
        max: Number,
        currency: { type: String, default: 'USD' }
    },
    jobGrowth: String,
    jobGrowthRate: Number, // As percentage
    workLifeBalance: String,
    workLifeBalanceScore: { type: Number, min: 1, max: 10 },
    remoteOpportunities: String,
    remotePercentage: Number,
    demandLevel: {
        type: String,
        enum: ['Very Low', 'Low', 'Moderate', 'High', 'Very High']
    },
    marketTrends: [String],
    keyInsight: String,
    lastUpdated: { type: Date, default: Date.now },
    sources: [{
        name: String,
        url: String,
        reliability: { type: Number, min: 1, max: 10 }
    }]
}, { _id: false });

// Next Steps Schema with progress tracking
const nextStepSchema = new mongoose.Schema({
    step: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['immediate', 'short-term', 'long-term'],
        default: 'immediate'
    },
    priority: {
        type: String,
        enum: ['high', 'medium', 'low'],
        default: 'medium'
    },
    timeframe: String, // e.g., "1-2 weeks", "next semester"
    difficulty: {
        type: String,
        enum: ['easy', 'moderate', 'challenging'],
        default: 'moderate'
    },
    resources: [String], // Links or resource names
    completed: {
        type: Boolean,
        default: false
    },
    completedAt: Date,
    userNotes: String
}, { _id: false });

// Career Match Schema (enhanced)
const careerMatchSchema = new mongoose.Schema({
    career: {
        type: String,
        required: true
    },
    category: String,
    percentage: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    confidence: {
        type: Number,
        min: 0,
        max: 100
    },
    reasoning: String,
    keyStrengths: [String],
    developmentAreas: [String],
    marketData: marketInsightsSchema,
    careerPath: [{
        level: String,
        timeframe: String,
        averageSalary: String,
        requirements: [String]
    }]
}, { _id: false });

// AI Analysis Insights Schema
const aiInsightsSchema = new mongoose.Schema({
    personalityProfile: String,
    workStyle: String,
    learningStyle: String,
    motivationFactors: [String],
    idealEnvironment: String,
    communicationStyle: String,
    leadershipPotential: String,
    riskTolerance: String,
    innovationMindset: String,
    collaborationPreference: String,
    stressManagement: String,
    careerDrivers: [String],
    potentialChallenges: [String],
    strengthsToLeverage: [String],
    confidenceScore: {
        type: Number,
        min: 0,
        max: 100
    },
    analysisQuality: {
        type: String,
        enum: ['excellent', 'good', 'fair', 'needs-improvement']
    }
}, { _id: false });

// User Interface Preferences
const uiPreferencesSchema = new mongoose.Schema({
    collapsedSections: [{
        type: String,
        enum: ['clubs', 'career-matches', 'market-insights', 'next-steps', 'ai-insights']
    }],
    preferredView: {
        type: String,
        enum: ['detailed', 'summary', 'compact'],
        default: 'detailed'
    },
    hideCompletedSteps: {
        type: Boolean,
        default: false
    },
    customNotes: String
}, { _id: false });

// Main Enhanced Quiz Result Schema
const enhancedQuizResultSchema = new mongoose.Schema({
    // Reference to user and original quiz result
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    originalQuizResult: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'QuizResult'
    },

    // Quiz metadata
    quizLevel: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced', 'comprehensive'],
        required: true
    },
    quizVersion: {
        type: String,
        default: '3.0-enhanced'
    },
    analysisType: {
        type: String,
        default: 'ai-powered-enhanced'
    },

    // Enhanced Results Data
    topMatch: {
        career: { type: String, required: true },
        percentage: { type: Number, required: true, min: 0, max: 100 },
        confidence: { type: Number, min: 0, max: 100 },
        reasoning: String,
        personalizedInsights: String,
        keyPatterns: [String],
        marketData: marketInsightsSchema,
        nextSteps: [nextStepSchema],
        careerProgression: [{
            level: String,
            timeframe: String,
            roles: [String],
            skills: [String],
            averageSalary: String
        }]
    },

    // All Career Matches (enhanced)
    allMatches: [careerMatchSchema],

    // Club Recommendations (top 3)
    clubRecommendations: [clubRecommendationSchema],

    // AI-Powered Insights
    aiInsights: aiInsightsSchema,

    // User Interface State
    uiPreferences: uiPreferencesSchema,

    // Analytics and Feedback
    analytics: {
        viewCount: { type: Number, default: 1 },
        timeSpentViewing: Number, // seconds
        sectionsViewed: [String],
        actionsPerformed: [{
            action: String, // 'club-clicked', 'step-completed', etc.
            timestamp: { type: Date, default: Date.now },
            data: mongoose.Schema.Types.Mixed
        }],
        shareCount: { type: Number, default: 0 },
        bookmarkCount: { type: Number, default: 0 }
    },

    // Quality Metrics
    qualityMetrics: {
        responseConsistency: Number,
        analysisDepth: Number,
        recommendationRelevance: Number,
        userSatisfactionScore: Number,
        aiConfidence: Number,
        dataCompleteness: Number
    },

    // User Feedback
    userFeedback: {
        overallRating: { type: Number, min: 1, max: 5 },
        accuracy: { type: Number, min: 1, max: 5 },
        usefulness: { type: Number, min: 1, max: 5 },
        clubRecommendationQuality: { type: Number, min: 1, max: 5 },
        comments: String,
        wouldRecommend: Boolean,
        submittedAt: Date
    },

    // Status and Timestamps
    status: {
        type: String,
        enum: ['active', 'archived', 'shared'],
        default: 'active'
    },
    lastViewed: Date,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes for performance
enhancedQuizResultSchema.index({ user: 1, createdAt: -1 });
enhancedQuizResultSchema.index({ quizLevel: 1, createdAt: -1 });
enhancedQuizResultSchema.index({ 'topMatch.career': 1 });
enhancedQuizResultSchema.index({ 'qualityMetrics.aiConfidence': -1 });

// Virtual fields
enhancedQuizResultSchema.virtual('completedStepsCount').get(function () {
    return this.topMatch.nextSteps.filter(step => step.completed).length;
});

enhancedQuizResultSchema.virtual('totalStepsCount').get(function () {
    return this.topMatch.nextSteps.length;
});

enhancedQuizResultSchema.virtual('progressPercentage').get(function () {
    if (this.totalStepsCount === 0) return 0;
    return Math.round((this.completedStepsCount / this.totalStepsCount) * 100);
});

enhancedQuizResultSchema.virtual('isRecent').get(function () {
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return this.createdAt > oneWeekAgo;
});

// Instance Methods
enhancedQuizResultSchema.methods.updateUIPreferences = function (preferences) {
    this.uiPreferences = { ...this.uiPreferences.toObject(), ...preferences };
    this.updatedAt = new Date();
    return this.save();
};

enhancedQuizResultSchema.methods.completeStep = function (stepIndex, userNotes = '') {
    if (this.topMatch.nextSteps[stepIndex]) {
        this.topMatch.nextSteps[stepIndex].completed = true;
        this.topMatch.nextSteps[stepIndex].completedAt = new Date();
        this.topMatch.nextSteps[stepIndex].userNotes = userNotes;

        // Track analytics
        this.analytics.actionsPerformed.push({
            action: 'step-completed',
            data: { stepIndex, stepText: this.topMatch.nextSteps[stepIndex].step }
        });
    }
    return this.save();
};

enhancedQuizResultSchema.methods.bookmarkClub = function (clubId) {
    const clubRec = this.clubRecommendations.find(c => c.clubId.toString() === clubId.toString());
    if (clubRec) {
        clubRec.userInteraction.bookmarked = true;
        this.analytics.bookmarkCount += 1;
        this.analytics.actionsPerformed.push({
            action: 'club-bookmarked',
            data: { clubId, clubName: clubRec.clubName }
        });
    }
    return this.save();
};

enhancedQuizResultSchema.methods.rateClubRecommendation = function (clubId, rating, helpful = null) {
    const clubRec = this.clubRecommendations.find(c => c.clubId.toString() === clubId.toString());
    if (clubRec) {
        clubRec.userInteraction.feedback = { rating, helpful };
        this.analytics.actionsPerformed.push({
            action: 'club-rated',
            data: { clubId, rating, helpful }
        });
    }
    return this.save();
};

enhancedQuizResultSchema.methods.incrementViewCount = function () {
    this.analytics.viewCount += 1;
    this.lastViewed = new Date();
    return this.save();
};

enhancedQuizResultSchema.methods.getFormattedForAPI = function () {
    return {
        id: this._id,
        topMatch: this.topMatch,
        allMatches: this.allMatches.slice(0, 3), // Only top 3 for UI
        clubRecommendations: this.clubRecommendations,
        aiInsights: this.aiInsights,
        qualityMetrics: this.qualityMetrics,
        progressPercentage: this.progressPercentage,
        createdAt: this.createdAt,
        level: this.quizLevel
    };
};

// Static Methods
enhancedQuizResultSchema.statics.findUserResults = function (userId, limit = 5) {
    return this.find({ user: userId })
        .sort({ createdAt: -1 })
        .limit(limit)
        .populate('clubRecommendations.clubId')
        .lean();
};

enhancedQuizResultSchema.statics.getAnalytics = function () {
    return this.aggregate([
        {
            $group: {
                _id: '$topMatch.career',
                count: { $sum: 1 },
                avgConfidence: { $avg: '$qualityMetrics.aiConfidence' },
                avgUserRating: { $avg: '$userFeedback.overallRating' }
            }
        },
        { $sort: { count: -1 } }
    ]);
};

enhancedQuizResultSchema.statics.getClubRecommendationStats = function () {
    return this.aggregate([
        { $unwind: '$clubRecommendations' },
        {
            $group: {
                _id: '$clubRecommendations.clubName',
                recommendationCount: { $sum: 1 },
                avgRelevanceScore: { $avg: '$clubRecommendations.relevanceScore' },
                bookmarkRate: {
                    $avg: { $cond: ['$clubRecommendations.userInteraction.bookmarked', 1, 0] }
                }
            }
        },
        { $sort: { recommendationCount: -1 } }
    ]);
};

// Middleware
enhancedQuizResultSchema.pre('save', function (next) {
    if (this.isModified()) {
        this.updatedAt = new Date();
    }
    next();
});

// Export model
module.exports = mongoose.model('EnhancedQuizResult', enhancedQuizResultSchema);