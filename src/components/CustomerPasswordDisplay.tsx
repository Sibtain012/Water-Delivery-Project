import React, { useState } from 'react';
import { Eye, EyeOff, Copy, Check } from 'lucide-react';
import { useCustomerStore } from '../store/customerStore';

const CustomerPasswordDisplay: React.FC = () => {
  const { currentCustomer } = useCustomerStore();
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!currentCustomer || !currentCustomer.password || currentCustomer.signupMethod !== 'google') {
    return null;
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(currentCustomer.password!);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy password');
    }
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <h3 className="text-lg font-semibold text-blue-900 mb-2">Your Account Information</h3>
      <p className="text-sm text-blue-800 mb-4">
        Since you signed up with Google, we've generated a password for you. You can use this to sign in with your email in the future.
      </p>
      
      <div className="bg-white rounded-md p-3 border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Password:</span>
            <span className="font-mono text-sm">
              {showPassword ? currentCustomer.password : '••••••••'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="p-1 text-gray-400 hover:text-gray-600"
              title={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
            <button
              onClick={copyToClipboard}
              className="p-1 text-gray-400 hover:text-gray-600"
              title="Copy password"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      <p className="text-xs text-blue-600 mt-2">
        💡 Tip: Save this password in a secure location or password manager for future use.
      </p>
    </div>
  );
};

export default CustomerPasswordDisplay;
