import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { Clock } from 'lucide-react';

const SessionTimer: React.FC = () => {
  const { sessionExpiry, checkSession } = useAuthStore();
  const [remainingTime, setRemainingTime] = useState<string>('');

  useEffect(() => {
    const updateTimer = () => {
      if (sessionExpiry) {
        const now = Date.now();
        const remaining = sessionExpiry - now;
        
        if (remaining <= 0) {
          checkSession();
          setRemainingTime('Session expired');
        } else {
          const minutes = Math.floor(remaining / 60000);
          const seconds = Math.floor((remaining % 60000) / 1000);
          setRemainingTime(`${minutes}:${seconds.toString().padStart(2, '0')}`);
        }
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [sessionExpiry, checkSession]);

  if (!sessionExpiry) return null;

  return (
    <div className="flex items-center space-x-2 text-sm text-gray-600">
      <Clock className="h-4 w-4" />
      <span>Session expires in: {remainingTime}</span>
    </div>
  );
};

export default SessionTimer;
