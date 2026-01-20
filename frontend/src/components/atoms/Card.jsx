import React from 'react';
import { cn } from '../utils/cn';

const Card = ({ children, className, noPadding = false, ...props }) => {
  return (
    <div 
      className={cn(
        "bg-white rounded-2xl border border-slate-100 shadow-card hover:shadow-card-hover transition-shadow duration-300", 
        !noPadding && "p-6",
        className
      )} 
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;