import React, { useEffect } from 'react';
import { ToastNotification } from '../types';

interface ToastProps {
  notifications: ToastNotification[];
  onDismiss: (id: number) => void;
}

const Toast: React.FC<ToastProps> = ({ notifications, onDismiss }) => {
  return (
    <div className="fixed top-5 right-5 z-[100] w-full max-w-xs space-y-3">
      {notifications.map((notification) => (
        <ToastMessage
          key={notification.id}
          notification={notification}
          onDismiss={onDismiss}
        />
      ))}
    </div>
  );
};

const ToastMessage: React.FC<{
  notification: ToastNotification;
  onDismiss: (id: number) => void;
}> = ({ notification, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(notification.id);
    }, 5000); // Auto-dismiss after 5 seconds

    return () => {
      clearTimeout(timer);
    };
  }, [notification.id, onDismiss]);

  const baseClasses = 'w-full p-4 rounded-lg shadow-lg flex items-center gap-3 text-sm font-medium transition-all duration-300 transform animate-slide-in';
  const typeClasses = {
    success: 'bg-green-600/80 backdrop-blur-md border border-green-400/50 text-white',
    error: 'bg-red-600/80 backdrop-blur-md border border-red-400/50 text-white',
  };

  const Icon = () => {
      if (notification.type === 'success') {
          return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
      }
      return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
  }

  return (
    <>
      <div className={`${baseClasses} ${typeClasses[notification.type]}`}>
        <Icon />
        <span>{notification.message}</span>
        <button onClick={() => onDismiss(notification.id)} className="ml-auto opacity-70 hover:opacity-100">&times;</button>
      </div>
      <style>{`
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-slide-in {
          animation: slide-in 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
        }
      `}</style>
    </>
  );
};

export default Toast;
