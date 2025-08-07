import React, { useState, useEffect } from 'react';
import { getFirebaseState, checkFirebaseHealth } from '../lib/firebase';

interface ConnectionStatusProps {
  showWhenHealthy?: boolean;
  className?: string;
}

const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ 
  showWhenHealthy = false, 
  className = '' 
}) => {
  const [firebaseState, setFirebaseState] = useState(getFirebaseState());
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const checkConnection = () => {
      const state = getFirebaseState();
      setFirebaseState(state);
      
      // Show status if offline, has error, or if showWhenHealthy is true
      setIsVisible(
        !state.isOnline || 
        state.hasNetworkError || 
        showWhenHealthy
      );
    };

    // Initial check
    checkConnection();

    // Check every 10 seconds
    const interval = setInterval(checkConnection, 10000);

    // Listen for network changes
    const handleOnline = () => {
      setTimeout(checkConnection, 1000); // Small delay for stabilization
    };
    
    const handleOffline = () => {
      checkConnection();
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      clearInterval(interval);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [showWhenHealthy]);

  if (!isVisible) return null;

  const getStatusColor = () => {
    if (!firebaseState.isOnline) return 'bg-red-500';
    if (firebaseState.hasNetworkError) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStatusText = () => {
    if (!firebaseState.isOnline) return 'Offline';
    if (firebaseState.hasNetworkError) return 'Connection Issues';
    return 'Connected';
  };

  const getStatusIcon = () => {
    if (!firebaseState.isOnline) {
      return (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
        </svg>
      );
    }
    
    if (firebaseState.hasNetworkError) {
      return (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      );
    }
    
    return (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
      </svg>
    );
  };

  return (
    <div className={`flex items-center space-x-2 text-sm ${className}`}>
      <div className={`w-2 h-2 rounded-full ${getStatusColor()}`} />
      <div className="flex items-center space-x-1">
        {getStatusIcon()}
        <span className="text-gray-600">{getStatusText()}</span>
      </div>
    </div>
  );
};

export default ConnectionStatus;
