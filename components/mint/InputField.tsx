import React from 'react';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  value: string | number;
  onValueChange: (value: string) => void; 
}

const InputField: React.FC<InputFieldProps> = ({ label, value, onValueChange, ...props }) => {
  const inputClasses = "mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-sm shadow-sm placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-white";

  return (
    <div>
      <label className="block text-sm font-medium text-gray-400">{label}</label>
      <input
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        className={inputClasses}
        {...props}
      />
    </div>
  );
};

export default InputField;
