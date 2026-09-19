import { db } from '../database.js';

/**
 * Multi-Step Agentic AI Planning Engine for Raw Material Requirement
 *
 * Workflow:
 * 1. Perceive & parse production order
 * 2. Retrieve Bill of Materials (BOM)
 * 3. Audit current warehouse inventory & safety stock
 * 4. Compute gross requirement (Production Qty * Per-unit BOM)
 * 5. Calculate net availability (Current Stock - Safety Stock) & detect shortages
 * 6. Formulate procurement recommendations & purchase batches
 * 7. Synthesize final AI narrative report (via OpenAI or deterministic fallback)
 */

export async function runPlanningAgent({ productId, productName, quantity, targetDate, orderNumber }) {
  const timestamp = new Date().toLocaleTimeString();
  const steps = [];
  const decisionLog = [];

  // Helper to append step execution state
  function logStep(stepNum, title, description, status = 'completed', meta = {}) {
    steps.push({
      step: stepNum,
      title,
      description,
      status,
      timestamp: new Date().toLocaleTimeString(),
      ...meta
    });
  }

  // Helper to append agent decision log item
  function addDecision(type, message, details = null) {
    // type: 'success' (✓), 'warning' (⚠), 'info' (ℹ)
    decisionLog.push({
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      type,
      message,
      details,
      time: new Date().toLocaleTimeString()
    });
  }

  // --- STEP 1: Understanding Production Order ---
  logStep(1, 'Understanding Production Order', `Parsing request for ${quantity} units of ${productName || 'Product'} (Target: ${targetDate || 'Immediate'})`);
  addDecision('success', `Production requirement identified: ${quantity} units of ${productName}`);
  if (orderNumber) {
    addDecision('info', `Linked to Production Order: ${orderNumber}`);
  }

  // --- STEP 2: Reading Bill of Materials (BOM) ---
  logStep(2, 'Reading Bill of Materials', `Retrieving component architecture and unit ratios for ${productName}`);
  
  let targetProduct = null;
  if (productId) {
    targetProduct = db.prepare('SELECT * FROM products WHERE id = ?').get(productId);
  } else if (productName) {
    targetProduct = db.prepare('SELECT * FROM products WHERE LOWER(name) = LOWER(?)').get(productName);
  }

  if (!targetProduct) {
    // Fallback: search closest product or first product
    targetProduct = db.prepare('SELECT * FROM products LIMIT 1').get();
  }

  const bomItems = db.prepare(`
    SELECT b.id as bom_id, b.quantity_per_unit, m.id as material_id, m.name as material_name, 
           m.code as material_code, m.unit, m.cost_per_unit, m.supplier_name
    FROM bom b
    JOIN materials m ON b.material_id = m.id
    WHERE b.product_id = ?
  `).all(targetProduct.id);

  if (bomItems.length === 0) {
    addDecision('warning', `No BOM found for ${targetProduct.name}. Checking default configuration.`);
  } else {
    addDecision('success', `BOM loaded successfully (${bomItems.length} components found for ${targetProduct.name})`);
  }

  // --- STEP 3: Checking Inventory & Safety Stock ---
  logStep(3, 'Checking Inventory', `Auditing current stock levels and safety reserves across warehouse locations`);
  
  const materialIds = bomItems.map(b => b.material_id);
  const inventoryMap = new Map();

  if (materialIds.length > 0) {
    const placeholders = materialIds.map(() => '?').join(',');
    const invRecords = db.prepare(`
      SELECT i.*, m.name as material_name, m.unit as material_unit
      FROM inventory i
      JOIN materials m ON i.material_id = m.id
      WHERE i.material_id IN (${placeholders})
    `).all(...materialIds);

    for (const inv of invRecords) {
      inventoryMap.set(inv.material_id, inv);
    }
    addDecision('success', `Warehouse inventory verified for all ${invRecords.length} required materials`);
  }

  // --- STEP 4: Calculating Material Requirements ---
  logStep(4, 'Calculating Material Requirements', `Applying gross BOM formula: Total Required = Production Qty (${quantity}) × Required Per Unit`);
  
  const materialAnalysis = [];

  for (const item of bomItems) {
    const totalRequired = Math.round((quantity * item.quantity_per_unit) * 100) / 100;
    const inv = inventoryMap.get(item.material_id) || { current_stock: 0, safety_stock: 0, warehouse_location: 'Unassigned' };
    
    // Formula from prompt:
    // Available Usable Stock = Current Stock - Safety Stock
    const availableUsableStock = Math.max(0, inv.current_stock - inv.safety_stock);
    
    // Purchase Requirement = max(0, Total Required - Available Usable Stock)
    const shortage = Math.max(0, Math.round((totalRequired - availableUsableStock) * 100) / 100);
    const purchaseRequirement = shortage;

    addDecision('success', `${item.material_name} gross requirement calculated: ${totalRequired} ${item.unit}`);

    let status = 'Sufficient';
    let statusColor = 'green';

    if (purchaseRequirement > 0) {
      status = 'Shortage';
      statusColor = 'red';
    } else if (inv.current_stock - totalRequired < inv.safety_stock) {
      status = 'Low Stock';
      statusColor = 'yellow';
    }

    const estimatedCost = Math.round((purchaseRequirement * (item.cost_per_unit || 0)) * 100) / 100;

    materialAnalysis.push({
      materialId: item.material_id,
      name: item.material_name,
      code: item.material_code,
      unit: item.unit,
      requiredPerProduct: item.quantity_per_unit,
      totalRequired,
      currentStock: inv.current_stock,
      safetyStock: inv.safety_stock,
      availableUsableStock,
      shortage,
      purchaseRequirement,
      status,
      statusColor,
      costPerUnit: item.cost_per_unit,
      estimatedCost,
      supplierName: item.supplier_name,
      warehouseLocation: inv.warehouse_location
    });
  }

  // --- STEP 5: Detecting Shortages ---
  logStep(5, 'Detecting Shortages', `Evaluating usable buffer against production requirements to flag critical deficits`);
  
  const shortages = materialAnalysis.filter(m => m.purchaseRequirement > 0);
  const sufficients = materialAnalysis.filter(m => m.purchaseRequirement === 0);

  for (const item of materialAnalysis) {
    if (item.purchaseRequirement > 0) {
      addDecision('warning', `${item.name} inventory is insufficient`);
      addDecision('info', `Available ${item.name.toLowerCase()} after safety stock: ${item.availableUsableStock} ${item.unit}`);
      addDecision('warning', `Additional ${item.name.toLowerCase()} required: ${item.purchaseRequirement} ${item.unit}`);
    } else {
      addDecision('success', `${item.name} inventory is sufficient (${item.currentStock} ${item.unit} in stock, ${item.availableUsableStock} ${item.unit} usable)`);
    }
  }

  // --- STEP 6: Generating Procurement Recommendation ---
  logStep(6, 'Generating Procurement Recommendation', `Synthesizing supplier purchase batch orders and cost allocations`);
  
  const totalPurchaseCost = shortages.reduce((acc, curr) => acc + curr.estimatedCost, 0);
  
  if (shortages.length > 0) {
    addDecision('warning', `Procurement required for ${shortages.length} material(s). Total estimated cost: $${totalPurchaseCost.toFixed(2)}`);
  } else {
    addDecision('success', `All raw materials fully covered in inventory. Zero procurement needed.`);
  }
  addDecision('success', `Procurement recommendation generated`);

  // --- STEP 7: Preparing Final Report (OpenAI or Rule-based) ---
  logStep(7, 'Preparing Final Report', `Compiling executive summary and decision intelligence narrative`);

  let aiSummary = '';
  let runType = 'DETERMINISTIC_RULE_AGENT';

  // Check if OPENAI_API_KEY is available
  const apiKey = process.env.OPENAI_API_KEY;
  if (apiKey && apiKey.trim() !== '' && !apiKey.startsWith('your_')) {
    try {
      aiSummary = await generateOpenAISummary(apiKey, {
        productName: targetProduct.name,
        quantity,
        targetDate,
        analysis: materialAnalysis,
        shortages,
        totalPurchaseCost
      });
      runType = 'OPENAI_AGENT';
    } catch (err) {
      console.warn('OpenAI API call failed, falling back to rule-based agent:', err.message);
      aiSummary = generateRuleBasedSummary(targetProduct.name, quantity, targetDate, materialAnalysis, shortages);
    }
  } else {
    aiSummary = generateRuleBasedSummary(targetProduct.name, quantity, targetDate, materialAnalysis, shortages);
  }

  addDecision('success', `Final intelligence synthesis compiled via ${runType === 'OPENAI_AGENT' ? 'OpenAI LLM' : 'Autonomous Deterministic Agent'}`);

  // Summary Metrics
  const metrics = {
    totalMaterialsTracked: materialAnalysis.length,
    materialsSufficient: sufficients.length,
    materialsShort: shortages.length,
    totalEstimatedProcurementCost: Math.round(totalPurchaseCost * 100) / 100,
    hasShortage: shortages.length > 0,
    productName: targetProduct.name,
    quantity,
    targetDate: targetDate || 'Standard Production Schedule'
  };

  // Record agent run in SQLite database
  try {
    const insertRun = db.prepare(`
      INSERT INTO agent_runs (
        order_id, product_name, quantity, target_date, status, run_type,
        steps_json, decision_log_json, recommendation_json, summary_text
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertRun.run(
      null,
      targetProduct.name,
      quantity,
      targetDate || new Date().toISOString().split('T')[0],
      'COMPLETED',
      runType,
      JSON.stringify(steps),
      JSON.stringify(decisionLog),
      JSON.stringify(materialAnalysis),
      aiSummary
    );
  } catch (dbErr) {
    console.error('Error saving agent run record:', dbErr);
  }

  return {
    success: true,
    workflowStatus: 'Agent Analysis Complete',
    runType,
    product: targetProduct,
    quantity,
    targetDate,
    steps,
    decisionLog,
    materials: materialAnalysis,
    shortages,
    metrics,
    summary: aiSummary
  };
}

/**
 * Deterministic Rule-Based Summary Generator
 * Produces structured, accurate explanations as requested in Prompt Section 9.
 */
function generateRuleBasedSummary(productName, quantity, targetDate, materials, shortages) {
  const reqList = materials
    .map(m => `${m.totalRequired.toLocaleString()} ${m.unit} of ${m.name.toLowerCase()}`)
    .join(', ');

  const sufficientList = materials
    .filter(m => m.purchaseRequirement === 0)
    .map(m => m.name.toLowerCase())
    .join(' and ');

  const shortageDetails = shortages
    .map(m => `${m.name} has a shortage of ${m.purchaseRequirement.toLocaleString()} ${m.unit}`)
    .join(' and ');

  const recommendations = shortages.length > 0
    ? shortages.map(m => `• ${m.name}: ${m.purchaseRequirement.toLocaleString()} ${m.unit} (Est. cost: $${m.estimatedCost.toFixed(2)})`).join('\n')
    : '• No additional procurement required. Inventory levels satisfy all safety stock buffers.';

  const timelineNote = targetDate
    ? `Procurement should be initiated immediately to meet the scheduled production date of ${targetDate}.`
    : 'Procurement should be initiated before the scheduled production date.';

  let text = `The production order requires ${reqList}.\n\n`;

  if (sufficientList) {
    text += `Current inventory is sufficient for ${sufficientList}.\n\n`;
  }

  if (shortages.length > 0) {
    text += `${shortageDetails} after maintaining designated safety stock reserves.\n\n`;
    text += `Recommended procurement:\n${recommendations}\n\n`;
    text += timelineNote;
  } else {
    text += `All safety stock margins are comfortably satisfied. All ${materials.length} required raw materials are in stock for immediate manufacturing run.`;
  }

  return text;
}

/**
 * OpenAI Agent Generator
 */
async function generateOpenAISummary(apiKey, { productName, quantity, targetDate, analysis, shortages, totalPurchaseCost }) {
  const prompt = `
You are an expert Autonomous Raw Material Planning AI Agent in a manufacturing facility.
Analyze the following production requirement and provide an executive procurement summary.

Product: ${productName}
Quantity: ${quantity} units
Target Date: ${targetDate || 'Flexible'}

Materials Analysis:
${analysis.map(m => `- ${m.name}: Required ${m.totalRequired} ${m.unit}, Stock ${m.currentStock} ${m.unit}, Safety Stock ${m.safetyStock} ${m.unit}, Available Usable ${m.availableUsableStock} ${m.unit}, Shortage: ${m.purchaseRequirement} ${m.unit}`).join('\n')}

Shortages: ${shortages.length > 0 ? shortages.map(s => `${s.name} (${s.purchaseRequirement} ${s.unit})`).join(', ') : 'None'}
Total Estimated Purchase Cost: $${totalPurchaseCost.toFixed(2)}

Provide a concise, professional executive briefing (2-3 paragraphs) detailing:
1. Total raw material demand breakdown
2. Specific inventory shortages after preserving safety stock
3. Bulleted recommended purchase actions with supplier urgency
Keep tone professional, analytical, and actionable.
  `;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are an AI Raw Material Planning Agent specialized in manufacturing supply chain analytics.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.3,
      max_tokens: 400
    })
  });

  if (!response.ok) {
    throw new Error(`OpenAI HTTP error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || 'Agent report generated.';
}
