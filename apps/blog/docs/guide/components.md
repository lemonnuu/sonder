---
title: 组件开发
createdAt: '2025-12-18 11:14:43'
---

# 组件开发

在 Rspress 中，你可以创建 React 组件并在 MDX 文件中使用。

## 创建组件

在 `src/components` 目录下创建组件：

```tsx
// src/components/Button.tsx
import type { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
}

export const Button = ({
  children,
  variant = 'primary',
  onClick,
}: ButtonProps) => {
  const baseStyles = {
    padding: '8px 16px',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 500,
  };

  const variantStyles = {
    primary: {
      backgroundColor: '#3b82f6',
      color: '#fff',
    },
    secondary: {
      backgroundColor: '#e5e7eb',
      color: '#374151',
    },
  };

  return (
    <button
      style={{ ...baseStyles, ...variantStyles[variant] }}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
```

## 在 MDX 中使用

```mdx
import { Button } from '@/components/Button';

# 按钮示例

<Button variant="primary">主要按钮</Button>
<Button variant="secondary">次要按钮</Button>
```

## 全局组件

你可以在主题中注册全局组件，使其在所有 MDX 文件中可用。

创建 `theme/index.tsx`：

```tsx
import Theme from '@rspress/core/theme';
import { Button } from '@/components/Button';

const Layout = () => <Theme.Layout />;

export default {
  ...Theme,
  Layout,
};

export * from '@rspress/core/theme';
```

## 样式处理

推荐使用 CSS Modules 或内联样式：

```tsx
// 使用 CSS Modules
import styles from './Button.module.css';

export const Button = ({ children }) => (
  <button className={styles.button}>{children}</button>
);
```

## 最佳实践

1. **组件拆分**：保持组件小而专注
2. **类型安全**：使用 TypeScript 定义 props 类型
3. **可复用性**：设计通用的组件接口
4. **性能优化**：合理使用 `memo` 和 `useMemo`
