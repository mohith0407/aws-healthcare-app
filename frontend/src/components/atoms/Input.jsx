import React, { useState } from 'react';
import { cn } from '../utils/cn';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Input = React.forwardRef(({ label, error, icon: Icon, type = "text", className, ...props }, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  
  // Logic: If type is password, allow toggling. Otherwise use provided type.
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="w-full space-y-1.5">
      {label && <label className="text-sm font-semibold text-slate-700 ml-1">{label}</label>}
      
      <div className="relative group">
        {/* Left Icon */}
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
          </div>
        )}
        
        <input
          ref={ref}
          type={inputType}
          className={cn(
            "w-full bg-white border border-slate-200 rounded-xl py-3 text-slate-900 placeholder:text-slate-400 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all outline-none",
            Icon ? "pl-10" : "px-4",
            isPassword ? "pr-10" : "pr-4", // Make room for eye icon
            error && "border-red-500 focus:border-red-500 focus:ring-red-500/10",
            className
          )}
          {...props}
        />

        {/* Right Icon (Password Toggle) */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-primary-600 focus:outline-none transition-colors"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        )}
      </div>

      {error && <p className="text-xs text-red-500 font-medium ml-1 animate-fade-in">{error}</p>}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;