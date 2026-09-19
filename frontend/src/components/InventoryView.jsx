import React, { useState, useEffect } from 'react';
import { Warehouse, Edit3, Check, RotateCcw, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function InventoryView({ onInventoryUpdated }) {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [newStock, setNewStock] = useState('');
  const [newSafety, setNewSafety] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchInventory = () => {
    setLoading(true);
    fetch('/api/inventory')
      .then(r => r.json())
      .then(d => {
        setInventory(d);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching inventory:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setNewStock(item.current_stock);
    setNewSafety(item.safety_stock);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/inventory/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          materialId: editingItem.material_id,
          currentStock: Number(newStock),
          safetyStock: Number(newSafety)
        })
      });
      if (res.ok) {
        setEditingItem(null);
        fetchInventory();
        if (onInventoryUpdated) onInventoryUpdated();
      }
    } catch (err) {
      console.error('Save inventory error:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Warehouse Inventory Management</h2>
          <p className="text-sm text-slate-500">Live stock counts, safety reserves, and warehouse storage locations</p>
        </div>
        <button
          onClick={fetchInventory}
          className="inline-flex items-center px-3.5 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 shadow-2xs"
        >
          <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
          Refresh Stock
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Material Name</th>
                <th className="py-3 px-4">Code</th>
                <th className="py-3 px-4">Unit</th>
                <th className="py-3 px-4 text-right">Current Stock</th>
                <th className="py-3 px-4 text-right">Safety Stock</th>
                <th className="py-3 px-4 text-right">Available Usable</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4 text-right">Adjust</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm font-medium">
              {inventory.map((item) => {
                const usable = Math.max(0, item.current_stock - item.safety_stock);
                const isBelowSafety = item.current_stock <= item.safety_stock;

                return (
                  <tr key={item.inventory_id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {item.material_name}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs text-slate-400">
                      {item.material_code}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs text-slate-600">
                      {item.unit}
                    </td>
                    <td className="py-3.5 px-4 text-right font-black text-slate-900">
                      {item.current_stock.toLocaleString()} {item.unit}
                    </td>
                    <td className="py-3.5 px-4 text-right text-slate-500">
                      {item.safety_stock.toLocaleString()} {item.unit}
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold">
                      <span className={isBelowSafety ? 'text-amber-600 font-black' : 'text-emerald-700'}>
                        {usable.toLocaleString()} {item.unit}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-500">
                      {item.warehouse_location}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="inline-flex items-center px-2.5 py-1 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                      >
                        <Edit3 className="w-3 h-3 mr-1" />
                        Edit Stock
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Edit Stock Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Adjust Material Stock</h3>
            <p className="text-xs text-slate-500 mb-4">
              Update inventory levels for <strong className="text-slate-800">{editingItem.material_name}</strong> to test agent reasoning.
            </p>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Current Stock ({editingItem.unit})
                </label>
                <input
                  type="number"
                  min="0"
                  value={newStock}
                  onChange={(e) => setNewStock(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Safety Stock Buffer ({editingItem.unit})
                </label>
                <input
                  type="number"
                  min="0"
                  value={newSafety}
                  onChange={(e) => setNewSafety(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 font-medium"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 text-xs font-semibold rounded-lg text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 text-xs font-bold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 shadow-md"
                >
                  {saving ? 'Updating...' : 'Save & Recalculate'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
