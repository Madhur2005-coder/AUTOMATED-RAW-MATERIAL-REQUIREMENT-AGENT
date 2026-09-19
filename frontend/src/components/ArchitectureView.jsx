import React from 'react';
import { 
  Cpu, 
  ArrowDown, 
  ArrowRight, 
  Boxes, 
  Warehouse, 
  Calculator, 
  AlertTriangle, 
  ShoppingCart, 
  FileText, 
  CheckCircle2, 
  GraduationCap, 
  HelpCircle,
  Lightbulb
} from 'lucide-react';

export default function ArchitectureView() {
  const pipelineSteps = [
    { title: 'USER INPUT', subtitle: 'Product & Target Quantity', icon: Cpu, color: 'bg-blue-500' },
    { title: 'PLANNING AGENT', subtitle: 'Task Decomposition & Goal Definition', icon: Cpu, color: 'bg-indigo-600' },
    { title: 'BOM ANALYZER', subtitle: 'Component Architecture & Ratio Retrieval', icon: Boxes, color: 'bg-indigo-700' },
    { title: 'INVENTORY CHECKER', subtitle: 'Warehouse Stock & Safety Stock Audit', icon: Warehouse, color: 'bg-blue-600' },
    { title: 'REQUIREMENT CALCULATOR', subtitle: 'Gross Demand = Qty × Unit Ratio', icon: Calculator, color: 'bg-violet-600' },
    { title: 'SHORTAGE DETECTOR', subtitle: 'Usable Buffer vs. Demand Analysis', icon: AlertTriangle, color: 'bg-amber-600' },
    { title: 'PROCUREMENT RECOMMENDER', subtitle: 'Supplier Batch Formulation & Costs', icon: ShoppingCart, color: 'bg-rose-600' },
    { title: 'FINAL REPORT', subtitle: 'Chain-of-Thought Log & AI Narrative', icon: FileText, color: 'bg-emerald-600' },
  ];

  const vivaQuestions = [
    {
      q: 'Why is this considered Agentic AI instead of a simple static calculator?',
      a: 'A static calculator only computes a single formula (e.g. A × B). An AI Agent operates in an autonomous loop: Perception (reading user orders) → Planning (determining required sub-tasks) → Tool Invocation (querying BOM & inventory databases) → Reasoning & Decision Making (evaluating safety stock constraints, detecting deficits) → Action/Recommendation (formulating supplier orders) → Self-auditing Decision Log.'
    },
    {
      q: 'What is the role of Safety Stock in this agent\'s reasoning?',
      a: 'Safety stock is the emergency buffer that must NOT be depleted by standard production. The agent computes "Available Usable Stock = Current Stock - Safety Stock". If Current Stock is 700 kg and Safety Stock is 100 kg, only 600 kg is usable. Even if there are 700 kg physically in the warehouse, the agent protects the 100 kg buffer to safeguard against supply chain delays.'
    },
    {
      q: 'What happens if there is no OpenAI API key or no internet connection?',
      a: 'The application contains a dual-agent engine. If an OpenAI API key is detected, it utilizes GPT-4o-mini for natural language synthesis. If offline or no key is provided, the deterministic rule-based agent executes the exact same 7-step reasoning cycle, populates the decision log, and generates the procurement plan without failure.'
    },
    {
      q: 'What are the main mathematical formulas used by the agent?',
      a: '1. Total Required = Production Quantity × Required Per Product\n2. Available Usable Stock = Current Stock - Safety Stock\n3. Purchase Requirement = max(0, Total Required - Available Usable Stock)'
    }
  ];

  return (
    <div className="space-y-8 pb-12">
      
      {/* Title */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
            <GraduationCap className="w-5 h-5" />
          </span>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Agent Architecture & College Viva Presentation Guide
          </h2>
        </div>
        <p className="text-sm text-slate-500">
          Theoretical foundation, perception-action pipeline, and defense talking points for viva evaluation
        </p>
      </div>

      {/* 16. AGENTIC AI EXPLANATION */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-amber-500" />
          How the Agent Works
        </h3>
        
        <p className="text-sm text-slate-700 leading-relaxed font-sans bg-slate-50 p-4 rounded-xl border border-slate-200">
          "The Automated Raw Material Requirement Agent receives a production requirement, analyzes the Bill of Materials, checks inventory, calculates material shortages, and generates procurement recommendations."
        </p>

        {/* High-level cycle */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs font-bold">
          <span className="px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200">Input</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200">Plan</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200">Analyze</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200">Decide</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">Recommend</span>
        </div>
      </div>

      {/* 11. AGENT ARCHITECTURE PIPELINE */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 mb-2">
          Multi-Step Agent Reasoning & Action Pipeline
        </h3>
        <p className="text-xs text-slate-500 mb-6">
          The agent coordinates multiple discrete analytical tools to generate a unified, verified procurement decision:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {pipelineSteps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div 
                key={idx} 
                className="relative bg-slate-50/70 border border-slate-200 p-4 rounded-xl flex flex-col justify-between hover:border-indigo-300 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="w-6 h-6 rounded-md bg-slate-200 text-slate-700 font-mono text-xs font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <div className={`w-8 h-8 rounded-lg ${step.color} text-white flex items-center justify-center shadow-xs`}>
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs tracking-tight">{step.title}</h4>
                  <p className="text-[11px] text-slate-500 mt-1">{step.subtitle}</p>
                </div>

                {idx < pipelineSteps.length - 1 && (
                  <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-slate-300">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* College Viva Questions and Answers */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-indigo-600" />
          College Viva Presentation Q&A Cheat Sheet
        </h3>

        <div className="space-y-4">
          {vivaQuestions.map((item, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <h4 className="text-xs font-bold text-slate-900 mb-1 flex items-start gap-2">
                <span className="text-indigo-600 font-mono">Q{idx + 1}:</span>
                <span>{item.q}</span>
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed font-sans pl-6 whitespace-pre-line">
                {item.a}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
