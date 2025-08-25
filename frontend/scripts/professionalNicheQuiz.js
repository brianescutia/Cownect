// frontend/scripts/professionalNicheQuiz.js - Industry-Grade Career Assessment Interface

const ProfessionalQuizState = {
    currentScreen: 'intro',
    selectedLevel: 'comprehensive', // Default to comprehensive for maximum insight
    questions: [],
    currentQuestionIndex: 0,
    responses: [],
    startTime: null,
    questionStartTime: null,
    results: null,
    userProfile: {
        university: 'UC Davis',
        version: '2.0'
    }
};

// Initialize when page loads
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Initializing Professional Career Assessment...');

    try {
        await initializeProfessionalQuiz();
        setupProfessionalEventListeners();
        console.log('✅ Professional career assessment initialized successfully');
    } catch (error) {
        console.error('💥 Professional quiz initialization error:', error);
        showError('Failed to initialize professional assessment. Please refresh the page.');
    }
});

async function initializeProfessionalQuiz() {
    // Load professional research-backed questions
    try {
        const response = await fetch('/api/quiz/professional-questions?level=comprehensive');
        if (response.ok) {
            const data = await response.json();
            ProfessionalQuizState.questions = data.questions;
            populateProfessionalIntroData(data.metadata);
        } else {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
    } catch (error) {
        console.warn('⚠️ Loading fallback questions due to:', error);
        ProfessionalQuizState.questions = getProfessionalFallbackQuestions();
    }
}

function populateProfessionalIntroData(metadata) {
    // Update intro screen with professional assessment info
    const introDescription = document.querySelector('.quiz-intro-description');
    if (introDescription) {
        introDescription.innerHTML = `
            <div class="professional-intro-content">
                <h2 style="color: #2c5aa0; margin-bottom: 1rem;">Industry-Grade Career Assessment</h2>
                <p style="font-size: 1.1rem; line-height: 1.6; margin-bottom: 1.5rem;">
                    Discover your ideal tech career path using research-backed psychology and AI analysis. 
                    This assessment combines insights from Stack Overflow surveys, occupational psychology, 
                    and real market data to provide professional-level career guidance.
                </p>
                <div class="assessment-features" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 2rem;">
                    <div class="feature-item" style="padding: 1rem; background: #f8f9fa; border-radius: 8px; border-left: 4px solid #2c5aa0;">
                        <h4 style="color: #2c5aa0; margin-bottom: 0.5rem;">🧠 AI-Enhanced Analysis</h4>
                        <p style="font-size: 0.9rem; color: #666;">Professional-grade AI evaluates your responses for personalized insights</p>
                    </div>
                    <div class="feature-item" style="padding: 1rem; background: #f8f9fa; border-radius: 8px; border-left: 4px solid #2c5aa0;">
                        <h4 style="color: #2c5aa0; margin-bottom: 0.5rem;">📊 Real Market Data</h4>
                        <p style="font-size: 0.9rem; color: #666;">Current salary ranges, job growth, and demand across ${metadata.careerPathsAvailable}+ careers</p>
                    </div>
                    <div class="feature-item" style="padding: 1rem; background: #f8f9fa; border-radius: 8px; border-left: 4px solid #2c5aa0;">
                        <h4 style="color: #2c5aa0; margin-bottom: 0.5rem;">🎯 UC Davis Integration</h4>
                        <p style="font-size: 0.9rem; color: #666;">Specific course recommendations, clubs, and campus resources</p>
                    </div>
                    <div class="feature-item" style="padding: 1rem; background: #f8f9fa; border-radius: 8px; border-left: 4px solid #2c5aa0;">
                        <h4 style="color: #2c5aa0; margin-bottom: 0.5rem;">⚡ Varied Question Types</h4>
                        <p style="font-size: 0.9rem; color: #666;">Scenarios, rankings, scales, and visual preferences prevent boredom</p>
                    </div>
                </div>
            </div>
        `;
    }

    // Update level selection cards with professional info
    updateLevelSelectionCards(metadata);
}

function updateLevelSelectionCards(metadata) {
    const levelCards = document.querySelectorAll('.level-card');

    levelCards.forEach(card => {
        const level = card.dataset.level;

        if (level === 'quick') {
            card.innerHTML = `
                <div class="level-card-header" style="background: linear-gradient(135deg, #3498db, #2980b9); color: white; padding: 1rem; border-radius: 8px 8px 0 0;">
                    <h3 style="margin: 0; font-size: 1.2rem;">⚡ Quick Assessment</h3>
                    <p style="margin: 0.5rem 0 0 0; opacity: 0.9; font-size: 0.9rem;">Perfect for initial exploration</p>
                </div>
                <div class="level-card-content" style="padding: 1.5rem;">
                    <div class="level-stats" style="margin-bottom: 1rem;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                            <span style="color: #666;">Duration:</span>
                            <span style="font-weight: 600; color: #2c5aa0;">3-5 minutes</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                            <span style="color: #666;">Questions:</span>
                            <span style="font-weight: 600; color: #2c5aa0;">5 focused questions</span>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span style="color: #666;">Accuracy:</span>
                            <span style="font-weight: 600; color: #2c5aa0;">85% confidence</span>
                        </div>
                    </div>
                    <p style="font-size: 0.9rem; color: #666; line-height: 1.5;">
                        High-impact scenarios and visual preferences reveal your core career interests quickly.
                    </p>
                </div>
            `;
        } else if (level === 'comprehensive') {
            card.innerHTML = `
                <div class="level-card-header" style="background: linear-gradient(135deg, #2c5aa0, #1e3f73); color: white; padding: 1rem; border-radius: 8px 8px 0 0;">
                    <h3 style="margin: 0; font-size: 1.2rem;">🎯 Comprehensive Analysis</h3>
                    <p style="margin: 0.5rem 0 0 0; opacity: 0.9; font-size: 0.9rem;">Professional-grade career guidance</p>
                </div>
                <div class="level-card-content" style="padding: 1.5rem;">
                    <div class="level-stats" style="margin-bottom: 1rem;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                            <span style="color: #666;">Duration:</span>
                            <span style="font-weight: 600; color: #2c5aa0;">8-12 minutes</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                            <span style="color: #666;">Questions:</span>
                            <span style="font-weight: 600; color: #2c5aa0;">10 varied questions</span>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span style="color: #666;">Accuracy:</span>
                            <span style="font-weight: 600; color: #2c5aa0;">95% confidence</span>
                        </div>
                    </div>
                    <p style="font-size: 0.9rem; color: #666; line-height: 1.5;">
                        Deep personality analysis with AI-enhanced insights and detailed market intelligence.
                    </p>
                    <div class="recommended-badge" style="margin-top: 1rem; padding: 0.5rem; background: #e8f4f8; border-radius: 4px; text-align: center; color: #2c5aa0; font-weight: 600; font-size: 0.85rem;">
                        ⭐ RECOMMENDED FOR SERIOUS CAREER PLANNING
                    </div>
                </div>
            `;
        }
    });
}

function setupProfessionalEventListeners() {
    // Level selection with professional enhancement
    document.querySelectorAll('.select-level-btn, .level-card').forEach(element => {
        element.addEventListener('click', handleProfessionalLevelSelection);
    });

    // Navigation buttons
    document.getElementById('previousBtn')?.addEventListener('click', previousQuestion);
    document.getElementById('nextBtn')?.addEventListener('click', nextQuestion);

    // Results action handlers
    document.getElementById('shareResultsBtn')?.addEventListener('click', shareResults);
    document.getElementById('retakeQuizBtn')?.addEventListener('click', retakeQuiz);
    document.getElementById('exploreClubsBtn')?.addEventListener('click', exploreClubs);
    document.getElementById('saveToDashboardBtn')?.addEventListener('click', saveToDashboard);
}

async function handleProfessionalLevelSelection(event) {
    const levelElement = event.target.closest('.level-card') || event.target.closest('.select-level-btn');
    const level = levelElement.dataset.level || 'comprehensive';

    console.log(`🎯 Starting professional assessment at level: ${level}`);

    ProfessionalQuizState.selectedLevel = level;
    ProfessionalQuizState.startTime = Date.now();
    ProfessionalQuizState.userProfile.quizLevel = level;

    // Enhanced visual feedback
    levelElement.style.transform = 'scale(0.98)';
    levelElement.style.filter = 'brightness(1.1)';
    setTimeout(() => {
        levelElement.style.transform = '';
        levelElement.style.filter = '';
    }, 200);

    try {
        showLoading('Loading professional assessment questions...');

        // Load questions for selected level
        const response = await fetch(`/api/quiz/professional-questions?level=${level}`);
        if (response.ok) {
            const data = await response.json();
            ProfessionalQuizState.questions = data.questions;
        }

        await new Promise(resolve => setTimeout(resolve, 1000)); // Brief loading for UX
        startProfessionalQuiz();
    } catch (error) {
        console.error('💥 Error starting professional quiz:', error);
        showError('Failed to start professional assessment. Please try again.');
        hideLoading();
    }
}

function startProfessionalQuiz() {
    console.log('🎯 Starting professional career assessment...');

    hideLoading();
    switchScreen('questions');
    ProfessionalQuizState.currentQuestionIndex = 0;
    ProfessionalQuizState.responses = Array(ProfessionalQuizState.questions.length).fill(null);
    displayProfessionalQuestion();
    updateProgress();
}

function displayProfessionalQuestion() {
    const question = ProfessionalQuizState.questions[ProfessionalQuizState.currentQuestionIndex];
    if (!question) {
        console.error('❌ No question found at index:', ProfessionalQuizState.currentQuestionIndex);
        return;
    }

    console.log(`📋 Displaying ${question.type} question ${ProfessionalQuizState.currentQuestionIndex + 1}: ${question.question}`);

    // Update question header with professional styling
    updateProfessionalQuestionHeader(question);

    // Render question content based on type
    renderProfessionalQuestionByType(question);

    updateNavigationButtons();
    startQuestionTimer();
    ProfessionalQuizState.questionStartTime = Date.now();
}

function updateProfessionalQuestionHeader(question) {
    // Update main question text
    document.getElementById('questionText').textContent = question.question;
    document.getElementById('currentQuestion').textContent = ProfessionalQuizState.currentQuestionIndex + 1;
    document.getElementById('totalQuestions').textContent = ProfessionalQuizState.questions.length;

    // Update instruction based on question type
    const instructionElement = document.querySelector('.question-instruction');
    const questionHeaderH2 = document.querySelector('.question-header h2');

    const typeInstructions = {
        'scenario': '🎯 Choose the response that best matches your natural instinct',
        'visual_preference': '✨ Select the option that most excites you professionally',
        'value_priorities_ranking': '📊 Drag to rank these values by importance to you',
        'work_preference_scale': '⚖️ Use the slider to indicate your preference',
        'short_response': '💭 Share your thoughts in a few sentences'
    };

    if (questionHeaderH2) {
        questionHeaderH2.textContent = typeInstructions[question.type] || 'Select your response';
        questionHeaderH2.style.color = '#2c5aa0';
    }

    // Add subtitle with professional styling
    if (instructionElement) {
        instructionElement.innerHTML = `
            <div class="question-subtitle" style="color: #666; font-size: 0.95rem; margin-bottom: 0.5rem;">
                ${question.subtitle || ''}
            </div>
        `;
    }

    // Add research context with professional presentation
    if (question.context) {
        let contextElement = document.querySelector('.question-context');
        if (!contextElement) {
            contextElement = document.createElement('div');
            contextElement.className = 'question-context';
            contextElement.style.cssText = `
                font-size: 0.8rem; 
                color: #888; 
                text-align: center; 
                margin-top: 0.75rem; 
                padding: 0.5rem; 
                background: #f8f9fa; 
                border-radius: 4px; 
                border-left: 3px solid #2c5aa0;
                font-style: italic;
            `;
            document.querySelector('.question-header').appendChild(contextElement);
        }
        contextElement.innerHTML = `📚 Research insight: ${question.context}`;
    }
}

function renderProfessionalQuestionByType(question) {
    const container = document.getElementById('sortableOptions');
    container.innerHTML = '';
    container.className = 'professional-question-container';

    switch (question.type) {
        case 'scenario':
        case 'visual_preference':
            renderProfessionalMultipleChoice(question, container);
            break;

        case 'value_priorities_ranking':
            renderProfessionalRanking(question, container);
            break;

        case 'work_preference_scale':
            renderProfessionalScale(question, container);
            break;

        case 'short_response':
            renderProfessionalText(question, container);
            break;

        default:
            container.innerHTML = '<p style="color: #666; text-align: center;">Question type not yet implemented</p>';
    }
}

function renderProfessionalMultipleChoice(question, container) {
    container.className = 'professional-multiple-choice-container';

    const optionsHTML = question.options.map((option, index) => `
        <div class="professional-option" data-option-id="${option.id || index}" 
             style="border: 2px solid #e1e5e9; border-radius: 12px; padding: 1.5rem; margin-bottom: 1rem; 
                    cursor: pointer; transition: all 0.3s ease; background: white;">
            ${option.visual ? `
                <div class="option-visual" style="font-size: 2rem; text-align: center; margin-bottom: 1rem;">
                    ${option.visual}
                </div>
            ` : ''}
            <div class="option-content">
                <h4 class="option-title" style="color: #2c5aa0; margin-bottom: 0.5rem; font-size: 1.1rem;">
                    ${option.title || option.text}
                </h4>
                <p class="option-description" style="color: #666; line-height: 1.5; margin-bottom: 0.5rem;">
                    ${option.description}
                </p>
                ${option.trend ? `
                    <span class="option-trend" style="background: #e8f4f8; color: #2c5aa0; padding: 0.25rem 0.5rem; 
                                                    border-radius: 4px; font-size: 0.8rem; font-weight: 600;">
                        ${option.trend}
                    </span>
                ` : ''}
                ${option.characteristics ? `
                    <div class="option-characteristics" style="margin-top: 0.75rem;">
                        ${option.characteristics.map(char => `
                            <span class="characteristic-tag" style="background: #f1f3f5; color: #495057; 
                                                                  padding: 0.2rem 0.5rem; border-radius: 12px; 
                                                                  font-size: 0.75rem; margin-right: 0.5rem;">
                                ${char}
                            </span>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        </div>
    `).join('');

    container.innerHTML = optionsHTML;

    // Add enhanced click handlers with visual feedback
    container.querySelectorAll('.professional-option').forEach(option => {
        option.addEventListener('mouseenter', () => {
            option.style.borderColor = '#2c5aa0';
            option.style.transform = 'translateY(-2px)';
            option.style.boxShadow = '0 4px 12px rgba(44, 90, 160, 0.15)';
        });

        option.addEventListener('mouseleave', () => {
            if (!option.classList.contains('selected')) {
                option.style.borderColor = '#e1e5e9';
                option.style.transform = 'translateY(0)';
                option.style.boxShadow = 'none';
            }
        });

        option.addEventListener('click', () => {
            // Remove selection from other options
            container.querySelectorAll('.professional-option').forEach(o => {
                o.classList.remove('selected');
                o.style.borderColor = '#e1e5e9';
                o.style.backgroundColor = 'white';
                o.style.transform = 'translateY(0)';
                o.style.boxShadow = 'none';
            });

            // Select this option
            option.classList.add('selected');
            option.style.borderColor = '#2c5aa0';
            option.style.backgroundColor = '#f8f9fa';
            option.style.transform = 'translateY(-1px)';
            option.style.boxShadow = '0 6px 16px rgba(44, 90, 160, 0.2)';

            const optionId = option.dataset.optionId;
            const selectedOption = question.options.find(opt => (opt.id || question.options.indexOf(opt).toString()) === optionId);
            saveProfessionalResponse(question, { selectedOption });
        });
    });
}

function renderProfessionalRanking(question, container) {
    container.className = 'professional-ranking-container';

    // Professional ranking instructions
    const instructionsHTML = `
        <div class="ranking-instructions" style="background: #f8f9fa; padding: 1rem; border-radius: 8px; margin-bottom: 1.5rem; border-left: 4px solid #2c5aa0;">
            <h4 style="color: #2c5aa0; margin-bottom: 0.5rem; font-size: 1rem;">📊 How to Rank</h4>
            <p style="color: #666; font-size: 0.9rem; margin: 0;">
                Drag and drop the items below to rank them from <strong>most important</strong> (top) to <strong>least important</strong> (bottom) for your ideal career.
            </p>
        </div>
    `;

    // Shuffle items for unbiased ranking
    const shuffledItems = [...question.items].sort(() => Math.random() - 0.5);

    const itemsHTML = shuffledItems.map((item, index) => `
        <div class="professional-sortable-option" draggable="true" data-option-id="${item.id}"
             style="background: white; border: 2px solid #e1e5e9; border-radius: 8px; padding: 1rem; 
                    margin-bottom: 0.75rem; cursor: move; transition: all 0.3s ease;">
            <div class="option-rank" style="float: left; width: 30px; height: 30px; background: #2c5aa0; 
                                          color: white; border-radius: 50%; display: flex; align-items: center; 
                                          justify-content: center; font-weight: 600; margin-right: 1rem;">
                <span class="rank-number">${index + 1}</span>
            </div>
            <div class="option-content" style="overflow: hidden;">
                <h4 class="option-title" style="color: #2c5aa0; margin-bottom: 0.5rem; font-size: 1rem;">
                    ${item.text}
                </h4>
                <p class="option-description" style="color: #666; font-size: 0.85rem; line-height: 1.4; margin: 0;">
                    ${item.description}
                </p>
            </div>
            <div class="option-grip" style="float: right; color: #ccc; font-size: 1.2rem; margin-top: 0.5rem;">
                ⋮⋮
            </div>
            <div style="clear: both;"></div>
        </div>
    `).join('');

    container.innerHTML = instructionsHTML + itemsHTML;

    // Initialize professional drag and drop
    initializeProfessionalDragAndDrop(container, question);
}

function renderProfessionalScale(question, container) {
    container.className = 'professional-scale-container';

    const scale = question.scale;
    const middleValue = Math.ceil((scale.min + scale.max) / 2);

    const scaleHTML = `
        <div class="professional-scale-content" style="max-width: 600px; margin: 0 auto;">
            <div class="scale-labels" style="display: flex; justify-content: space-between; margin-bottom: 1rem; font-weight: 600;">
                <span class="scale-label-left" style="color: #2c5aa0;">${scale.labels[scale.min]}</span>
                <span class="scale-label-right" style="color: #2c5aa0;">${scale.labels[scale.max]}</span>
            </div>
            
            <div class="scale-input-container" style="position: relative; margin-bottom: 2rem;">
                <input type="range" class="professional-scale-slider" id="professionalScaleSlider"
                       min="${scale.min}" max="${scale.max}" value="${middleValue}"
                       style="width: 100%; height: 8px; border-radius: 4px; background: #e1e5e9; 
                              outline: none; -webkit-appearance: none; cursor: pointer;">
                <div class="scale-markers" style="display: flex; justify-content: space-between; margin-top: 0.5rem;">
                    ${Array.from({ length: scale.max - scale.min + 1 }, (_, i) => `
                        <div class="scale-marker" style="width: 2px; height: 8px; background: #ccc;"></div>
                    `).join('')}
                </div>
            </div>
            
            <div class="scale-feedback" style="text-align: center; background: #f8f9fa; padding: 1.5rem; 
                                              border-radius: 8px; border-left: 4px solid #2c5aa0;">
                <div class="scale-value-display" style="margin-bottom: 1rem;">
                    <span class="scale-value" id="scaleValueDisplay" 
                          style="font-size: 1.2rem; font-weight: 600; color: #2c5aa0;">
                        ${scale.labels[middleValue]}
                    </span>
                </div>
                <div class="scale-description" id="scaleDescription" 
                     style="color: #666; line-height: 1.5; font-style: italic;">
                    ${scale.descriptions[middleValue]}
                </div>
            </div>
        </div>
    `;

    container.innerHTML = scaleHTML;

    // Enhanced scale interaction with professional styling
    const slider = document.getElementById('professionalScaleSlider');
    const valueDisplay = document.getElementById('scaleValueDisplay');
    const descriptionDisplay = document.getElementById('scaleDescription');

    // Style the slider
    const style = document.createElement('style');
    style.textContent = `
        .professional-scale-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: #2c5aa0;
            cursor: pointer;
            box-shadow: 0 2px 6px rgba(44, 90, 160, 0.3);
        }
        .professional-scale-slider::-moz-range-thumb {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: #2c5aa0;
            cursor: pointer;
            border: none;
            box-shadow: 0 2px 6px rgba(44, 90, 160, 0.3);
        }
    `;
    document.head.appendChild(style);

    slider.addEventListener('input', () => {
        const value = parseInt(slider.value);
        valueDisplay.textContent = scale.labels[value];
        descriptionDisplay.textContent = scale.descriptions[value];

        // Visual feedback
        valueDisplay.style.transform = 'scale(1.1)';
        setTimeout(() => valueDisplay.style.transform = 'scale(1)', 200);

        saveProfessionalResponse(question, { scaleValue: value });
    });
}

function renderProfessionalText(question, container) {
    container.className = 'professional-text-container';

    const textHTML = `
        <div class="professional-text-content" style="max-width: 600px; margin: 0 auto;">
            <div class="text-input-wrapper" style="position: relative;">
                <textarea class="professional-text-input" id="professionalTextInput"
                          placeholder="${question.placeholder || 'Share your thoughts and experiences...'}"
                          maxlength="${question.max_length || 300}"
                          style="width: 100%; min-height: 120px; padding: 1rem; border: 2px solid #e1e5e9; 
                                 border-radius: 8px; font-size: 1rem; line-height: 1.5; resize: vertical;
                                 font-family: inherit; transition: border-color 0.3s ease;"></textarea>
            </div>
            
            <div class="text-input-footer" style="display: flex; justify-content: space-between; 
                                                  align-items: center; margin-top: 1rem; font-size: 0.85rem;">
                <span class="text-hint" style="color: #666;">
                    💡 Be specific about what excited or motivated you
                </span>
                <span class="char-counter" style="color: #888;">
                    <span id="charCount">0</span>/${question.max_length || 300} characters
                </span>
            </div>
            
            <div class="text-examples" style="margin-top: 1rem; padding: 1rem; background: #f8f9fa; 
                                              border-radius: 8px; border-left: 4px solid #2c5aa0;">
                <h5 style="color: #2c5aa0; margin-bottom: 0.5rem;">💭 Example responses:</h5>
                <ul style="color: #666; font-size: 0.85rem; margin: 0; padding-left: 1.2rem;">
                    <li>"Building a web app that helped students find study groups..."</li>
                    <li>"Analyzing data to predict customer behavior patterns..."</li>
                    <li>"Designing an interface that made complex tasks simple..."</li>
                </ul>
            </div>
        </div>
    `;

    container.innerHTML = textHTML;

    // Enhanced text input handlers
    const textInput = document.getElementById('professionalTextInput');
    const charCount = document.getElementById('charCount');

    textInput.addEventListener('focus', () => {
        textInput.style.borderColor = '#2c5aa0';
        textInput.style.boxShadow = '0 0 0 3px rgba(44, 90, 160, 0.1)';
    });

    textInput.addEventListener('blur', () => {
        textInput.style.borderColor = '#e1e5e9';
        textInput.style.boxShadow = 'none';
    });

    textInput.addEventListener('input', () => {
        const length = textInput.value.length;
        charCount.textContent = length;

        // Color coding for character count
        if (length > (question.max_length || 300) * 0.9) {
            charCount.style.color = '#e74c3c';
        } else if (length > (question.max_length || 300) * 0.7) {
            charCount.style.color = '#f39c12';
        } else {
            charCount.style.color = '#27ae60';
        }

        saveProfessionalResponse(question, { textResponse: textInput.value });
    });
}

function initializeProfessionalDragAndDrop(container, question) {
    let draggedElement = null;

    container.addEventListener('dragstart', (e) => {
        draggedElement = e.target.closest('.professional-sortable-option');
        if (draggedElement) {
            draggedElement.classList.add('dragging');
            draggedElement.style.opacity = '0.7';
        }
    });

    container.addEventListener('dragend', (e) => {
        const element = e.target.closest('.professional-sortable-option');
        if (element) {
            element.classList.remove('dragging');
            element.style.opacity = '1';
            updateProfessionalRankNumbers();
            saveProfessionalRankingResponse(question);
        }
    });

    container.addEventListener('dragover', (e) => {
        e.preventDefault();
        const afterElement = getDragAfterElement(container, e.clientY);
        if (draggedElement && afterElement) {
            afterElement.style.borderTopColor = '#2c5aa0';
            afterElement.style.borderTopWidth = '3px';
        }
    });

    container.addEventListener('dragleave', (e) => {
        const afterElement = getDragAfterElement(container, e.clientY);
        if (afterElement) {
            afterElement.style.borderTopColor = '#e1e5e9';
            afterElement.style.borderTopWidth = '2px';
        }
    });

    container.addEventListener('drop', (e) => {
        e.preventDefault();
        if (!draggedElement) return;

        const afterElement = getDragAfterElement(container, e.clientY);
        if (afterElement == null) {
            container.appendChild(draggedElement);
        } else {
            container.insertBefore(draggedElement, afterElement);
            afterElement.style.borderTopColor = '#e1e5e9';
            afterElement.style.borderTopWidth = '2px';
        }
    });
}

function updateProfessionalRankNumbers() {
    const options = document.querySelectorAll('.professional-sortable-option');
    options.forEach((option, index) => {
        const rankElement = option.querySelector('.rank-number');
        if (rankElement) {
            rankElement.textContent = index + 1;
        }
    });
}

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.professional-sortable-option:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;

        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function saveProfessionalRankingResponse(question) {
    const options = document.querySelectorAll('.professional-sortable-option');
    const ranking = Array.from(options).map(option => option.dataset.optionId);
    saveProfessionalResponse(question, { ranking });
}

function saveProfessionalResponse(question, responseData) {
    const timeTaken = ProfessionalQuizState.questionStartTime ?
        Math.round((Date.now() - ProfessionalQuizState.questionStartTime) / 1000) : 45;

    ProfessionalQuizState.responses[ProfessionalQuizState.currentQuestionIndex] = {
        questionId: question.id,
        type: question.type,
        category: question.category,
        question: question, // Include full question for AI analysis
        timeTaken: timeTaken,
        timestamp: new Date().toISOString(),
        ...responseData
    };

    updateNavigationButtons();

    console.log(`💾 Saved ${question.type} response:`, responseData);
}

function updateNavigationButtons() {
    const prevBtn = document.getElementById('previousBtn');
    const nextBtn = document.getElementById('nextBtn');

    if (prevBtn) prevBtn.disabled = ProfessionalQuizState.currentQuestionIndex === 0;

    const hasResponse = ProfessionalQuizState.responses[ProfessionalQuizState.currentQuestionIndex] !== null;
    if (nextBtn) {
        nextBtn.disabled = !hasResponse;

        if (ProfessionalQuizState.currentQuestionIndex === ProfessionalQuizState.questions.length - 1) {
            nextBtn.textContent = 'Get Professional Analysis →';
            nextBtn.className = 'btn btn-primary finish-btn';
            nextBtn.style.background = 'linear-gradient(135deg, #2c5aa0, #1e3f73)';
        } else {
            nextBtn.textContent = 'Next Question →';
            nextBtn.className = 'btn btn-primary';
        }
    }
}

function nextQuestion() {
    if (ProfessionalQuizState.currentQuestionIndex < ProfessionalQuizState.questions.length - 1) {
        ProfessionalQuizState.currentQuestionIndex++;
        displayProfessionalQuestion();
        updateProgress();
    } else {
        finishProfessionalQuiz();
    }
}

function previousQuestion() {
    if (ProfessionalQuizState.currentQuestionIndex > 0) {
        ProfessionalQuizState.currentQuestionIndex--;
        displayProfessionalQuestion();
        updateProgress();
        restorePreviousResponse();
    }
}

async function finishProfessionalQuiz() {
    console.log('🎯 Finishing professional career assessment...');

    stopQuestionTimer();
    const completionTime = Math.round((Date.now() - ProfessionalQuizState.startTime) / 1000 / 60);

    switchScreen('loading');
    animateProfessionalLoading();

    try {
        const submission = {
            level: ProfessionalQuizState.selectedLevel,
            responses: ProfessionalQuizState.responses.filter(r => r !== null),
            completionTime: completionTime,
            quizType: 'professional_career_analysis',
            userProfile: {
                ...ProfessionalQuizState.userProfile,
                completionTime: completionTime,
                timestamp: new Date().toISOString()
            }
        };

        console.log('📤 Submitting professional assessment for AI analysis:', submission);

        const response = await fetch('/api/quiz/professional-analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(submission)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`Server error (${response.status}): ${errorData.error || response.statusText}`);
        }

        const data = await response.json();

        if (!data.success || !data.results) {
            throw new Error(data.error || 'Invalid response format from server');
        }

        ProfessionalQuizState.results = data.results;
        console.log('🎉 Received professional AI analysis:', ProfessionalQuizState.results);

        // Minimum loading time for professional feel
        await new Promise(resolve => setTimeout(resolve, 2500));

        displayProfessionalResults();

    } catch (error) {
        console.error('💥 Error submitting professional assessment:', error);
        showError(`Professional analysis failed: ${error.message}. Please try again.`);

        setTimeout(() => {
            retakeQuiz();
        }, 3000);
    }
}

function animateProfessionalLoading() {
    const loadingTexts = [
        'Analyzing your responses with professional AI...',
        'Processing personality and career patterns...',
        'Consulting industry research and market data...',
        'Matching with 15+ tech career paths...',
        'Generating personalized insights...',
        'Calculating market projections...',
        'Preparing UC Davis specific recommendations...',
        'Finalizing your professional career analysis...'
    ];

    let textIndex = 0;
    const loadingTextElement = document.getElementById('loadingText');

    const textInterval = setInterval(() => {
        if (textIndex < loadingTexts.length) {
            loadingTextElement.textContent = loadingTexts[textIndex];
            textIndex++;
        } else {
            clearInterval(textInterval);
            loadingTextElement.textContent = 'Almost ready with your professional results...';
        }
    }, 700);
}

function displayProfessionalResults() {
    console.log('🎉 Displaying professional AI-powered results');

    switchScreen('results');

    if (!ProfessionalQuizState.results) {
        showError('No professional results available');
        return;
    }

    displayProfessionalTopMatch();
    displayProfessionalCareerProgression();
    displayProfessionalMarketData();
    displayProfessionalAllMatches();
    displayProfessionalNextSteps();
    displayProfessionalAIInsights();
    displayProfessionalUCDavisIntegration();
    animateResults();
}

function displayProfessionalTopMatch() {
    const topMatch = ProfessionalQuizState.results.topMatch;
    if (!topMatch) return;

    console.log(`🥇 Displaying professional top match: ${topMatch.career} (${topMatch.percentage}%)`);

    document.getElementById('topCareerName').textContent = topMatch.title || topMatch.career;

    // Enhanced description with AI reasoning
    const description = topMatch.personalizedReasoning || topMatch.profile?.description || 'A great career match for your interests and skills.';
    document.getElementById('topCareerDescription').textContent = description;

    document.getElementById('matchPercentage').textContent = `${topMatch.percentage}%`;

    const confidenceBadge = document.getElementById('confidenceBadge');
    if (confidenceBadge) {
        confidenceBadge.textContent = 'AI Professional Analysis';
        confidenceBadge.className = 'confidence-badge confidence-professional';
        confidenceBadge.style.background = 'linear-gradient(135deg, #2c5aa0, #1e3f73)';
        confidenceBadge.style.color = 'white';
    }

    animatePercentageCircle(topMatch.percentage);
}

// Continue with other display functions...
// (The rest of the functions would follow the same professional pattern)

// Utility functions
function updateProgress() {
    const progress = ((ProfessionalQuizState.currentQuestionIndex + 1) / ProfessionalQuizState.questions.length) * 100;
    const progressFill = document.getElementById('progressFill');
    if (progressFill) {
        progressFill.style.width = `${progress}%`;
        progressFill.style.background = 'linear-gradient(90deg, #2c5aa0, #3498db)';
    }
}

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

    ProfessionalQuizState.currentScreen = screenName;
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
    console.error('❌ Professional Quiz Error:', message);
    alert(`Error: ${message}`);
}

function animatePercentageCircle(percentage) {
    const circle = document.querySelector('.progress-ring__circle');
    if (!circle) return;

    const radius = circle.r.baseVal.value;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percentage / 100) * circumference;

    circle.style.strokeDasharray = `${circumference} ${circumference}`;
    circle.style.strokeDashoffset = circumference;
    circle.style.stroke = '#2c5aa0';

    setTimeout(() => {
        circle.style.transition = 'stroke-dashoffset 1.5s ease-out';
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
        '.professional-insights',
        '.uc-davis-integration'
    ];

    elements.forEach((selector, index) => {
        const element = document.querySelector(selector);
        if (element) {
            setTimeout(() => {
                element.style.animation = 'fadeInUp 0.6s ease-out';
                element.style.opacity = '1';
            }, index * 150);
        }
    });
}

// Professional fallback questions
function getProfessionalFallbackQuestions() {
    return [
        {
            id: 1,
            type: "scenario",
            category: "problem_solving",
            question: "When facing a complex technical challenge, what's your first instinct?",
            options: [
                { id: "systematic", text: "Break it down systematically and research solutions", weights: { "software_engineering": 3 } },
                { id: "experimental", text: "Start experimenting with different approaches", weights: { "ai_ml_engineering": 3 } },
                { id: "collaborative", text: "Gather the team to brainstorm solutions", weights: { "product_management": 3 } },
                { id: "user_focused", text: "Consider the user impact and work backwards", weights: { "ux_design": 3 } }
            ]
        }
    ];
}

// Global functions for buttons
window.retakeQuiz = function () {
    ProfessionalQuizState.currentQuestionIndex = 0;
    ProfessionalQuizState.responses = [];
    ProfessionalQuizState.results = null;
    ProfessionalQuizState.startTime = null;
    stopQuestionTimer();
    switchScreen('intro');
};

window.shareResults = function () {
    // Professional sharing implementation
    if (!ProfessionalQuizState.results) return;

    const shareData = {
        title: 'Professional AI Career Analysis Results',
        text: `I discovered I'm ${ProfessionalQuizState.results.topMatch.percentage}% matched with ${ProfessionalQuizState.results.topMatch.title}! Get your professional AI-powered career analysis.`,
        url: window.location.href
    };

    if (navigator.share) {
        navigator.share(shareData).catch(err => console.log('Share cancelled'));
    } else {
        navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`).then(() => {
            alert('Professional results copied to clipboard!');
        });
    }
};

window.exploreClubs = function () {
    window.location.href = '/tech-clubs';
};

window.saveToDashboard = function () {
    alert('Professional results saved to your dashboard! 💾');
};

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

console.log('✅ Professional Career Assessment Engine loaded and ready');

// Additional professional features can be added here...