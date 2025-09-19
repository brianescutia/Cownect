// backend/data/additionalQuizQuestions.js
// New questions to add to each level for better career matching

const additionalQuizQuestions = {
    // BEGINNER LEVEL - Add 3 questions to better identify hardware/biomedical interests
    beginner: [
        {
            id: 'B13',
            type: 'visual_choice',
            category: 'work_environment',
            question: "Picture your ideal work setting — where would you feel most energized?",
            subtitle: "Choose the environment that feels most like you",
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
            question: "Five years from now, which outcomes would make you proudest about your work?",
            subtitle: "Select up to 2",
            allow_multiple: 2,
            validation: { min: 1, max: 2 },
            options: [
                {
                    id: 'save_lives',
                    title: 'Improve or save lives directly',
                    description: 'Medical devices, clinical software, health data systems, safety-critical tools',
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
                    description: 'Embedded, firmware, PCB, sensors, power & control systems, robotics hardware',
                    role_signals: ['Embedded', 'Firmware', 'PCB Design', 'Power Systems', 'Control Systems', 'Signal Processing', 'Hardware Security', 'FPGA']
                }
            ]
        },

        {
            id: 'B15',
            type: 'scale',
            category: 'abstraction_preference',
            question: "When you’re most in your element, are you working with things you can physically touch or abstract systems you can only imagine?",
            subtitle: "This helps identify your balance between hardware and software",
            scale: {
                min: 1,
                max: 10,
                labels: {
                    1: "Hands-on hardware and circuits",
                    3: "Mostly hardware with some programming",
                    5: "Equal mix of hardware and software",
                    7: "Mostly software but mindful of hardware",
                    10: "Pure software, data, and algorithms"
                },
                descriptions: {
                    1: "You thrive when working with tools, boards, and sensors in the physical world",
                    3: "You enjoy hardware but see software as a supporting piece",
                    5: "You’re equally comfortable soldering a circuit or writing a script",
                    7: "You prefer coding but like to understand the hardware underneath",
                    10: "You think in logic, abstractions, and pure software architectures"
                }
            }
        }

    ],

    // INTERMEDIATE LEVEL - Add 3 questions for specialization clarity
    intermediate: [
        {
            id: 'I11',
            type: 'scenario',
            category: 'technical_depth_preference',
            question: "You're assigned to a new project team. Which role would you naturally gravitate toward?",
            subtitle: "Consider where you'd add the most value and feel most engaged",
            options: [
                {
                    id: 'system_architect',
                    title: 'System Architecture & Design',
                    description: 'Design the overall system structure, make technology choices, define interfaces'
                },
                {
                    id: 'data_analytics',
                    title: 'Data Analysis & Insights',
                    description: 'Analyze requirements, gather metrics, create visualizations, inform decisions'
                },
                {
                    id: 'user_interface',
                    title: 'User Interface & Experience',
                    description: 'Design interfaces, conduct user research, improve usability'
                },
                {
                    id: 'quality_reliability',
                    title: 'Quality & Reliability',
                    description: 'Ensure system reliability, create tests, monitor performance, prevent issues'
                },
                {
                    id: 'hardware_integration',
                    title: 'Hardware & Systems Integration',
                    description: 'Connect hardware and software, debug low-level issues, optimize performance'
                }
            ]
        },

        {
            id: 'I12',
            type: 'multiple_choice',
            category: 'industry_preference',
            question: "Which industry or domain would you find most fulfilling to work in?",
            subtitle: "Where do you see yourself making a difference?",
            options: [
                {
                    id: 'healthcare_biotech',
                    title: 'Healthcare & Biotechnology',
                    description: 'Medical devices, genomics, digital health, pharmaceutical tech'
                },
                {
                    id: 'aerospace_defense',
                    title: 'Aerospace & Defense',
                    description: 'Satellites, drones, aviation systems, defense technology'
                },
                {
                    id: 'gaming_entertainment',
                    title: 'Gaming & Entertainment',
                    description: 'Video games, streaming services, AR/VR experiences'
                },
                {
                    id: 'fintech_enterprise',
                    title: 'Finance & Enterprise',
                    description: 'Trading systems, banking apps, enterprise software, blockchain'
                },
                {
                    id: 'automotive_robotics',
                    title: 'Automotive & Robotics',
                    description: 'Self-driving cars, industrial automation, consumer robotics'
                }
            ]
        },

        {
            id: 'I13',
            type: 'short_response',
            category: 'unique_skills',
            question: "What unique combination of skills or interests do you have that others might not? How could this combination be valuable in tech?",
            subtitle: "Think about your background, hobbies, or unusual interests",
            placeholder: "I have a background in [field] and also know [skill], which could help me...",
            max_length: 250
        }
    ],

    // ADVANCED LEVEL - Add 3 questions for career optimization
    advanced: [
        {
            id: 'A11',
            type: 'scenario',
            category: 'career_trajectory',
            question: "Looking 10 years ahead, what kind of technical leader do you want to become?",
            subtitle: "Consider your long-term career aspirations",
            options: [
                {
                    id: 'technical_expert',
                    title: 'Deep Technical Expert',
                    description: 'World-class specialist in a specific technology, published papers, conference speaker'
                },
                {
                    id: 'system_architect',
                    title: 'Principal System Architect',
                    description: 'Design large-scale systems, make critical technical decisions, mentor architects'
                },
                {
                    id: 'startup_founder',
                    title: 'Technical Founder/CTO',
                    description: 'Start your own company, build products from scratch, lead technical vision'
                },
                {
                    id: 'engineering_manager',
                    title: 'Engineering Leadership',
                    description: 'Lead teams, develop talent, balance technical and people management'
                },
                {
                    id: 'research_innovation',
                    title: 'Research & Innovation Lead',
                    description: 'Drive R&D, explore emerging technologies, bridge research and product'
                }
            ]
        },

        {
            id: 'A12',
            type: 'multiple_choice',
            category: 'expertise_development',
            question: "What emerging technology area would you invest time mastering for future career advantage?",
            subtitle: "Consider market trends and your interests",
            options: [
                {
                    id: 'ai_ml_systems',
                    title: 'AI/ML Systems & LLMs',
                    description: 'Large language models, generative AI, ML infrastructure, AI safety'
                },
                {
                    id: 'quantum_computing',
                    title: 'Quantum Computing',
                    description: 'Quantum algorithms, quantum hardware, cryptography'
                },
                {
                    id: 'bioengineering',
                    title: 'Bioengineering & Synthetic Biology',
                    description: 'Gene editing, synthetic biology, biocomputing, neural interfaces'
                },
                {
                    id: 'web3_blockchain',
                    title: 'Web3 & Decentralized Systems',
                    description: 'Blockchain, smart contracts, DeFi, decentralized applications'
                },
                {
                    id: 'edge_iot',
                    title: 'Edge Computing & IoT',
                    description: 'Edge AI, 5G applications, smart cities, industrial IoT'
                }
            ]
        },

        {
            id: 'A13',
            type: 'scale',
            category: 'specialization_vs_breadth',
            question: "Do you prefer to be a specialist with deep expertise or a generalist with broad knowledge?",
            subtitle: "Consider your learning style and career goals",
            scale: {
                min: 1,
                max: 10,
                labels: {
                    1: "Ultra-specialist in one area",
                    3: "Deep specialist with some breadth",
                    5: "Balanced specialist and generalist",
                    7: "Generalist with specialty areas",
                    10: "Pure generalist across many domains"
                },
                descriptions: {
                    1: "You want to be the world expert in one specific technology",
                    3: "You have deep expertise but understand adjacent areas",
                    5: "You balance depth in key areas with broad knowledge",
                    7: "You know many things well with a few deeper areas",
                    10: "You thrive on variety and connecting diverse technologies"
                }
            }
        }
    ]
};

// Function to merge these with existing questions
function mergeQuizQuestions(existingQuestions, additionalQuestions) {
    const merged = {};

    ['beginner', 'intermediate', 'advanced'].forEach(level => {
        merged[level] = [
            ...(existingQuestions[level] || []),
            ...(additionalQuestions[level] || [])
        ];
    });

    return merged;
}

// Export for integration
module.exports = {
    additionalQuizQuestions,
    mergeQuizQuestions
};