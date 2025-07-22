// =============================================================================
// REAL QUIZ SCORING ALGORITHM & CAREER-TO-CLUB RECOMMENDATIONS
// =============================================================================
// Replace the mock scoring in your backend/app.js quiz submission route

// =============================================================================
// ENHANCED CAREER DEFINITIONS WITH COMPLETE WEIGHT MAPPINGS
// =============================================================================

const careerDefinitions = {
    "Software Engineering": {
        name: "Software Engineering",
        description: "Design and build scalable software systems, from web applications to distributed architectures. Focus on clean code, system design, and technical excellence.",
        category: "Engineering",

        // Primary skill requirements for this career
        skillWeights: {
            technical: 9,    // Core requirement - must be high
            creative: 6,     // Problem-solving creativity
            social: 5,       // Team collaboration
            leadership: 4,   // Technical leadership potential
            research: 5,     // Staying current with tech
            pace: 7,         // Fast-moving industry
            risk: 5,         // Moderate risk tolerance
            structure: 8     // System design, clean architecture
        },

        // Club matching tags (from our 50-club tagging system)
        matchingTags: {
            primary: ["programming", "webdev", "technical", "projects"], // Weight: 3x
            secondary: ["collaboration", "workshops", "innovation"],      // Weight: 2x  
            tertiary: ["networking", "professional", "academic"]         // Weight: 1x
        },

        // Career progression and market data
        progression: [
            {
                level: "Entry",
                roles: ["Junior Software Engineer", "Frontend Developer", "Backend Developer"],
                timeline: "0-2 years",
                salary: { min: 85, max: 120 }
            },
            {
                level: "Mid",
                roles: ["Software Engineer", "Full-Stack Developer", "Senior Developer"],
                timeline: "2-5 years",
                salary: { min: 120, max: 160 }
            },
            {
                level: "Senior",
                roles: ["Senior Engineer", "Staff Engineer", "Principal Engineer"],
                timeline: "5+ years",
                salary: { min: 160, max: 220 }
            }
        ],

        marketData: {
            jobGrowthRate: "+22% (2022-2032)",
            annualOpenings: 189200,
            workLifeBalance: "7.5/10",
            avgSalary: "$120k - $180k",
            topCompanies: ["Google", "Apple", "Microsoft", "Meta", "Netflix"]
        }
    },

    "Data Science": {
        name: "Data Science",
        description: "Extract insights from complex datasets using statistical analysis, machine learning, and data visualization. Drive business decisions through data-driven approaches.",
        category: "Data",

        skillWeights: {
            technical: 8,
            creative: 6,
            social: 5,
            leadership: 5,
            research: 9,    // Core requirement - research-heavy field
            pace: 6,
            risk: 4,
            structure: 7
        },

        matchingTags: {
            primary: ["ai", "data", "research", "analytics", "ml"],
            secondary: ["programming", "technical", "projects"],
            tertiary: ["collaboration", "academic", "innovation"]
        },

        progression: [
            {
                level: "Entry",
                roles: ["Data Analyst", "Junior Data Scientist", "ML Engineer Intern"],
                timeline: "0-2 years",
                salary: { min: 95, max: 130 }
            },
            {
                level: "Mid",
                roles: ["Data Scientist", "ML Engineer", "Senior Data Analyst"],
                timeline: "2-5 years",
                salary: { min: 130, max: 180 }
            },
            {
                level: "Senior",
                roles: ["Senior Data Scientist", "Principal Data Scientist", "ML Research Scientist"],
                timeline: "5+ years",
                salary: { min: 180, max: 250 }
            }
        ],

        marketData: {
            jobGrowthRate: "+35% (2022-2032)",
            annualOpenings: 17700,
            workLifeBalance: "7.8/10",
            avgSalary: "$130k - $200k",
            topCompanies: ["Netflix", "Uber", "Airbnb", "Google", "Amazon"]
        }
    },

    "UX/UI Design": {
        name: "UX/UI Design",
        description: "Create intuitive and beautiful user experiences through research, prototyping, and iterative design. Bridge the gap between user needs and technical possibilities.",
        category: "Design",

        skillWeights: {
            technical: 5,
            creative: 10,   // Core requirement - highly creative field
            social: 8,      // User research, stakeholder communication
            leadership: 5,
            research: 7,    // User research, usability testing
            pace: 6,
            risk: 5,
            structure: 5
        },

        matchingTags: {
            primary: ["design", "ux", "ui", "creative", "research"],
            secondary: ["collaboration", "projects", "prototyping"],
            tertiary: ["workshops", "presentation", "innovation"]
        },

        progression: [
            {
                level: "Entry",
                roles: ["Junior UX Designer", "UI Designer", "Product Designer"],
                timeline: "0-2 years",
                salary: { min: 75, max: 100 }
            },
            {
                level: "Mid",
                roles: ["UX Designer", "Senior Product Designer", "Design Lead"],
                timeline: "2-5 years",
                salary: { min: 100, max: 140 }
            },
            {
                level: "Senior",
                roles: ["Principal Designer", "Design Manager", "Head of Design"],
                timeline: "5+ years",
                salary: { min: 140, max: 200 }
            }
        ],

        marketData: {
            jobGrowthRate: "+13% (2022-2032)",
            annualOpenings: 5100,
            workLifeBalance: "7.2/10",
            avgSalary: "$95k - $150k",
            topCompanies: ["Apple", "Google", "Adobe", "Figma", "Airbnb"]
        }
    },

    "Product Management": {
        name: "Product Management",
        description: "Define product strategy and guide cross-functional teams to build products users love. Balance technical possibilities with business needs and user requirements.",
        category: "Product",

        skillWeights: {
            technical: 5,
            creative: 7,
            social: 9,      // Core requirement - heavy stakeholder management
            leadership: 9,  // Core requirement - leading without authority
            research: 6,
            pace: 8,        // Fast-moving, deadline-driven
            risk: 6,
            structure: 7
        },

        matchingTags: {
            primary: ["product", "leadership", "collaboration", "networking"],
            secondary: ["projects", "professional", "consulting"],
            tertiary: ["workshops", "presentation", "innovation"]
        },

        progression: [
            {
                level: "Entry",
                roles: ["Associate Product Manager", "Product Analyst", "Business Analyst"],
                timeline: "0-2 years",
                salary: { min: 100, max: 130 }
            },
            {
                level: "Mid",
                roles: ["Product Manager", "Senior Product Manager", "Group PM"],
                timeline: "2-5 years",
                salary: { min: 130, max: 180 }
            },
            {
                level: "Senior",
                roles: ["Principal PM", "Director of Product", "VP Product"],
                timeline: "5+ years",
                salary: { min: 180, max: 300 }
            }
        ],

        marketData: {
            jobGrowthRate: "+19% (2022-2032)",
            annualOpenings: 8900,
            workLifeBalance: "6.5/10",
            avgSalary: "$140k - $220k",
            topCompanies: ["Google", "Meta", "Amazon", "Microsoft", "Stripe"]
        }
    },

    "Cybersecurity": {
        name: "Cybersecurity Engineering",
        description: "Protect digital assets through security analysis, ethical hacking, and incident response. Build robust defenses against evolving cyber threats.",
        category: "Security",

        skillWeights: {
            technical: 9,   // Core requirement - highly technical
            creative: 5,
            social: 5,
            leadership: 5,
            research: 8,    // Staying ahead of threats
            pace: 7,        // Rapidly evolving threat landscape
            risk: 3,        // Low risk tolerance for security
            structure: 8    // Methodical, process-oriented
        },

        matchingTags: {
            primary: ["security", "cybersecurity", "hacking", "technical"],
            secondary: ["research", "networking", "competition"],
            tertiary: ["programming", "workshops", "professional"]
        },

        progression: [
            {
                level: "Entry",
                roles: ["Security Analyst", "Junior Security Engineer", "SOC Analyst"],
                timeline: "0-2 years",
                salary: { min: 85, max: 115 }
            },
            {
                level: "Mid",
                roles: ["Security Engineer", "Penetration Tester", "Security Consultant"],
                timeline: "2-5 years",
                salary: { min: 115, max: 160 }
            },
            {
                level: "Senior",
                roles: ["Senior Security Engineer", "Security Architect", "CISO"],
                timeline: "5+ years",
                salary: { min: 160, max: 220 }
            }
        ],

        marketData: {
            jobGrowthRate: "+32% (2022-2032)",
            annualOpenings: 16300,
            workLifeBalance: "7.0/10",
            avgSalary: "$115k - $180k",
            topCompanies: ["CrowdStrike", "Palo Alto Networks", "Google", "Microsoft", "Amazon"]
        }
    },

    "DevOps Engineering": {
        name: "DevOps Engineering",
        description: "Bridge development and operations through automation, infrastructure management, and continuous delivery. Enable teams to deploy software faster and more reliably.",
        category: "Engineering",

        skillWeights: {
            technical: 9,
            creative: 5,
            social: 6,      // Cross-team collaboration
            leadership: 6,
            research: 6,
            pace: 8,        // Fast deployment cycles
            risk: 6,
            structure: 8    // Infrastructure planning
        },

        matchingTags: {
            primary: ["cloud", "technical", "engineering", "automation"],
            secondary: ["programming", "collaboration", "projects"],
            tertiary: ["workshops", "innovation", "professional"]
        },

        progression: [
            {
                level: "Entry",
                roles: ["Junior DevOps Engineer", "Cloud Engineer", "Build Engineer"],
                timeline: "0-2 years",
                salary: { min: 90, max: 125 }
            },
            {
                level: "Mid",
                roles: ["DevOps Engineer", "Site Reliability Engineer", "Platform Engineer"],
                timeline: "2-5 years",
                salary: { min: 125, max: 170 }
            },
            {
                level: "Senior",
                roles: ["Senior DevOps Engineer", "Principal SRE", "Infrastructure Architect"],
                timeline: "5+ years",
                salary: { min: 170, max: 230 }
            }
        ],

        marketData: {
            jobGrowthRate: "+21% (2022-2032)",
            annualOpenings: 7800,
            workLifeBalance: "6.8/10",
            avgSalary: "$125k - $190k",
            topCompanies: ["Google", "Amazon", "Netflix", "Uber", "Spotify"]
        }
    },

    "Hardware Engineering": {
        name: "Hardware Engineering",
        description: "Design and develop physical computing systems, from embedded devices to robotics. Work at the intersection of software and hardware to create tangible technology.",
        category: "Hardware",

        skillWeights: {
            technical: 9,
            creative: 6,
            social: 5,
            leadership: 5,
            research: 7,
            pace: 5,        // Slower development cycles than software
            risk: 5,
            structure: 8    // Precise engineering requirements
        },

        matchingTags: {
            primary: ["hardware", "robotics", "engineering", "electronics"],
            secondary: ["programming", "technical", "projects"],
            tertiary: ["research", "collaboration", "innovation"]
        },

        progression: [
            {
                level: "Entry",
                roles: ["Hardware Engineer", "Embedded Software Engineer", "Test Engineer"],
                timeline: "0-2 years",
                salary: { min: 80, max: 110 }
            },
            {
                level: "Mid",
                roles: ["Senior Hardware Engineer", "Systems Engineer", "Hardware Architect"],
                timeline: "2-5 years",
                salary: { min: 110, max: 150 }
            },
            {
                level: "Senior",
                roles: ["Principal Engineer", "Hardware Engineering Manager", "Chief Engineer"],
                timeline: "5+ years",
                salary: { min: 150, max: 200 }
            }
        ],

        marketData: {
            jobGrowthRate: "+7% (2022-2032)",
            annualOpenings: 4200,
            workLifeBalance: "7.3/10",
            avgSalary: "$105k - $160k",
            topCompanies: ["Apple", "Tesla", "NVIDIA", "Intel", "Qualcomm"]
        }
    },

    "Game Development": {
        name: "Game Development",
        description: "Create interactive entertainment experiences through programming, design, and storytelling. Build games that engage and delight players across multiple platforms.",
        category: "Entertainment",

        skillWeights: {
            technical: 8,
            creative: 9,    // Highly creative field
            social: 6,      // Team collaboration on creative projects
            leadership: 5,
            research: 5,
            pace: 8,        // Fast iteration, shipping cycles
            risk: 7,        // Creative risks, market uncertainty
            structure: 5
        },

        matchingTags: {
            primary: ["gamedev", "creative", "programming", "design"],
            secondary: ["collaboration", "projects", "graphics"],
            tertiary: ["workshops", "technical", "innovation"]
        },

        progression: [
            {
                level: "Entry",
                roles: ["Junior Game Developer", "Game Programmer", "Level Designer"],
                timeline: "0-2 years",
                salary: { min: 70, max: 95 }
            },
            {
                level: "Mid",
                roles: ["Game Developer", "Senior Programmer", "Technical Artist"],
                timeline: "2-5 years",
                salary: { min: 95, max: 130 }
            },
            {
                level: "Senior",
                roles: ["Lead Developer", "Technical Director", "Creative Director"],
                timeline: "5+ years",
                salary: { min: 130, max: 180 }
            }
        ],

        marketData: {
            jobGrowthRate: "+11% (2022-2032)",
            annualOpenings: 2800,
            workLifeBalance: "6.0/10",
            avgSalary: "$90k - $140k",
            topCompanies: ["Blizzard", "Epic Games", "Riot Games", "Unity", "Electronic Arts"]
        }
    }
};

// =============================================================================
// REAL SCORING ALGORITHM - Replace Mock Results
// =============================================================================

function calculateUserSkillProfile(answers, questions) {
    console.log('🧮 Calculating user skill profile from answers...');

    // Initialize skill scores (1-10 scale)
    const skillScores = {
        technical: 5,    // Start at neutral (5)
        creative: 5,
        social: 5,
        leadership: 5,
        research: 5,
        pace: 5,
        risk: 5,
        structure: 5
    };

    let totalWeight = 0;

    // Process each answer
    answers.forEach((answer, answerIndex) => {
        const question = questions[answerIndex];
        if (!question) {
            console.warn(`⚠️ No question found for answer index ${answerIndex}`);
            return;
        }

        console.log(`📝 Processing Q${answerIndex + 1}: "${question.questionText.substring(0, 50)}..."`);

        // Get user's ranking (most preferred = index 0, least = index 3)
        const userRanking = answer.ranking;
        const difficultyWeight = question.difficultyWeight || 1;

        userRanking.forEach((optionIndex, rankPosition) => {
            const option = question.options[optionIndex];
            if (!option || !option.weights) {
                console.warn(`⚠️ Invalid option ${optionIndex} in question ${answerIndex}`);
                return;
            }

            // Calculate preference weight
            // Most preferred (rank 0) = 100% weight, least preferred = 25% weight
            const rankWeight = (userRanking.length - rankPosition) / userRanking.length;
            const finalWeight = rankWeight * difficultyWeight;

            // Add weighted scores to user profile
            Object.keys(option.weights).forEach(skill => {
                if (skillScores.hasOwnProperty(skill)) {
                    skillScores[skill] += (option.weights[skill] - 5) * finalWeight * 0.3;
                    totalWeight += finalWeight;
                }
            });
        });
    });

    // Normalize scores to 1-10 scale and ensure reasonable bounds
    Object.keys(skillScores).forEach(skill => {
        skillScores[skill] = Math.max(1, Math.min(10, skillScores[skill]));
        skillScores[skill] = Math.round(skillScores[skill] * 10) / 10; // Round to 1 decimal
    });

    console.log('✅ User skill profile calculated:', skillScores);
    return skillScores;
}

function calculateCareerMatches(userSkillProfile, careerFields) {
    console.log('🎯 Calculating career matches...');

    const matches = Object.values(careerFields).map(career => {
        let totalMatch = 0;
        let totalWeight = 0;

        // Calculate similarity between user profile and career requirements
        Object.keys(userSkillProfile).forEach(skill => {
            if (career.skillWeights && career.skillWeights[skill] !== undefined) {
                const userScore = userSkillProfile[skill];
                const careerRequirement = career.skillWeights[skill];

                // Calculate similarity (closer scores = higher match)
                const difference = Math.abs(userScore - careerRequirement);
                const similarity = Math.max(0, 10 - difference); // 0-10 scale

                // Weight by career requirement importance
                const importance = careerRequirement / 10; // Normalize to 0-1

                totalMatch += similarity * importance;
                totalWeight += importance;
            }
        });

        // Calculate final percentage
        const percentage = totalWeight > 0 ?
            Math.round((totalMatch / totalWeight) * 10) : 50;

        return {
            career: career,
            percentage: Math.max(40, Math.min(95, percentage)), // Ensure 40-95% range
            confidence: getConfidenceLevel(percentage)
        };
    });

    // Sort by percentage (highest first)
    const sortedMatches = matches.sort((a, b) => b.percentage - a.percentage);

    console.log(`✅ Career matches calculated:`, sortedMatches.map(m =>
        `${m.career.name}: ${m.percentage}%`
    ));

    return sortedMatches;
}

// =============================================================================
// CAREER-TO-CLUB RECOMMENDATION ENGINE
// =============================================================================

async function getRecommendedClubs(topCareer, allClubs) {
    console.log(`🏛️ Finding clubs for ${topCareer.name}...`);

    if (!topCareer.matchingTags || !allClubs) {
        console.warn('⚠️ Missing career tags or clubs data');
        return [];
    }

    const clubScores = allClubs.map(club => {
        let score = 0;

        // Primary tag matches (3x weight)
        topCareer.matchingTags.primary.forEach(tag => {
            if (club.tags.includes(tag)) {
                score += 3;
            }
        });

        // Secondary tag matches (2x weight)
        topCareer.matchingTags.secondary.forEach(tag => {
            if (club.tags.includes(tag)) {
                score += 2;
            }
        });

        // Tertiary tag matches (1x weight)
        topCareer.matchingTags.tertiary.forEach(tag => {
            if (club.tags.includes(tag)) {
                score += 1;
            }
        });

        return {
            club: club,
            score: score,
            matchedTags: club.tags.filter(tag =>
                topCareer.matchingTags.primary.includes(tag) ||
                topCareer.matchingTags.secondary.includes(tag) ||
                topCareer.matchingTags.tertiary.includes(tag)
            )
        };
    });

    // Sort by score and return top 3-5 clubs
    const topClubs = clubScores
        .filter(item => item.score > 0) // Only clubs with matching tags
        .sort((a, b) => b.score - a.score)
        .slice(0, 4)
        .map(item => item.club);

    console.log(`✅ Found ${topClubs.length} recommended clubs:`,
        topClubs.map(c => c.name)
    );

    return topClubs;
}

// =============================================================================
// ENHANCED RESULTS GENERATION
// =============================================================================

function generatePersonalizedNextSteps(topMatch, userSkillProfile, level) {
    const steps = [];
    const career = topMatch.career;

    // Analyze skill gaps
    const skillGaps = [];
    Object.keys(career.skillWeights).forEach(skill => {
        const userScore = userSkillProfile[skill];
        const careerNeed = career.skillWeights[skill];
        const gap = careerNeed - userScore;

        if (gap > 1.5) { // Significant gap
            skillGaps.push({ skill, gap, careerNeed });
        }
    });

    // Sort by largest gaps first
    skillGaps.sort((a, b) => b.gap - a.gap);

    // Generate specific recommendations based on gaps
    skillGaps.slice(0, 2).forEach(gap => {
        switch (gap.skill) {
            case 'technical':
                steps.push(`Strengthen technical skills through coding bootcamps or hands-on projects`);
                break;
            case 'creative':
                steps.push(`Develop creative problem-solving through design thinking workshops`);
                break;
            case 'social':
                steps.push(`Build communication skills through presentation practice and team projects`);
                break;
            case 'leadership':
                steps.push(`Gain leadership experience through club officer positions or project management`);
                break;
            case 'research':
                steps.push(`Enhance research skills by joining faculty research projects or reading technical papers`);
                break;
            case 'structure':
                steps.push(`Practice systematic thinking through algorithm challenges and architecture design`);
                break;
        }
    });

    // Add level-specific recommendations
    if (level === 'beginner') {
        steps.push(`Explore ${career.name} through introductory courses and informational interviews`);
        steps.push(`Join relevant UC Davis clubs to build experience and network`);
    } else if (level === 'intermediate') {
        steps.push(`Build a portfolio showcasing your ${career.name} skills`);
        steps.push(`Seek internships or part-time opportunities in ${career.name}`);
    } else if (level === 'advanced') {
        steps.push(`Pursue advanced certifications or specializations in ${career.name}`);
        steps.push(`Network with industry professionals and consider mentorship opportunities`);
    }

    // Always include UC Davis specific step
    steps.push(`Connect with UC Davis Career Center for ${career.name} guidance and industry connections`);

    return steps.slice(0, 4); // Return top 4 steps
}

function getConfidenceLevel(percentage) {
    if (percentage >= 80) return 'High';
    if (percentage >= 65) return 'Medium';
    return 'Low';
}

// =============================================================================
// MAIN SCORING FUNCTION - Replace in your app.js
// =============================================================================

async function processQuizSubmission(answers, questions, level, allClubs) {
    console.log('🎯 Processing quiz with real scoring algorithm...');

    try {
        // 1. Calculate user's skill profile
        const userSkillProfile = calculateUserSkillProfile(answers, questions);

        // 2. Match against career definitions
        const careerMatches = calculateCareerMatches(userSkillProfile, careerDefinitions);

        // 3. Get top match
        const topMatch = careerMatches[0];

        // 4. Get recommended clubs
        const recommendedClubs = await getRecommendedClubs(topMatch.career, allClubs);

        // 5. Generate personalized next steps
        const nextSteps = generatePersonalizedNextSteps(topMatch, userSkillProfile, level);

        // 6. Build comprehensive results
        const results = {
            topMatch: {
                career: topMatch.career.name,
                description: topMatch.career.description,
                percentage: topMatch.percentage,
                category: topMatch.career.category,
                careerProgression: topMatch.career.progression,
                marketData: topMatch.career.marketData,
                nextSteps: nextSteps,
                recommendedClubs: recommendedClubs.slice(0, 3) // Top 3 clubs
            },
            allMatches: careerMatches.slice(0, 8).map(match => ({
                career: match.career.name,
                category: match.career.category,
                percentage: match.percentage
            })),
            skillBreakdown: userSkillProfile,
            metadata: {
                totalQuestions: questions.length,
                level: level,
                processingVersion: "2.0"
            }
        };

        console.log('✅ Real quiz results generated successfully');
        return results;

    } catch (error) {
        console.error('💥 Error in real scoring algorithm:', error);
        throw error;
    }
}

// =============================================================================
// EXPORT FOR USE IN APP.JS
// =============================================================================

module.exports = {
    careerDefinitions,
    calculateUserSkillProfile,
    calculateCareerMatches,
    getRecommendedClubs,
    generatePersonalizedNextSteps,
    processQuizSubmission,
    getConfidenceLevel
};

// =============================================================================
// INTEGRATION INSTRUCTIONS
// =============================================================================

/*
To integrate this into your existing backend/app.js:

1. Import the scoring functions:
   const { processQuizSubmission } = require('./quiz-scoring');

2. Replace your existing quiz submission route with:

app.post('/api/quiz/submit', requireAuth, async (req, res) => {
    try {
        const { level, answers, completionTime } = req.body;
        const userId = req.session.userId;

        // Validate input
        if (!level || !answers || !Array.isArray(answers)) {
            return res.status(400).json({ error: 'Invalid submission data' });
        }

        // Get questions and clubs from database
        const questions = await QuizQuestion.find({
            questionLevel: level,
            isActive: true
        }).sort({ order: 1 });

        const allClubs = await Club.find({ isActive: true });

        // Use real scoring algorithm
        const results = await processQuizSubmission(answers, questions, level, allClubs);

        // Save to database
        const QuizResult = require('./models/nicheQuizModels').QuizResult;
        const newResult = new QuizResult({
            user: userId,
            quizLevel: level,
            answers: answers,
            skillScores: results.skillBreakdown,
            completionTime: completionTime
        });

        await newResult.save();

        res.json({
            success: true,
            results: results
        });

    } catch (error) {
        console.error('💥 Quiz submission error:', error);
        res.status(500).json({ error: 'Failed to process quiz submission' });
    }
});

3. Test with a real quiz submission to see the algorithm in action!
*/