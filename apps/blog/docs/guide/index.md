---
title: 快速开始
---

# 快速开始

欢迎使用 Sonder Blog！本指南将帮助你快速了解项目结构和使用方法。

## 项目结构

```bash
apps/blog/
├── src/                    # 页面和组件
│   ├── components/         # React 组件
│   ├── guide/              # 指南文档
│   └── index.md            # 首页
├── static/                 # 静态资源
├── rspress.config.ts       # Rspress 配置
├── tsconfig.json           # TypeScript 配置
└── package.json            # 项目依赖
```

## 开发命令

```bash
# 启动开发服务器
pnpm dev:blog

# 构建生产版本
pnpm build:blog

# 预览构建结果
pnpm preview:blog
```

## 添加新页面

在 `src` 目录下创建 `.md` 或 `.mdx` 文件即可自动生成路由。

例如，创建 `src/about.md` 将生成 `/about` 路由。

## 使用组件

你可以在 MDX 文件中使用 React 组件：

```mdx
import { Button } from '@/components/Button';

<Button>点击我</Button>
```

## 下一步

- 查看 [配置指南](/guide/config) 了解更多配置选项
- 探索 [组件开发](/guide/components) 学习如何创建自定义组件
