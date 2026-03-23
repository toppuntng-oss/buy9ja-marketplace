import oracledb from 'oracledb';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config();

async function runCheck() {
  const walletPath = process.env.DB_WALLET_PATH;
  
  console.log("🔍 Checking wallet at:", walletPath);
  
  if (!fs.existsSync(path.join(walletPath, 'ewallet.pem'))) {
    console.error("❌ ewallet.pem not found! Handshake will fail.");
    return;
  }

  try {
    oracledb.initOracleClient({ configDir: walletPath });
    const conn = await oracledb.getConnection({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      connectString: process.env.DB_CONNECTION_STRING,
      walletPassword: process.env.DB_WALLET_PASSWORD
    });

    console.log("✅ HANDSHAKE SUCCESSFUL!");
    await conn.close();
  } catch (err) {
    console.error("❌ HANDSHAKE FAILED:", err.message);
  }
}

runCheck();
