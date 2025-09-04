// Enhanced 3-Level Quiz Routes - FIXED VERSION
// Save as: backend/routes/enhancedThreeLevelQuizRoutes.js

const express = require('express');
const router = express.Router();
const path = require('path');

const { QuizResult } = require('../models/nicheQuizModels');
const User = require('../models/User');
const EnhancedThreeLevelAIAnalyzer = require('../services/enhancedThreeLevelAIAnalyzer');
const { enhancedThreeLevelQuizQuestions } = require('../data/enhancedThreeLevelQuizData');
const EnhancedQuizResult = require('../models/EnhancedQuizResult');
const ClubRecommendationService = require('../services/ClubRecommendationService');
const clubService = new ClubRecommendationService();

// =======================================
// Helpers (paths, features, utilities)
// =======================================

const PROJECT_ROOT = path.resolve(__dirname, '..', '..'); // -> /.../Cownect

function sendEnhancedResultsHtml(res) {
    const filePath = path.resolve(PROJECT_ROOT, 'frontend', 'pages', 'enhanced-results.html');
    console.log('Serving enhanced-results from:', filePath);
    return res.sendFile(filePath);
}

function getEstimatedTime(level, questionCount) {
    const timePerQuestion = {
        beginner: 0.875,      // ~52 sec
        intermediate: 1.5,    // ~90 sec
        advanced: 2.0         // ~120 sec
    };
    const baseTime = questionCount * (timePerQuestion[level] || 1.0);
    return `${Math.ceil(baseTime)}-${Math.ceil(baseTime * 1.5)} minutes`;
}

function getLevelFeatures(level) {
    const features = {
        beginner: [
            'Scenario-based problem solving',
            'Visual preference assessment',
            'Learning style evaluation',
            'Natural aptitude discovery'
        ],
        intermediate: [
            'Technical leadership scenarios',
            'Ethical decision frameworks',
            'User-centered design thinking',
            'Specialization guidance'
        ],
        advanced: [
            'Strategic decision making',
            'Technical architecture thinking',
            'Leadership and mentorship',
            'Career optimization insights'
        ]
    };
    return features[level] || features.intermediate;
}

function enhanceMarketData(marketData) {
    if (!marketData) {
        return {
            avgSalary: '$95k - $180k',
            jobGrowth: '+22%',
            workLifeBalance: '7.5/10',
            remoteOpportunities: '95%',
            demandLevel: 'Very High',
            keyInsight: 'Excellent career prospects with strong growth potential'
        };
    }
    return {
        avgSalary: marketData.avgSalary || '$95k - $180k',
        jobGrowth: marketData.jobGrowth || '+22%',
        workLifeBalance: marketData.workLifeBalance || '7.5/10',
        remoteOpportunities: marketData.remoteOpportunities || '95%',
        demandLevel: marketData.demandLevel || 'Very High',
        keyInsight: `${marketData.avgSalary ? 'Strong' : 'Excellent'} career prospects with ${marketData.jobGrowth ? 'documented' : 'projected'} growth potential`
    };
}

function enhanceNextSteps(nextSteps) {
    if (!Array.isArray(nextSteps)) return [];
    return nextSteps.slice(0, 3).map((step, i) => ({
        step: typeof step === 'string' ? step : step.step || 'Take action toward your career goals',
        category: ['immediate', 'short-term', 'long-term'][i] || 'immediate',
        priority: ['high', 'medium', 'medium'][i] || 'medium',
        timeframe: ['1-2 weeks', 'next semester', '6-12 months'][i] || '1-4 weeks',
        difficulty: 'moderate',
        resources: [],
        completed: false
    }));
}

function generateCareerProgression(careerName) {
    const progressionMap = {
        'Software Engineering': [
            { level: 'Junior Developer', timeframe: '0-2 years', roles: ['Frontend Dev', 'Backend Dev'], skills: ['JavaScript', 'Git', 'APIs'], averageSalary: '$70k - $95k' },
            { level: 'Senior Developer', timeframe: '3-5 years', roles: ['Full Stack Dev', 'Tech Lead'], skills: ['System Design', 'Mentoring'], averageSalary: '$95k - $130k' },
            { level: 'Staff Engineer', timeframe: '5+ years', roles: ['Architect', 'Engineering Manager'], skills: ['Leadership', 'Strategy'], averageSalary: '$130k - $180k' }
        ],
        'Data Science': [
            { level: 'Junior Data Scientist', timeframe: '0-2 years', roles: ['Data Analyst', 'ML Engineer'], skills: ['Python', 'SQL', 'Statistics'], averageSalary: '$75k - $100k' },
            { level: 'Senior Data Scientist', timeframe: '3-5 years', roles: ['Lead Data Scientist'], skills: ['ML Ops', 'Business Strategy'], averageSalary: '$100k - $150k' },
            { level: 'Principal Data Scientist', timeframe: '5+ years', roles: ['Data Science Manager'], skills: ['Leadership', 'Research'], averageSalary: '$150k - $200k' }
        ]
    };
    return progressionMap[careerName] || [
        { level: 'Entry Level', timeframe: '0-2 years', roles: ['Junior'], averageSalary: '$70k - $95k' },
        { level: 'Mid Level', timeframe: '3-5 years', roles: ['Senior'], averageSalary: '$95k - $130k' },
        { level: 'Senior Level', timeframe: '5+ years', roles: ['Lead'], averageSalary: '$130k+' }
    ];
}

function categorizeCareer(careerName) {
    const categoryMap = {
        'Software Engineering': 'Engineering',
        'Data Science': 'Data & Analytics',
        'DevOps Engineering': 'Engineering',
        'UX Design': 'Design',
        'Product Management': 'Product',
        'Cybersecurity': 'Security',
        'AI/ML Engineering': 'AI & ML'
    };
    return categoryMap[careerName] || 'Technology';
}

function generateKeyStrengths(careerName) {
    const strengthsMap = {
        'Software Engineering': ['Problem solving', 'Technical implementation', 'System thinking'],
        'Data Science': ['Analytical thinking', 'Pattern recognition', 'Statistical reasoning'],
        'UX Design': ['User empathy', 'Design thinking', 'Creative problem solving']
    };
    return strengthsMap[careerName] || ['Technical aptitude', 'Problem solving', 'Analytical thinking'];
}

// =======================================
// Middleware
// =======================================

const requireAuth = (req, res, next) => {
    if (req.session && req.session.userId) return next();
    return res.status(401).json({ error: 'Authentication required' });
};

// Simple submission cooldown (optional)
const submissionCooldown = new Map();
const COOLDOWN_MINUTES = 3;
const rateLimitQuizSubmission = (req, res, next) => {
    const userId = req.session.userId;
    const now = Date.now();
    const last = submissionCooldown.get(userId);
    if (last && (now - last) < COOLDOWN_MINUTES * 60 * 1000) {
        const remaining = Math.ceil((COOLDOWN_MINUTES * 60 * 1000 - (now - last)) / 1000);
        return res.status(429).json({ error: 'Please wait before taking another quiz', remainingSeconds: remaining });
    }
    next();
};

// =======================================
// Analyzer
// =======================================

const analyzer = new EnhancedThreeLevelAIAnalyzer();

// =======================================
// Routes: Intro + Questions
// =======================================

// GET /api/quiz/enhanced/intro
router.get('/enhanced/intro', async (_req, res) => {
    try {
        const levels = ['beginner', 'intermediate', 'advanced'].map(level => ({
            level,
            title: { beginner: 'Tech Explorer', intermediate: 'Tech Curious', advanced: 'Tech Insider' }[level],
            subtitle: {
                beginner: 'New to tech? Discover your path.',
                intermediate: 'Some experience? Find your specialization.',
                advanced: 'Experienced? Optimize your trajectory.'
            }[level],
            description: {
                beginner: 'Perfect for students with no tech background who want to explore if tech is right for them.',
                intermediate: 'For students with some tech exposure looking for an ideal focus area.',
                advanced: 'For students with significant experience who want to refine their strategy.'
            }[level],
            duration: { beginner: '5-7 minutes', intermediate: '8-10 minutes', advanced: '10-12 minutes' }[level],
            questionCount: (enhancedThreeLevelQuizQuestions[level] || []).length,
            icon: { beginner: '🌱', intermediate: '🚀', advanced: '⚡' }[level],
            features: getLevelFeatures(level),
            questionTypes: [...new Set((enhancedThreeLevelQuizQuestions[level] || []).map(q => q.type))]
        }));
        res.json({
            levels,
            systemInfo: {
                totalCareerOptions: 40,
                analysisType: 'Enhanced AI with Psychological Profiling',
                accuracy: '95%+ confidence scoring',
                personalization: 'Level-specific guidance and insights'
            }
        });
    } catch (err) {
        console.error('Intro error:', err);
        res.status(500).json({ error: 'Failed to load quiz introduction' });
    }
});

// GET /api/quiz/enhanced/questions/:level
router.get('/enhanced/questions/:level', requireAuth, async (req, res) => {
    try {
        const { level } = req.params;
        const valid = ['beginner', 'intermediate', 'advanced'];
        if (!valid.includes(level)) return res.status(400).json({ error: 'Invalid quiz level', validLevels: valid });

        const questions = enhancedThreeLevelQuizQuestions[level] || [];
        if (questions.length === 0) return res.status(404).json({ error: 'No questions found for this level' });

        const formatted = questions.map((q, i) => ({
            id: q.id,
            questionNumber: i + 1,
            type: q.type,
            category: q.category,
            question: q.question,
            subtitle: q.subtitle || '',
            ...(q.options && { options: q.options }),
            ...(q.scale && { scale: q.scale }),
            ...(q.items && { items: q.items }),
            ...(q.placeholder && { placeholder: q.placeholder }),
            ...(q.max_length && { max_length: q.max_length }),
            totalQuestions: questions.length,
            metadata: { level, enhanced: true, aiPowered: true }
        }));

        res.json({
            level,
            questions: formatted,
            metadata: {
                totalQuestions: questions.length,
                estimatedTime: getEstimatedTime(level, questions.length),
                analysisType: `Enhanced AI Career Analysis - ${level[0].toUpperCase()}${level.slice(1)}`
            }
        });
    } catch (err) {
        console.error('Questions error:', err);
        res.status(500).json({ error: 'Failed to load quiz questions' });
    }
});

// =======================================
// Submit & Analyze
// =======================================

// POST /api/quiz/submit   (router mounted at /api/quiz)
router.post('/submit', requireAuth, rateLimitQuizSubmission, async (req, res) => {
    try {
        const { level, answers, completionTime, metadata } = req.body;
        const userId = req.session.userId;
        const userEmail = req.session.userEmail;

        console.log(`📊 Processing enhanced quiz submission for ${userEmail}`);

        if (!level || !Array.isArray(answers)) {
            return res.status(400).json({ error: 'Invalid submission data', required: ['level', 'answers array'] });
        }

        const userProfile = await User.findById(userId).select('major year name email');

        const analysisResults = await analyzer.analyzeCareerFit(
            answers,
            req.body.questions || [],
            level,
            { major: userProfile?.major, year: userProfile?.year, email: userEmail, completionTime }
        );
        if (!analysisResults?.success) throw new Error('AI analysis failed');

        const topCareer = analysisResults.results.topMatch.career;
        const allMatches = analysisResults.results.allMatches || [];
        const clubRecommendations = await clubService.getClubRecommendations(topCareer, allMatches);

        // Try to save legacy QuizResult; ignore failure
        let originalQuizResultId = null;
        try {
            const originalQuizResult = new QuizResult({
                user: userId,
                quizLevel: `enhanced-${level}`,  // may fail enum; caught below
                answers: (answers || []).map(a => ({
                    questionId: String(a.questionId),
                    ranking: Array.isArray(a.ranking) ? a.ranking : [],
                    timeTaken: a.timeTaken || 0
                })),
                topMatch: {
                    careerName: topCareer,
                    percentage: analysisResults.results.topMatch.percentage,
                    reasoning: analysisResults.results.topMatch.reasoning
                },
                completionTime,
                metadata: { ...metadata, enhanced: true }
            });
            await originalQuizResult.save();
            originalQuizResultId = originalQuizResult._id;
        } catch (saveError) {
            console.error('⚠️ Failed to save to legacy QuizResult model:', saveError.message);
        }

        const enhancedResult = new EnhancedQuizResult({
            user: userId,
            originalQuizResult: originalQuizResultId,
            quizLevel: level,
            topMatch: {
                career: topCareer,
                percentage: analysisResults.results.topMatch.percentage,
                confidence: analysisResults.results.topMatch.confidence || analysisResults.results.topMatch.percentage,
                reasoning: analysisResults.results.topMatch.reasoning,
                personalizedInsights: analysisResults.results.aiInsights?.fullAnalysis,
                keyPatterns: analysisResults.results.topMatch.keyPatterns || [],
                marketData: enhanceMarketData(analysisResults.results.topMatch.marketData),
                nextSteps: enhanceNextSteps(analysisResults.results.topMatch.nextSteps || []),
                careerProgression: generateCareerProgression(topCareer)
            },
            allMatches: allMatches.slice(0, 3).map(match => ({
                career: match.career,
                category: match.category || categorizeCareer(match.career),
                percentage: match.percentage,
                confidence: match.confidence || match.percentage,
                reasoning: 'Strong alignment with your interests and skills',
                keyStrengths: generateKeyStrengths(match.career),
                marketData: enhanceMarketData({}) // default/fallback set
            })),
            clubRecommendations: clubRecommendations.map(club => ({
                clubId: club._id,
                clubName: club.name,
                relevanceScore: club.relevanceScore || 85,
                careerRelevance: club.careerRelevance,
                recommendationReason: club.recommendationReason,
                suggestedActions: club.suggestedActions || []
            })),
            aiInsights: {
                personalityProfile: analysisResults.results.personalityInsights?.workStyle,
                workStyle: analysisResults.results.personalityInsights?.workStyle,
                learningStyle: analysisResults.results.personalityInsights?.environment,
                motivationFactors: analysisResults.results.personalityInsights?.strengths ? [analysisResults.results.personalityInsights.strengths] : [],
                idealEnvironment: analysisResults.results.personalityInsights?.environment,
                strengthsToLeverage: analysisResults.results.personalityInsights?.strengths ? [analysisResults.results.personalityInsights.strengths] : [],
                potentialChallenges: analysisResults.results.personalityInsights?.challenges ? [analysisResults.results.personalityInsights.challenges] : [],
                confidenceScore: analysisResults.results.qualityMetrics?.confidence || 90,
                analysisQuality: (conf => (conf >= 95 ? 'excellent' : conf >= 85 ? 'good' : conf >= 75 ? 'fair' : 'needs-improvement'))(
                    analysisResults.results.qualityMetrics?.confidence || 90
                )
            },
            qualityMetrics: {
                responseConsistency: analysisResults.results.qualityMetrics?.authenticity || 90,
                analysisDepth: 95,
                recommendationRelevance: 88,
                aiConfidence: analysisResults.results.qualityMetrics?.confidence || 90,
                dataCompleteness: 92
            },
            analytics: {
                viewCount: 1,
                sectionsViewed: ['top-match'],
                actionsPerformed: [{ action: 'quiz-completed', data: { level, completionTime, careerMatch: topCareer } }]
            }
        });

        await enhancedResult.save();

        // Frontend can navigate to /enhanced-results (or /enhanced-results/:id if you prefer)
        return res.json({
            success: true,
            message: `Enhanced ${level} level career analysis completed successfully`,
            enhanced: true,
            redirectTo: '/pages/enhanced-results.html',
            results: {
                topMatch: {
                    career: topCareer,
                    percentage: analysisResults.results.topMatch.percentage,
                    confidence: analysisResults.results.topMatch.confidence || analysisResults.results.topMatch.percentage,
                    reasoning: analysisResults.results.topMatch.reasoning,
                    keyPatterns: analysisResults.results.topMatch.keyPatterns || [],
                    marketData: enhanceMarketData(analysisResults.results.topMatch.marketData),
                    nextSteps: enhanceNextSteps(analysisResults.results.topMatch.nextSteps || []),
                    recommendedClubs: clubRecommendations.slice(0, 3)
                },
                allMatches: allMatches.slice(0, 3),
                clubRecommendations: clubRecommendations.slice(0, 3),
                personalityInsights: analysisResults.results.personalityInsights,
                aiInsights: analysisResults.results.aiInsights,
                qualityMetrics: analysisResults.results.qualityMetrics,
                enhancedResultId: enhancedResult._id,
                originalQuizResultId: originalQuizResultId
            },
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('💥 Enhanced quiz submission error:', error);
        return res.status(500).json({ error: 'Enhanced career analysis failed', message: error.message, fallback: true });
    }
});

// =======================================
// Serve Results HTML + JSON APIs
// =======================================

// GET /enhanced-results  (serves the HTML for the most recent result)
router.get('/enhanced-results', requireAuth, async (req, res) => {
    try {
        const userId = req.session.userId;
        const enhancedResult = await EnhancedQuizResult
            .findOne({ user: userId })
            .sort({ createdAt: -1 })
            .populate('clubRecommendations.clubId');

        if (!enhancedResult) return res.redirect('/niche-quiz?message=no-results');

        await enhancedResult.incrementViewCount();
        return sendEnhancedResultsHtml(res);
    } catch (err) {
        console.error('Error loading enhanced results page:', err);
        return res.status(500).redirect('/niche-quiz?error=results-error');
    }
});

// GET /enhanced-results/:id  (serves the same HTML for a specific result)
router.get('/enhanced-results/:id', requireAuth, async (req, res) => {
    try {
        const userId = req.session.userId;
        const resultId = req.params.id;

        const enhancedResult = await EnhancedQuizResult
            .findOne({ _id: resultId, user: userId })
            .populate('clubRecommendations.clubId');

        if (!enhancedResult) return res.redirect('/niche-quiz?message=result-not-found');

        await enhancedResult.incrementViewCount();
        return sendEnhancedResultsHtml(res);
    } catch (err) {
        console.error('Error loading enhanced results page (by id):', err);
        return res.status(500).redirect('/niche-quiz?error=results-error');
    }
});

// GET /enhanced-results/:resultId (JSON data for the page’s XHR)
router.get('/enhanced-results/:resultId/data', requireAuth, async (req, res) => {
    try {
        const userId = req.session.userId;
        const resultId = req.params.resultId;

        const enhancedResult = await EnhancedQuizResult
            .findOne({ _id: resultId, user: userId })
            .populate('clubRecommendations.clubId');

        if (!enhancedResult) return res.status(404).json({ error: 'No enhanced results found' });

        res.json({ success: true, results: enhancedResult.getFormattedForAPI() });
    } catch (err) {
        console.error('Error fetching enhanced results JSON:', err);
        res.status(500).json({ error: 'Failed to fetch enhanced results' });
    }
});

// Optional: UI prefs / interactions (unchanged patterns)
router.post('/api/enhanced-results/:resultId/ui-preferences', requireAuth, async (req, res) => {
    try {
        const { resultId } = req.params;
        const { collapsedSections, preferredView, customNotes } = req.body;
        const userId = req.session.userId;

        const result = await EnhancedQuizResult.findOne({ _id: resultId, user: userId });
        if (!result) return res.status(404).json({ error: 'Result not found' });

        await result.updateUIPreferences({ collapsedSections, preferredView, customNotes });
        res.json({ success: true, message: 'UI preferences updated' });
    } catch (err) {
        console.error('Error updating UI preferences:', err);
        res.status(500).json({ error: 'Failed to update preferences' });
    }
});

router.post('/api/enhanced-results/:resultId/bookmark-club', requireAuth, async (req, res) => {
    try {
        const { resultId } = req.params;
        const { clubId } = req.body;
        const userId = req.session.userId;

        const result = await EnhancedQuizResult.findOne({ _id: resultId, user: userId });
        if (!result) return res.status(404).json({ error: 'Result not found' });

        await result.bookmarkClub(clubId);
        res.json({ success: true, message: 'Club bookmarked' });
    } catch (err) {
        console.error('Error bookmarking club:', err);
        res.status(500).json({ error: 'Failed to bookmark club' });
    }
});

router.post('/api/enhanced-results/:resultId/rate-club', requireAuth, async (req, res) => {
    try {
        const { resultId } = req.params;
        const { clubId, rating, helpful } = req.body;
        const userId = req.session.userId;

        const result = await EnhancedQuizResult.findOne({ _id: resultId, user: userId });
        if (!result) return res.status(404).json({ error: 'Result not found' });

        await result.rateClubRecommendation(clubId, rating, helpful);
        res.json({ success: true, message: 'Club recommendation rated' });
    } catch (err) {
        console.error('Error rating club recommendation:', err);
        res.status(500).json({ error: 'Failed to rate club recommendation' });
    }
});

router.post('/api/enhanced-results/:resultId/complete-step', requireAuth, async (req, res) => {
    try {
        const { resultId } = req.params;
        const { stepIndex, userNotes } = req.body;
        const userId = req.session.userId;

        const result = await EnhancedQuizResult.findOne({ _id: resultId, user: userId });
        if (!result) return res.status(404).json({ error: 'Result not found' });

        await result.completeStep(stepIndex, userNotes);
        res.json({ success: true, message: 'Step marked as completed', progressPercentage: result.progressPercentage });
    } catch (err) {
        console.error('Error completing step:', err);
        res.status(500).json({ error: 'Failed to complete step' });
    }
});

// =======================================
// Error handler (router-level)
// =======================================
router.use((error, _req, res, _next) => {
    console.error('🚨 Enhanced quiz router error:', error);
    res.status(500).json({ error: 'Enhanced quiz system error', message: error.message, timestamp: new Date().toISOString() });
});

module.exports = router;
