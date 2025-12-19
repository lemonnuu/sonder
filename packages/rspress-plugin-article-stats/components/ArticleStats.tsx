import React, { useState, useEffect } from 'react';
import { usePageData, useLang, useDark } from '@rspress/core/runtime';
import './ArticleStats.css';

interface ReadTimeResults {
  text: string;
  minutes: number;
  time: number;
  words: number;
}

type PresetLocale = 'zh-CN' | 'en-US';

interface ArticleStatsData {
  readingTime: ReadTimeResults;
  wordCount: number;
  createdAt?: string;
}

interface ArticleStatsProps {
  defaultLocale?: PresetLocale;
}

const localeTexts: Record<PresetLocale, {
  readingTime: (minutes: number) => string;
  wordCount: (count: number) => string;
  createdAt: (date: string) => string;
}> = {
  'zh-CN': {
    readingTime: (minutes) =>
      minutes >= 1 ? `阅读时间: ${Math.ceil(minutes)} 分钟` : '阅读时间: 小于 1 分钟',
    wordCount: (count) => `字数: ${count.toLocaleString()}`,
    createdAt: (date) => `创建于: ${date}`,
  },
  'en-US': {
    readingTime: (minutes) =>
      minutes >= 1 ? `Reading time: ${Math.ceil(minutes)} min` : 'Reading time: less than 1 min',
    wordCount: (count) => `Words: ${count.toLocaleString()}`,
    createdAt: (date) => `Created: ${date}`,
  },
};

function getLocaleText(lang: string, defaultLocale: PresetLocale): typeof localeTexts['zh-CN'] {
  if (lang in localeTexts) {
    return localeTexts[lang as PresetLocale];
  }
  return localeTexts[defaultLocale];
}

export const ArticleStats: React.FC<ArticleStatsProps> = ({ defaultLocale = 'zh-CN' }) => {
  const pageData = usePageData();
  const lang = useLang();
  const dark = useDark();

  const articleStats = (pageData.page as Record<string, unknown>).articleStats as ArticleStatsData | undefined;

  const [texts, setTexts] = useState(() => getLocaleText(lang, defaultLocale));

  useEffect(() => {
    setTexts(getLocaleText(lang, defaultLocale));
  }, [lang, defaultLocale]);

  // 如果没有统计数据，不渲染
  if (!articleStats) {
    return null;
  }

  const { readingTime, wordCount, createdAt } = articleStats;

  // 解析日期，优先匹配 YYYY-MM-DD 格式，否则尝试转换为时间戳再格式化
  const getCreatedDate = (dateStr?: string): string | undefined => {
    if (!dateStr) return undefined;

    // 优先匹配 YYYY-MM-DD 格式
    const match = dateStr.match(/^\d{4}-\d{2}-\d{2}/);
    if (match) return match[0];

    // 兜底：尝试解析为时间戳再格式化
    const timestamp = Date.parse(dateStr);
    if (!isNaN(timestamp)) {
      const date = new Date(timestamp);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }

    return undefined;
  };

  const createdDate = getCreatedDate(createdAt);

  return (
    <div className="rp-article-stats" data-dark={String(dark)}>
      {createdDate && (
        <>
          <span className="rp-article-stats__item rp-article-stats__created-at">
            <svg
              className="rp-article-stats__icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            {texts.createdAt(createdDate)}
          </span>
          <span className="rp-article-stats__separator">·</span>
        </>
      )}
      <span className="rp-article-stats__item rp-article-stats__reading-time">
        <svg
          className="rp-article-stats__icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="10" />
          <polyline points="12,6 12,12 16,14" />
        </svg>
        {texts.readingTime(readingTime.minutes)}
      </span>
      <span className="rp-article-stats__separator">·</span>
      <span className="rp-article-stats__item rp-article-stats__word-count">
        <svg
          className="rp-article-stats__icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14,2 14,8 20,8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10,9 9,9 8,9" />
        </svg>
        {texts.wordCount(wordCount)}
      </span>
    </div>
  );
};

export default ArticleStats;
