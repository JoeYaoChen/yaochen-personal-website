# Joe Yaochen - 个人网站

一个现代化、响应式的个人网站，采用中国风设计美学，展示个人项目、经历、写作和简历。

## ✨ 特色功能

### 🎨 设计特色
- **中国风美学**：藕荷色主色调，雅紫辅色，极简设计
- **现代交互**：流畅的动画效果和微交互
- **响应式设计**：完美适配桌面、平板和移动设备
- **无障碍支持**：遵循 WCAG 2.1 AA 标准

### 📱 页面结构
- **首页**：个人介绍 + 照片轮播 + 精选项目 + 最新写作
- **项目页**：项目展示 + 筛选搜索功能
- **经历页**：时间轴展示工作和实习经历
- **写作页**：文章列表 + 分类筛选
- **简历页**：在线简历 + 中英文切换 + PDF下载
- **关于页**：个人介绍 + 技能展示 + 联系表单

### 🚀 技术特色
- **纯前端**：使用 HTML5、CSS3、JavaScript ES6+
- **CDN资源**：所有依赖通过CDN加载，无需构建
- **性能优化**：图片懒加载、资源预加载、代码分割
- **SEO友好**：语义化HTML、Open Graph标签、结构化数据

## 🛠️ 技术栈

- **HTML5**：语义化标签、无障碍支持
- **CSS3**：CSS变量、Flexbox、Grid、动画
- **JavaScript ES6+**：模块化、异步处理、事件委托
- **字体**：Inter (英文) + 思源黑体 (中文)
- **图标**：Lucide Icons
- **图片**：Unsplash 高质量图片

## 📂 文件结构

```
personal website/
├── index.html          # 主页面文件
├── styles.css          # 样式文件
├── script.js           # JavaScript功能
├── README.md           # 项目说明
└── assets/             # 资源文件夹（可选）
    ├── images/         # 本地图片
    ├── documents/      # PDF文件等
    └── icons/          # 图标文件
```

## 🚀 快速开始

### 方法一：直接打开
1. 下载所有文件到本地文件夹
2. 双击 `index.html` 在浏览器中打开

### 方法二：本地服务器
```bash
# 使用 Python 3
python3 -m http.server 8000

# 使用 Node.js (需要安装 http-server)
npx http-server

# 使用 PHP
php -S localhost:8000
```

然后在浏览器访问 `http://localhost:8000`

## 🎨 自定义配置

### 1. 个人信息配置

在 `index.html` 中修改以下内容：

```html
<!-- 基本信息 -->
<h1 class="hero-title">Hi, I'm [Your Name]</h1>
<p class="hero-subtitle">[Your Title]</p>
<p class="hero-description">[Your Description]</p>

<!-- 联系信息 -->
<span><i data-lucide="mail"></i> [your.email@domain.com]</span>
<span><i data-lucide="phone"></i> [Your Phone]</span>
```

### 2. 颜色主题配置

在 `styles.css` 的 `:root` 选择器中修改：

```css
:root {
    --color-primary: #E6B8D6;         /* 主色调 */
    --color-secondary: #9B7CB6;       /* 辅色调 */
    --color-accent: #F5E6A3;          /* 强调色 */
    /* 更多颜色变量... */
}
```

### 3. 内容配置

#### 项目数据
在 `index.html` 中找到项目卡片部分，修改：
- 项目标题和描述
- 技术标签
- 项目链接
- 项目图片

#### 经历数据
在时间轴部分修改：
- 公司信息和Logo
- 职位和时间
- 工作成果描述
- 技能标签

#### 写作内容
修改文章列表：
- 文章标题和摘要
- 发布日期
- 分类标签
- 封面图片

### 4. 图片替换

#### 轮播图片
```html
<img src="[Your Image URL]" alt="[Description]" />
```

推荐尺寸：1200×800px，比例 3:2

#### 项目图片
推荐尺寸：400×250px，比例 16:10

#### 头像图片
推荐尺寸：200×200px，正方形

## 📱 响应式断点

```css
/* 移动端 */
@media (max-width: 640px) { ... }

/* 平板 */
@media (max-width: 1024px) { ... }

/* 桌面端 */
@media (min-width: 1025px) { ... }
```

## 🎯 SEO 优化

### 1. 元数据配置
```html
<title>Your Name - Your Title</title>
<meta name="description" content="Your description">
<meta property="og:title" content="Your Name">
<meta property="og:description" content="Your description">
<meta property="og:image" content="Your image URL">
```

### 2. 结构化数据
网站已包含 JSON-LD 结构化数据，支持：
- Person schema（个人信息）
- CreativeWork schema（项目和文章）
- Organization schema（工作经历）

### 3. 站点地图
创建 `sitemap.xml`：
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://yourdomain.com/</loc>
    <lastmod>2024-03-01</lastmod>
    <priority>1.0</priority>
  </url>
</urlset>
```

## 📊 性能优化

### 已实现的优化
- ✅ 图片懒加载
- ✅ 资源预加载
- ✅ CSS和JS压缩
- ✅ 字体优化加载
- ✅ 防抖和节流
- ✅ 事件委托

### 进一步优化建议
- 使用 WebP 格式图片
- 启用 Gzip 压缩
- 配置 CDN
- 添加 Service Worker
- 使用 Critical CSS

## 🔧 功能说明

### 导航系统
- 单页面应用导航
- 移动端汉堡菜单
- 滚动时导航栏样式变化
- 键盘导航支持

### 轮播功能
- 自动轮播（5秒间隔）
- 手动切换（按钮和指示点）
- 触摸滑动支持
- 键盘方向键支持
- 悬停暂停功能

### 筛选系统
- 项目分类筛选
- 关键词搜索
- 实时筛选结果
- 无结果状态处理

### 表单处理
- 客户端验证
- 加载状态显示
- 成功/错误提示
- 无障碍支持

## 🌐 部署指南

### Netlify 部署
1. 将文件上传到 GitHub 仓库
2. 连接 Netlify 到仓库
3. 配置构建设置（无需构建命令）
4. 发布网站

### Vercel 部署
1. 安装 Vercel CLI：`npm i -g vercel`
2. 在项目目录运行：`vercel`
3. 按提示配置部署

### GitHub Pages 部署
1. 上传文件到 GitHub 仓库
2. 在仓库设置中启用 Pages
3. 选择 main 分支作为源
4. 访问 `https://username.github.io/repository-name`

### 自定义域名配置
1. 在域名提供商配置 DNS
2. 添加 CNAME 记录指向部署平台
3. 在部署平台配置自定义域名
4. 启用 HTTPS

## 📝 内容管理

### 添加新项目
1. 在 `index.html` 中复制项目卡片模板
2. 修改项目信息：标题、描述、标签、链接
3. 添加项目图片
4. 更新筛选标签

### 添加新文章
1. 复制文章条目模板
2. 修改文章信息：标题、摘要、日期、标签
3. 添加文章封面图
4. 更新分类筛选

### 更新简历
1. 修改在线简历内容
2. 更新 PDF 文件
3. 更新下载链接
4. 添加新的经历和技能

## 🎨 设计系统

### 颜色规范
- **主色 (Primary)**：#E6B8D6 - 藕荷色
- **辅色 (Secondary)**：#9B7CB6 - 雅紫色
- **强调色 (Accent)**：#F5E6A3 - 金砂色
- **文本色**：#2C2C2C / #666666 / #999999
- **背景色**：#FEFEFE / #F9F7FA

### 字体规范
- **英文标题**：Playfair Display
- **英文正文**：Inter
- **中文**：PingFang SC / Hiragino Sans GB / Microsoft YaHei

### 间距规范
- **xs**: 0.5rem (8px)
- **sm**: 1rem (16px)
- **md**: 1.5rem (24px)
- **lg**: 2rem (32px)
- **xl**: 3rem (48px)
- **2xl**: 4rem (64px)
- **3xl**: 6rem (96px)

### 圆角规范
- **sm**: 8px
- **md**: 16px
- **lg**: 20px
- **xl**: 24px

## 🔍 浏览器支持

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+
- ❌ Internet Explorer (不支持)

## 📞 技术支持

如需帮助或有问题，请：
1. 查看本文档的常见问题
2. 检查浏览器开发者工具的控制台错误
3. 确认所有文件路径正确
4. 验证 CDN 资源可访问

## 📄 许可证

本项目采用 MIT 许可证。您可以自由使用、修改和分发。

---

**Made with ❤️ in Boston**

*最后更新：2024年3月*
