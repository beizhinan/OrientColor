# OrientColor - 色彩主题小程序

![项目Logo](static/logo.png) <!-- 可选 -->

一款基于 uni-app 开发的色彩主题展示与管理小程序，包含开屏广告、多导航页和个性化推荐功能。

## 📌 目录
- [功能特性](#-功能特性)
- [快速开始](#-快速开始)
  - [环境要求](#环境要求)
  - [安装步骤](#安装步骤)
- [开发指南](#-开发指南)
  - [项目结构](#项目结构)
  - [脚本命令](#脚本命令)
  - [代码规范](#代码规范)
- [团队协作](#-团队协作)
- [FAQ](#-faq)

## 🌟 功能特性
- 开屏广告（5秒自动跳过 + 手动跳过）
- 底部四栏导航：首页、展示、检索、个人中心
- 色彩主题推荐算法
- 用户收藏管理（开发中）

## 🚀 快速开始

### 环境要求
- Node.js 16+
- HBuilderX 或 VS Code
- 微信开发者工具（小程序调试）

### 安装步骤
```bash
# 克隆仓库
git clone https://github.com/beizhinan/OrientColor.git

# 进入项目目录
cd OrientColor

# 安装依赖
npm install

# 启动开发模式（微信小程序）
npm run dev:mp-weixin
用微信开发者工具打开 dist/dev/mp-weixin 目录

🛠 开发指南
项目结构
text
orientColor/
├── pages/                # 页面组件
│   ├── index/            # 首页
│   ├── showcase/         # 色彩展示
│   ├── search/           # 检索页
│   └── user/             # 个人中心
├── static/               # 静态资源
│   ├── splash.jpg        # 开屏广告图
│   └── tabs/             # 导航栏图标
├── App.vue               # 根组件（含开屏逻辑）
└── pages.json            # 页面配置
脚本命令
命令	描述
npm run dev:mp-weixin	微信小程序开发模式
npm run build:mp-weixin	生产环境打包
npm run lint	ESLint 代码检查
代码规范
组件使用 PascalCase 命名（如 ColorCard.vue）

页面路由定义在 pages.json

提交信息遵循 Conventional Commits
