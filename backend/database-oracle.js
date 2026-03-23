import oracledb from 'oracledb';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

// --- CRITICAL CONFIGURATION ---
const WALLET_PATH = '/home/toppuntng/Downloads/buy9ja/backend/wallet';

/**
 * 1. Initialize Thick Mode IMMEDIATELY at the top level.
 * On Linux, if LD_LIBRARY_PATH is set in your npm script, 
 * this will load the client and the wallet configurations correctly.
 */
try {
  oracledb.initOracleClient({ configDir: WALLET_PATH });
  console.log('💎 Oracle Thick Mode initialized using wallet at:', WALLET_PATH);
} catch (err) {
  // Ignore "already initialized" errors, but log others
  if (!err.message.includes('NJS-077')) {
    console.error('❌ Oracle Client Init Error:', err.message);
  }
}

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  connectString: `(description= (retry_count=20)(retry_delay=3)(address=(protocol=tcps)(port=1522)(host=adb.uk-london-1.oraclecloud.com))(connect_data=(service_name=g9390bcc1968e01_buy9jadb_high.adb.oraclecloud.com))(security=(ssl_server_dn_match=yes)))`,
  //connectString: process.env.DB_CONNECTION_STRING,
  walletPassword: process.env.DB_WALLET_PASSWORD,
};

let pool;

/**
 * 2. Initialize the Connection Pool
 */
async function initializePool() {
  if (pool) return pool;

  try {
    pool = await oracledb.createPool({
      user: dbConfig.user,
      password: dbConfig.password,
      connectString: dbConfig.connectString,
      walletPassword: dbConfig.walletPassword, // Required for encrypted wallets
      poolMin: 1,
      poolMax: 10,
      poolIncrement: 1,
      queueTimeout: 10000, // 10s timeout (better for debugging in London)
    });

    console.log('✅ Oracle connection pool created successfully!');
    return pool;
  } catch (error) {
    console.error('❌ Failed to create Oracle connection pool:', error.message);
    throw error;
  }
}

/**
 * 3. Get a connection from the pool
 */
export async function getConnection() {
  try {
    if (!pool) {
      await initializePool();
    }
    return await pool.getConnection();
  } catch (error) {
    console.error('❌ Error getting connection from pool:', error.message);
    throw error;
  }
}

/**
 * 4. Test the handshake with a real query
 */
export async function testConnection() {
  let conn;
  try {
    conn = await getConnection();
    // Test query to ensure the handshake is truly alive
    const result = await conn.execute(`SELECT banner FROM v$version WHERE banner LIKE 'Oracle%'`);
    
    // Result handling for both array and object output formats
    const version = result.rows[0].BANNER || result.rows[0][0];
    console.log('✅ Handshake Successful! Connected to:', version);
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  } finally {
    if (conn) {
      try {
        await conn.close();
      } catch (e) {
        console.error('Error closing test connection:', e.message);
      }
    }
  }
}

/**
 * 5. Create Tables if they don't exist
 */
export async function initializeDatabase() {
  let conn;
  try {
    conn = await getConnection();
    console.log('📋 Initializing database tables...');

    // Orders Table
    await conn.execute(`
      BEGIN
        EXECUTE IMMEDIATE 'CREATE TABLE orders (
          id VARCHAR2(50) PRIMARY KEY,
          user_id VARCHAR2(50),
          vendor_id VARCHAR2(50),
          vendor_name VARCHAR2(255),
          status VARCHAR2(20) DEFAULT ''preparing'',
          total NUMBER(10,2) NOT NULL,
          estimated_time VARCHAR2(50),
          created_at TIMESTAMP DEFAULT SYSTIMESTAMP,
          updated_at TIMESTAMP DEFAULT SYSTIMESTAMP,
          CONSTRAINT chk_status CHECK (status IN (''preparing'', ''on-the-way'', ''delivered'', ''cancelled''))
        )';
      EXCEPTION WHEN OTHERS THEN IF SQLCODE != -955 THEN RAISE; END IF;
      END;
    `);

    // Sequence
    await conn.execute(`
      BEGIN
        EXECUTE IMMEDIATE 'CREATE SEQUENCE order_items_seq START WITH 1 INCREMENT BY 1 NOCACHE';
      EXCEPTION WHEN OTHERS THEN IF SQLCODE != -955 THEN RAISE; END IF;
      END;
    `);

    // Order Items Table
    await conn.execute(`
      BEGIN
        EXECUTE IMMEDIATE 'CREATE TABLE order_items (
          id NUMBER PRIMARY KEY,
          order_id VARCHAR2(50),
          item_id VARCHAR2(50),
          name VARCHAR2(255),
          price NUMBER(10,2),
          quantity NUMBER,
          CONSTRAINT fk_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
        )';
      EXCEPTION WHEN OTHERS THEN IF SQLCODE != -955 THEN RAISE; END IF;
      END;
    `);

    await conn.commit();
    console.log('✅ Database tables ready!');
  } catch (error) {
    console.error('❌ Init Database Error:', error.message);
    if (conn) await conn.rollback();
  } finally {
    if (conn) await conn.close();
  }
}

/**
 * 6. Graceful Shutdown
 */
export async function closePool() {
  if (pool) {
    try {
      await pool.close(5);
      console.log('✅ Oracle connection pool closed.');
    } catch (err) {
      console.error('Error closing pool:', err.message);
    }
  }
}