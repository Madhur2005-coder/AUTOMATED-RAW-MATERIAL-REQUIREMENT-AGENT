import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import { db, initDatabase, seedData } from './database.js';
import { runPlanningAgent } from './agent/planningAgent.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize SQLite database
initDatabase();

// --- Health Check ---
app.get('/api/health', (req, res) => {
  const hasOpenAI = Boolean(process.env.OPENAI_API_KEY && !process.env.OPENAI_API_KEY.startsWith('your_'));
  res.json({
    status: 'online',
    system: 'Automated Raw Material Requirement Agent API',
    database: 'SQLite',
    agentMode: hasOpenAI ? 'OpenAI GPT Agent + Fallback' : 'Autonomous Deterministic Agent',
    timestamp: new Date().toISOString()
  });
});

// --- Products & BOM ---
app.get('/api/products', (req, res) => {
  try {
    const products = db.prepare('SELECT * FROM products ORDER BY name ASC').all();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/products/:id/bom', (req, res) => {
  try {
    const productId = req.params.id;
    const bom = db.prepare(`
      SELECT b.id, b.product_id, b.quantity_per_unit,
             m.id as material_id, m.name as material_name, m.code as material_code, 
             m.unit, m.cost_per_unit, m.supplier_name,
             COALESCE(i.current_stock, 0) as current_stock,
             COALESCE(i.safety_stock, 0) as safety_stock,
             i.warehouse_location
      FROM bom b
      JOIN materials m ON b.material_id = m.id
      LEFT JOIN inventory i ON m.id = i.material_id
      WHERE b.product_id = ?
    `).all(productId);

    res.json(bom);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Raw Materials ---
app.get('/api/materials', (req, res) => {
  try {
    const materials = db.prepare(`
      SELECT m.*, 
             COALESCE(i.current_stock, 0) as current_stock,
             COALESCE(i.safety_stock, 0) as safety_stock,
             COALESCE(i.warehouse_location, 'Not Assigned') as warehouse_location
      FROM materials m
      LEFT JOIN inventory i ON m.id = i.material_id
      ORDER BY m.name ASC
    `).all();
    res.json(materials);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Live Inventory ---
app.get('/api/inventory', (req, res) => {
  try {
    const inventory = db.prepare(`
      SELECT i.id as inventory_id, i.material_id, i.current_stock, i.safety_stock,
             i.unit, i.warehouse_location,
             m.name as material_name, m.code as material_code, m.cost_per_unit, m.supplier_name,
             MAX(0, i.current_stock - i.safety_stock) as available_usable_stock
      FROM inventory i
      JOIN materials m ON i.material_id = m.id
      ORDER BY m.name ASC
    `).all();
    res.json(inventory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Inventory Stock (allows testing various scenarios in the demo)
app.post('/api/inventory/update', (req, res) => {
  try {
    const { materialId, currentStock, safetyStock } = req.body;
    if (materialId === undefined) {
      return res.status(400).json({ error: 'materialId is required' });
    }

    const stmt = db.prepare(`
      UPDATE inventory
      SET current_stock = COALESCE(?, current_stock),
          safety_stock = COALESCE(?, safety_stock)
      WHERE material_id = ?
    `);
    stmt.run(currentStock, safetyStock, materialId);

    res.json({ success: true, message: 'Inventory updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Production Orders ---
app.get('/api/orders', (req, res) => {
  try {
    const orders = db.prepare(`
      SELECT o.*, p.name as product_name, p.code as product_code
      FROM production_orders o
      JOIN products p ON o.product_id = p.id
      ORDER BY o.id DESC
    `).all();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/orders', (req, res) => {
  try {
    const { productId, quantity, targetDate } = req.body;
    if (!productId || !quantity) {
      return res.status(400).json({ error: 'productId and quantity are required' });
    }

    const orderNumber = `PO-${Date.now().toString().slice(-6)}`;
    const stmt = db.prepare(`
      INSERT INTO production_orders (order_number, product_id, quantity, target_date, status)
      VALUES (?, ?, ?, ?, 'QUEUED')
    `);
    const result = stmt.run(orderNumber, productId, quantity, targetDate || new Date().toISOString().split('T')[0]);

    res.json({
      success: true,
      orderId: result.lastInsertRowid,
      orderNumber
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Agent Runs (History) ---
app.get('/api/agent/runs', (req, res) => {
  try {
    const runs = db.prepare('SELECT * FROM agent_runs ORDER BY id DESC LIMIT 20').all();
    const formatted = runs.map(r => ({
      ...r,
      steps: JSON.parse(r.steps_json || '[]'),
      decisionLog: JSON.parse(r.decision_log_json || '[]'),
      recommendation: JSON.parse(r.recommendation_json || '[]')
    }));
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Core Agent Execution Endpoint ---
app.post('/api/agent/run', async (req, res) => {
  try {
    const { productId, productName, quantity, targetDate, orderNumber } = req.body;
    
    if (!quantity || quantity <= 0) {
      return res.status(400).json({ error: 'Valid production quantity is required' });
    }

    const agentResult = await runPlanningAgent({
      productId,
      productName,
      quantity: Number(quantity),
      targetDate,
      orderNumber
    });

    res.json(agentResult);
  } catch (err) {
    console.error('Agent execution error:', err);
    res.status(500).json({ error: err.message });
  }
});

// --- 1-Click Demo Reset Endpoint ---
app.post('/api/demo-reset', (req, res) => {
  try {
    seedData();
    res.json({
      success: true,
      message: 'Demo state reset successfully to default benchmark parameters (Office Chair 500 units).'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Serve Static Frontend (Production / Single-Service Deployment) ---
const frontendDist = path.resolve(__dirname, '../frontend/dist');
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.resolve(frontendDist, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`🤖 Automated Raw Material Requirement Agent API`);
  console.log(`🚀 Backend running at: http://localhost:${PORT}`);
  console.log(`📊 SQLite database connected: raw_materials.db`);
  console.log(`⚡ Agentic Mode: ${process.env.OPENAI_API_KEY ? 'OpenAI GPT-4 + Deterministic Fallback' : 'Autonomous Deterministic Agent (Ready)'}`);
  console.log(`==================================================`);
});
