---
title: 配置指南
createdAt: '2025-12-18 11:14:43'
---

# 配置指南

Rspress 提供了丰富的配置选项，让你可以灵活定制博客。

## 基础配置

在 `rspress.config.ts` 中配置站点基本信息：

```ts
import { defineConfig } from '@rspress/core';

export default defineConfig({
  title: 'My Blog',
  description: '我的技术博客',
  icon: '/favicon.ico',
  logo: '/logo.svg',
});
```

## 主题配置

通过 `themeConfig` 自定义主题：

```ts
export default defineConfig({
  themeConfig: {
    // 导航栏
    nav: [
      { text: '首页', link: '/' },
      { text: '指南', link: '/guide/' },
    ],
    // 侧边栏
    sidebar: {
      '/guide/': [
        { text: '快速开始', link: '/guide/' },
        { text: '配置指南', link: '/guide/config' },
      ],
    },
    // 社交链接
    socialLinks: [
      { icon: 'github', mode: 'link', content: 'https://github.com' },
    ],
  },
});
```

## Markdown 配置

配置 Markdown 解析和渲染：

```ts
export default defineConfig({
  markdown: {
    showLineNumbers: true,
    defaultWrapCode: false,
  },
});
```

## 构建配置

通过 `builderConfig` 配置 Rsbuild：

```ts
export default defineConfig({
  builderConfig: {
    source: {
      alias: {
        '@': './src',
      },
    },
  },
});
```

## 插件配置

使用插件扩展功能：

```ts
import { pluginSitemap } from '@rspress/plugin-sitemap';

export default defineConfig({
  plugins: [
    pluginSitemap({
      siteUrl: 'https://example.com',
    }),
  ],
});
```
