// AI Career Analyzer - Basic Implementation
// Save as: backend/services/aiCareerAnalyzer.js

const OpenAI = require('openai');

class AICareerAnalyzer {
    constructor() {
        if (!process.env.OPENAI_API_KEY) {
            console.warn('⚠️ OpenAI API key not found. AI analysis will use fallback.');
            this.openai = null;
        } else {
            this.openai = new OpenAI({
                apiKey: process.env.OPENAI_API_KEY
            });
        }
    }

    async analyzeUserResponses(answers, questions, userProfile = {}) {
        try {
            console.log('🤖 Running AI career analysis...');

            if (!this.openai) {
                return this.getFallbackResults(userProfile);
            }

            const analysisPrompt = this.buildAnalysisPrompt(answers, questions, userProfile);

            const completion = await this.openai.chat.completions.create({
                model: "gpt-4-turbo-preview",
                messages: [
                    {
                        role: "system",
                        content: this.getSystemPrompt()
                    },
                    {
                        role: "user",
                        content: analysisPrompt
                    }
                ],
                max_tokens: 2500,
                temperature: 0.3,
                response_format: { type: "json_object" }
            });

            const aiResponse = completion.choices[0].message.content;
            const analysis = JSON.parse(aiResponse);

            return this.formatResults(analysis, userProfile);

        } catch (error) {
            console.error('💥 AI analysis error:', error);
            return this.getFallbackResults(userProfile);
        }
    }

    getSystemPrompt() {
        return `You are an expert career counselor specializing in tech careers for college students. Analyze user responses to recommend the best tech career paths.

AVAILABLE CAREER OPTIONS:
- Software Engineering (Frontend)
- Software Engineering (Backend) 
- Software Engineering (Full-Stack)
- Data Science
- Machine Learning Engineering
- UX/UI Design
- Product Management
- DevOps Engineering
- Cybersecurity
- Mobile Development
- Game Development
- Technical Writing
- Developer Relations
- Startup Founder

ANALYSIS APPROACH:
1. Look for patterns in problem-solving approaches
2. Assess technical comfort and interest levels
3. Evaluate collaboration vs independent work preferences
4. Consider creativity vs systematic thinking
5. Match personality to career environments

RESPONSE FORMAT:
{
  "topMatch": {
    "career": "Specific career name from the list",
    "percentage": 85,
    "confidence": 82,
    "reasoning": "2-3 sentences explaining the match",
    "personalityProfile": "Brief personality assessment",
    "nextSteps": ["step1", "step2", "step3"],
    "marketData": {
      "avgSalary": "$95k - $180k",
      "jobGrowth": "+22%",
      "demand": "Very High"
    },
    "ucDavisResources": ["resource1", "resource2"]
  },
  "allMatches": [
    {"career": "Top match", "percentage": 85, "confidence": 82},
    {"career": "Second match", "percentage": 78, "confidence": 75},
    {"career": "Third match", "percentage": 71, "confidence": 68}
  ],
  "workStyle": {
    "preference": "Collaborative technical environment",
    "motivation": "Building impactful solutions",
    "environment": "Fast-paced startup or mid-size tech company"
  },
  "skillGaps": ["skill1", "skill2", "skill3"],
  "aiInsights": {
    "workStyle": "Your systematic approach suggests engineering roles",
    "fullAnalysis": "Detailed personality and career fit analysis"
  },
  "qualityMetrics": {
    "authenticity": 92,
    "confidence": 85,
    "aiPowered": true,
    "analysisQuality": 95
  }
}`;
    }

    buildAnalysisPrompt(answers, questions, userProfile) {
        let prompt = `CAREER ASSESSMENT ANALYSIS

USER PROFILE:
- University: UC Davis
- Level: ${userProfile.level || 'Not specified'}
- Major: ${userProfile.major || 'Not specified'}
- Year: ${userProfile.year || 'Not specified'}

RESPONSES ANALYSIS:

`;

        answers.forEach((answer, index) => {
            const question = questions[index];
            if (!question) return;

            prompt += `QUESTION ${index + 1}: ${question.questionText}\n`;
            prompt += `Category: ${question.category}\n`;

            if (answer.ranking && Array.isArray(answer.ranking)) {
                prompt += `User's ranking (most to least preferred):\n`;
                answer.ranking.forEach((optionIndex, rank) => {
                    const option = question.options[optionIndex];
                    if (option) {
                        prompt += `${rank + 1}. ${option.text}\n`;
                    }
                });
            }
            prompt += `\n`;
        });

        prompt += `\nPlease analyze these responses to determine the best tech career matches for this UC Davis student. Focus on their problem-solving style, technical comfort, and work preferences.`;

        return prompt;
    }

    formatResults(analysis, userProfile) {
        return {
            success: true,
            results: {
                topMatch: {
                    career: analysis.topMatch.career,
                    percentage: analysis.topMatch.percentage,
                    confidence: analysis.topMatch.confidence,
                    reasoning: analysis.topMatch.reasoning,
                    personalityProfile: analysis.topMatch.personalityProfile,
                    nextSteps: analysis.topMatch.nextSteps,
                    marketData: analysis.topMatch.marketData,
                    ucDavisResources: analysis.topMatch.ucDavisResources
                },
                allMatches: analysis.allMatches,
                workStyle: analysis.workStyle,
                skillGaps: analysis.skillGaps,
                aiInsights: analysis.aiInsights,
                qualityMetrics: analysis.qualityMetrics
            },
            timestamp: new Date().toISOString()
        };
    }

    getFallbackResults(userProfile) {
        return {
            success: true,
            results: {
                topMatch: {
                    career: "Software Engineering",
                    percentage: 78,
                    confidence: 75,
                    reasoning: "Your systematic approach to problem-solving and analytical thinking align well with software engineering.",
                    personalityProfile: "Analytical and methodical with good problem-solving skills",
                    nextSteps: [
                        "Take CS 161 to explore programming fundamentals",
                        "Join #include or CodeLab for hands-on experience",
                        "Build simple projects to test your interest"
                    ],
                    marketData: {
                        avgSalary: "$95k - $180k",
                        jobGrowth: "+22%",
                        demand: "Very High"
                    },
                    ucDavisResources: [
                        "CS Department advising",
                        "#include programming club",
                        "CodeLab for beginners"
                    ]
                },
                allMatches: [
                    { career: "Software Engineering", percentage: 78, confidence: 75 },
                    { career: "Data Science", percentage: 71, confidence: 68 },
                    { career: "UX Design", percentage: 64, confidence: 61 }
                ],
                workStyle: {
                    preference: "Structured technical environment",
                    motivation: "Building solutions to complex problems",
                    environment: "Collaborative team with clear goals"
                },
                skillGaps: [
                    "Programming fundamentals",
                    "Technical communication",
                    "Project management"
                ],
                aiInsights: {
                    workStyle: "You prefer systematic approaches to problem-solving",
                    fullAnalysis: "Your responses suggest a natural fit for technical roles that require analytical thinking."
                },
                qualityMetrics: {
                    authenticity: 85,
                    confidence: 75,
                    aiPowered: false,
                    analysisQuality: 80
                }
            },
            timestamp: new Date().toISOString()
        };
    }
}

// Sample questions for the AI-only quiz system
const aiOnlyQuizQuestions = {
    beginner: [
        {
            id: 'B1',
            questionText: 'When working on a group project, what role do you naturally take?',
            questionType: 'ranking',
            category: 'teamwork',
            difficultyWeight: 1,
            options: [
                {
                    text: 'The Organizer',
                    description: 'I like to create plans and keep everyone on track',
                    weights: { leadership: 8, structure: 9, social: 7 }
                },
                {
                    text: 'The Creative Problem Solver',
                    description: 'I come up with innovative solutions and approaches',
                    weights: { creative: 9, technical: 6, risk: 7 }
                },
                {
                    text: 'The Technical Expert',
                    description: 'I handle the technical implementation and details',
                    weights: { technical: 9, structure: 7, research: 8 }
                },
                {
                    text: 'The Team Supporter',
                    description: 'I help others and make sure everyone feels included',
                    weights: { social: 9, leadership: 6, creative: 5 }
                }
            ]
        }
    ],
    intermediate: [
        {
            id: 'I1',
            questionText: 'How do you approach learning a new programming language?',
            questionType: 'ranking',
            category: 'learning_style',
            difficultyWeight: 1.2,
            options: [
                {
                    text: 'Build something immediately',
                    description: 'Jump in and learn by doing',
                    weights: { pace: 9, risk: 8, technical: 7 }
                },
                {
                    text: 'Follow structured tutorials',
                    description: 'Work through organized learning materials',
                    weights: { structure: 9, research: 8, technical: 8 }
                },
                {
                    text: 'Read documentation first',
                    description: 'Understand the fundamentals before coding',
                    weights: { research: 9, structure: 8, technical: 9 }
                },
                {
                    text: 'Find a mentor or study group',
                    description: 'Learn with guidance from others',
                    weights: { social: 8, leadership: 6, research: 7 }
                }
            ]
        }
    ],
    advanced: [
        {
            id: 'A1',
            questionText: 'Your team faces a critical technical decision with tight deadlines. How do you lead?',
            questionType: 'ranking',
            category: 'leadership',
            difficultyWeight: 1.5,
            options: [
                {
                    text: 'Gather team input quickly and decide',
                    description: 'Democratic but efficient decision making',
                    weights: { leadership: 9, social: 8, pace: 8 }
                },
                {
                    text: 'Analyze all options thoroughly',
                    description: 'Comprehensive analysis despite time pressure',
                    weights: { research: 9, technical: 8, structure: 9 }
                },
                {
                    text: 'Make executive decision based on experience',
                    description: 'Quick decision using expertise',
                    weights: { leadership: 9, risk: 7, pace: 9 }
                },
                {
                    text: 'Prototype quick solutions to test',
                    description: 'Build to validate assumptions quickly',
                    weights: { technical: 9, creative: 8, pace: 8 }
                }
            ]
        }
    ]
};

module.exports = {
    AICareerAnalyzer,
    aiOnlyQuizQuestions
};