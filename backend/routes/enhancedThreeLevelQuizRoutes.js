// Enhanced 3-Level Quiz Routes - FIXED VERSION
// Save as: backend/routes/enhancedThreeLevelQuizRoutes.js

const express = require('express');
const router = express.Router();
const path = require('path');

const { QuizResult } = require('../models/nicheQuizModels');
const User = require('../models/User');
const EnhancedThreeLevelAIAnalyzer = require('../services/enhancedThreeLevelAIAnalyzer');

// FIX: More robust import with debugging
let enhancedThreeLevelQuizQuestions;
try {
    const quizData = require('../data/enhancedThreeLevelQuizData');
    enhancedThreeLevelQuizQuestions = quizData.enhancedThreeLevelQuizQuestions;
    console.log('🔍 Enhanced routes - Questions loaded:', Object.keys(enhancedThreeLevelQuizQuestions || {}));
    console.log('📊 Beginner questions count:', (enhancedThreeLevelQuizQuestions?.beginner || []).length);
} catch (error) {
    console.error('💥 Failed to load questions in routes:', error);
    enhancedThreeLevelQuizQuestions = {};
}

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

// Fixed Quiz Submission Route 
// Replace your existing /api/quiz/submit route in backend/routes/enhancedThreeLevelQuizRoutes.js

router.post('/submit', requireAuth, rateLimitQuizSubmission, async (req, res) => {
    try {
        const { level, answers, completionTime, metadata } = req.body;
        const userId = req.session.userId;
        const userEmail = req.session.userEmail;

        console.log(`📊 Processing enhanced quiz submission for ${userEmail}`);
        console.log(`📝 Submission data:`, {
            level,
            answersCount: answers?.length,
            completionTime,
            answersSample: answers?.slice(0, 2) // Log first 2 answers for debugging
        });

        // Validate input data
        if (!level || !Array.isArray(answers)) {
            console.error('❌ Invalid submission data:', { level, answersType: typeof answers });
            return res.status(400).json({
                error: 'Invalid submission data',
                required: ['level', 'answers array']
            });
        }

        // Get user profile for personalized analysis
        const userProfile = await User.findById(userId).select('major year name email');
        console.log(`👤 User profile:`, {
            major: userProfile?.major,
            year: userProfile?.year,
            email: userEmail
        });

        // Get questions for the specified level
        const questions = enhancedThreeLevelQuizQuestions[level] || [];
        console.log(`❓ Questions available for ${level}:`, questions.length);

        if (questions.length === 0) {
            console.error(`❌ No questions found for level: ${level}`);
            return res.status(500).json({ error: `No questions available for ${level} level` });
        }

        // Validate answers match questions
        if (answers.length !== questions.length) {
            console.error(`❌ Answer count mismatch: Expected ${questions.length}, got ${answers.length}`);
            return res.status(400).json({
                error: `Expected ${questions.length} answers, received ${answers.length}`
            });
        }

        // Process and validate answers format
        const processedAnswers = answers.map((answer, index) => {
            const question = questions[index];
            if (!question) {
                console.warn(`⚠️ No question found for answer index ${index}`);
                return answer;
            }

            // Ensure answer has the expected structure based on question type
            const processedAnswer = {
                questionId: answer.questionId || index,
                questionType: question.type,
                category: question.category,
                timeTaken: answer.timeTaken || 0,
                timestamp: answer.timestamp || Date.now()
            };

            // Process different answer types
            switch (question.type) {
                case 'short_response':
                    processedAnswer.textResponse = answer.textResponse || answer.response || '';
                    break;

                case 'multiple_choice':
                case 'scenario':
                case 'visual_choice':
                    if (answer.selectedOption) {
                        processedAnswer.selectedOption = answer.selectedOption;
                    } else if (answer.selected !== undefined) {
                        // Find the selected option from the question
                        const selectedIndex = parseInt(answer.selected);
                        if (question.options && question.options[selectedIndex]) {
                            processedAnswer.selectedOption = question.options[selectedIndex];
                        }
                    }
                    break;

                case 'scale':
                    processedAnswer.scaleValue = answer.scaleValue || answer.value;
                    break;

                case 'ranking':
                    processedAnswer.ranking = answer.ranking || [];
                    break;

                default:
                    console.warn(`⚠️ Unknown question type: ${question.type}`);
                    processedAnswer.rawAnswer = answer;
            }

            return processedAnswer;
        });

        console.log(`🔄 Processed answers sample:`, {
            totalProcessed: processedAnswers.length,
            firstAnswer: processedAnswers[0],
            answerTypes: processedAnswers.map(a => a.questionType)
        });

        // Initialize AI analyzer and run analysis
        console.log('🧠 Starting AI analysis...');
        const analysisResults = await analyzer.analyzeCareerFit(
            processedAnswers,
            questions,
            level,
            {
                major: userProfile?.major,
                year: userProfile?.year,
                email: userEmail,
                completionTime: completionTime,
                university: 'UC Davis'
            }
        );

        console.log('🎯 AI Analysis results:', {
            success: analysisResults?.success,
            topCareer: analysisResults?.results?.topMatch?.career,
            confidence: analysisResults?.results?.topMatch?.percentage,
            hasAllMatches: !!analysisResults?.results?.allMatches,
            matchesCount: analysisResults?.results?.allMatches?.length
        });

        if (!analysisResults?.success) {
            console.error('❌ AI analysis failed:', analysisResults);
            throw new Error('AI analysis failed to produce valid results');
        }

        // Validate AI results structure
        if (!analysisResults.results?.topMatch?.career) {
            console.error('❌ Invalid AI results structure:', analysisResults.results);
            throw new Error('AI returned invalid results structure');
        }

        const topCareer = analysisResults.results.topMatch.career;
        const allMatches = analysisResults.results.allMatches || [];

        // Get club recommendations
        console.log('🏛️ Getting club recommendations...');
        const clubRecommendations = await clubService.getClubRecommendations(topCareer, allMatches);
        console.log(`📚 Found ${clubRecommendations.length} club recommendations`);

        // Generate additional data
        const careerProgression = getCareerProgression(topCareer);
        const marketData = getMarketData(topCareer);
        const nextSteps = getNextSteps(topCareer, level);

        // Save to legacy QuizResult model (optional, ignore errors)
        let originalQuizResultId = null;
        try {
            const legacyResult = new QuizResult({
                user: userId,
                quizLevel: `enhanced-${level}`,
                answers: processedAnswers.map(a => ({
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
                metadata: { ...metadata, enhanced: true, aiPowered: true }
            });

            await legacyResult.save();
            originalQuizResultId = legacyResult._id;
            console.log('💾 Saved to legacy QuizResult model');
        } catch (saveError) {
            console.warn('⚠️ Failed to save to legacy model (continuing):', saveError.message);
        }

        // Create enhanced result
        console.log('💾 Creating enhanced result...');
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
                marketData: enhanceMarketData(marketData),
                nextSteps: enhanceNextSteps(nextSteps),
                careerProgression: careerProgression
            },
            allMatches: allMatches.slice(0, 3).map(match => ({
                career: match.career,
                category: match.category || categorizeCareer(match.career),
                percentage: match.percentage,
                confidence: match.confidence || match.percentage,
                reasoning: match.reasoning || 'Strong alignment with your interests and skills',
                keyStrengths: generateKeyStrengths(match.career)
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
                motivationFactors: analysisResults.results.personalityInsights?.strengths ?
                    [analysisResults.results.personalityInsights.strengths] : [],
                idealEnvironment: analysisResults.results.personalityInsights?.environment,
                strengthsToLeverage: analysisResults.results.personalityInsights?.strengths ?
                    [analysisResults.results.personalityInsights.strengths] : [],
                potentialChallenges: analysisResults.results.personalityInsights?.challenges ?
                    [analysisResults.results.personalityInsights.challenges] : [],
                confidenceScore: analysisResults.results.qualityMetrics?.confidence || 90,
                analysisQuality: getAnalysisQuality(analysisResults.results.qualityMetrics?.confidence || 90)
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
                actionsPerformed: [{
                    action: 'quiz-completed',
                    data: {
                        level,
                        completionTime,
                        careerMatch: topCareer,
                        totalAnswers: processedAnswers.length
                    }
                }]
            }
        });

        await enhancedResult.save();
        console.log(`✅ Enhanced result saved with ID: ${enhancedResult._id}`);

        // Store results in session for immediate access
        req.session.latestQuizResult = enhancedResult._id.toString();

        // Format response for frontend
        const response = {
            success: true,
            message: `Enhanced ${level} level career analysis completed successfully`,
            enhanced: true,
            redirectTo: '/enhanced-results',
            results: {
                topMatch: {
                    career: topCareer,
                    percentage: analysisResults.results.topMatch.percentage,
                    confidence: analysisResults.results.topMatch.confidence || analysisResults.results.topMatch.percentage,
                    reasoning: analysisResults.results.topMatch.reasoning,
                    keyPatterns: analysisResults.results.topMatch.keyPatterns || [],
                    marketData: enhanceMarketData(marketData),
                    nextSteps: enhanceNextSteps(nextSteps),
                    careerProgression: careerProgression
                },
                allMatches: allMatches.slice(0, 3),
                clubRecommendations: clubRecommendations.slice(0, 3),
                personalityInsights: analysisResults.results.personalityInsights,
                aiInsights: analysisResults.results.aiInsights,
                qualityMetrics: analysisResults.results.qualityMetrics,
                enhancedResultId: enhancedResult._id,
                originalQuizResultId: originalQuizResultId
            },
            debug: {
                processedAnswersCount: processedAnswers.length,
                questionsCount: questions.length,
                aiAnalysisSuccess: analysisResults.success,
                topCareerMatch: topCareer
            },
            timestamp: new Date().toISOString()
        };

        console.log(`✅ Enhanced analysis complete: ${topCareer} (${analysisResults.results.topMatch.percentage}%)`);
        res.json(response);

    } catch (error) {
        console.error('💥 Enhanced quiz submission error:', error);
        console.error('Error stack:', error.stack);

        res.status(500).json({
            error: 'Enhanced career analysis failed',
            message: error.message,
            suggestion: 'Please try again or contact support if the issue persists',
            debug: {
                errorType: error.name,
                timestamp: new Date().toISOString()
            }
        });
    }
});

function getAnalysisQuality(confidence) {
    if (confidence >= 95) return 'excellent';
    if (confidence >= 85) return 'good';
    if (confidence >= 75) return 'fair';
    return 'needs-improvement';
}

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


// Add these helper functions to your backend/routes/enhancedThreeLevelQuizRoutes.js
// Put them at the bottom of the file, before module.exports = router;

function getCareerProgression(careerName) {
    const progressions = {
        'Technical Writing': [
            {
                level: 'Entry',
                roles: ['Junior Technical Writer', 'Documentation Specialist'],
                timeline: '0-2 years',
                salary: { min: 55, max: 75 }
            },
            {
                level: 'Mid',
                roles: ['Technical Writer', 'Senior Documentation Specialist'],
                timeline: '2-5 years',
                salary: { min: 75, max: 105 }
            },
            {
                level: 'Senior',
                roles: ['Senior Technical Writer', 'Documentation Manager'],
                timeline: '5+ years',
                salary: { min: 105, max: 140 }
            }
        ],
        'UX/UI Design': [
            {
                level: 'Entry',
                roles: ['Junior UX Designer', 'UI Designer'],
                timeline: '0-2 years',
                salary: { min: 70, max: 95 }
            },
            {
                level: 'Mid',
                roles: ['UX Designer', 'Senior UI Designer'],
                timeline: '2-5 years',
                salary: { min: 95, max: 130 }
            },
            {
                level: 'Senior',
                roles: ['Lead UX Designer', 'Design Manager'],
                timeline: '5+ years',
                salary: { min: 130, max: 180 }
            }
        ],
        'Software Engineering': [
            {
                level: 'Entry',
                roles: ['Junior Developer', 'Software Engineer I'],
                timeline: '0-2 years',
                salary: { min: 85, max: 110 }
            },
            {
                level: 'Mid',
                roles: ['Software Engineer II', 'Senior Developer'],
                timeline: '2-5 years',
                salary: { min: 110, max: 150 }
            },
            {
                level: 'Senior',
                roles: ['Staff Engineer', 'Principal Engineer'],
                timeline: '5+ years',
                salary: { min: 150, max: 220 }
            }
        ],
        'Data Science': [
            {
                level: 'Entry',
                roles: ['Data Analyst', 'Junior Data Scientist'],
                timeline: '0-2 years',
                salary: { min: 75, max: 100 }
            },
            {
                level: 'Mid',
                roles: ['Data Scientist', 'ML Engineer'],
                timeline: '2-5 years',
                salary: { min: 100, max: 140 }
            },
            {
                level: 'Senior',
                roles: ['Senior Data Scientist', 'Data Science Manager'],
                timeline: '5+ years',
                salary: { min: 140, max: 200 }
            }
        ]
    };

    return progressions[careerName] || progressions['Software Engineering'];
}

function getMarketData(careerName) {
    const marketData = {
        'Technical Writing': {
            avgSalary: '$75k - $120k',
            jobGrowth: '+7% (2022-2032)',
            demand: 'Moderate',
            workLifeBalance: '8.5/10',
            remoteOpportunities: '90%'
        },
        'UX/UI Design': {
            avgSalary: '$85k - $140k',
            jobGrowth: '+13% (2022-2032)',
            demand: 'High',
            workLifeBalance: '7.2/10',
            remoteOpportunities: '80%'
        },
        'Software Engineering': {
            avgSalary: '$110k - $180k',
            jobGrowth: '+22% (2022-2032)',
            demand: 'Very High',
            workLifeBalance: '7.5/10',
            remoteOpportunities: '95%'
        },
        'Data Science': {
            avgSalary: '$95k - $165k',
            jobGrowth: '+22% (2022-2032)',
            demand: 'Very High',
            workLifeBalance: '7.8/10',
            remoteOpportunities: '90%'
        }
    };

    return marketData[careerName] || marketData['Software Engineering'];
}

function getNextSteps(careerName, level) {
    const stepsByCareer = {
        'Technical Writing': {
            'beginner': [
                'Learn technical writing fundamentals and documentation tools',
                'Build a portfolio with 3-5 writing samples',
                'Join technical writing communities and practice'
            ],
            'intermediate': [
                'Master advanced documentation tools (GitBook, Confluence)',
                'Specialize in a technical domain (API docs, user guides)',
                'Apply for technical writing internships'
            ],
            'advanced': [
                'Lead documentation strategy for complex projects',
                'Mentor junior writers and establish best practices',
                'Pursue senior technical writing or content strategy roles'
            ]
        },
        'UX/UI Design': {
            'beginner': [
                'Learn design fundamentals and user research methods',
                'Build a portfolio with 3-5 design projects',
                'Join UC Davis Design Club and UX groups'
            ],
            'intermediate': [
                'Master advanced design tools (Figma, Adobe Creative Suite)',
                'Complete user research projects with real users',
                'Apply for UX design internships'
            ],
            'advanced': [
                'Lead design projects and mentor junior designers',
                'Specialize in areas like interaction design or design systems',
                'Build industry connections and pursue senior roles'
            ]
        }
    };

    const defaultSteps = [
        'Build foundational skills in your chosen field',
        'Create portfolio projects to showcase abilities',
        'Connect with UC Davis Career Center for guidance'
    ];

    return stepsByCareer[careerName]?.[level] || defaultSteps;
}

function getDefaultMatches(topCareer) {
    const relatedCareers = {
        'Technical Writing': [
            { career: 'Technical Writing', category: 'Communication', percentage: 85 },
            { career: 'UX Writing', category: 'Design', percentage: 78 },
            { career: 'Developer Relations', category: 'Communication', percentage: 72 },
            { career: 'Product Management', category: 'Product', percentage: 65 }
        ],
        'UX/UI Design': [
            { career: 'UX/UI Design', category: 'Design', percentage: 85 },
            { career: 'Product Design', category: 'Design', percentage: 78 },
            { career: 'Web Design', category: 'Design', percentage: 72 },
            { career: 'Software Engineering', category: 'Engineering', percentage: 65 }
        ]
    };

    return relatedCareers[topCareer] || relatedCareers['Software Engineering'];
}
// =======================================
// Error handler (router-level)
// =======================================
router.use((error, _req, res, _next) => {
    console.error('🚨 Enhanced quiz router error:', error);
    res.status(500).json({ error: 'Enhanced quiz system error', message: error.message, timestamp: new Date().toISOString() });
});

module.exports = router;
