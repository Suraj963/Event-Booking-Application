import React, { useState, useEffect } from 'react';
import { CheckCircleIcon, ExclamationTriangleIcon, XMarkIcon } from '@heroicons/react/24/solid';

const Toast = ({ show, message, type, onClose, delay = 4000 }) => {
  const [isVisible, setIsVisible] = useState(show);

  // Configuration for different toast types
  const toastConfig = {
    success: {
      icon: <CheckCircleIcon className="h-6 w-6 text-green-500" />,
      title: 'Success',
      barColor: 'bg-green-500',
    },
    error: {
      icon: <ExclamationTriangleIcon className="h-6 w-6 text-red-500" />,
      title: 'Error',
      barColor: 'bg-red-500',
    },
  };

  const config = toastConfig[type] || toastConfig.success;

  // Effect to control visibility and auto-hide timer
  useEffect(() => {
    setIsVisible(show);
    if (show) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300); 
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [show, delay, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <div
      className={`fixed bottom-5 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ease-in-out
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
    >
      <div className="max-w-sm w-full bg-card rounded-xl shadow-lg border border-border/20 overflow-hidden">
        <div className="h-1.5 w-full bg-muted">
          <div 
            className={`${config.barColor} h-full`} 
            style={{ animation: `progress ${delay}ms linear forwards` }}
          />
        </div>
        <div className="p-4 flex items-start space-x-3">
          <div className="flex-shrink-0">
            {config.icon}
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground">{config.title}</p>
            <p className="mt-1 text-sm text-muted-foreground">{message || "An unexpected error occurred."}</p>
          </div>
          <div className="flex-shrink-0">
            <button
              onClick={handleClose}
              className="p-1 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
      <style>
        {`
          @keyframes progress {
            from { width: 100%; }
            to { width: 0%; }
          }
        `}
      </style>
    </div>
  );
};

export default Toast;