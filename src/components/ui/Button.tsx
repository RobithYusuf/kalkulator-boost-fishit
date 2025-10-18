import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'default' | 'sm';
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', size = 'default', className = '', ...props }) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-950 disabled:opacity-50 disabled:pointer-events-none';

  const variantClasses = {
    primary: 'bg-cyan-500 text-white hover:bg-cyan-600 focus:ring-cyan-500',
    secondary: 'bg-gray-700 text-gray-100 hover:bg-gray-600 focus:ring-gray-500',
    ghost: 'hover:bg-gray-800 hover:text-gray-100',
  };

  const sizeClasses = {
    default: 'px-4 py-2',
    sm: 'px-3 py-1.5',
  }

  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`} {...props}>
      {children}
    </button>
  );
};
