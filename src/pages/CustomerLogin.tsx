import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../services/authService';
import { LogIn, ShoppingBag, Eye, EyeOff, UserPlus } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { usePageTitle } from '../hooks/usePageTitle';

const CustomerLogin: React.FC = () => {
  usePageTitle('Customer Login');
  const navigate = useNavigate();
  const location = useLocation();
  const [mode, setMode] = useState<'signin' | 'signup' | 'email-signin' | 'email-signup'>('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', name: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Get the redirect path from location state or default to products
  const from = location.state?.from?.pathname || '/products';

  const handleGoogleSignIn = async () => {
    setError('');
    setIsLoading(true);

    try {
      const response = await authService.signInWithGoogle();

      if (response.success) {
        navigate(from, { replace: true });
      } else {
        setError(response.error || 'Google Sign In failed.');
      }
    } catch (error) {
      setError('Google authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      let response;

      if (mode === 'email-signup') {
        response = await authService.signUpWithEmail(
          formData.email,
          formData.password,
          formData.name || formData.email.split('@')[0]
        );
      } else if (mode === 'email-signin') {
        response = await authService.signInWithEmail(formData.email, formData.password);
      }

      if (response?.success) {
        navigate(from, { replace: true });
      } else {
        setError(response?.error || 'Operation failed. Please try again.');
      }
    } catch (error) {
      setError('Operation failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const isSignupMode = mode === 'signup' || mode === 'email-signup';
  const isEmailMode = mode === 'email-signin' || mode === 'email-signup';

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-100 p-4 rounded-full">
              <ShoppingBag className="h-12 w-12 text-blue-600" />
            </div>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900">
            {isSignupMode ? 'Create Account' : 'Sign In'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isSignupMode
              ? 'Choose your preferred signup method'
              : 'Sign in to your existing account'
            }
          </p>

          {/* Mode Toggle Buttons */}
          <div className="flex justify-center space-x-4 mt-4">
            <button
              onClick={() => setMode('signin')}
              className={`px-4 py-2 text-sm font-medium rounded-md ${!isSignupMode ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Sign In
            </button>
            <button
              onClick={() => setMode('signup')}
              className={`px-4 py-2 text-sm font-medium rounded-md ${isSignupMode ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Sign Up
            </button>
          </div>
        </div>

        <div className="mt-8 space-y-6">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            {!isEmailMode ? (
              /* Google and Email Options */
              <div className="space-y-4">
                {/* Google Login/Signup */}
                <div className="flex justify-center">
                  <button
                    onClick={handleGoogleSignIn}
                    disabled={isLoading}
                    className="w-full max-w-xs flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                    ) : (
                      <FcGoogle className="h-5 w-5 mr-2" />
                    )}
                    {isSignupMode ? 'Sign up with Google' : 'Sign in with Google'}
                  </button>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">
                      Or {isSignupMode ? 'sign up' : 'sign in'} with email
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setMode(isSignupMode ? 'email-signup' : 'email-signin')}
                  className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {isSignupMode ? (
                    <><UserPlus className="w-4 h-4 mr-2" />Sign up with Email</>
                  ) : (
                    <><LogIn className="w-4 h-4 mr-2" />Sign in with Email</>
                  )}
                </button>
              </div>
            ) : (
              /* Email Form */
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                {mode === 'email-signup' && (
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                      placeholder="Enter your full name"
                    />
                  </div>
                )}

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="mt-1 relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete={mode === 'email-signup' ? 'new-password' : 'current-password'}
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                      className="appearance-none relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                      placeholder={mode === 'email-signup' ? 'Create a password' : 'Enter your password'}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !formData.email || !formData.password}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    mode === 'email-signup' ? 'Sign Up' : 'Sign In'
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMode(isSignupMode ? 'signup' : 'signin');
                    setError('');
                    setFormData({ email: '', password: '', name: '' });
                  }}
                  className="w-full text-sm text-gray-600 hover:text-gray-900"
                >
                  ← Back to {isSignupMode ? 'signup' : 'signin'} options
                </button>
              </form>
            )}

            <div className="text-center text-sm text-gray-600 mt-6">
              <p>By {isSignupMode ? 'signing up' : 'signing in'}, you agree to our</p>
              <p className="mt-1">
                <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                  Terms of Service
                </a>
                {' and '}
                <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                  Privacy Policy
                </a>
              </p>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={() => navigate('/')}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              <span className="flex items-center justify-center">
                ← Back to Home
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerLogin;
