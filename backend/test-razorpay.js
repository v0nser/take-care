import dotenv from 'dotenv';
import Razorpay from 'razorpay';

// Load environment variables
dotenv.config();

console.log('🔍 Testing Razorpay Configuration...\n');

// Check environment variables
console.log('Environment Variables:');
console.log('RAZORPAY_KEY_ID:', process.env.RAZORPAY_KEY_ID ? '✅ Set' : '❌ Missing');
console.log('RAZORPAY_KEY_SECRET:', process.env.RAZORPAY_KEY_SECRET ? '✅ Set' : '❌ Missing');

if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  console.log('\n❌ Razorpay credentials are missing!');
  console.log('Please create a .env file with your Razorpay API keys.');
  process.exit(1);
}

// Test Razorpay initialization
try {
  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
  
  console.log('\n✅ Razorpay instance created successfully');
  
  // Test API connection by fetching account details
  console.log('\n🔍 Testing API connection...');
  
  razorpay.orders.all()
    .then(response => {
      console.log('✅ Razorpay API connection successful!');
      console.log('Account verified and working.');
      process.exit(0);
    })
    .catch(error => {
      console.log('❌ Razorpay API connection failed:');
      console.log('Status Code:', error.statusCode);
      console.log('Error Code:', error.error?.code);
      console.log('Description:', error.error?.description);
      console.log('\nThis usually means:');
      console.log('- Invalid API keys');
      console.log('- Wrong environment (test vs live)');
      console.log('- Network connectivity issues');
      process.exit(1);
    });
    
} catch (error) {
  console.log('❌ Failed to create Razorpay instance:', error.message);
  process.exit(1);
} 