import React, { useEffect } from 'react';
import './StatusMessage.css';

export interface StatusMessageProps {
  type: 'success' | 'error' | 'info';
  message: string;
  details?: string;
  onClose: () => void;
  autoClose?: boolean;
  autoCloseTime?: number;
}

const StatusMessage: React.FC<StatusMessageProps> = ({
  type,
  message,
  details,
  onClose,
  autoClose = true,
  autoCloseTime = 5000
}) => {
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (autoClose) {
      timer = setTimeout(() => {
        onClose();
      }, autoCloseTime);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [autoClose, autoCloseTime, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.7649 14.1003 1.98232 16.07 2.85999" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M22 4L12 14.01L9 11.01" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'error':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M15 9L9 15" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 9L15 15" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'info':
      default:
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 16V12" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 8H12.01" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
    }
  };

  return (
    <div className="status-message-overlay">
      <div className={`status-message ${type}`}>
        <div className="status-message-icon">
          {getIcon()}
        </div>
        <div className="status-message-content">
          <h3>{message}</h3>
          {details && <p>{details}</p>}
        </div>
        <button className="status-message-close" onClick={onClose}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default StatusMessage;