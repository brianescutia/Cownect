// Enhanced 3-Level Quiz Routes - FIXED VERSION
// Save as: backend/routes/enhancedThreeLevelQuizRoutes.js

const express = require('express');
const router = express.Router();
const { QuizResult } = require('../models/nicheQuizModels');
const User = require('../models/User');
const EnhancedThreeLevelAIAnalyzer = require('../services/enhancedThreeLevelAIAnalyzer');
const { enhancedThreeLevelQuizQuestions } = require('../data/enhancedThreeLevelQuizData');

// Initialize the enhanced analyzer
const analyzer = new EnhancedThreeLevelAIAnalyzer();

// =============================================================================
// HELPER FUNCTIONS (defined as regular functions, not router methods)
// =============================================================================

function getEstimatedTime(level, questionCount) {
    const timePerQuestion = {
        beginner: 0.875,    // ~52 seconds per question
        intermediate: 1.5,  // ~90 seconds per question  
        advanced: 2.0       // ~2 minutes per question
    };

    const baseTime = questionCount * (timePerQuestion[level] || 1.0);
    const minTime = Math.ceil(baseTime);
    const maxTime = Math.ceil(baseTime * 1.5);

    return `${minTime}-${maxTime} minutes`;
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

function calculateLevelDistribution(results) {
    return results.reduce((acc, result) => {
        const level = result.quizLevel.replace('enhanced-', '');
        acc[level] = (acc[level] || 0) + 1;
        return acc;
    }, {});
}

// =============================================================================
// MIDDLEWARE
// =============================================================================
const requireAuth = (req, res, next) => {
    if (req.session && req.session.userId) {
        return next();
    }
    return res.status(401).json({ error: 'Authentication required' });
};

// Rate limiting for quiz submissions
const submissionCooldown = new Map();
const COOLDOWN_MINUTES = 3; // Reduced for better UX

const rateLimitQuizSubmission = (req, res, next) => {
    const userId = req.session.userId;
    const now = Date.now();
    const lastSubmission = submissionCooldown.get(userId);

    if (lastSubmission && (now - lastSubmission) < (COOLDOWN_MINUTES * 60 * 1000)) {
        const remainingTime = Math.ceil((COOLDOWN_MINUTES * 60 * 1000 - (now - lastSubmission)) / 1000);
        return res.status(429).json({
            error: 'Please wait before taking another quiz',
            remainingSeconds: remainingTime
        });
    }

    next();
};

// =============================================================================
// QUIZ INTRODUCTION AND LEVEL INFO
// =============================================================================

// GET /api/quiz/enhanced/intro - Enhanced 3-level intro
router.get('/enhanced/intro', async (req, res) => {
    try {
        console.log('🎯 Serving enhanced 3-level quiz introduction...');

        const levels = [
            {
                level: 'beginner',
                title: 'Tech Explorer',
                subtitle: 'New to tech? Discover your path.',
                description: 'Perfect for students with no tech background who want to explore if tech is right for them.',
                duration: '5-7 minutes',
                questionCount: enhancedThreeLevelQuizQuestions.beginner.length,
                icon: '🌱',
                features: [
                    'Beginner-friendly scenarios',
                    'No tech jargon required',
                    'Visual and scenario-based questions',
                    'Discover natural aptitudes'
                ],
                idealFor: 'Complete beginners, undecided majors, exploring options',
                questionTypes: ['scenario', 'visual_choice', 'scale', 'multiple_choice', 'ranking']
            },
            {
                level: 'intermediate',
                title: 'Tech Curious',
                subtitle: 'Some experience? Find your specialization.',
                description: 'Designed for students with some coding classes or tech exposure who want to find their ideal focus area.',
                duration: '8-10 minutes',
                questionCount: enhancedThreeLevelQuizQuestions.intermediate.length,
                icon: '🚀',
                features: [
                    'Technical leadership scenarios',
                    'Ethical decision-making',
                    'User-centered design thinking',
                    'Advanced career matching'
                ],
                idealFor: 'CS/STEM students, some coding experience, seeking specialization',
                questionTypes: ['scenario', 'scale', 'visual_choice', 'short_response', 'ranking']
            },
            {
                level: 'advanced',
                title: 'Tech Insider',
                subtitle: 'Experienced? Optimize your trajectory.',
                description: 'For students with significant tech experience who want to refine their career strategy and leadership path.',
                duration: '10-12 minutes',
                questionCount: enhancedThreeLevelQuizQuestions.advanced.length,
                icon: '⚡',
                features: [
                    'Strategic thinking scenarios',
                    'Technical architecture decisions',
                    'Leadership and mentorship',
                    'Career optimization insights'
                ],
                idealFor: 'Advanced CS students, internship experience, technical leadership roles',
                questionTypes: ['scenario', 'scale', 'short_response', 'visual_choice']
            }
        ];

        const response = {
            levels,
            systemInfo: {
                totalCareerOptions: 40,
                analysisType: 'Enhanced AI with Psychological Profiling',
                accuracy: '95%+ confidence scoring',
                antiGaming: 'Multi-format question detection',
                personalization: 'Level-specific guidance and insights'
            },
            features: [
                '🎯 Level-appropriate question difficulty',
                '🤖 Advanced AI analysis tailored to experience',
                '📊 Multiple question formats prevent boredom',
                '🎓 UC Davis specific recommendations',
                '⚡ Instant comprehensive results',
                '🛡️ Gaming-resistant design'
            ]
        };

        console.log(`✅ Served enhanced 3-level intro with ${levels.length} levels`);
        res.json(response);

    } catch (error) {
        console.error('💥 Error serving enhanced quiz intro:', error);
        res.status(500).json({ error: 'Failed to load quiz introduction' });
    }
});

// =============================================================================
// LOAD QUESTIONS FOR SPECIFIC LEVEL
// =============================================================================

// GET /api/quiz/enhanced/questions/:level - Load level-specific questions
router.get('/enhanced/questions/:level', requireAuth, async (req, res) => {
    try {
        const { level } = req.params;
        const validLevels = ['beginner', 'intermediate', 'advanced'];

        if (!validLevels.includes(level)) {
            return res.status(400).json({
                error: 'Invalid quiz level',
                validLevels
            });
        }

        console.log(`📚 Loading enhanced ${level} level questions for user: ${req.session.userEmail}`);

        // Get questions for the specified level
        const questions = enhancedThreeLevelQuizQuestions[level];

        if (!questions || questions.length === 0) {
            return res.status(404).json({
                error: 'No questions found for this level',
                suggestion: 'Please try another level or contact support'
            });
        }

        // Format questions for frontend (secure - no internal data exposed)
        const formattedQuestions = questions.map((q, index) => ({
            id: q.id,
            questionNumber: index + 1,
            type: q.type,
            category: q.category,
            question: q.question,
            subtitle: q.subtitle || '',

            // Include type-specific properties
            ...(q.options && { options: q.options }),
            ...(q.scale && { scale: q.scale }),
            ...(q.items && { items: q.items }),
            ...(q.placeholder && { placeholder: q.placeholder }),
            ...(q.max_length && { max_length: q.max_length }),

            totalQuestions: questions.length,
            metadata: {
                level: level,
                enhanced: true,
                aiPowered: true
            }
        }));

        const response = {
            level,
            questions: formattedQuestions,
            metadata: {
                totalQuestions: questions.length,
                estimatedTime: getEstimatedTime(level, questions.length), // Fixed: using function directly
                analysisType: `Enhanced AI Career Analysis - ${level.charAt(0).toUpperCase() + level.slice(1)} Level`,
                questionTypes: [...new Set(questions.map(q => q.type))],
                features: getLevelFeatures(level) // Fixed: using function directly
            },
            instructions: {
                general: 'Answer authentically - there are no right or wrong answers',
                scenario: 'Choose the approach that feels most natural to you',
                scale: 'Move the slider to reflect your true preference',
                visual_choice: 'Select the option that resonates most with you',
                short_response: 'Share your authentic experience - AI analyzes patterns, not content',
                ranking: 'Drag to order by personal importance',
                multiple_choice: 'Pick the option that best represents your approach'
            }
        };

        console.log(`✅ Served ${formattedQuestions.length} enhanced ${level} questions`);
        res.json(response);

    } catch (error) {
        console.error('💥 Error loading enhanced questions:', error);
        res.status(500).json({ error: 'Failed to load quiz questions' });
    }
});

// =============================================================================
// ENHANCED QUIZ SUBMISSION AND ANALYSIS
// =============================================================================

// POST /api/quiz/enhanced/submit - Submit and analyze enhanced quiz
router.post('/enhanced/submit', requireAuth, rateLimitQuizSubmission, async (req, res) => {
    try {
        const { level, answers, completionTime, metadata } = req.body;
        const userId = req.session.userId;
        const userEmail = req.session.userEmail;

        console.log(`🧠 Processing enhanced quiz submission for ${userEmail}`);
        console.log(`📊 Level: ${level}, Answers: ${answers?.length}, Time: ${completionTime}s`);

        // Validate input
        if (!level || !answers || !Array.isArray(answers)) {
            return res.status(400).json({
                error: 'Invalid submission data',
                required: ['level', 'answers array']
            });
        }

        const validLevels = ['beginner', 'intermediate', 'advanced'];
        if (!validLevels.includes(level)) {
            return res.status(400).json({
                error: 'Invalid quiz level',
                validLevels
            });
        }

        // Record submission time for rate limiting
        submissionCooldown.set(userId, Date.now());

        // Get questions for validation
        const questions = enhancedThreeLevelQuizQuestions[level];
        if (!questions || questions.length === 0) {
            return res.status(500).json({ error: 'Quiz questions not found for level' });
        }

        // Validate answer count
        if (answers.length !== questions.length) {
            return res.status(400).json({
                error: `Expected ${questions.length} answers for ${level} level, received ${answers.length}`
            });
        }

        // Get user profile for personalized analysis
        const userProfile = await User.findById(userId).select('major year name email');

        // Run enhanced AI analysis
        console.log('🤖 Running enhanced AI analysis...');
        const analysisResults = await analyzer.analyzeCareerFit(
            answers,
            questions,
            level,
            {
                major: userProfile?.major,
                year: userProfile?.year,
                email: userEmail,
                completionTime: completionTime
            }
        );

        if (!analysisResults.success) {
            throw new Error('Enhanced AI analysis failed to produce valid results');
        }

        // Save results to database
        const quizResult = new QuizResult({
            user: userId,
            quizLevel: `enhanced-${level}`,
            answers: answers,
            enhancedAIAnalysis: analysisResults.results,
            topMatch: {
                careerName: analysisResults.results.topMatch.career,
                percentage: analysisResults.results.topMatch.percentage,
                reasoning: analysisResults.results.topMatch.reasoning,
                nextSteps: analysisResults.results.topMatch.nextSteps,
                keyPatterns: analysisResults.results.topMatch.keyPatterns
            },
            completionTime: completionTime,
            metadata: {
                version: '3.0-Enhanced',
                analysisType: 'enhanced-three-level',
                level: level,
                aiModel: 'gpt-4-turbo',
                questionTypes: [...new Set(questions.map(q => q.type))],
                timestamp: new Date(),
                ...metadata
            }
        });

        await quizResult.save();

        // Format response
        const response = {
            success: true,
            message: `Enhanced ${level} level career analysis completed successfully`,
            analysisType: analysisResults.analysisType,
            level: level,
            results: {
                // Enhanced top match
                topMatch: {
                    career: analysisResults.results.topMatch.career,
                    percentage: analysisResults.results.topMatch.percentage,
                    confidence: analysisResults.results.topMatch.confidence,
                    reasoning: analysisResults.results.topMatch.reasoning,
                    keyPatterns: analysisResults.results.topMatch.keyPatterns,
                    nextSteps: analysisResults.results.topMatch.nextSteps,
                    marketData: analysisResults.results.topMatch.marketData,
                    ucDavisResources: analysisResults.results.topMatch.ucDavisResources
                },

                // All career matches
                allMatches: analysisResults.results.allMatches,

                // Enhanced insights
                personalityInsights: analysisResults.results.personalityInsights,
                developmentAreas: analysisResults.results.developmentAreas,
                levelSpecificGuidance: analysisResults.results.levelSpecificGuidance,
                aiInsights: analysisResults.results.aiInsights,

                // Quality metrics
                qualityMetrics: analysisResults.results.qualityMetrics,

                // Metadata
                metadata: {
                    level,
                    completionTime,
                    analysisVersion: '3.0-Enhanced',
                    questionTypes: [...new Set(questions.map(q => q.type))],
                    timestamp: analysisResults.timestamp
                }
            }
        };

        console.log(`✅ Enhanced ${level} analysis complete: ${analysisResults.results.topMatch.career} (${analysisResults.results.topMatch.percentage}%)`);
        res.json(response);

    } catch (error) {
        console.error('💥 Enhanced quiz submission error:', error);
        res.status(500).json({
            error: 'Enhanced career analysis failed',
            message: error.message,
            suggestion: 'Please try again or contact support if the issue persists'
        });
    }
});

// =============================================================================
// ENHANCED QUIZ RESULTS AND HISTORY
// =============================================================================

// GET /api/quiz/enhanced/results - Get enhanced quiz history
router.get('/enhanced/results', requireAuth, async (req, res) => {
    try {
        const { limit = 10, level } = req.query;
        const userId = req.session.userId;

        console.log(`📊 Fetching enhanced quiz results for user: ${req.session.userEmail}`);

        // Build query for enhanced results
        let query = {
            user: userId,
            quizLevel: { $regex: '^enhanced-' }
        };

        // Filter by specific level if requested
        if (level && ['beginner', 'intermediate', 'advanced'].includes(level)) {
            query.quizLevel = `enhanced-${level}`;
        }

        const results = await QuizResult.find(query)
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .lean();

        if (results.length === 0) {
            return res.json({
                results: [],
                message: 'No enhanced quiz results found',
                suggestion: 'Take your first enhanced AI-powered career assessment!'
            });
        }

        // Format results for frontend
        const formattedResults = results.map(result => ({
            id: result._id,
            level: result.quizLevel.replace('enhanced-', ''),
            completedAt: result.createdAt,
            topMatch: result.topMatch,
            qualityScore: result.enhancedAIAnalysis?.qualityMetrics?.authenticity ||
                result.qualityMetrics?.overall || 90,
            analysisVersion: result.metadata?.version || '3.0',
            questionTypes: result.metadata?.questionTypes || [],
            personalityInsights: result.enhancedAIAnalysis?.personalityInsights,
            keyPatterns: result.topMatch?.keyPatterns || []
        }));

        const response = {
            results: formattedResults,
            summary: {
                totalQuizzes: results.length,
                mostRecentLevel: results[0]?.quizLevel?.replace('enhanced-', ''),
                enhancedAnalyses: results.length,
                averageQuality: Math.round(
                    formattedResults.reduce((sum, r) => sum + r.qualityScore, 0) / formattedResults.length
                ),
                levelDistribution: calculateLevelDistribution(results) // Fixed: using function directly
            }
        };

        console.log(`✅ Served ${formattedResults.length} enhanced quiz results`);
        res.json(response);

    } catch (error) {
        console.error('💥 Error fetching enhanced quiz results:', error);
        res.status(500).json({ error: 'Failed to fetch enhanced quiz results' });
    }
});

// =============================================================================
// ERROR HANDLING
// =============================================================================
router.use((error, req, res, next) => {
    console.error('🚨 Enhanced quiz router error:', error);

    res.status(500).json({
        error: 'Enhanced quiz system error',
        message: error.message,
        timestamp: new Date().toISOString()
    });
});

module.exports = router;