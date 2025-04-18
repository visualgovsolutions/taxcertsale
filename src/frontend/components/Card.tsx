import React from 'react';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
  footer?: React.ReactNode;
  footerClassName?: string;
  bordered?: boolean;
  elevation?: 'none' | 'sm' | 'md' | 'lg';
  hoverEffect?: boolean;
  'data-testid'?: string;
}

const Card: React.FC<CardProps> = ({
  children,
  title,
  className = '',
  headerClassName = '',
  bodyClassName = '',
  footer,
  footerClassName = '',
  bordered = false,
  elevation = 'md',
  hoverEffect = false,
  'data-testid': dataTestId,
}) => {
  const elevationClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow',
    lg: 'shadow-lg',
  };

  const borderClass = bordered ? 'border border-gray-200' : '';
  const hoverClass = hoverEffect ? 'transition-all duration-300 hover:shadow-lg' : '';

  return (
    <div
      className={`
        bg-white rounded-lg overflow-hidden
        ${elevationClasses[elevation]}
        ${borderClass}
        ${hoverClass}
        ${className}
      `}
      data-testid={dataTestId}
    >
      {title && (
        <div className={`px-6 py-4 bg-gray-50 border-b border-gray-200 ${headerClassName}`}>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
      )}
      <div className={`px-6 py-4 ${bodyClassName}`}>{children}</div>
      {footer && (
        <div className={`px-6 py-4 bg-gray-50 border-t border-gray-200 ${footerClassName}`}>
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card; 