import { defineConfig } from '@rspress/core';
import path from 'node:path';
import rspressPluginArticleStats from '@sonder/rspress-plugin-article-stats';

export default defineConfig({
  plugins: [
    rspressPluginArticleStats({
      defaultLocale: 'zh-CN',
    }),
  ],

  // 站点基本信息
  title: 'Sonder Blog',
  description: '基于 Rspress 构建的技术博客',
  icon: '/logo.svg',
  logo: '/logo.svg',
  logoText: 'Sonder Blog',

  // 根目录配置 - 文档放在 docs 目录
  root: path.join(__dirname, 'docs'),

  // 路由配置
  route: {
    cleanUrls: true,
  },

  // Markdown 配置
  markdown: {
    showLineNumbers: true,
    defaultWrapCode: false,
  },

  // 全局样式
  globalStyles: path.join(__dirname, 'styles/index.css'),

  // 主题配置
  themeConfig: {
    // 社交链接
    socialLinks: [
      {
        icon: 'github',
        mode: 'link',
        content: 'https://github.com',
      },
    ],

    // 页脚
    footer: {
      message: 'Released under the MIT License.',
    },

    // 上次更新时间
    lastUpdated: true,

    // 启用文档上的滚动到顶部按钮
    enableScrollToTop: true,
  },

  // 构建配置
  builderConfig: {
    resolve: {
      alias: {
        '@': path.join(__dirname, 'src'),
        '@components': path.join(__dirname, 'src/components'),
      },
    },
    tools: {
      rspack: {
        // 忽略 flexsearch 的 import.meta.dirname 警告
        ignoreWarnings: [/import\.meta\.dirname/],
      },
    },
  },
});
