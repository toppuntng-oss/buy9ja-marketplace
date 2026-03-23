import oracledb from 'oracledb';

// PASTE YOUR ACTUAL VALUES HERE DIRECTLY
const config = {
  user: "ADMIN",
  password: "Nkechieneh@1", 
  connectString: "YOUR_DB_NAME_high",
  // Use the FULL path, e.g., "/home/user/project/backend/wallet"
  walletLocation: "/home/toppuntng/Downloads/buy9ja/backend/wallet", 
  walletPassword: "YOUR_WALLET_PASSWORD"
};

async function run() {
  try {
    // 1. Initialize the client
    oracledb.initOracleClient({ configDir: config.walletLocation });
    
    console.log("🚀 Attempting direct connection...");
    
    // 2. Connect
    const conn = await oracledb.getConnection({
      user: config.user,
      password: config.password,
      connectString: config.connectString,
      walletPassword: config.walletPassword
    });

    console.log("✅ SUCCESS! Oracle is talking to us.");
    await conn.close();
  } catch (err) {
    console.error("❌ DIRECT TEST FAILED:");
    console.error(err.message);
  }
}

run();