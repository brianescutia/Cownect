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
    },

    // =============================================================================
    // INTERMEDIATE LEVEL QUESTIONS (6 questions total)
    // =============================================================================

    {
        questionText: "Rank these technical challenges by what excites you most:",
        questionLevel: "intermediate",
        questionType: "ranking",
        category: "skills",
        order: 1,
        difficultyWeight: 1.5,
        options: [
            {
                text: "Optimizing system performance and scalability",
                description: "Making applications faster, more efficient, and able to handle millions of users",
                weights: {
                    technical: 9, research: 6, structure: 8, pace: 5,
                    creative: 4, social: 3, leadership: 4, risk: 5
                }
            },
            {
                text: "Creating intuitive user experiences",
                description: "Designing interfaces and interactions that users love and understand intuitively",
                weights: {
                    creative: 9, social: 7, technical: 5, research: 6,
                    leadership: 5, pace: 6, risk: 5, structure: 5
                }
            },
            {
                text: "Building machine learning models to predict outcomes",
                description: "Using statistical analysis and AI to forecast trends and automate decisions",
                weights: {
                    research: 9, technical: 8, creative: 5, structure: 7,
                    social: 4, leadership: 4, pace: 5, risk: 6
                }
            },
            {
                text: "Architecting secure, distributed systems",
                description: "Designing robust infrastructures that protect against threats and scale globally",
                weights: {
                    technical: 9, research: 7, structure: 8, risk: 3,
                    creative: 4, social: 4, leadership: 5, pace: 5
                }
            }
        ],
        isActive: true
    },

    {
        questionText: "In your ideal tech role, rank these responsibilities:",
        questionLevel: "intermediate",
        questionType: "ranking",
        category: "goals",
        order: 2,
        difficultyWeight: 1.4,
        options: [
            {
                text: "Writing and reviewing code daily",
                description: "Hands-on programming, code reviews, and technical implementation work",
                weights: {
                    technical: 9, creative: 5, structure: 7, social: 3,
                    leadership: 3, research: 5, pace: 6, risk: 4
                }
            },
            {
                text: "Translating business needs into technical solutions",
                description: "Acting as a bridge between stakeholders and development teams",
                weights: {
                    social: 8, leadership: 7, technical: 6, creative: 6,
                    research: 5, pace: 6, risk: 5, structure: 6
                }
            },
            {
                text: "Mentoring junior developers and sharing knowledge",
                description: "Teaching, code reviewing, and helping others grow their technical skills",
                weights: {
                    social: 8, leadership: 8, technical: 7, structure: 6,
                    creative: 5, research: 5, pace: 5, risk: 4
                }
            },
            {
                text: "Researching and implementing emerging technologies",
                description: "Staying on the cutting edge and bringing innovation to projects",
                weights: {
                    research: 9, technical: 8, creative: 7, risk: 6,
                    social: 4, leadership: 4, pace: 6, structure: 5
                }
            }
        ],
        isActive: true
    },

    {
        questionText: "How do you prefer to measure success in your work?",
        questionLevel: "intermediate",
        questionType: "ranking",
        category: "values",
        order: 3,
        difficultyWeight: 1.3,
        options: [
            {
                text: "User adoption and satisfaction metrics",
                description: "Number of active users, user ratings, and positive feedback on your products",
                weights: {
                    social: 8, creative: 6, technical: 6, pace: 6,
                    leadership: 5, research: 5, risk: 5, structure: 5
                }
            },
            {
                text: "Technical performance improvements",
                description: "Faster load times, higher uptime, better security, and code quality metrics",
                weights: {
                    technical: 9, structure: 8, research: 6, pace: 5,
                    creative: 4, social: 3, leadership: 4, risk: 4
                }
            },
            {
                text: "Business impact and ROI",
                description: "Revenue generated, costs saved, and measurable business value created",
                weights: {
                    leadership: 7, research: 7, structure: 7, social: 6,
                    technical: 5, creative: 5, pace: 6, risk: 5
                }
            },
            {
                text: "Innovation and technological advancement",
                description: "Patents filed, papers published, and breakthrough solutions developed",
                weights: {
                    research: 9, technical: 8, creative: 8, risk: 6,
                    social: 4, leadership: 5, pace: 5, structure: 5
                }
            }
        ],
        isActive: true
    },

    {
        questionText: "What type of technical complexity do you enjoy most?",
        questionLevel: "intermediate",
        questionType: "ranking",
        category: "skills",
        order: 4,
        difficultyWeight: 1.6,
        options: [
            {
                text: "Algorithms and data structure optimization",
                description: "Finding the most efficient ways to process and store information",
                weights: {
                    technical: 9, research: 7, structure: 8, creative: 6,
                    social: 2, leadership: 3, pace: 5, risk: 4
                }
            },
            {
                text: "Human-computer interaction design",
                description: "Understanding how people interact with technology and improving those experiences",
                weights: {
                    creative: 8, social: 8, research: 7, technical: 5,
                    leadership: 5, pace: 6, risk: 5, structure: 5
                }
            },
            {
                text: "Distributed systems and microservices",
                description: "Building applications that work across multiple servers and services",
                weights: {
                    technical: 9, structure: 8, research: 6, creative: 4,
                    social: 4, leadership: 5, pace: 5, risk: 5
                }
            },
            {
                text: "Statistical modeling and data analysis",
                description: "Finding patterns in data and building predictive models",
                weights: {
                    research: 9, technical: 8, structure: 7, creative: 5,
                    social: 4, leadership: 4, pace: 5, risk: 4
                }
            }
        ],
        isActive: true
    },

    {
        questionText: "How do you prefer to stay current with technology trends?",
        questionLevel: "intermediate",
        questionType: "ranking",
        category: "skills",
        order: 5,
        difficultyWeight: 1.2,
        options: [
            {
                text: "Attending conferences and networking events",
                description: "Learning from industry experts and connecting with other professionals",
                weights: {
                    social: 8, leadership: 6, research: 6, pace: 6,
                    technical: 5, creative: 5, risk: 6, structure: 5
                }
            },
            {
                text: "Reading research papers and technical blogs",
                description: "Deep-diving into academic research and expert technical analysis",
                weights: {
                    research: 9, technical: 7, structure: 6, creative: 4,
                    social: 3, leadership: 3, pace: 4, risk: 4
                }
            },
            {
                text: "Building side projects with new technologies",
                description: "Hands-on experimentation with emerging tools and frameworks",
                weights: {
                    technical: 8, creative: 8, pace: 7, risk: 7,
                    research: 5, social: 4, leadership: 4, structure: 4
                }
            },
            {
                text: "Participating in online communities and forums",
                description: "Engaging in discussions, helping others, and learning from community wisdom",
                weights: {
                    social: 7, research: 6, technical: 6, creative: 5,
                    leadership: 5, pace: 6, risk: 5, structure: 5
                }
            }
        ],
        isActive: true
    },

    {
        questionText: "What motivates you to take on challenging projects?",
        questionLevel: "intermediate",
        questionType: "ranking",
        category: "goals",
        order: 6,
        difficultyWeight: 1.3,
        options: [
            {
                text: "Opportunity to learn cutting-edge technologies",
                description: "Gaining experience with the latest tools and methodologies",
                weights: {
                    research: 8, technical: 8, creative: 6, pace: 6,
                    social: 4, leadership: 4, risk: 6, structure: 5
                }
            },
            {
                text: "Potential for high user impact and visibility",
                description: "Building something that many people will use and benefit from",
                weights: {
                    social: 8, creative: 7, leadership: 6, pace: 7,
                    technical: 6, research: 5, risk: 6, structure: 5
                }
            },
            {
                text: "Technical complexity and problem-solving challenge",
                description: "Working on difficult problems that require innovative solutions",
                weights: {
                    technical: 9, research: 8, creative: 7, structure: 6,
                    social: 3, leadership: 4, pace: 5, risk: 6
                }
            },
            {
                text: "Leadership and team coordination opportunities",
                description: "Chance to guide project direction and mentor team members",
                weights: {
                    leadership: 9, social: 8, structure: 7, pace: 6,
                    technical: 5, creative: 6, research: 5, risk: 6
                }
            }
        ],
        isActive: true
    },

    // =============================================================================
    // ADVANCED LEVEL QUESTIONS (6 questions total)
    // =============================================================================

    {
        questionText: "Rank these long-term career paths by appeal:",
        questionLevel: "advanced",
        questionType: "ranking",
        category: "goals",
        order: 1,
        difficultyWeight: 2.0,
        options: [
            {
                text: "Individual contributor → Principal Engineer → Distinguished Engineer",
                description: "Deep technical expertise, architecture decisions, and technical thought leadership",
                weights: {
                    technical: 10, research: 8, creative: 6, structure: 7,
                    leadership: 6, social: 5, pace: 5, risk: 5
                }
            },
            {
                text: "Team Lead → Engineering Manager → Director → VP Engineering",
                description: "People management, strategic planning, organizational leadership, and business impact",
                weights: {
                    leadership: 9, social: 9, structure: 8, technical: 6,
                    creative: 6, research: 5, pace: 6, risk: 6
                }
            },
            {
                text: "Specialist → Consultant → Independent Expert → Founder",
                description: "Domain expertise, client relationships, entrepreneurial ventures, and market innovation",
                weights: {
                    technical: 8, social: 7, risk: 9, creative: 8,
                    leadership: 8, research: 6, pace: 8, structure: 4
                }
            },
            {
                text: "Product Engineer → Product Manager → Chief Product Officer",
                description: "User-focused product development, strategic vision, and cross-functional leadership",
                weights: {
                    leadership: 9, social: 9, creative: 8, research: 6,
                    technical: 6, pace: 7, risk: 6, structure: 7
                }
            }
        ],
        isActive: true
    },

    {
        questionText: "When making architectural decisions, rank these considerations:",
        questionLevel: "advanced",
        questionType: "ranking",
        category: "values",
        order: 2,
        difficultyWeight: 1.8,
        options: [
            {
                text: "Long-term maintainability and technical debt",
                description: "Building systems that remain manageable and extensible over time",
                weights: {
                    technical: 8, structure: 9, research: 6, pace: 3,
                    creative: 4, social: 4, leadership: 6, risk: 3
                }
            },
            {
                text: "Speed to market and competitive advantage",
                description: "Delivering quickly to capture market opportunities and outpace competitors",
                weights: {
                    pace: 9, risk: 7, creative: 6, leadership: 7,
                    structure: 4, technical: 6, social: 6, research: 4
                }
            },
            {
                text: "User experience and accessibility",
                description: "Ensuring products work well for all users, including those with disabilities",
                weights: {
                    social: 8, creative: 7, research: 6, technical: 6,
                    leadership: 5, pace: 5, risk: 5, structure: 6
                }
            },
            {
                text: "Innovation and technological differentiation",
                description: "Using cutting-edge approaches that set your product apart technically",
                weights: {
                    research: 9, technical: 8, creative: 8, risk: 7,
                    social: 4, leadership: 5, pace: 6, structure: 4
                }
            }
        ],
        isActive: true
    },

    {
        questionText: "How do you prefer to influence technical strategy in your organization?",
        questionLevel: "advanced",
        questionType: "ranking",
        category: "leadership",
        order: 3,
        difficultyWeight: 1.9,
        options: [
            {
                text: "Through technical expertise and code contributions",
                description: "Leading by example with high-quality implementations and technical guidance",
                weights: {
                    technical: 9, research: 7, creative: 6, structure: 7,
                    leadership: 6, social: 5, pace: 5, risk: 4
                }
            },
            {
                text: "By building consensus and facilitating discussions",
                description: "Bringing stakeholders together and helping teams reach collaborative decisions",
                weights: {
                    social: 9, leadership: 8, structure: 7, creative: 6,
                    technical: 5, research: 5, pace: 6, risk: 5
                }
            },
            {
                text: "Through data-driven analysis and recommendations",
                description: "Using metrics, research, and evidence to support strategic technology choices",
                weights: {
                    research: 9, technical: 7, structure: 8, leadership: 6,
                    social: 5, creative: 5, pace: 5, risk: 4
                }
            },
            {
                text: "By prototyping and demonstrating possibilities",
                description: "Building proof-of-concepts that show the potential of new approaches",
                weights: {
                    creative: 8, technical: 8, pace: 7, risk: 6,
                    leadership: 6, research: 6, social: 5, structure: 5
                }
            }
        ],
        isActive: true
    },

    {
        questionText: "What type of technical risk do you find most acceptable?",
        questionLevel: "advanced",
        questionType: "ranking",
        category: "values",
        order: 4,
        difficultyWeight: 1.7,
        options: [
            {
                text: "Adopting cutting-edge but unproven technologies",
                description: "Being an early adopter of new frameworks, languages, or platforms",
                weights: {
                    research: 8, creative: 8, risk: 8, technical: 8,
                    pace: 7, social: 4, leadership: 5, structure: 3
                }
            },
            {
                text: "Building custom solutions instead of using existing tools",
                description: "Creating bespoke systems when off-the-shelf solutions don't meet specific needs",
                weights: {
                    technical: 9, creative: 7, risk: 7, research: 6,
                    structure: 5, social: 4, leadership: 5, pace: 4
                }
            },
            {
                text: "Scaling systems beyond their current capacity limits",
                description: "Pushing existing infrastructure to handle much larger loads and user bases",
                weights: {
                    technical: 8, structure: 8, research: 7, risk: 6,
                    pace: 6, creative: 5, social: 4, leadership: 5
                }
            },
            {
                text: "Refactoring legacy systems while maintaining operations",
                description: "Modernizing critical systems without disrupting ongoing business operations",
                weights: {
                    technical: 8, structure: 9, risk: 5, research: 6,
                    pace: 4, creative: 5, social: 5, leadership: 6
                }
            }
        ],
        isActive: true
    },

    {
        questionText: "How do you prefer to drive innovation in your team?",
        questionLevel: "advanced",
        questionType: "ranking",
        category: "leadership",
        order: 5,
        difficultyWeight: 1.8,
        options: [
            {
                text: "Dedicated time for exploration and experimentation",
                description: "Formal innovation time like Google's 20% time or hackathons for breakthrough ideas",
                weights: {
                    creative: 8, research: 8, leadership: 7, technical: 7,
                    pace: 6, risk: 7, social: 6, structure: 4
                }
            },
            {
                text: "Cross-functional collaboration and diverse perspectives",
                description: "Bringing together people from different backgrounds to solve problems creatively",
                weights: {
                    social: 9, leadership: 8, creative: 7, pace: 6,
                    technical: 5, research: 6, risk: 6, structure: 6
                }
            },
            {
                text: "Structured innovation processes and frameworks",
                description: "Using design thinking, lean startup, or other systematic approaches to innovation",
                weights: {
                    structure: 8, leadership: 7, research: 7, creative: 6,
                    technical: 5, social: 6, pace: 5, risk: 5
                }
            },
            {
                text: "Rapid prototyping and fail-fast iterations",
                description: "Building quick proof-of-concepts and learning from fast feedback cycles",
                weights: {
                    pace: 9, creative: 8, risk: 7, technical: 7,
                    research: 5, leadership: 6, social: 5, structure: 4
                }
            }
        ],
        isActive: true
    },

    {
        questionText: "What drives your technology decisions in complex projects?",
        questionLevel: "advanced",
        questionType: "ranking",
        category: "values",
        order: 6,
        difficultyWeight: 1.9,
        options: [
            {
                text: "Technical elegance and architectural beauty",
                description: "Choosing solutions that are clean, maintainable, and theoretically sound",
                weights: {
                    technical: 9, creative: 7, structure: 8, research: 7,
                    social: 3, leadership: 4, pace: 4, risk: 4
                }
            },
            {
                text: "Team expertise and learning opportunities",
                description: "Selecting technologies that leverage team strengths while enabling growth",
                weights: {
                    social: 8, leadership: 8, technical: 6, research: 5,
                    creative: 6, structure: 6, pace: 5, risk: 5
                }
            },
            {
                text: "Business requirements and stakeholder needs",
                description: "Prioritizing solutions that directly address user problems and business goals",
                weights: {
                    social: 7, leadership: 7, structure: 7, pace: 6,
                    technical: 6, creative: 6, research: 5, risk: 5
                }
            },
            {
                text: "Industry trends and future-proofing",
                description: "Choosing technologies that align with where the industry is heading",
                weights: {
                    research: 8, technical: 7, pace: 6, risk: 6,
                    creative: 6, leadership: 5, social: 5, structure: 5
                }
            }
        ],
        isActive: true
    }
];

// =============================================================================
// CAREER WEIGHT MAPPINGS - How Questions Map to Career Results
// =============================================================================

const careerMappings = {
    "Software Engineering": {
        primaryWeights: ["technical", "structure", "creative"],
        secondaryWeights: ["pace", "research", "collaboration"],
        matchingTags: ["programming", "webdev", "technical", "projects"]
    },

    "Data Science": {
        primaryWeights: ["research", "technical", "structure"],
        secondaryWeights: ["creative", "pace", "social"],
        matchingTags: ["ai", "data", "research", "analytics", "ml"]
    },

    "UX/UI Design": {
        primaryWeights: ["creative", "social", "research"],
        secondaryWeights: ["technical", "pace", "structure"],
        matchingTags: ["design", "ux", "ui", "creative", "research"]
    },

    "Product Management": {
        primaryWeights: ["social", "leadership", "creative"],
        secondaryWeights: ["pace", "research", "technical"],
        matchingTags: ["product", "leadership", "collaboration", "networking"]
    },

    "Cybersecurity": {
        primaryWeights: ["technical", "research", "structure"],
        secondaryWeights: ["risk", "pace", "social"],
        matchingTags: ["security", "cybersecurity", "technical", "research"]
    },

    "DevOps Engineering": {
        primaryWeights: ["technical", "structure", "pace"],
        secondaryWeights: ["leadership", "research", "social"],
        matchingTags: ["cloud", "technical", "engineering", "automation"]
    },

    "Hardware Engineering": {
        primaryWeights: ["technical", "creative", "structure"],
        secondaryWeights: ["research", "pace", "collaboration"],
        matchingTags: ["hardware", "robotics", "engineering", "technical"]
    },

    "Game Development": {
        primaryWeights: ["creative", "technical", "pace"],
        secondaryWeights: ["social", "research", "structure"],
        matchingTags: ["gamedev", "creative", "programming", "design"]
    }
};

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
