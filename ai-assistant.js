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
        
        // 问候语
        if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('你好') || lowerMessage.includes('嗨')) {
            return `Hello! 👋 I'm Joe's AI assistant. I'm here to help you learn about Joe's background, projects, and expertise. What would you like to know?`;
        }
        
        // 项目相关 - 更详细的回答
        if (lowerMessage.includes('project') || lowerMessage.includes('work') || lowerMessage.includes('项目')) {
            const projects = CONTEXT_DATA.projects.map(p => 
                `**${p.name}**: ${p.description}\n*Tech Stack*: ${p.tech.join(', ')}\n*Impact*: ${p.impact}`
            ).join('\n\n');
            
            return `Joe has worked on several impactful projects in data science and public health:\n\n${projects}\n\n💡 *Want to see more?* Check out the Projects section for detailed case studies and live demos!`;
        }
        
        // 技能相关 - 分类详细展示
        if (lowerMessage.includes('skill') || lowerMessage.includes('technology') || lowerMessage.includes('tech') || lowerMessage.includes('能力') || lowerMessage.includes('技能')) {
            return `Joe's technical expertise spans multiple domains:\n\n🔧 **Programming Languages**: ${CONTEXT_DATA.skills.programming.join(', ')}\n📊 **Tools & Platforms**: ${CONTEXT_DATA.skills.tools.join(', ')}\n🧠 **Specializations**: ${CONTEXT_DATA.skills.specializations.join(', ')}\n\n*Proficiency Level*: Advanced in Python, R, and Machine Learning; Intermediate in SQL and GIS\n\n📄 Check his resume for detailed skill assessments and certifications!`;
        }
        
        // 教育背景 - 更详细
        if (lowerMessage.includes('education') || lowerMessage.includes('study') || lowerMessage.includes('school') || lowerMessage.includes('university') || lowerMessage.includes('学历') || lowerMessage.includes('教育')) {
            return `🎓 **Education Background**:\n\n**Current**: ${CONTEXT_DATA.education.current}\n• GPA: ${CONTEXT_DATA.education.gpa}\n• Focus: Public Health Analytics & AI Ethics\n\n**Previous**: ${CONTEXT_DATA.education.previous}\n• Graduated: ${CONTEXT_DATA.education.honors}\n• Phi Beta Kappa Honor Society\n\nJoe's academic journey combines rigorous statistical training with practical applications in healthcare and social impact.`;
        }
        
        // 经验相关 - 更详细的职业发展
        if (lowerMessage.includes('experience') || lowerMessage.includes('job') || lowerMessage.includes('internship') || lowerMessage.includes('career') || lowerMessage.includes('经验') || lowerMessage.includes('工作')) {
            const currentRole = CONTEXT_DATA.experience[0];
            const previousRole = CONTEXT_DATA.experience[1];
            return `💼 **Professional Experience**:\n\n**Current Role**: ${currentRole.role} at ${currentRole.company}\n📅 ${currentRole.period} | 📍 ${currentRole.location}\n\n🏆 **Key Achievements**:\n• ${currentRole.highlights.slice(0, 3).join('\n• ')}\n\n**Previous**: ${previousRole.role} at ${previousRole.company}\n• Built NLP models with 92% accuracy\n• Increased user engagement by 35% through A/B testing\n\n🚀 Joe's career trajectory shows consistent growth in data science and public health impact!`;
        }
        
        // 联系方式 - 更友好
        if (lowerMessage.includes('contact') || lowerMessage.includes('email') || lowerMessage.includes('reach') || lowerMessage.includes('hire') || lowerMessage.includes('联系')) {
            return `📬 **Get in Touch with Joe**:\n\n📧 **Email**: ${CONTEXT_DATA.personal.email}\n📍 **Location**: ${CONTEXT_DATA.personal.location}\n\n🌐 **Social Media**: You can find Joe's professional profiles in the About section\n\n💼 **For Opportunities**: Joe is open to discussing research collaborations, consulting projects, and full-time opportunities in data science and public health.\n\n⚡ *Quick tip*: Mention what caught your interest about his work when reaching out!`;
        }
        
        // 关于Joe - 更个性化
        if (lowerMessage.includes('about') || lowerMessage.includes('who is') || lowerMessage.includes('background') || lowerMessage.includes('介绍')) {
            return `👨‍💻 **About Joe Yaochen**:\n\n${CONTEXT_DATA.personal.name} is a passionate ${CONTEXT_DATA.personal.title} specializing in ${CONTEXT_DATA.personal.focus}. Currently based in ${CONTEXT_DATA.personal.location}, he's pursuing his Master's at Harvard University.\n\n🎯 **Mission**: Joe combines technical expertise with social impact, focusing on making healthcare more equitable through data science and ethical AI.\n\n🌟 **What makes Joe unique**:\n• Strong academic foundation (3.9 GPA, Phi Beta Kappa)\n• Real-world impact (published research, 27% improvement in health predictions)\n• Ethical focus (AI fairness, algorithmic bias research)\n\n💡 *Fun fact*: Joe enjoys photography and exploring the intersection of technology and humanity!`;
        }
        
        // 研究兴趣
        if (lowerMessage.includes('research') || lowerMessage.includes('interest') || lowerMessage.includes('focus') || lowerMessage.includes('研究')) {
            return `🔬 **Joe's Research Interests**:\n\n• **AI Ethics**: Algorithmic fairness in healthcare systems\n• **Public Health Analytics**: Predictive modeling for health outcomes\n• **Health Equity**: Using data to address healthcare disparities\n• **Geospatial Analysis**: Urban mobility and accessibility patterns\n\n📚 **Recent Work**: Joe has published findings in peer-reviewed journals and presented at conferences on AI ethics and public health applications.\n\n🎯 His research aims to bridge the gap between cutting-edge technology and social good.`;
        }
        
        // 成就和奖项
        if (lowerMessage.includes('achievement') || lowerMessage.includes('award') || lowerMessage.includes('recognition') || lowerMessage.includes('成就')) {
            return `🏆 **Joe's Achievements**:\n\n🎓 **Academic**: Outstanding Graduate Research Award (2024)\n📄 **Publications**: 2 peer-reviewed journals with 150+ citations\n🏅 **Recognition**: Best Paper Award - AI Ethics Conference (2023)\n📊 **Impact**: Improved health outcome predictions by 27%\n👥 **Leadership**: Mentored 40+ students as Teaching Assistant\n\nJoe's work consistently demonstrates excellence in both research and practical applications!`;
        }
        
        // 未来计划
        if (lowerMessage.includes('future') || lowerMessage.includes('plan') || lowerMessage.includes('goal') || lowerMessage.includes('next') || lowerMessage.includes('未来')) {
            return `🚀 **Joe's Future Vision**:\n\nJoe is passionate about continuing his work at the intersection of data science and social impact. He's particularly interested in:\n\n• **Career**: Roles in health tech, policy research, or academic positions\n• **Research**: Expanding work on AI ethics and health equity\n• **Impact**: Building systems that make healthcare more accessible and fair\n\n💼 **Open to**: Research collaborations, consulting opportunities, and full-time positions that align with his mission of using data for social good.\n\n📧 Reach out at ${CONTEXT_DATA.personal.email} to discuss potential opportunities!`;
        }
        
        // 中文支持
        if (lowerMessage.includes('中文') || lowerMessage.includes('chinese') || lowerMessage.includes('语言')) {
            return `🌏 **Language Support**: While I primarily respond in English, Joe is multilingual and comfortable working in international environments. His academic work at Harvard has given him experience collaborating with diverse, global teams.\n\n📧 Feel free to contact Joe in either English or Chinese at ${CONTEXT_DATA.personal.email}`;
        }
        
        // 通用帮助
        if (lowerMessage.includes('help') || lowerMessage.includes('what can you') || lowerMessage.includes('帮助')) {
            return `🤖 **How I can help you learn about Joe**:\n\n• 📋 **Projects**: Ask about his data science and public health projects\n• 💼 **Experience**: Learn about his research and internship experience  \n• 🎓 **Education**: Discover his academic background and achievements\n• 🛠️ **Skills**: Explore his technical expertise and specializations\n• 📧 **Contact**: Get his contact information and social profiles\n• 🔬 **Research**: Understand his research interests and publications\n\n💡 **Try asking**: "Tell me about Joe's projects" or "What are Joe's research interests?"`;
        }
        
        return null; // 没有匹配的本地回答
    }
    
    getDefaultResponse(message) {
        const responses = [
            "That's an interesting question! 🤔 I can help you learn about Joe's projects, skills, experience, and research interests. Try asking me something like:\n\n• \"Tell me about Joe's projects\"\n• \"What are Joe's skills?\"\n• \"How can I contact Joe?\"\n\nOr explore the different sections of this website for more details!",
            
            "Great question! 💭 While I specialize in sharing information about Joe's background and work, I can tell you about:\n\n• His data science and public health projects\n• His research experience and achievements\n• His technical skills and expertise\n• How to get in touch with him\n\nWhat would you like to know about Joe?",
            
            "I'd love to help you learn more about Joe! 🌟 I have detailed information about his:\n\n• Academic background (Harvard, UC Berkeley)\n• Professional experience in data science\n• Research in AI ethics and public health\n• Technical skills and achievements\n\nFeel free to ask me anything about Joe's work and background!",
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
