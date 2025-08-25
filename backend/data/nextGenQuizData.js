// Next-Generation Quiz Data
// Save as: backend/data/nextGenQuizData.js

const nextGenQuizQuestions = {
    comprehensive: [
        {
            id: 'NG01',
            type: 'visual_choice',
            category: 'work_environment',
            question: "Which work environment excites you most?",
            subtitle: "Choose the setting that makes you feel most energized and productive",
            options: [
                {
                    id: 'startup_energy',
                    visual: '🚀',
                    title: 'High-Energy Startup',
                    description: 'Fast-paced environment with rapid iteration, wearing multiple hats, direct impact on product direction'
                },
                {
                    id: 'research_lab',
                    visual: '🧪',
                    title: 'Research & Innovation Lab',
                    description: 'Cutting-edge technology exploration, academic collaboration, long-term projects with deep technical challenges'
                },
                {
                    id: 'collaborative_studio',
                    visual: '🎨',
                    title: 'Collaborative Design Studio',
                    description: 'Creative team environment focused on user experience, design thinking, and human-centered solutions'
                },
                {
                    id: 'enterprise_team',
                    visual: '🏢',
                    title: 'Enterprise Technology Team',
                    description: 'Structured environment with clear processes, large-scale systems, established best practices and mentorship'
                }
            ]
        },

        {
            id: 'NG02',
            type: 'scenario',
            category: 'problem_solving_approach',
            question: "You're tasked with improving a slow-loading website. What's your first instinct?",
            subtitle: "Choose the approach that feels most natural to you",
            options: [
                {
                    id: 'data_driven_analysis',
                    title: 'Analyze Performance Data',
                    description: 'Use profiling tools to identify bottlenecks, measure load times, and create data-driven optimization strategy'
                },
                {
                    id: 'user_experience_focus',
                    title: 'Study User Experience Impact',
                    description: 'Research how slow loading affects user behavior, interview users, and prioritize fixes based on user impact'
                },
                {
                    id: 'technical_architecture_review',
                    title: 'Review System Architecture',
                    description: 'Examine the underlying technical infrastructure, database queries, and code structure for systematic improvements'
                },
                {
                    id: 'quick_wins_approach',
                    title: 'Implement Quick Optimizations',
                    description: 'Start with easy fixes like image compression and caching while planning larger improvements'
                }
            ]
        },

        {
            id: 'NG03',
            type: 'scale',
            category: 'innovation_vs_stability',
            question: "When choosing between cutting-edge technology and proven solutions, where do you lean?",
            subtitle: "Consider your comfort level with risk vs. reliability",
            scale: {
                min: 1,
                max: 10,
                labels: {
                    1: "Always choose proven, stable technology",
                    3: "Prefer proven with selective innovation",
                    5: "Balance innovation with calculated risk",
                    7: "Lean toward innovative with fallback plans",
                    10: "Embrace cutting-edge technology eagerly"
                },
                descriptions: {
                    1: "You prioritize reliability and well-tested solutions that minimize risk",
                    3: "You prefer established technologies but are open to innovation when benefits are clear",
                    5: "You balance innovation with risk management, adopting new tech thoughtfully",
                    7: "You're excited by new possibilities but maintain backup strategies",
                    10: "You're energized by bleeding-edge technology and enjoy being an early adopter"
                }
            }
        },

        {
            id: 'NG04',
            type: 'ranking',
            category: 'career_values',
            question: "What matters most to you in your ideal tech career?",
            subtitle: "Rank these values from most important to least important to you personally",
            items: [
                {
                    id: 'intellectual_growth',
                    text: 'Continuous Learning & Intellectual Growth',
                    description: 'Always learning new technologies, solving novel problems, expanding your expertise'
                },
                {
                    id: 'user_impact',
                    text: 'Positive Impact on Users',
                    description: 'Building products that genuinely improve people\'s lives and experiences'
                },
                {
                    id: 'technical_mastery',
                    text: 'Deep Technical Mastery',
                    description: 'Becoming an expert in specific technologies, building highly optimized and elegant solutions'
                },
                {
                    id: 'creative_expression',
                    text: 'Creative Expression & Innovation',
                    description: 'Bringing original ideas to life, designing novel solutions, artistic and creative freedom'
                },
                {
                    id: 'team_collaboration',
                    text: 'Team Leadership & Collaboration',
                    description: 'Working closely with others, mentoring teammates, building consensus and shared vision'
                },
                {
                    id: 'entrepreneurial_opportunity',
                    text: 'Entrepreneurial Opportunities',
                    description: 'Building your own products, business ownership, having direct control over direction'
                }
            ]
        },

        {
            id: 'NG05',
            type: 'short_response',
            category: 'authentic_motivation',
            question: "Describe a moment when you felt most excited about technology or problem-solving.",
            subtitle: "Share a specific experience that genuinely energized you - no need to be tech-related",
            placeholder: "I remember when I was working on... and I felt really excited because...",
            max_length: 300
        },

        {
            id: 'NG06',
            type: 'visual_choice',
            category: 'communication_style',
            question: "How do you prefer to share ideas and collaborate?",
            subtitle: "Choose the communication style that feels most natural and effective for you",
            options: [
                {
                    id: 'visual_storytelling',
                    visual: '📊',
                    title: 'Visual Storytelling',
                    description: 'Create diagrams, mockups, and visual presentations to communicate complex ideas clearly'
                },
                {
                    id: 'written_documentation',
                    visual: '📝',
                    title: 'Detailed Written Documentation',
                    description: 'Write comprehensive explanations, create detailed specifications, and maintain clear records'
                },
                {
                    id: 'interactive_demos',
                    visual: '🎮',
                    title: 'Interactive Demonstrations',
                    description: 'Build prototypes and working examples to show rather than tell, hands-on explanation'
                },
                {
                    id: 'collaborative_discussion',
                    visual: '💬',
                    title: 'Collaborative Discussion',
                    description: 'Facilitate group conversations, ask probing questions, and build ideas together through dialogue'
                }
            ]
        },

        {
            id: 'NG07',
            type: 'scenario',
            category: 'decision_making_under_pressure',
            question: "Your team's product launch is tomorrow, but you've discovered a potential security vulnerability. It's probably minor, but you're not certain. What do you do?",
            subtitle: "Consider the competing pressures and stakeholder needs",
            options: [
                {
                    id: 'immediate_investigation',
                    title: 'Investigate Thoroughly Before Launch',
                    description: 'Delay the launch to fully understand and address the security issue, even if it means disappointing stakeholders'
                },
                {
                    id: 'rapid_risk_assessment',
                    title: 'Quick Risk Assessment & Mitigation',
                    description: 'Rapidly assess the threat level, implement quick protective measures, and proceed with careful monitoring'
                },
                {
                    id: 'stakeholder_communication',
                    title: 'Transparent Stakeholder Discussion',
                    description: 'Present the situation clearly to all stakeholders and collaborate on the decision with full information'
                },
                {
                    id: 'limited_rollout',
                    title: 'Controlled Phased Release',
                    description: 'Launch to a small user group first to monitor for issues while continuing investigation'
                }
            ]
        },

        {
            id: 'NG08',
            type: 'scale',
            category: 'detail_vs_big_picture',
            question: "Do you prefer focusing on intricate details or seeing the big picture?",
            subtitle: "Think about what energizes you most in projects and problem-solving",
            scale: {
                min: 1,
                max: 10,
                labels: {
                    1: "Love diving deep into technical details",
                    3: "Enjoy details with some broader context",
                    5: "Balance between detail work and big picture",
                    7: "Prefer big picture with selective deep dives",
                    10: "Thrive on strategy and high-level vision"
                },
                descriptions: {
                    1: "You're energized by optimizing algorithms, debugging complex issues, and perfecting technical implementation",
                    3: "You enjoy technical depth but like understanding how your work fits into larger goals",
                    5: "You're comfortable switching between detailed implementation and strategic planning",
                    7: "You prefer architecting solutions and strategy, diving into details when necessary",
                    10: "You're most excited by vision-setting, product strategy, and connecting technology to business impact"
                }
            }
        },

        {
            id: 'NG09',
            type: 'ranking',
            category: 'learning_preferences',
            question: "When learning something completely new and challenging, what helps you most?",
            subtitle: "Rank these learning approaches from most helpful to least helpful for you",
            items: [
                {
                    id: 'hands_on_experimentation',
                    text: 'Hands-On Experimentation',
                    description: 'Learning by building, trying things out, and iterating based on what works'
                },
                {
                    id: 'structured_curriculum',
                    text: 'Structured Learning Path',
                    description: 'Following organized courses, tutorials, or systematic skill-building programs'
                },
                {
                    id: 'peer_collaboration',
                    text: 'Learning with Others',
                    description: 'Study groups, pair programming, collaborative projects, and peer discussions'
                },
                {
                    id: 'mentorship_guidance',
                    text: 'Expert Mentorship',
                    description: 'One-on-one guidance from experienced practitioners who can provide personalized feedback'
                },
                {
                    id: 'research_deep_dive',
                    text: 'Independent Research',
                    description: 'Reading documentation, research papers, and exploring topics deeply on your own'
                }
            ]
        },

        {
            id: 'NG10',
            type: 'short_response',
            category: 'authentic_challenges',
            question: "What's a challenge you've faced that taught you something important about yourself?",
            subtitle: "This could be academic, personal, or from any area of life",
            placeholder: "I faced a challenge when... and I learned that I...",
            max_length: 250
        }
    ]
};

const expandedCareerOptions = [
    // Core Engineering
    'Software Engineering (Frontend)',
    'Software Engineering (Backend)',
    'Software Engineering (Full-Stack)',
    'DevOps Engineering',
    'Site Reliability Engineering',
    'Mobile Development (iOS/Android)',
    'Game Development',
    'Embedded Systems Engineering',
    'Systems Programming',
    'Cloud Architecture',

    // Data & AI
    'Data Science',
    'Machine Learning Engineering',
    'AI Research Scientist',
    'Data Engineering',
    'Business Intelligence Analyst',
    'Quantitative Analyst',
    'MLOps Engineer',
    'Computer Vision Engineer',
    'Natural Language Processing Engineer',

    // Design & User Experience
    'UX Design',
    'UI Design',
    'Product Design',
    'User Research',
    'Design Systems',
    'Interaction Design',
    'Service Design',
    'Design Operations',

    // Product & Strategy
    'Product Management',
    'Technical Product Management',
    'Product Marketing',
    'Growth Product Management',
    'Strategy & Operations',
    'Business Analyst',
    'Product Owner',

    // Security & Infrastructure
    'Cybersecurity Analyst',
    'Security Engineering',
    'Penetration Testing',
    'Cloud Security',
    'Network Engineering',
    'Infrastructure Engineering',

    // Business & Communication
    'Technical Writing',
    'Developer Relations',
    'Sales Engineering',
    'Technical Consulting',
    'Engineering Management',
    'Startup Founder',
    'Technical Recruiting',
    'Product Marketing',

    // Emerging & Specialized
    'Robotics Engineering',
    'AR/VR Development',
    'Blockchain Development',
    'Quantum Computing Researcher',
    'Green Tech Engineering',
    'Biotech Software Engineer',
    'Hardware Engineering',
    'IoT Development',

    // Research & Academia
    'Computer Science Research',
    'Industry Research Scientist',
    'Technical Education',
    'University Professor',
    'Research Engineer'
];

module.exports = {
    nextGenQuizQuestions,
    expandedCareerOptions
};