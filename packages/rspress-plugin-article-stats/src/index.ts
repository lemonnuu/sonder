import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import readingTime from 'reading-time';
import type { ReadTimeResults } from 'reading-time';
import type { RspressPlugin } from '@rspress/core';
import {
  RemarkInsertComponentPluginFactory,
  type WithDefaultLocale,
} from '@sonder/rspress-plugin-devkit';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const COMPONENTS_DIR = join(__dirname, '..', 'components');

export interface ArticleStatsOptions extends WithDefaultLocale {
  /**
   * 自定义阅读时间计算函数
   */
  getReadingTime?: (content: string) => ReadTimeResults;
  /**
   * 组件插入位置
   * @default 'after-first-heading'
   */
  position?: 'pre' | 'post' | 'after-first-heading';
}

export interface ArticleStatsData {
  readingTime: ReadTimeResults;
  wordCount: number;
}

export default function rspressPluginArticleStats(
  options: ArticleStatsOptions = {}
): RspressPlugin {
  const {
    getReadingTime = readingTime,
    defaultLocale = 'zh-CN',
    position = 'after-first-heading',
  } = options;

  const remarkInsertArticleStats = new RemarkInsertComponentPluginFactory({
    components: [
      {
        componentPath: join(COMPONENTS_DIR, 'ArticleStats.tsx'),
        position,
        propsProvider: () => ({ defaultLocale }),
      },
    ],
  });

  return {
    name: '@sonder/rspress-plugin-article-stats',

    config(config) {
      // rspress v2 默认使用 JS 版本的 MDX 处理
      return config;
    },

    extendPageData(pageData) {
      const content = pageData.content || '';
      const stats = getReadingTime(content);

      // 扩展页面数据，添加阅读统计信息
      (pageData as unknown as Record<string, unknown>).articleStats = {
        readingTime: stats,
        wordCount: stats.words,
      } satisfies ArticleStatsData;
    },

    markdown: {
      remarkPlugins: [remarkInsertArticleStats.remarkPlugin],
      globalComponents: remarkInsertArticleStats.mdxComponents,
    },

    builderConfig: {
      source: {
        include: [COMPONENTS_DIR],
      },
    },
  };
}

export type { ReadTimeResults };
