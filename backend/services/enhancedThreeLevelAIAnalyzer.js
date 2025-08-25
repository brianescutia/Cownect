// Enhanced AI Career Analyzer for 3-Level Quiz System
// Save as: backend/services/enhancedThreeLevelAIAnalyzer.js

const OpenAI = require('openai');
const { enhancedCareerOptions } = require('../data/enhancedThreeLevelQuizData');

class EnhancedThreeLevelAIAnalyzer {
    constructor() {
        if (!process.env.OPENAI_API_KEY) {
            console.warn('⚠️ OpenAI API key not found. AI analysis will be disabled.');
            this.openai = null;
        } else {
            this.openai = new OpenAI({
                apiKey: process.env.OPENAI_API_KEY
            });
        }
    }

    // Main analysis function - handles all question types and levels
    async analyzeCareerFit(userResponses, questions, level, userProfile = {}) {
        try {
            console.log(`🤖 Starting enhanced AI career analysis for ${level} level...`);

            if (!this.openai) {
                return this.getFallbackAnalysis(level);
            }

            // Build comprehensive analysis prompt
            const analysisPrompt = this.buildEnhancedPrompt(userResponses, questions, level, userProfile);

            console.log('🧠 Sending to GPT-4 for deep analysis...');

            const completion = await this.openai.chat.completions.create({
                model: "gpt-4-turbo-preview",
                messages: [
                    {
                        role: "system",
                        content: this.getEnhancedSystemPrompt(level)
                    },
                    {
                        role: "user",
                        content: analysisPrompt
                    }
                ],
                max_tokens: 3000,
                temperature: 0.3, // Lower temperature for more consistent analysis
                response_format: { type: "json_object" }
            });

            const aiResponse = completion.choices[0].message.content;
            const analysis = JSON.parse(aiResponse);

            console.log('✅ Enhanced AI analysis complete');
            return this.formatEnhancedResults(analysis, level, userProfile);

        } catch (error) {
            console.error('💥 Enhanced AI analysis error:', error);
            return this.getFallbackAnalysis(level);
        }
    }

    getEnhancedSystemPrompt(level) {
        const levelContext = {
            beginner: {
                experience: "new to tech or exploring tech careers",
                focus: "discovering natural aptitudes and interests",
                recommendations: "foundational courses, introductory experiences, and exploration opportunities"
            },
            intermediate: {
                experience: "some tech exposure through courses or projects",
                focus: "finding their ideal specialization within tech",
                recommendations: "targeted skill development, specific clubs, and relevant internships"
            },
            advanced: {
                experience: "significant tech experience and leadership roles",
                focus: "optimizing their career trajectory and developing leadership skills",
                recommendations: "advanced opportunities, mentorship, and strategic career moves"
            }
        };

        const context = levelContext[level] || levelContext.intermediate;

        return `You are an expert career counselor and occupational psychologist specializing in tech careers for UC Davis students. You excel at analyzing diverse types of responses to understand someone's deep career preferences.

STUDENT LEVEL: ${level.toUpperCase()}
Student Experience: ${context.experience}
Analysis Focus: ${context.focus}
Recommendation Type: ${context.recommendations}

Your task is to analyze responses from a comprehensive career assessment and provide personalized career recommendations appropriate for their experience level.

ASSESSMENT TYPES YOU'LL SEE:
- Visual choices (work environments, design philosophies, architectural approaches)
- Scale responses (technical comfort, risk tolerance, urgency vs. thoroughness)
- Scenario responses (problem-solving approaches, leadership styles, crisis management)
- Short text responses (personal experiences, decision-making approaches)
- Rankings (values, priorities, team coordination strategies)
- Multiple choice (approaches, preferences, methods)

CAREER OPTIONS TO CONSIDER:
${enhancedCareerOptions.join(', ')}

ANALYSIS APPROACH:
1. Look for patterns across ALL response types (not just individual answers)
2. Pay special attention to emotional language and authenticity in text responses
3. Consider contradictions or nuances - people are complex
4. Match personality patterns to career environments, not just technical skills
5. Provide level-appropriate guidance (${context.recommendations})
6. Consider UC Davis context and specific campus opportunities

RESPONSE FORMAT:
Respond with a JSON object containing:
{
  "primaryRecommendation": {
    "career": "Specific career title from the list (or closely related)",
    "confidence": 85,
    "reasoning": "2-3 sentences explaining why this fits their patterns",
    "keyPatterns": ["pattern1", "pattern2", "pattern3"],
    "levelAppropriate": true
  },
  "alternativeOptions": [
    {
      "career": "Alternative career",
      "confidence": 75,
      "reasoning": "Why this is also a good fit"
    },
    {
      "career": "Another alternative", 
      "confidence": 68,
      "reasoning": "Third option rationale"
    }
  ],
  "personalityInsights": {
    "workStyle": "Brief description of their preferred work style",
    "motivation": "What drives them professionally",
    "environment": "Ideal work environment",
    "challenges": "Potential career challenges to be aware of",
    "strengths": "Key strengths they should leverage"
  },
  "developmentAreas": [
    "Specific skill or area to develop",
    "Another growth area",
    "Third development priority"
  ],
  "levelSpecificGuidance": {
    "immediate": "What they should do in the next 1-3 months",
    "shortTerm": "Goals for the next 6-12 months", 
    "longTerm": "Strategic direction for 2+ years"
  },
  "ucDavisResources": [
    "Specific UC Davis course recommendations",
    "Relevant student clubs and organizations",
    "Campus resources and opportunities"
  ],
  "authenticity": {
    "score": 92,
    "notes": "Assessment of response consistency and genuineness"
  }
}`;
    }

    buildEnhancedPrompt(userResponses, questions, level, userProfile) {
        let prompt = `CAREER ASSESSMENT ANALYSIS REQUEST

USER PROFILE:
- University: UC Davis
- Level: ${level} (${this.getLevelDescription(level)})
- Major: ${userProfile.major || 'Not specified'}
- Year: ${userProfile.year || 'Not specified'}
- Experience Level: ${level}

DETAILED RESPONSE ANALYSIS:

`;

        userResponses.forEach((response, index) => {
            const question = questions[index];
            if (!question) return;

            prompt += `\nQUESTION ${index + 1}: ${question.question}
Type: ${question.type}
Category: ${question.category}

USER RESPONSE:
`;

            // Handle different response types
            switch (question.type) {
                case 'visual_choice':
                case 'multiple_choice':
                    if (response.selectedOption) {
                        prompt += `Selected: ${response.selectedOption.title}\n`;
                        prompt += `Description: ${response.selectedOption.description}\n`;
                    }
                    break;

                case 'scale':
                    if (response.scaleValue) {
                        prompt += `Scale Value: ${response.scaleValue}/10\n`;
                        const scaleLabel = question.scale.labels[response.scaleValue];
                        if (scaleLabel) {
                            prompt += `Meaning: ${scaleLabel}\n`;
                        }
                    }
                    break;

                case 'scenario':
                    if (response.selectedOption) {
                        prompt += `Chosen Approach: ${response.selectedOption.title}\n`;
                        prompt += `Reasoning: ${response.selectedOption.description}\n`;
                    }
                    break;

                case 'short_response':
                    if (response.textResponse) {
                        prompt += `Written Response: "${response.textResponse}"\n`;
                    }
                    break;

                case 'ranking':
                    if (response.ranking) {
                        prompt += `Ranking (1st to last preference):\n`;
                        response.ranking.forEach((itemIndex, rank) => {
                            const item = question.items[itemIndex];
                            prompt += `${rank + 1}. ${item.text}: ${item.description}\n`;
                        });
                    }
                    break;
            }

            prompt += `Time Taken: ${response.timeTaken || 'Not recorded'} seconds\n`;
        });

        prompt += `

ANALYSIS INSTRUCTIONS:
1. Analyze the psychological patterns across ALL response types
2. Pay special attention to the written responses - they reveal authentic interests and experiences
3. Look for consistency between stated preferences and actual behavioral choices in scenarios
4. Consider their scale responses for technical comfort, risk tolerance, and decision-making style
5. Match them to careers that fit their natural working style and personality
6. Provide ${level}-appropriate guidance that matches their experience level
7. Be specific about UC Davis opportunities and resources
8. Consider both immediate next steps and longer-term career development

For ${level} level students, focus on ${this.getLevelFocus(level)}.`;

        return prompt;
    }

    getLevelDescription(level) {
        const descriptions = {
            beginner: "new to tech, exploring possibilities",
            intermediate: "some tech experience, seeking specialization",
            advanced: "significant experience, optimizing career trajectory"
        };
        return descriptions[level] || descriptions.intermediate;
    }

    getLevelFocus(level) {
        const focuses = {
            beginner: "discovery, exploration, and building foundational understanding",
            intermediate: "specialization, skill development, and targeted experiences",
            advanced: "leadership development, strategic career planning, and advanced opportunities"
        };
        return focuses[level] || focuses.intermediate;
    }

    formatEnhancedResults(analysis, level, userProfile) {
        return {
            success: true,
            analysisType: `Enhanced AI Career Analysis - ${level.charAt(0).toUpperCase() + level.slice(1)} Level`,
            results: {
                topMatch: {
                    career: analysis.primaryRecommendation.career,
                    percentage: analysis.primaryRecommendation.confidence,
                    confidence: analysis.primaryRecommendation.confidence,
                    reasoning: analysis.primaryRecommendation.reasoning,
                    keyPatterns: analysis.primaryRecommendation.keyPatterns,
                    nextSteps: this.formatNextSteps(analysis.levelSpecificGuidance),
                    marketData: this.getMarketData(analysis.primaryRecommendation.career),
                    ucDavisResources: analysis.ucDavisResources
                },
                allMatches: [
                    {
                        career: analysis.primaryRecommendation.career,
                        category: this.getCareerCategory(analysis.primaryRecommendation.career),
                        percentage: analysis.primaryRecommendation.confidence,
                        confidence: analysis.primaryRecommendation.confidence
                    },
                    ...analysis.alternativeOptions.map(alt => ({
                        career: alt.career,
                        category: this.getCareerCategory(alt.career),
                        percentage: alt.confidence,
                        confidence: alt.confidence
                    }))
                ],
                personalityInsights: analysis.personalityInsights,
                developmentAreas: analysis.developmentAreas,
                levelSpecificGuidance: analysis.levelSpecificGuidance,
                aiInsights: {
                    workStyle: analysis.personalityInsights.workStyle,
                    motivation: analysis.personalityInsights.motivation,
                    environment: analysis.personalityInsights.environment,
                    challenges: analysis.personalityInsights.challenges,
                    strengths: analysis.personalityInsights.strengths,
                    fullAnalysis: analysis.primaryRecommendation.reasoning
                },
                qualityMetrics: {
                    authenticity: analysis.authenticity?.score || 90,
                    confidence: analysis.primaryRecommendation.confidence,
                    aiPowered: true,
                    analysisQuality: 95,
                    level: level,
                    responsePatterns: analysis.primaryRecommendation.keyPatterns
                }
            },
            timestamp: new Date().toISOString()
        };
    }

    formatNextSteps(levelGuidance) {
        if (!levelGuidance) return [];

        const steps = [];
        if (levelGuidance.immediate) steps.push(`Immediate: ${levelGuidance.immediate}`);
        if (levelGuidance.shortTerm) steps.push(`Short-term: ${levelGuidance.shortTerm}`);
        if (levelGuidance.longTerm) steps.push(`Long-term: ${levelGuidance.longTerm}`);

        return steps;
    }

    getCareerCategory(careerName) {
        const categoryMap = {
            'Software Engineering': 'Engineering',
            'Frontend': 'Engineering',
            'Backend': 'Engineering',
            'Full-Stack': 'Engineering',
            'Mobile Development': 'Engineering',
            'DevOps': 'Engineering',
            'Data Science': 'Data & Analytics',
            'Machine Learning': 'AI & ML',
            'UX Design': 'Design',
            'UI Design': 'Design',
            'Product Management': 'Product',
            'Product Design': 'Design',
            'Cybersecurity': 'Security',
            'Technical Writing': 'Communication',
            'Developer Relations': 'Community',
            'Sales Engineering': 'Business',
            'Startup Founder': 'Entrepreneurship'
        };

        // Find matching category
        for (const [keyword, category] of Object.entries(categoryMap)) {
            if (careerName.toLowerCase().includes(keyword.toLowerCase())) {
                return category;
            }
        }
        return 'Technology';
    }

    getMarketData(careerName) {
        // Enhanced market data mapping
        const marketData = {
            'Software Engineering': {
                avgSalary: '$95k - $180k',
                jobGrowth: '+22% (2022-2032)',
                demand: 'Very High',
                workLifeBalance: '7.5/10',
                remoteOpportunities: '95%'
            },
            'Data Science': {
                avgSalary: '$100k - $200k',
                jobGrowth: '+35% (2022-2032)',
                demand: 'Very High',
                workLifeBalance: '7.8/10',
                remoteOpportunities: '90%'
            },
            'UX Design': {
                avgSalary: '$85k - $150k',
                jobGrowth: '+13% (2022-2032)',
                demand: 'High',
                workLifeBalance: '7.2/10',
                remoteOpportunities: '80%'
            },
            'Product Management': {
                avgSalary: '$120k - $250k',
                jobGrowth: '+19% (2022-2032)',
                demand: 'Very High',
                workLifeBalance: '6.8/10',
                remoteOpportunities: '75%'
            }
        };

        // Find best match
        for (const [key, data] of Object.entries(marketData)) {
            if (careerName.toLowerCase().includes(key.toLowerCase())) {
                return data;
            }
        }

        return {
            avgSalary: 'Competitive',
            jobGrowth: 'Growing field',
            demand: 'High',
            workLifeBalance: '7.0/10',
            remoteOpportunities: '70%'
        };
    }

    getFallbackAnalysis(level) {
        const levelSpecificAnalysis = {
            beginner: {
                career: 'Software Engineering',
                percentage: 82,
                reasoning: 'Your analytical thinking and systematic approach to problem-solving align well with software engineering.',
                nextSteps: [
                    'Take CS 161 to explore programming fundamentals',
                    'Join #include or CodeLab for hands-on experience',
                    'Build simple projects to test your interest',
                    'Attend tech talks and info sessions on campus'
                ]
            },
            intermediate: {
                career: 'Full-Stack Development',
                percentage: 85,
                reasoning: 'Your balance of technical skills and user awareness makes you well-suited for full-stack development.',
                nextSteps: [
                    'Build a complete web application for your portfolio',
                    'Join Google Developer Student Club for advanced projects',
                    'Apply for software engineering internships',
                    'Contribute to open source projects'
                ]
            },
            advanced: {
                career: 'Technical Product Management',
                percentage: 88,
                reasoning: 'Your leadership experience and strategic thinking position you well for technical product management roles.',
                nextSteps: [
                    'Lead a significant technical project or initiative',
                    'Develop business acumen through relevant coursework',
                    'Network with product managers in industry',
                    'Consider product management internships at tech companies'
                ]
            }
        };

        const analysis = levelSpecificAnalysis[level] || levelSpecificAnalysis.intermediate;

        return {
            success: true,
            analysisType: `Fallback Analysis - ${level.charAt(0).toUpperCase() + level.slice(1)} Level`,
            results: {
                topMatch: {
                    career: analysis.career,
                    percentage: analysis.percentage,
                    confidence: analysis.percentage - 5,
                    reasoning: analysis.reasoning,
                    keyPatterns: ['Analytical thinking', 'Problem-solving focus', 'Technical aptitude'],
                    nextSteps: analysis.nextSteps
                },
                allMatches: [
                    { career: analysis.career, category: 'Engineering', percentage: analysis.percentage, confidence: analysis.percentage - 5 },
                    { career: 'Data Science', category: 'Data & Analytics', percentage: analysis.percentage - 10, confidence: analysis.percentage - 15 },
                    { career: 'UX Design', category: 'Design', percentage: analysis.percentage - 15, confidence: analysis.percentage - 20 }
                ],
                personalityInsights: {
                    workStyle: `Systematic and analytical approach appropriate for ${level} level`,
                    motivation: 'Building solutions and understanding complex systems',
                    environment: 'Collaborative technical environment with growth opportunities',
                    challenges: 'Continue developing both technical and soft skills',
                    strengths: 'Strong analytical thinking and problem-solving abilities'
                },
                aiInsights: {
                    workStyle: 'You prefer systematic approaches to problem-solving',
                    fullAnalysis: `Your responses suggest a natural fit for technical roles at the ${level} level.`
                },
                qualityMetrics: {
                    authenticity: 85,
                    confidence: analysis.percentage - 5,
                    aiPowered: false,
                    analysisQuality: 80,
                    level: level
                }
            },
            timestamp: new Date().toISOString()
        };
    }
}

module.exports = EnhancedThreeLevelAIAnalyzer;