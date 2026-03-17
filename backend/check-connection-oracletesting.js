import oracledb from 'oracledb';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

async function runCheck() {
  const WALLET_PATH = '/home/ubuntu/buy9ja/wallet';
  
  console.log("🔍 --- Pre-Flight Security Check ---");
  
  // 1. Check if folder exists
  if (!fs.existsSync(WALLET_PATH)) {
    console.error(`❌ Folder NOT FOUND: ${WALLET_PATH}`);
    return;
  }

  // 2. Check for ewallet.pem (The key to the handshake)
  if (!fs.existsSync(`${WALLET_PATH}/ewallet.pem`)) {
    console.error(`❌ CRITICAL: ewallet.pem is missing in ${WALLET_PATH}`);
    console.log("💡 Tip: You must unzip your Oracle Wallet and ensure ewallet.pem is there.");
    return;
  }

  const dbConfig = {
    user: process.env.DB_USER || 'ADMIN',
    password: process.env.DB_PASSWORD,
    connectString: process.env.DB_CONNECTION_STRING,
    configDir: WALLET_PATH,
    walletLocation: WALLET_PATH,
    walletPassword: process.env.DB_WALLET_PASSWORD,
    connectTimeout: 10000, // Don't wait 60 seconds
    queueTimeout: 10000
  };

  console.log(`📡 Attempting handshake with: ${dbConfig.connectString}`);
  
  let connection;
  try {
    // This is the actual test
    connection = await oracledb.getConnection(dbConfig);
    console.log("✅ SUCCESS! The handshake was successful.");
    console.log("💎 You are officially connected to the Oracle Database.");
  } catch (err) {
    console.error("❌ HANDSHAKE FAILED");
    console.error(`   Error Code: ${err.code}`);
    console.error(`   Message: ${err.message}`);
    
    if (err.code === 'NJS-040') {
      console.log("\n💡 NJS-040 still? This almost always means the Wallet Password in your .env");
      console.log("   is NOT the one you set when downloading the wallet zip from Oracle.");
    }
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}

runCheck();
