import React from 'react';
import { Bot, Play, RotateCcw, Sparkles, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function Navbar({ onRunDemo, onResetDemo, isRunningAgent, systemStatus }) {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand & Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-blue-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <Bot className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2.5">
                <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                  Automated Raw Material Requirement Agent
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 agent-pulse-ring"></span>
                  AI Agent Online
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden md:block">
                AI-powered production planning and procurement assistant • Agentic AI Demo
              </p>
            </div>
          </div>

          {/* Actions & Demo Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              id="btn-reset-demo"
              onClick={onResetDemo}
              title="Reset sample benchmark database"
              className="inline-flex items-center px-2.5 py-1.5 border border-slate-200 text-xs font-medium rounded-lg text-slate-600 bg-white hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-2xs"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1 text-slate-400" />
              <span className="hidden sm:inline">Reset Seed</span>
            </button>

            <button
              id="btn-nav-demo-mode"
              onClick={onRunDemo}
              disabled={isRunningAgent}
              className="inline-flex items-center px-3.5 py-1.5 border border-indigo-200 text-xs font-semibold rounded-lg text-indigo-700 bg-indigo-50/80 hover:bg-indigo-100/80 active:scale-95 transition-all shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5 mr-1.5 text-indigo-600" />
              Demo Mode (Office Chair 500)
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
