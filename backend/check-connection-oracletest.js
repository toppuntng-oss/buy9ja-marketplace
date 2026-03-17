import { testConnection } from './database-oracle.js';

async function main() {
  console.log('🔍 Testing Oracle Autonomous Database connection...\n');
  
  const isConnected = await testConnection();
  
  if (isConnected) {
    console.log('\n✅ Connection test successful!');
    console.log('You can now run: npm start');
  } else {
    console.log('\n❌ Connection test failed!');
    console.log('Please check your .env configuration and wallet files.');
  }
  
  process.exit(isConnected ? 0 : 1);
}

main();

