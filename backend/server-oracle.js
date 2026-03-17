import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import crypto from 'crypto';
import { getConnection, testConnection, initializeDatabase, seedSampleData, closePool } from './database-oracle.js';
import { initializeTransaction, verifyTransaction, listTransactions, processRefund, getBanks } from './payment.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Buy9ja Marketplace API is running',
    version: '2.0.0'
  });
});

// ==================== ORDER ENDPOINTS ====================

// Create new order
app.post('/api/orders', async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    
    const { items, total, userId, vendorId, vendorName } = req.body;
    
    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Order must contain items' });
    }
    
    if (!vendorId || !vendorName) {
      return res.status(400).json({ error: 'Vendor information is required' });
    }
    
    // Generate order ID
    const orderId = `ORD${Date.now().toString().slice(-6)}`;
    
    // Insert order
    await connection.execute(
      `INSERT INTO orders (id, user_id, vendor_id, vendor_name, status, total, estimated_time) 
       VALUES (:id, :userId, :vendorId, :vendorName, :status, :total, :estimatedTime)`,
      {
        id: orderId,
        userId: userId || null,
        vendorId: vendorId,
        vendorName: vendorName,
        status: 'preparing',
        total: total,
        estimatedTime: '25-35 min'
      }
    );
    
    // Insert order items
    for (const item of items) {
      await connection.execute(
        `INSERT INTO order_items (order_id, item_id, name, price, quantity) 
         VALUES (:orderId, :itemId, :name, :price, :quantity)`,
        {
          orderId: orderId,
          itemId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        }
      );
    }
    
    await connection.commit();
    
    // Fetch the created order with items
    const orderResult = await connection.execute(
      `SELECT id, user_id, vendor_id, vendor_name, status, total, estimated_time, created_at, updated_at 
       FROM orders 
       WHERE id = :orderId`,
      { orderId: orderId }
    );
    
    const itemsResult = await connection.execute(
      `SELECT item_id as id, name, price, quantity 
       FROM order_items 
       WHERE order_id = :orderId`,
      { orderId: orderId }
    );
    
    const order = {
      ...orderResult.rows[0],
      items: itemsResult.rows,
      estimatedTime: orderResult.rows[0].ESTIMATED_TIME
    };
    
    res.status(201).json(order);
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Error closing connection:', err);
      }
    }
  }
});

// Get all orders (optionally filtered by userId)
app.get('/api/orders', async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const userId = req.query.userId;
    
    let query = `SELECT id, user_id, vendor_id, vendor_name, status, total, estimated_time, created_at, updated_at 
                 FROM orders`;
    let binds = {};
    
    if (userId) {
      query += ` WHERE user_id = :userId`;
      binds.userId = userId;
    }
    
    query += ` ORDER BY created_at DESC`;
    
    const orderResult = await connection.execute(query, binds);
    
    // Fetch items for each order
    const ordersWithItems = await Promise.all(
      orderResult.rows.map(async (order) => {
        const itemsResult = await connection.execute(
          `SELECT item_id as id, name, price, quantity 
           FROM order_items 
           WHERE order_id = :orderId`,
          { orderId: order.ID }
        );
        
        return {
          ...order,
          items: itemsResult.rows,
          estimatedTime: order.ESTIMATED_TIME
        };
      })
    );
    
    res.json(ordersWithItems);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Error closing connection:', err);
      }
    }
  }
});

// Get single order
app.get('/api/orders/:orderId', async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    
    const orderResult = await connection.execute(
      `SELECT id, user_id, vendor_id, vendor_name, status, total, estimated_time, created_at, updated_at 
       FROM orders 
       WHERE id = :orderId`,
      { orderId: req.params.orderId }
    );
    
    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    const itemsResult = await connection.execute(
      `SELECT item_id as id, name, price, quantity 
       FROM order_items 
       WHERE order_id = :orderId`,
      { orderId: req.params.orderId }
    );
    
    const order = {
      ...orderResult.rows[0],
      items: itemsResult.rows,
      estimatedTime: orderResult.rows[0].ESTIMATED_TIME
    };
    
    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Error closing connection:', err);
      }
    }
  }
});

// Update order status
app.patch('/api/orders/:orderId/status', async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const { status } = req.body;
    
    if (!['preparing', 'on-the-way', 'delivered', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    
    await connection.execute(
      `UPDATE orders 
       SET status = :status, updated_at = SYSTIMESTAMP 
       WHERE id = :orderId`,
      { status: status, orderId: req.params.orderId }
    );
    
    await connection.commit();
    
    const orderResult = await connection.execute(
      `SELECT id, user_id, vendor_id, vendor_name, status, total, estimated_time, created_at, updated_at 
       FROM orders 
       WHERE id = :orderId`,
      { orderId: req.params.orderId }
    );
    
    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    const itemsResult = await connection.execute(
      `SELECT item_id as id, name, price, quantity 
       FROM order_items 
       WHERE order_id = :orderId`,
      { orderId: req.params.orderId }
    );
    
    const order = {
      ...orderResult.rows[0],
      items: itemsResult.rows,
      estimatedTime: orderResult.rows[0].ESTIMATED_TIME
    };
    
    res.json(order);
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Error closing connection:', err);
      }
    }
  }
});

// ==================== PAYMENT ENDPOINTS ====================

// Initialize Paystack transaction
app.post('/api/initialize-payment', async (req, res) => {
  try {
    const { email, amount, orderId, items } = req.body;
    
    if (!email || !amount || amount <= 0) {
      return res.status(400).json({ error: 'Email and valid amount required' });
    }
    
    const result = await initializeTransaction(email, amount, {
      orderId: orderId || '',
      itemCount: items?.length || 0,
      callback_url: `${process.env.FRONTEND_URL}/payment/callback`
    });
    
    if (!result.success) {
      return res.status(500).json({ error: result.error });
    }
    
    res.json({
      authorizationUrl: result.authorizationUrl,
      accessCode: result.accessCode,
      reference: result.reference
    });
  } catch (error) {
    console.error('Error initializing payment:', error);
    res.status(500).json({ error: 'Failed to initialize payment' });
  }
});

// Verify Paystack transaction
app.get('/api/verify-payment/:reference', async (req, res) => {
  try {
    const { reference } = req.params;
    
    if (!reference) {
      return res.status(400).json({ error: 'Transaction reference required' });
    }
    
    const result = await verifyTransaction(reference);
    
    if (!result.success) {
      return res.status(500).json({ error: result.error });
    }
    
    res.json(result);
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ error: 'Failed to verify payment' });
  }
});

// List all transactions
app.get('/api/transactions', async (req, res) => {
  try {
    const perPage = parseInt(req.query.perPage) || 50;
    const page = parseInt(req.query.page) || 1;
    
    const result = await listTransactions(perPage, page);
    
    if (!result.success) {
      return res.status(500).json({ error: result.error });
    }
    
    res.json(result);
  } catch (error) {
    console.error('Error listing transactions:', error);
    res.status(500).json({ error: 'Failed to list transactions' });
  }
});

// Process refund
app.post('/api/refund', async (req, res) => {
  try {
    const { reference, amount } = req.body;
    
    if (!reference) {
      return res.status(400).json({ error: 'Transaction reference required' });
    }
    
    const result = await processRefund(reference, amount);
    
    if (!result.success) {
      return res.status(500).json({ error: result.error });
    }
    
    res.json(result);
  } catch (error) {
    console.error('Error processing refund:', error);
    res.status(500).json({ error: 'Failed to process refund' });
  }
});

// Get supported banks
app.get('/api/banks', async (req, res) => {
  try {
    const result = await getBanks();
    
    if (!result.success) {
      return res.status(500).json({ error: result.error });
    }
    
    res.json(result);
  } catch (error) {
    console.error('Error fetching banks:', error);
    res.status(500).json({ error: 'Failed to fetch banks' });
  }
});

// Paystack webhook endpoint
app.post('/api/webhook', express.json(), async (req, res) => {
  const signature = req.headers['x-paystack-signature'];
  
  // Verify webhook signature
  const hash = crypto
    .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
    .update(JSON.stringify(req.body))
    .digest('hex');
  
  if (hash !== signature) {
    return res.status(400).json({ error: 'Invalid signature' });
  }
  
  // Handle the event
  const event = req.body;
  
  switch (event.event) {
    case 'charge.success':
      const transaction = event.data;
      console.log('✅ Payment succeeded:', transaction.reference);
      // Update order status in database if needed
      // You can get the order ID from transaction.metadata
      break;
    
    case 'charge.failed':
      console.log('❌ Payment failed:', event.data.reference);
      // Handle failed payment
      break;
    
    default:
      console.log(`Unhandled event type: ${event.event}`);
  }
  
  res.sendStatus(200);
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
async function startServer() {
  // Test database connection
  const connected = await testConnection();
  
  if (!connected) {
    console.error('Failed to connect to database. Please check your credentials.');
    process.exit(1);
  }
  
  // Initialize database tables
  await initializeDatabase();
  
  // Seed sample data (no-op for marketplace)
  await seedSampleData();
  
  // Start Express server
  app.listen(PORT, () => {
    console.log(`\n🚀 Buy9ja Marketplace API Server running on port ${PORT}`);
    console.log(`📍 API URL: http://localhost:${PORT}/api`);
    console.log(`🏥 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`\n📚 Available Endpoints:`);
    console.log(`   POST   /api/orders`);
    console.log(`   GET    /api/orders`);
    console.log(`   GET    /api/orders/:id`);
    console.log(`   PATCH  /api/orders/:id/status`);
    console.log(`   POST   /api/initialize-payment`);
    console.log(`   GET    /api/verify-payment/:reference`);
    console.log(`   GET    /api/transactions`);
    console.log(`   POST   /api/refund`);
    console.log(`   GET    /api/banks`);
    console.log(`   POST   /api/webhook`);
    console.log(`\n💡 Marketplace Categories & Vendors are managed in frontend`);
    console.log(`✨ Ready to accept orders and payments!\n`);
  });
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received: closing HTTP server');
  await closePool();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT signal received: closing HTTP server');
  await closePool();
  process.exit(0);
});

startServer();

