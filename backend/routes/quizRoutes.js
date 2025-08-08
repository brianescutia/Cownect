// =============================================================================
// DYNAMIC QUIZ RESULTS API ROUTES
// =============================================================================
// Save as backend/routes/quizRoutes.js

const express = require('express');
const router = express.Router();
const { CareerField, QuizQuestion, QuizResult } = require('../models/nicheQuizModels');

// =============================================================================
// GET QUIZ QUESTIONS BY LEVEL
// =============================================================================
router.get('/questions/:level', async (req, res) => {
    try {
        const { level } = req.params;

        console.log(`📝 Loading questions for level: ${level}`);

        // Validate level
        const validLevels = ['beginner', 'intermediate', 'advanced'];
        if (!validLevels.includes(level)) {
            return res.status(400).json({ error: 'Invalid quiz level' });
        }

        // Get questions for this level
        const questions = await QuizQuestion.getQuestionsByLevel(level);

        console.log(`✅ Found ${questions.length} questions for ${level} level`);

        res.json({
            success: true,
            questions: questions.map(q => ({
                id: q._id,
                questionText: q.questionText,
                questionLevel: q.questionLevel,
                questionType: q.questionType,
                category: q.category,
                difficultyWeight: q.difficultyWeight,
                options: q.options.map((option, index) => ({
                    id: index,
                    text: option.text,
                    description: option.description,
                    weights: option.weights
                }))
            }))
        });

    } catch (error) {
        console.error('💥 Error loading quiz questions:', error);
        res.status(500).json({ error: 'Failed to load quiz questions' });
    }
});

// =============================================================================
// SUBMIT QUIZ & CALCULATE DYNAMIC RESULTS
// =============================================================================
router.post('/submit', async (req, res) => {
    try {
        const { level, answers, completionTime } = req.body;
        const userId = req.session?.userId;

        console.log(`📊 Processing quiz submission for level: ${level}`);
        console.log(`📝 Received ${answers.length} answers`);

        // Validate input
        if (!level || !answers || !Array.isArray(answers)) {
            return res.status(400).json({ error: 'Invalid submission data' });
        }

        // Load all career fields and questions
        const [careerFields, questions] = await Promise.all([
            CareerField.find({ isActive: true }),
            QuizQuestion.find({ questionLevel: level, isActive: true })
        ]);

        if (careerFields.length === 0) {
            throw new Error('No career fields found');
        }

        console.log(`🎯 Loaded ${careerFields.length} career fields`);
        console.log(`❓ Loaded ${questions.length} questions`);

        // Calculate user skill scores from answers
        const userSkillScores = calculateUserSkillScores(answers, questions);
        console.log('🧮 Calculated user skill scores:', userSkillScores);

        // Calculate matches with all career fields
        const careerMatches = careerFields.map(field => {
            const matchPercentage = calculateCareerMatch(userSkillScores, field.skillWeights);
            const confidence = getConfidenceLevel(matchPercentage);

            return {
                field: field._id,
                career: field.name,
                category: field.category,
                percentage: matchPercentage,
                confidence: confidence,
                description: field.description,
                skillWeights: field.skillWeights,
                progression: field.progression,
                marketData: field.marketData,
                relatedClubs: field.relatedClubs
            };
        });

        // Sort by match percentage
        careerMatches.sort((a, b) => b.percentage - a.percentage);

        const topMatch = careerMatches[0];
        console.log(`🥇 Top match: ${topMatch.career} (${topMatch.percentage}%)`);

        // Generate next steps for top match
        const nextSteps = generateNextSteps(topMatch, userSkillScores);

        // Save result to database if user is logged in
        if (userId) {
            try {
                const quizResult = new QuizResult({
                    user: userId,
                    quizLevel: level,
                    answers: answers,
                    skillScores: userSkillScores,
                    careerMatches: careerMatches.slice(0, 10).map(match => ({
                        field: match.field,
                        matchPercentage: match.percentage,
                        confidence: match.confidence
                    })),
                    topMatch: {
                        careerName: topMatch.career,
                        percentage: topMatch.percentage,
                        nextSteps: nextSteps
                    },
                    completionTime: completionTime
                });

                await quizResult.save();
                console.log('💾 Quiz result saved to database');
            } catch (saveError) {
                console.error('⚠️ Failed to save quiz result:', saveError);
                // Continue without saving - don't fail the entire request
            }
        }

        // Format response with dynamic results
        const response = {
            success: true,
            results: {
                topMatch: {
                    career: topMatch.career,
                    description: topMatch.description,
                    percentage: topMatch.percentage,
                    category: topMatch.category,
                    confidence: topMatch.confidence,
                    careerProgression: topMatch.progression || [],
                    marketData: topMatch.marketData || {},
                    nextSteps: nextSteps,
                    recommendedClubs: [] // TODO: Populate with actual clubs
                },
                allMatches: careerMatches.slice(0, 8).map(match => ({
                    career: match.career,
                    category: match.category,
                    percentage: match.percentage,
                    confidence: match.confidence
                })),
                skillBreakdown: userSkillScores,
                level: level,
                completionTime: completionTime
            }
        };

        console.log('🎉 Sending dynamic quiz results');
        res.json(response);

    } catch (error) {
        console.error('💥 Error processing quiz submission:', error);
        res.status(500).json({
            error: 'Failed to process quiz submission',
            details: error.message
        });
    }
});

// =============================================================================
// QUIZ CALCULATION FUNCTIONS
// =============================================================================

function calculateUserSkillScores(answers, questions) {
    const skillTotals = {
        technical: 0,
        creative: 0,
        social: 0,
        leadership: 0,
        research: 0,
        pace: 0,
        risk: 0,
        structure: 0
    };

    const skillCounts = {
        technical: 0,
        creative: 0,
        social: 0,
        leadership: 0,
        research: 0,
        pace: 0,
        risk: 0,
        structure: 0
    };

    answers.forEach(answer => {
        const question = questions.find(q => q._id.toString() === answer.questionId);
        if (!question) return;

        const weight = question.difficultyWeight || 1;

        // Process ranking - higher rank (lower index) = higher preference
        answer.ranking.forEach((optionIndex, rank) => {
            const option = question.options[optionIndex];
            if (!option || !option.weights) return;

            // Calculate preference score (4 options: 4,3,2,1 points for ranks 0,1,2,3)
            const preferenceScore = question.options.length - rank;

            Object.keys(option.weights).forEach(skill => {
                if (skillTotals.hasOwnProperty(skill)) {
                    // Weight the option's skill value by user preference and question difficulty
                    const weightedScore = option.weights[skill] * preferenceScore * weight;
                    skillTotals[skill] += weightedScore;
                    skillCounts[skill] += preferenceScore * weight;
                }
            });
        });
    });

    // Normalize scores to 1-10 scale
    const userSkillScores = {};
    Object.keys(skillTotals).forEach(skill => {
        if (skillCounts[skill] > 0) {
            // Average the weighted scores and normalize to 1-10
            const rawScore = skillTotals[skill] / skillCounts[skill];
            userSkillScores[skill] = Math.max(1, Math.min(10, Math.round(rawScore * 10) / 10));
        } else {
            userSkillScores[skill] = 5; // Default neutral score
        }
    });

    return userSkillScores;
}

function calculateCareerMatch(userScores, careerWeights) {
    let totalSimilarity = 0;
    let totalWeight = 0;

    Object.keys(userScores).forEach(skill => {
        if (careerWeights[skill] !== undefined) {
            // Calculate similarity (10 - absolute difference)
            const difference = Math.abs(userScores[skill] - careerWeights[skill]);
            const similarity = Math.max(0, 10 - difference);

            // Weight by career field's importance for this skill
            const weight = careerWeights[skill] / 10; // Normalize career weight

            totalSimilarity += similarity * weight;
            totalWeight += weight;
        }
    });

    // Calculate final percentage (0-100%)
    const matchScore = totalWeight > 0 ? (totalSimilarity / totalWeight) : 0;
    return Math.max(10, Math.min(100, Math.round(matchScore * 10)));
}

function getConfidenceLevel(percentage) {
    if (percentage >= 80) return 'High';
    if (percentage >= 60) return 'Medium';
    return 'Low';
}

function generateNextSteps(topMatch, userSkillScores) {
    const steps = [];

    // Skill-based recommendations
    const lowSkills = Object.entries(userSkillScores)
        .filter(([skill, score]) => score < topMatch.skillWeights[skill] - 2)
        .sort(([, a], [, b]) => a - b)
        .slice(0, 2);

    lowSkills.forEach(([skill, score]) => {
        switch (skill) {
            case 'technical':
                steps.push('Build technical skills through coding bootcamps or online courses');
                break;
            case 'creative':
                steps.push('Develop creative problem-solving through design projects');
                break;
            case 'social':
                steps.push('Improve communication skills by joining clubs and networking events');
                break;
            case 'leadership':
                steps.push('Gain leadership experience through project management or team roles');
                break;
            case 'research':
                steps.push('Strengthen research abilities through academic projects or internships');
                break;
        }
    });

    // Career-specific recommendations
    if (topMatch.progression && topMatch.progression.length > 0) {
        const entryLevel = topMatch.progression.find(p => p.level === 'Entry') || topMatch.progression[0];
        if (entryLevel.roles) {
            steps.push(`Look for ${entryLevel.roles[0]} positions or internships`);
        }
    }

    // UC Davis specific
    steps.push('Connect with UC Davis career services for industry guidance');
    steps.push('Join relevant student organizations and tech clubs');

    return steps.slice(0, 4); // Return top 4 recommendations
}

// =============================================================================
// GET QUIZ INTRO DATA
// =============================================================================
router.get('/intro', async (req, res) => {
    try {
        const levels = [
            {
                level: 'beginner',
                title: 'Tech Explorer',
                description: 'New to tech? Discover what interests you most.',
                questionCount: 8,
                duration: '5-7 minutes'
            },
            {
                level: 'intermediate',
                title: 'Tech Curious',
                description: 'Some tech experience? Find your ideal specialization.',
                questionCount: 6,
                duration: '8-10 minutes'
            },
            {
                level: 'advanced',
                title: 'Tech Insider',
                description: 'Experienced in tech? Optimize your career path.',
                questionCount: 6,
                duration: '10-12 minutes'
            }
        ];

        res.json({ success: true, levels });
    } catch (error) {
        console.error('Error loading intro data:', error);
        res.status(500).json({ error: 'Failed to load intro data' });
    }
});

module.exports = router;