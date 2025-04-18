import React from 'react';
interface ButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    type?: 'button' | 'submit' | 'reset';
    variant?: 'primary' | 'secondary' | 'outline' | 'text';
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    disabled?: boolean;
    fullWidth?: boolean;
}
declare const Button: React.FC<ButtonProps>;
export default Button;
