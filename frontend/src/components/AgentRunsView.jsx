import React, { useState, useEffect } from 'react';
import { History, Cpu, CheckCircle2, ChevronDown, ChevronUp, Bot, FileText } from 'lucide-react';

export default function AgentRunsView() {
  const [runs, setRuns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch('/api/agent/runs')
      .then(r => r.json())
      .then(data => {
        setRuns(data);
        if (data.length > 0) setExpandedId(data[0].id);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching runs:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Agent Execution History</h2>
          <p className="text-sm text-slate-500">Persistent SQLite audit log of past reasoning cycles, decision logs, and procurement decisions</p>
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-400 text-sm">
            Loading agent history logs...
          </div>
        ) : runs.length > 0 ? (
          runs.map((run) => {
            const isExpanded = expandedId === run.id;
            return (
              <div 
                key={run.id}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden transition-all"
              >
                <div 
                  onClick={() => setExpandedId(isExpanded ? null : run.id)}
                  className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50/70 transition-colors"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black">
                      <Cpu className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-900 text-base">
                          {run.product_name} ({run.quantity.toLocaleString()} units)
                        </h4>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-50 text-indigo-700">
                          {run.run_type}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Run ID #{run.id} • Target Date: {run.target_date} • {new Date(run.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {run.status}
                    </span>
                    {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                  </div>
                </div>

                {isExpanded && (
                  <div className="p-5 border-t border-slate-100 bg-slate-50/50 space-y-4">
                    {/* Summary */}
                    <div className="bg-white p-4 rounded-xl border border-slate-200">
                      <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
                        <Bot className="w-3.5 h-3.5 text-indigo-600" />
                        AI Agent Generated Narrative
                      </h5>
                      <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line font-sans">
                        {run.summary_text}
                      </p>
                    </div>

                    {/* Decision Log Snippet */}
                    <div className="bg-white p-4 rounded-xl border border-slate-200">
                      <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                        Decision Log Stream ({run.decisionLog?.length || 0} entries)
                      </h5>
                      <div className="space-y-1.5 max-h-48 overflow-y-auto">
                        {run.decisionLog?.map((l, i) => (
                          <div key={i} className="text-xs flex items-center gap-2 text-slate-700 py-1 border-b border-slate-50">
                            <span className={l.type === 'warning' ? 'text-rose-600 font-bold' : 'text-emerald-600 font-bold'}>
                              {l.type === 'warning' ? '⚠' : '✓'}
                            </span>
                            <span>{l.message}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-400 text-sm">
            No agent runs logged yet. Go to Dashboard and click "Run AI Agent".
          </div>
        )}
      </div>
    </div>
  );
}
