// =============================================================================
// QUIZ TESTING SCRIPT - Verify Dynamic Results Work
// =============================================================================
// Save as backend/test-quiz-dynamic.js
// Run with: node backend/test-quiz-dynamic.js

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { CareerField, QuizQuestion, QuizResult } = require('./models/nicheQuizModels');

dotenv.config();

// Test different user answer patterns
const testScenarios = [
    {
        name: "Technical User",
        description: "Prefers technical, structured, research-focused options",
        answers: [
            {
                questionId: null, // Will be filled in
                ranking: [1, 0, 3, 2], // Index 1 first (technical options), then index 0, etc.
                timeTaken: 30
            }
        ]
    },
    {
        name: "Creative User",
        description: "Prefers creative, design-focused, social options",
        answers: [
            {
                questionId: null,
                ranking: [2, 1, 0, 3], // Index 2 first (creative options)
                timeTaken: 25
            }
        ]
    },
    {
        name: "Leadership User",
        description: "Prefers social, leadership, pace-focused options",
        answers: [
            {
                questionId: null,
                ranking: [3, 2, 1, 0], // Index 3 first (leadership/social options)
                timeTaken: 35
            }
        ]
    }
];

// Calculation functions (copied from your app.js)
function calculateUserSkillScores(answers, questions) {
    const skillTotals = {
        technical: 0, creative: 0, social: 0, leadership: 0,
        research: 0, pace: 0, risk: 0, structure: 0
    };

    const skillCounts = {
        technical: 0, creative: 0, social: 0, leadership: 0,
        research: 0, pace: 0, risk: 0, structure: 0
    };

    answers.forEach(answer => {
        const question = questions.find(q => q._id.toString() === answer.questionId);
        if (!question) return;

        const weight = question.difficultyWeight || 1;

        answer.ranking.forEach((optionIndex, rank) => {
            const option = question.options[optionIndex];
            if (!option || !option.weights) return;

            const preferenceScore = question.options.length - rank;

            Object.keys(option.weights).forEach(skill => {
                if (skillTotals.hasOwnProperty(skill)) {
                    const weightedScore = option.weights[skill] * preferenceScore * weight;
                    skillTotals[skill] += weightedScore;
                    skillCounts[skill] += preferenceScore * weight;
                }
            });
        });
    });

    const userSkillScores = {};
    Object.keys(skillTotals).forEach(skill => {
        if (skillCounts[skill] > 0) {
            const rawScore = skillTotals[skill] / skillCounts[skill];
            userSkillScores[skill] = Math.max(1, Math.min(10, Math.round(rawScore * 10) / 10));
        } else {
            userSkillScores[skill] = 5;
        }
    });

    return userSkillScores;
}

function calculateCareerMatch(userScores, careerWeights) {
    let totalSimilarity = 0;
    let totalWeight = 0;

    Object.keys(userScores).forEach(skill => {
        if (careerWeights[skill] !== undefined) {
            const difference = Math.abs(userScores[skill] - careerWeights[skill]);
            const similarity = Math.max(0, 10 - difference);
            const weight = careerWeights[skill] / 10;

            totalSimilarity += similarity * weight;
            totalWeight += weight;
        }
    });

    const matchScore = totalWeight > 0 ? (totalSimilarity / totalWeight) : 0;
    return Math.max(10, Math.min(100, Math.round(matchScore * 10)));
}

async function testQuizDynamics() {
    try {
        console.log('🧪 Testing Quiz Dynamic Scoring System');
        console.log('='.repeat(50));

        // Connect to database
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Load test data
        const [careerFields, questions] = await Promise.all([
            CareerField.find({ isActive: true }),
            QuizQuestion.find({ questionLevel: 'beginner', isActive: true }).sort({ order: 1 })
        ]);

        console.log(`📊 Loaded ${careerFields.length} career fields`);
        console.log(`❓ Loaded ${questions.length} questions`);

        if (questions.length === 0) {
            console.log('❌ No questions found! Run seedQuizDataComplete.js first');
            return;
        }

        // Test each scenario
        for (let scenario of testScenarios) {
            console.log(`\n🎭 Testing: ${scenario.name}`);
            console.log(`📝 ${scenario.description}`);

            // Fill in question IDs for all questions (use same ranking pattern)
            const fullAnswers = questions.map(question => ({
                questionId: question._id.toString(),
                ranking: scenario.answers[0].ranking,
                timeTaken: scenario.answers[0].timeTaken
            }));

            // Calculate user skill scores
            const userSkillScores = calculateUserSkillScores(fullAnswers, questions);
            console.log('🧮 User Skill Profile:', userSkillScores);

            // Calculate career matches
            const careerMatches = careerFields.map(field => {
                const matchPercentage = calculateCareerMatch(userSkillScores, field.skillWeights);
                return {
                    career: field.name,
                    category: field.category,
                    percentage: matchPercentage
                };
            }).sort((a, b) => b.percentage - a.percentage);

            // Show top 3 matches
            console.log('🏆 Top Career Matches:');
            careerMatches.slice(0, 3).forEach((match, index) => {
                console.log(`   ${index + 1}. ${match.career} (${match.category}): ${match.percentage}%`);
            });

            console.log('-'.repeat(30));
        }

        console.log('\n🎉 Dynamic scoring test completed!');
        console.log('💡 Different user types should show different percentages');

    } catch (error) {
        console.error('💥 Test failed:', error);
    } finally {
        await mongoose.connection.close();
        console.log('🔌 Database connection closed');
        process.exit(0);
    }
}

// Run the test
if (require.main === module) {
    testQuizDynamics();
}

module.exports = { testQuizDynamics };

// =============================================================================
// USAGE INSTRUCTIONS:
// =============================================================================
//
// 1. Save this file as backend/test-quiz-dynamic.js
// 2. Run: node backend/test-quiz-dynamic.js
// 3. You should see different percentages for each user type:
//    - Technical User: High scores for DevOps/Web Dev/Data Science
//    - Creative User: High scores for UX Design/Product Management  
//    - Leadership User: High scores for Product Management/Leadership roles
//
// If you see the same percentages for all users, the dynamic system isn't working
//
// =============================================================================