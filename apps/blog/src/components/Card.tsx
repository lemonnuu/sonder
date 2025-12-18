import type { ReactNode, CSSProperties } from 'react';

interface CardProps {
  children: ReactNode;
  title?: string;
  className?: string;
  style?: CSSProperties;
}

export const Card = ({ children, title, className = '', style = {} }: CardProps) => {
  const cardStyles: CSSProperties = {
    backgroundColor: 'var(--rp-c-bg-soft)',
    borderRadius: '8px',
    padding: '20px',
    border: '1px solid var(--rp-c-divider)',
    ...style,
  };

  const titleStyles: CSSProperties = {
    fontSize: '18px',
    fontWeight: 600,
    marginBottom: '12px',
    color: 'var(--rp-c-text-1)',
  };

  return (
    <div className={className} style={cardStyles}>
      {title && <div style={titleStyles}>{title}</div>}
      {children}
    </div>
  );
};
