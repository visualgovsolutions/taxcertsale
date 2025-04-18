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
declare const Card: React.FC<CardProps>;
export default Card;
