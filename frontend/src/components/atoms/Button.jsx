import React from 'react';

const Button = ({ children, variant = 'primary', type = 'button', onClick, className = '' }) => {
  const baseStyle = variant === 'outline' ? 'btn-outline' : 'btn-primary';
  
  return (
    <button 
      type={type} 
      onClick={onClick} 
      className={`${baseStyle} ${className}`}
      aria-label={typeof children === 'string' ? children : 'button'}
    >
      {children}
    </button>
  );
};

export default Button;