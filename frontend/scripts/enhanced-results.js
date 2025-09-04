// =============================================================================
// ENHANCED RESULTS PAGE JAVASCRIPT - TARGET DESIGN
// =============================================================================

class EnhancedResultsPage {
    constructor() {
        this.resultData = null;
        this.bookmarkedClubs = new Set();
        this.init();
    }

    async init() {
        console.log('🎯 Initializing Enhanced Results Page...');

        try {
            await this.loadResults();
            this.setupEventListeners();
            this.populateResults();
            this.startAnimations();
        } catch (error) {
            console.error('💥 Error initializing results page:', error);
            this.showError('Failed to load results. Please try again.');
        }
    }

    async loadResults() {
        try {
            // First try sessionStorage (from quiz submission)
            const storedResults = sessionStorage.getItem('enhancedResults');
            if (storedResults) {
                console.log('📦 Loading results from session storage...');
                this.resultData = JSON.parse(storedResults);
                // Clear it after loading to prevent stale data
                sessionStorage.removeItem('enhancedResults');
                return;
            }

            // Then try URL parameter for saved results
            const urlParams = new URLSearchParams(window.location.search);
            const resultId = urlParams.get('id');

            if (resultId) {
                console.log('📊 Loading results from server...');
                const response = await fetch(`/api/enhanced-results/${resultId}/data`, {
                    credentials: 'same-origin'
                });
                if (response.ok) {
                    const data = await response.json();
                    this.resultData = data.results;
                    return;
                }
            }

            // Fallback to sample data
            console.log('⚠️ Using sample data...');
            this.resultData = this.getSampleData();

        } catch (error) {
            console.error('Error loading results:', error);
            this.resultData = this.getSampleData();
        }
    }

    populateResults() {
        if (!this.resultData) {
            console.error('No result data available');
            return;
        }

        console.log('🎨 Populating results with data:', this.resultData);

        this.populateTopMatch();
        this.populateClubs();
        this.populateCareerProgression();
        this.populateCareerMatches();
        this.populateNextSteps();
        this.populateMarketInsights();
    }

    populateTopMatch() {
        const topMatch = this.resultData.topMatch || this.resultData.results?.topMatch;
        if (!topMatch) return;

        console.log('🥇 Populating top match:', topMatch);

        // Use the actual career name from the AI analysis
        const careerName = topMatch.career || topMatch.careerName || 'ERROR: No career determined';

        document.getElementById('topCareerName').textContent = careerName;
        document.getElementById('topCareerDescription').textContent =
            topMatch.reasoning || topMatch.description ||
            `Based on your responses, ${careerName} aligns perfectly with your interests and skills.`;

        const percentage = topMatch.percentage || 85;
        document.getElementById('matchPercentage').textContent = `${percentage}%`;

        const confidence = topMatch.confidence || percentage;
        const confidenceLevel = confidence >= 80 ? 'High' : confidence >= 60 ? 'Medium' : 'Low';
        document.getElementById('confidenceBadge').textContent = `${confidenceLevel} Confidence`;

        this.animatePercentageCircle(percentage);
    }

    populateClubs() {
        const clubsContainer = document.getElementById('clubsRow');
        const clubs = this.resultData.clubRecommendations ||
            this.resultData.results?.clubRecommendations ||
            this.getDefaultClubs();

        console.log('🏛️ Populating clubs:', clubs);

        clubsContainer.innerHTML = '';

        clubs.slice(0, 3).forEach((club, index) => {
            const clubCard = this.createClubCard(club, index);
            clubsContainer.appendChild(clubCard);
        });
    }

    // enhanced-results.js - Updated createClubCard function

    createClubCard(club, index) {
        const card = document.createElement('div');
        card.className = 'club-card';
        card.dataset.clubId = club._id || club.id || `club-${index}`;

        const isBookmarked = this.bookmarkedClubs.has(club._id || club.id);

        // Get first 2-3 tags from club data
        const clubTags = club.tags || ['technology', 'programming'];
        const displayTags = clubTags.slice(0, 2);

        card.innerHTML = `
        <div class="club-logo">
            <img src="${club.logoUrl || '/assets/default-club-logo.png'}" 
                 alt="${club.name || 'Club'}" 
                 onerror="this.src='/assets/default-club-logo.png'">
        </div>
        <div class="bookmark-icon ${isBookmarked ? 'bookmarked' : ''}" 
             data-club-id="${club._id || club.id}" 
             title="Bookmark this club">
            ${isBookmarked ? '★' : '☆'}
        </div>
        <h3 class="club-name">${club.name || 'Tech Club'}</h3>
        <div class="club-tags">
            ${displayTags.map(tag =>
            `<span class="tag">${tag.toUpperCase()}</span>`
        ).join('')}
        </div>
    `;

        // Add click handler for the card (excluding bookmark icon)
        card.addEventListener('click', (e) => {
            if (!e.target.classList.contains('bookmark-icon')) {
                window.location.href = `/club/${club._id || club.id}`;
            }
        });

        return card;
    }

    formatTag(tag) {
        // Convert tag to display format
        return tag.replace(/-/g, ' ')
            .replace(/\b\w/g, l => l.toUpperCase());
    }

    populateCareerProgression() {
        const container = document.getElementById('progressionSteps');
        const topMatch = this.resultData.topMatch || this.resultData.results?.topMatch;
        const careerName = topMatch?.career || topMatch?.careerName || 'Software Engineering';

        // Use career-specific progression from the AI results
        const progression = topMatch?.careerProgression ||
            this.getCareerSpecificProgression(careerName);

        console.log('📈 Populating career progression for:', careerName);

        container.innerHTML = '';

        progression.forEach((step) => {
            const stepElement = this.createProgressionStep(step, careerName);
            container.appendChild(stepElement);
        });
    }

    getCareerSpecificProgression(careerName) {
        const progressions = {
            'Technical Writing': [
                {
                    level: 'Entry',
                    roles: ['Junior Technical Writer', 'Documentation Specialist', 'Content Developer'],
                    timeline: '0-2 years',
                    salary: { min: 60, max: 85 }
                },
                {
                    level: 'Mid',
                    roles: ['Technical Writer', 'Documentation Lead', 'Senior Content Developer'],
                    timeline: '2-5 years',
                    salary: { min: 85, max: 115 }
                },
                {
                    level: 'Senior',
                    roles: ['Senior Technical Writer', 'Documentation Manager', 'Content Strategy Lead'],
                    timeline: '5+ years',
                    salary: { min: 115, max: 150 }
                }
            ],
            'Software Engineering': [
                {
                    level: 'Entry',
                    roles: ['Junior Developer', 'Software Engineer I', 'Associate Engineer'],
                    timeline: '0-2 years',
                    salary: { min: 85, max: 110 }
                },
                {
                    level: 'Mid',
                    roles: ['Software Engineer II', 'Senior Developer', 'Full Stack Engineer'],
                    timeline: '2-5 years',
                    salary: { min: 110, max: 150 }
                },
                {
                    level: 'Senior',
                    roles: ['Staff Engineer', 'Principal Engineer', 'Engineering Lead'],
                    timeline: '5+ years',
                    salary: { min: 150, max: 220 }
                }
            ],
            'Data Science': [
                {
                    level: 'Entry',
                    roles: ['Data Analyst', 'Junior Data Scientist', 'Analytics Associate'],
                    timeline: '0-2 years',
                    salary: { min: 75, max: 100 }
                },
                {
                    level: 'Mid',
                    roles: ['Data Scientist', 'ML Engineer', 'Senior Analyst'],
                    timeline: '2-5 years',
                    salary: { min: 100, max: 140 }
                },
                {
                    level: 'Senior',
                    roles: ['Senior Data Scientist', 'Data Science Manager', 'ML Lead'],
                    timeline: '5+ years',
                    salary: { min: 140, max: 200 }
                }
            ],
            'UX/UI Design': [
                {
                    level: 'Entry',
                    roles: ['Junior UX Designer', 'UI Designer', 'UX Researcher'],
                    timeline: '0-2 years',
                    salary: { min: 70, max: 95 }
                },
                {
                    level: 'Mid',
                    roles: ['UX Designer', 'Senior UI Designer', 'Product Designer'],
                    timeline: '2-5 years',
                    salary: { min: 95, max: 130 }
                },
                {
                    level: 'Senior',
                    roles: ['Lead UX Designer', 'Design Manager', 'Principal Designer'],
                    timeline: '5+ years',
                    salary: { min: 130, max: 180 }
                }
            ],
            'Product Management': [
                {
                    level: 'Entry',
                    roles: ['Associate Product Manager', 'Product Analyst', 'Junior PM'],
                    timeline: '0-2 years',
                    salary: { min: 90, max: 120 }
                },
                {
                    level: 'Mid',
                    roles: ['Product Manager', 'Senior Product Manager', 'Technical PM'],
                    timeline: '2-5 years',
                    salary: { min: 120, max: 160 }
                },
                {
                    level: 'Senior',
                    roles: ['Principal PM', 'Group Product Manager', 'VP Product'],
                    timeline: '5+ years',
                    salary: { min: 160, max: 250 }
                }
            ],
            'DevOps Engineering': [
                {
                    level: 'Entry',
                    roles: ['Junior DevOps Engineer', 'Cloud Engineer', 'Build Engineer'],
                    timeline: '0-2 years',
                    salary: { min: 80, max: 125 }
                },
                {
                    level: 'Mid',
                    roles: ['DevOps Engineer', 'Site Reliability Engineer', 'Platform Engineer'],
                    timeline: '2-5 years',
                    salary: { min: 125, max: 175 }
                },
                {
                    level: 'Senior',
                    roles: ['Senior DevOps Engineer', 'Principal SRE', 'Infrastructure Architect'],
                    timeline: '5+ years',
                    salary: { min: 175, max: 275 }
                }
            ],
            'Cybersecurity': [
                {
                    level: 'Entry',
                    roles: ['Security Analyst', 'SOC Analyst', 'Junior Security Engineer'],
                    timeline: '0-2 years',
                    salary: { min: 75, max: 105 }
                },
                {
                    level: 'Mid',
                    roles: ['Security Engineer', 'Incident Response Specialist', 'Security Architect'],
                    timeline: '2-5 years',
                    salary: { min: 105, max: 145 }
                },
                {
                    level: 'Senior',
                    roles: ['Senior Security Engineer', 'Security Lead', 'CISO'],
                    timeline: '5+ years',
                    salary: { min: 145, max: 210 }
                }
            ],
            'Machine Learning Engineering': [
                {
                    level: 'Entry',
                    roles: ['Junior ML Engineer', 'AI Developer', 'ML Analyst'],
                    timeline: '0-2 years',
                    salary: { min: 95, max: 125 }
                },
                {
                    level: 'Mid',
                    roles: ['ML Engineer', 'AI Engineer', 'Computer Vision Engineer'],
                    timeline: '2-5 years',
                    salary: { min: 125, max: 165 }
                },
                {
                    level: 'Senior',
                    roles: ['Senior ML Engineer', 'ML Architect', 'AI Research Lead'],
                    timeline: '5+ years',
                    salary: { min: 165, max: 230 }
                }
            ],
            'Web Development': [
                {
                    level: 'Entry',
                    roles: ['Junior Web Developer', 'Frontend Developer', 'WordPress Developer'],
                    timeline: '0-2 years',
                    salary: { min: 65, max: 90 }
                },
                {
                    level: 'Mid',
                    roles: ['Web Developer', 'Full-Stack Developer', 'React Developer'],
                    timeline: '2-5 years',
                    salary: { min: 90, max: 125 }
                },
                {
                    level: 'Senior',
                    roles: ['Senior Web Developer', 'Lead Frontend Engineer', 'Web Architect'],
                    timeline: '5+ years',
                    salary: { min: 125, max: 170 }
                }
            ]
        };

        return progressions[careerName] || progressions['Software Engineering'];
    }



    createProgressionStep(step) {
        const stepDiv = document.createElement('div');
        stepDiv.className = 'progression-item';

        const roles = Array.isArray(step.roles) ? step.roles.join(', ') : step.roles;
        const salary = step.salary ? `${step.salary.min}k - ${step.salary.max}k` :
            step.avgSalary ? `${step.avgSalary.min}k - ${step.avgSalary.max}k` : '';

        const levelClass = step.level.toLowerCase();

        stepDiv.innerHTML = `
            <div class="level-badge ${levelClass}">${step.level || 'Entry'}</div>
            <div class="progression-content">
                <h4>${roles || 'Various roles available'}</h4>
                <p>${step.timeline || step.timeframe || '0-2 years'} ${salary ? '• ' + salary : ''}</p>
            </div>
        `;

        return stepDiv;
    }

    populateCareerMatches() {
        const matchesContainer = document.getElementById('matchesList');
        const matches = this.resultData.allMatches ||
            this.resultData.results?.allMatches ||
            this.getDefaultMatches();

        console.log('🎯 Populating career matches:', matches);

        matchesContainer.innerHTML = '';

        matches.slice(0, 5).forEach((match, index) => {
            const matchItem = this.createMatchItem(match, index);
            matchesContainer.appendChild(matchItem);
        });

        // Animate progress bars after a delay
        setTimeout(() => this.animateProgressBars(), 500);
    }

    createMatchItem(match, index) {
        const item = document.createElement('div');
        item.className = 'match-item';

        const percentage = match.percentage || 75;

        item.innerHTML = `
            <div class="match-info">
                <h4>${match.career || 'Tech Career'}</h4>
                <p>${match.category || 'Technology'}</p>
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
        const topMatch = this.resultData.topMatch || this.resultData.results?.topMatch;
        const careerName = topMatch?.career || topMatch?.careerName || 'Software Engineering';

        // Use career-specific steps
        const steps = topMatch?.nextSteps || this.getCareerSpecificSteps(careerName);

        console.log('✅ Populating next steps for:', careerName);

        container.innerHTML = '';

        steps.slice(0, 3).forEach((step, index) => {
            const stepElement = this.createStepItem(step, index + 1, careerName);
            container.appendChild(stepElement);
        });
    }

    getCareerSpecificSteps(careerName) {
        const stepsMap = {
            'Technical Writing': [
                'Build a portfolio of technical documentation samples',
                'Learn markup languages (Markdown, XML) and documentation tools (MadCap, Confluence)',
                'Join writing clubs and contribute to open-source documentation'
            ],
            'Software Engineering': [
                'Master data structures and algorithms fundamentals',
                'Build 3-5 full-stack projects for your GitHub portfolio',
                'Participate in hackathons and contribute to open source'
            ],
            'Data Science': [
                'Learn Python/R and SQL for data manipulation',
                'Complete machine learning projects with real datasets',
                'Join AI Student Collective and participate in Kaggle competitions'
            ],
            'UX/UI Design': [
                'Create a design portfolio with 3-5 case studies',
                'Master Figma/Sketch and user research methods',
                'Join Design Interactive club for hands-on projects'
            ],
            'Product Management': [
                'Build product specs and roadmaps for practice projects',
                'Learn analytics tools and A/B testing methodologies',
                'Join Product Space @ UC Davis for mentorship'
            ],
            'DevOps Engineering': [
                'Learn Docker, Kubernetes, and CI/CD pipelines',
                'Get AWS/Azure certifications',
                'Contribute to infrastructure automation projects'
            ],
            'Cybersecurity': [
                'Practice on CTF platforms and ethical hacking labs',
                'Get Security+ certification as a starting point',
                'Join Cyber Security Club for hands-on learning'
            ],
            'Machine Learning Engineering': [
                'Master deep learning frameworks (TensorFlow/PyTorch)',
                'Build end-to-end ML projects with deployment',
                'Participate in research projects with faculty'
            ],
            'Web Development': [
                'Master HTML/CSS/JavaScript and modern frameworks',
                'Build responsive websites and progressive web apps',
                'Deploy projects to cloud platforms'
            ]
        };

        return stepsMap[careerName] || stepsMap['Software Engineering'];
    }


    createStepItem(step, number) {
        const stepDiv = document.createElement('div');
        stepDiv.className = 'step-item';

        // Handle both string and object formats
        const stepText = typeof step === 'string' ? step : step.step || step.text;
        const description = step.description || 'Recommended action for your career development';

        stepDiv.innerHTML = `
            <div class="step-number">${number}</div>
            <div class="step-content">
                <h4>${stepText}</h4>
                <p>${description}</p>
            </div>
        `;

        return stepDiv;
    }

    populateMarketInsights() {
        const container = document.getElementById('insightsGrid');
        const topMatch = this.resultData.topMatch || this.resultData.results?.topMatch;
        const careerName = topMatch?.career || topMatch?.careerName || 'Software Engineering';

        const marketData = topMatch?.marketData || this.getCareerSpecificMarketData(careerName);

        console.log('📊 Populating market insights for:', careerName);

        const insights = [
            {
                label: 'Average Salary',
                value: marketData.avgSalary || this.formatSalaryRange(careerName)
            },
            {
                label: 'Job Growth',
                value: marketData.jobGrowthRate || marketData.jobGrowth || this.getGrowthRate(careerName)
            },
            {
                label: 'Annual Openings',
                value: marketData.annualOpenings ?
                    marketData.annualOpenings.toLocaleString() :
                    this.getDefaultAnnualOpenings(careerName) // ✅ Fixed function name
            },
            {
                label: 'Work-Life Balance',
                value: marketData.workLifeBalance || this.getWorkLifeBalance(careerName)
            }
        ];

        container.innerHTML = '';
        insights.forEach(insight => {
            const item = document.createElement('div');
            item.className = 'insight-item';
            item.innerHTML = `
            <h3>${insight.label}</h3>
            <p class="insight-value">${insight.value}</p>
        `;
            container.appendChild(item);
        });
    }

    formatSalaryRange(careerName) {
        const salaryMap = {
            'Technical Writing': '$75k - $125k',
            'Software Engineering': '$110k - $180k',
            'Data Science': '$95k - $165k',
            'UX/UI Design': '$85k - $140k'
        };
        return salaryMap[careerName] || '$85k - $140k';
    }

    getGrowthRate(careerName) {
        const growthMap = {
            'Technical Writing': '+12%',
            'Software Engineering': '+22%',
            'Data Science': '+35%',
            'UX/UI Design': '+13%'
        };
        return growthMap[careerName] || '+15%';
    }

    getDefaultAnnualOpenings(careerName) {
        const openingsMap = {
            'Technical Writing': '5,800',
            'Software Engineering': '189,200',
            'Data Science': '13,500',
            'UX/UI Design': '23,900'
        };
        return openingsMap[careerName] || '12,500';
    }

    getWorkLifeBalance(careerName) {
        const balanceMap = {
            'Technical Writing': '8.5/10',
            'Software Engineering': '7.5/10',
            'Data Science': '7.8/10',
            'UX/UI Design': '8.2/10'
        };
        return balanceMap[careerName] || '8.0/10';
    }
    getCareerSpecificMarketData(careerName) {
        const marketDataMap = {
            'Technical Writing': {
                avgSalary: '$75k - $125k',
                jobGrowthRate: '+12%',
                annualOpenings: 5800,
                workLifeBalance: '8.5/10'
            },
            'Software Engineering': {
                avgSalary: '$110k - $180k',
                jobGrowthRate: '+22%',
                annualOpenings: 189200,
                workLifeBalance: '7.5/10'
            },
            'Data Science': {
                avgSalary: '$95k - $165k',
                jobGrowthRate: '+35%',
                annualOpenings: 13500,
                workLifeBalance: '7.8/10'
            },
            'UX/UI Design': {
                avgSalary: '$85k - $140k',
                jobGrowthRate: '+13%',
                annualOpenings: 23900,
                workLifeBalance: '8.2/10'
            },
            'Product Management': {
                avgSalary: '$120k - $200k',
                jobGrowthRate: '+19%',
                annualOpenings: 31200,
                workLifeBalance: '7.0/10'
            },
            'DevOps Engineering': {
                avgSalary: '$125k - $200k',
                jobGrowthRate: '+25%',
                annualOpenings: 15200,
                workLifeBalance: '7.5/10'
            },
            'Cybersecurity': {
                avgSalary: '$105k - $175k',
                jobGrowthRate: '+32%',
                annualOpenings: 165200,
                workLifeBalance: '7.2/10'
            },
            'Machine Learning Engineering': {
                avgSalary: '$130k - $195k',
                jobGrowthRate: '+40%',
                annualOpenings: 8900,
                workLifeBalance: '7.6/10'
            },
            'Web Development': {
                avgSalary: '$85k - $140k',
                jobGrowthRate: '+13%',
                annualOpenings: 28900,
                workLifeBalance: '7.8/10'
            }
        };

        return marketDataMap[careerName] || marketDataMap['Software Engineering'];
    }

    setupEventListeners() {
        // Bookmark buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('bookmark-icon') || e.target.closest('.bookmark-icon')) {
                const button = e.target.classList.contains('bookmark-icon') ? e.target : e.target.closest('.bookmark-icon');
                this.handleBookmarkClick(button);
            }
        });

        // Action buttons
        const tryAnotherBtn = document.getElementById('tryAnotherLevelBtn');
        if (tryAnotherBtn) {
            tryAnotherBtn.addEventListener('click', () => {
                window.location.href = '/enhanced-quiz';
            });
        }

        const shareBtn = document.getElementById('shareResultsBtn');
        if (shareBtn) {
            shareBtn.addEventListener('click', () => this.shareResults());
        }
    }

    handleBookmarkClick(button) {
        const clubId = button.dataset.clubId;
        const isCurrentlyBookmarked = this.bookmarkedClubs.has(clubId);

        if (isCurrentlyBookmarked) {
            this.bookmarkedClubs.delete(clubId);
            button.textContent = '📌';
            button.classList.remove('bookmarked');
            this.removeBookmark(clubId);
        } else {
            this.bookmarkedClubs.add(clubId);
            button.textContent = '🔖';
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
            title: 'My Enhanced Career Analysis Results',
            text: `I discovered my ideal tech career path! Check out these AI-powered insights.`,
            url: window.location.href
        };

        if (navigator.share) {
            navigator.share(shareData).catch(err =>
                console.log('Share cancelled by user')
            );
        } else {
            // Fallback: copy to clipboard
            const shareText = `${shareData.text} ${shareData.url}`;
            navigator.clipboard.writeText(shareText).then(() => {
                this.showNotification('Results link copied to clipboard!');
            }).catch(() => {
                console.warn('Could not copy to clipboard');
            });
        }
    }

    animatePercentageCircle(percentage) {
        const circle = document.getElementById('progressCircle');
        if (!circle) return;

        const circumference = 2 * Math.PI * 54; // radius = 54
        const offset = circumference - (percentage / 100) * circumference;

        // Start with full offset (empty circle)
        circle.style.strokeDashoffset = circumference;

        // Animate to the target offset
        setTimeout(() => {
            circle.style.strokeDashoffset = offset;
        }, 500);
    }

    animateProgressBars() {
        const progressBars = document.querySelectorAll('.progress-fill');
        progressBars.forEach((bar, index) => {
            const targetWidth = bar.dataset.width + '%';
            setTimeout(() => {
                bar.style.width = targetWidth;
            }, index * 200);
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

    showNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #10b981;
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000;
            font-weight: 500;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    showError(message) {
        console.error('Error:', message);
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            background: #fef2f2;
            border: 1px solid #fecaca;
            color: #dc2626;
            padding: 1rem;
            border-radius: 8px;
            margin: 1rem 0;
            text-align: center;
        `;
        errorDiv.textContent = message;

        const container = document.querySelector('.results-container');
        if (container) {
            container.insertBefore(errorDiv, container.firstChild);
        }
    }

    // Default/Sample Data Methods
    getSampleData() {
        return {
            topMatch: {
                career: 'DevOps Engineering',
                percentage: 78,
                confidence: 'High',
                reasoning: 'Bridge development and operations through automation, infrastructure management, and continuous delivery. Enable teams to deploy software faster and more reliably.',
                careerProgression: [
                    {
                        level: 'Entry',
                        roles: ['Junior DevOps Engineer', 'Cloud Engineer', 'Build Engineer'],
                        timeline: '0-2 years',
                        salary: { min: 80, max: 125 }
                    },
                    {
                        level: 'Mid',
                        roles: ['DevOps Engineer', 'Site Reliability Engineer'],
                        timeline: '2-5 years',
                        salary: { min: 125, max: 175 }
                    },
                    {
                        level: 'Senior',
                        roles: ['Senior DevOps Engineer', 'Principal SRE', 'Infrastructure Architect'],
                        timeline: '5+ years',
                        salary: { min: 175, max: 275 }
                    }
                ],
                nextSteps: [
                    'Explore DevOps Engineering courses',
                    'Join relevant UC Davis clubs',
                    'Connect with Career Center'
                ],
                marketData: {
                    avgSalary: '$125k',
                    jobGrowthRate: '+22%',
                    annualOpenings: 15200,
                    workLifeBalance: '7.5/10'
                }
            },
            allMatches: [
                { career: 'DevOps Engineering', category: 'Engineering', percentage: 78 },
                { career: 'Cyber Security Engineering', category: 'Security', percentage: 77 },
                { career: 'Hardware Engineering', category: 'Engineering', percentage: 75 },
                { career: 'Data Science', category: 'Data', percentage: 60 },
                { career: 'Product Management', category: 'Product', percentage: 48 }
            ],
            clubRecommendations: this.getDefaultClubs()
        };
    }

    getDefaultClubs() {
        return [
            {
                _id: 'ai-collective',
                name: 'AI Student Collective',
                logoUrl: '/assets/aiStudentCollective.png',
                tags: ['artificial-intelligence', 'machine-learning']
            },
            {
                _id: 'code-lab',
                name: '/code lab',
                logoUrl: '/assets/codelab.png',
                tags: ['programming', 'web-development']
            },
            {
                _id: 'cs-tutoring',
                name: 'Computer Science Tutoring Lab',
                logoUrl: '/assets/cs-tutoring.png',
                tags: ['tutoring', 'computer-science']
            }
        ];
    }

    getDefaultMatches() {
        return [
            { career: 'Software Engineering', category: 'Engineering', percentage: 85 },
            { career: 'Data Science', category: 'Data', percentage: 78 },
            { career: 'Web Development', category: 'Engineering', percentage: 72 },
            { career: 'UX Design', category: 'Design', percentage: 65 }
        ];
    }

    getDefaultProgression() {
        return [
            {
                level: 'Entry',
                roles: ['Junior Developer', 'Associate Engineer'],
                timeline: '0-2 years',
                salary: { min: 75, max: 95 }
            },
            {
                level: 'Mid',
                roles: ['Software Engineer', 'Developer'],
                timeline: '2-5 years',
                salary: { min: 95, max: 135 }
            },
            {
                level: 'Senior',
                roles: ['Senior Engineer', 'Tech Lead'],
                timeline: '5+ years',
                salary: { min: 135, max: 200 }
            }
        ];
    }

    getDefaultSteps() {
        return [
            'Master fundamental programming concepts',
            'Build portfolio projects',
            'Join relevant UC Davis tech clubs'
        ];
    }

    getDefaultMarketData() {
        return {
            avgSalary: '$95k - $140k',
            jobGrowthRate: '+15%',
            annualOpenings: 12500,
            workLifeBalance: '8.2/10'
        };
    }
}

// Initialize the page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Enhanced Results Page starting...');
    new EnhancedResultsPage();
});

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EnhancedResultsPage;
}