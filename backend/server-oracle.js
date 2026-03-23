import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { getConnection, testConnection, initializeDatabase, closePool } from './database-oracle.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Example Route: Get Orders
app.get('/api/orders', async (req, res) => {
  let conn;
  try {
    conn = await getConnection();
    const result = await conn.execute(`SELECT * FROM orders ORDER BY created_at DESC`, [], { outFormat: 4002 }); // 4002 = oracledb.OUT_FORMAT_OBJECT
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    if (conn) await conn.close();
  }
});

async function startServer() {
  try {
    const isConnected = await testConnection();
    if (!isConnected) throw new Error("Could not connect to Oracle");

    await initializeDatabase();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Critical Start Error:", err.message);
    process.exit(1);
  }
}

process.on('SIGINT', async () => {
  await closePool();
  process.exit(0);
});

startServer();
