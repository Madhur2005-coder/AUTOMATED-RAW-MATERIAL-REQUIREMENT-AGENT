import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import OrdersView from './components/OrdersView';
import BOMView from './components/BOMView';
import InventoryView from './components/InventoryView';
import AgentRunsView from './components/AgentRunsView';
import ArchitectureView from './components/ArchitectureView';
import ReportModal from './components/ReportModal';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(500);
  const [targetDate, setTargetDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 10);
    return d.toISOString().split('T')[0];
  });
  const [currentBOM, setCurrentBOM] = useState([]);
  const [orders, setOrders] = useState([]);
  const [agentData, setAgentData] = useState(null);
  
  // Animation & Execution State
  const [isRunningAgent, setIsRunningAgent] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(6);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Show temporary toast notification
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Fetch initial products and orders
  const loadInitialData = async () => {
    try {
      const [prodRes, ordRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/orders')
      ]);
      const prodData = await prodRes.json();
      const ordData = await ordRes.json();

      setProducts(prodData);
      setOrders(ordData);

      // Default to Office Chair
      const chair = prodData.find(p => p.name === 'Office Chair') || prodData[0];
      if (chair) {
        setSelectedProduct(chair);
        setQuantity(chair.default_batch_size || 500);
      }
    } catch (err) {
      console.error('Failed to load initial data:', err);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  // Whenever selectedProduct changes, load its BOM
  useEffect(() => {
    if (selectedProduct) {
      fetch(`/api/products/${selectedProduct.id}/bom`)
        .then(r => r.json())
        .then(bom => setCurrentBOM(bom))
        .catch(err => console.error('Error fetching BOM:', err));
    }
  }, [selectedProduct]);

  // Execute Agent Reasoning with step-by-step UI animation
  const executeAgentWorkflow = async (prod = selectedProduct, qty = quantity, tDate = targetDate, orderNum = null) => {
    if (!prod || isRunningAgent) return;

    setIsRunningAgent(true);
    setCurrentStepIndex(0);

    // Animate through steps 0 to 6 with realistic intervals
    for (let i = 0; i <= 6; i++) {
      setCurrentStepIndex(i);
      await new Promise(resolve => setTimeout(resolve, 380));
    }

    try {
      const res = await fetch('/api/agent/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: prod.id,
          productName: prod.name,
          quantity: Number(qty),
          targetDate: tDate,
          orderNumber: orderNum
        })
      });

      const data = await res.json();
      if (data.success) {
        setAgentData(data);
        showToast('✓ AI Agent Analysis Complete: Decision log & procurement plan generated');
      } else {
        showToast('Error during agent execution: ' + data.error);
      }
    } catch (err) {
      console.error('Agent execution API error:', err);
      showToast('Agent communication error.');
    } finally {
      setIsRunningAgent(false);
    }
  };

  // Run automatically once on first load for Office Chair 500
  useEffect(() => {
    if (products.length > 0 && selectedProduct && !agentData) {
      executeAgentWorkflow(selectedProduct, quantity, targetDate);
    }
  }, [products, selectedProduct]);

  // 14. DEMO MODE BUTTON HANDLER
  const handleDemoMode = async () => {
    setActiveTab('dashboard');
    const chair = products.find(p => p.name === 'Office Chair') || products[0];
    if (chair) {
      setSelectedProduct(chair);
      setQuantity(500);
      const d = new Date();
      d.setDate(d.getDate() + 10);
      const dateStr = d.toISOString().split('T')[0];
      setTargetDate(dateStr);
      showToast('⚡ Demo Mode Initialized: 500 Office Chairs loaded');
      await executeAgentWorkflow(chair, 500, dateStr, 'DEMO-PO-500');
    }
  };

  // Reset benchmark data
  const handleResetBenchmark = async () => {
    try {
      const res = await fetch('/api/demo-reset', { method: 'POST' });
      if (res.ok) {
        showToast('Database reset to standard benchmark inventory values');
        loadInitialData();
        if (selectedProduct) {
          executeAgentWorkflow(selectedProduct, quantity, targetDate);
        }
      }
    } catch (err) {
      console.error('Reset error:', err);
    }
  };

  // Create Order handler
  const handleCreateOrder = async (orderPayload) => {
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Production Order ${data.orderNumber} created`);
        const ordRes = await fetch('/api/orders');
        const updatedOrders = await ordRes.json();
        setOrders(updatedOrders);
      }
    } catch (err) {
      console.error('Create order error:', err);
    }
  };

  // Run agent for specific order
  const handleRunAgentForOrder = (order) => {
    const prod = products.find(p => p.id === order.product_id) || { id: order.product_id, name: order.product_name };
    setSelectedProduct(prod);
    setQuantity(order.quantity);
    setTargetDate(order.target_date);
    setActiveTab('dashboard');
    executeAgentWorkflow(prod, order.quantity, order.target_date, order.order_number);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      
      {/* Top Navbar */}
      <Navbar 
        onRunDemo={handleDemoMode}
        onResetDemo={handleResetBenchmark}
        isRunningAgent={isRunningAgent}
      />

      {/* Main Container */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        
        {/* Left Sidebar */}
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
        />

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
          
          {activeTab === 'dashboard' && (
            <Dashboard 
              products={products}
              selectedProduct={selectedProduct}
              setSelectedProduct={setSelectedProduct}
              quantity={quantity}
              setQuantity={setQuantity}
              targetDate={targetDate}
              setTargetDate={setTargetDate}
              currentBOM={currentBOM}
              agentData={agentData}
              isRunningAgent={isRunningAgent}
              currentStepIndex={currentStepIndex}
              onRunAgent={() => executeAgentWorkflow(selectedProduct, quantity, targetDate)}
              onOpenReport={() => setIsReportOpen(true)}
            />
          )}

          {activeTab === 'orders' && (
            <OrdersView 
              orders={orders}
              products={products}
              onRunAgentForOrder={handleRunAgentForOrder}
              onCreateOrder={handleCreateOrder}
            />
          )}

          {activeTab === 'bom' && (
            <BOMView 
              products={products}
            />
          )}

          {activeTab === 'inventory' && (
            <InventoryView 
              onInventoryUpdated={() => {
                if (selectedProduct) {
                  fetch(`/api/products/${selectedProduct.id}/bom`)
                    .then(r => r.json())
                    .then(b => setCurrentBOM(b));
                  executeAgentWorkflow(selectedProduct, quantity, targetDate);
                }
              }}
            />
          )}

          {activeTab === 'agent-runs' && (
            <AgentRunsView />
          )}

          {activeTab === 'reports' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Procurement Reports</h2>
                  <p className="text-sm text-slate-500">Official material requirement and supplier purchase order documentation</p>
                </div>
                <button
                  onClick={() => setIsReportOpen(true)}
                  className="px-4 py-2 text-xs font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm"
                >
                  View Current Procurement Report
                </button>
              </div>

              <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
                  📄
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Official Report Ready</h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                    The AI Agent has computed the exact procurement requirements for {quantity} units of {selectedProduct?.name}.
                  </p>
                </div>
                <button
                  onClick={() => setIsReportOpen(true)}
                  className="inline-flex items-center px-4 py-2 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-all"
                >
                  Open Printable Report Modal
                </button>
              </div>
            </div>
          )}

          {activeTab === 'architecture' && (
            <ArchitectureView />
          )}

        </main>

      </div>

      {/* Printable Report Modal */}
      <ReportModal 
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        agentData={agentData}
        product={selectedProduct}
        quantity={quantity}
        targetDate={targetDate}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-medium px-4 py-2.5 rounded-xl shadow-xl border border-slate-700 flex items-center gap-2 animate-bounce">
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
}
