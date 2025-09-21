# AI助手设置指南

## 🤖 功能说明

您的个人网站现在包含一个智能AI助手，可以回答关于您的项目、经验和技能的问题。AI助手具有以下特性：

- 💬 **智能对话**：基于您的个人信息回答访问者问题
- 🎨 **美观界面**：与网站设计风格一致的聊天界面
- 📱 **响应式设计**：在所有设备上完美工作
- 🔒 **安全设计**：API密钥安全管理
- ⚡ **快速响应**：本地知识库 + AI增强

## 🔧 配置OpenAI API（可选）

### 方法一：使用环境变量（推荐）

1. **获取OpenAI API密钥**
   - 访问 [OpenAI Platform](https://platform.openai.com/api-keys)
   - 创建新的API密钥
   - ⚠️ **重要**：立即撤销您之前暴露的密钥！

2. **设置环境变量**
   ```bash
   # 在您的服务器上设置环境变量
   export OPENAI_API_KEY="your-new-api-key-here"
   ```

3. **修改配置文件**
   在 `ai-assistant.js` 中修改：
   ```javascript
   const AI_CONFIG = {
       apiKey: process.env.OPENAI_API_KEY || '', // 从环境变量读取
       // ... 其他配置
   };
   ```

### 方法二：使用后端代理（最安全）

创建一个后端API来处理OpenAI请求：

```javascript
// backend/api/chat.js
export default async function handler(req, res) {
    const { message } = req.body;
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [/* ... */]
        })
    });
    
    const data = await response.json();
    res.json(data);
}
```

然后在前端调用您的API而不是直接调用OpenAI。

## 📝 自定义AI助手

### 1. 更新个人信息

在 `ai-assistant.js` 中修改 `CONTEXT_DATA` 对象：

```javascript
const CONTEXT_DATA = {
    personal: {
        name: 'Your Name',
        title: 'Your Title',
        focus: 'Your Focus Area',
        location: 'Your Location',
        email: 'your.email@domain.com'
    },
    // 更新其他信息...
};
```

### 2. 添加新的问题回答

在 `getLocalResponse` 方法中添加新的关键词匹配：

```javascript
// 添加新的问题类型
if (lowerMessage.includes('hobby') || lowerMessage.includes('interest')) {
    return `Joe enjoys photography, reading about policy and ethics, and exploring new cities...`;
}
```

### 3. 自定义建议问题

在HTML中修改建议按钮：

```html
<div class="ai-suggestions">
    <button class="ai-suggestion" data-question="Your custom question">Custom</button>
    <!-- 添加更多建议 -->
</div>
```

## 🎨 界面自定义

### 修改颜色主题

在 `styles.css` 中调整AI助手的颜色：

```css
.ai-toggle {
    background: linear-gradient(135deg, your-color-1, your-color-2);
}

.ai-send {
    background-color: your-accent-color;
}
```

### 调整大小和位置

```css
.ai-chat {
    width: 400px; /* 调整宽度 */
    height: 600px; /* 调整高度 */
}
```

## 📊 使用统计

AI助手会自动记录以下信息（在浏览器控制台中）：

- 对话次数
- 常见问题类型
- 用户互动模式

您可以扩展这些功能来收集更详细的分析数据。

## 🔒 安全最佳实践

1. **永远不要在前端代码中硬编码API密钥**
2. **使用环境变量或后端代理**
3. **定期轮换API密钥**
4. **设置API使用限制和监控**
5. **对用户输入进行验证和清理**

## 🚀 部署注意事项

### GitHub Pages

如果使用GitHub Pages，AI助手将在"演示模式"下运行，使用本地知识库回答问题。

### Vercel/Netlify

这些平台支持环境变量，您可以安全地配置OpenAI API：

1. 在平台控制面板中添加环境变量 `OPENAI_API_KEY`
2. 重新部署网站

### 自定义服务器

确保在服务器上设置环境变量，并且不要将API密钥提交到版本控制。

## 🐛 故障排除

### AI助手不显示
- 检查浏览器控制台是否有JavaScript错误
- 确认所有脚本文件都正确加载

### API调用失败
- 验证API密钥是否正确设置
- 检查网络连接和CORS设置
- 查看OpenAI API配额和使用情况

### 响应质量不佳
- 更新 `CONTEXT_DATA` 中的信息
- 调整系统提示词（`getSystemPrompt`方法）
- 增加本地知识库的覆盖范围

## 📞 支持

如果您需要帮助设置AI助手，请：

1. 检查浏览器控制台的错误信息
2. 确认所有文件都正确上传
3. 验证API配置是否正确

记住：即使没有OpenAI API，AI助手也能通过本地知识库提供有用的回答！

---

**安全提醒**：请立即撤销您之前提供的API密钥，并生成新的密钥用于生产环境。
