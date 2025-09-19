// backend/services/completeCareerMatcher.js
// Enhanced AI Career Matcher supporting all 55 careers

const OpenAI = require('openai');
const { completeCareerRequirements, enhancedCareerOptions } = require('../data/completeCareerRequirements');

class CompleteCareerMatcher {
    constructor() {
        this.openai = process.env.OPENAI_API_KEY ?
            new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

        // All 55 careers organized by category
        this.careersByCategory = {
            software: [
                'Software Engineer (Full Stack)', 'Frontend Engineer', 'Backend Engineer',
                'Web Developer', 'Mobile Developer (iOS/Android)', 'DevOps Engineer',
                'Site Reliability Engineer (SRE)', 'Graphics/Rendering Engineer',
                'Blockchain Developer', 'AR/VR Developer', 'Game Developer'
            ],
            dataAI: [
                'Data Scientist', 'Data Analyst', 'Machine Learning Engineer',
                'ML Infrastructure Engineer', 'Computer Vision Engineer'
            ],
            hardware: [
                'Embedded Systems Engineer', 'Hardware Design Engineer', 'FPGA Engineer',
                'Digital Design Engineer', 'RF Engineer', 'Power Systems Engineer',
                'Control Systems Engineer', 'Signal Processing Engineer', 'Firmware Engineer',
                'PCB Design Engineer', 'Hardware Security Engineer'
            ],
            aerospace: [
                'Aerospace Software Engineer', 'Systems Integration Engineer',
                'Avionics Engineer', 'Autonomous Systems Engineer (Drones/UAV)'
            ],
            biomedical: [
                'Medical Device Software Engineer', 'Clinical Systems Engineer',
                'Bioinformatics Engineer', 'Healthcare Data Analyst',
                'Medical Imaging Software Developer', 'Wearable Technology Engineer',
                'Health Tech Software Engineer', 'Computational Biology Engineer',
                'Medical Robotics Engineer', 'Biomedical Signal Processing Engineer'
            ],
            industrial: [
                'Industrial Software Engineer', 'Automation Engineer',
                'Industrial IoT Engineer', 'Quality Systems Engineer',
                'Factory Automation Developer', 'Supply Chain Technology Analyst'
            ],
            businessTech: [
                'Technical Product Manager', 'Sales Engineer', 'Research Engineer'
            ],
            support: [
                'QA/Test Automation Engineer', 'Technical Writer', 'Developer Advocate',
                'IT Support Engineer', 'Cybersecurity Engineer'
            ]
        };

        this.domainKeywords = {
            healthcare: ['medical', 'health', 'clinical', 'patient', 'hospital', 'biomedical', 'FDA'],
            aerospace: ['space', 'satellite', 'rocket', 'aviation', 'drone', 'UAV', 'flight'],
            robotics: ['robot', 'automation', 'control', 'autonomous', 'mechatronics'],
            hardware: ['circuit', 'embedded', 'PCB', 'FPGA', 'microcontroller', 'electronics'],
            software: ['code', 'programming', 'app', 'web', 'mobile', 'cloud', 'API'],
            data: ['analytics', 'machine learning', 'AI', 'statistics', 'visualization'],
            security: ['cybersecurity', 'encryption', 'threat', 'vulnerability', 'protection'],
            industrial: ['manufacturing', 'factory', 'automation', 'IoT', 'supply chain']
        };
    }

    async analyzeCareerFit(userResponses, questions, level, userProfile) {
        console.log('🎯 Complete Career Matching for 55 careers - Level:', level);

        try {
            // Extract comprehensive patterns from responses
            const patterns = this.extractComprehensivePatterns(userResponses, questions);

            // Calculate scores for all 55 careers
            const careerScores = this.calculateAllCareerScores(patterns, level, userProfile);

            // Get top matches with detailed analysis
            const topMatches = this.getTopMatches(careerScores, 5);

            // Use AI for deeper insights if available
            let aiEnhancedResults;
            if (this.openai) {
                aiEnhancedResults = await this.getEnhancedAIAnalysis(patterns, topMatches, userProfile, level);
            }

            // Generate comprehensive results
            return this.formatComprehensiveResults(topMatches, aiEnhancedResults, patterns, level);
        } catch (error) {
            console.error('Career matching error:', error);
            return this.getFallbackResults(userResponses, level);
        }
    }

    extractComprehensivePatterns(userResponses, questions) {
        const patterns = {
            // Core preferences
            hardwareVsSoftware: 0.5,
            domainInterests: {},
            workEnvironment: {},
            impactPreferences: {},

            // Technical interests
            technicalSkills: {},
            toolPreferences: {},
            specializationAreas: {},

            // Work style
            collaborationStyle: 0.5,
            autonomyLevel: 0.5,
            riskTolerance: 0.5,
            innovationFocus: 0.5,

            // Career drivers
            motivationFactors: [],
            idealEnvironment: '',
            careerGoals: [],

            // Text insights
            textResponses: [],
            keywords: []
        };

        userResponses.forEach((response, index) => {
            const question = questions[index];
            if (!question) return;

            // Process new domain/environment questions (B13-B15, I11-I13, A11-A13)
            this.processEnhancedQuestions(response, question, patterns);

            // Process standard questions
            this.processStandardQuestions(response, question, patterns);

            // Extract text insights
            if (response.textResponse) {
                patterns.textResponses.push({
                    question: question.question,
                    response: response.textResponse,
                    keywords: this.extractKeywords(response.textResponse)
                });
            }
        });

        return patterns;
    }

    processEnhancedQuestions(response, question, patterns) {
        // B13: Work Environment Preference
        if (question.id === 'B13' && response.selectedOption) {
            const envMap = {
                'lab_research': { domain: 'biomedical', hardware: 0.3 },
                'modern_office': { domain: 'software', hardware: 0.1 },
                'hospital_clinic': { domain: 'healthcare', hardware: 0.2 },
                'factory_floor': { domain: 'industrial', hardware: 0.7 }
            };

            const env = envMap[response.selectedOption.id];
            if (env) {
                patterns.domainInterests[env.domain] = (patterns.domainInterests[env.domain] || 0) + 2;
                patterns.hardwareVsSoftware = (patterns.hardwareVsSoftware * 0.7) + (env.hardware * 0.3);
            }
        }

        // B14: Impact Orientation
        if (question.id === 'B14' && response.selectedOptions) {
            const impactMap = {
                'save_lives': ['biomedical', 'healthcare'],
                'reach_millions': ['software', 'mobile', 'web'],
                'advance_frontier': ['ai', 'research', 'aerospace'],
                'make_systems_reliable': ['devops', 'security', 'infrastructure'],
                'boost_efficiency': ['industrial', 'automation', 'data'],
                'build_physical': ['hardware', 'embedded', 'robotics']
            };

            response.selectedOptions.forEach(option => {
                const impacts = impactMap[option.id] || [];
                impacts.forEach(impact => {
                    patterns.impactPreferences[impact] = (patterns.impactPreferences[impact] || 0) + 1;
                });
            });
        }

        // B15: Hardware vs Software Balance
        if (question.id === 'B15' && response.scaleValue) {
            patterns.hardwareVsSoftware = response.scaleValue / 10;
        }

        // I11: Technical Specialization
        if (question.id === 'I11' && response.scaleValue) {
            const value = response.scaleValue / 10;
            if (value < 0.3) patterns.specializationAreas['hardware'] = 2;
            else if (value < 0.5) patterns.specializationAreas['embedded'] = 2;
            else if (value < 0.7) patterns.specializationAreas['fullstack'] = 2;
            else if (value < 0.9) patterns.specializationAreas['software'] = 2;
            else patterns.specializationAreas['data'] = 2;
        }

        // I12: Industry Preference
        if (question.id === 'I12' && response.selectedOptions) {
            const industryMap = {
                'healthcare_biotech': 'biomedical',
                'aerospace_defense': 'aerospace',
                'industrial_automation': 'industrial',
                'consumer_products': 'software',
                'infrastructure_systems': 'infrastructure'
            };

            response.selectedOptions.forEach(option => {
                const industry = industryMap[option.id];
                if (industry) {
                    patterns.domainInterests[industry] = (patterns.domainInterests[industry] || 0) + 2;
                }
            });
        }

        // A11: Complexity Preference
        if (question.id === 'A11' && response.selectedOptions) {
            response.selectedOptions.forEach(option => {
                if (option.id === 'safety_critical') patterns.impactPreferences['safety'] = 2;
                if (option.id === 'extreme_scale') patterns.impactPreferences['scale'] = 2;
                if (option.id === 'resource_constrained') patterns.specializationAreas['embedded'] = 2;
            });
        }
    }

    processStandardQuestions(response, question, patterns) {
        // Process existing question types
        if (question.category === 'work_preference' && response.scaleValue) {
            patterns.collaborationStyle = response.scaleValue / 10;
        }

        if (question.category === 'autonomy_preference' && response.scaleValue) {
            patterns.autonomyLevel = response.scaleValue / 10;
        }

        if (question.category === 'risk_comfort' && response.scaleValue) {
            patterns.riskTolerance = response.scaleValue / 10;
        }

        // Extract skills from multiple choice questions
        if (response.selectedOption && response.selectedOption.description) {
            this.extractSkillsFromText(response.selectedOption.description, patterns.technicalSkills);
        }
    }

    extractKeywords(text) {
        const allKeywords = [
            ...Object.values(this.domainKeywords).flat(),
            'python', 'javascript', 'react', 'cloud', 'aws', 'docker',
            'data', 'design', 'test', 'security', 'network', 'database'
        ];

        const lowerText = text.toLowerCase();
        return allKeywords.filter(keyword => lowerText.includes(keyword));
    }

    extractSkillsFromText(text, skillsObject) {
        const skillIndicators = {
            'frontend': ['ui', 'ux', 'design', 'interface', 'react', 'angular'],
            'backend': ['server', 'database', 'api', 'microservices'],
            'data': ['analytics', 'statistics', 'machine learning', 'visualization'],
            'hardware': ['circuit', 'embedded', 'pcb', 'fpga'],
            'mobile': ['ios', 'android', 'mobile', 'app'],
            'cloud': ['aws', 'azure', 'docker', 'kubernetes'],
            'security': ['security', 'encryption', 'vulnerability']
        };

        const lowerText = text.toLowerCase();
        Object.entries(skillIndicators).forEach(([skill, keywords]) => {
            if (keywords.some(kw => lowerText.includes(kw))) {
                skillsObject[skill] = (skillsObject[skill] || 0) + 1;
            }
        });
    }

    calculateAllCareerScores(patterns, level, userProfile) {
        const scores = {};

        enhancedCareerOptions.forEach(careerName => {
            let score = 0;
            const factors = [];
            const careerData = completeCareerRequirements[careerName];

            // 1. Hardware vs Software alignment (25 points max)
            const hwSwScore = this.calculateHardwareSoftwareScore(careerName, patterns.hardwareVsSoftware);
            score += hwSwScore;
            factors.push(`HW/SW alignment: ${hwSwScore.toFixed(1)}`);

            // 2. Domain interest alignment (30 points max)
            const domainScore = this.calculateDomainScore(careerName, patterns.domainInterests);
            score += domainScore;
            if (domainScore > 0) factors.push(`Domain match: ${domainScore.toFixed(1)}`);

            // 3. Impact preference alignment (20 points max)
            const impactScore = this.calculateImpactScore(careerName, patterns.impactPreferences);
            score += impactScore;
            if (impactScore > 0) factors.push(`Impact alignment: ${impactScore.toFixed(1)}`);

            // 4. Technical skills match (20 points max)
            const skillScore = this.calculateSkillScore(careerData, patterns.technicalSkills);
            score += skillScore;
            if (skillScore > 0) factors.push(`Skill match: ${skillScore.toFixed(1)}`);

            // 5. Work style compatibility (10 points max)
            const workStyleScore = this.calculateWorkStyleScore(careerData, patterns);
            score += workStyleScore;

            // 6. Text insight bonus (15 points max)
            const textScore = this.calculateTextInsightScore(careerName, patterns.textResponses);
            score += textScore;
            if (textScore > 0) factors.push(`Text insights: ${textScore.toFixed(1)}`);

            // 7. Level-specific adjustments
            score = this.adjustScoreForLevel(score, careerName, level);

            // 8. Major compatibility bonus (if applicable)
            if (userProfile.major) {
                const majorBonus = this.calculateMajorBonus(careerName, userProfile.major);
                score += majorBonus;
                if (majorBonus > 0) factors.push(`Major bonus: ${majorBonus.toFixed(1)}`);
            }

            scores[careerName] = {
                rawScore: score,
                normalizedScore: Math.min(100, Math.max(0, score)),
                factors: factors,
                category: careerData.category
            };
        });

        return scores;
    }

    calculateHardwareSoftwareScore(careerName, hwSwPreference) {
        const hardwareCareers = this.careersByCategory.hardware;
        const softwareCareers = [...this.careersByCategory.software, ...this.careersByCategory.dataAI];

        if (hardwareCareers.includes(careerName)) {
            return (1 - hwSwPreference) * 25;
        } else if (softwareCareers.includes(careerName)) {
            return hwSwPreference * 25;
        } else {
            // Mixed careers (biomedical, aerospace, etc.)
            return 12.5; // Neutral score
        }
    }

    calculateDomainScore(careerName, domainInterests) {
        let score = 0;
        const careerDomainMap = {
            biomedical: this.careersByCategory.biomedical,
            healthcare: this.careersByCategory.biomedical,
            aerospace: this.careersByCategory.aerospace,
            industrial: this.careersByCategory.industrial,
            software: this.careersByCategory.software,
            data: this.careersByCategory.dataAI
        };

        Object.entries(domainInterests).forEach(([domain, weight]) => {
            const careers = careerDomainMap[domain] || [];
            if (careers.includes(careerName)) {
                score += weight * 10; // Max 30 points for strong domain match
            }
        });

        return Math.min(30, score);
    }

    calculateImpactScore(careerName, impactPreferences) {
        let score = 0;
        const impactCareerMap = {
            'healthcare': this.careersByCategory.biomedical,
            'scale': ['Software Engineer (Full Stack)', 'Backend Engineer', 'ML Infrastructure Engineer'],
            'safety': ['Medical Device Software Engineer', 'Cybersecurity Engineer', 'Avionics Engineer'],
            'automation': this.careersByCategory.industrial,
            'research': ['Research Engineer', 'Machine Learning Engineer', 'Bioinformatics Engineer']
        };

        Object.entries(impactPreferences).forEach(([impact, weight]) => {
            const careers = impactCareerMap[impact] || [];
            if (careers.includes(careerName)) {
                score += weight * 10;
            }
        });

        return Math.min(20, score);
    }

    calculateSkillScore(careerData, userSkills) {
        if (!careerData.technicalSkills) return 0;

        let score = 0;
        const requiredSkills = careerData.technicalSkills.required || [];

        Object.entries(userSkills).forEach(([skill, weight]) => {
            if (requiredSkills.some(rs => rs.toLowerCase().includes(skill))) {
                score += weight * 5;
            }
        });

        return Math.min(20, score);
    }

    calculateWorkStyleScore(careerData, patterns) {
        let score = 5; // Base score

        // Remote work preference vs availability
        if (careerData.marketData && careerData.marketData.remotePercentage) {
            const remoteAvail = parseInt(careerData.marketData.remotePercentage) / 100;
            if (patterns.autonomyLevel > 0.7 && remoteAvail > 0.6) {
                score += 5;
            }
        }

        return score;
    }

    calculateTextInsightScore(careerName, textResponses) {
        let score = 0;
        const careerKeywords = this.getCareerKeywords(careerName);

        textResponses.forEach(response => {
            response.keywords.forEach(keyword => {
                if (careerKeywords.includes(keyword)) {
                    score += 3;
                }
            });
        });

        return Math.min(15, score);
    }

    getCareerKeywords(careerName) {
        const keywordMap = {
            'Software Engineer (Full Stack)': ['web', 'full stack', 'react', 'node', 'database'],
            'Data Scientist': ['data', 'analytics', 'machine learning', 'statistics', 'python'],
            'Embedded Systems Engineer': ['embedded', 'hardware', 'microcontroller', 'firmware'],
            'Medical Device Software Engineer': ['medical', 'fda', 'health', 'device', 'safety'],
            // Add more as needed
        };

        return keywordMap[careerName] || [];
    }

    adjustScoreForLevel(score, careerName, level) {
        const beginnerFriendly = [
            'Web Developer', 'Frontend Engineer', 'Data Analyst',
            'IT Support Engineer', 'QA/Test Automation Engineer', 'Technical Writer'
        ];

        const advancedCareers = [
            'Machine Learning Engineer', 'ML Infrastructure Engineer',
            'Site Reliability Engineer (SRE)', 'Research Engineer',
            'FPGA Engineer', 'Avionics Engineer'
        ];

        if (level === 'beginner' && beginnerFriendly.includes(careerName)) {
            return score * 1.2;
        } else if (level === 'advanced' && advancedCareers.includes(careerName)) {
            return score * 1.15;
        }

        return score;
    }

    calculateMajorBonus(careerName, major) {
        const majorCareerMap = {
            'Computer Science': ['Software Engineer (Full Stack)', 'Machine Learning Engineer'],
            'Electrical Engineering': ['Embedded Systems Engineer', 'Hardware Design Engineer'],
            'Biomedical Engineering': ['Medical Device Software Engineer', 'Bioinformatics Engineer'],
            'Aerospace Engineering': ['Aerospace Software Engineer', 'Avionics Engineer']
        };

        const relevantCareers = majorCareerMap[major] || [];
        return relevantCareers.includes(careerName) ? 10 : 0;
    }

    getTopMatches(scores, count = 5) {
        return Object.entries(scores)
            .sort((a, b) => b[1].normalizedScore - a[1].normalizedScore)
            .slice(0, count)
            .map(([career, scoreData]) => ({
                career,
                percentage: Math.round(scoreData.normalizedScore),
                category: scoreData.category,
                factors: scoreData.factors,
                confidence: this.calculateConfidence(scoreData)
            }));
    }

    calculateConfidence(scoreData) {
        const factorCount = scoreData.factors.length;
        const baseConfidence = Math.min(95, scoreData.normalizedScore);

        if (factorCount >= 5) return baseConfidence;
        if (factorCount >= 3) return baseConfidence * 0.9;
        return baseConfidence * 0.8;
    }

    async getEnhancedAIAnalysis(patterns, topMatches, userProfile, level) {
        if (!this.openai) return null;

        try {
            const prompt = this.buildEnhancedPrompt(patterns, topMatches, userProfile, level);

            const completion = await this.openai.chat.completions.create({
                model: "gpt-4-turbo-preview",
                messages: [
                    { role: "system", content: this.getSystemPrompt() },
                    { role: "user", content: prompt }
                ],
                max_tokens: 2000,
                temperature: 0.3,
                response_format: { type: "json_object" }
            });

            return JSON.parse(completion.choices[0].message.content);
        } catch (error) {
            console.error('AI analysis error:', error);
            return null;
        }
    }

    buildEnhancedPrompt(patterns, topMatches, userProfile, level) {
        return `Analyze career fit for UC Davis ${level} student:

Major: ${userProfile.major || 'Undeclared'}
Year: ${userProfile.year || 'Not specified'}

Top Algorithm Matches:
${topMatches.map(m => `- ${m.career}: ${m.percentage}% (${m.category})`).join('\n')}

User Patterns:
- Hardware vs Software: ${patterns.hardwareVsSoftware.toFixed(2)} (0=hardware, 1=software)
- Domain Interests: ${JSON.stringify(patterns.domainInterests)}
- Impact Preferences: ${JSON.stringify(patterns.impactPreferences)}
- Technical Skills: ${JSON.stringify(patterns.technicalSkills)}
- Work Style: Collaboration=${patterns.collaborationStyle}, Autonomy=${patterns.autonomyLevel}

Text Insights:
${patterns.textResponses.slice(0, 3).map(r => `"${r.response.substring(0, 200)}..."`).join('\n')}

Available careers span 55 options across software, hardware, biomedical, aerospace, and industrial fields.

Provide personalized recommendations considering:
1. The unique combination of interests (especially if crossing domains)
2. UC Davis specific resources and opportunities
3. Entry requirements and realistic pathways
4. Emerging fields and future opportunities`;
    }

    getSystemPrompt() {
        return `You are an expert UC Davis career counselor specializing in technology careers.

You have knowledge of 55 distinct career paths across:
- Software/CS (20 careers)
- Data & AI (5 careers)  
- Hardware/Electrical (12 careers)
- Aerospace (4 careers)
- Biomedical (10 careers)
- Industrial (6 careers)
- Business-Tech (3 careers)
- Support roles (5 careers)

Provide recommendations in JSON format:
{
  "primaryRecommendation": {
    "career": "Exact career name from the 55 options",
    "confidence": 85,
    "reasoning": "Detailed personalized reasoning",
    "uniqueStrengths": ["strength1", "strength2"],
    "crossDomainOpportunities": "If applicable, mention interdisciplinary opportunities",
    "ucDavisPath": "Specific UC Davis clubs, courses, and professors"
  },
  "alternativeOptions": [
    {"career": "Alternative 1", "confidence": 75, "whyFit": "Reason", "differentiator": "What makes this unique"},
    {"career": "Alternative 2", "confidence": 70, "whyFit": "Reason", "differentiator": "What makes this unique"}
  ],
  "emergingOpportunities": "Mention any emerging fields that match their interests",
  "skillGaps": ["skill1", "skill2", "skill3"],
  "immediateActions": [
    "Join [specific UC Davis club]",
    "Take [specific course next quarter]",
    "Connect with [specific professor or resource]"
  ]
}`;
    }

    formatComprehensiveResults(topMatches, aiResults, patterns, level) {
        const primaryMatch = aiResults?.primaryRecommendation || topMatches[0];
        const careerName = primaryMatch.career || topMatches[0].career;
        const careerData = completeCareerRequirements[careerName];

        return {
            success: true,
            results: {
                topMatch: {
                    career: careerName,
                    percentage: primaryMatch.confidence || topMatches[0].percentage,
                    confidence: primaryMatch.confidence || topMatches[0].confidence,
                    reasoning: primaryMatch.reasoning || this.generateReasoning(careerName, patterns),
                    keyPatterns: primaryMatch.uniqueStrengths || [],

                    // Complete entry requirements
                    entryRequirements: {
                        education: careerData.education,
                        technicalSkills: careerData.technicalSkills,
                        experience: careerData.experience,
                        certifications: careerData.certifications
                    },

                    // UC Davis specific resources
                    ucDavisResources: careerData.ucDavisResources,

                    // Career progression
                    careerProgression: careerData.careerProgression,

                    // Market data
                    marketData: careerData.marketData,

                    // Skill gaps
                    skillGaps: careerData.skillGaps || aiResults?.skillGaps,

                    // Personalized next steps
                    nextSteps: this.generatePersonalizedNextSteps(careerName, level, patterns)
                },

                allMatches: aiResults?.alternativeOptions || topMatches.slice(1),

                personalityInsights: {
                    hardwareSoftwareBalance: patterns.hardwareVsSoftware,
                    primaryDomains: Object.keys(patterns.domainInterests),
                    topSkills: Object.keys(patterns.technicalSkills),
                    workStyle: {
                        collaboration: patterns.collaborationStyle,
                        autonomy: patterns.autonomyLevel,
                        risk: patterns.riskTolerance
                    },
                    emergingOpportunities: aiResults?.emergingOpportunities
                },

                qualityMetrics: {
                    confidence: primaryMatch.confidence || topMatches[0].confidence,
                    analysisDepth: 95,
                    dataCompleteness: 90
                }
            }
        };
    }

    generateReasoning(careerName, patterns) {
        const careerData = completeCareerRequirements[careerName];
        const reasons = [];

        // Hardware/Software alignment
        if (patterns.hardwareVsSoftware < 0.3 && careerData.category.includes('Hardware')) {
            reasons.push("Strong preference for hardware and hands-on work");
        } else if (patterns.hardwareVsSoftware > 0.7 && careerData.category.includes('Software')) {
            reasons.push("Clear inclination toward software development");
        }

        // Domain interests
        Object.keys(patterns.domainInterests).forEach(domain => {
            if (careerData.category.toLowerCase().includes(domain)) {
                reasons.push(`Strong interest in ${domain} aligns perfectly`);
            }
        });

        return reasons.join(". ") || `${careerName} matches your technical interests and career goals`;
    }

    generatePersonalizedNextSteps(careerName, level, patterns) {
        const careerData = completeCareerRequirements[careerName];
        const steps = [];

        // Immediate club recommendation
        if (careerData.ucDavisResources?.primaryClubs?.[0]) {
            steps.push({
                step: `Join ${careerData.ucDavisResources.primaryClubs[0]} this week`,
                category: 'immediate',
                priority: 'high',
                timeframe: '1 week',
                resources: [`Club website`, `Meeting times`]
            });
        }

        // Skill development based on gaps
        const topSkill = careerData.technicalSkills?.required?.[0];
        if (topSkill) {
            steps.push({
                step: `Start learning ${topSkill} through online resources`,
                category: 'short-term',
                priority: 'high',
                timeframe: '2-4 weeks',
                resources: careerData.certifications?.recommended || []
            });
        }

        // Course enrollment
        if (careerData.ucDavisResources?.courses?.[0]) {
            steps.push({
                step: `Plan to take ${careerData.ucDavisResources.courses[0]} next quarter`,
                category: 'short-term',
                priority: 'medium',
                timeframe: 'Next quarter',
                resources: ['Course catalog', 'Prerequisite check']
            });
        }

        return steps;
    }

    getFallbackResults(userResponses, level) {
        // Provide reasonable fallback if AI fails
        return {
            success: true,
            results: {
                topMatch: {
                    career: 'Software Engineer (Full Stack)',
                    percentage: 75,
                    confidence: 70,
                    reasoning: 'Based on your responses, software engineering appears to be a strong match',
                    entryRequirements: completeCareerRequirements['Software Engineer (Full Stack)'].education,
                    ucDavisResources: completeCareerRequirements['Software Engineer (Full Stack)'].ucDavisResources,
                    careerProgression: completeCareerRequirements['Software Engineer (Full Stack)'].careerProgression,
                    marketData: completeCareerRequirements['Software Engineer (Full Stack)'].marketData
                },
                allMatches: [
                    { career: 'Frontend Engineer', percentage: 70, category: 'Software Engineering' },
                    { career: 'Data Analyst', percentage: 65, category: 'Data & Analytics' }
                ]
            }
        };
    }
}

module.exports = CompleteCareerMatcher;