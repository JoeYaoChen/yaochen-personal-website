// ===== AI ASSISTANT FUNCTIONALITY =====

// 安全配置 - 请将API密钥存储在环境变量或安全的地方
const AI_CONFIG = {
    // 不要在前端代码中暴露真实的API密钥！
    // 在生产环境中，应该通过后端API来调用OpenAI
    apiKey: '', // 留空，通过环境变量或配置文件设置
    apiUrl: 'https://api.openai.com/v1/chat/completions',
    model: 'gpt-3.5-turbo',
    maxTokens: 500,
    temperature: 0.7
};

// Joe的个人信息和上下文（用于AI回答）
const CONTEXT_DATA = {
    personal: {
        name: 'Joe Yaochen',
        title: 'Data Science Student',
        focus: 'Public Health & AI Ethics',
        location: 'Boston, MA',
        email: 'joe.yaochen@email.com'
    },
    education: {
        current: 'Master of Science in Data Science at Harvard University (2022-2024)',
        previous: 'Bachelor of Science in Statistics at UC Berkeley (2018-2022)',
        gpa: '3.9/4.0',
        honors: 'Magna Cum Laude, Phi Beta Kappa'
    },
    experience: [
        {
            role: 'Research Assistant',
            company: 'Public Health Research Institute',
            period: 'Jun 2023 - Present',
            location: 'Boston, MA',
            highlights: [
                'Developed predictive models improving health outcome predictions by 27%',
                'Analyzed longitudinal health data for 10,000+ patients',
                'Created interactive dashboards reducing report generation time by 40%',
                'Published findings in 2 peer-reviewed journals'
            ]
        },
        {
            role: 'Data Science Intern',
            company: 'HealthTech Startup',
            period: 'Jan 2023 - May 2023',
            location: 'San Francisco, CA',
            highlights: [
                'Built NLP models with 92% accuracy in symptom extraction',
                'Designed A/B testing framework increasing user engagement by 35%',
                'Implemented real-time data pipelines'
            ]
        }
    ],
    skills: {
        programming: ['Python', 'R', 'SQL', 'JavaScript'],
        tools: ['Tableau', 'Apache Kafka', 'Docker', 'Git'],
        specializations: ['Machine Learning', 'NLP', 'GIS', 'Statistical Modeling']
    },
    projects: [
        {
            name: 'Public Health Dashboard',
            description: 'Interactive dashboard analyzing health outcomes across demographics',
            tech: ['Python', 'Tableau', 'Public Health'],
            impact: 'Real-time data visualization and predictive modeling'
        },
        {
            name: 'AI Ethics in Healthcare',
            description: 'Research on algorithmic fairness in medical AI systems',
            tech: ['NLP', 'Ethics', 'Research'],
            impact: 'Bias detection and mitigation strategies'
        },
        {
            name: 'Urban Mobility Analysis',
            description: 'Geospatial analysis of urban transportation patterns',
            tech: ['GIS', 'R', 'Transportation'],
            impact: 'Machine learning to predict mobility trends'
        }
    ],
    interests: ['AI Ethics', 'Public Health', 'Data Visualization', 'Policy Research']
};

// AI助手类
class AIAssistant {
    constructor() {
        this.isOpen = false;
        this.isTyping = false;
        this.messageHistory = [];
        
        this.initializeElements();
        this.attachEventListeners();
        this.initializeWelcomeMessage();
    }
    
    initializeElements() {
        this.assistant = document.getElementById('ai-assistant');
        this.toggle = document.getElementById('ai-toggle');
        this.chat = document.getElementById('ai-chat');
        this.closeBtn = document.getElementById('ai-close');
        this.messages = document.getElementById('ai-messages');
        this.input = document.getElementById('ai-input');
        this.sendBtn = document.getElementById('ai-send');
        this.suggestions = document.querySelectorAll('.ai-suggestion');
    }
    
    attachEventListeners() {
        // 切换聊天窗口
        this.toggle.addEventListener('click', () => this.toggleChat());
        this.closeBtn.addEventListener('click', () => this.closeChat());
        
        // 发送消息
        this.sendBtn.addEventListener('click', () => this.sendMessage());
        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        
        // 建议按钮
        this.suggestions.forEach(suggestion => {
            suggestion.addEventListener('click', () => {
                const question = suggestion.getAttribute('data-question');
                this.input.value = question;
                this.sendMessage();
            });
        });
        
        // 点击外部关闭
        document.addEventListener('click', (e) => {
            if (!this.assistant.contains(e.target) && this.isOpen) {
                this.closeChat();
            }
        });
    }
    
    initializeWelcomeMessage() {
        // 欢迎消息已经在HTML中定义
        this.messageHistory.push({
            role: 'assistant',
            content: "Hi! I'm Joe's AI assistant. I can help you learn more about his projects, experience, and skills. What would you like to know?"
        });
    }
    
    toggleChat() {
        if (this.isOpen) {
            this.closeChat();
        } else {
            this.openChat();
        }
    }
    
    openChat() {
        this.chat.classList.add('visible');
        this.isOpen = true;
        this.input.focus();
        
        // 隐藏建议按钮如果已经有对话
        if (this.messageHistory.length > 1) {
            document.querySelector('.ai-suggestions').style.display = 'none';
        }
    }
    
    closeChat() {
        this.chat.classList.remove('visible');
        this.isOpen = false;
    }
    
    async sendMessage() {
        const message = this.input.value.trim();
        if (!message || this.isTyping) return;
        
        // 添加用户消息
        this.addMessage('user', message);
        this.input.value = '';
        this.hideInitialSuggestions();
        
        // 显示输入状态
        this.showTyping();
        
        try {
            // 获取AI回复
            const response = await this.getAIResponse(message);
            this.hideTyping();
            this.addMessage('assistant', response);
        } catch (error) {
            console.error('AI response error:', error);
            this.hideTyping();
            this.addMessage('assistant', "抱歉，我现在无法回答您的问题。请稍后再试，或者您可以直接通过邮件联系Joe：joe.yaochen@email.com");
        }
    }
    
    addMessage(role, content) {
        const messageEl = document.createElement('div');
        messageEl.className = `ai-message ai-message-${role}`;
        
        const avatarEl = document.createElement('div');
        avatarEl.className = 'ai-message-avatar';
        
        if (role === 'assistant') {
            avatarEl.innerHTML = '<i data-lucide="bot"></i>';
        } else {
            avatarEl.innerHTML = '<i data-lucide="user"></i>';
        }
        
        const contentEl = document.createElement('div');
        contentEl.className = 'ai-message-content';
        contentEl.innerHTML = `<p>${this.formatMessage(content)}</p>`;
        
        messageEl.appendChild(avatarEl);
        messageEl.appendChild(contentEl);
        
        this.messages.appendChild(messageEl);
        this.scrollToBottom();
        
        // 重新初始化Lucide图标
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        
        // 添加到消息历史
        this.messageHistory.push({ role, content });
    }
    
    formatMessage(content) {
        // 简单的markdown格式化
        return content
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`(.*?)`/g, '<code>$1</code>')
            .replace(/\n/g, '<br>');
    }
    
    showTyping() {
        this.isTyping = true;
        this.sendBtn.disabled = true;
        
        const typingEl = document.createElement('div');
        typingEl.className = 'ai-message ai-message-bot';
        typingEl.id = 'typing-indicator';
        
        typingEl.innerHTML = `
            <div class="ai-message-avatar">
                <i data-lucide="bot"></i>
            </div>
            <div class="ai-message-content">
                <div class="ai-typing">
                    <span>AI is thinking</span>
                    <div class="ai-typing-dots">
                        <div class="ai-typing-dot"></div>
                        <div class="ai-typing-dot"></div>
                        <div class="ai-typing-dot"></div>
                    </div>
                </div>
            </div>
        `;
        
        this.messages.appendChild(typingEl);
        this.scrollToBottom();
        
        // 重新初始化Lucide图标
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }
    
    hideTyping() {
        this.isTyping = false;
        this.sendBtn.disabled = false;
        
        const typingEl = document.getElementById('typing-indicator');
        if (typingEl) {
            typingEl.remove();
        }
    }
    
    hideInitialSuggestions() {
        const suggestions = document.querySelector('.ai-suggestions');
        if (suggestions && this.messageHistory.length > 1) {
            suggestions.style.display = 'none';
        }
    }
    
    scrollToBottom() {
        setTimeout(() => {
            this.messages.scrollTop = this.messages.scrollHeight;
        }, 100);
    }
    
    async getAIResponse(userMessage) {
        // 首先尝试本地知识库回答
        const localResponse = this.getLocalResponse(userMessage);
        if (localResponse) {
            return localResponse;
        }
        
        // 如果没有API密钥，返回默认回答
        if (!AI_CONFIG.apiKey) {
            return this.getDefaultResponse(userMessage);
        }
        
        // 调用OpenAI API（需要配置API密钥）
        try {
            const response = await fetch(AI_CONFIG.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${AI_CONFIG.apiKey}`
                },
                body: JSON.stringify({
                    model: AI_CONFIG.model,
                    messages: [
                        {
                            role: 'system',
                            content: this.getSystemPrompt()
                        },
                        ...this.messageHistory.slice(-5), // 保持最近5条消息的上下文
                        {
                            role: 'user',
                            content: userMessage
                        }
                    ],
                    max_tokens: AI_CONFIG.maxTokens,
                    temperature: AI_CONFIG.temperature
                })
            });
            
            if (!response.ok) {
                throw new Error(`API request failed: ${response.status}`);
            }
            
            const data = await response.json();
            return data.choices[0].message.content;
            
        } catch (error) {
            console.error('OpenAI API error:', error);
            return this.getDefaultResponse(userMessage);
        }
    }
    
    getSystemPrompt() {
        return `You are Joe Yaochen's AI assistant on his personal website. Your role is to help visitors learn about Joe's background, projects, and experience in a friendly and informative way.

Key information about Joe:
- Name: ${CONTEXT_DATA.personal.name}
- Title: ${CONTEXT_DATA.personal.title}
- Focus: ${CONTEXT_DATA.personal.focus}
- Location: ${CONTEXT_DATA.personal.location}
- Email: ${CONTEXT_DATA.personal.email}

Education:
- ${CONTEXT_DATA.education.current}
- ${CONTEXT_DATA.education.previous}

Experience: ${JSON.stringify(CONTEXT_DATA.experience)}
Skills: ${JSON.stringify(CONTEXT_DATA.skills)}
Projects: ${JSON.stringify(CONTEXT_DATA.projects)}

Guidelines:
1. Be helpful, friendly, and professional
2. Focus on Joe's work and qualifications
3. Encourage visitors to explore the website or contact Joe
4. If asked about something not in Joe's profile, politely redirect to relevant information
5. Keep responses concise but informative
6. Use a conversational tone
7. Don't make up information not provided in the context`;
    }
    
    getLocalResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        // 项目相关
        if (lowerMessage.includes('project') || lowerMessage.includes('work')) {
            const projects = CONTEXT_DATA.projects.map(p => 
                `**${p.name}**: ${p.description} (${p.tech.join(', ')})`
            ).join('\n\n');
            
            return `Joe has worked on several interesting projects:\n\n${projects}\n\nYou can see more details in the Projects section of the website!`;
        }
        
        // 技能相关
        if (lowerMessage.includes('skill') || lowerMessage.includes('technology') || lowerMessage.includes('tech')) {
            return `Joe has expertise in:\n\n**Programming**: ${CONTEXT_DATA.skills.programming.join(', ')}\n**Tools**: ${CONTEXT_DATA.skills.tools.join(', ')}\n**Specializations**: ${CONTEXT_DATA.skills.specializations.join(', ')}\n\nCheck out his resume for more details!`;
        }
        
        // 教育背景
        if (lowerMessage.includes('education') || lowerMessage.includes('study') || lowerMessage.includes('school') || lowerMessage.includes('university')) {
            return `Joe is currently pursuing a ${CONTEXT_DATA.education.current} with a GPA of ${CONTEXT_DATA.education.gpa}. He previously completed his ${CONTEXT_DATA.education.previous}, graduating ${CONTEXT_DATA.education.honors}.`;
        }
        
        // 经验相关
        if (lowerMessage.includes('experience') || lowerMessage.includes('job') || lowerMessage.includes('internship')) {
            const currentRole = CONTEXT_DATA.experience[0];
            return `Joe is currently working as a ${currentRole.role} at ${currentRole.company} since ${currentRole.period.split(' - ')[0]}. Some key achievements include:\n\n• ${currentRole.highlights.slice(0, 2).join('\n• ')}\n\nYou can see his full experience timeline on the website!`;
        }
        
        // 联系方式
        if (lowerMessage.includes('contact') || lowerMessage.includes('email') || lowerMessage.includes('reach')) {
            return `You can contact Joe at:\n\n📧 **Email**: ${CONTEXT_DATA.personal.email}\n📍 **Location**: ${CONTEXT_DATA.personal.location}\n\nYou can also find him on social media through the links in the About section!`;
        }
        
        // 关于Joe
        if (lowerMessage.includes('about') || lowerMessage.includes('who is') || lowerMessage.includes('background')) {
            return `${CONTEXT_DATA.personal.name} is a ${CONTEXT_DATA.personal.title} focused on ${CONTEXT_DATA.personal.focus}. He's currently based in ${CONTEXT_DATA.personal.location} and pursuing his Master's at Harvard University.\n\nJoe combines technical expertise with a strong commitment to social impact, particularly in healthcare and AI ethics. Feel free to explore the different sections of his website to learn more!`;
        }
        
        return null; // 没有匹配的本地回答
    }
    
    getDefaultResponse(message) {
        const responses = [
            "Thanks for your question! While I'd love to give you a detailed answer, I'm currently running in demo mode. You can find more information about Joe in the different sections of this website, or feel free to contact him directly at joe.yaochen@email.com.",
            
            "That's a great question! Joe would be happy to discuss this with you. You can reach out to him at joe.yaochen@email.com or explore his projects and experience on this website.",
            
            "I appreciate your interest in Joe's work! For the most up-to-date and detailed information, I'd recommend checking out his resume section or contacting him directly at joe.yaochen@email.com.",
        ];
        
        return responses[Math.floor(Math.random() * responses.length)];
    }
}

// 初始化AI助手
let aiAssistant;

document.addEventListener('DOMContentLoaded', function() {
    aiAssistant = new AIAssistant();
});

// 导出AI助手类（如果需要在其他地方使用）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AIAssistant;
}
