# OrientColor - 色彩主题小程序

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

## 🌟 功能特性

- 开屏广告（5 秒自动跳过 + 手动跳过）
- 底部四栏导航：首页、展示、检索、个人中心

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
```

> 用微信开发者工具打开 `dist/dev/mp-weixin` 目录

## 🛠 开发指南

### 项目结构

```
orientColor/
├── components/           # 自定义组件封装
├── pages/                # 页面组件
│   ├── ads/              # 开屏广告页面
│   ├── index/            # 首页
│   ├── showcase/         # 色彩展示
│   ├── search/           # 检索页
│   └── user/             # 个人中心
├── static/               # 静态资源
│   ├── splash.jpg        # 开屏广告图
│   └── tabs/             # 导航栏图标
├── App.vue               # 根组件
└── pages.json            # 页面配置
```

### 脚本命令

| 命令                      | 描述               |
| ------------------------- | ------------------ |
| `npm run dev:mp-weixin`   | 微信小程序开发模式 |
| `npm run build:mp-weixin` | 生产环境打包       |
| `npm run lint`            | ESLint 代码检查    |

> 使用差量编译，修改后自动刷新

### 代码规范

1. 组件使用 **PascalCase** 命名（如 `ColorCard.vue`）
2. 页面路由定义在 `pages.json`
3. 提交信息遵循 [Conventional Commits](https://www.conventionalcommits.org/)
