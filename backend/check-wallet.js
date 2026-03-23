import oracledb from 'oracledb';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Load Environment Variables
dotenv.config({ path: path.join(__dirname, '.env') });

async function initializeDatabase() {
  // Use the key that matches your .env exactly
  const walletPath = process.env.DB_WALLET_PATH || '/home/toppuntng/Downloads/buy9ja/backend/wallet';
  
  console.log("🔍 --- Pre-Flight Security Check ---");
  
  // 2. Physical File Check (Crucial for Linux)
  if (!fs.existsSync(walletPath)) {
    console.error(`❌ ERROR: Wallet folder not found at ${walletPath}`);
    return;
  }

  const requiredFiles = ['cwallet.sso', 'tnsnames.ora', 'sqlnet.ora'];
  requiredFiles.forEach(file => {
    if (!fs.existsSync(path.join(walletPath, file))) {
      console.warn(`⚠️ Warning: Missing ${file} in wallet directory!`);
    }
  });

  // 3. ACTUAL INITIALIZATION (Must happen before createPool)
  try {
    oracledb.initOracleClient({ configDir: walletPath });
    console.log("💎 Oracle Thick Mode initialized successfully.");
  } catch (err) {
    if (!err.message.includes('NJS-077')) { // NJS-077 means already initialized
      console.error("❌ Oracle Client Init Error:", err.message);
    }
  }

  // 4. Create the Pool
  try {
    const pool = await oracledb.createPool({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      connectString: process.env.DB_CONNECTION_STRING,
      walletPassword: process.env.DB_WALLET_PASSWORD,
      poolMin: 1,
      poolMax: 5
    });
    console.log("✅ Connection Pool Ready!");
    return pool;
  } catch (err) {
    console.error("❌ Pool Creation Failed:", err.message);
  }
}

initializeDatabase();
