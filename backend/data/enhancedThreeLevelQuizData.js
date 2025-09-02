// Revised Tech Path Discovery Quiz Questions
// Enhanced with authentic experience-based questions

const enhancedThreeLevelQuizQuestions = {
    // =============================================================================
    // BEGINNER LEVEL - Tech Explorer (12 Questions)
    // =============================================================================
    beginner: [
        {
            id: 'B01',
            type: 'short_response',
            category: 'natural_curiosity',
            question: "Think of the last time you got completely absorbed in figuring something out (could be anything - a puzzle, fixing something, learning a skill). What was it and what kept you hooked?",
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
                    description: 'When things are hard to find or the design doesn\'t make sense'
                },
                {
                    id: 'speed_reliability',
                    title: 'Things that are slow or unreliable',
                    description: 'When apps crash, websites load slowly, or systems don\'t work consistently'
                },
                {
                    id: 'personalization_limits',
                    title: 'One-size-fits-all solutions',
                    description: 'When technology doesn\'t adapt to your specific needs or preferences'
                },
                {
                    id: 'complexity_barriers',
                    title: 'Unnecessarily complicated processes',
                    description: 'When simple tasks require too many steps or technical knowledge'
                }
            ]
        },

        {
            id: 'B03',
            type: 'visual_choice',
            category: 'natural_focus',
            question: "When you discover a really cool new app or website, what's the FIRST thing you notice?",
            subtitle: "Go with your gut reaction",
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
            question: "You have unlimited time and resources to build one thing that would genuinely help UC Davis students. What would you create?",
            subtitle: "Think about problems you've actually experienced or witnessed",
            placeholder: "I would build something that helps students with...",
            max_length: 200
        },

        {
            id: 'B05',
            type: 'multiple_choice',
            category: 'natural_aptitudes',
            question: "What's something you're naturally good at that friends or family often ask you to help with?",
            options: [
                {
                    id: 'troubleshooting_fixing',
                    title: 'Troubleshooting and fixing things',
                    description: 'When something isn\'t working, people come to you to figure out why'
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
                    description: 'Finding unconventional solutions when the obvious approach doesn\'t work'
                }
            ]
        },

        {
            id: 'B06',
            type: 'scale',
            category: 'work_preference',
            question: "What type of work environment makes you most productive and energized?",
            subtitle: "Think about when you do your best work",
            scale: {
                min: 1,
                max: 10,
                labels: {
                    1: "Solo focus time with minimal interruption",
                    3: "Mostly independent with occasional collaboration",
                    5: "Balanced mix of solo work and teamwork",
                    7: "Collaborative environment with regular interaction",
                    10: "High-energy team environment with constant communication"
                },
                descriptions: {
                    1: "You're most productive when you can dive deep without distractions",
                    3: "You like working independently but value periodic check-ins",
                    5: "You work well both alone and with others, depending on the task",
                    7: "You thrive on collaboration and regular feedback from teammates",
                    10: "You're energized by constant interaction and team problem-solving"
                }
            }
        },

        {
            id: 'B07',
            type: 'multiple_choice',
            category: 'learning_approach',
            question: "You need to learn a new skill quickly for a project. What's your go-to approach?",
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
                    description: 'Study the official docs and try different approaches systematically'
                }
            ]
        },

        {
            id: 'B08',
            type: 'ranking',
            category: 'decision_values',
            question: "When making important decisions about your future, what matters most to you?",
            subtitle: "Rank these from most important to least important",
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
            question: "What do you notice about technology that your friends don't seem to care about?",
            options: [
                {
                    id: 'design_inconsistencies',
                    title: 'Design inconsistencies and visual details',
                    description: 'Things like misaligned buttons, inconsistent fonts, or poor color choices'
                },
                {
                    id: 'efficiency_optimization',
                    title: 'Ways things could be more efficient',
                    description: 'Unnecessary steps, slow processes, or features that could be streamlined'
                },
                {
                    id: 'accessibility_issues',
                    title: 'How hard things are for some people to use',
                    description: 'Barriers that might affect people with different abilities or technical skills'
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
            question: "You're working on a group project where everyone has different ideas about the direction. What role do you naturally fall into?",
            options: [
                {
                    id: 'mediator_synthesizer',
                    title: 'The Bridge Builder',
                    description: 'Help everyone understand each other and find ways to combine different ideas'
                },
                {
                    id: 'researcher_analyst',
                    title: 'The Researcher',
                    description: 'Gather information to help the group make informed decisions'
                },
                {
                    id: 'implementer_doer',
                    title: 'The Implementer',
                    description: 'Focus on what you can contribute while others debate the big picture'
                },
                {
                    id: 'facilitator_organizer',
                    title: 'The Organizer',
                    description: 'Keep the group on track and make sure everyone\'s voice is heard'
                }
            ]
        },

        {
            id: 'B11',
            type: 'multiple_choice',
            category: 'motivation_source',
            question: "What type of work makes you lose track of time?",
            options: [
                {
                    id: 'creative_building',
                    title: 'Creating or building something new',
                    description: 'When you\'re bringing an idea to life or making something from scratch'
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
            question: "How do you feel about trying new approaches when the familiar way works fine?",
            subtitle: "Consider both personal projects and academic work",
            scale: {
                min: 1,
                max: 10,
                labels: {
                    1: "Stick with what works reliably",
                    3: "Try new things occasionally",
                    5: "Balance between proven and experimental",
                    7: "Often experiment with new approaches",
                    10: "Always looking for better ways to do things"
                },
                descriptions: {
                    1: "You prefer reliable, proven methods that you know will work",
                    3: "You'll try new approaches sometimes, but default to what's familiar",
                    5: "You balance trying new things with using reliable approaches",
                    7: "You actively seek out new methods and tools to improve your work",
                    10: "You're always experimenting and pushing boundaries, even if it's riskier"
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
        }
    ]
};

// Enhanced career options organized by pathway clusters
const enhancedCareerOptions = {
    // Technical Implementation & Engineering
    engineering: [
        'Frontend Software Engineering',
        'Backend Software Engineering',
        'Full-Stack Software Engineering',
        'Mobile Development (iOS/Android)',
        'DevOps & Site Reliability Engineering',
        'Cloud Infrastructure Engineering',
        'Embedded Systems Engineering',
        'Game Development',
        'AR/VR Development',
        'Blockchain Development'
    ],

    // Data, AI & Analytics
    dataAI: [
        'Data Science',
        'Machine Learning Engineering',
        'AI Research Scientist',
        'Data Engineering',
        'Business Intelligence Analyst',
        'Quantitative Analysis',
        'Computer Vision Engineer',
        'Natural Language Processing Engineer',
        'Robotics Engineering'
    ],

    // User Experience & Design
    design: [
        'UX Design',
        'UI Design',
        'Product Design',
        'User Research',
        'Design Systems Engineering',
        'Service Design',
        'Design Operations',
        'Creative Technology'
    ],

    // Product & Strategy
    product: [
        'Product Management',
        'Technical Product Management',
        'Product Marketing',
        'Growth Product Management',
        'Strategy & Operations',
        'Business Analysis',
        'Technical Program Management',
        'Venture Capital (Technical)'
    ],

    // Security & Infrastructure
    security: [
        'Cybersecurity Engineering',
        'Security Research',
        'Privacy Engineering',
        'Network Security',
        'Application Security',
        'Risk Assessment',
        'Compliance & Governance'
    ],

    // Communication & Enablement  
    communication: [
        'Technical Writing',
        'Developer Relations',
        'Sales Engineering',
        'Technical Consulting',
        'Customer Success (Technical)',
        'Technical Training & Education',
        'Community Management'
    ],

    // Leadership & Management
    leadership: [
        'Engineering Management',
        'Technical Leadership',
        'Chief Technology Officer',
        'Startup Founder',
        'Technical Advisor/Board Member',
        'Innovation Management'
    ],

    // Research & Academia
    research: [
        'Computer Science Research',
        'Industry Research Lab',
        'Technical Education/Professor',
        'Research & Development',
        'Patent Analysis',
        'Technology Assessment'
    ],

    // Emerging & Specialized
    emerging: [
        'Quantum Computing Research',
        'Biotech Software Engineering',
        'Climate Tech Engineering',
        'Space Technology',
        'Autonomous Systems',
        'Extended Reality (XR)',
        'Digital Health Technology',
        'EdTech Innovation'
    ]
};

// Scoring rubric for AI analysis
const scoringDimensions = {
    // Core technical aptitudes
    systematicThinking: {
        description: "Preference for structured, methodical approaches to problem-solving",
        indicators: ["systematic_planning", "comprehensive_verification", "structured_dual_track", "quantified_risk_analysis"]
    },

    creativeInnovation: {
        description: "Tendency toward novel solutions and experimental approaches",
        indicators: ["creative_solutions", "innovation_investment", "experimental_approach", "creative_constraint_solving"]
    },

    userCenteredFocus: {
        description: "Natural attention to user needs and human-centered design",
        indicators: ["user_centered", "stakeholder_perspective", "reader_focused_review", "user_research_driven"]
    },

    // Collaboration and leadership styles
    collaborativeLeadership: {
        description: "Preference for team-based solutions and inclusive decision making",
        indicators: ["collaborative_creative", "diplomatic_facilitator", "evidence_based_consensus", "team_consensus_building"]
    },

    autonomousExecution: {
        description: "Comfort with independent work and self-directed problem solving",
        indicators: ["confidence_submission", "systematic_testing", "complete_autonomy", "adaptive_acceptance"]
    },

    // Learning and growth patterns
    experimentalLearning: {
        description: "Learning through hands-on experimentation and iteration",
        indicators: ["project_based", "jump_in_experiment", "prototype_validation", "trial_and_error"]
    },

    structuredLearning: {
        description: "Preference for systematic, curriculum-based learning approaches",
        indicators: ["structured_learning", "comprehensive_documentation", "systematic_building", "thorough_research"]
    },

    // Technical focus areas
    systemsArchitecture: {
        description: "Interest in large-scale system design and infrastructure",
        indicators: ["distributed_resilience", "modular_composability", "systematic_coordination", "integration_complexity"]
    },

    dataAnalytical: {
        description: "Attraction to data analysis, patterns, and quantitative reasoning",
        indicators: ["data_driven_curiosity", "algorithmic_optimization", "data_pattern_analysis", "quantified_risk_analysis"]
    },

    humanCenteredTech: {
        description: "Focus on technology's impact on people and society",
        indicators: ["positive_impact", "accessibility_issues", "helping_others", "user_behavior_mystery"]
    }
};

// Question category mapping for analysis
const categoryMapping = {
    // Beginner categories
    'natural_curiosity': 'intrinsic_motivation',
    'problem_identification': 'problem_solving_approach',
    'natural_focus': 'attention_patterns',
    'impact_motivation': 'value_alignment',
    'natural_aptitudes': 'skill_indicators',
    'work_preference': 'collaboration_style',
    'learning_approach': 'learning_style',
    'decision_values': 'motivational_drivers',
    'attention_to_detail': 'quality_orientation',
    'collaboration_style': 'team_dynamics',
    'motivation_source': 'flow_activities',
    'risk_comfort': 'innovation_appetite',

    // Intermediate categories  
    'authentic_problem_solving': 'real_experience_validation',
    'critical_thinking': 'independent_judgment',
    'leadership_under_pressure': 'crisis_management',
    'learning_under_pressure': 'adaptability',
    'systems_thinking': 'pattern_recognition',
    'technical_curiosity': 'complexity_preference',
    'conflict_resolution': 'interpersonal_skills',
    'team_effectiveness': 'leadership_philosophy',
    'autonomy_preference': 'work_structure_needs',
    'failure_resilience': 'growth_mindset',

    // Advanced categories
    'technical_leadership_judgment': 'senior_decision_making',
    'strategic_judgment': 'executive_thinking',
    'systems_architecture_philosophy': 'technical_vision',
    'innovation_risk_appetite': 'technology_adoption',
    'mentorship_communication': 'people_development',
    'technical_judgment_experience': 'experiential_learning',
    'change_management_leadership': 'organizational_influence',
    'hiring_leadership_philosophy': 'team_building',
    'emerging_technology_analysis': 'strategic_forecasting',
    'adaptive_leadership_uncertainty': 'uncertainty_navigation'
};

module.exports = {
    enhancedThreeLevelQuizQuestions,
    enhancedCareerOptions,
    scoringDimensions,
    categoryMapping
};
// Make data available to browser
if (typeof window !== 'undefined') {
    window.enhancedThreeLevelQuizQuestions = enhancedThreeLevelQuizQuestions;
}