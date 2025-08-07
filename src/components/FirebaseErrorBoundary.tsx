import React, { Component, ReactNode } from 'react';
import { getFirebaseState, checkFirebaseHealth } from '../lib/firebase';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  isRetrying: boolean;
  showConnectionStatus: boolean;
}

class FirebaseErrorBoundary extends Component<Props, State> {
  private retryTimeoutId: NodeJS.Timeout | null = null;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      isRetrying: false,
      showConnectionStatus: false
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Check if it's a Firebase-related error
    const isFirebaseError = 
      error.message.includes('firebase') ||
      error.message.includes('firestore') ||
      error.message.includes('auth') ||
      error.message.includes('network') ||
      error.message.includes('unavailable');

    return {
      hasError: isFirebaseError,
      error: isFirebaseError ? error : null,
      isRetrying: false,
      showConnectionStatus: isFirebaseError
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const isFirebaseError = 
      error.message.includes('firebase') ||
      error.message.includes('firestore') ||
      error.message.includes('auth');

    if (isFirebaseError) {
      console.error('Firebase Error Boundary caught an error:', error, errorInfo);
      this.handleFirebaseError();
    }
  }

  private handleFirebaseError = async () => {
    this.setState({ isRetrying: true });

    try {
      // Wait a bit before checking health
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const isHealthy = await checkFirebaseHealth();
      
      if (isHealthy) {
        console.log('✅ Firebase connection restored');
        this.setState({
          hasError: false,
          error: null,
          isRetrying: false,
          showConnectionStatus: false
        });
      } else {
        console.warn('⚠️ Firebase connection still unhealthy');
        this.setState({ isRetrying: false });
        
        // Try again after a longer delay
        this.retryTimeoutId = setTimeout(() => {
          this.handleFirebaseError();
        }, 10000);
      }
    } catch (error) {
      console.error('Error checking Firebase health:', error);
      this.setState({ isRetrying: false });
    }
  };

  private handleRetry = () => {
    this.handleFirebaseError();
  };

  componentWillUnmount() {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }
  }

  render() {
    if (this.state.hasError) {
      const firebaseState = getFirebaseState();

      return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100">
                  <svg
                    className="h-6 w-6 text-yellow-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                </div>
                
                <h3 className="mt-4 text-lg font-medium text-gray-900">
                  Connection Issue
                </h3>
                
                <p className="mt-2 text-sm text-gray-600">
                  We're having trouble connecting to our servers. Your data is still available offline.
                </p>

                {/* Connection Status */}
                <div className="mt-4 text-xs text-gray-500">
                  <div className="flex items-center justify-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${
                      firebaseState.isOnline ? 'bg-green-400' : 'bg-red-400'
                    }`} />
                    <span>
                      {firebaseState.isOnline ? 'Online' : 'Offline'} • 
                      {firebaseState.hasNetworkError ? ' Connection Error' : ' Connected'}
                    </span>
                  </div>
                </div>

                {/* Retry Button */}
                <div className="mt-6">
                  <button
                    onClick={this.handleRetry}
                    disabled={this.state.isRetrying}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {this.state.isRetrying ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Reconnecting...
                      </>
                    ) : (
                      'Try Again'
                    )}
                  </button>
                </div>

                {/* Continue Offline Button */}
                <div className="mt-3">
                  <button
                    onClick={() => this.setState({ hasError: false, showConnectionStatus: false })}
                    className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Continue Offline
                  </button>
                </div>

                {/* Error Details (Development) */}
                {process.env.NODE_ENV === 'development' && this.state.error && (
                  <details className="mt-4 text-left">
                    <summary className="text-xs text-gray-500 cursor-pointer">
                      Error Details (Dev)
                    </summary>
                    <pre className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded">
                      {this.state.error.message}
                    </pre>
                  </details>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default FirebaseErrorBoundary;
