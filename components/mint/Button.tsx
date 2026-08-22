import React from 'react';
import { cn } from '../../utils';

export type ButtonType = 'primary' | 'secondary' | 'danger';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  buttonType?: ButtonType;
}

const Button: React.FC<ButtonProps> = ({ children, buttonType = 'secondary', className, ...props }) => {
  const baseClasses = "inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const typeClasses: Record<ButtonType, string> = {
    primary: "bg-cyan-600 hover:bg-cyan-700 focus:ring-cyan-500",
    secondary: "bg-gray-600 hover:bg-gray-700 focus:ring-gray-500",
    danger: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
  };

  return (
    <button className={cn(baseClasses, typeClasses[buttonType], className)} {...props}>
      {children}
    </button>
  );
};

export default Button;
