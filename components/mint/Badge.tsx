import React from 'react';
import { cn } from '../../utils';

export type BadgeStatus = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

interface BadgeProps {
  children: React.ReactNode;
  status?: BadgeStatus;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ children, status = 'neutral', className }) => {
  const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';

  const statusClasses: Record<BadgeStatus, string> = {
    success: 'bg-green-500/20 text-green-300',
    warning: 'bg-yellow-500/20 text-yellow-300',
    danger: 'bg-red-500/20 text-red-300',
    info: 'bg-cyan-500/20 text-cyan-300',
    neutral: 'bg-gray-500/20 text-gray-300',
  };

  return (
    <span className={cn(baseClasses, statusClasses[status], className)}>
      {children}
    </span>
  );
};

export default Badge;
