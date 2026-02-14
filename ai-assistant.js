// AI Assistant for Farm2Market Market Page
class AIAssistant {
    constructor() {
        this.isActive = false;
        this.responses = {
            'price trends': 'Based on current market data, wheat prices are showing an upward trend (+2.3%), while rice is experiencing a slight decline (-1.2%). Cotton shows strong growth (+4.1%). This suggests good demand for wheat and cotton.',
            'read charts': 'The candlestick chart shows price movements over time. Green candles indicate price increases, red candles show decreases. The volume bars at the bottom show trading activity. Higher volume often confirms price trends.',
            'selling time': 'Best selling times depend on seasonal patterns and current trends. For wheat, current upward momentum suggests good selling opportunity. Monitor the 1-week trend for confirmation.',
            'market analysis': 'Current market shows mixed signals. Agricultural index is up 1.6% with strong volume. Wheat and cotton are performing well, while rice shows weakness. Overall sentiment is positive.',
            'trading tips': 'Key tips: 1) Watch volume for trend confirmation, 2) Use stop-losses to limit risk, 3) Consider seasonal patterns, 4) Diversify across multiple crops, 5) Stay updated with weather forecasts.',
            'weather impact': 'Weather significantly affects crop prices. Favorable weather typically lowers prices due to good supply, while adverse weather can spike prices. Monitor weather alerts in our system.',
            'default': 'I can help you with market analysis, price trends, trading strategies, and understanding charts. What specific information do you need?'
        };
        this.init();
    }

    init() {
        this.createAIInterface();
        this.setupEventListeners();
    }

    createAIInterface() {
        const aiHTML = `
            <div id="aiHelpBox" class="ai-help-box collapsed">
                <div class="ai-robot-button" id="aiRobotButton">
                    <i class="fas fa-robot"></i>
                </div>
                <div class="ai-help-content" id="aiHelpContent" style="display: none;">
                    <div class="ai-help-header">
                        <i class="fas fa-robot"></i>
                        <span>Farm2Market AI Assistant</span>
                        <button class="ai-close-btn">&times;</button>
                    </div>
                    <div class="ai-chat-messages" id="aiChatMessages">
                        <div class="ai-message">
                            <i class="fas fa-robot"></i>
                            <div class="message-content">
                                <p>Hello! I'm here to help you navigate the live market. Ask me about prices, trends, or trading!</p>
                                <div class="quick-actions">
                                    <button onclick="window.aiAssistant.askAI('price trends')">Price Trends</button>
                                    <button onclick="window.aiAssistant.askAI('read charts')">Read Charts</button>
                                    <button onclick="window.aiAssistant.askAI('selling time')">Selling Time</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="ai-input-area">
                        <input type="text" id="aiInput" placeholder="Ask about market data, prices, trends...">
                        <button class="ai-send-btn"><i class="fas fa-paper-plane"></i></button>
                    </div>
                </div>
            </div>
        `;

        // Add CSS styles
        const styles = `
            <style>
                .ai-help-box {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    z-index: 1000;
                    font-family: 'Inter', sans-serif;
                }

                .ai-robot-button {
                    width: 60px;
                    height: 60px;
                    background: linear-gradient(135deg, #00d09c, #00b386);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    box-shadow: 0 4px 20px rgba(0, 208, 156, 0.3);
                    transition: all 0.3s ease;
                    animation: pulse 2s infinite;
                }

                .ai-robot-button:hover {
                    transform: scale(1.1);
                    box-shadow: 0 6px 25px rgba(0, 208, 156, 0.4);
                }

                .ai-robot-button i {
                    color: white;
                    font-size: 24px;
                }

                @keyframes pulse {
                    0%, 100% { box-shadow: 0 4px 20px rgba(0, 208, 156, 0.3); }
                    50% { box-shadow: 0 4px 20px rgba(0, 208, 156, 0.6); }
                }

                .ai-help-content {
                    position: absolute;
                    bottom: 80px;
                    right: 0;
                    width: 350px;
                    max-height: 500px;
                    background: rgba(20, 25, 35, 0.95);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 12px;
                    backdrop-filter: blur(10px);
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
                    display: flex;
                    flex-direction: column;
                }

                .ai-help-header {
                    padding: 15px 20px;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    color: white;
                    font-weight: 600;
                }

                .ai-help-header i {
                    color: #00d09c;
                    font-size: 18px;
                }

                .ai-close-btn {
                    margin-left: auto;
                    background: none;
                    border: none;
                    color: #999;
                    font-size: 20px;
                    cursor: pointer;
                    padding: 0;
                    width: 24px;
                    height: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .ai-close-btn:hover {
                    color: white;
                }

                .ai-chat-messages {
                    flex: 1;
                    padding: 15px;
                    overflow-y: auto;
                    max-height: 300px;
                }

                .ai-message {
                    display: flex;
                    gap: 10px;
                    margin-bottom: 15px;
                }

                .ai-message i {
                    color: #00d09c;
                    font-size: 16px;
                    margin-top: 2px;
                    flex-shrink: 0;
                }

                .message-content {
                    flex: 1;
                }

                .message-content p {
                    color: #e0e0e0;
                    margin: 0 0 10px 0;
                    font-size: 14px;
                    line-height: 1.4;
                }

                .quick-actions {
                    display: flex;
                    gap: 8px;
                    flex-wrap: wrap;
                }

                .quick-actions button {
                    background: rgba(0, 208, 156, 0.2);
                    border: 1px solid rgba(0, 208, 156, 0.3);
                    color: #00d09c;
                    padding: 6px 12px;
                    border-radius: 15px;
                    font-size: 12px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .quick-actions button:hover {
                    background: rgba(0, 208, 156, 0.3);
                    border-color: #00d09c;
                }

                .ai-input-area {
                    padding: 15px;
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                    display: flex;
                    gap: 10px;
                }

                .ai-input-area input {
                    flex: 1;
                    background: rgba(255, 255, 255, 0.1);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    border-radius: 20px;
                    padding: 10px 15px;
                    color: white;
                    font-size: 14px;
                }

                .ai-input-area input::placeholder {
                    color: #999;
                }

                .ai-input-area input:focus {
                    outline: none;
                    border-color: #00d09c;
                }

                .ai-send-btn {
                    background: #00d09c;
                    border: none;
                    border-radius: 50%;
                    width: 40px;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .ai-send-btn:hover {
                    background: #00b386;
                    transform: scale(1.05);
                }

                .ai-send-btn i {
                    color: white;
                    font-size: 14px;
                }

                .user-message {
                    justify-content: flex-end;
                    margin-bottom: 15px;
                }

                .user-message .message-content {
                    background: rgba(0, 208, 156, 0.2);
                    border: 1px solid rgba(0, 208, 156, 0.3);
                    border-radius: 15px;
                    padding: 10px 15px;
                    max-width: 80%;
                }

                .user-message .message-content p {
                    color: white;
                    margin: 0;
                }

                @media (max-width: 768px) {
                    .ai-help-content {
                        width: 300px;
                        bottom: 70px;
                    }
                }
            </style>
        `;

        document.head.insertAdjacentHTML('beforeend', styles);
        document.body.insertAdjacentHTML('beforeend', aiHTML);
    }

    setupEventListeners() {
        const robotButton = document.getElementById('aiRobotButton');
        const closeBtn = document.querySelector('.ai-close-btn');
        const sendBtn = document.querySelector('.ai-send-btn');
        const input = document.getElementById('aiInput');

        if (robotButton) {
            robotButton.addEventListener('click', () => this.toggleAI());
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeAI());
        }

        if (sendBtn) {
            sendBtn.addEventListener('click', () => this.sendMessage());
        }

        if (input) {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendMessage();
                }
            });
        }
    }

    toggleAI() {
        const content = document.getElementById('aiHelpContent');
        if (content) {
            if (this.isActive) {
                this.closeAI();
            } else {
                this.openAI();
            }
        }
    }

    openAI() {
        const content = document.getElementById('aiHelpContent');
        if (content) {
            content.style.display = 'flex';
            this.isActive = true;
        }
    }

    closeAI() {
        const content = document.getElementById('aiHelpContent');
        if (content) {
            content.style.display = 'none';
            this.isActive = false;
        }
    }

    sendMessage() {
        const input = document.getElementById('aiInput');
        if (input && input.value.trim()) {
            const message = input.value.trim();
            this.addUserMessage(message);
            this.processMessage(message);
            input.value = '';
        }
    }

    addUserMessage(message) {
        const chatMessages = document.getElementById('aiChatMessages');
        if (chatMessages) {
            const messageHTML = `
                <div class="user-message" style="display: flex; justify-content: flex-end; margin-bottom: 15px;">
                    <div class="message-content" style="background: rgba(0, 208, 156, 0.2); border: 1px solid rgba(0, 208, 156, 0.3); border-radius: 15px; padding: 10px 15px; max-width: 80%;">
                        <p style="color: white; margin: 0;">${message}</p>
                    </div>
                </div>
            `;
            chatMessages.insertAdjacentHTML('beforeend', messageHTML);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }

    addAIMessage(message) {
        const chatMessages = document.getElementById('aiChatMessages');
        if (chatMessages) {
            const messageHTML = `
                <div class="ai-message">
                    <i class="fas fa-robot"></i>
                    <div class="message-content">
                        <p>${message}</p>
                    </div>
                </div>
            `;
            chatMessages.insertAdjacentHTML('beforeend', messageHTML);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }

    processMessage(message) {
        const lowerMessage = message.toLowerCase();
        let response = this.responses.default;

        // Simple keyword matching
        for (const [key, value] of Object.entries(this.responses)) {
            if (lowerMessage.includes(key.toLowerCase()) ||
                (key === 'price trends' && (lowerMessage.includes('price') || lowerMessage.includes('trend'))) ||
                (key === 'read charts' && (lowerMessage.includes('chart') || lowerMessage.includes('graph'))) ||
                (key === 'selling time' && (lowerMessage.includes('sell') || lowerMessage.includes('time'))) ||
                (key === 'market analysis' && (lowerMessage.includes('market') || lowerMessage.includes('analysis'))) ||
                (key === 'trading tips' && (lowerMessage.includes('trading') || lowerMessage.includes('tips'))) ||
                (key === 'weather impact' && (lowerMessage.includes('weather') || lowerMessage.includes('climate')))) {
                response = value;
                break;
            }
        }

        // Simulate AI thinking delay
        setTimeout(() => {
            this.addAIMessage(response);
        }, 500);
    }

    askAI(query) {
        this.addUserMessage(query);
        this.processMessage(query);
    }
}

// Initialize AI Assistant when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    if (document.getElementById('candlestickChart')) {
        window.aiAssistant = new AIAssistant();
    }
});

// Global functions for backward compatibility
function activateAIAssistant() {
    if (window.aiAssistant) {
        window.aiAssistant.openAI();
    }
}

function closeAIAssistant() {
    if (window.aiAssistant) {
        window.aiAssistant.closeAI();
    }
}

function askAI(query) {
    if (window.aiAssistant) {
        window.aiAssistant.askAI(query);
    }
}

function handleAIInput(event) {
    if (event.key === 'Enter' && window.aiAssistant) {
        window.aiAssistant.sendMessage();
    }
}

function sendAIMessage() {
    if (window.aiAssistant) {
        window.aiAssistant.sendMessage();
    }
}