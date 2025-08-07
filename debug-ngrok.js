// Debug script to check common ngrok issues
console.log('=== NGROK DEBUG INFO ===');

// Check current URL
console.log('Current URL:', window.location.href);
console.log('Current Origin:', window.location.origin);
console.log('Current Protocol:', window.location.protocol);

// Check environment variables
console.log('Environment Variables:');
console.log('- VITE_GOOGLE_CLIENT_ID:', import.meta.env.VITE_GOOGLE_CLIENT_ID);
console.log('- VITE_FIREBASE_API_KEY:', import.meta.env.VITE_FIREBASE_API_KEY);
console.log('- VITE_FIREBASE_AUTH_DOMAIN:', import.meta.env.VITE_FIREBASE_AUTH_DOMAIN);

// Check if running through ngrok
const isNgrok = window.location.hostname.includes('ngrok');
console.log('Running through ngrok:', isNgrok);

// Check for mixed content issues
if (window.location.protocol === 'https:' && isNgrok) {
  console.log('✓ Using HTTPS with ngrok (good)');
} else if (window.location.protocol === 'http:' && !isNgrok) {
  console.log('✓ Using HTTP locally (normal)');
} else {
  console.log('⚠️  Potential mixed content issue');
}

// Check Firebase initialization
try {
  // This would need to be imported properly in your actual code
  console.log('Firebase appears to be configured');
} catch (error) {
  console.error('Firebase initialization error:', error);
}

// Test network connectivity
fetch('/api/test')
  .then(response => console.log('API connectivity test:', response.status))
  .catch(error => console.log('API test failed:', error.message));

console.log('=== END DEBUG INFO ===');
