import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = '', id, ...props }, ref) => {
    const areaId = id || label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={areaId} className="text-sm font-medium text-slate-700">
            {label}
            {props.required && <span className="text-red-500 ml-0.5">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={areaId}
          className={`
            w-full rounded-lg border px-3 py-2 text-sm text-slate-900
            placeholder:text-slate-400
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            transition duration-150 resize-none
            disabled:bg-slate-50 disabled:cursor-not-allowed
            ${error ? 'border-red-400 bg-red-50 focus:ring-red-400' : 'border-slate-300 bg-white'}
            ${className}
          `}
          {...props}
        />
        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';
