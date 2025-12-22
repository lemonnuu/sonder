/**
 * 自动为文档添加 frontmatter 的脚本
 *
 * 功能：
 * - 初始化时扫描所有文档，为缺少 createdAt 的文档添加创建时间
 * - watch 模式下只监听文件新增，自动添加 createdAt
 *
 * 使用方式：
 * - 初始化：pnpm frontmatter
 * - 监听模式：pnpm frontmatter:watch
 */

import { execSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { extname, join, resolve } from 'node:path';

// 配置
const DOCS_DIR = resolve(__dirname, '../docs');
const VALID_EXTENSIONS = ['.md', '.mdx'];
// 排除的文件/目录
const EXCLUDE_PATTERNS = ['_meta.json', 'public', 'node_modules'];

// 解析 frontmatter
function parseFrontmatter(content: string): {
  frontmatter: Record<string, unknown>;
  body: string;
  hasFrontmatter: boolean;
} {
  const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/;
  const match = content.match(frontmatterRegex);

  if (match) {
    const frontmatterStr = match[1];
    const body = match[2];

    // 简单解析 YAML（只处理简单的 key: value）
    const frontmatter: Record<string, unknown> = {};
    const lines = frontmatterStr.split('\n');

    for (const line of lines) {
      const colonIndex = line.indexOf(':');
      if (colonIndex > 0) {
        const key = line.slice(0, colonIndex).trim();
        const value = line.slice(colonIndex + 1).trim();
        // 只处理顶层简单值
        if (key && !line.startsWith(' ') && !line.startsWith('\t')) {
          frontmatter[key] = value;
        }
      }
    }

    return { frontmatter, body, hasFrontmatter: true };
  }

  return { frontmatter: {}, body: content, hasFrontmatter: false };
}

// 通过 git 获取文件创建时间（精确到秒）
function getFileCreatedAt(filePath: string): string {
  try {
    // 获取文件的第一次 commit 时间
    const gitDate = execSync(
      `git log --follow --format=%aI --diff-filter=A -- "${filePath}"`,
      { encoding: 'utf-8', cwd: DOCS_DIR }
    ).trim();

    if (gitDate) {
      // 返回完整的 ISO 时间格式（精确到秒）
      // 格式: 2025-12-19T10:30:45+08:00 -> 2025-12-19 10:30:45
      return gitDate.replace('T', ' ').slice(0, 19);
    }
  } catch {
    // git 命令失败，使用文件系统时间
  }

  // 回退到文件系统的创建时间
  const stats = statSync(filePath);
  const date = stats.birthtime;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// 处理单个文件
function processFile(filePath: string): boolean {
  if (!existsSync(filePath)) {
    return false;
  }

  const ext = extname(filePath);
  if (!VALID_EXTENSIONS.includes(ext)) {
    return false;
  }

  const content = readFileSync(filePath, 'utf-8');
  const { frontmatter, body, hasFrontmatter } = parseFrontmatter(content);

  // 已有 createdAt，跳过
  if (frontmatter.createdAt) {
    return false;
  }

  const createdAt = getFileCreatedAt(filePath);

  // 构建新的 frontmatter
  let newContent: string;

  if (hasFrontmatter) {
    // 在现有 frontmatter 末尾添加 createdAt，保持原有内容不变
    const frontmatterRegex = /^(---\r?\n)([\s\S]*?)(\r?\n---)/;
    newContent = content.replace(frontmatterRegex, (_, start, fm, end) => {
      // 保持原有 frontmatter 内容，只在末尾追加 createdAt
      const fmTrimmed = fm.trimEnd();
      return `${start}${fmTrimmed}\ncreatedAt: '${createdAt}'${end}`;
    });
  } else {
    // 创建新的 frontmatter
    newContent = `---\ncreatedAt: '${createdAt}'\n---\n\n${body}`;
  }

  writeFileSync(filePath, newContent, 'utf-8');
  console.log(`✅ 已添加 createdAt: ${filePath}`);
  return true;
}

// 递归扫描目录
function scanDirectory(dir: string): string[] {
  const files: string[] = [];

  const entries = readdirSync(dir);
  for (const entry of entries) {
    // 排除特定文件/目录
    if (EXCLUDE_PATTERNS.some(pattern => entry.includes(pattern))) {
      continue;
    }

    const fullPath = join(dir, entry);
    const stats = statSync(fullPath);

    if (stats.isDirectory()) {
      files.push(...scanDirectory(fullPath));
    } else if (stats.isFile()) {
      const ext = extname(entry);
      if (VALID_EXTENSIONS.includes(ext)) {
        files.push(fullPath);
      }
    }
  }

  return files;
}

// 初始化：扫描所有文件
function init(): void {
  console.log('🔍 扫描文档目录...');

  if (!existsSync(DOCS_DIR)) {
    console.error(`❌ 文档目录不存在: ${DOCS_DIR}`);
    process.exit(1);
  }

  const files = scanDirectory(DOCS_DIR);
  console.log(`📄 找到 ${files.length} 个文档文件`);

  let processedCount = 0;
  for (const file of files) {
    if (processFile(file)) {
      processedCount++;
    }
  }

  console.log(`✨ 完成！处理了 ${processedCount} 个文件`);
}

// watch 模式
async function watch(): Promise<void> {
  // 动态导入 chokidar
  const chokidar = await import('chokidar');

  console.log('👀 启动文件监听模式...');
  console.log(`📁 监听目录: ${DOCS_DIR}`);

  const watcher = chokidar.watch(DOCS_DIR, {
    ignored: (path: string) => EXCLUDE_PATTERNS.some(pattern => path.includes(pattern)),
    persistent: true,
    ignoreInitial: true // 忽略初始扫描
  });

  // 只监听文件新增
  watcher.on('add', (filePath: string) => {
    const ext = extname(filePath);
    if (VALID_EXTENSIONS.includes(ext)) {
      console.log(`📝 检测到新文件: ${filePath}`);
      // 延迟处理，确保文件写入完成
      setTimeout(() => {
        processFile(filePath);
      }, 100);
    }
  });

  watcher.on('error', (error) => {
    console.error('❌ 监听错误:', error);
  });

  console.log('✅ 监听已启动，按 Ctrl+C 退出');
}

// 主函数
async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const isWatch = args.includes('--watch') || args.includes('-w');

  // 先执行初始化
  init();

  // 如果是 watch 模式，启动监听
  if (isWatch) {
    await watch();
  }
}

main().catch(console.error);
