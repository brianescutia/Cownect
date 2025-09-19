// backend/services/dynamicResultsGenerator.js
// Generates completely personalized, AI-driven results for each career match

const OpenAI = require('openai');
const { completeCareerRequirements } = require('../data/completeCareerRequirements');

class DynamicResultsGenerator {
    constructor() {
        if (!process.env.OPENAI_API_KEY) {
            console.error('⚠️ WARNING: OPENAI_API_KEY not found in environment variables');
            console.error('AI generation will use fallback data');
            this.openai = null;
        } else {
            console.log('✅ OpenAI API initialized');
            this.openai = new OpenAI({
                apiKey: process.env.OPENAI_API_KEY
            });
        }
    }

    async generatePersonalizedResults(careerName, userProfile, patterns, quizLevel) {
        if (!this.openai) {
            return this.getFallbackResults(careerName);
        }

        try {
            const careerData = completeCareerRequirements[careerName];

            // Generate multiple AI components in parallel for speed
            const [
                entryRequirements,
                skillGapAnalysis,
                careerProgression,
                learningPath,
                marketInsights,
                personalizedAdvice
            ] = await Promise.all([
                this.generateEntryRequirements(careerName, userProfile, patterns),
                this.generateSkillGapAnalysis(careerName, patterns),
                this.generateCareerProgression(careerName, userProfile),
                this.generateLearningPath(careerName, patterns, quizLevel),
                this.generateMarketInsights(careerName),
                this.generatePersonalizedAdvice(careerName, userProfile, patterns)
            ]);

            return {
                entryRequirements,
                skillGapAnalysis,
                careerProgression,
                learningPath,
                marketInsights,
                personalizedAdvice,
                ucDavisResources: await this.generateUCDavisResources(careerName, userProfile)
            };
        } catch (error) {
            console.error('AI generation error:', error);
            return this.getFallbackResults(careerName);
        }
    }

    async generateEntryRequirements(careerName, userProfile, patterns) {
        const safePatterns = patterns || {};

        const prompt = `Generate personalized entry requirements for ${careerName} for a UC Davis ${userProfile.year || 'student'} majoring in ${userProfile.major || 'undeclared'}.

Please return ONLY this JSON structure:
{
  "education": {
    "primary": "Specific degree path",
    "alternative": "Alternative path",
    "requiredCourses": ["List 3-4 UC Davis courses"],
    "timeline": "Timeline given their year"
  },
  "technicalSkills": {
    "mustHave": ["3 critical skills"],
    "shouldHave": ["3 skills for 6 months"]
  },
  "experience": {
    "immediate": "Start this week",
    "shortTerm": "Next 3-6 months",
    "beforeGraduation": "Project 1, Project 2, Project 3"
  }
}

Respond ONLY with valid JSON.`;

        try {
            const completion = await this.openai.chat.completions.create({
                model: "gpt-4-turbo-preview", // Faster model
                messages: [
                    { role: "system", content: "You are a UC Davis career advisor. Respond with valid JSON only." },
                    { role: "user", content: prompt }
                ],
                max_tokens: 400, // Reduced from 800
                temperature: 0.7,
                response_format: { type: "json_object" }
            });

            return JSON.parse(completion.choices[0].message.content);
        } catch (error) {
            console.error('Error generating entry requirements:', error);
            return this.getFallbackEntryRequirements(careerName);
        }
    }

    async generateSkillGapAnalysis(careerName, patterns) {
        const careerData = completeCareerRequirements[careerName] || {};
        const requiredSkills = careerData.technicalSkills?.required || [];
        const safePatterns = patterns || {};

        const prompt = `Analyze skill gaps for ${careerName} career.

Required skills for this role: ${requiredSkills.join(', ')}
User's indicated skills: ${JSON.stringify(safePatterns.technicalSkills || [])}
User's interests: ${JSON.stringify(safePatterns.domainInterests || {})}

Generate a personalized skill gap analysis as a JSON object with this structure:
{
  "overallReadiness": "percentage (0-100)",
  "readinessDescription": "One sentence assessment",
  "criticalGaps": [
    {
      "skill": "Skill name",
      "importance": "Critical/High/Medium",
      "currentLevel": "None/Beginner/Some exposure",
      "timeToLearn": "Realistic timeframe",
      "learningPath": "Specific steps to learn this",
      "resources": ["Specific free resources", "UC Davis resources", "Online courses"]
    }
  ],
  "existingStrengths": [
    {
      "skill": "Something they already have",
      "relevance": "How it helps for this career",
      "nextLevel": "How to build on this"
    }
  ],
  "quickWins": ["2-3 skills they can acquire quickly for immediate impact"],
  "longTermDevelopment": ["2-3 advanced skills for career growth"]
}

Return ONLY valid JSON format.`;

        try {
            const completion = await this.openai.chat.completions.create({
                model: "gpt-4-turbo-preview",
                messages: [
                    { role: "system", content: "You are a technical skills advisor. Be specific and realistic about learning timelines. Always respond with valid JSON." },
                    { role: "user", content: prompt }
                ],
                max_tokens: 1000,
                temperature: 0.6,
                response_format: { type: "json_object" }
            });

            return JSON.parse(completion.choices[0].message.content);
        } catch (error) {
            console.error('Error generating skill gap analysis:', error);
            return this.getFallbackSkillGapAnalysis(careerName);
        }
    }

    async generateCareerProgression(careerName, userProfile) {
        const currentYear = userProfile.year || 'Freshman';

        const prompt = `Create a personalized career progression timeline for ${careerName} starting as a ${currentYear} at UC Davis.

Generate a detailed progression as JSON with this structure:
{
  "immediatePhase": {
    "title": "Next 6 Months",
    "role": "Current student focus",
    "goals": ["3-4 specific goals"],
    "milestones": ["2-3 concrete milestones"],
    "expectedOutcome": "What they'll achieve"
  },
  "entryLevel": {
    "title": "First Role (0-2 years)",
    "possibleTitles": ["3-4 realistic job titles"],
    "salaryRange": "Specific to their location/market",
    "keyResponsibilities": ["4-5 typical responsibilities"],
    "companiesHiring": ["5-6 specific companies"],
    "preparationSteps": ["What to do while still in school"]
  },
  "midCareer": {
    "title": "Growth Phase (2-5 years)",
    "possibleTitles": ["3-4 progression titles"],
    "salaryRange": "Market-specific range",
    "newOpportunities": ["Doors that open at this level"],
    "skillsToMaster": ["Technical and soft skills needed"]
  },
  "seniorLevel": {
    "title": "Leadership Phase (5+ years)",
    "possiblePaths": [
      {"path": "Technical Track", "roles": ["Principal Engineer", "Architect"], "focus": "Deep expertise"},
      {"path": "Management Track", "roles": ["Engineering Manager", "Director"], "focus": "Team leadership"},
      {"path": "Entrepreneurial Track", "roles": ["Founder", "CTO"], "focus": "Building companies"}
    ],
    "salaryPotential": "Top-tier compensation range",
    "industryImpact": "How they can shape the field"
  },
  "uniqueOpportunities": "Special opportunities specific to this career path"
}

Return ONLY valid JSON format.`;

        try {
            const completion = await this.openai.chat.completions.create({
                model: "gpt-4-turbo-preview",
                messages: [
                    { role: "system", content: "You are a career progression expert. Provide realistic, inspiring progression paths. Always respond with valid JSON." },
                    { role: "user", content: prompt }
                ],
                max_tokens: 1200,
                temperature: 0.7,
                response_format: { type: "json_object" }
            });

            return JSON.parse(completion.choices[0].message.content);
        } catch (error) {
            console.error('Error generating career progression:', error);
            return this.getFallbackCareerProgression(careerName);
        }
    }

    async generateLearningPath(careerName, patterns, quizLevel) {
        const safePatterns = patterns || {};

        const prompt = `Create a personalized learning roadmap for ${careerName} based on quiz level: ${quizLevel}.

User patterns:
- Technical comfort: ${quizLevel === 'beginner' ? 'Starting fresh' : quizLevel === 'intermediate' ? 'Some experience' : 'Advanced'}
- Learning style: ${safePatterns.collaborationStyle > 0.5 ? 'Collaborative' : 'Self-directed'}
- Time availability: ${safePatterns.autonomyLevel > 0.5 ? 'Flexible schedule' : 'Structured learning'}

Generate a comprehensive learning path as JSON:
{
  "week1": {
    "focus": "Immediate start",
    "actions": ["3 specific actions for this week"],
    "resources": ["Specific tutorials/courses to start"],
    "timeCommitment": "Hours per day",
    "expectedOutcome": "What they'll accomplish"
  },
  "month1": {
    "focus": "Foundation building",
    "project": "Specific project to complete",
    "skills": ["Skills to develop"],
    "courses": ["UC Davis courses to enroll in"],
    "milestone": "Concrete achievement"
  },
  "quarter1": {
    "focus": "Portfolio development",
    "projects": ["2-3 portfolio projects"],
    "certifications": ["Relevant certifications to pursue"],
    "networking": ["Specific networking activities"],
    "internshipPrep": "How to prepare for internships"
  },
  "year1": {
    "focus": "Professional readiness",
    "majorMilestones": ["Key achievements"],
    "portfolioItems": ["4-5 substantial projects"],
    "professionalPresence": "LinkedIn, GitHub, personal website",
    "jobReadiness": "Specific preparation for job search"
  },
  "personalizedTips": ["3-4 tips based on their specific profile"],
  "commonPitfalls": ["2-3 mistakes to avoid"],
  "accelerators": ["Ways to speed up their progress"]
}

Return ONLY valid JSON format.`;

        try {
            const completion = await this.openai.chat.completions.create({
                model: "gpt-4-turbo-preview",
                messages: [
                    { role: "system", content: "You are an education pathway designer. Create actionable, time-bound learning plans. Always respond with valid JSON." },
                    { role: "user", content: prompt }
                ],
                max_tokens: 1000,
                temperature: 0.7,
                response_format: { type: "json_object" }
            });

            return JSON.parse(completion.choices[0].message.content);
        } catch (error) {
            console.error('Error generating learning path:', error);
            return this.getFallbackLearningPath(careerName);
        }
    }

    async generateMarketInsights(careerName) {
        const careerData = completeCareerRequirements[careerName] || {};

        const prompt = `Generate current market insights for ${careerName} (as of 2024/2025).

Base data: ${JSON.stringify(careerData.marketData || {})}

Provide enhanced, specific insights as JSON:
{
  "currentDemand": {
    "level": "Very Low/Low/Moderate/High/Very High",
    "trend": "Increasing/Stable/Decreasing",
    "reasoning": "Why demand is at this level",
    "hotSpots": ["Top 5 geographic locations"],
    "remoteTrend": "Remote work availability and trends"
  },
  "compensation": {
    "entryLevel": {
      "range": "$X-Y",
      "factors": "What affects starting salary",
      "negotiationTips": "How to maximize offers"
    },
    "experienced": {
      "2years": "$X-Y",
      "5years": "$X-Y",
      "10years": "$X-Y"
    },
    "topTier": {
      "range": "$X-Y",
      "whatItTakes": "How to reach top compensation"
    }
  },
  "futureOutlook": {
    "fiveYearProjection": "Where this field is heading",
    "emergingSpecializations": ["New sub-fields emerging"],
    "threatsAndOpportunities": {
      "threats": ["Potential challenges"],
      "opportunities": ["Growth areas"]
    }
  },
  "competitiveLandscape": {
    "typicalCompetition": "Who you're competing against",
    "differentiators": "How to stand out",
    "alternativePaths": ["Related careers to consider"]
  },
  "industryInsiderTip": "One key insight most students don't know"
}

Return ONLY valid JSON format.`;

        try {
            const completion = await this.openai.chat.completions.create({
                model: "gpt-4-turbo-preview",
                messages: [
                    { role: "system", content: "You are a tech industry analyst. Provide current, accurate market insights. Always respond with valid JSON." },
                    { role: "user", content: prompt }
                ],
                max_tokens: 1000,
                temperature: 0.6,
                response_format: { type: "json_object" }
            });

            return JSON.parse(completion.choices[0].message.content);
        } catch (error) {
            console.error('Error generating market insights:', error);
            return this.getFallbackMarketInsights(careerName);
        }
    }

    async generatePersonalizedAdvice(careerName, userProfile, patterns) {
        // Ensure patterns has default values
        const safePatterns = patterns || {};
        const domainInterests = safePatterns.domainInterests || {};
        const collaborationStyle = safePatterns.collaborationStyle || 0.5;
        const riskTolerance = safePatterns.riskTolerance || 0.5;

        // Safely get domain interests keys
        const interests = Object.keys(domainInterests).length > 0
            ? Object.keys(domainInterests).join(', ')
            : 'technology';

        const prompt = `Generate highly personalized advice for a ${userProfile.year || 'UC Davis student'} pursuing ${careerName}.

Their profile:
- Major: ${userProfile.major || 'Undeclared'}
- Work style: ${collaborationStyle > 0.5 ? 'Collaborative' : 'Independent'}
- Risk tolerance: ${riskTolerance > 0.5 ? 'Risk-taker' : 'Risk-averse'}
- Primary interests: ${interests}

Create personalized guidance as JSON:
{
  "yourUniqueAdvantage": "What makes them particularly suited for this career",
  "biggestChallenge": "The main obstacle they'll face and how to overcome it",
  "unconventionalPath": "An alternative route that might work better for them",
  "mentalModel": "How to think about this career journey",
  "dayInTheLife": {
    "morning": "What their mornings might look like",
    "core": "Main work activities",
    "challenges": "Daily challenges they'll face",
    "rewards": "What makes it worthwhile"
  },
  "redFlags": ["Warning signs this might not be the right fit"],
  "greenFlags": ["Signs they're on the right track"],
  "mentorAdvice": "What a senior professional would tell them",
  "parentExplanation": "How to explain this career choice to family",
  "backupPlan": "Smart contingency if this doesn't work out",
  "hiddenGems": ["Lesser-known opportunities in this field"],
  "networkingStrategy": "How to build connections given their personality",
  "firstInternship": {
    "when": "Ideal timing",
    "where": "Types of companies to target",
    "how": "Specific application strategy"
  }
}

Return ONLY valid JSON format.`;

        try {
            const completion = await this.openai.chat.completions.create({
                model: "gpt-4-turbo-preview",
                messages: [
                    { role: "system", content: "You are a personalized career coach. Provide specific, actionable, personalized advice. Always respond with valid JSON." },
                    { role: "user", content: prompt }
                ],
                max_tokens: 1200,
                temperature: 0.8,
                response_format: { type: "json_object" }
            });

            return JSON.parse(completion.choices[0].message.content);
        } catch (error) {
            console.error('Error generating personalized advice:', error);
            return this.getFallbackPersonalizedAdvice(careerName);
        }
    }

    async generateUCDavisResources(careerName, userProfile) {
        const careerData = completeCareerRequirements[careerName] || {};
        const baseResources = careerData.ucDavisResources || {};

        const prompt = `Generate comprehensive UC Davis resources for ${careerName} student.

Base resources: ${JSON.stringify(baseResources)}
Student year: ${userProfile.year || 'Unknown'}
Major: ${userProfile.major || 'Undeclared'}

Create detailed UC Davis guidance as JSON:
{
  "clubs": [
    {
      "name": "Club name",
      "whyJoin": "Specific benefit for this career",
      "whatYoullDo": "Actual activities",
      "meetingTime": "When they meet",
      "howToJoin": "Specific steps",
      "alternativeIf": "Alternative if this doesn't work out"
    }
  ],
  "courses": {
    "mustTake": [
      {
        "code": "ECS XXX",
        "name": "Course name",
        "professor": "Best professor to take it with",
        "quarter": "Best quarter to take",
        "why": "How it helps your career",
        "tip": "How to succeed in this course"
      }
    ],
    "hidden_gems": ["Lesser-known valuable courses"],
    "courseSequence": "Optimal order to take courses"
  },
  "professors": [
    {
      "name": "Professor name",
      "expertise": "Their research area",
      "howTheyHelp": "Specific ways they can help",
      "howToApproach": "Best way to connect with them",
      "officeHours": "When to visit"
    }
  ],
  "research": {
    "opportunities": ["Specific research groups"],
    "howToJoin": "Step-by-step process",
    "timeline": "When to start looking"
  },
  "localInternships": [
    {
      "company": "Company name",
      "position": "Typical intern role",
      "howToApply": "Application process",
      "timeline": "When they hire",
      "preparation": "How to prepare"
    }
  ],
  "hiddenResources": ["UC Davis resources most students don't know about"],
  "events": {
    "annual": ["Major annual events"],
    "quarterly": ["Regular events each quarter"],
    "networking": ["Best networking opportunities"]
  },
  "studySpots": ["Best places on campus for this type of work"],
  "equipment": ["Special equipment/labs available"],
  "funding": ["Scholarships and funding opportunities"]
}

Return ONLY valid JSON format.`;

        try {
            const completion = await this.openai.chat.completions.create({
                model: "gpt-4-turbo-preview",
                messages: [
                    { role: "system", content: "You are a UC Davis insider. Provide specific, accurate UC Davis resources and guidance. Always respond with valid JSON." },
                    { role: "user", content: prompt }
                ],
                max_tokens: 1500,
                temperature: 0.7,
                response_format: { type: "json_object" }
            });

            return JSON.parse(completion.choices[0].message.content);
        } catch (error) {
            console.error('Error generating UC Davis resources:', error);
            return this.getFallbackUCDavisResources(careerName);
        }
    }

    // Fallback methods with complete data structures
    getFallbackResults(careerName) {
        const careerData = completeCareerRequirements[careerName] || {};

        return {
            entryRequirements: this.getFallbackEntryRequirements(careerName),
            skillGapAnalysis: this.getFallbackSkillGapAnalysis(careerName),
            careerProgression: this.getFallbackCareerProgression(careerName),
            learningPath: this.getFallbackLearningPath(careerName),
            marketInsights: this.getFallbackMarketInsights(careerName),
            personalizedAdvice: this.getFallbackPersonalizedAdvice(careerName),
            ucDavisResources: this.getFallbackUCDavisResources(careerName)
        };
    }

    getFallbackEntryRequirements(careerName) {
        const careerData = completeCareerRequirements[careerName] || {};
        return {
            education: {
                primary: careerData.education?.primary || "Bachelor's degree in related field",
                alternative: careerData.education?.alternative || "Bootcamp or self-study with portfolio",
                requiredCourses: careerData.education?.requiredCourses || ["Data Structures", "Algorithms"],
                timeline: "4 years for degree, 6-12 months for bootcamp"
            },
            technicalSkills: {
                mustHave: careerData.technicalSkills?.required?.slice(0, 4) || ["Problem solving", "Programming basics"],
                shouldHave: careerData.technicalSkills?.preferred?.slice(0, 4) || ["Version control", "Testing"],
                niceToHave: ["Cloud platforms", "DevOps"],
                personalizedOrder: "Start with fundamentals"
            },
            experience: {
                immediate: "Start building projects this week",
                shortTerm: "Apply for internships in 3-6 months",
                beforeGraduation: "Complete 3-5 portfolio projects"
            },
            uniqueAdvantage: "Your fresh perspective is valuable"
        };
    }

    getFallbackSkillGapAnalysis(careerName) {
        const careerData = completeCareerRequirements[careerName] || {};
        return {
            overallReadiness: 60,
            readinessDescription: "You have good foundational skills with room to grow",
            criticalGaps: careerData.skillGaps || [
                {
                    skill: "Core Programming",
                    importance: "Critical",
                    currentLevel: "Beginner",
                    timeToLearn: "3-6 months",
                    learningPath: "Start with online tutorials",
                    resources: ["freeCodeCamp", "Codecademy"]
                }
            ],
            existingStrengths: [
                {
                    skill: "Problem Solving",
                    relevance: "Essential for this career",
                    nextLevel: "Apply to programming challenges"
                }
            ],
            quickWins: ["Set up development environment", "Join a community"],
            longTermDevelopment: ["Advanced frameworks", "System design"]
        };
    }

    getFallbackCareerProgression(careerName) {
        const careerData = completeCareerRequirements[careerName] || {};
        return careerData.careerProgression || {
            immediatePhase: {
                title: "Student Phase",
                role: "Learning fundamentals",
                goals: ["Build skills", "Create portfolio", "Network"],
                milestones: ["First project", "First internship application"],
                expectedOutcome: "Ready for internships"
            },
            entryLevel: {
                title: "Entry Level (0-2 years)",
                possibleTitles: ["Junior Developer", "Associate Engineer"],
                salaryRange: "$60k-$90k",
                keyResponsibilities: ["Code development", "Testing", "Documentation"],
                companiesHiring: ["Startups", "Mid-size companies"],
                preparationSteps: ["Build portfolio", "Practice interviews"]
            },
            midCareer: {
                title: "Mid-Level (2-5 years)",
                possibleTitles: ["Software Engineer", "Senior Developer"],
                salaryRange: "$90k-$130k",
                newOpportunities: ["Team leadership", "Architecture decisions"],
                skillsToMaster: ["System design", "Mentoring"]
            },
            seniorLevel: {
                title: "Senior Level (5+ years)",
                possiblePaths: [
                    { path: "Technical", roles: ["Principal Engineer"], focus: "Deep expertise" },
                    { path: "Management", roles: ["Engineering Manager"], focus: "Team leadership" }
                ],
                salaryPotential: "$130k-$200k+",
                industryImpact: "Shape technology direction"
            },
            uniqueOpportunities: "Multiple specialization paths available"
        };
    }

    getFallbackLearningPath(careerName) {
        const careerData = completeCareerRequirements[careerName] || {};
        return {
            week1: {
                focus: "Start with basics",
                actions: ["Set up development environment", "Start first tutorial", "Join a tech club"],
                resources: ["Online courses", "Documentation"],
                timeCommitment: "1-2 hours/day",
                expectedOutcome: "Foundation established"
            },
            month1: {
                focus: "Build first project",
                project: "Simple application",
                skills: careerData.technicalSkills?.required?.slice(0, 3) || ["HTML", "CSS", "JavaScript"],
                courses: ["Intro to Programming"],
                milestone: "First project complete"
            },
            quarter1: {
                focus: "Develop portfolio",
                projects: ["Portfolio website", "Main project"],
                certifications: [],
                networking: ["Attend meetups", "Join online communities"],
                internshipPrep: "Start applying"
            },
            year1: {
                focus: "Career readiness",
                majorMilestones: ["Portfolio complete", "Internship secured"],
                portfolioItems: ["3-5 projects"],
                professionalPresence: "LinkedIn and GitHub active",
                jobReadiness: "Ready for entry-level positions"
            },
            personalizedTips: ["Stay consistent", "Focus on fundamentals", "Build projects"],
            commonPitfalls: ["Trying to learn everything at once", "Not practicing enough"],
            accelerators: ["Find a mentor", "Join hackathons"]
        };
    }

    getFallbackMarketInsights(careerName) {
        const careerData = completeCareerRequirements[careerName] || {};
        return careerData.marketData || {
            currentDemand: {
                level: "High",
                trend: "Growing",
                reasoning: "Strong industry demand",
                hotSpots: ["San Francisco", "Seattle", "Austin", "New York", "Remote"],
                remoteTrend: "60% remote opportunities"
            },
            compensation: {
                entryLevel: {
                    range: "$70k-$100k",
                    factors: "Location and skills",
                    negotiationTips: "Show portfolio and skills"
                },
                experienced: {
                    "2years": "$90k-$120k",
                    "5years": "$120k-$160k",
                    "10years": "$150k-$200k+"
                },
                topTier: {
                    range: "$200k-$400k+",
                    whatItTakes: "Specialized expertise or leadership"
                }
            },
            futureOutlook: {
                fiveYearProjection: "Continued strong growth",
                emergingSpecializations: ["AI/ML", "Cloud", "Security"],
                threatsAndOpportunities: {
                    threats: ["Automation of basic tasks"],
                    opportunities: ["New technologies emerging"]
                }
            },
            competitiveLandscape: {
                typicalCompetition: "CS graduates and bootcamp grads",
                differentiators: "Portfolio and practical skills",
                alternativePaths: ["Related tech roles"]
            },
            industryInsiderTip: "Focus on practical skills over credentials"
        };
    }

    getFallbackPersonalizedAdvice(careerName) {
        return {
            yourUniqueAdvantage: "Your combination of interests and skills aligns well with this field",
            biggestChallenge: "Building technical depth will require dedicated practice",
            unconventionalPath: "Consider bootcamps or self-directed learning as alternatives",
            mentalModel: "Think of this as a marathon, not a sprint - consistent progress matters",
            dayInTheLife: {
                morning: "Starting your day with standup meetings and planning",
                core: "Deep focus work on coding and problem-solving",
                challenges: "Debugging complex issues and learning new technologies",
                rewards: "Seeing your code come to life and impact users"
            },
            redFlags: [
                "Persistent lack of interest in problem-solving",
                "Discomfort with continuous learning",
                "No enjoyment in building things"
            ],
            greenFlags: [
                "Enjoying the problem-solving process",
                "Making steady progress in skills",
                "Finding satisfaction in completed projects"
            ],
            mentorAdvice: "Focus on building real projects rather than just following tutorials. The best learning comes from solving actual problems.",
            parentExplanation: "This career offers strong job security, good compensation, and opportunities for growth in a rapidly evolving field",
            backupPlan: "Skills transfer well to related fields like product management, technical writing, or IT consulting",
            hiddenGems: [
                "Open source contributions build reputation",
                "Technical blogging opens doors",
                "Hackathons provide networking and learning"
            ],
            networkingStrategy: "Start with online communities and campus events, then expand to local meetups and conferences",
            firstInternship: {
                when: "Summer after sophomore year ideally",
                where: "Startups for hands-on experience, big tech for structured learning",
                how: "Apply early (fall for summer), emphasize projects over grades"
            }
        };
    }

    getFallbackUCDavisResources(careerName) {
        const careerData = completeCareerRequirements[careerName] || {};
        return careerData.ucDavisResources || {
            clubs: [
                {
                    name: "Relevant Tech Club",
                    whyJoin: "Hands-on projects and networking",
                    whatYoullDo: "Build projects and learn together",
                    meetingTime: "Weekly meetings",
                    howToJoin: "Attend info session",
                    alternativeIf: "Look for similar clubs"
                }
            ],
            courses: {
                mustTake: [
                    {
                        code: "ECS 36A",
                        name: "Programming & Problem Solving",
                        professor: "Check current offerings",
                        quarter: "Fall/Winter/Spring",
                        why: "Foundation for all programming",
                        tip: "Start assignments early"
                    }
                ],
                hidden_gems: ["Look for special topics courses"],
                courseSequence: "Follow major requirements"
            },
            professors: [],
            research: {
                opportunities: ["Check department websites"],
                howToJoin: "Email professors with interest",
                timeline: "After completing intro courses"
            },
            localInternships: [],
            hiddenResources: ["Career center workshops", "Library resources"],
            events: {
                annual: ["Tech symposium", "Career fair"],
                quarterly: ["Info sessions"],
                networking: ["Alumni events"]
            },
            studySpots: ["Shields Library", "CoHo"],
            equipment: ["Computer labs in Kemper"],
            funding: ["Check financial aid office"]
        };
    }
}

module.exports = DynamicResultsGenerator;