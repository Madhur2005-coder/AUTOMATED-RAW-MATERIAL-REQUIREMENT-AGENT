import React, { useState } from 'react';
import { ClipboardList, Plus, Calendar, Package, ArrowRight, Play, CheckCircle2 } from 'lucide-react';

export default function OrdersView({ orders, products, onRunAgentForOrder, onCreateOrder }) {
  const [showModal, setShowModal] = useState(false);
  const [productId, setProductId] = useState(products[0]?.id || 1);
  const [quantity, setQuantity] = useState(250);
  const [targetDate, setTargetDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split('T')[0];
  });

  const handleCreate = (e) => {
    e.preventDefault();
    onCreateOrder({ productId: Number(productId), quantity: Number(quantity), targetDate });
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Production Orders</h2>
          <p className="text-sm text-slate-500">Manage manufacturing orders and invoke the AI Agent to audit material feasibility</p>
        </div>
        <button
          id="btn-create-order-modal"
          onClick={() => setShowModal(true)}
          className="inline-flex items-center px-4 py-2.5 rounded-xl font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-500/20 transition-all"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Create Production Order
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Order #</th>
                <th className="py-3 px-4">Product Name</th>
                <th className="py-3 px-4 text-right">Target Quantity</th>
                <th className="py-3 px-4">Scheduled Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Agent Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm font-medium">
              {orders && orders.length > 0 ? (
                orders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-indigo-700">
                      {o.order_number}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      {o.product_name}
                      <span className="block text-xs font-normal text-slate-400 font-mono">{o.product_code}</span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-slate-800">
                      {o.quantity.toLocaleString()} units
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 text-xs">
                      {o.target_date}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {o.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => onRunAgentForOrder(o)}
                        className="inline-flex items-center px-3 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-all active:scale-95"
                      >
                        <Play className="w-3 h-3 mr-1 fill-white" />
                        Run AI Agent
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-slate-400 text-sm">
                    No production orders found. Create a new order to begin.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Order Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-1">New Production Order</h3>
            <p className="text-xs text-slate-500 mb-4">Create an assembly order to run material planning analytics</p>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Product
                </label>
                <select
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 font-medium"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.code})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Production Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Target Production Date
                </label>
                <input
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 font-medium"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-lg text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20"
                >
                  Create & Save Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
