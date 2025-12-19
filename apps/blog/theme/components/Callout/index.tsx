import type { ReactNode } from 'react';
import './index.scss';

export interface CalloutProps {
  type: 'tip' | 'note' | 'warning' | 'caution' | 'danger' | 'info' | 'details';
  title?: string;
  children: ReactNode;
}

// 获取默认 title（首字母大写）
const getDefaultTitle = (type: string): string => {
  return type[0].toUpperCase() + type.slice(1).toLowerCase();
};

// 判断是否为默认 title
const isDefaultTitle = (type: string, title?: string): boolean => {
  if (!title) {
    return true;
  }
  const defaultTitle = getDefaultTitle(type);
  // 同时兼容首字母大写和全大写的默认 title
  return title === defaultTitle || title === type.toUpperCase();
};

/**
 * Construct the DOM structure of the container directive.
 * For example:
 *
 * ::: tip {title="foo"}
 * This is a tip
 * :::
 *
 * will be transformed to:
 *
 * <div class="rp-callout rp-callout--tip">
 *   <div class="rp-callout__title">Tip</div>
 *   <div class="rp-callout__content">
 *     <p>This is a tip</p>
 *   </div>
 * </div>
 */
export function Callout({ type, title, children }: CalloutProps): ReactNode {
  const isDetails = type === 'details';
  const showTitle = !isDefaultTitle(type, title);

  if (isDetails) {
    return (
      <details className={`rp-callout rp-callout--${type}`}>
        <summary className="rp-callout__title">{title}</summary>
        <div className="rp-callout__content">{children}</div>
      </details>
    );
  }

  return (
    <div className={`rp-callout rp-callout--${type}${showTitle ? '' : ' rp-callout--no-title'}`}>
      {showTitle && <div className="rp-callout__title">{title}</div>}
      <div className="rp-callout__content">{children}</div>
    </div>
  );
}

export default Callout;
