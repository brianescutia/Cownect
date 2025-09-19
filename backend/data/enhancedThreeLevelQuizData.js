// backend/data/enhancedThreeLevelQuizData.js
// COMPLETE REPLACEMENT - Questions Only, No AI Analyzer Code

const enhancedThreeLevelQuizQuestions = {
    // ============================================================================
    // BEGINNER LEVEL - Tech Explorer (15 Questions: B01–B15)
    // ============================================================================
    beginner: [
        // B01–B12 (your originals)
        {
            id: 'B01',
            type: 'short_response',
            category: 'natural_curiosity',
            question:
                "Think of the last time you got completely absorbed in figuring something out (could be anything - a puzzle, fixing something, learning a skill). What was it and what kept you hooked?",
            subtitle: "This helps us understand what naturally captures your attention",
            placeholder: "I remember getting completely absorbed when I was...",
            max_length: 200
        },
        {
            id: 'B02',
            type: 'multiple_choice',
            category: 'problem_identification',
            question: "What's a piece of technology you use daily that genuinely annoys you?",
            subtitle: "Choose the one that bothers you most",
            options: [
                {
                    id: 'interface_frustration',
                    title: 'Apps with confusing or cluttered interfaces',
                    description: "When things are hard to find or the design doesn't make sense"
                },
                {
                    id: 'speed_reliability',
                    title: 'Things that are slow or unreliable',
                    description:
                        "When apps crash, websites load slowly, or systems don't work consistently"
                },
                {
                    id: 'personalization_limits',
                    title: 'One-size-fits-all solutions',
                    description:
                        "When technology doesn't adapt to your specific needs or preferences"
                },
                {
                    id: 'complexity_barriers',
                    title: 'Unnecessarily complicated processes',
                    description:
                        'When simple tasks require too many steps or technical knowledge'
                }
            ]
        },
        {
            id: 'B03',
            type: 'visual_choice',
            category: 'natural_focus',
            question:
                "When you discover a really cool new app or website, what's the FIRST thing you notice?",
            subtitle: 'Go with your gut reaction',
            options: [
                {
                    id: 'visual_design',
                    visual: '🎨',
                    title: 'How it looks and feels',
                    description: 'Colors, layout, animations, overall visual appeal'
                },
                {
                    id: 'functionality_features',
                    visual: '⚙️',
                    title: 'What it can do',
                    description: 'Features, capabilities, and how well it works'
                },
                {
                    id: 'user_experience',
                    visual: '👆',
                    title: 'How easy it is to use',
                    description: 'Navigation, intuitive flow, user-friendliness'
                },
                {
                    id: 'performance_speed',
                    visual: '⚡',
                    title: 'How fast and smooth it is',
                    description: 'Loading speed, responsiveness, performance'
                }
            ]
        },
        {
            id: 'B04',
            type: 'short_response',
            category: 'impact_motivation',
            question:
                'You have unlimited time and resources to build one thing that would genuinely help UC Davis students. What would you create?',
            subtitle: "Think about problems you've actually experienced or witnessed",
            placeholder: 'I would build something that helps students with...',
            max_length: 200
        },
        {
            id: 'B05',
            type: 'multiple_choice',
            category: 'natural_aptitudes',
            question:
                "What's something you're naturally good at that friends or family often ask you to help with?",
            options: [
                {
                    id: 'troubleshooting_fixing',
                    title: 'Troubleshooting and fixing things',
                    description:
                        "When something isn't working, people come to you to figure out why"
                },
                {
                    id: 'explaining_teaching',
                    title: 'Explaining complicated things clearly',
                    description: 'Breaking down complex topics so others can understand them'
                },
                {
                    id: 'organizing_planning',
                    title: 'Organizing and planning projects',
                    description: 'Coordinating people, timelines, and resources effectively'
                },
                {
                    id: 'creative_solutions',
                    title: 'Coming up with creative alternatives',
                    description:
                        "Finding unconventional solutions when the obvious approach doesn't work"
                }
            ]
        },
        {
            id: 'B06',
            type: 'scale',
            category: 'work_preference',
            question: 'What type of work environment makes you most productive and energized?',
            subtitle: 'Think about when you do your best work',
            scale: {
                min: 1,
                max: 10,
                labels: {
                    1: 'Solo focus time with minimal interruption',
                    3: 'Mostly independent with occasional collaboration',
                    5: 'Balanced mix of solo work and teamwork',
                    7: 'Collaborative environment with regular interaction',
                    10: 'High-energy team environment with constant communication'
                },
                descriptions: {
                    1: "You're most productive when you can dive deep without distractions",
                    3: 'You like working independently but value periodic check-ins',
                    5: 'You work well both alone and with others, depending on the task',
                    7: "You thrive on collaboration and regular feedback from teammates",
                    10: "You're energized by constant interaction and team problem-solving"
                }
            }
        },
        {
            id: 'B07',
            type: 'multiple_choice',
            category: 'learning_approach',
            question:
                'You need to learn a new skill quickly for a project. What\'s your go-to approach?',
            options: [
                {
                    id: 'structured_learning',
                    title: 'Find a good course or tutorial series',
                    description: 'Work through structured lessons from beginner to advanced'
                },
                {
                    id: 'project_based',
                    title: 'Start building something and learn as you go',
                    description: 'Jump into a project and figure out what you need along the way'
                },
                {
                    id: 'social_learning',
                    title: 'Find someone who knows it and learn from them',
                    description: 'Get mentorship or join a study group with more experienced people'
                },
                {
                    id: 'documentation_research',
                    title: 'Read documentation and experiment',
                    description:
                        'Study the official docs and try different approaches systematically'
                }
            ]
        },
        {
            id: 'B08',
            type: 'ranking',
            category: 'decision_values',
            question:
                'When making important decisions about your future, what matters most to you?',
            subtitle: 'Rank these from most important to least important',
            items: [
                {
                    id: 'intellectual_challenge',
                    text: 'Intellectual Challenge',
                    description: 'Work that pushes you to learn and grow continuously'
                },
                {
                    id: 'positive_impact',
                    text: 'Making a Positive Impact',
                    description: 'Creating something that genuinely helps people or society'
                },
                {
                    id: 'financial_stability',
                    text: 'Financial Security',
                    description: 'Good compensation and long-term career stability'
                },
                {
                    id: 'work_life_balance',
                    text: 'Work-Life Balance',
                    description: 'Having time for personal interests and relationships'
                },
                {
                    id: 'creative_expression',
                    text: 'Creative Expression',
                    description: 'Ability to be creative and put your personal touch on your work'
                }
            ]
        },
        {
            id: 'B09',
            type: 'multiple_choice',
            category: 'attention_to_detail',
            question:
                "What do you notice about technology that your friends don't seem to care about?",
            options: [
                {
                    id: 'design_inconsistencies',
                    title: 'Design inconsistencies and visual details',
                    description:
                        'Things like misaligned buttons, inconsistent fonts, or poor color choices'
                },
                {
                    id: 'efficiency_optimization',
                    title: 'Ways things could be more efficient',
                    description: 'Unnecessary steps, slow processes, or features that could be streamlined'
                },
                {
                    id: 'accessibility_issues',
                    title: 'How hard things are for some people to use',
                    description:
                        'Barriers that might affect people with different abilities or technical skills'
                },
                {
                    id: 'security_privacy',
                    title: 'Security and privacy concerns',
                    description: 'Data collection, security vulnerabilities, or privacy implications'
                }
            ]
        },
        {
            id: 'B10',
            type: 'scenario',
            category: 'collaboration_style',
            question:
                "You're working on a group project where everyone has different ideas about the direction. What role do you naturally fall into?",
            options: [
                {
                    id: 'mediator_synthesizer',
                    title: 'The Bridge Builder',
                    description:
                        'Help everyone understand each other and find ways to combine different ideas'
                },
                {
                    id: 'researcher_analyst',
                    title: 'The Researcher',
                    description: 'Gather information to help the group make informed decisions'
                },
                {
                    id: 'implementer_doer',
                    title: 'The Implementer',
                    description:
                        'Focus on what you can contribute while others debate the big picture'
                },
                {
                    id: 'facilitator_organizer',
                    title: 'The Organizer',
                    description: "Keep the group on track and make sure everyone's voice is heard"
                }
            ]
        },
        {
            id: 'B11',
            type: 'multiple_choice',
            category: 'motivation_source',
            question: 'What type of work makes you lose track of time?',
            options: [
                {
                    id: 'creative_building',
                    title: 'Creating or building something new',
                    description: "When you're bringing an idea to life or making something from scratch"
                },
                {
                    id: 'problem_solving',
                    title: 'Solving puzzles or debugging problems',
                    description: 'Working through complex problems until you find the solution'
                },
                {
                    id: 'learning_mastery',
                    title: 'Learning and mastering new skills',
                    description: 'Diving deep into understanding how something works'
                },
                {
                    id: 'helping_others',
                    title: 'Helping others achieve their goals',
                    description: 'Teaching, mentoring, or enabling others to succeed'
                }
            ]
        },
        {
            id: 'B12',
            type: 'scale',
            category: 'risk_comfort',
            question:
                'How do you feel about trying new approaches when the familiar way works fine?',
            subtitle: 'Consider both personal projects and academic work',
            scale: {
                min: 1,
                max: 10,
                labels: {
                    1: 'Stick with what works reliably',
                    3: 'Try new things occasionally',
                    5: 'Balance between proven and experimental',
                    7: 'Often experiment with new approaches',
                    10: 'Always looking for better ways to do things'
                },
                descriptions: {
                    1: 'You prefer reliable, proven methods that you know will work',
                    3: "You'll try new approaches sometimes, but default to what's familiar",
                    5: 'You balance trying new things with using reliable approaches',
                    7: 'You actively seek out new methods and tools to improve your work',
                    10: "You're always experimenting and pushing boundaries, even if it's riskier"
                }
            }
        },

        // NEW: B13–B15 we finalized
        {
            id: 'B13',
            type: 'visual_choice',
            category: 'work_environment',
            question: 'Picture your ideal work setting — where would you feel most energized?',
            subtitle: 'Choose the environment that feels most like you',
            options: [
                {
                    id: 'lab_research',
                    visual: '🧪',
                    title: 'Laboratory / Clean Room',
                    description: 'Testing prototypes, running experiments, biomedical or materials research',
                    role_signals: ['Biomedical', 'Hardware R&D']
                },
                {
                    id: 'modern_office',
                    visual: '💻',
                    title: 'Modern Tech Office',
                    description: 'Open workspace, multiple monitors, coding or design focus',
                    role_signals: ['Software', 'Data', 'Product']
                },
                {
                    id: 'hospital_clinic',
                    visual: '🏥',
                    title: 'Hospital / Clinical Setting',
                    description: 'Technology directly supporting doctors, nurses, and patients',
                    role_signals: ['Biomedical', 'HealthTech']
                },
                {
                    id: 'factory_floor',
                    visual: '🏭',
                    title: 'Factory / Industrial Environment',
                    description: 'Automation, robotics, manufacturing, IoT, process optimization',
                    role_signals: ['Industrial', 'Automation', 'IoT']
                }
            ]
        },
        {
            id: 'B14',
            type: 'multiple_choice',
            category: 'impact_orientation',
            question: 'Five years from now, which outcomes would make you proudest about your work?',
            subtitle: 'Select up to 2',
            allow_multiple: 2,
            validation: { min: 1, max: 2 },
            options: [
                {
                    id: 'save_lives',
                    title: 'Improve or save lives directly',
                    description:
                        'Medical devices, clinical software, health data systems, safety-critical tools',
                    role_signals: ['Biomedical', 'HealthTech', 'Medical Imaging', 'Robotics (medical)']
                },
                {
                    id: 'reach_millions',
                    title: 'Reach millions every day',
                    description: 'Consumer apps, mobile/web products, games, creator platforms',
                    role_signals: ['Frontend', 'Mobile', 'Full Stack', 'Game Dev', 'Developer Advocate', 'Technical Writer']
                },
                {
                    id: 'advance_frontier',
                    title: 'Advance the frontier',
                    description: 'AI/ML, graphics, AR/VR, aerospace, autonomous systems, emerging tech',
                    role_signals: ['ML Eng', 'Data Science', 'Graphics/Rendering', 'AR/VR', 'Aerospace', 'Autonomy']
                },
                {
                    id: 'make_systems_reliable',
                    title: 'Make systems fast, safe, and reliable',
                    description: 'Infrastructure, cloud scale, SRE, DevOps, cybersecurity, QA',
                    role_signals: ['SRE', 'DevOps', 'Cybersecurity', 'QA/Automation', 'Backend', 'ML Infra']
                },
                {
                    id: 'boost_efficiency',
                    title: 'Make organizations radically more efficient',
                    description: 'Automation, pipelines, industrial/IoT, supply chain, data-driven ops',
                    role_signals: ['Industrial Software', 'Automation', 'Industrial IoT', 'Quality Systems', 'Supply Chain Tech', 'Data Analyst']
                },
                {
                    id: 'build_in_the_physical_world',
                    title: 'Build things you can touch',
                    description:
                        'Embedded, firmware, PCB, sensors, power & control systems, robotics hardware',
                    role_signals: ['Embedded', 'Firmware', 'PCB Design', 'Power Systems', 'Control Systems', 'Signal Processing', 'Hardware Security', 'FPGA']
                }
            ]
        },
        {
            id: 'B15',
            type: 'scale',
            category: 'abstraction_preference',
            question:
                "When you’re most in your element, are you working with things you can physically touch or abstract systems you can only imagine?",
            subtitle: 'This helps identify your balance between hardware and software',
            scale: {
                min: 1,
                max: 10,
                labels: {
                    1: 'Hands-on hardware and circuits',
                    3: 'Mostly hardware with some programming',
                    5: 'Equal mix of hardware and software',
                    7: 'Mostly software but mindful of hardware',
                    10: 'Pure software, data, and algorithms'
                },
                descriptions: {
                    1: 'You thrive when working with tools, boards, and sensors in the physical world',
                    3: 'You enjoy hardware but see software as a supporting piece',
                    5: 'You’re equally comfortable soldering a circuit or writing a script',
                    7: 'You prefer coding but like to understand the hardware underneath',
                    10: 'You think in logic, abstractions, and pure software architectures'
                }
            }
        }
    ],

    // =============================================================================
    // INTERMEDIATE LEVEL - Tech Curious (10 Questions)
    // =============================================================================
    intermediate: [
        {
            id: 'I01',
            type: 'short_response',
            category: 'authentic_problem_solving',
            question: "Describe a real project or problem you worked on where you had to figure things out as you went along. What was your approach when you hit roadblocks?",
            subtitle: "This could be from school, work, personal projects, or even non-tech situations",
            placeholder: "I was working on... and when I got stuck, I...",
            max_length: 300
        },

        {
            id: 'I02',
            type: 'multiple_choice',
            category: 'critical_thinking',
            question: "What's a technology trend or tool that everyone seems excited about, but you're skeptical of?",
            subtitle: "What makes you cautious when others are enthusiastic?",
            options: [
                {
                    id: 'ai_automation_concerns',
                    title: 'AI replacing human jobs too quickly',
                    description: 'Worried about the pace of AI adoption without considering social impact'
                },
                {
                    id: 'privacy_surveillance',
                    title: 'Smart devices and data collection',
                    description: 'Concerned about privacy implications of connected devices and data harvesting'
                },
                {
                    id: 'complexity_over_utility',
                    title: 'Complex solutions to simple problems',
                    description: 'When new tech makes things more complicated instead of actually better'
                },
                {
                    id: 'sustainability_concerns',
                    title: 'Environmental impact of new tech',
                    description: 'Questioning the environmental cost of crypto, AI training, or constant device upgrades'
                },
                {
                    id: 'hype_over_substance',
                    title: 'Technologies that seem overhyped',
                    description: 'When the marketing promises don\'t match the actual current capabilities'
                }
            ]
        },

        {
            id: 'I03',
            type: 'scenario',
            category: 'leadership_under_pressure',
            question: "You're leading a team project with a tight deadline. Two days before it's due, you realize a core assumption was wrong and your current approach won't work. How do you handle this?",
            options: [
                {
                    id: 'transparent_pivot',
                    title: 'Immediate team meeting to pivot strategy',
                    description: 'Be transparent about the issue and rally the team around a new approach'
                },
                {
                    id: 'damage_control_focus',
                    title: 'Focus on what can still be salvaged',
                    description: 'Quickly identify parts that still work and build a minimal viable solution'
                },
                {
                    id: 'stakeholder_communication',
                    title: 'Communicate with stakeholders about timeline',
                    description: 'Manage expectations while the team works on the best possible solution'
                },
                {
                    id: 'parallel_solution_development',
                    title: 'Split team to work on multiple approaches',
                    description: 'Divide efforts between fixing current approach and developing alternatives'
                }
            ]
        },

        {
            id: 'I04',
            type: 'short_response',
            category: 'learning_under_pressure',
            question: "Tell me about a time when you had to learn something completely new under pressure. What strategies worked for you?",
            subtitle: "Focus on what actually helped you succeed in that situation",
            placeholder: "I had to quickly learn... and what worked was...",
            max_length: 250
        },

        {
            id: 'I05',
            type: 'multiple_choice',
            category: 'systems_thinking',
            question: "You notice a pattern or inefficiency that others seem to miss. Give me a real example from your life at UC Davis or elsewhere.",
            subtitle: "This reveals how you naturally observe and think about systems",
            options: [
                {
                    id: 'workflow_inefficiency',
                    title: 'Inefficient processes or workflows',
                    description: 'Like registration systems, food service lines, or administrative processes that could be streamlined'
                },
                {
                    id: 'resource_allocation',
                    title: 'Poor resource allocation or utilization',
                    description: 'Like study spaces being empty while others are overcrowded, or equipment not being used optimally'
                },
                {
                    id: 'communication_gaps',
                    title: 'Communication breakdowns or information gaps',
                    description: 'When information doesn\'t reach the people who need it, or gets lost between departments'
                },
                {
                    id: 'user_experience_friction',
                    title: 'User experience friction in daily systems',
                    description: 'When campus apps, websites, or services make simple tasks unnecessarily difficult'
                },
                {
                    id: 'timing_scheduling_issues',
                    title: 'Timing or scheduling inefficiencies',
                    description: 'Like bus schedules that don\'t match class times, or services closing when students need them most'
                }
            ]
        },

        {
            id: 'I06',
            type: 'visual_choice',
            category: 'technical_curiosity',
            question: "What's the most interesting technical challenge you've encountered, even if you couldn't fully solve it?",
            subtitle: "What made it fascinating to you?",
            options: [
                {
                    id: 'algorithmic_optimization',
                    visual: '🧮',
                    title: 'Algorithm or Performance Challenge',
                    description: 'Making something faster, more efficient, or handling scale better'
                },
                {
                    id: 'integration_complexity',
                    visual: '🔗',
                    title: 'Integration or Compatibility Problem',
                    description: 'Getting different systems, APIs, or technologies to work together'
                },
                {
                    id: 'user_behavior_mystery',
                    visual: '🤔',
                    title: 'Understanding User Behavior',
                    description: 'Figuring out why people use something differently than expected'
                },
                {
                    id: 'data_pattern_analysis',
                    visual: '📊',
                    title: 'Data Pattern or Analysis Challenge',
                    description: 'Finding meaningful patterns in complex or messy data'
                },
                {
                    id: 'creative_constraint_solving',
                    visual: '🎯',
                    title: 'Creative Solution within Constraints',
                    description: 'Building something useful with limited resources or strict requirements'
                }
            ]
        },

        {
            id: 'I07',
            type: 'scenario',
            category: 'conflict_resolution',
            question: "You're on a project team where two members have completely different visions and are getting frustrated with each other. How do you help move things forward?",
            options: [
                {
                    id: 'structured_decision_process',
                    title: 'Create structured decision-making process',
                    description: 'Establish criteria for evaluating both approaches objectively'
                },
                {
                    id: 'stakeholder_perspective',
                    title: 'Refocus on end-user needs',
                    description: 'Bring the conversation back to what would actually serve users best'
                },
                {
                    id: 'hybrid_solution_development',
                    title: 'Explore hybrid approaches',
                    description: 'Look for ways to combine the best elements of both visions'
                },
                {
                    id: 'prototype_validation',
                    title: 'Build quick prototypes to test assumptions',
                    description: 'Create simple versions of both approaches to see what actually works'
                }
            ]
        },

        {
            id: 'I08',
            type: 'ranking',
            category: 'team_effectiveness',
            question: "You're building a diverse project team. What's most important for the team's success?",
            subtitle: "Rank these from most critical to least critical",
            items: [
                {
                    id: 'psychological_safety',
                    text: 'Psychological Safety',
                    description: 'Team members feel safe to take risks, make mistakes, and share ideas freely'
                },
                {
                    id: 'complementary_skills',
                    text: 'Complementary Skills',
                    description: 'Team has diverse technical and non-technical skills that cover all project needs'
                },
                {
                    id: 'clear_communication',
                    text: 'Clear Communication Protocols',
                    description: 'Established ways for sharing information, making decisions, and resolving conflicts'
                },
                {
                    id: 'shared_vision',
                    text: 'Shared Vision and Goals',
                    description: 'Everyone understands and is committed to the same objectives and success metrics'
                },
                {
                    id: 'adaptive_processes',
                    text: 'Adaptive Processes',
                    description: 'Ability to change approach when things aren\'t working or requirements shift'
                }
            ]
        },

        {
            id: 'I09',
            type: 'scale',
            category: 'autonomy_preference',
            question: "When working on challenging problems, how much guidance do you prefer?",
            subtitle: "Consider both technical and non-technical challenges",
            scale: {
                min: 1,
                max: 10,
                labels: {
                    1: "Clear direction and regular check-ins",
                    3: "General guidance with structured milestones",
                    5: "Balanced independence with available support",
                    7: "Minimal guidance, mostly independent work",
                    10: "Complete autonomy to define and solve problems"
                },
                descriptions: {
                    1: "You work best with clear expectations and regular feedback",
                    3: "You like having a roadmap but prefer some flexibility in execution",
                    5: "You want the option to get help when needed, but can work independently",
                    7: "You prefer figuring things out yourself with occasional guidance",
                    10: "You thrive when given complete freedom to approach problems your way"
                }
            }
        },

        {
            id: 'I10',
            type: 'short_response',
            category: 'failure_resilience',
            question: "Describe a time when your approach to a problem completely failed. What did you do next, and what did you learn?",
            subtitle: "We're interested in how you handle setbacks and learn from them",
            placeholder: "I was trying to... and when it completely failed, I...",
            max_length: 250
        },

        {
            id: 'I11',
            type: 'scale',
            category: 'technical_specialization',
            question: "When solving technical problems, where do you find yourself most engaged?",
            subtitle: "Think about where you lose track of time",
            scale: {
                min: 1,
                max: 10,
                labels: {
                    1: "Physical prototypes and hardware debugging",
                    3: "Embedded systems and firmware",
                    5: "Full-stack applications bridging hardware and software",
                    7: "Pure software architecture and algorithms",
                    10: "Data models and machine learning systems"
                },
                descriptions: {
                    1: "You love oscilloscopes, soldering, and getting your hands dirty with circuits",
                    3: "You enjoy making hardware and software communicate seamlessly",
                    5: "You're equally happy debugging circuits or optimizing databases",
                    7: "You prefer elegant code solutions and system design patterns",
                    10: "You think in statistical models and data pipelines"
                }
            }
        },

        {
            id: 'I12',
            type: 'multiple_choice',
            category: 'industry_preference',
            question: "Which of these industry challenges excites you most?",
            subtitle: "Consider both the problem space and the impact you'd want to have",
            allow_multiple: 2,
            validation: { min: 1, max: 2 },
            options: [
                {
                    id: 'healthcare_biotech',
                    title: 'Improving human health and medical outcomes',
                    description: 'Medical devices, diagnostic tools, genomics, wearable health tech, clinical systems'
                },
                {
                    id: 'aerospace_defense',
                    title: 'Pushing the boundaries of flight and space',
                    description: 'Satellites, rockets, drones, avionics, autonomous aerial systems'
                },
                {
                    id: 'industrial_automation',
                    title: 'Revolutionizing manufacturing and logistics',
                    description: 'Factory automation, robotics, supply chain optimization, IoT sensors'
                },
                {
                    id: 'consumer_products',
                    title: 'Creating products millions use daily',
                    description: 'Mobile apps, games, social platforms, consumer electronics'
                },
                {
                    id: 'infrastructure_systems',
                    title: 'Building critical infrastructure and platforms',
                    description: 'Cloud systems, cybersecurity, networking, enterprise software'
                }
            ]
        },

        {
            id: 'I13',
            type: 'scenario',
            category: 'interdisciplinary_preference',
            question: "You're on a project that requires expertise outside your comfort zone. How do you approach this?",
            subtitle: "This reveals your preferences for specialization vs. generalization",
            options: [
                {
                    id: 'deep_partnership',
                    title: 'Find domain experts to partner with closely',
                    description: 'Stay specialized while building strong collaborative relationships'
                },
                {
                    id: 'rapid_learning',
                    title: 'Dive deep into learning the new domain myself',
                    description: 'Expand your expertise to become self-sufficient in multiple areas'
                },
                {
                    id: 'bridge_builder',
                    title: 'Become the translator between different specialties',
                    description: 'Focus on integration and communication between domain experts'
                },
                {
                    id: 'tool_creator',
                    title: 'Build tools that abstract away the complexity',
                    description: 'Create systems that make the specialized knowledge accessible to others'
                }
            ]
        }
    ],

    // =============================================================================
    // ADVANCED LEVEL - Tech Insider (10 Questions)  
    // =============================================================================
    advanced: [
        {
            id: 'A01',
            type: 'scenario',
            category: 'technical_leadership_judgment',
            question: "You're the technical lead on a project where the initial architecture isn't scaling. Your team is split between refactoring (risky, time-consuming) and quick fixes (faster, but creates technical debt). The business is pressuring for delivery. How do you navigate this decision?",
            options: [
                {
                    id: 'quantified_risk_analysis',
                    title: 'Quantify long-term costs vs short-term gains',
                    description: 'Present detailed analysis showing the true cost of technical debt vs refactoring investment'
                },
                {
                    id: 'stakeholder_education',
                    title: 'Educate stakeholders on technical implications',
                    description: 'Help business stakeholders understand the long-term impact of technical decisions'
                },
                {
                    id: 'phased_hybrid_approach',
                    title: 'Design phased approach with clear milestones',
                    description: 'Create strategy that delivers business value while systematically addressing technical debt'
                },
                {
                    id: 'team_consensus_building',
                    title: 'Facilitate team decision with clear ownership',
                    description: 'Build team consensus around approach and ensure everyone owns the consequences'
                }
            ]
        },

        {
            id: 'A02',
            type: 'short_response',
            category: 'strategic_judgment',
            question: "Describe your approach to making a critical business or technical decision when you have limited information and significant time pressure.",
            subtitle: "Think about a challenging decision you've actually made or how you would systematically approach one",
            placeholder: "When facing a high-stakes decision with incomplete information, my approach is to...",
            max_length: 350
        },

        {
            id: 'A03',
            type: 'multiple_choice',
            category: 'systems_architecture_philosophy',
            question: "You're designing a system that needs to handle unpredictable traffic spikes while maintaining performance and cost-effectiveness. What's your architectural philosophy?",
            subtitle: "Choose the approach that best aligns with your engineering thinking",
            options: [
                {
                    id: 'resilience_first',
                    title: 'Resilience-First Architecture',
                    description: 'Build for failure with circuit breakers, graceful degradation, and self-healing capabilities'
                },
                {
                    id: 'adaptive_intelligence',
                    title: 'Adaptive Intelligence Systems',
                    description: 'Use machine learning and predictive analytics to anticipate and auto-scale resources'
                },
                {
                    id: 'modular_composability',
                    title: 'Modular Composable Architecture',
                    description: 'Design loosely coupled services that can be independently scaled and modified'
                },
                {
                    id: 'edge_distributed',
                    title: 'Edge-Distributed Processing',
                    description: 'Push processing closer to users with CDNs, edge computing, and regional distribution'
                }
            ]
        },

        {
            id: 'A04',
            type: 'scale',
            category: 'innovation_risk_appetite',
            question: "Your team could significantly benefit from adopting a cutting-edge technology, but it's relatively untested in production environments and your team doesn't have experience with it. How do you approach this decision?",
            subtitle: "Consider business pressure, team capability, timeline constraints, and potential impact",
            scale: {
                min: 1,
                max: 10,
                labels: {
                    1: "Use proven technologies only",
                    3: "Limited pilot with comprehensive fallback plan",
                    5: "Balanced innovation with risk mitigation strategies",
                    7: "Aggressive adoption with external expertise",
                    10: "Full commitment with intensive research phase"
                },
                descriptions: {
                    1: "Stick with battle-tested stack to ensure delivery, innovate when timeline allows",
                    3: "Small proof-of-concept while developing robust backup using familiar tools",
                    5: "Invest in team training while building minimal viable version in parallel",
                    7: "Partner with consultants/experts while team rapidly upskills on new technology",
                    10: "Commit fully to new tech with intensive research, prototyping, and validation phase"
                }
            }
        },

        {
            id: 'A05',
            type: 'scenario',
            category: 'mentorship_communication',
            question: "You're reviewing code from a talented junior developer that works functionally but has significant issues with maintainability, performance, and follows outdated patterns. How do you provide feedback that helps them grow?",
            options: [
                {
                    id: 'collaborative_code_review',
                    title: 'Interactive pairing and code walkthrough',
                    description: 'Schedule time to explore the code together and discuss improvements in real-time'
                },
                {
                    id: 'educational_resource_provision',
                    title: 'Comprehensive feedback with learning resources',
                    description: 'Provide detailed written feedback with links to best practices and learning materials'
                },
                {
                    id: 'gradual_improvement_plan',
                    title: 'Staged improvement with clear priorities',
                    description: 'Focus on most critical issues first and create structured plan for gradual enhancement'
                },
                {
                    id: 'contextual_refactoring',
                    title: 'Demonstrate improvements through refactoring',
                    description: 'Show better approaches by refactoring parts of their code as teaching examples'
                }
            ]
        },

        {
            id: 'A06',
            type: 'short_response',
            category: 'technical_judgment_experience',
            question: "Describe a technical decision you made that you later realized was suboptimal or wrong. What would you do differently now, and how has this influenced your decision-making process?",
            subtitle: "Focus on what you learned and how it changed your approach",
            placeholder: "I made a decision to... and later realized it was wrong because... Now I approach similar decisions by...",
            max_length: 300
        },

        {
            id: 'A07',
            type: 'scenario',
            category: 'change_management_leadership',
            question: "You're leading the evaluation of a new framework that promises significant benefits but requires migrating substantial legacy code. The engineering team is divided - some are excited, others are concerned about risk. How do you drive this decision?",
            options: [
                {
                    id: 'evidence_based_consensus',
                    title: 'Build consensus through evidence and inclusion',
                    description: 'Involve skeptics in evaluation process and address concerns with concrete data'
                },
                {
                    id: 'pilot_validation_approach',
                    title: 'Proof-of-concept with real migration challenges',
                    description: 'Implement realistic pilot that demonstrates both benefits and migration complexity'
                },
                {
                    id: 'risk_mitigation_planning',
                    title: 'Comprehensive risk assessment and mitigation',
                    description: 'Create detailed migration plan with rollback procedures and risk mitigation strategies'
                },
                {
                    id: 'objective_criteria_framework',
                    title: 'Establish clear success metrics and decision criteria',
                    description: 'Define objective measurements for evaluation before beginning assessment process'
                }
            ]
        },

        {
            id: 'A08',
            type: 'multiple_choice',
            category: 'hiring_leadership_philosophy',
            question: "You're hiring for a senior technical role and have two equally qualified candidates. One consistently takes creative risks and pushes boundaries, while the other delivers reliable, high-quality results with proven approaches. Your team currently has tight deadlines and stability needs, but also long-term innovation goals. Who do you choose and why?",
            options: [
                {
                    id: 'stability_prioritization',
                    title: 'The Reliable Deliverer',
                    description: 'Current stability needs outweigh innovation - can foster creativity later when timeline allows'
                },
                {
                    id: 'innovation_investment',
                    title: 'The Creative Risk-Taker',
                    description: 'Long-term innovation is critical - willing to invest in managing short-term stability challenges'
                },
                {
                    id: 'contextual_role_design',
                    title: 'Depends on specific role and team composition',
                    description: 'Decision should be based on what the team specifically lacks and the role\'s primary focus'
                },
                {
                    id: 'hybrid_team_strategy',
                    title: 'Try to hire both and create complementary roles',
                    description: 'Structure team to leverage both stability and innovation strengths if resources allow'
                }
            ]
        },

        {
            id: 'A09',
            type: 'short_response',
            category: 'emerging_technology_analysis',
            question: "What's an emerging technology that you believe will fundamentally change how people work or live in the next 5-10 years? What's your evidence for this prediction, and what are the potential downsides?",
            subtitle: "Focus on your reasoning and analysis rather than just the technology itself",
            placeholder: "I believe [technology] will fundamentally change [area] because [evidence/reasoning]. However, the potential downsides include...",
            max_length: 400
        },

        {
            id: 'A10',
            type: 'scenario',
            category: 'adaptive_leadership_uncertainty',
            question: "You're leading a project where the requirements keep changing due to shifting market conditions and stakeholder feedback. Your team is getting frustrated with the constant pivots. How do you maintain momentum and team morale while adapting to uncertainty?",
            options: [
                {
                    id: 'transparent_context_sharing',
                    title: 'Increase transparency about business context',
                    description: 'Help team understand why changes are happening and their role in company success'
                },
                {
                    id: 'agile_process_optimization',
                    title: 'Optimize processes for change management',
                    description: 'Implement systems and workflows that make pivoting less disruptive to team productivity'
                },
                {
                    id: 'core_stability_creation',
                    title: 'Identify stable core elements to build upon',
                    description: 'Find aspects of the project that won\'t change and create solid foundation there'
                },
                {
                    id: 'team_skill_development',
                    title: 'Invest in team adaptability and resilience skills',
                    description: 'Focus on developing team capabilities that remain valuable regardless of direction changes'
                }
            ]
        },

        {
            id: 'A11',
            type: 'multiple_choice',
            category: 'complexity_handling',
            question: "You're designing a critical system from scratch. Which constraints would you find most intellectually stimulating?",
            subtitle: "Choose up to 2 that would energize rather than frustrate you",
            allow_multiple: 2,
            validation: { min: 1, max: 2 },
            options: [
                {
                    id: 'safety_critical',
                    title: 'Life-or-death reliability requirements',
                    description: 'Medical devices, aviation systems, or autonomous vehicles where failure means catastrophe'
                },
                {
                    id: 'extreme_scale',
                    title: 'Massive scale with billions of users',
                    description: 'Global platforms handling enormous data volumes and concurrent users'
                },
                {
                    id: 'resource_constrained',
                    title: 'Severe hardware and power limitations',
                    description: 'Embedded systems, IoT devices, or space applications with tight constraints'
                },
                {
                    id: 'real_time',
                    title: 'Microsecond-level timing requirements',
                    description: 'High-frequency trading, gaming engines, or industrial control systems'
                },
                {
                    id: 'regulatory_complex',
                    title: 'Heavy regulatory and compliance requirements',
                    description: 'Healthcare, finance, or aerospace with extensive certification needs'
                }
            ]
        },

        {
            id: 'A12',
            type: 'scenario',
            category: 'leadership_vision',
            question: "Your company is deciding between two technical strategies for the next 5 years. Which would you champion?",
            subtitle: "Consider both technical merit and business impact",
            options: [
                {
                    id: 'vertical_integration',
                    title: 'Build custom hardware/software stack for competitive advantage',
                    description: 'Control the full stack from silicon to services, like Apple or Tesla'
                },
                {
                    id: 'platform_ecosystem',
                    title: 'Create an open platform that others build upon',
                    description: 'Focus on enabling others to innovate, like Android or AWS'
                },
                {
                    id: 'ai_transformation',
                    title: 'Restructure everything around AI and machine learning',
                    description: 'Make AI the core of all products and operations'
                },
                {
                    id: 'specialized_excellence',
                    title: 'Become the absolute best at one critical technology',
                    description: 'Deep specialization in areas like quantum computing or bioengineering'
                }
            ]
        },

        {
            id: 'A13',
            type: 'scale',
            category: 'innovation_preference',
            question: "In your ideal role, how would you balance creating new solutions versus perfecting existing ones?",
            subtitle: "Consider where you create the most value",
            scale: {
                min: 1,
                max: 10,
                labels: {
                    1: "100% optimizing and perfecting existing systems",
                    3: "Mostly refinement with occasional innovation",
                    5: "Equal mix of optimization and new development",
                    7: "Mostly new development with some optimization",
                    10: "100% greenfield projects and breakthrough innovation"
                },
                descriptions: {
                    1: "You excel at taking good systems and making them exceptional through optimization",
                    3: "You prefer improving proven solutions while occasionally exploring new ideas",
                    5: "You enjoy both the creativity of new projects and the craftsmanship of refinement",
                    7: "You thrive on building new things but appreciate the importance of polish",
                    10: "You live for the bleeding edge and completely novel solutions"
                }
            }
        }
    ]
};

// Add this at the end of backend/data/enhancedThreeLevelQuizData.js
// Replace the existing enhancedCareerOptions array

// Enhanced career options for matching - 55 careers
const enhancedCareerOptions = [
    // Software/CS Focused (20)
    'Software Engineer (Full Stack)',
    'Frontend Engineer',
    'Backend Engineer',
    'Web Developer',
    'Mobile Developer (iOS/Android)',
    'DevOps Engineer',
    'Site Reliability Engineer (SRE)',
    'Graphics/Rendering Engineer',
    'Blockchain Developer',
    'AR/VR Developer',
    'ML Infrastructure Engineer',
    'Game Developer',
    'Technical Writer',
    'Developer Advocate',
    'IT Support Engineer',
    'QA/Test Automation Engineer',
    'Data Scientist',
    'Data Analyst',
    'Machine Learning Engineer',
    'Cybersecurity Engineer',

    // Hardware/EE Focused (12)
    'Embedded Systems Engineer',
    'Hardware Design Engineer',
    'FPGA Engineer',
    'Digital Design Engineer',
    'RF Engineer',
    'Power Systems Engineer',
    'Control Systems Engineer',
    'Signal Processing Engineer',
    'Computer Vision Engineer',
    'Firmware Engineer',
    'PCB Design Engineer',
    'Hardware Security Engineer',

    // Aerospace (4)
    'Aerospace Software Engineer',
    'Systems Integration Engineer',
    'Avionics Engineer',
    'Autonomous Systems Engineer (Drones/UAV)',

    // Biomedical (10)
    'Medical Device Software Engineer',
    'Clinical Systems Engineer',
    'Bioinformatics Engineer',
    'Healthcare Data Analyst',
    'Medical Imaging Software Developer',
    'Wearable Technology Engineer',
    'Health Tech Software Engineer',
    'Computational Biology Engineer',
    'Medical Robotics Engineer',
    'Biomedical Signal Processing Engineer',

    // Industrial/Manufacturing (6)
    'Industrial Software Engineer',
    'Automation Engineer',
    'Industrial IoT Engineer',
    'Quality Systems Engineer',
    'Factory Automation Developer',
    'Supply Chain Technology Analyst',

    // Business-Tech Hybrid (3)
    'Technical Product Manager',
    'Sales Engineer',
    'Research Engineer'
];

module.exports = {
    enhancedThreeLevelQuizQuestions,
    enhancedCareerOptions
};