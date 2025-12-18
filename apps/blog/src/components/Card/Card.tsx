import type { CardProps } from './types';

const variantStyles = {
  default: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
  outlined: 'bg-transparent border-2 border-gray-300 dark:border-gray-600',
  elevated: 'bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow',
};

export const Card = ({
  title,
  description,
  children,
  variant = 'default',
  className = '',
}: CardProps) => (
  <div className={`rounded-lg p-6 ${variantStyles[variant]} ${className}`}>
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
    {description && <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{description}</p>}
    {children && <div className="mt-4">{children}</div>}
  </div>
);
