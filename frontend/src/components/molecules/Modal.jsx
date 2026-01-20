import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FaTimes } from 'react-icons/fa';
import { cn } from '../utils/cn';

// 1. Context to share state
const ModalContext = React.createContext();

// 2. Main Wrapper
const Modal = ({ isOpen, onClose, children, size = 'md' }) => {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-xl',
    lg: 'max-w-3xl',
    full: 'max-w-full m-4',
  };

  return createPortal(
    <ModalContext.Provider value={{ onClose }}>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-fade-in p-4"
        onClick={onClose}
      >
        {/* Content Container */}
        <div 
          className={cn(
            "bg-white w-full rounded-2xl shadow-2xl animate-slide-up relative flex flex-col max-h-[90vh]",
            sizes[size]
          )}
          onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
        >
          {children}
        </div>
      </div>
    </ModalContext.Provider>,
    document.body
  );
};

// 3. Sub-Components
Modal.Header = ({ children, className }) => {
  const { onClose } = React.useContext(ModalContext);
  return (
    <div className={cn("flex items-center justify-between p-6 border-b border-slate-100", className)}>
      <h3 className="text-xl font-bold text-slate-800">{children}</h3>
      <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition">
        <FaTimes />
      </button>
    </div>
  );
};

Modal.Body = ({ children, className }) => (
  <div className={cn("p-6 overflow-y-auto", className)}>
    {children}
  </div>
);

Modal.Footer = ({ children, className }) => (
  <div className={cn("p-6 border-t border-slate-100 bg-slate-50/50 rounded-b-2xl flex justify-end gap-3", className)}>
    {children}
  </div>
);

export default Modal;