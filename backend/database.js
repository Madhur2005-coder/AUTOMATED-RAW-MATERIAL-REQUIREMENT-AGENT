import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, 'raw_materials.db');

export const db = new DatabaseSync(DB_PATH);

export function initDatabase() {
  // Enable foreign keys
  db.exec('PRAGMA foreign_keys = ON;');

  // Create tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      code TEXT NOT NULL UNIQUE,
      description TEXT,
      default_batch_size INTEGER DEFAULT 100,
      lead_time_days INTEGER DEFAULT 7
    );

    CREATE TABLE IF NOT EXISTS materials (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      code TEXT NOT NULL UNIQUE,
      unit TEXT NOT NULL,
      cost_per_unit REAL DEFAULT 0,
      supplier_name TEXT DEFAULT 'Standard Global Supply'
    );

    CREATE TABLE IF NOT EXISTS bom (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER NOT NULL,
      material_id INTEGER NOT NULL,
      quantity_per_unit REAL NOT NULL,
      FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE,
      FOREIGN KEY (material_id) REFERENCES materials (id) ON DELETE CASCADE,
      UNIQUE (product_id, material_id)
    );

    CREATE TABLE IF NOT EXISTS inventory (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      material_id INTEGER NOT NULL UNIQUE,
      current_stock REAL NOT NULL DEFAULT 0,
      safety_stock REAL NOT NULL DEFAULT 0,
      unit TEXT NOT NULL,
      warehouse_location TEXT DEFAULT 'Central Warehouse - Bay A',
      FOREIGN KEY (material_id) REFERENCES materials (id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS production_orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_number TEXT NOT NULL UNIQUE,
      product_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL,
      target_date TEXT NOT NULL,
      status TEXT DEFAULT 'PENDING_AGENT_ANALYSIS',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (product_id) REFERENCES products (id)
    );

    CREATE TABLE IF NOT EXISTS agent_runs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER,
      product_name TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      target_date TEXT,
      status TEXT DEFAULT 'COMPLETED',
      run_type TEXT DEFAULT 'DETERMINISTIC_AGENT',
      steps_json TEXT NOT NULL,
      decision_log_json TEXT NOT NULL,
      recommendation_json TEXT NOT NULL,
      summary_text TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (order_id) REFERENCES production_orders (id)
    );
  `);

  // Seed sample data if empty
  const count = db.prepare('SELECT COUNT(*) AS count FROM products').get();
  if (count.count === 0) {
    seedData();
  }
}

export function seedData() {
  db.exec('DELETE FROM bom;');
  db.exec('DELETE FROM inventory;');
  db.exec('DELETE FROM production_orders;');
  db.exec('DELETE FROM materials;');
  db.exec('DELETE FROM products;');

  // 1. Insert Products
  const insertProduct = db.prepare(`
    INSERT INTO products (name, code, description, default_batch_size, lead_time_days)
    VALUES (?, ?, ?, ?, ?)
  `);

  const pChair = insertProduct.run('Office Chair', 'PROD-OC-101', 'Ergonomic swivel mesh office chair', 500, 5);
  const pTable = insertProduct.run('Study Table', 'PROD-ST-202', 'Modern wooden desk with metal frame', 200, 7);
  const pCabinet = insertProduct.run('Steel Cabinet', 'PROD-SC-303', 'Heavy-duty 4-shelf industrial storage cabinet', 150, 10);
  const pLamp = insertProduct.run('LED Lamp', 'PROD-LL-404', 'Minimalist aluminum desk lamp with dimmer', 400, 4);

  // 2. Insert Materials
  const insertMaterial = db.prepare(`
    INSERT INTO materials (name, code, unit, cost_per_unit, supplier_name)
    VALUES (?, ?, ?, ?, ?)
  `);

  // Materials for Office Chair
  const mSteel = insertMaterial.run('Steel', 'MAT-STL-01', 'kg', 2.80, 'Apex Metal Corp');
  const mPlastic = insertMaterial.run('Plastic', 'MAT-PLS-02', 'kg', 1.60, 'Polymer Global');
  const mFoam = insertMaterial.run('Foam', 'MAT-FOM-03', 'kg', 3.50, 'Comfort Cushion Ltd');
  const mFabric = insertMaterial.run('Fabric', 'MAT-FAB-04', 'meter', 4.20, 'Textile Loom Works');

  // Materials for Study Table
  const mWood = insertMaterial.run('Wood Board', 'MAT-WOD-05', 'sq.meter', 12.00, 'Evergreen Timber');
  const mScrews = insertMaterial.run('Screws & Fasteners', 'MAT-SCR-06', 'pieces', 0.08, 'Hardware Hub');
  const mVarnish = insertMaterial.run('Wood Varnish', 'MAT-VAR-07', 'liter', 8.50, 'ColorCoat Paints');

  // Materials for Steel Cabinet & LED Lamp
  const mLock = insertMaterial.run('Lock Mechanism Set', 'MAT-LCK-08', 'set', 14.50, 'SafeTech Solutions');
  const mLED = insertMaterial.run('LED Driver Module', 'MAT-LED-09', 'unit', 6.20, 'Lumenix Electronics');
  const mAlu = insertMaterial.run('Aluminum Alloy', 'MAT-ALU-10', 'kg', 5.40, 'Alloy Craft Ltd');

  // 3. Insert BOM
  const insertBOM = db.prepare(`
    INSERT INTO bom (product_id, material_id, quantity_per_unit)
    VALUES (?, ?, ?)
  `);

  // Office Chair (Exact values from user prompt):
  // Steel: 2 kg, Plastic: 1.5 kg, Foam: 0.8 kg, Fabric: 1.2 meters
  insertBOM.run(pChair.lastInsertRowid, mSteel.lastInsertRowid, 2.0);
  insertBOM.run(pChair.lastInsertRowid, mPlastic.lastInsertRowid, 1.5);
  insertBOM.run(pChair.lastInsertRowid, mFoam.lastInsertRowid, 0.8);
  insertBOM.run(pChair.lastInsertRowid, mFabric.lastInsertRowid, 1.2);

  // Study Table
  insertBOM.run(pTable.lastInsertRowid, mWood.lastInsertRowid, 1.8);
  insertBOM.run(pTable.lastInsertRowid, mSteel.lastInsertRowid, 3.5);
  insertBOM.run(pTable.lastInsertRowid, mScrews.lastInsertRowid, 24);
  insertBOM.run(pTable.lastInsertRowid, mVarnish.lastInsertRowid, 0.4);

  // Steel Cabinet
  insertBOM.run(pCabinet.lastInsertRowid, mSteel.lastInsertRowid, 14.0);
  insertBOM.run(pCabinet.lastInsertRowid, mLock.lastInsertRowid, 1.0);
  insertBOM.run(pCabinet.lastInsertRowid, mScrews.lastInsertRowid, 32);

  // LED Lamp
  insertBOM.run(pLamp.lastInsertRowid, mAlu.lastInsertRowid, 0.45);
  insertBOM.run(pLamp.lastInsertRowid, mLED.lastInsertRowid, 1.0);
  insertBOM.run(pLamp.lastInsertRowid, mPlastic.lastInsertRowid, 0.25);

  // 4. Insert Inventory
  // Prompt exact values:
  // Steel: Current: 700 kg, Safety: 100 kg
  // Plastic: Current: 900 kg, Safety: 100 kg
  // Foam: Current: 300 kg, Safety: 100 kg
  // Fabric: Current: 700 meters, Safety: 100 meters
  const insertInventory = db.prepare(`
    INSERT INTO inventory (material_id, current_stock, safety_stock, unit, warehouse_location)
    VALUES (?, ?, ?, ?, ?)
  `);

  insertInventory.run(mSteel.lastInsertRowid, 700, 100, 'kg', 'Warehouse 1 - Rack S-10');
  insertInventory.run(mPlastic.lastInsertRowid, 900, 100, 'kg', 'Warehouse 1 - Rack P-04');
  insertInventory.run(mFoam.lastInsertRowid, 300, 100, 'kg', 'Warehouse 2 - Bay F-01');
  insertInventory.run(mFabric.lastInsertRowid, 700, 100, 'meter', 'Warehouse 2 - Bay T-08');

  insertInventory.run(mWood.lastInsertRowid, 250, 50, 'sq.meter', 'Warehouse 3 - Timber Yard');
  insertInventory.run(mScrews.lastInsertRowid, 4500, 1000, 'pieces', 'Warehouse 1 - Small Parts Bin');
  insertInventory.run(mVarnish.lastInsertRowid, 80, 20, 'liter', 'Chemical Storage Vault');
  insertInventory.run(mLock.lastInsertRowid, 90, 25, 'set', 'Security Store Room');
  insertInventory.run(mLED.lastInsertRowid, 350, 80, 'unit', 'Electronics Clean Room');
  insertInventory.run(mAlu.lastInsertRowid, 180, 40, 'kg', 'Warehouse 1 - Metal Bay');

  // 5. Insert Initial Sample Production Order
  const insertOrder = db.prepare(`
    INSERT INTO production_orders (order_number, product_id, quantity, target_date, status)
    VALUES (?, ?, ?, ?, ?)
  `);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 10);
  const targetDateStr = tomorrow.toISOString().split('T')[0];

  insertOrder.run('PO-2026-001', pChair.lastInsertRowid, 500, targetDateStr, 'READY_FOR_AGENT');
  insertOrder.run('PO-2026-002', pTable.lastInsertRowid, 100, targetDateStr, 'QUEUED');
}
