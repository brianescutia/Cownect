// Enhanced 3-Level Quiz Data with Complete Question Sets
// Save as: backend/data/enhancedThreeLevelQuizData.js

const enhancedThreeLevelQuizQuestions = {
    // =============================================================================
    // BEGINNER LEVEL - Tech Explorer (8 Questions)
    // =============================================================================
    beginner: [
        {
            id: 'B01',
            type: 'scenario',
            category: 'problem_solving_style',
            question: "You're planning your friend's surprise birthday party, but everything is going wrong. The venue cancelled, half the guests can't make it, and you have two days left. What's your first instinct?",
            subtitle: "Choose the approach that feels most natural to you",
            options: [
                {
                    id: 'systematic_planning',
                    title: 'Create a Detailed Backup Plan',
                    description: 'Make lists of alternative venues, create a new guest list, and systematically work through each problem'
                },
                {
                    id: 'collaborative_creative',
                    title: 'Rally Friends for Creative Solutions',
                    description: 'Get your friends together to brainstorm fun alternatives like a park picnic or house party'
                },
                {
                    id: 'user_centered',
                    title: 'Focus on What Makes Them Happy',
                    description: 'Think about what your friend would actually want most and work backwards from there'
                },
                {
                    id: 'systematic_coordination',
                    title: 'Organize and Delegate Tasks',
                    description: 'Divide responsibilities among friends and create a group chat to coordinate efficiently'
                }
            ]
        },

        {
            id: 'B02',
            type: 'visual_choice',
            category: 'team_dynamics',
            question: "In a group project where your team can't agree on direction, which role feels most natural?",
            subtitle: "Trust your instinct about what you'd actually do",
            options: [
                {
                    id: 'diplomatic_facilitator',
                    visual: '🤝',
                    title: 'The Diplomatic Facilitator',
                    description: 'Help everyone understand each other\'s perspectives and find common ground'
                },
                {
                    id: 'analytical_researcher',
                    visual: '📊',
                    title: 'The Analytical Researcher',
                    description: 'Research different approaches and present pros and cons of each option'
                },
                {
                    id: 'creative_synthesizer',
                    visual: '💡',
                    title: 'The Creative Synthesizer',
                    description: 'Suggest completely different approaches that combine everyone\'s ideas'
                },
                {
                    id: 'task_coordinator',
                    visual: '📋',
                    title: 'The Task Coordinator',
                    description: 'Focus on specific parts you can contribute to and help others do the same'
                }
            ]
        },

        {
            id: 'B03',
            type: 'scale',
            category: 'learning_style',
            question: "When learning something completely new, how do you prefer to approach it?",
            subtitle: "Think about what actually helps you learn best",
            scale: {
                min: 1,
                max: 10,
                labels: {
                    1: "Jump in and experiment immediately",
                    3: "Some trial and error with basic guidance",
                    5: "Balanced mix of study and practice",
                    7: "Structured learning with systematic practice",
                    10: "Thorough research and planning before starting"
                },
                descriptions: {
                    1: "You learn best by diving in and figuring things out through experimentation",
                    3: "You like to start doing but with some basic guidance or tutorials",
                    5: "You prefer a mix of studying the fundamentals and hands-on practice",
                    7: "You learn best with structured lessons and systematic skill building",
                    10: "You prefer to thoroughly understand the theory before attempting practice"
                }
            }
        },

        {
            id: 'B04',
            type: 'multiple_choice',
            category: 'communication_style',
            question: "You're trying to explain a complex concept to a friend who's struggling to understand it. What's your approach?",
            options: [
                {
                    id: 'systematic_building',
                    title: 'Break It Down Step by Step',
                    description: 'Start with simpler parts and build up their understanding systematically'
                },
                {
                    id: 'creative_analogies',
                    title: 'Use Creative Analogies',
                    description: 'Find analogies or examples from things they already understand well'
                },
                {
                    id: 'diagnostic_questioning',
                    title: 'Ask Questions to Diagnose Confusion',
                    description: 'Ask them questions to figure out exactly where they\'re getting stuck'
                },
                {
                    id: 'resource_finding',
                    title: 'Find Better Resources',
                    description: 'Look for a really good video or article that explains it better than you could'
                }
            ]
        },

        {
            id: 'B05',
            type: 'multiple_choice',
            category: 'debugging_approach',
            question: "Your phone battery has been dying really quickly lately. How do you figure out what's wrong?",
            options: [
                {
                    id: 'systematic_testing',
                    title: 'Systematic App Analysis',
                    description: 'Check which apps use the most battery and test them one by one to isolate the problem'
                },
                {
                    id: 'social_problem_solving',
                    title: 'Ask Tech-Savvy Friends',
                    description: 'Reach out to people you know who are good with phones for their opinions'
                },
                {
                    id: 'research_driven',
                    title: 'Research Common Solutions',
                    description: 'Google common battery problems and try the most likely fixes first'
                },
                {
                    id: 'experimental_approach',
                    title: 'Try Different Charging Methods',
                    description: 'Experiment with different chargers and charging habits to see what changes'
                }
            ]
        },

        {
            id: 'B06',
            type: 'multiple_choice',
            category: 'pattern_recognition',
            question: "You notice your favorite coffee shop is packed on certain days but empty on others. This makes you...",
            options: [
                {
                    id: 'data_driven_curiosity',
                    title: 'Want to Track and Analyze Variables',
                    description: 'Curious about the pattern - maybe start tracking weather, events, or days of the week'
                },
                {
                    id: 'optimization_thinking',
                    title: 'Think About Practical Optimization',
                    description: 'Wonder if there\'s a way to predict busy times and plan visits accordingly'
                },
                {
                    id: 'social_investigation',
                    title: 'Ask People About It',
                    description: 'Interested in asking the barista or other customers what they think is happening'
                },
                {
                    id: 'adaptive_acceptance',
                    title: 'Accept It and Adapt',
                    description: 'Just adjust your routine to avoid crowds - some things just are what they are'
                }
            ]
        },

        {
            id: 'B07',
            type: 'ranking',
            category: 'decision_criteria',
            question: "When choosing classes at UC Davis, what factors matter most to you?",
            subtitle: "Rank these from most important to least important",
            items: [
                {
                    id: 'intellectual_curiosity',
                    text: 'Intellectual Interest',
                    description: 'How interesting the subject matter is and whether it sparks your curiosity'
                },
                {
                    id: 'career_relevance',
                    text: 'Career Relevance',
                    description: 'How the skills will be useful for your future career goals'
                },
                {
                    id: 'social_connections',
                    text: 'Social Connections',
                    description: 'Whether your friends are taking it or if you\'ll meet like-minded people'
                },
                {
                    id: 'learning_quality',
                    text: 'Learning Quality',
                    description: 'How well the professor teaches and the quality of the learning experience'
                }
            ]
        },

        {
            id: 'B08',
            type: 'multiple_choice',
            category: 'quality_assurance',
            question: "You're about to submit an important assignment. What's your final step?",
            options: [
                {
                    id: 'comprehensive_verification',
                    title: 'Comprehensive Double-Check',
                    description: 'Verify requirements, run spell-check, check sources, ensure proper formatting'
                },
                {
                    id: 'reader_focused_review',
                    title: 'Read-Through for Flow',
                    description: 'Read through once more to ensure it flows well and makes sense to others'
                },
                {
                    id: 'confidence_submission',
                    title: 'Trust Your Work and Submit',
                    description: 'Check basic requirements and submit - you\'ve done your best work'
                },
                {
                    id: 'collaborative_validation',
                    title: 'Get Someone Else\'s Eyes on It',
                    description: 'Have someone review it for feedback or bounce ideas off them'
                }
            ]
        }
    ],

    // =============================================================================
    // INTERMEDIATE LEVEL - Tech Curious (6 Questions)
    // =============================================================================
    intermediate: [
        {
            id: 'I01',
            type: 'scenario',
            category: 'leadership_adaptive',
            question: "You're leading a study group for a challenging CS course. Half the group is struggling with the material while the other half is bored. How do you handle this?",
            options: [
                {
                    id: 'distributed_leadership',
                    title: 'Create Peer Mentoring System',
                    description: 'Set up different tracks where advanced students mentor struggling ones while you facilitate'
                },
                {
                    id: 'systematic_differentiation',
                    title: 'Design Multi-Level Problems',
                    description: 'Create practice problems that have multiple difficulty levels built into them'
                },
                {
                    id: 'practical_contextualization',
                    title: 'Focus on Real-World Applications',
                    description: 'Make the material relevant to everyone through practical, relatable examples'
                },
                {
                    id: 'structured_dual_track',
                    title: 'Split Sessions by Skill Level',
                    description: 'Alternate between fundamentals review and advanced exploration sessions'
                }
            ]
        },

        {
            id: 'I02',
            type: 'scale',
            category: 'ethical_technical_judgment',
            question: "You discover a potential security vulnerability in a popular campus app. How quickly should you act?",
            subtitle: "Consider the balance between thoroughness and urgency",
            scale: {
                min: 1,
                max: 10,
                labels: {
                    1: "Alert developers immediately",
                    3: "Quick verification, then immediate contact",
                    5: "Balanced research and responsible disclosure",
                    7: "Thorough documentation before disclosure",
                    10: "Extensive research and formal process"
                },
                descriptions: {
                    1: "Students could be at risk - contact developers right away with initial findings",
                    3: "Do basic verification to confirm the issue, then reach out quickly to developers",
                    5: "Balance between protecting users and providing developers with useful information",
                    7: "Document the vulnerability thoroughly to help developers understand and fix it properly",
                    10: "Follow formal security research protocols with comprehensive analysis and proof-of-concept"
                }
            }
        },

        {
            id: 'I03',
            type: 'short_response',
            category: 'ambiguity_navigation',
            question: "Describe a time when you had to work with unclear requirements or expectations. How did you handle it?",
            subtitle: "This could be from school, work, or personal projects",
            placeholder: "I remember when I had to work on a project where...",
            max_length: 250
        },

        {
            id: 'I04',
            type: 'scenario',
            category: 'crisis_prioritization',
            question: "Your team's app prototype isn't working as expected before a major demo. You have 3 hours. What's your strategy?",
            options: [
                {
                    id: 'critical_path_focus',
                    title: 'Focus on Core Features Only',
                    description: 'Quickly identify the essential features that must work and focus entirely on those'
                },
                {
                    id: 'parallel_coordination',
                    title: 'Coordinate Parallel Problem-Solving',
                    description: 'Divide the team to work on different issues simultaneously while maintaining communication'
                },
                {
                    id: 'backup_demo_strategy',
                    title: 'Create Backup Demo Plan',
                    description: 'Develop an alternative demo strategy that showcases what does work effectively'
                },
                {
                    id: 'systematic_debugging',
                    title: 'Debug from Most Likely Issues',
                    description: 'Work systematically from the most probable failure points to least likely ones'
                }
            ]
        },

        {
            id: 'I05',
            type: 'visual_choice',
            category: 'user_centered_design',
            question: "You're designing a campus navigation app for students with very different needs. What's your design philosophy?",
            subtitle: "Choose the approach that resonates most with you",
            options: [
                {
                    id: 'user_research_driven',
                    visual: '🎯',
                    title: 'Deep User Research',
                    description: 'Interview diverse students to understand their specific needs and usage patterns'
                },
                {
                    id: 'adaptive_algorithmic',
                    visual: '🤖',
                    title: 'Smart Adaptive System',
                    description: 'Design a system that learns from user choices and adapts recommendations over time'
                },
                {
                    id: 'user_control_personalization',
                    visual: '⚙️',
                    title: 'Customizable Preferences',
                    description: 'Create detailed preferences that let users prioritize what matters most to them'
                },
                {
                    id: 'multi_modal_design',
                    visual: '🔄',
                    title: 'Multiple Interface Modes',
                    description: 'Build different interface modes optimized for different types of users and use cases'
                }
            ]
        },

        {
            id: 'I06',
            type: 'ranking',
            category: 'diverse_team_coordination',
            question: "You're on a hackathon team with people of different skill levels. What's most important for success?",
            subtitle: "Rank these strategies from most important to least important",
            items: [
                {
                    id: 'strengths_based_allocation',
                    text: 'Play to Individual Strengths',
                    description: 'Map everyone\'s strengths and design tasks that utilize them effectively'
                },
                {
                    id: 'mentorship_pairing',
                    text: 'Peer Learning System',
                    description: 'Create pairs where stronger and newer members can learn from each other'
                },
                {
                    id: 'realistic_scope',
                    text: 'Achievable but Impressive Scope',
                    description: 'Focus on a concept that\'s technically realistic but impressive in execution'
                },
                {
                    id: 'continuous_coordination',
                    text: 'Regular Check-ins and Knowledge Sharing',
                    description: 'Set up structured communication and knowledge-sharing throughout the event'
                }
            ]
        }
    ],

    // =============================================================================
    // ADVANCED LEVEL - Tech Insider (6 Questions)
    // =============================================================================
    advanced: [
        {
            id: 'A01',
            type: 'scenario',
            category: 'technical_leadership_judgment',
            question: "You're the technical lead on a project where the initial architecture isn't scaling. The team is split between refactoring (risky, time-consuming) and quick fixes (faster, but creates technical debt). How do you navigate this decision?",
            options: [
                {
                    id: 'strategic_analysis',
                    title: 'Comprehensive Cost-Benefit Analysis',
                    description: 'Conduct thorough analysis of both approaches, considering long-term maintenance and team velocity'
                },
                {
                    id: 'collaborative_consensus',
                    title: 'Facilitate Team Decision-Making',
                    description: 'Lead team discussions to understand concerns and build consensus around technical direction'
                },
                {
                    id: 'creative_compromise',
                    title: 'Design Hybrid Approach',
                    description: 'Create a solution that addresses critical scalability issues while minimizing risk'
                },
                {
                    id: 'systematic_mitigation',
                    title: 'Incremental Refactoring with Checkpoints',
                    description: 'Implement gradual refactoring with measurable milestones to balance risk and progress'
                }
            ]
        },

        {
            id: 'A02',
            type: 'short_response',
            category: 'strategic_product_judgment',
            question: "Describe your approach to making a critical business decision under pressure with limited information.",
            subtitle: "Think about a challenging decision you've made or how you would approach one",
            placeholder: "When facing a high-stakes decision with incomplete information, I would...",
            max_length: 300
        },

        {
            id: 'A03',
            type: 'visual_choice',
            category: 'systems_architecture_expertise',
            question: "You're designing a system for unpredictable traffic spikes while maintaining performance and cost-effectiveness. What's your architectural philosophy?",
            subtitle: "Choose the approach that aligns with your engineering thinking",
            options: [
                {
                    id: 'distributed_resilience',
                    visual: '🗗️',
                    title: 'Distributed Resilience Architecture',
                    description: 'Microservices with auto-scaling, caching layers, and circuit breakers for reliability'
                },
                {
                    id: 'cloud_native_serverless',
                    visual: '☁️',
                    title: 'Cloud-Native Serverless',
                    description: 'Serverless-first approach with edge computing and intelligent load balancing'
                },
                {
                    id: 'adaptive_performance',
                    visual: '⚡',
                    title: 'Adaptive Performance System',
                    description: 'Hybrid system that gracefully degrades functionality during peak loads'
                },
                {
                    id: 'predictive_intelligence',
                    visual: '🧠',
                    title: 'Predictive Intelligence',
                    description: 'ML-powered system that anticipates traffic patterns and scales proactively'
                }
            ]
        },

        {
            id: 'A04',
            type: 'scale',
            category: 'innovation_risk_management',
            question: "Your company could benefit from a new ML technology, but your team doesn't know it yet. How much risk are you willing to take on the unknown?",
            subtitle: "Consider business pressure, team capability, and potential impact",
            scale: {
                min: 1,
                max: 10,
                labels: {
                    1: "Stick with proven technologies",
                    3: "Small pilot with familiar backup",
                    5: "Balanced innovation with risk mitigation",
                    7: "Aggressive learning with external help",
                    10: "Full commitment to cutting-edge approach"
                },
                descriptions: {
                    1: "Use current stack to deliver safely, innovate later when timeline allows",
                    3: "Small prototype with new tech while building backup using familiar tools",
                    5: "Invest in team learning while developing minimum viable version in parallel",
                    7: "Partner with external experts and consultants to accelerate adoption",
                    10: "Commit fully to the new technology with intensive research and validation phase"
                }
            }
        },

        {
            id: 'A05',
            type: 'scenario',
            category: 'mentorship_communication',
            question: "You're reviewing code from a junior developer that works but has significant issues with maintainability, performance, and follows outdated patterns. How do you provide feedback?",
            options: [
                {
                    id: 'educational_mentorship',
                    title: 'Interactive Code Review Session',
                    description: 'Schedule time to walk through issues together and explain reasoning behind best practices'
                },
                {
                    id: 'comprehensive_documentation',
                    title: 'Detailed Written Feedback',
                    description: 'Provide thorough written feedback with examples of better approaches and learning resources'
                },
                {
                    id: 'practical_demonstration',
                    title: 'Refactor as Example',
                    description: 'Refactor a portion of the code as an example and explain the improvements in context'
                },
                {
                    id: 'prioritized_development',
                    title: 'Staged Learning Plan',
                    description: 'Focus on most critical issues first and create a structured plan for gradual improvement'
                }
            ]
        },

        {
            id: 'A06',
            type: 'scenario',
            category: 'technical_change_management',
            question: "You're leading the evaluation of a new framework that promises significant benefits but requires migrating legacy code. The engineering team is divided. How do you drive the decision?",
            options: [
                {
                    id: 'comprehensive_planning',
                    title: 'Detailed Migration Plan with Risk Assessment',
                    description: 'Create thorough migration strategy with risk analysis and rollback procedures'
                },
                {
                    id: 'inclusive_decision_process',
                    title: 'Build Consensus Through Inclusion',
                    description: 'Address team concerns and involve skeptics in the evaluation process'
                },
                {
                    id: 'empirical_validation',
                    title: 'Proof-of-Concept Pilot',
                    description: 'Implement pilot project to demonstrate benefits and identify real-world challenges'
                },
                {
                    id: 'objective_measurement',
                    title: 'Establish Clear Success Criteria',
                    description: 'Define objective success metrics and decision criteria before beginning evaluation'
                }
            ]
        }
    ]
};

// Enhanced career options
const enhancedCareerOptions = [
    // Core Engineering
    'Software Engineering (Frontend)',
    'Software Engineering (Backend)',
    'Software Engineering (Full-Stack)',
    'DevOps Engineering',
    'Site Reliability Engineering',
    'Mobile Development',
    'Game Development',
    'Embedded Systems Engineering',

    // Data & AI
    'Data Science',
    'Machine Learning Engineering',
    'AI Research',
    'Data Engineering',
    'Business Intelligence',
    'Quantitative Analysis',

    // Design & User Experience
    'UX Design',
    'UI Design',
    'Product Design',
    'User Research',
    'Design Systems',

    // Product & Strategy
    'Product Management',
    'Technical Product Management',
    'Product Marketing',
    'Growth Product Management',
    'Strategy & Operations',

    // Security & Infrastructure
    'Cybersecurity',
    'Security Engineering',
    'Cloud Architecture',
    'Network Engineering',

    // Business & Communication
    'Technical Writing',
    'Developer Relations',
    'Sales Engineering',
    'Technical Consulting',
    'Engineering Management',
    'Startup Founder',

    // Emerging & Specialized
    'Robotics Engineering',
    'AR/VR Development',
    'Blockchain Development',
    'Quantum Computing',
    'Green Tech Engineering',

    // Research & Academia
    'Computer Science Research',
    'Industry Research',
    'Technical Education'
];

module.exports = {
    enhancedThreeLevelQuizQuestions,
    enhancedCareerOptions
};