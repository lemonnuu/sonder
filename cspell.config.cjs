const { banWords } = require('cspell-ban-words');

module.exports = {
  version: '0.2',
  language: 'en',
  files: ['**/{*,.*}/**/*.{ts,tsx,js,jsx,md,mdx,json,yml,yaml}'],
  enableFiletypes: ['mdx'],
  ignoreRegExpList: [
    '#.*?\\)',
  ],
  ignorePaths: [
    'dist',
    'doc_build',
    '.rspress',
    'coverage',
    'node_modules',
    'pnpm-lock.yaml',
    '.nx',
  ],
  flagWords: banWords,
  dictionaries: ['dictionary'],
  dictionaryDefinitions: [
    {
      name: 'dictionary',
      path: './scripts/dictionary.txt',
      addWords: true,
    },
  ],
};
