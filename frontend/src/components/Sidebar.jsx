import React from 'react';
import { 
  LayoutDashboard, 
  ClipboardList, 
  Boxes, 
  Warehouse, 
  History, 
  FileSpreadsheet, 
  Cpu, 
  GraduationCap 
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'orders', label: 'Production Orders', icon: ClipboardList },
    { id: 'bom', label: 'Raw Materials & BOM', icon: Boxes },
    { id: 'inventory', label: 'Live Inventory', icon: Warehouse },
    { id: 'agent-runs', label: 'Agent Runs History', icon: History },
    { id: 'reports', label: 'Procurement Reports', icon: FileSpreadsheet },
    { id: 'architecture', label: 'Agent Architecture & Viva', icon: GraduationCap, highlight: true },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between shrink-0 min-h-[calc(100vh-4rem)]">
      <div className="p-4 space-y-6">
        <div>
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Supply Chain Agent
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  } ${item.highlight && !isActive ? 'ring-1 ring-indigo-200 text-indigo-700 bg-indigo-50/40' : ''}`}
                >
                  <Icon className={`w-4 h-4 mr-3 ${isActive ? 'text-white' : item.highlight ? 'text-indigo-600' : 'text-slate-500'}`} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Quick Viva Note Card */}
        <div className="p-3.5 rounded-xl bg-gradient-to-br from-indigo-50/80 to-blue-50/80 border border-indigo-100 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-indigo-950 mb-1">
            <Cpu className="w-3.5 h-3.5 text-indigo-600" />
            <span>Agentic AI Concept</span>
          </div>
          <p className="text-slate-600 text-[11px] leading-relaxed">
            Perceives production demand → dynamically retrieves BOM & inventory → reasons over safety buffers → synthesizes procurement actions.
          </p>
        </div>
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
          <span>College Demo Project</span>
          <span className="px-2 py-0.5 rounded bg-slate-200/70 text-slate-700 font-mono">v1.0</span>
        </div>
      </div>
    </aside>
  );
}
