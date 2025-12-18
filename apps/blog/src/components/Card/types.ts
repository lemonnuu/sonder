import type { ReactNode } from 'react';

export interface CardProps {
  title: string;
  description?: string;
  children?: ReactNode;
  variant?: 'default' | 'outlined' | 'elevated';
  className?: string;
}
