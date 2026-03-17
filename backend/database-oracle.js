import oracledb from 'oracledb';
import dotenv from 'dotenv';

dotenv.config();

// Configure Oracle client
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT; // Return results as objects
oracledb.autoCommit = false; // Manual commit for transactions

// Oracle connection configuration
const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  connectString: process.env.DB_CONNECTION_STRING,
  walletLocation: process.env.WALLET_LOCATION,
  walletPassword: process.env.WALLET_PASSWORD || '' // Optional if using SSO wallet
};

// Create connection pool
let pool;

async function initializePool() {
  try {
    // Set wallet location for cloud connection
    process.env.TNS_ADMIN = dbConfig.walletLocation;
    
    pool = await oracledb.createPool({
      user: dbConfig.user,
      password: dbConfig.password,
      connectString: dbConfig.connectString,
      poolMin: 2,
      poolMax: 10,
      poolIncrement: 1,
      poolTimeout: 60,
      enableStatistics: true
    });
    
    console.log('✅ Oracle connection pool created successfully!');
    return pool;
  } catch (error) {
    console.error('❌ Failed to create Oracle connection pool:', error.message);
    throw error;
  }
}

// Get connection from pool
async function getConnection() {
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

// Test connection
async function testConnection() {
  let connection;
  try {
    connection = await getConnection();
    const result = await connection.execute(
      `SELECT banner FROM v$version WHERE banner LIKE 'Oracle%'`
    );
    
    console.log('✅ Successfully connected to Oracle Autonomous Database!');
    console.log('📊 Database version:', result.rows[0].BANNER);
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.error('\n🔍 Troubleshooting Tips:');
    
    if (error.message.includes('ORA-01017')) {
      console.error('   ⚠️  INVALID USERNAME/PASSWORD');
      console.error('   - Check DB_USER and DB_PASSWORD in .env file');
      console.error('   - Verify ADMIN password in Oracle Cloud Console');
      console.error('   - Password is case-sensitive!');
    } else if (error.message.includes('ORA-12170') || error.message.includes('TNS')) {
      console.error('   ⚠️  CONNECTION TIMEOUT / TNS ERROR');
      console.error('   - Check DB_CONNECTION_STRING in .env');
      console.error('   - Verify wallet files in:', dbConfig.walletLocation);
      console.error('   - Ensure TNS_ADMIN is set correctly');
      console.error('   - Check network connectivity to Oracle Cloud');
    } else if (error.message.includes('NJS-516')) {
      console.error('   ⚠️  ORACLE CLIENT LIBRARY NOT FOUND');
      console.error('   - Install Oracle Instant Client');
      console.error('   - Set LD_LIBRARY_PATH environment variable');
      console.error('   - Run: export LD_LIBRARY_PATH=/opt/oracle/instantclient_19_23:$LD_LIBRARY_PATH');
    } else {
      console.error('   Full error:', error);
    }
    
    return false;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Error closing connection:', err);
      }
    }
  }
}

// Initialize database tables
async function initializeDatabase() {
  let connection;
  try {
    connection = await getConnection();
    
    console.log('📋 Initializing database tables for Buy9ja Marketplace...');
    
    // Create orders table
    try {
      await connection.execute(`
        CREATE TABLE orders (
          id VARCHAR2(50) PRIMARY KEY,
          user_id VARCHAR2(50),
          vendor_id VARCHAR2(50),
          vendor_name VARCHAR2(255),
          status VARCHAR2(20) DEFAULT 'preparing',
          total NUMBER(10,2) NOT NULL,
          estimated_time VARCHAR2(50),
          created_at TIMESTAMP DEFAULT SYSTIMESTAMP,
          updated_at TIMESTAMP DEFAULT SYSTIMESTAMP,
          CONSTRAINT chk_status CHECK (status IN ('preparing', 'on-the-way', 'delivered', 'cancelled'))
        )
      `);
      console.log('✅ Created orders table');
    } catch (err) {
      if (err.message.includes('ORA-00955')) {
        console.log('ℹ️  orders table already exists');
      } else {
        throw err;
      }
    }

    // Create sequence for order_items
    try {
      await connection.execute(`
        CREATE SEQUENCE order_items_seq 
        START WITH 1 
        INCREMENT BY 1 
        NOCACHE 
        NOCYCLE
      `);
      console.log('✅ Created order_items_seq sequence');
    } catch (err) {
      if (err.message.includes('ORA-00955')) {
        console.log('ℹ️  order_items_seq sequence already exists');
      } else {
        throw err;
      }
    }

    // Create order_items table
    try {
      await connection.execute(`
        CREATE TABLE order_items (
          id NUMBER PRIMARY KEY,
          order_id VARCHAR2(50),
          item_id VARCHAR2(50),
          name VARCHAR2(255),
          price NUMBER(10,2),
          quantity NUMBER,
          CONSTRAINT fk_order FOREIGN KEY (order_id) 
            REFERENCES orders(id) ON DELETE CASCADE
        )
      `);
      console.log('✅ Created order_items table');
    } catch (err) {
      if (err.message.includes('ORA-00955')) {
        console.log('ℹ️  order_items table already exists');
      } else {
        throw err;
      }
    }

    // Create trigger for auto-increment on order_items
    try {
      await connection.execute(`
        CREATE OR REPLACE TRIGGER order_items_trigger
        BEFORE INSERT ON order_items
        FOR EACH ROW
        BEGIN
          IF :NEW.id IS NULL THEN
            SELECT order_items_seq.NEXTVAL INTO :NEW.id FROM dual;
          END IF;
        END;
      `);
      console.log('✅ Created order_items_trigger');
    } catch (err) {
      // Triggers can be replaced, so we don't check for exists
      console.log('ℹ️  order_items_trigger created/replaced');
    }

    await connection.commit();
    console.log('✅ Database tables initialized successfully!');
  } catch (error) {
    console.error('❌ Error initializing database:', error.message);
    if (connection) {
      await connection.rollback();
    }
    throw error;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Error closing connection:', err);
      }
    }
  }
}

// Seed sample data
async function seedSampleData() {
  // No sample data seeding needed for marketplace
  // All categories, vendors, and products are defined in the frontend
  console.log('ℹ️  Marketplace data is managed in frontend - no database seeding required');
}

// Graceful shutdown
async function closePool() {
  try {
    if (pool) {
      await pool.close(10); // 10 second drain time
      console.log('✅ Connection pool closed');
    }
  } catch (err) {
    console.error('Error closing pool:', err);
  }
}

// Handle process termination
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, closing connection pool...');
  await closePool();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, closing connection pool...');
  await closePool();
  process.exit(0);
});

export { getConnection, testConnection, initializeDatabase, seedSampleData, closePool };
