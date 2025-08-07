// Simple test utility to verify EmailJS configuration from .env
export const testEnvConfig = () => {
  console.log('🔍 Testing .env EmailJS Configuration:');
  console.log('─'.repeat(50));
  
  const config = {
    serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID,
    adminTemplateId: import.meta.env.VITE_EMAILJS_ADMIN_TEMPLATE_ID,
    customerTemplateId: import.meta.env.VITE_EMAILJS_CUSTOMER_TEMPLATE_ID,
    publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY
  };
  
  console.log('Service ID:', config.serviceId);
  console.log('Admin Template ID:', config.adminTemplateId);
  console.log('Customer Template ID:', config.customerTemplateId);
  console.log('Public Key:', config.publicKey);
  console.log('─'.repeat(50));
  
  // Check if all required values are present
  const missingValues = [];
  if (!config.serviceId) missingValues.push('VITE_EMAILJS_SERVICE_ID');
  if (!config.adminTemplateId) missingValues.push('VITE_EMAILJS_ADMIN_TEMPLATE_ID');
  if (!config.customerTemplateId) missingValues.push('VITE_EMAILJS_CUSTOMER_TEMPLATE_ID');
  if (!config.publicKey) missingValues.push('VITE_EMAILJS_PUBLIC_KEY');
  
  if (missingValues.length > 0) {
    console.error('❌ Missing environment variables:', missingValues);
    return false;
  } else {
    console.log('✅ All EmailJS environment variables are present');
    return true;
  }
};

// Call this function to test your configuration
// testEnvConfig();
