// =============================================================================
// SEED QUIZ DATA SCRIPT - Run this to populate your database
// =============================================================================
// Save as backend/seedQuizDataComplete.js and run: node backend/seedQuizDataComplete.js

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { CareerField, QuizQuestion } = require('./models/nicheQuizModels');
const Club = require('./models/Club');

dotenv.config();

// =============================================================================
// CAREER FIELDS DATA WITH SKILL WEIGHTS
// =============================================================================

const careerFieldsData = [
    {
        name: "Web Development",
        description: "Build responsive websites and web applications using modern frameworks and technologies. Focus on frontend, backend, or full-stack development.",
        category: "Engineering",
        skillWeights: {
            technical: 8,
            creative: 7,
            social: 5,
            leadership: 4,
            research: 3,
            pace: 7,
            risk: 5,
            structure: 6
        },
        progression: [
            {
                level: "Entry",
                roles: ["Junior Frontend Developer", "Web Developer"],
                yearsExperience: "0-2 years",
                avgSalary: { min: 65, max: 85 }
            },
            {
                level: "Mid",
                roles: ["Frontend Developer", "Full-Stack Developer"],
                yearsExperience: "2-5 years",
                avgSalary: { min: 85, max: 120 }
            }
        ],
        marketData: {
            jobGrowthRate: "+13% (2021-2031)",
            annualOpenings: 28900,
            workLifeBalance: 7.5,
            avgSatisfaction: 8.2
        },
        isActive: true
    },
    {
        name: "Data Science",
        description: "Extract insights from data using statistical analysis, machine learning, and visualization tools. Solve business problems through data-driven approaches.",
        category: "Data",
        skillWeights: {
            technical: 9,
            creative: 6,
            social: 4,
            leadership: 5,
            research: 9,
            pace: 6,
            risk: 4,
            structure: 7
        },
        progression: [
            {
                level: "Entry",
                roles: ["Data Analyst", "Junior Data Scientist"],
                yearsExperience: "0-2 years",
                avgSalary: { min: 70, max: 95 }
            }
        ],
        marketData: {
            jobGrowthRate: "+22% (2021-2031)",
            annualOpenings: 13500,
            workLifeBalance: 7.8,
            avgSatisfaction: 8.5
        },
        isActive: true
    },
    {
        name: "UX/UI Design",
        description: "Create intuitive and beautiful user experiences for digital products. Combine user research, visual design, and usability principles.",
        category: "Design",
        skillWeights: {
            technical: 6,
            creative: 10,
            social: 7,
            leadership: 5,
            research: 7,
            pace: 6,
            risk: 5,
            structure: 5
        },
        progression: [
            {
                level: "Entry",
                roles: ["Junior UX Designer", "UI Designer"],
                yearsExperience: "0-2 years",
                avgSalary: { min: 60, max: 80 }
            }
        ],
        marketData: {
            jobGrowthRate: "+13% (2021-2031)",
            annualOpenings: 5200,
            workLifeBalance: 7.2,
            avgSatisfaction: 8.0
        },
        isActive: true
    },
    {
        name: "Product Management",
        description: "Bridge the gap between technical teams and business objectives. Define product strategy, prioritize features, and guide development from concept to launch.",
        category: "Product",
        skillWeights: {
            technical: 5,
            creative: 8,
            social: 9,
            leadership: 9,
            research: 6,
            pace: 8,
            risk: 7,
            structure: 7
        },
        progression: [
            {
                level: "Entry",
                roles: ["Associate Product Manager", "Business Analyst"],
                yearsExperience: "0-2 years",
                avgSalary: { min: 75, max: 100 }
            }
        ],
        marketData: {
            jobGrowthRate: "+19% (2021-2031)",
            annualOpenings: 8900,
            workLifeBalance: 6.5,
            avgSatisfaction: 7.8
        },
        isActive: true
    },
    {
        name: "Cybersecurity",
        description: "Protect organizations from digital threats through security analysis, incident response, and risk assessment.",
        category: "Security",
        skillWeights: {
            technical: 9,
            creative: 4,
            social: 5,
            leadership: 6,
            research: 8,
            pace: 7,
            risk: 3,
            structure: 8
        },
        progression: [
            {
                level: "Entry",
                roles: ["Security Analyst", "Junior Security Engineer"],
                yearsExperience: "0-2 years",
                avgSalary: { min: 70, max: 90 }
            }
        ],
        marketData: {
            jobGrowthRate: "+35% (2021-2031)",
            annualOpenings: 16300,
            workLifeBalance: 7.0,
            avgSatisfaction: 7.9
        },
        isActive: true
    },
    {
        name: "DevOps Engineering",
        description: "Streamline software development and deployment through automation, infrastructure management, and continuous integration/delivery practices.",
        category: "Engineering",
        skillWeights: {
            technical: 9,
            creative: 5,
            social: 6,
            leadership: 6,
            research: 6,
            pace: 8,
            risk: 6,
            structure: 8
        },
        progression: [
            {
                level: "Entry",
                roles: ["Junior DevOps Engineer", "Build Engineer"],
                yearsExperience: "0-2 years",
                avgSalary: { min: 75, max: 95 }
            }
        ],
        marketData: {
            jobGrowthRate: "+21% (2021-2031)",
            annualOpenings: 7800,
            workLifeBalance: 6.8,
            avgSatisfaction: 8.1
        },
        isActive: true
    }
];

// =============================================================================
// QUIZ QUESTIONS WITH PROPER WEIGHTS
// =============================================================================

const questionsData = [
    // BEGINNER LEVEL QUESTIONS
    {
        questionText: "Rank these work activities by your preference:",
        questionLevel: "beginner",
        questionType: "ranking",
        category: "interests",
        order: 1,
        difficultyWeight: 1.2,
        options: [
            {
                text: "Building apps and websites people use daily",
                description: "Creating user-facing technology like mobile apps, websites, and digital tools",
                weights: { technical: 7, creative: 6, social: 8, pace: 7, leadership: 3, research: 4, risk: 5, structure: 6 }
            },
            {
                text: "Analyzing data to solve business problems",
                description: "Finding patterns in data, creating reports, and making data-driven recommendations",
                weights: { technical: 8, research: 9, creative: 5, structure: 8, social: 4, leadership: 5, pace: 6, risk: 4 }
            },
            {
                text: "Designing beautiful and intuitive interfaces",
                description: "Making technology look good and easy to use through visual and user experience design",
                weights: { creative: 9, technical: 4, social: 6, structure: 5, leadership: 4, research: 6, pace: 6, risk: 5 }
            },
            {
                text: "Protecting systems from cyber threats",
                description: "Securing networks, detecting vulnerabilities, and defending against hackers",
                weights: { technical: 9, research: 7, risk: 2, structure: 9, creative: 3, social: 4, leadership: 5, pace: 7 }
            }
        ],
        isActive: true
    },
    {
        questionText: "How do you prefer to approach problem-solving?",
        questionLevel: "beginner",
        questionType: "ranking",
        category: "work_style",
        order: 2,
        difficultyWeight: 1.0,
        options: [
            {
                text: "Break down complex problems into smaller, manageable pieces",
                description: "Systematic, step-by-step approach to tackling challenges",
                weights: { structure: 8, technical: 7, research: 6, pace: 5, social: 4, creative: 5, leadership: 5, risk: 4 }
            },
            {
                text: "Brainstorm creative solutions with others",
                description: "Collaborative ideation and innovative thinking with team members",
                weights: { social: 8, creative: 8, leadership: 6, pace: 6, technical: 4, research: 5, risk: 6, structure: 5 }
            },
            {
                text: "Research thoroughly before taking action",
                description: "Gather extensive information and analyze before making decisions",
                weights: { research: 9, structure: 7, technical: 6, pace: 3, social: 4, creative: 5, leadership: 4, risk: 3 }
            },
            {
                text: "Experiment and iterate quickly",
                description: "Try different approaches rapidly and learn from fast feedback",
                weights: { pace: 9, creative: 7, risk: 7, technical: 6, social: 5, leadership: 5, research: 4, structure: 3 }
            }
        ],
        isActive: true
    },
    {
        questionText: "What type of work environment motivates you most?",
        questionLevel: "beginner",
        questionType: "ranking",
        category: "environment",
        order: 3,
        difficultyWeight: 1.0,
        options: [
            {
                text: "Dynamic startup with rapid growth and change",
                description: "Fast-paced environment with new challenges, equity opportunities, and high energy",
                weights: { pace: 9, risk: 8, structure: 3, creative: 7, leadership: 6, technical: 6, social: 6, research: 5 }
            },
            {
                text: "Established tech company with clear career paths",
                description: "Stable environment with defined processes, good benefits, and structured advancement",
                weights: { structure: 9, risk: 3, pace: 5, leadership: 6, technical: 6, social: 6, creative: 5, research: 5 }
            },
            {
                text: "Research institution or university lab",
                description: "Academic setting focused on innovation, publications, and cutting-edge research",
                weights: { research: 9, technical: 8, structure: 6, pace: 3, creative: 6, social: 5, leadership: 4, risk: 4 }
            },
            {
                text: "Consulting firm working with diverse clients",
                description: "Variety of projects, client interaction, travel opportunities, and problem-solving",
                weights: { social: 8, creative: 7, pace: 7, leadership: 7, technical: 6, research: 6, risk: 6, structure: 5 }
            }
        ],
        isActive: true
    },
    {
        questionText: "When learning new technology, you prefer to:",
        questionLevel: "beginner",
        questionType: "ranking",
        category: "skills",
        order: 4,
        difficultyWeight: 1.0,
        options: [
            {
                text: "Dive in and learn by building projects",
                description: "Hands-on experimentation and learning through trial and error",
                weights: { creative: 7, risk: 7, pace: 8, technical: 7, structure: 3, social: 4, leadership: 5, research: 4 }
            },
            {
                text: "Study documentation and theory first",
                description: "Understand fundamental concepts and best practices before implementation",
                weights: { structure: 8, research: 7, technical: 7, pace: 4, creative: 4, social: 3, leadership: 4, risk: 3 }
            },
            {
                text: "Follow tutorials and guided courses",
                description: "Step-by-step learning with structured curriculum and clear progression",
                weights: { structure: 6, technical: 6, pace: 6, research: 5, social: 5, creative: 4, leadership: 4, risk: 4 }
            },
            {
                text: "Join study groups and discuss with peers",
                description: "Collaborative learning through discussion, code reviews, and peer feedback",
                weights: { social: 8, leadership: 6, creative: 6, pace: 6, technical: 5, research: 5, risk: 5, structure: 5 }
            }
        ],
        isActive: true
    },
    {
        questionText: "What type of impact do you want your work to have?",
        questionLevel: "beginner",
        questionType: "ranking",
        category: "values",
        order: 5,
        difficultyWeight: 1.1,
        options: [
            {
                text: "Help millions of people through consumer technology",
                description: "Build products that improve daily life for large numbers of users",
                weights: { social: 8, creative: 6, technical: 7, pace: 7, leadership: 5, research: 5, risk: 6, structure: 5 }
            },
            {
                text: "Solve important business problems with data",
                description: "Use analytics and insights to drive strategic decisions and efficiency",
                weights: { research: 8, technical: 8, structure: 7, social: 5, creative: 5, leadership: 6, pace: 6, risk: 4 }
            },
            {
                text: "Advance the field through research and innovation",
                description: "Push the boundaries of what's possible and contribute to scientific knowledge",
                weights: { research: 9, technical: 8, creative: 7, structure: 6, social: 4, leadership: 5, pace: 4, risk: 6 }
            },
            {
                text: "Build secure systems that protect people",
                description: "Ensure privacy, safety, and security of digital systems and personal data",
                weights: { technical: 8, research: 7, structure: 8, risk: 2, social: 6, creative: 4, leadership: 5, pace: 6 }
            }
        ],
        isActive: true
    },
    {
        questionText: "How do you prefer to communicate your ideas?",
        questionLevel: "beginner",
        questionType: "ranking",
        category: "work_style",
        order: 6,
        difficultyWeight: 1.0,
        options: [
            {
                text: "Through visual designs and prototypes",
                description: "Show ideas through mockups, wireframes, and interactive demonstrations",
                weights: { creative: 8, social: 6, technical: 5, structure: 5, leadership: 5, research: 4, pace: 6, risk: 5 }
            },
            {
                text: "With data, charts, and analytical reports",
                description: "Present findings through statistics, visualizations, and evidence-based arguments",
                weights: { research: 8, technical: 7, structure: 8, social: 5, creative: 6, leadership: 5, pace: 5, risk: 4 }
            },
            {
                text: "Through working code and technical demos",
                description: "Build functional prototypes and demonstrate capabilities through implementation",
                weights: { technical: 9, creative: 6, structure: 6, pace: 6, social: 4, leadership: 4, research: 5, risk: 5 }
            },
            {
                text: "In presentations and team discussions",
                description: "Verbally explain concepts and facilitate group conversations and meetings",
                weights: { social: 9, leadership: 8, creative: 6, pace: 6, technical: 4, research: 5, risk: 6, structure: 6 }
            }
        ],
        isActive: true
    },
    {
        questionText: "What energizes you most in a typical workday?",
        questionLevel: "beginner",
        questionType: "ranking",
        category: "interests",
        order: 7,
        difficultyWeight: 1.0,
        options: [
            {
                text: "Solving complex technical puzzles",
                description: "Working through challenging algorithms, debugging, and system optimization",
                weights: { technical: 9, research: 7, creative: 6, structure: 6, social: 3, leadership: 3, pace: 5, risk: 5 }
            },
            {
                text: "Collaborating with teammates on shared goals",
                description: "Working together, sharing ideas, and achieving results as a team",
                weights: { social: 9, leadership: 7, creative: 6, pace: 6, technical: 5, research: 5, risk: 5, structure: 6 }
            },
            {
                text: "Seeing users interact with your creations",
                description: "Watching people use and benefit from products you've built",
                weights: { social: 8, creative: 7, technical: 6, pace: 6, leadership: 5, research: 4, risk: 5, structure: 5 }
            },
            {
                text: "Learning about cutting-edge technologies",
                description: "Staying current with new tools, frameworks, and industry developments",
                weights: { research: 8, technical: 8, creative: 6, pace: 6, social: 4, leadership: 4, risk: 6, structure: 5 }
            }
        ],
        isActive: true
    },
    {
        questionText: "How do you handle uncertainty and changing requirements?",
        questionLevel: "beginner",
        questionType: "ranking",
        category: "work_style",
        order: 8,
        difficultyWeight: 1.1,
        options: [
            {
                text: "Embrace change as opportunities for innovation",
                description: "See shifting requirements as chances to improve and create better solutions",
                weights: { creative: 8, risk: 8, pace: 8, leadership: 6, technical: 5, social: 6, research: 5, structure: 3 }
            },
            {
                text: "Create flexible systems that can adapt",
                description: "Build modular, scalable architectures that accommodate future changes",
                weights: { technical: 8, structure: 7, research: 7, creative: 6, pace: 5, social: 4, leadership: 5, risk: 5 }
            },
            {
                text: "Communicate frequently to align expectations",
                description: "Regular check-ins and stakeholder management to reduce uncertainty",
                weights: { social: 8, leadership: 7, structure: 7, pace: 6, technical: 4, creative: 5, research: 5, risk: 5 }
            },
            {
                text: "Document and plan thoroughly to minimize risks",
                description: "Detailed planning and risk assessment to prepare for potential changes",
                weights: { structure: 9, research: 7, technical: 6, risk: 2, social: 5, creative: 4, leadership: 5, pace: 4 }
            }
        ],
        isActive: true
    }
];

// =============================================================================
// SEED FUNCTIONS
// =============================================================================

async function seedCareerFields() {
    console.log('🎯 Seeding career fields...');

    await CareerField.deleteMany({});

    // Get club references for integration
    const clubs = await Club.find({ isActive: true });

    const enhancedCareerFields = careerFieldsData.map(career => {
        // Map career fields to relevant clubs
        const relatedClubs = [];

        switch (career.name) {
            case "Web Development":
                relatedClubs.push(
                    ...clubs.filter(club =>
                        club.tags.some(tag => ['webdev', 'software', 'programming'].includes(tag.toLowerCase()))
                    ).slice(0, 3).map(club => club._id)
                );
                break;
            case "Data Science":
                relatedClubs.push(
                    ...clubs.filter(club =>
                        club.tags.some(tag => ['ai', 'ml', 'data', 'analytics'].includes(tag.toLowerCase()))
                    ).slice(0, 3).map(club => club._id)
                );
                break;
            case "UX/UI Design":
                relatedClubs.push(
                    ...clubs.filter(club =>
                        club.tags.some(tag => ['design', 'ux', 'ui'].includes(tag.toLowerCase()))
                    ).slice(0, 3).map(club => club._id)
                );
                break;
            case "Cybersecurity":
                relatedClubs.push(
                    ...clubs.filter(club =>
                        club.tags.some(tag => ['cybersecurity', 'security', 'hacking'].includes(tag.toLowerCase()))
                    ).slice(0, 3).map(club => club._id)
                );
                break;
            case "Product Management":
                relatedClubs.push(
                    ...clubs.filter(club =>
                        club.tags.some(tag => ['product', 'management', 'business'].includes(tag.toLowerCase()))
                    ).slice(0, 3).map(club => club._id)
                );
                break;
            case "DevOps Engineering":
                relatedClubs.push(
                    ...clubs.filter(club =>
                        club.tags.some(tag => ['engineering', 'automation', 'infrastructure'].includes(tag.toLowerCase()))
                    ).slice(0, 3).map(club => club._id)
                );
                break;
        }

        return {
            ...career,
            relatedClubs
        };
    });

    const insertedFields = await CareerField.insertMany(enhancedCareerFields);
    console.log(`✅ Inserted ${insertedFields.length} career fields`);

    return insertedFields;
}

async function seedQuestions() {
    console.log('📝 Seeding quiz questions...');

    await QuizQuestion.deleteMany({});

    const insertedQuestions = await QuizQuestion.insertMany(questionsData);
    console.log(`✅ Inserted ${insertedQuestions.length} quiz questions`);

    // Display question distribution
    const distribution = await QuizQuestion.aggregate([
        { $group: { _id: '$questionLevel', count: { $sum: 1 } } },
        { $sort: { _id: 1 } }
    ]);

    console.log('📊 Question distribution:');
    distribution.forEach(level => {
        console.log(`  ${level._id}: ${level.count} questions`);
    });

    return insertedQuestions;
}

async function seedQuizData() {
    try {
        console.log('🌱 Starting quiz data seeding...');

        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Seed career fields
        const careerFields = await seedCareerFields();

        // Seed questions
        const questions = await seedQuestions();

        // Display summary
        console.log('\n📋 Seeding Summary:');
        console.log(`  Career Fields: ${careerFields.length}`);
        console.log(`  Quiz Questions: ${questions.length}`);
        console.log(`  Question Levels: beginner (8 questions)`);

        console.log('\n🎉 Quiz data seeding completed successfully!');
        console.log('🚀 Your niche quiz now has real scoring algorithms!');

        // Display available career fields
        console.log('\n🎯 Available Career Fields:');
        careerFields.forEach(field => {
            console.log(`  - ${field.name} (${field.category})`);
        });

    } catch (error) {
        console.error('💥 Error seeding quiz data:', error);
    } finally {
        await mongoose.connection.close();
        console.log('🔌 Database connection closed');
        process.exit(0);
    }
}

// =============================================================================
// RUN SEED SCRIPT
// =============================================================================

if (require.main === module) {
    console.log('🌱 Starting niche quiz data seeding...');
    seedQuizData();
}

module.exports = {
    careerFieldsData,
    questionsData,
    seedCareerFields,
    seedQuestions,
    seedQuizData
};
