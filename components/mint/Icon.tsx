import React from 'react';

// Define the available icon names as a type for better type safety.
// In a real design system, this would be a much larger list.
export type IconName = 'add' | 'clear' | 'arrow-down' | 'arrow-up';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: IconName;
  className?: string;
}

const ICONS: Record<IconName, React.ReactElement> = {
  add: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />,
  clear: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />,
  'arrow-down': <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />,
  'arrow-up': <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />,
};

const Icon: React.FC<IconProps> = ({ name, className = "h-5 w-5", ...props }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      className={className} 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
      aria-hidden="true"
      {...props}
    >
      {ICONS[name] || null}
    </svg>
  );
};

export default Icon;
