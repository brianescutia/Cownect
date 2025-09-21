// frontend/scripts/enhanced-results.js
// Complete implementation for displaying dynamic AI-generated career results


class EnhancedResultsPage {
    constructor() {
        this.resultData = null;
        this.resultId = null;
        this.bookmarkedClubs = new Set();
        this.completedSteps = new Set();
        this.careerDataCache = null;  // ADD THIS LINE

        this.init();
    }

    async init() {
        console.log('🎯 Initializing Enhanced Results Page...');

        try {
            // Get result ID from URL
            const urlParams = new URLSearchParams(window.location.search);
            this.resultId = urlParams.get('id');

            await this.loadResults();
            this.setupEventListeners();
            await this.populateResults(); // Make this await
            this.startAnimations();
        } catch (error) {
            console.error('💥 Error initializing results page:', error);
            this.showError('Failed to load results. Please try again.');
        }
    }

    async fetchCareerData(careerName) {
        try {
            const response = await fetch(`/api/career-data/${encodeURIComponent(careerName)}`);
            if (response.ok) {
                return await response.json();
            }
        } catch (error) {
            console.error('Error fetching career data:', error);
        }
        return null;
    }

    async loadResults() {
        try {
            // First check if we have a result ID
            if (!this.resultId) {
                // Check sessionStorage for recent submission
                const storedResults = sessionStorage.getItem('latestQuizResult');
                if (storedResults) {
                    this.resultId = storedResults;
                    sessionStorage.removeItem('latestQuizResult');
                }
            }

            if (!this.resultId) {
                throw new Error('No result ID found');
            }

            console.log('📊 Loading results from server...', this.resultId);

            // Fetch results from API
            const response = await fetch(`/api/enhanced-results/${this.resultId}/data`, {
                credentials: 'same-origin'
            });

            if (!response.ok) {
                throw new Error('Failed to fetch results');
            }

            const data = await response.json();
            this.resultData = data.results;


            // In enhanced-results.js, update the debug section:
            console.log('=== SEARCHING FOR AI DATA ===');
            console.log('Checking root level:');
            console.log('- entryRequirements at root:', this.resultData?.entryRequirements);
            console.log('- skillGapAnalysis at root:', this.resultData?.skillGapAnalysis);

            console.log('Checking aiInsights:');
            console.log('- Full aiInsights:', this.resultData?.aiInsights);

            console.log('Checking all keys in resultData:');
            console.log('- Keys:', Object.keys(this.resultData || {}));

            console.log('Checking all keys in topMatch:');
            console.log('- Keys:', Object.keys(this.resultData?.topMatch || {}));

            console.log('✅ Results loaded successfully:', this.resultData);
            console.log('Full result data:', this.resultData);
            console.log('Entry requirements:', this.resultData?.topMatch?.entryRequirements);
            console.log('Experience data:', this.resultData?.topMatch?.entryRequirements?.experience);

        } catch (error) {
            console.error('Error loading results:', error);


            // Fallback to sample data if everything fails
            console.log('⚠️ Using sample data...');
            this.resultData = this.getSampleData();
        }
    }

    async populateResults() {
        if (!this.resultData) {
            console.error('No result data available');
            return;
        }

        console.log('🎨 Populating results with hybrid content...');

        // These use AI-generated data (personalized)
        this.populateTopMatch();
        this.populateDynamicEntryRequirements();
        this.populateSkillGapAnalysis();

        // These use static data (reliable)
        await this.populateCertificationsAndResources();
        await this.populateCareerProgression();
        await this.populateMarketInsights();

        // Continue with other sections
        this.populateCareerMatches();
        this.populateUCDavisResources();
    }

    populateTopMatch() {
        const topMatch = this.resultData.topMatch;
        if (!topMatch) return;

        console.log('🥇 Displaying top match:', topMatch.career);

        // Career name and description
        document.getElementById('topCareerName').textContent = topMatch.career;
        document.getElementById('topCareerDescription').textContent =
            topMatch.reasoning || `Based on your responses, ${topMatch.career} aligns perfectly with your interests and skills.`;

        // Match percentage
        const percentage = topMatch.percentage || 85;
        document.getElementById('matchPercentage').textContent = `${percentage}%`;

        // Confidence badge
        const confidence = topMatch.confidence || percentage;
        const confidenceLevel = confidence >= 80 ? 'High' : confidence >= 60 ? 'Medium' : 'Low';
        document.getElementById('confidenceBadge').textContent = `${confidenceLevel} Confidence`;

        // Animate percentage circle
        this.animatePercentageCircle(percentage);
    }

    populateDynamicEntryRequirements() {
        const topMatch = this.resultData.topMatch;
        const requirements = topMatch?.entryRequirements ||
            topMatch?.topMatch?.entryRequirements ||
            this.resultData?.entryRequirements;

        console.log('Requirements received:', requirements);
        console.log('Experience data:', requirements?.experience);

        if (!requirements || Object.keys(requirements).length === 0) {
            console.warn('No entry requirements data found, using fallback');
            this.populateFallbackRequirements();
            return;
        }

        console.log('📋 Displaying personalized entry requirements...');

        // Education requirements
        if (requirements.education) {
            const educationPrimary = document.getElementById('educationPrimary');
            if (educationPrimary) {
                educationPrimary.textContent = requirements.education.primary || 'Bachelor\'s degree in related field';
            }

            const educationAlternative = document.getElementById('educationAlternative');
            if (educationAlternative) {
                educationAlternative.textContent = requirements.education.alternative || 'Bootcamp or self-study with portfolio';
            }

            // Required courses
            const coursesContainer = document.getElementById('requiredCourses');
            if (coursesContainer && requirements.education.requiredCourses) {
                coursesContainer.innerHTML = requirements.education.requiredCourses
                    .map(course => `<li>${course}</li>`)
                    .join('');
            }

            // Timeline if available
            if (requirements.education.timeline) {
                const timelineEl = document.createElement('div');
                timelineEl.className = 'education-timeline';
                timelineEl.innerHTML = `
                <span class="timeline-icon">🗓️</span>
                <span>${requirements.education.timeline}</span>
            `;
                const requirementContent = document.querySelector('.requirement-content');
                if (requirementContent) {
                    requirementContent.appendChild(timelineEl);
                }
            }
        }

        // Technical skills
        if (requirements.technicalSkills) {
            const requiredSkillsContainer = document.getElementById('requiredSkills');

            // Handle both field name formats: 'required' (static) and 'mustHave' (AI)
            const requiredSkills = requirements.technicalSkills.required ||
                requirements.technicalSkills.mustHave || [];

            if (requiredSkillsContainer && requiredSkills.length > 0) {
                requiredSkillsContainer.innerHTML = requiredSkills
                    .map(skill => `<span class="skill-tag required">${skill}</span>`)
                    .join('');
            }

            const preferredSkillsContainer = document.getElementById('preferredSkills');

            // Handle both field name formats: 'preferred' (static) and 'shouldHave' (AI)
            const preferredSkills = requirements.technicalSkills.preferred ||
                requirements.technicalSkills.shouldHave || [];

            if (preferredSkillsContainer && preferredSkills.length > 0) {
                preferredSkillsContainer.innerHTML = preferredSkills
                    .map(skill => `<span class="skill-tag preferred">${skill}</span>`)
                    .join('');
            }
        }

        // Experience & Portfolio section - FIXED to handle both data formats
        if (requirements.experience) {
            const portfolioReq = document.getElementById('portfolioRequirement');
            if (portfolioReq) {
                // Check for all possible field names
                portfolioReq.textContent =
                    requirements.experience.portfolio ||  // Static data format
                    requirements.experience.immediate ||  // AI data format
                    '3-5 projects demonstrating core skills';
            }

            const internshipReq = document.getElementById('internshipRequirement');
            if (internshipReq) {
                // Check for all possible field names
                internshipReq.textContent =
                    requirements.experience.internships ||  // Static data format
                    requirements.experience.shortTerm ||    // AI data format
                    '1+ relevant internship preferred';
            }

            const projectIdeas = document.getElementById('projectIdeas');
            if (projectIdeas) {
                let projectsList = [];

                // Handle multiple possible data formats
                if (requirements.experience.projects && Array.isArray(requirements.experience.projects)) {
                    // Static data format: projects is already an array
                    projectsList = requirements.experience.projects;
                } else if (requirements.experience.beforeGraduation) {
                    // AI data format: beforeGraduation might be a string
                    const beforeGrad = requirements.experience.beforeGraduation;
                    if (typeof beforeGrad === 'string') {
                        projectsList = beforeGrad.split(/[,;]/).map(s => s.trim()).filter(s => s);
                    } else if (Array.isArray(beforeGrad)) {
                        projectsList = beforeGrad;
                    }
                }

                // If we have projects to display
                if (projectsList.length > 0) {
                    projectIdeas.innerHTML = projectsList.map(project => `<li>${project}</li>`).join('');
                } else {
                    // Use career-specific fallbacks
                    this.populateFallbackProjects(projectIdeas, topMatch.career);
                }
            }
        }
    }

    // Helper method for fallback requirements
    populateFallbackRequirements() {
        const educationPrimary = document.getElementById('educationPrimary');
        if (educationPrimary) {
            educationPrimary.textContent = 'BS in Computer Science or related field';
        }

        const educationAlternative = document.getElementById('educationAlternative');
        if (educationAlternative) {
            educationAlternative.textContent = 'Bootcamp certification + strong portfolio';
        }

        const coursesContainer = document.getElementById('requiredCourses');
        if (coursesContainer) {
            coursesContainer.innerHTML = `
            <li>Data Structures & Algorithms</li>
            <li>Software Development</li>
            <li>Software Engineering</li>
        `;
        }

        const requiredSkillsContainer = document.getElementById('requiredSkills');
        if (requiredSkillsContainer) {
            requiredSkillsContainer.innerHTML = `
            <span class="skill-tag required">Programming Fundamentals</span>
            <span class="skill-tag required">Version Control (Git)</span>
            <span class="skill-tag required">Problem Solving</span>
        `;
        }

        const preferredSkillsContainer = document.getElementById('preferredSkills');
        if (preferredSkillsContainer) {
            preferredSkillsContainer.innerHTML = `
            <span class="skill-tag preferred">Cloud Platforms</span>
            <span class="skill-tag preferred">Testing</span>
            <span class="skill-tag preferred">Agile Methods</span>
        `;
        }
    }

    // Helper method for project fallbacks
    populateFallbackProjects(projectIdeas, careerName) {
        const careerProjectIdeas = {
            'Mobile Developer (iOS/Android)': [
                'Weather app with API integration',
                'Social media clone with real-time features',
                'E-commerce mobile app',
                'AR/Camera feature app'
            ],
            'Frontend Engineer': [
                'Interactive portfolio website',
                'React dashboard with data visualization',
                'E-commerce frontend'
            ],
            'Backend Engineer': [
                'RESTful API with authentication',
                'Microservices architecture project',
                'Real-time chat server'
            ],
            'DEFAULT': [
                'Personal portfolio website',
                'Full-stack web application',
                'API integration project'
            ]
        };

        const ideas = careerProjectIdeas[careerName] || careerProjectIdeas.DEFAULT;
        projectIdeas.innerHTML = ideas.map(idea => `<li>${idea}</li>`).join('');
    }

    populateSkillGapAnalysis() {
        const skillGap = this.resultData.topMatch?.skillGapAnalysis;

        if (!skillGap || Object.keys(skillGap).length === 0) {
            // Use static fallback
            this.populateStaticSkillGaps();
            return;
        }

        // Overall readiness
        const percentageEl = document.getElementById('skillMatchPercentage');
        if (percentageEl) {
            percentageEl.textContent = `${skillGap.overallReadiness || 65}%`;
        }

        const descEl = document.getElementById('skillMatchDescription');
        if (descEl) {
            descEl.textContent = skillGap.readinessDescription ||
                'You have a solid foundation with room to grow.';
        }

        // Show only top 2 critical gaps
        const container = document.getElementById('skillGapsGrid');
        if (container && skillGap.criticalGaps) {
            const topGaps = skillGap.criticalGaps.slice(0, 2);

            container.innerHTML = topGaps.map(gap => `
            <div class="skill-gap-item ${gap.importance.toLowerCase()}-priority">
                <div class="gap-header">
                    <span class="priority-badge ${gap.importance.toLowerCase()}">
                        ${gap.importance}
                    </span>
                    <h4>${gap.skill}</h4>
                </div>
                <div class="current-level">
                    <span class="level-label">Current:</span>
                    <span class="level-value">${gap.currentLevel}</span>
                </div>
                <p class="gap-description">${gap.learningPath}</p>
                <div class="gap-actions">
                    <button class="action-btn">Start Learning</button>
                    <span class="time-estimate">${gap.timeToLearn}</span>
                </div>
            </div>
        `).join('');
        }
    }

    async populateCertificationsAndResources() {
        const careerName = this.resultData.topMatch?.career;

        // Try to get static data from backend
        const careerData = await this.fetchCareerData(careerName);

        // Populate certifications
        const optionalCertsContainer = document.getElementById('optionalCerts');
        if (optionalCertsContainer) {
            let certifications = [];

            // Use static data if available
            if (careerData?.certifications?.optional) {
                certifications = careerData.certifications.optional;
            } else if (careerData?.certifications?.recommended) {
                certifications = careerData.certifications.recommended;
            } else {
                // Fallback certifications
                certifications = [
                    'AWS Certified Developer',
                    'Google Cloud Associate',
                    'Microsoft Azure Fundamentals'
                ];
            }

            optionalCertsContainer.innerHTML = certifications.map(cert => `
            <div class="cert-item">
                <span>${cert}</span>
                <span class="cert-level">Optional</span>
            </div>
        `).join('');
        }

        // Populate learning resources
        const learningResourcesContainer = document.getElementById('learningResources');
        if (learningResourcesContainer) {
            let resources = [];

            if (careerData?.certifications?.recommended) {
                resources = careerData.certifications.recommended;
            } else {
                resources = [
                    'freeCodeCamp',
                    'The Odin Project',
                    'Codecademy',
                    'MDN Web Docs'
                ];
            }

            learningResourcesContainer.innerHTML = resources.map(resource => `
            <a href="#" class="resource-link">${resource}</a>
        `).join('');
        }
    }

    populatePersonalizedAdvice() {
        const advice = this.resultData.topMatch?.personalizedAdvice;

        if (!advice) {
            console.warn('No personalized advice data');
            return;
        }

        console.log('💡 Displaying personalized career insights...');

        // Create comprehensive insights section
        const insightsSection = document.createElement('section');
        insightsSection.className = 'personalized-insights-section';
        insightsSection.innerHTML = `
            <div class="section-header">
                <h2>Your Personalized Career Insights</h2>
                <span class="section-icon">💡</span>
            </div>
            
            <div class="insights-grid">
                <!-- Your unique advantage -->
                <div class="insight-card highlight">
                    <h3>🌟 Your Unique Advantage</h3>
                    <p>${advice.yourUniqueAdvantage}</p>
                </div>
                
                <!-- Biggest challenge -->
                <div class="insight-card">
                    <h3>🎯 Your Biggest Challenge</h3>
                    <p>${advice.biggestChallenge}</p>
                </div>
                
                <!-- Day in the life -->
                <div class="insight-card full-width">
                    <h3>📅 A Day in Your Future Life</h3>
                    <div class="day-timeline">
                        <div class="timeline-item">
                            <span class="time">Morning</span>
                            <p>${advice.dayInTheLife?.morning || 'Starting your day with focus'}</p>
                        </div>
                        <div class="timeline-item">
                            <span class="time">Core Work</span>
                            <p>${advice.dayInTheLife?.core || 'Deep work on challenging problems'}</p>
                        </div>
                        <div class="timeline-item">
                            <span class="time">Challenges</span>
                            <p>${advice.dayInTheLife?.challenges || 'Solving complex technical issues'}</p>
                        </div>
                        <div class="timeline-item">
                            <span class="time">Rewards</span>
                            <p>${advice.dayInTheLife?.rewards || 'Seeing your impact on users'}</p>
                        </div>
                    </div>
                </div>
                
                <!-- Mentor advice -->
                <div class="insight-card mentor-advice">
                    <h3>👨‍🏫 Advice from a Senior Professional</h3>
                    <blockquote>
                        "${advice.mentorAdvice}"
                    </blockquote>
                </div>
                
                <!-- Unconventional path -->
                ${advice.unconventionalPath ? `
                    <div class="insight-card">
                        <h3>🛤️ Alternative Path</h3>
                        <p>${advice.unconventionalPath}</p>
                    </div>
                ` : ''}
                
                <!-- First internship strategy -->
                ${advice.firstInternship ? `
                    <div class="insight-card">
                        <h3>💼 First Internship Strategy</h3>
                        <ul>
                            <li><strong>When:</strong> ${advice.firstInternship.when}</li>
                            <li><strong>Where:</strong> ${advice.firstInternship.where}</li>
                            <li><strong>How:</strong> ${advice.firstInternship.how}</li>
                        </ul>
                    </div>
                ` : ''}
                
                <!-- Hidden opportunities -->
                ${advice.hiddenGems ? `
                    <div class="insight-card">
                        <h3>💎 Hidden Opportunities</h3>
                        <ul class="hidden-gems">
                            ${advice.hiddenGems.map(gem =>
            `<li>${gem}</li>`
        ).join('')}
                        </ul>
                    </div>
                ` : ''}
                
                <!-- Networking strategy -->
                ${advice.networkingStrategy ? `
                    <div class="insight-card">
                        <h3>🤝 Your Networking Approach</h3>
                        <p>${advice.networkingStrategy}</p>
                    </div>
                ` : ''}
            </div>
            
            <!-- Success indicators -->
            <div class="success-indicators">
                <div class="indicators-grid">
                    ${advice.greenFlags ? `
                        <div class="green-flags">
                            <h4>✅ Signs You're on the Right Track</h4>
                            <ul>
                                ${advice.greenFlags.map(flag =>
            `<li>${flag}</li>`
        ).join('')}
                            </ul>
                        </div>
                    ` : ''}
                    
                    ${advice.redFlags ? `
                        <div class="red-flags">
                            <h4>⚠️ Warning Signs to Watch For</h4>
                            <ul>
                                ${advice.redFlags.map(flag =>
            `<li>${flag}</li>`
        ).join('')}
                            </ul>
                        </div>
                    ` : ''}
                </div>
            </div>
            
            <!-- Backup plan -->
            ${advice.backupPlan ? `
                <div class="backup-plan">
                    <h3>🔄 Smart Contingency Plan</h3>
                    <p>${advice.backupPlan}</p>
                </div>
            ` : ''}
        `;

        // Insert after the clubs section
        const clubsSection = document.querySelector('.clubs-section');
        if (clubsSection) {
            clubsSection.parentNode.insertBefore(insightsSection, clubsSection.nextSibling);
        }
    }

    populateLearningPath() {
        const learningPath = this.resultData.topMatch?.learningPath;

        if (!learningPath) {
            console.warn('No learning path data');
            return;
        }

        console.log('🎓 Displaying personalized learning roadmap...');

        // Create learning roadmap section
        const roadmapSection = document.createElement('section');
        roadmapSection.className = 'learning-roadmap-section';
        roadmapSection.innerHTML = `
            <div class="section-header">
                <h2>Your Personalized Learning Roadmap</h2>
                <span class="section-icon">🗺️</span>
            </div>
            
            <div class="roadmap-timeline">
                <!-- Week 1 -->
                ${learningPath.week1 ? `
                    <div class="roadmap-phase immediate">
                        <div class="phase-header">
                            <span class="phase-icon">🚀</span>
                            <h3>This Week</h3>
                            <span class="time-commitment">${learningPath.week1.timeCommitment || '1-2 hours/day'}</span>
                        </div>
                        <div class="phase-content">
                            <h4>${learningPath.week1.focus}</h4>
                            <div class="actions-list">
                                ${learningPath.week1.actions.map(action =>
            `<div class="action-item">
                                        <input type="checkbox" id="week1-${action.substring(0, 10)}" 
                                               onchange="window.enhancedResults.trackProgress('week1', '${action}')">
                                        <label for="week1-${action.substring(0, 10)}">${action}</label>
                                    </div>`
        ).join('')}
                            </div>
                            ${learningPath.week1.resources ? `
                                <div class="resources">
                                    <strong>Resources:</strong>
                                    ${learningPath.week1.resources.map(r =>
            `<a href="#" class="resource-link">${r}</a>`
        ).join(', ')}
                                </div>
                            ` : ''}
                            <p class="expected-outcome">${learningPath.week1.expectedOutcome}</p>
                        </div>
                    </div>
                ` : ''}
                
                <!-- Month 1 -->
                ${learningPath.month1 ? `
                    <div class="roadmap-phase short-term">
                        <div class="phase-header">
                            <span class="phase-icon">📚</span>
                            <h3>First Month</h3>
                        </div>
                        <div class="phase-content">
                            <h4>${learningPath.month1.focus}</h4>
                            <div class="project-card">
                                <strong>Project:</strong> ${learningPath.month1.project}
                            </div>
                            ${learningPath.month1.skills ? `
                                <div class="skills-to-learn">
                                    ${learningPath.month1.skills.map(skill =>
            `<span class="skill-badge">${skill}</span>`
        ).join('')}
                                </div>
                            ` : ''}
                            ${learningPath.month1.courses ? `
                                <div class="courses">
                                    <strong>UC Davis Courses:</strong>
                                    <ul>
                                        ${learningPath.month1.courses.map(course =>
            `<li>${course}</li>`
        ).join('')}
                                    </ul>
                                </div>
                            ` : ''}
                            <div class="milestone">
                                <strong>Milestone:</strong> ${learningPath.month1.milestone}
                            </div>
                        </div>
                    </div>
                ` : ''}
                
                <!-- Quarter 1 -->
                ${learningPath.quarter1 ? `
                    <div class="roadmap-phase medium-term">
                        <div class="phase-header">
                            <span class="phase-icon">💼</span>
                            <h3>First Quarter</h3>
                        </div>
                        <div class="phase-content">
                            <h4>${learningPath.quarter1.focus}</h4>
                            ${learningPath.quarter1.projects ? `
                                <div class="projects-list">
                                    <strong>Portfolio Projects:</strong>
                                    <ul>
                                        ${learningPath.quarter1.projects.map(project =>
            `<li>${project}</li>`
        ).join('')}
                                    </ul>
                                </div>
                            ` : ''}
                            ${learningPath.quarter1.certifications ? `
                                <div class="certifications">
                                    <strong>Certifications:</strong>
                                    ${learningPath.quarter1.certifications.map(cert =>
            `<span class="cert-badge">${cert}</span>`
        ).join('')}
                                </div>
                            ` : ''}
                            <div class="internship-prep">
                                <strong>Internship Prep:</strong> ${learningPath.quarter1.internshipPrep}
                            </div>
                        </div>
                    </div>
                ` : ''}
                
                <!-- Year 1 -->
                ${learningPath.year1 ? `
                    <div class="roadmap-phase long-term">
                        <div class="phase-header">
                            <span class="phase-icon">🎯</span>
                            <h3>Year One Goals</h3>
                        </div>
                        <div class="phase-content">
                            <h4>${learningPath.year1.focus}</h4>
                            ${learningPath.year1.majorMilestones ? `
                                <div class="major-milestones">
                                    ${learningPath.year1.majorMilestones.map(milestone =>
            `<div class="milestone-item">✓ ${milestone}</div>`
        ).join('')}
                                </div>
                            ` : ''}
                            <div class="job-readiness">
                                <strong>Job Readiness:</strong> ${learningPath.year1.jobReadiness}
                            </div>
                        </div>
                    </div>
                ` : ''}
            </div>
            
            <!-- Tips and warnings -->
            <div class="learning-tips">
                ${learningPath.personalizedTips ? `
                    <div class="tips-section">
                        <h3>💡 Personalized Tips for You</h3>
                        <ul>
                            ${learningPath.personalizedTips.map(tip =>
            `<li>${tip}</li>`
        ).join('')}
                        </ul>
                    </div>
                ` : ''}
                
                ${learningPath.commonPitfalls ? `
                    <div class="pitfalls-section">
                        <h3>⚠️ Common Pitfalls to Avoid</h3>
                        <ul>
                            ${learningPath.commonPitfalls.map(pitfall =>
            `<li>${pitfall}</li>`
        ).join('')}
                        </ul>
                    </div>
                ` : ''}
                
                ${learningPath.accelerators ? `
                    <div class="accelerators-section">
                        <h3>🚀 Ways to Accelerate Your Progress</h3>
                        <ul>
                            ${learningPath.accelerators.map(acc =>
            `<li>${acc}</li>`
        ).join('')}
                        </ul>
                    </div>
                ` : ''}
            </div>
        `;

        // Insert after personalized insights
        const insightsSection = document.querySelector('.personalized-insights-section');
        if (insightsSection) {
            insightsSection.parentNode.insertBefore(roadmapSection, insightsSection.nextSibling);
        }
    }

    populateClubs() {
        const clubsContainer = document.getElementById('clubsRow');
        const clubs = this.resultData.clubRecommendations || [];

        console.log('🏛️ Populating recommended clubs:', clubs.length);

        clubsContainer.innerHTML = '';

        clubs.slice(0, 3).forEach((club, index) => {
            const clubCard = this.createClubCard(club, index);
            clubsContainer.appendChild(clubCard);
        });
    }

    createClubCard(club, index) {
        const card = document.createElement('div');
        card.className = 'club-card';
        card.dataset.clubId = club.clubId || club._id || `club-${index}`;

        const isBookmarked = this.bookmarkedClubs.has(club.clubId);

        card.innerHTML = `
            <div class="club-logo">
                <img src="${club.logoUrl || '/assets/default-club-logo.png'}" 
                     alt="${club.clubName || 'Club'}" 
                     onerror="this.src='/assets/default-club-logo.png'">
            </div>
            <div class="bookmark-icon ${isBookmarked ? 'bookmarked' : ''}" 
                 data-club-id="${club.clubId}" 
                 title="Bookmark this club">
                ${isBookmarked ? '★' : '☆'}
            </div>
            <h3 class="club-name">${club.clubName || 'Tech Club'}</h3>
            <p class="club-relevance">${club.careerRelevance || 'Great for your career path'}</p>
            <div class="club-score">
                <span class="score-label">Relevance:</span>
                <span class="score-value">${club.relevanceScore || 85}%</span>
            </div>
            <p class="recommendation-reason">${club.recommendationReason || 'Highly recommended for your interests'}</p>
            ${club.suggestedActions && club.suggestedActions.length > 0 ? `
                <div class="suggested-actions">
                    <strong>Next Steps:</strong>
                    <ul>
                        ${club.suggestedActions.slice(0, 2).map(action =>
            `<li>${action}</li>`
        ).join('')}
                    </ul>
                </div>
            ` : ''}
        `;

        // Add click handler for the card
        card.addEventListener('click', (e) => {
            if (!e.target.classList.contains('bookmark-icon')) {
                window.location.href = `/club/${club.clubId}`;
            }
        });

        return card;
    }

    async populateCareerProgression() {
        const careerName = this.resultData.topMatch?.career;
        const container = document.getElementById('progressionSteps');

        if (!container) {
            console.error('Career progression container not found');
            return;
        }

        console.log('📈 Displaying career progression...');

        // Get static career data
        const careerData = await this.fetchCareerData(careerName);

        if (careerData?.careerProgression && Array.isArray(careerData.careerProgression)) {
            container.innerHTML = '';

            careerData.careerProgression.forEach(step => {
                const levelClass = step.level.toLowerCase().replace(/\s+/g, '-');
                const stepDiv = document.createElement('div');
                stepDiv.className = `progression-item ${levelClass}`;
                stepDiv.innerHTML = `
                <div class="level-badge ${levelClass}">${step.level}</div>
                <div class="progression-content">
                    <h4>${step.title}</h4>
                    <p>${step.years} • ${step.salary}</p>
                </div>
            `;
                container.appendChild(stepDiv);
            });
        } else {
            // Fallback to generic progression
            const fallbackCareer = careerName || 'Tech Professional';
            container.innerHTML = `
            <div class="progression-item entry">
                <div class="level-badge entry">Entry</div>
                <div class="progression-content">
                    <h4>Junior ${fallbackCareer}</h4>
                    <p>0-2 years • $70k-$100k</p>
                </div>
            </div>
            <div class="progression-item mid">
                <div class="level-badge mid">Mid</div>
                <div class="progression-content">
                    <h4>${fallbackCareer}</h4>
                    <p>2-5 years • $100k-$140k</p>
                </div>
            </div>
            <div class="progression-item senior">
                <div class="level-badge senior">Senior</div>
                <div class="progression-content">
                    <h4>Senior ${fallbackCareer}</h4>
                    <p>5+ years • $140k-$200k+</p>
                </div>
            </div>
        `;
        }
    }

    populateCareerMatches() {
        const matchesContainer = document.getElementById('matchesList');
        const matches = this.resultData.allMatches || [];

        console.log('🎯 Populating career matches:', matches.length);

        matchesContainer.innerHTML = '';

        matches.slice(0, 5).forEach((match, index) => {
            const matchItem = this.createMatchItem(match, index);
            matchesContainer.appendChild(matchItem);
        });

        // Animate progress bars
        setTimeout(() => this.animateProgressBars(), 500);
    }

    createMatchItem(match, index) {
        const item = document.createElement('div');
        item.className = 'match-item';

        const percentage = match.percentage || 75;

        item.innerHTML = `
            <div class="match-info">
                <h4>${match.career}</h4>
                <p>${match.category || 'Technology'}</p>
                ${match.marketData ? `
                    <div class="match-market-data">
                        <span class="salary">${match.marketData.avgSalary || 'Competitive'}</span>
                        <span class="growth">${match.marketData.jobGrowth || 'Growing'}</span>
                    </div>
                ` : ''}
            </div>
            <div class="match-score">
                <div class="progress-bar">
                    <div class="progress-fill" data-width="${percentage}"></div>
                </div>
                <span class="percentage">${percentage}%</span>
            </div>
        `;

        return item;
    }

    populateNextSteps() {
        const container = document.getElementById('stepsList');
        const nextSteps = this.resultData.topMatch?.nextSteps || [];

        console.log('✅ Populating next steps:', nextSteps.length);

        container.innerHTML = '';

        nextSteps.slice(0, 3).forEach((step, index) => {
            const stepElement = this.createStepItem(step, index + 1);
            container.appendChild(stepElement);
        });
    }

    createStepItem(step, number) {
        const stepDiv = document.createElement('div');
        stepDiv.className = 'step-item';
        stepDiv.dataset.stepIndex = number - 1;

        const isCompleted = this.completedSteps.has(number - 1);

        stepDiv.innerHTML = `
            <div class="step-number ${isCompleted ? 'completed' : ''}">${isCompleted ? '✓' : number}</div>
            <div class="step-content">
                <h4>${typeof step === 'string' ? step : step.step}</h4>
                ${step.category ? `<span class="step-category ${step.category}">${step.category}</span>` : ''}
                ${step.timeframe ? `<p class="step-timeframe">⏱️ ${step.timeframe}</p>` : ''}
                ${!isCompleted ? `
                    <button class="complete-step-btn" onclick="window.enhancedResults.completeStep(${number - 1})">
                        Mark as Complete
                    </button>
                ` : ''}
            </div>
        `;

        return stepDiv;
    }

    async populateMarketInsights() {
        const container = document.querySelector('.insights-grid');
        const careerName = this.resultData.topMatch?.career;

        if (!container) {
            console.error('Market insights container not found');
            return;
        }

        console.log('📊 Displaying market insights...');

        // Get static career data
        const careerData = await this.fetchCareerData(careerName);

        container.innerHTML = '';

        if (careerData?.marketData) {
            const market = careerData.marketData;

            // Average Salary
            if (market.avgSalary || market.entrySalary) {
                container.innerHTML += `
                <div class="insight-item">
                    <h3>Average Salary</h3>
                    <p class="insight-value">${market.avgSalary || market.entrySalary}</p>
                    <span class="insight-detail">Industry average</span>
                </div>
            `;
            }

            // Job Growth
            if (market.jobGrowth) {
                container.innerHTML += `
                <div class="insight-item">
                    <h3>Job Growth</h3>
                    <p class="insight-value">${market.jobGrowth}</p>
                    <span class="insight-detail">Next 10 years</span>
                </div>
            `;
            }

            // Demand Level
            if (market.demandLevel) {
                container.innerHTML += `
                <div class="insight-item">
                    <h3>Demand Level</h3>
                    <p class="insight-value">${market.demandLevel}</p>
                    <span class="insight-detail">Current market</span>
                </div>
            `;
            }

            // Remote Percentage
            if (market.remotePercentage) {
                container.innerHTML += `
                <div class="insight-item">
                    <h3>Remote Options</h3>
                    <p class="insight-value">${market.remotePercentage}</p>
                    <span class="insight-detail">Remote available</span>
                </div>
            `;
            }
        } else {
            // Fallback data
            container.innerHTML = `
            <div class="insight-item">
                <h3>Average Salary</h3>
                <p class="insight-value">$95k-$140k</p>
                <span class="insight-detail">Industry average</span>
            </div>
            <div class="insight-item">
                <h3>Job Growth</h3>
                <p class="insight-value">+15%</p>
                <span class="insight-detail">Growing field</span>
            </div>
            <div class="insight-item">
                <h3>Demand Level</h3>
                <p class="insight-value">High</p>
                <span class="insight-detail">Current market</span>
            </div>
            <div class="insight-item">
                <h3>Work-Life Balance</h3>
                <p class="insight-value">7.5/10</p>
                <span class="insight-detail">Industry average</span>
            </div>
        `;
        }
    }

    populateUCDavisResources() {
        // First, update the Primary Clubs in the Entry Requirements section
        const primaryClubsContainer = document.getElementById('primaryClubs');
        if (primaryClubsContainer) {
            const clubRecommendations = this.resultData.clubRecommendations || [];

            if (clubRecommendations.length > 0) {
                // Use the actual recommended clubs from clubRecommendations
                primaryClubsContainer.innerHTML = clubRecommendations
                    .slice(0, 3) // Take up to 3 clubs
                    .map(club => {
                        const clubId = club.clubId || club._id || '';
                        const clubName = club.clubName || 'Tech Club';
                        return `<a href="/club/${clubId}" class="club-link">${clubName}</a>`;
                    })
                    .join('');
            }
        }

        // Now handle other UC Davis resources
        const resources = this.resultData.topMatch?.ucDavisResources;

        if (!resources) {
            console.warn('No UC Davis resources data');
            return;
        }

        console.log('🎓 Displaying UC Davis specific resources...');

        // Create UC Davis resources section if it doesn't exist
        const existingSection = document.querySelector('.ucdavis-resources-section');
        if (!existingSection) {
            const resourcesSection = document.createElement('section');
            resourcesSection.className = 'ucdavis-resources-section';
            resourcesSection.innerHTML = `
                <div class="section-header">
                    <h2>UC Davis Resources for You</h2>
                    <span class="section-icon">🐎</span>
                </div>
                
                <div class="resources-grid">
                    ${resources.specificCourses ? `
                        <div class="resource-card">
                            <h3>📚 Recommended Courses</h3>
                            <ul>
                                ${resources.specificCourses.map(course =>
                `<li>${course}</li>`
            ).join('')}
                            </ul>
                        </div>
                    ` : ''}
                    
                    ${resources.professors ? `
                        <div class="resource-card">
                            <h3>👨‍🏫 Connect with Faculty</h3>
                            <ul>
                                ${resources.professors.map(prof =>
                `<li>${prof}</li>`
            ).join('')}
                            </ul>
                        </div>
                    ` : ''}
                    
                    ${resources.researchOpportunities ? `
                        <div class="resource-card">
                            <h3>🔬 Research Opportunities</h3>
                            <ul>
                                ${resources.researchOpportunities.map(opp =>
                `<li>${opp}</li>`
            ).join('')}
                            </ul>
                        </div>
                    ` : ''}
                    
                    ${resources.careerEvents ? `
                        <div class="resource-card">
                            <h3>📅 Upcoming Events</h3>
                            <ul>
                                ${resources.careerEvents.map(event =>
                `<li>${event}</li>`
            ).join('')}
                            </ul>
                        </div>
                    ` : ''}
                    
                    ${resources.alumniConnections ? `
                        <div class="resource-card">
                            <h3>🤝 Alumni Network</h3>
                            <p>${resources.alumniConnections}</p>
                        </div>
                    ` : ''}
                    
                    ${resources.internshipPrograms ? `
                        <div class="resource-card">
                            <h3>💼 Internship Programs</h3>
                            <ul>
                                ${resources.internshipPrograms.map(program =>
                `<li>${program}</li>`
            ).join('')}
                            </ul>
                        </div>
                    ` : ''}
                </div>
            `;

            // Insert at the end of main content
            const mainContent = document.querySelector('.results-container');
            if (mainContent) {
                mainContent.appendChild(resourcesSection);
            }
        }
    }

    // Event Handlers
    setupEventListeners() {
        // Bookmark buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('bookmark-icon') || e.target.closest('.bookmark-icon')) {
                const button = e.target.classList.contains('bookmark-icon') ? e.target : e.target.closest('.bookmark-icon');
                this.handleBookmarkClick(button);
            }
        });

        // Try another quiz button
        const tryAnotherBtn = document.getElementById('tryAnotherLevelBtn');
        if (tryAnotherBtn) {
            tryAnotherBtn.addEventListener('click', () => {
                window.location.href = '/enhanced-quiz';
            });
        }

        // Share results button
        const shareBtn = document.getElementById('shareResultsBtn');
        if (shareBtn) {
            shareBtn.addEventListener('click', () => this.shareResults());
        }

        // Download results button (if exists)
        const downloadBtn = document.getElementById('downloadResultsBtn');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => this.downloadResults());
        }

        // Save results button (if exists)
        const saveBtn = document.getElementById('saveResultsBtn');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.saveResults());
        }
    }

    handleBookmarkClick(button) {
        const clubId = button.dataset.clubId;
        const isCurrentlyBookmarked = this.bookmarkedClubs.has(clubId);

        if (isCurrentlyBookmarked) {
            this.bookmarkedClubs.delete(clubId);
            button.textContent = '☆';
            button.classList.remove('bookmarked');
            this.removeBookmark(clubId);
        } else {
            this.bookmarkedClubs.add(clubId);
            button.textContent = '★';
            button.classList.add('bookmarked');
            this.addBookmark(clubId);
        }
    }

    async addBookmark(clubId) {
        try {
            const response = await fetch('/api/bookmarks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ clubId })
            });

            if (!response.ok) {
                console.warn('Failed to save bookmark to server');
            }
        } catch (error) {
            console.warn('Error saving bookmark:', error);
        }
    }

    async removeBookmark(clubId) {
        try {
            const response = await fetch(`/api/bookmarks/${clubId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                console.warn('Failed to remove bookmark from server');
            }
        } catch (error) {
            console.warn('Error removing bookmark:', error);
        }
    }

    shareResults() {
        const shareData = {
            title: 'My Career Analysis Results',
            text: `I discovered my ideal tech career path! Check out these AI-powered insights.`,
            url: window.location.href
        };

        if (navigator.share) {
            navigator.share(shareData).catch(err =>
                console.log('Share cancelled')
            );
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(shareData.url).then(() => {
                this.showNotification('Results link copied to clipboard!');
            });
        }
    }

    async saveResults() {
        try {
            const response = await fetch('/api/enhanced-results/save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    resultId: this.resultId,
                    resultData: this.resultData
                })
            });

            if (response.ok) {
                this.showNotification('Results saved successfully!');
            }
        } catch (error) {
            console.error('Error saving results:', error);
            this.showError('Failed to save results');
        }
    }

    downloadResults() {
        // Generate PDF or formatted document of results
        const resultsText = this.generateResultsText();
        const blob = new Blob([resultsText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `career-analysis-${Date.now()}.txt`;
        a.click();
        URL.revokeObjectURL(url);
        this.showNotification('Results downloaded!');
    }

    generateResultsText() {
        const topMatch = this.resultData.topMatch;
        return `
Career Analysis Results
========================

Top Career Match: ${topMatch.career}
Match Percentage: ${topMatch.percentage}%
Confidence: ${topMatch.confidence}

Career Description:
${topMatch.reasoning}

Entry Requirements:
- Education: ${topMatch.entryRequirements?.education?.primary || 'Bachelor\'s degree'}
- Key Skills: ${topMatch.entryRequirements?.technicalSkills?.mustHave?.join(', ') || 'Various technical skills'}

Your Unique Advantage:
${topMatch.entryRequirements?.uniqueAdvantage || 'Your unique background and interests position you well for this career.'}

Next Steps:
${topMatch.nextSteps?.map((step, i) => `${i + 1}. ${step}`).join('\n') || 'Follow the personalized roadmap provided.'}

Generated on: ${new Date().toLocaleDateString()}
        `.trim();
    }

    // UI Helper Methods
    animatePercentageCircle(percentage) {
        const circle = document.getElementById('progressCircle');
        if (!circle) return;

        const circumference = 2 * Math.PI * 54;
        const offset = circumference - (percentage / 100) * circumference;

        circle.style.strokeDasharray = circumference;
        circle.style.strokeDashoffset = circumference;

        setTimeout(() => {
            circle.style.transition = 'stroke-dashoffset 1s ease';
            circle.style.strokeDashoffset = offset;
        }, 100);
    }

    animateProgressBars() {
        const progressBars = document.querySelectorAll('.progress-fill');
        progressBars.forEach((bar, index) => {
            const targetWidth = bar.dataset.width + '%';
            setTimeout(() => {
                bar.style.width = targetWidth;
            }, index * 100);
        });
    }

    startAnimations() {
        // Add fade-in animation to sections
        const sections = document.querySelectorAll('.content-section, .clubs-section');
        sections.forEach((section, index) => {
            setTimeout(() => {
                section.style.opacity = '0';
                section.style.transform = 'translateY(20px)';
                section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';

                setTimeout(() => {
                    section.style.opacity = '1';
                    section.style.transform = 'translateY(0)';
                }, 100);
            }, index * 100);
        });
    }

    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : '#ef4444'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000;
            font-weight: 500;
            animation: slideIn 0.3s ease;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    // Action Methods
    showResources(skill) {
        // Open modal or navigate to resources page for specific skill
        console.log('Showing resources for:', skill);
        this.showNotification(`Opening resources for ${skill}...`);
        // Implement modal or navigation logic
    }

    trackProgress(phase, action) {
        console.log(`Tracking progress: ${phase} - ${action}`);
        // Save progress to localStorage or server
        const progress = JSON.parse(localStorage.getItem('learningProgress') || '{}');
        if (!progress[phase]) progress[phase] = [];
        progress[phase].push({ action, completedAt: Date.now() });
        localStorage.setItem('learningProgress', JSON.stringify(progress));
        this.showNotification('Progress saved!');
    }

    completeStep(stepIndex) {
        this.completedSteps.add(stepIndex);
        const stepElement = document.querySelector(`[data-step-index="${stepIndex}"]`);
        if (stepElement) {
            const numberEl = stepElement.querySelector('.step-number');
            numberEl.classList.add('completed');
            numberEl.textContent = '✓';
            const button = stepElement.querySelector('.complete-step-btn');
            if (button) button.remove();
        }
        this.showNotification('Step completed! Great progress!');

        // Save to server or localStorage
        this.saveStepProgress(stepIndex);
    }

    async saveStepProgress(stepIndex) {
        try {
            await fetch('/api/progress/steps', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    resultId: this.resultId,
                    stepIndex,
                    completedAt: Date.now()
                })
            });
        } catch (error) {
            console.error('Error saving step progress:', error);
        }
    }

    // Fallback Sample Data
    getSampleData() {
        return {
            topMatch: {
                career: 'Software Engineering',
                percentage: 85,
                confidence: 'High',
                reasoning: 'Your analytical skills, problem-solving abilities, and interest in technology make you an excellent fit for software engineering.',
                entryRequirements: {
                    education: {
                        primary: 'BS in Computer Science or related field',
                        alternative: 'Bootcamp + strong portfolio',
                        requiredCourses: ['Data Structures', 'Algorithms', 'Web Development']
                    },
                    technicalSkills: {
                        mustHave: ['JavaScript', 'Git', 'Problem Solving'],
                        shouldHave: ['React', 'Node.js', 'Databases']
                    },
                    experience: {
                        immediate: 'Start building projects this week',
                        shortTerm: 'Apply for summer internships by February'
                    },
                    uniqueAdvantage: 'Your creative background gives you a unique perspective on user experience'
                },
                skillGapAnalysis: {
                    overallReadiness: 65,
                    readinessDescription: 'You have a strong foundation. Focus on practical application.',
                    criticalGaps: [
                        {
                            skill: 'Data Structures',
                            importance: 'High',
                            currentLevel: 'Beginner',
                            learningPath: 'Start with arrays and linked lists',
                            timeToLearn: '2-3 months',
                            resources: ['LeetCode', 'AlgoExpert']
                        }
                    ],
                    quickWins: ['Set up GitHub profile', 'Join a coding club', 'Start a daily coding habit']
                },
                nextSteps: [
                    'Complete CS50 course',
                    'Build portfolio website',
                    'Join Developer Community'
                ],
                marketData: {
                    currentDemand: { level: 'Very High', trend: 'Growing' },
                    compensation: {
                        entryLevel: { range: '$85k-$120k', factors: 'Location & skills' }
                    }
                }
            },
            clubRecommendations: [
                {
                    clubId: 'ai-collective',
                    clubName: 'AI Student Collective',
                    logoUrl: '/assets/ai-collective.png',
                    careerRelevance: 'Build AI projects',
                    relevanceScore: 90,
                    recommendationReason: 'Perfect for ML interests'
                }
            ],
            allMatches: [
                { career: 'Software Engineering', category: 'Engineering', percentage: 85 },
                { career: 'Data Science', category: 'Data', percentage: 78 },
                { career: 'Web Development', category: 'Engineering', percentage: 72 }
            ]
        };
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Starting Enhanced Results Page...');
    new EnhancedResultsPage();
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EnhancedResultsPage;
}