import React, { useState, useEffect } from 'react';
import { Boxes, Layers, DollarSign, PackageCheck, AlertCircle } from 'lucide-react';

export default function BOMView({ products }) {
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || 1);
  const [bom, setBom] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedProductId) {
      setLoading(true);
      fetch(`/api/products/${selectedProductId}/bom`)
        .then(res => res.json())
        .then(data => {
          setBom(data);
          setLoading(false);
        })
        .catch(err => {
          console.error('Error loading BOM:', err);
          setLoading(false);
        });
    }
  }, [selectedProductId]);

  const activeProduct = products.find(p => p.id === Number(selectedProductId));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Bill of Materials (BOM) Architecture
          </h2>
          <p className="text-sm text-slate-500">
            Component ratios, material specifications, unit costs, and current stock status
          </p>
        </div>

        {/* Product selector tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {products.map(p => (
            <button
              key={p.id}
              onClick={() => setSelectedProductId(p.id)}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                selectedProductId === p.id 
                  ? 'bg-indigo-600 text-white shadow-sm' 
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Product Summary Header Card */}
      {activeProduct && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black">
              <Boxes className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">{activeProduct.name}</h3>
              <p className="text-xs text-slate-500">{activeProduct.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold text-slate-600">
            <div className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200">
              Code: <span className="font-mono text-slate-900">{activeProduct.code}</span>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200">
              Default Batch: <span className="text-slate-900">{activeProduct.default_batch_size} units</span>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200">
              Lead Time: <span className="text-slate-900">{activeProduct.lead_time_days} days</span>
            </div>
          </div>
        </div>
      )}

      {/* BOM Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h4 className="font-bold text-slate-900 text-sm">Components Required Per 1 Finished Product</h4>
          <span className="text-xs text-slate-400 font-medium">BOM Schema v2.1</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Material Name</th>
                <th className="py-3 px-4">Material Code</th>
                <th className="py-3 px-4">Unit</th>
                <th className="py-3 px-4 text-right">Required Per Product</th>
                <th className="py-3 px-4 text-right">Unit Cost</th>
                <th className="py-3 px-4 text-right">Current Stock</th>
                <th className="py-3 px-4 text-right">Safety Stock</th>
                <th className="py-3 px-4">Supplier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm font-medium">
              {loading ? (
                <tr>
                  <td colSpan="8" className="text-center py-8 text-slate-400 text-sm">
                    Loading BOM items...
                  </td>
                </tr>
              ) : bom.length > 0 ? (
                bom.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {item.material_name}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs text-slate-500">
                      {item.material_code}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-mono text-xs">
                      {item.unit}
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-indigo-700 bg-indigo-50/20">
                      {item.quantity_per_unit} {item.unit}
                    </td>
                    <td className="py-3.5 px-4 text-right text-slate-700">
                      ${item.cost_per_unit.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-semibold text-slate-900">
                      {item.current_stock.toLocaleString()} {item.unit}
                    </td>
                    <td className="py-3.5 px-4 text-right text-slate-500">
                      {item.safety_stock.toLocaleString()} {item.unit}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-500">
                      {item.supplier_name || 'Standard Global Supply'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center py-8 text-slate-400 text-sm">
                    No BOM components defined for this product.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
