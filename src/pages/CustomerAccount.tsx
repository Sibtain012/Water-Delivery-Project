import React from 'react';
import { useNavigate } from 'react-router-dom';

const CustomerAccount: React.FC = () => {
  const navigate = useNavigate();

  React.useEffect(() => {
    // Redirect to home since authentication is disabled
    navigate('/');
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold text-center mb-4">Account Access</h2>
        <p className="text-gray-600 text-center mb-6">
          User accounts have been simplified for easier ordering.
          You can now place orders directly without creating an account.
        </p>
        <button
          onClick={() => navigate('/')}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default CustomerAccount;
