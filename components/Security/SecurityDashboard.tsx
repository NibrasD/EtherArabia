import { useState } from 'react';
import { Shield, Search, Wallet, BookOpen, Cpu, FileCode2 } from 'lucide-react';
import Scanner from './Scanner';
import WalletAudit from './WalletAudit';
import Education from './Education';
import TxInterceptor from './TxInterceptor';
import ContractAuditor from './ContractAuditor';

export default function SecurityDashboard() {
  const [activeTab, setActiveTab] = useState<'interceptor' | 'scanner' | 'audit' | 'education' | 'auditor'>('interceptor');

  return (
    <div className="min-h-screen text-slate-50 font-sans selection:bg-indigo-500/30 py-6" dir="rtl">
      {}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-gray-900/50 backdrop-blur-xl p-6 rounded-3xl border border-gray-700/50 shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-l from-white to-slate-400 bg-clip-text text-transparent">
                مركز الأمن الرقمي
              </h1>
              <p className="text-xs text-indigo-400 font-mono tracking-widest uppercase">Security Decision Layer</p>
            </div>
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-2 bg-black/40 p-1.5 rounded-2xl border border-gray-800">
            <button
              onClick={() => setActiveTab('interceptor')}
              className={`px-5 py-2.5 rounded-xl font-semibold transition-all flex items-center gap-2 text-sm ${
                activeTab === 'interceptor'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-gray-800'
              }`}
            >
              <Cpu className="w-4 h-4" />
              Tx Interceptor
            </button>
            <button
              onClick={() => setActiveTab('auditor')}
              className={`px-5 py-2.5 rounded-xl font-semibold transition-all flex items-center gap-2 text-sm ${
                activeTab === 'auditor'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-gray-800'
              }`}
            >
              <FileCode2 className="w-4 h-4" />
              Contract Auditor
            </button>
            <button
              onClick={() => setActiveTab('scanner')}
              className={`px-5 py-2.5 rounded-xl font-semibold transition-all flex items-center gap-2 text-sm ${
                activeTab === 'scanner'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-gray-800'
              }`}
            >
              <Search className="w-4 h-4" />
              Scam Scanner
            </button>
            <button
              onClick={() => setActiveTab('audit')}
              className={`px-5 py-2.5 rounded-xl font-semibold transition-all flex items-center gap-2 text-sm ${
                activeTab === 'audit'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-gray-800'
              }`}
            >
              <Wallet className="w-4 h-4" />
              Wallet Audit
            </button>
            <button
              onClick={() => setActiveTab('education')}
              className={`px-5 py-2.5 rounded-xl font-semibold transition-all flex items-center gap-2 text-sm ${
                activeTab === 'education'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-gray-800'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              الوعي الأمني
            </button>
          </nav>
        </div>
      </div>

      {}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="bg-gray-900/30 backdrop-blur-md rounded-3xl p-8 border border-gray-800/50 shadow-inner">
          {activeTab === 'interceptor' && <TxInterceptor />}
          {activeTab === 'auditor' && <ContractAuditor />}
          {activeTab === 'scanner' && <Scanner />}
          {activeTab === 'audit' && <WalletAudit />}
          {activeTab === 'education' && <Education />}
        </div>
      </main>

      {}
      <div className="md:hidden fixed bottom-6 inset-x-4 bg-gray-900/90 backdrop-blur-2xl border border-gray-700 p-2 rounded-2xl z-40 shadow-2xl flex justify-around">
          <button onClick={() => setActiveTab('interceptor')} className={`p-3 rounded-xl ${activeTab === 'interceptor' ? 'text-indigo-400 bg-indigo-400/10' : 'text-slate-500'}`}><Cpu className="w-6 h-6" /></button>
          <button onClick={() => setActiveTab('auditor')} className={`p-3 rounded-xl ${activeTab === 'auditor' ? 'text-indigo-400 bg-indigo-400/10' : 'text-slate-500'}`}><FileCode2 className="w-6 h-6" /></button>
          <button onClick={() => setActiveTab('scanner')} className={`p-3 rounded-xl ${activeTab === 'scanner' ? 'text-indigo-400 bg-indigo-400/10' : 'text-slate-500'}`}><Search className="w-6 h-6" /></button>
          <button onClick={() => setActiveTab('audit')} className={`p-3 rounded-xl ${activeTab === 'audit' ? 'text-indigo-400 bg-indigo-400/10' : 'text-slate-500'}`}><Wallet className="w-6 h-6" /></button>
          <button onClick={() => setActiveTab('education')} className={`p-3 rounded-xl ${activeTab === 'education' ? 'text-indigo-400 bg-indigo-400/10' : 'text-slate-500'}`}><BookOpen className="w-6 h-6" /></button>
      </div>
    </div>
  );
}
