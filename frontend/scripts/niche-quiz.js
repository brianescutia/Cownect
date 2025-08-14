// =============================================================================
// NICHE QUIZ FRONTEND ENGINE - DYNAMIC RESULTS VERSION
// =============================================================================
// Save as frontend/scripts/niche-quiz.js

//  GLOBAL STATE MANAGEMENT
const QuizState = {
    currentScreen: 'intro',
    selectedLevel: null,
    questions: [],
    currentQuestionIndex: 0,
    answers: [],
    startTime: null,
    questionStartTime: null,
    results: null,
    sortableInstances: []
};

//  WAIT FOR PAGE TO LOAD
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Initializing Niche Quiz...');

    try {
        await initializeQuiz();
        setupEventListeners();
        console.log('✅ Quiz initialized successfully');
    } catch (error) {
        console.error('💥 Quiz initialization error:', error);
        showError('Failed to initialize quiz. Please refresh the page.');
    }
});

// =============================================================================
// INITIALIZATION FUNCTIONS
// =============================================================================

async function initializeQuiz() {
    try {
        const response = await fetch('/api/quiz/intro');
        if (response.ok) {
            const introData = await response.json();
            populateIntroData(introData);
        }
    } catch (error) {
        console.warn('⚠️ Could not load intro data, using defaults:', error);
    }
}

function populateIntroData(data) {
    if (data.levels) {
        data.levels.forEach(levelData => {
            const levelCard = document.querySelector(`[data-level="${levelData.level}"]`);
            if (levelCard) {
                levelCard.querySelector('h3').textContent = levelData.title;
                levelCard.querySelector('.level-description').textContent = levelData.description;
                levelCard.querySelector('.question-count').textContent = `${levelData.questionCount} questions`;
                levelCard.querySelector('.duration').textContent = levelData.duration;
            }
        });
    }
}

function setupEventListeners() {
    document.querySelectorAll('.select-level-btn').forEach(btn => {
        btn.addEventListener('click', handleLevelSelection);
    });

    document.getElementById('previousBtn')?.addEventListener('click', previousQuestion);
    document.getElementById('nextBtn')?.addEventListener('click', nextQuestion);

    document.getElementById('shareResultsBtn')?.addEventListener('click', shareResults);
    document.getElementById('retakeQuizBtn')?.addEventListener('click', retakeQuiz);
    document.getElementById('exploreClubsBtn')?.addEventListener('click', exploreClubs);
    document.getElementById('saveToDashboardBtn')?.addEventListener('click', saveToDashboard);

    console.log('🔗 Event listeners set up');
}

// =============================================================================
// LEVEL SELECTION & QUIZ START
// =============================================================================

async function handleLevelSelection(event) {
    const levelCard = event.target.closest('.level-card');
    const level = levelCard.dataset.level;

    console.log(`📚 Selected level: ${level}`);

    QuizState.selectedLevel = level;
    QuizState.startTime = Date.now();

    // Visual feedback
    levelCard.style.transform = 'scale(0.95)';
    setTimeout(() => levelCard.style.transform = '', 150);

    try {
        showLoading('Loading quiz questions...');
        await loadQuizQuestions(level);
        startQuiz();
    } catch (error) {
        console.error('💥 Error starting quiz:', error);
        showError('Failed to load quiz questions. Please try again.');
        hideLoading();
    }
}

async function loadQuizQuestions(level) {
    console.log(`📝 Loading questions for level: ${level}`);

    const response = await fetch(`/api/quiz/questions/${level}`);
    if (!response.ok) {
        throw new Error(`Failed to load questions: ${response.status}`);
    }

    const data = await response.json();
    QuizState.questions = data.questions;
    QuizState.answers = Array(data.questions.length).fill(null);

    console.log(`✅ Loaded ${QuizState.questions.length} questions`);
}

function startQuiz() {
    console.log('🎯 Starting quiz...');

    hideLoading();
    switchScreen('questions');
    QuizState.currentQuestionIndex = 0;
    displayCurrentQuestion();
    updateProgress();
}

// =============================================================================
// QUESTION DISPLAY & INTERACTION
// =============================================================================

function displayCurrentQuestion() {
    const question = QuizState.questions[QuizState.currentQuestionIndex];
    if (!question) {
        console.error('❌ No question found at index:', QuizState.currentQuestionIndex);
        return;
    }

    console.log(`📋 Displaying question ${QuizState.currentQuestionIndex + 1}: ${question.questionText}`);

    document.getElementById('questionText').textContent = question.questionText;
    document.getElementById('currentQuestion').textContent = QuizState.currentQuestionIndex + 1;
    document.getElementById('totalQuestions').textContent = QuizState.questions.length;

    createSortableOptions(question.options);
    updateNavigationButtons();
    startQuestionTimer();
    QuizState.questionStartTime = Date.now();
}

function createSortableOptions(options) {
    const container = document.getElementById('sortableOptions');
    const template = document.getElementById('optionTemplate');

    container.innerHTML = '';

    QuizState.sortableInstances.forEach(instance => {
        if (instance.destroy) instance.destroy();
    });
    QuizState.sortableInstances = [];

    const shuffledOptions = [...options].sort(() => Math.random() - 0.5);

    shuffledOptions.forEach((option, index) => {
        const optionElement = template.content.cloneNode(true);
        const optionDiv = optionElement.querySelector('.sortable-option');

        optionDiv.dataset.optionId = option.id;
        optionDiv.querySelector('.option-title').textContent = option.text;

        if (option.description) {
            optionDiv.querySelector('.option-description').textContent = option.description;
        } else {
            optionDiv.querySelector('.option-description').style.display = 'none';
        }

        optionDiv.querySelector('.rank-number').textContent = index + 1;
        container.appendChild(optionElement);
    });

    const sortableInstance = new Sortable(container, {
        animation: 300,
        ghostClass: 'sortable-ghost',
        dragClass: 'sortable-drag',
        onUpdate: function (evt) {
            updateRankNumbers();
            updateNavigationButtons();
            document.getElementById('nextBtn').disabled = false;
        }
    });

    QuizState.sortableInstances.push(sortableInstance);
    console.log(`✅ Created ${shuffledOptions.length} sortable options`);
}

function updateRankNumbers() {
    const options = document.querySelectorAll('.sortable-option');
    options.forEach((option, index) => {
        const rankElement = option.querySelector('.rank-number');
        rankElement.textContent = index + 1;

        const rankDiv = option.querySelector('.option-rank');
        if (index === 0) {
            rankDiv.style.background = 'linear-gradient(135deg, #27ae60, #2ecc71)';
        } else if (index === options.length - 1) {
            rankDiv.style.background = 'linear-gradient(135deg, #e74c3c, #f39c12)';
        } else {
            rankDiv.style.background = 'linear-gradient(135deg, #5F96C5, #4a8bc2)';
        }
    });
}

function updateNavigationButtons() {
    const prevBtn = document.getElementById('previousBtn');
    const nextBtn = document.getElementById('nextBtn');

    prevBtn.disabled = QuizState.currentQuestionIndex === 0;

    const hasAnswer = QuizState.answers[QuizState.currentQuestionIndex] !== null;
    const hasRanking = document.querySelectorAll('.sortable-option').length > 0;
    nextBtn.disabled = !hasAnswer && !hasRanking;

    if (QuizState.currentQuestionIndex === QuizState.questions.length - 1) {
        nextBtn.textContent = 'Finish Quiz →';
        nextBtn.classList.add('finish-btn');
    } else {
        nextBtn.textContent = 'Next →';
        nextBtn.classList.remove('finish-btn');
    }
}

function updateProgress() {
    const progress = ((QuizState.currentQuestionIndex + 1) / QuizState.questions.length) * 100;
    document.getElementById('progressFill').style.width = `${progress}%`;
}

function toggleQuizCard(cardId) {
    const content = document.getElementById(`${cardId}-content`);
    const button = document.getElementById(`${cardId}-btn`);

    if (!content || !button) {
        console.warn(`Card elements not found for: ${cardId}`);
        return;
    }

    const isCollapsed = content.classList.contains('collapsed');

    if (isCollapsed) {
        // Expand the card
        content.classList.remove('collapsed');
        button.textContent = '−';
        button.classList.remove('collapsed');
        console.log(`Expanded card: ${cardId}`);
    } else {
        // Collapse the card
        content.classList.add('collapsed');
        button.textContent = '+';
        button.classList.add('collapsed');
        console.log(`Collapsed card: ${cardId}`);
    }
}


// =============================================================================
// QUESTION TIMER
// =============================================================================

let questionTimerInterval;

function startQuestionTimer() {
    clearInterval(questionTimerInterval);
    let seconds = 0;

    questionTimerInterval = setInterval(() => {
        seconds++;
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        const timeString = `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;

        const timerElement = document.getElementById('questionTimer');
        if (timerElement) {
            timerElement.textContent = timeString;
        }
    }, 1000);
}

function stopQuestionTimer() {
    clearInterval(questionTimerInterval);
}

// =============================================================================
// QUESTION NAVIGATION
// =============================================================================

function nextQuestion() {
    saveCurrentAnswer();

    if (QuizState.currentQuestionIndex < QuizState.questions.length - 1) {
        QuizState.currentQuestionIndex++;
        displayCurrentQuestion();
        updateProgress();
    } else {
        finishQuiz();
    }
}

function previousQuestion() {
    if (QuizState.currentQuestionIndex > 0) {
        saveCurrentAnswer();
        QuizState.currentQuestionIndex--;
        displayCurrentQuestion();
        updateProgress();
        restorePreviousAnswer();
    }
}

function saveCurrentAnswer() {
    const options = document.querySelectorAll('.sortable-option');
    const ranking = Array.from(options).map(option => parseInt(option.dataset.optionId));
    const timeTaken = QuizState.questionStartTime ?
        Math.round((Date.now() - QuizState.questionStartTime) / 1000) : 30;

    QuizState.answers[QuizState.currentQuestionIndex] = {
        questionId: QuizState.questions[QuizState.currentQuestionIndex].id,
        ranking: ranking,
        timeTaken: timeTaken
    };

    console.log(`💾 Saved answer for question ${QuizState.currentQuestionIndex + 1}:`,
        QuizState.answers[QuizState.currentQuestionIndex]);
}

function restorePreviousAnswer() {
    const previousAnswer = QuizState.answers[QuizState.currentQuestionIndex];
    if (!previousAnswer) return;

    const container = document.getElementById('sortableOptions');
    const options = Array.from(container.children);

    const sortedOptions = options.sort((a, b) => {
        const aIndex = previousAnswer.ranking.indexOf(parseInt(a.dataset.optionId));
        const bIndex = previousAnswer.ranking.indexOf(parseInt(b.dataset.optionId));
        return aIndex - bIndex;
    });

    sortedOptions.forEach(option => container.appendChild(option));
    updateRankNumbers();

    console.log(`🔄 Restored previous answer for question ${QuizState.currentQuestionIndex + 1}`);
}

// =============================================================================
// QUIZ COMPLETION & SUBMISSION - UPDATED FOR DYNAMIC RESULTS
// =============================================================================

async function finishQuiz() {
    console.log('🏁 Finishing quiz...');

    saveCurrentAnswer();
    stopQuestionTimer();

    const completionTime = Math.round((Date.now() - QuizState.startTime) / 1000 / 60);

    switchScreen('loading');
    animateLoading();

    try {
        const submission = {
            level: QuizState.selectedLevel,
            answers: QuizState.answers.filter(answer => answer !== null),
            completionTime: completionTime
        };

        console.log('📤 Submitting quiz for dynamic scoring:', submission);

        const response = await fetch('/api/quiz/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(submission)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Server error (${response.status}): ${errorText}`);
        }

        const data = await response.json();

        if (!data.success || !data.results) {
            throw new Error('Invalid response format from server');
        }

        QuizState.results = data.results;

        console.log('🎉 Received dynamic quiz results:', QuizState.results);

        // Small delay for better UX
        await new Promise(resolve => setTimeout(resolve, 2000));

        displayResults();

    } catch (error) {
        console.error('💥 Error submitting quiz:', error);

        // Show error message instead of fallback data
        showError(`Failed to calculate results: ${error.message}. Please try again.`);

        // Return to quiz intro after a delay
        setTimeout(() => {
            retakeQuiz();
        }, 3000);
    }
}

function animateLoading() {
    const loadingTexts = [
        'Analyzing your responses...',
        'Calculating career matches...',
        'Finding your perfect tech niche...',
        'Generating personalized recommendations...',
        'Almost ready!'
    ];

    let textIndex = 0;
    const loadingTextElement = document.getElementById('loadingText');

    const textInterval = setInterval(() => {
        if (textIndex < loadingTexts.length) {
            loadingTextElement.textContent = loadingTexts[textIndex];
            textIndex++;
        } else {
            clearInterval(textInterval);
        }
    }, 600);
}

// =============================================================================
// RESULTS DISPLAY - UPDATED FOR DYNAMIC DATA
// =============================================================================

function displayResults() {
    console.log('🎉 Displaying dynamic quiz results');

    switchScreen('results');

    if (!QuizState.results) {
        showError('No results available');
        return;
    }

    displayTopMatch();
    displayCareerProgression();
    displayMarketData();
    displayAllMatches();
    displayNextSteps();
    displayRecommendedClubs();
    animateResults();
}

function displayTopMatch() {
    const topMatch = QuizState.results.topMatch;
    if (!topMatch) return;

    console.log(`🥇 Displaying top match: ${topMatch.career} (${topMatch.percentage}%)`);

    document.getElementById('topCareerName').textContent = topMatch.career;
    document.getElementById('topCareerDescription').textContent = topMatch.description;
    document.getElementById('matchPercentage').textContent = `${topMatch.percentage}%`;

    const confidenceBadge = document.getElementById('confidenceBadge');
    confidenceBadge.textContent = `${topMatch.confidence} Confidence`;
    confidenceBadge.className = `confidence-badge confidence-${topMatch.confidence.toLowerCase()}`;

    animatePercentageCircle(topMatch.percentage);
}

function displayCareerProgression() {
    const progression = QuizState.results.topMatch.careerProgression;
    if (!progression || !Array.isArray(progression)) return;

    const timeline = document.getElementById('progressionTimeline');
    timeline.innerHTML = '';

    progression.forEach((step, index) => {
        const stepDiv = document.createElement('div');
        stepDiv.className = 'progression-step';
        stepDiv.innerHTML = `
            <div class="step-level">${step.level}</div>
            <div class="step-content">
                <h4 class="step-roles">${Array.isArray(step.roles) ? step.roles.join(', ') : step.roles}</h4>
                <p class="step-timeline">${step.timeline || step.yearsExperience}</p>
                ${step.salary || step.avgSalary ?
                `<p class="step-salary">$${(step.salary?.min || step.avgSalary?.min)}k - $${(step.salary?.max || step.avgSalary?.max)}k</p>` : ''}
            </div>
        `;
        timeline.appendChild(stepDiv);
    });

    console.log(`✅ Displayed ${progression.length} progression steps`);
}

function displayMarketData() {
    const marketData = QuizState.results.topMatch.marketData;
    if (!marketData) return;

    const elements = {
        avgSalary: marketData.avgSalary || `$${marketData.salary?.min || 70}k - $${marketData.salary?.max || 120}k`,
        jobGrowth: marketData.jobGrowthRate || marketData.growthRate,
        annualOpenings: marketData.annualOpenings ? marketData.annualOpenings.toLocaleString() : 'N/A',
        workLifeBalance: marketData.workLifeBalance || (marketData.workLifeBalance ? `${marketData.workLifeBalance}/10` : 'N/A')
    };

    Object.entries(elements).forEach(([key, value]) => {
        const element = document.getElementById(key);
        if (element && value) {
            element.textContent = value;
        }
    });

    console.log('💼 Displayed market data');
}

function displayAllMatches() {
    const matches = QuizState.results.allMatches;
    if (!matches || !Array.isArray(matches)) {
        console.warn('⚠️ No career matches data available');
        return;
    }

    const chart = document.getElementById('matchesChart');
    if (!chart) return;

    chart.innerHTML = '';

    matches.slice(0, 8).forEach((match, index) => {
        const barDiv = document.createElement('div');
        barDiv.className = 'match-bar';

        barDiv.innerHTML = `
            <div class="match-info">
                <span class="match-name">${match.career}</span>
                <span class="match-category">${match.category}</span>
            </div>
            <div class="match-progress">
                <div class="match-fill" style="--match-width: ${match.percentage}%"></div>
                <span class="match-percent">${match.percentage}%</span>
            </div>
        `;

        chart.appendChild(barDiv);

        setTimeout(() => {
            barDiv.style.animation = 'slideInLeft 0.5s ease-out';
        }, index * 100);
    });

    console.log(`✅ Displayed ${matches.length} career matches with dynamic percentages`);
}

function displayNextSteps() {
    const nextSteps = QuizState.results.topMatch.nextSteps;
    if (!nextSteps || !Array.isArray(nextSteps)) {
        console.warn('⚠️ No next steps data available');
        return;
    }

    const stepsList = document.getElementById('nextStepsList');
    if (!stepsList) return;

    stepsList.innerHTML = '';

    nextSteps.forEach((step, index) => {
        const stepDiv = document.createElement('div');
        stepDiv.className = 'step-item';
        stepDiv.innerHTML = `
            <div class="step-number">${index + 1}</div>
            <div class="step-content">
                <h4 class="step-title">${step}</h4>
                <p class="step-description">Recommended action to advance your career in this field</p>
            </div>
        `;
        stepsList.appendChild(stepDiv);
    });

    console.log(`✅ Displayed ${nextSteps.length} personalized next steps`);
}

function displayRecommendedClubs() {
    let clubs = QuizState.results.topMatch.recommendedClubs;

    // Fallback clubs for UC Davis - only if no clubs are provided
    if (!clubs || clubs.length === 0) {
        clubs = [
            {
                name: "#include",
                description: "Build real-world coding projects with fellow students.",
                logoUrl: "../assets/include.png",
                _id: "include"
            },
            {
                name: "AI Student Collective",
                description: "Dive into machine learning, NLP, and computer vision.",
                logoUrl: "../assets/aiStudentCollective.png",
                _id: "ai-collective"
            },
            {
                name: "AggieWorks",
                description: "Hands-on with electronics, microcontrollers, and sensors.",
                logoUrl: "../assets/aggieworks.png",
                _id: "aggieworks"
            }
        ];
    }

    const clubsGrid = document.getElementById('recommendedClubsGrid');
    if (!clubsGrid) return;

    clubsGrid.innerHTML = '';

    clubs.forEach(club => {
        const clubDiv = document.createElement('div');
        clubDiv.className = 'recommended-club-card';
        clubDiv.innerHTML = `
            <img class="club-logo" src="${club.logoUrl || '/assets/default-club-logo.png'}" alt="${club.name} Logo" />
            <div class="club-info">
                <h4 class="club-name">${club.name}</h4>
                <p class="club-description">${club.description || 'Explore this club to advance your career goals'}</p>
                <button class="view-club-btn" onclick="window.location.href='/tech-clubs'">View Club</button>
            </div>
        `;
        clubsGrid.appendChild(clubDiv);
    });

    console.log(`✅ Displayed ${clubs.length} recommended clubs`);
}

// =============================================================================
// ANIMATION FUNCTIONS
// =============================================================================

function animatePercentageCircle(percentage) {
    const circle = document.querySelector('.progress-ring__circle');
    if (!circle) return;

    const radius = circle.r.baseVal.value;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percentage / 100) * circumference;

    circle.style.strokeDasharray = `${circumference} ${circumference}`;
    circle.style.strokeDashoffset = circumference;

    setTimeout(() => {
        circle.style.transition = 'stroke-dashoffset 1s ease-out';
        circle.style.strokeDashoffset = offset;
    }, 500);
}

function animateResults() {
    const elements = [
        '.top-match-card',
        '.career-progression',
        '.market-data',
        '.all-matches',
        '.next-steps',
        '.recommended-clubs'
    ];

    elements.forEach((selector, index) => {
        const element = document.querySelector(selector);
        if (element) {
            setTimeout(() => {
                element.style.animation = 'fadeInUp 0.6s ease-out';
            }, index * 200);
        }
    });
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

function switchScreen(screenName) {
    const screens = ['quizIntro', 'quizQuestions', 'quizLoading', 'quizResults'];
    screens.forEach(screen => {
        const element = document.getElementById(screen);
        if (element) {
            element.style.display = 'none';
        }
    });

    const targetScreen = document.getElementById(`quiz${screenName.charAt(0).toUpperCase() + screenName.slice(1)}`);
    if (targetScreen) {
        targetScreen.style.display = 'block';
    }

    QuizState.currentScreen = screenName;
    console.log(`📺 Switched to screen: ${screenName}`);
}

function showLoading(message = 'Loading...') {
    const loadingText = document.getElementById('loadingText');
    if (loadingText) {
        loadingText.textContent = message;
    }
    switchScreen('loading');
}

function hideLoading() {
    // Loading screen will be hidden when switching to another screen
}

function showError(message) {
    console.error('❌ Quiz Error:', message);
    alert(`Error: ${message}`);
}

// =============================================================================
// RESULT ACTION HANDLERS
// =============================================================================

function shareResults() {
    console.log('🔗 Sharing results...');

    if (!QuizState.results) {
        showError('No results to share');
        return;
    }

    const shareData = {
        title: 'My Tech Niche Quiz Results',
        text: `I'm ${QuizState.results.topMatch.percentage}% matched with ${QuizState.results.topMatch.career}! Find your tech niche at UC Davis.`,
        url: window.location.href
    };

    if (navigator.share) {
        navigator.share(shareData).catch(err => console.log('Share cancelled'));
    } else {
        const shareText = `${shareData.text} ${shareData.url}`;
        navigator.clipboard.writeText(shareText).then(() => {
            alert('Results copied to clipboard!');
        }).catch(() => {
            alert('Unable to share results. Please copy the URL manually.');
        });
    }
}

function retakeQuiz() {
    console.log('🔄 Retaking quiz...');

    QuizState.currentQuestionIndex = 0;
    QuizState.answers = [];
    QuizState.results = null;
    QuizState.startTime = null;

    stopQuestionTimer();
    switchScreen('intro');
}

function exploreClubs() {
    console.log('🏛️ Exploring clubs...');
    window.location.href = '/tech-clubs';
}

function saveToDashboard() {
    console.log('💾 Saving to dashboard...');
    alert('Results saved to your dashboard! You can view them anytime from your account.');
}

// =============================================================================
// ERROR HANDLING & KEYBOARD SHORTCUTS
// =============================================================================


document.addEventListener('DOMContentLoaded', () => {
    console.log('🔧 Initializing collapsible cards...');

    // Make sure all cards start expanded by default
    const cardIds = ['career-progression', 'next-steps', 'all-matches', 'market-data'];

    cardIds.forEach(cardId => {
        const content = document.getElementById(`${cardId}-content`);
        const button = document.getElementById(`${cardId}-btn`);

        if (content && button) {
            // Ensure cards start expanded
            content.classList.remove('collapsed');
            button.textContent = '−';
            button.classList.remove('collapsed');
        }
    });

    console.log('✅ Collapsible cards initialized');
});

window.toggleQuizCard = toggleQuizCard;

window.addEventListener('error', (event) => {
    console.error('🚨 Global error:', event.error);

    if (QuizState.currentScreen === 'questions' && QuizState.answers.length > 0) {
        const shouldRecover = confirm('An error occurred. Would you like to try recovering your progress?');
        if (shouldRecover) {
            try {
                displayCurrentQuestion();
            } catch (recoveryError) {
                console.error('💥 Recovery failed:', recoveryError);
                showError('Unable to recover. Please start over.');
                retakeQuiz();
            }
        }
    }
});

document.addEventListener('keydown', (event) => {
    if (QuizState.currentScreen !== 'questions') return;

    switch (event.key) {
        case 'ArrowLeft':
            if (!document.getElementById('previousBtn').disabled) {
                previousQuestion();
            }
            break;
        case 'ArrowRight':
        case 'Enter':
            if (!document.getElementById('nextBtn').disabled) {
                nextQuestion();
            }
            break;
        case 'Escape':
            const shouldExit = confirm('Are you sure you want to exit the quiz? Your progress will be lost.');
            if (shouldExit) {
                retakeQuiz();
            }
            break;
    }
});

window.addEventListener('beforeunload', (event) => {
    if (QuizState.currentScreen === 'questions' && QuizState.answers.some(a => a !== null)) {
        event.preventDefault();
        event.returnValue = 'You have unsaved quiz progress. Are you sure you want to leave?';
        return event.returnValue;
    }
});

function goToDashboard() {
    window.location.href = '/dashboard';
}

// Add click handlers for result action buttons
document.addEventListener('DOMContentLoaded', () => {
    // Share Results
    const shareBtn = document.getElementById('shareResultsBtn');
    if (shareBtn) {
        shareBtn.addEventListener('click', () => {
            if (navigator.share) {
                navigator.share({
                    title: 'My Tech Career Quiz Results',
                    text: 'I just discovered my ideal tech career path!',
                    url: window.location.href
                });
            } else {
                // Fallback: copy to clipboard
                navigator.clipboard.writeText(window.location.href);
                alert('Results link copied to clipboard!');
            }
        });
    }

    // Retake Quiz
    const retakeBtn = document.getElementById('retakeQuizBtn');
    if (retakeBtn) {
        retakeBtn.addEventListener('click', () => {
            location.reload();
        });
    }

    // Explore Clubs
    const exploreBtn = document.getElementById('exploreClubsBtn');
    if (exploreBtn) {
        exploreBtn.addEventListener('click', () => {
            window.location.href = '/tech-clubs';
        });
    }

    // Save to Dashboard
    const saveBtn = document.getElementById('saveToDashboardBtn');
    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            // You can implement this later to save results to user profile
            alert('Results saved to your dashboard! 💾');
        });
    }
});

// Make functions globally available
window.goToDashboard = goToDashboard;

console.log('🎯 Quiz collapsible cards script loaded!');

// =============================================================================
// DEBUG FUNCTIONS
// =============================================================================

window.debugQuiz = function () {
    console.log('🐛 Quiz Debug Info:');
    console.log('  Current screen:', QuizState.currentScreen);
    console.log('  Selected level:', QuizState.selectedLevel);
    console.log('  Current question:', QuizState.currentQuestionIndex);
    console.log('  Total questions:', QuizState.questions.length);
    console.log('  Answers collected:', QuizState.answers.filter(a => a !== null).length);
    console.log('  Quiz state:', QuizState);
};

console.log('✅ Niche Quiz Engine loaded with dynamic results support');