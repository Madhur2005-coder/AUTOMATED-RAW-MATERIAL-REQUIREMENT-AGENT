import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  Clock, 
  ArrowRight, 
  Package, 
  Boxes, 
  AlertCircle, 
  DollarSign, 
  FileText, 
  Layers, 
  RotateCw, 
  Cpu, 
  ChevronRight,
  TrendingDown,
  ShieldCheck,
  Check
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';

export default function Dashboard({ 
  products, 
  selectedProduct, 
  setSelectedProduct, 
  quantity, 
  setQuantity, 
  targetDate, 
  setTargetDate, 
  currentBOM, 
  agentData, 
  isRunningAgent, 
  currentStepIndex, 
  onRunAgent, 
  onOpenReport 
}) {
  const [activeWorkflowTab, setActiveWorkflowTab] = useState('workflow'); // 'workflow' or 'log'

  // Default steps definition
  const agentSteps = [
    { num: 1, title: 'Understanding Production Order', desc: 'Parsing production target & parameters' },
    { num: 2, title: 'Reading Bill of Materials', desc: 'Retrieving component recipe ratios' },
    { num: 3, title: 'Checking Inventory', desc: 'Auditing warehouse stocks & safety buffers' },
    { num: 4, title: 'Calculating Material Requirements', desc: 'Computing Gross Need = Qty × Ratio' },
    { num: 5, title: 'Detecting Shortages', desc: 'Evaluating Usable Stock against Demand' },
    { num: 6, title: 'Generating Procurement Recommendation', desc: 'Synthesizing purchase orders' },
    { num: 7, title: 'Preparing Final Report', desc: 'Generating natural language intelligence' },
  ];

  // Derive top 4 summary metric card values
  const totalBOMMaterials = currentBOM ? currentBOM.length : 4;
  const materialsShortCount = agentData ? agentData.metrics.materialsShort : 2;
  const totalEstimatedCost = agentData ? agentData.metrics.totalEstimatedProcurementCost : 1820;

  // Chart data preparation
  const chartData = agentData && agentData.materials ? agentData.materials.map(m => ({
    name: m.name,
    'Total Required': m.totalRequired,
    'Available Usable': m.availableUsableStock,
    'Purchase Needed': m.purchaseRequirement,
    unit: m.unit,
    status: m.status
  })) : [];

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Welcome & Subtitle */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Raw Material Requirement Agent
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            AI-powered production planning and procurement assistant
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="btn-open-report"
            onClick={onOpenReport}
            className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-xl text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <FileText className="w-4 h-4 mr-2 text-indigo-600" />
            Generate Procurement Report
          </button>

          <button
            id="btn-run-ai-agent"
            onClick={onRunAgent}
            disabled={isRunningAgent}
            className="inline-flex items-center px-5 py-2.5 text-sm font-bold rounded-xl text-white bg-gradient-to-r from-indigo-600 via-indigo-700 to-blue-600 hover:from-indigo-700 hover:to-blue-700 shadow-lg shadow-indigo-500/25 active:scale-95 transition-all disabled:opacity-60"
          >
            {isRunningAgent ? (
              <>
                <RotateCw className="w-4 h-4 mr-2 animate-spin" />
                Reasoning in Progress...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Run AI Agent
              </>
            )}
          </button>
        </div>
      </div>

      {/* ================================================== */}
      {/* 3. MAIN DASHBOARD: 4 METRIC CARDS */}
      {/* ================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Production Orders */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Production Orders
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-slate-900">
              {quantity} <span className="text-sm font-medium text-slate-500">units</span>
            </div>
            <p className="text-xs text-slate-500 mt-1 truncate">
              {selectedProduct ? selectedProduct.name : 'Office Chair'}
            </p>
          </div>
        </div>

        {/* Card 2: Total Raw Materials */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Raw Materials
            </span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Boxes className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-slate-900">
              {totalBOMMaterials} <span className="text-sm font-medium text-slate-500">components</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Monitored in current BOM
            </p>
          </div>
        </div>

        {/* Card 3: Materials Short */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Materials Short
            </span>
            <div className={`w-9 h-9 rounded-xl ${materialsShortCount > 0 ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'} flex items-center justify-center`}>
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2">
            <div className={`text-2xl font-black ${materialsShortCount > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
              {materialsShortCount} <span className="text-sm font-medium text-slate-500">deficits</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {materialsShortCount > 0 ? 'Urgent procurement required' : 'Sufficient inventory available'}
            </p>
          </div>
        </div>

        {/* Card 4: Estimated Purchase Requirement */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Estimated Purchase
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-slate-900">
              ${totalEstimatedCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {agentData && agentData.shortages ? `${agentData.shortages.length} purchase line item(s)` : 'Estimated cost'}
            </p>
          </div>
        </div>

      </div>

      {/* ================================================== */}
      {/* 4. PRODUCTION ORDER SECTION */}
      {/* ================================================== */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Production Order Configuration</h3>
            <p className="text-xs text-slate-500">Configure product specifications and quantity to automatically evaluate material availability</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Sample Presets:</span>
            {products.map(p => (
              <button
                key={p.id}
                onClick={() => {
                  setSelectedProduct(p);
                  setQuantity(p.default_batch_size || 100);
                }}
                className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all ${
                  selectedProduct?.id === p.id 
                    ? 'bg-indigo-600 text-white shadow-2xs' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>

        <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Product Name
            </label>
            <select
              id="select-product"
              value={selectedProduct ? selectedProduct.id : ''}
              onChange={(e) => {
                const prod = products.find(p => p.id === Number(e.target.value));
                if (prod) {
                  setSelectedProduct(prod);
                  setQuantity(prod.default_batch_size || 100);
                }
              }}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden font-medium text-slate-900"
            >
              {products.map((prod) => (
                <option key={prod.id} value={prod.id}>
                  {prod.name} ({prod.code})
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-400 mt-1 truncate">
              {selectedProduct?.description || 'Select manufacturing product'}
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Production Quantity
            </label>
            <input
              id="input-quantity"
              type="number"
              min="1"
              max="10000"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden font-medium text-slate-900"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Target units to produce in this manufacturing batch
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Production Date
            </label>
            <input
              id="input-target-date"
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden font-medium text-slate-900"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Scheduled start date for the shop floor assembly
            </p>
          </div>
        </div>
      </div>

      {/* ================================================== */}
      {/* 5. RAW MATERIAL / BOM SECTION */}
      {/* ================================================== */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-900 text-base">
                Bill of Materials & Inventory Audit
              </h3>
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-50 text-indigo-700">
                {selectedProduct?.name} ({quantity} units)
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Live components required per unit and current warehouse availability
            </p>
          </div>

          {/* Mathematical Formula Reminder Banner */}
          <div className="hidden lg:flex items-center gap-2 text-[11px] bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600">
            <span className="font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200">Total Req = Qty × Ratio</span>
            <span>•</span>
            <span className="font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200">Usable = Stock - Safety</span>
            <span>•</span>
            <span className="font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200">Purchase = max(0, Req - Usable)</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/75 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Material</th>
                <th className="py-3 px-4">Unit</th>
                <th className="py-3 px-4 text-right">Required Per Product</th>
                <th className="py-3 px-4 text-right bg-indigo-50/40 text-indigo-900">Total Required</th>
                <th className="py-3 px-4 text-right">Current Stock</th>
                <th className="py-3 px-4 text-right">Safety Stock</th>
                <th className="py-3 px-4 text-right text-emerald-800">Available Usable Stock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {currentBOM && currentBOM.length > 0 ? (
                currentBOM.map((item) => {
                  const totalReq = Math.round(quantity * item.quantity_per_unit * 100) / 100;
                  const usableStock = Math.max(0, item.current_stock - item.safety_stock);
                  const isLow = usableStock < totalReq;

                  return (
                    <tr key={item.id || item.material_id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-slate-800 flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${isLow ? 'bg-rose-500' : 'bg-emerald-500'}`}></span>
                        {item.material_name}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 font-mono text-xs">
                        {item.unit}
                      </td>
                      <td className="py-3.5 px-4 text-right font-medium text-slate-700">
                        {item.quantity_per_unit}
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-indigo-700 bg-indigo-50/20">
                        {totalReq.toLocaleString()} {item.unit}
                      </td>
                      <td className="py-3.5 px-4 text-right font-medium text-slate-800">
                        {item.current_stock.toLocaleString()} {item.unit}
                      </td>
                      <td className="py-3.5 px-4 text-right text-slate-500">
                        {item.safety_stock.toLocaleString()} {item.unit}
                      </td>
                      <td className="py-3.5 px-4 text-right font-semibold text-slate-900">
                        {usableStock.toLocaleString()} {item.unit}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-6 text-slate-400 text-sm">
                    Loading Bill of Materials...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================================================== */}
      {/* 6. AI AGENT WORKFLOW & 7. AGENT DECISION LOG */}
      {/* ================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Col: 6. 7-Step Animated Workflow (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col justify-between">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Cpu className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">AI Agent Workflow Execution</h3>
                <p className="text-xs text-slate-500">Sequential multi-step reasoning and action loop</p>
              </div>
            </div>
            
            <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide flex items-center gap-1.5 ${
              isRunningAgent 
                ? 'bg-amber-50 text-amber-700 border border-amber-200' 
                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            }`}>
              {isRunningAgent ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
                  Executing Step {currentStepIndex + 1} of 7...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Agent Analysis Complete
                </>
              )}
            </span>
          </div>

          <div className="p-5 space-y-3">
            {agentSteps.map((s, idx) => {
              const isDone = !isRunningAgent || currentStepIndex > idx;
              const isCurrent = isRunningAgent && currentStepIndex === idx;
              const isPending = isRunningAgent && currentStepIndex < idx;

              return (
                <div 
                  key={s.num}
                  className={`flex items-start gap-3.5 p-3 rounded-xl transition-all duration-300 ${
                    isCurrent 
                      ? 'bg-indigo-50/80 border border-indigo-200 scale-[1.01] shadow-xs' 
                      : isDone 
                        ? 'bg-slate-50/70 border border-slate-100 text-slate-800' 
                        : 'opacity-40 border border-transparent'
                  }`}
                >
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono text-xs font-bold shrink-0 transition-colors ${
                    isCurrent 
                      ? 'bg-indigo-600 text-white shadow-xs' 
                      : isDone 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : 'bg-slate-200 text-slate-600'
                  }`}>
                    {isCurrent ? (
                      <RotateCw className="w-3.5 h-3.5 animate-spin" />
                    ) : isDone ? (
                      <Check className="w-4 h-4 text-emerald-700 stroke-[3]" />
                    ) : (
                      s.num
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-semibold ${isCurrent ? 'text-indigo-950 font-bold' : isDone ? 'text-slate-900' : 'text-slate-500'}`}>
                        Step {s.num}: {s.title}
                      </span>
                      {isCurrent && (
                        <span className="text-[10px] uppercase font-bold text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded">
                          Active Tool
                        </span>
                      )}
                      {isDone && !isRunningAgent && (
                        <span className="text-[10px] text-emerald-700 font-semibold">
                          Done
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {s.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-4 bg-slate-50 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
            <span>Perception → Analysis → Inventory Tool → Decision Tool → Action</span>
            <span className="font-semibold text-slate-700">Autonomous Reasoning Cycle</span>
          </div>
        </div>

        {/* Right Col: 7. Agent Decision Log (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-900 text-base">Agent Decision Log</h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 text-slate-700 font-bold">
                {agentData ? agentData.decisionLog.length : 0} actions
              </span>
            </div>
            <span className="text-[11px] text-indigo-600 font-semibold">
              Viva Demonstration
            </span>
          </div>

          <div className="p-4 flex-1 overflow-y-auto max-h-[460px] space-y-2.5 font-sans">
            {agentData && agentData.decisionLog && agentData.decisionLog.length > 0 ? (
              agentData.decisionLog.map((log, idx) => {
                const isWarning = log.type === 'warning';
                const isSuccess = log.type === 'success';

                return (
                  <div 
                    key={log.id || idx}
                    className={`p-2.5 rounded-xl text-xs flex items-start gap-2.5 border transition-all ${
                      isWarning 
                        ? 'bg-rose-50/70 border-rose-200/80 text-rose-950' 
                        : isSuccess 
                          ? 'bg-emerald-50/50 border-emerald-100 text-slate-800' 
                          : 'bg-slate-50 border-slate-200/70 text-slate-700'
                    }`}
                  >
                    <span className="mt-0.5 shrink-0 text-sm">
                      {isWarning ? '⚠' : isSuccess ? '✓' : 'ℹ'}
                    </span>
                    <div className="flex-1">
                      <p className={`font-medium ${isWarning ? 'text-rose-900 font-semibold' : 'text-slate-800'}`}>
                        {log.message}
                      </p>
                      {log.details && (
                        <p className="text-[11px] text-slate-500 mt-0.5">{log.details}</p>
                      )}
                    </div>
                    {log.time && (
                      <span className="text-[10px] text-slate-400 font-mono shrink-0">
                        {log.time}
                      </span>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center text-slate-400 text-xs">
                Click "Run AI Agent" to view real-time decision logging
              </div>
            )}
          </div>

          <div className="p-3.5 bg-slate-50/80 border-t border-slate-100 text-[11px] text-slate-500">
            Transparent Chain-of-Thought reasoning log for external auditability.
          </div>
        </div>

      </div>

      {/* ================================================== */}
      {/* 8. PROCUREMENT RECOMMENDATION TABLE */}
      {/* ================================================== */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              Procurement Recommendation Table
            </h3>
            <p className="text-xs text-slate-500">
              Evaluated material requirements, shortages, and actionable purchase orders
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700">
            Safety Stock Buffer Enforced
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Material</th>
                <th className="py-3 px-4 text-right">Total Required</th>
                <th className="py-3 px-4 text-right">Available After Safety Stock</th>
                <th className="py-3 px-4 text-right">Shortage</th>
                <th className="py-3 px-4 text-right">Recommended Purchase</th>
                <th className="py-3 px-4 text-center">Status Badge</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm font-medium">
              {agentData && agentData.materials && agentData.materials.length > 0 ? (
                agentData.materials.map((m) => {
                  const isShortage = m.status === 'Shortage';
                  const isLow = m.status === 'Low Stock';
                  const isSufficient = m.status === 'Sufficient';

                  return (
                    <tr key={m.materialId || m.name} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {m.name}
                        <span className="block text-[11px] font-normal text-slate-400 font-mono">
                          {m.code} • Supplier: {m.supplierName}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right text-slate-800">
                        {m.totalRequired.toLocaleString()} {m.unit}
                      </td>
                      <td className="py-3.5 px-4 text-right text-slate-600">
                        {m.availableUsableStock.toLocaleString()} {m.unit}
                      </td>
                      <td className="py-3.5 px-4 text-right font-semibold">
                        <span className={m.shortage > 0 ? 'text-rose-600' : 'text-slate-400'}>
                          {m.shortage > 0 ? `${m.shortage.toLocaleString()} ${m.unit}` : '0'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-black">
                        {m.purchaseRequirement > 0 ? (
                          <span className="text-rose-700 bg-rose-50 px-2 py-1 rounded-md border border-rose-200">
                            +{m.purchaseRequirement.toLocaleString()} {m.unit}
                          </span>
                        ) : (
                          <span className="text-emerald-700">None required</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {isShortage && (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
                            Shortage
                          </span>
                        )}
                        {isLow && (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                            Low Stock
                          </span>
                        )}
                        {isSufficient && (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            Sufficient
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-6 text-slate-400 text-sm">
                    No recommendations computed yet. Click "Run AI Agent" above.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================================================== */}
      {/* 9. AI SUMMARY CARD */}
      {/* ================================================== */}
      <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-400/20 text-indigo-300 flex items-center justify-center border border-indigo-400/30">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="text-lg font-bold tracking-tight text-white">
                AI Agent Recommendation
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider font-bold bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                {agentData?.runType === 'OPENAI_AGENT' ? 'OpenAI GPT-4 Intelligence' : 'Autonomous Deterministic Agent'}
              </span>
            </div>
            <p className="text-xs text-indigo-200/80 max-w-2xl mb-4">
              Synthesized natural-language briefing formulated from shop floor demand and supply chain parameters
            </p>

            <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/15 text-sm text-indigo-50 leading-relaxed font-sans whitespace-pre-line">
              {agentData?.summary || 'Run the AI Agent to generate actionable natural language procurement intelligence.'}
            </div>
          </div>

          <div className="shrink-0 flex flex-col gap-2">
            <button
              onClick={onOpenReport}
              className="px-4 py-2.5 rounded-xl bg-white text-indigo-950 hover:bg-indigo-50 font-bold text-xs shadow-lg transition-all text-center"
            >
              Export Procurement Report
            </button>
          </div>
        </div>
      </div>

      {/* ================================================== */}
      {/* 10. INVENTORY VISUALIZATION (RECHARTS) */}
      {/* ================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Required vs Available Material */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="mb-4">
            <h3 className="font-bold text-slate-900 text-sm">
              Required vs Available Usable Material
            </h3>
            <p className="text-xs text-slate-500">
              Comparison between gross production requirement and usable stock (excluding safety reserves)
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                  itemStyle={{ color: '#e2e8f0' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="Total Required" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Available Usable" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Material Shortage Chart */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="mb-4">
            <h3 className="font-bold text-slate-900 text-sm">
              Critical Material Shortage Breakdown
            </h3>
            <p className="text-xs text-slate-500">
              Exact purchase deficits required to protect minimum safety stock levels
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                  itemStyle={{ color: '#e2e8f0' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="Purchase Needed" name="Purchase Needed (Deficit)" fill="#f43f5e" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry['Purchase Needed'] > 0 ? '#ef4444' : '#10b981'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
}
