import { useState } from 'react';
import { ShieldAlert, ShieldCheck, AlertTriangle, Activity, Database, Cpu, ArrowRight, XCircle, CheckCircle2 } from 'lucide-react';

interface AnalysisResult {
  score: number;
  decision: 'SAFE' | 'WARNING' | 'DANGEROUS';
  humanExplanation: string;
  contextMatch: string;
  stateChanges: { asset: string; amount: string; type: 'out' | 'in' | 'approve' }[];
  suggestedActions: string[];
}

export default function TxInterceptor() {
  const [txPayload, setTxPayload] = useState('{\n  "to": "0x1a2b3c4d5e6f7g8h9i0j",\n  "value": "0",\n  "data": "0x095ea7b30000000000000000000000001111111111111111111111111111111111111111ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",\n  "method": "approve(address spender, uint256 amount)"\n}');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleAnalyze = async () => {
    if (!txPayload.trim()) return;
    setIsAnalyzing(true);
    setResult(null);

    
    setTimeout(() => {
        setResult({
            score: 85,
            decision: 'DANGEROUS',
            humanExplanation: "هذه المعاملة تطلب صلاحية 'غير محدودة' (Unlimited Approval) لمحفظة غير معروفة لسحب عملاتك. هذا النمط شائع جداً في هجمات سرقة المحافظ (Wallet Drainers).",
            contextMatch: "تطابق بنسبة 95% مع نمط هجمات Monkey Drainer الشهيرة في عام 2023.",
            stateChanges: [
                { asset: "USDT", amount: "UNLIMITED", type: "approve" }
            ],
            suggestedActions: [
                "ارفض هذه المعاملة فوراً",
                "لا تقم بتوقيع أي رسائل من هذا الموقع",
                "تحقق من الصلاحيات الحالية عبر Revoke.cash"
            ]
        });
        setIsAnalyzing(false);
    }, 2500);
  };

  const getDecisionColor = (decision: string) => {
    switch (decision) {
      case 'DANGEROUS': return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'WARNING': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'SAFE': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      default: return 'text-slate-500 bg-slate-500/10 border-slate-500/20';
    }
  };

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8" dir="ltr">
      {}
      <div className="space-y-6">
        <div className="text-right" dir="rtl">
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2 justify-end">
            محرك القرار (Decision Engine)
            <Cpu className="w-6 h-6 text-indigo-400" />
          </h2>
          <p className="text-slate-400 text-sm font-sans">
            قم بلصق بيانات المعاملة (Payload) لمحاكاتها واكتشاف أي أنماط احتيال معروفة قبل التنفيذ.
          </p>
        </div>

        <div className="bg-[#0d1117] rounded-xl border border-slate-800 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800 bg-slate-900/50">
            <span className="text-xs font-mono text-slate-400">tx_payload.json</span>
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/20"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/20"></div>
            </div>
          </div>
          <textarea
            value={txPayload}
            onChange={(e) => setTxPayload(e.target.value)}
            className="w-full h-64 bg-transparent text-emerald-400 font-mono text-sm p-4 focus:outline-none resize-none"
            spellCheck="false"
          />
        </div>

        <button
          onClick={handleAnalyze}
          disabled={isAnalyzing}
          className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 font-sans"
        >
          {isAnalyzing ? (
            <>
              <Activity className="w-5 h-5 animate-pulse" />
              جاري المحاكاة وتحليل البيانات...
            </>
          ) : (
            <>
              <Database className="w-5 h-5" />
              محاكاة وتحليل المعاملة
            </>
          )}
        </button>

        {}
        <div className="grid grid-cols-3 gap-4 pt-4">
          <div className={`p-3 rounded-lg border ${isAnalyzing ? 'bg-indigo-500/10 border-indigo-500/30' : 'bg-slate-800/50 border-slate-700'}`}>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1 font-sans">Data Layer</div>
            <div className={`text-sm font-mono ${isAnalyzing ? 'text-indigo-400 animate-pulse' : 'text-slate-500'}`}>
              {isAnalyzing ? 'Fetching ABI...' : 'Idle'}
            </div>
          </div>
          <div className={`p-3 rounded-lg border ${isAnalyzing ? 'bg-indigo-500/10 border-indigo-500/30' : 'bg-slate-800/50 border-slate-700'}`}>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1 font-sans">Analysis Engine</div>
            <div className={`text-sm font-mono ${isAnalyzing ? 'text-indigo-400 animate-pulse' : 'text-slate-500'}`}>
              {isAnalyzing ? 'Forking State...' : 'Idle'}
            </div>
          </div>
          <div className={`p-3 rounded-lg border ${isAnalyzing ? 'bg-indigo-500/10 border-indigo-500/30' : 'bg-slate-800/50 border-slate-700'}`}>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1 font-sans">Context Engine</div>
            <div className={`text-sm font-mono ${isAnalyzing ? 'text-indigo-400 animate-pulse' : 'text-slate-500'}`}>
              {isAnalyzing ? 'Vector Search...' : 'Idle'}
            </div>
          </div>
        </div>
      </div>

      {}
      <div className="bg-slate-800/30 rounded-2xl border border-slate-700/50 p-6 min-h-[600px] flex flex-col">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2 justify-end text-right font-sans" dir="rtl">
          نتيجة تحليل Security
          <ShieldCheck className="w-5 h-5 text-slate-400" />
        </h2>

        {!result && !isAnalyzing && (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-500 space-y-4 font-sans">
            <ShieldAlert className="w-16 h-16 opacity-20" />
            <p>في انتظار بيانات المعاملة للبدء في التحليل...</p>
          </div>
        )}

        {isAnalyzing && (
          <div className="flex-1 flex flex-col items-center justify-center space-y-6">
            <div className="relative w-24 h-24">
              <svg className="animate-spin w-full h-full text-indigo-500/20" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <Activity className="absolute inset-0 m-auto w-8 h-8 text-indigo-400 animate-pulse" />
            </div>
            <div className="text-center space-y-2 font-sans">
              <p className="text-indigo-400 font-mono text-sm">Aggregating Signals...</p>
              <p className="text-slate-500 text-xs">Translating state changes via AI Layer</p>
            </div>
          </div>
        )}

        {result && !isAnalyzing && (
          <div className="space-y-6 flex-1">
            {}
            <div className={`p-6 rounded-xl border flex items-center justify-between ${getDecisionColor(result.decision)} font-sans`}>
              <div className="text-right" dir="rtl">
                <div className="text-sm font-bold tracking-widest opacity-80 mb-1">القرار الاختياري</div>
                <div className="text-3xl font-black tracking-tight">{result.decision === 'DANGEROUS' ? 'خطر' : result.decision === 'WARNING' ? 'تحذير' : 'آمن'}</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold tracking-widest opacity-80 mb-1">نتيجة الخطورة</div>
                <div className="text-4xl font-black font-mono">{result.score}<span className="text-lg opacity-50">/100</span></div>
              </div>
            </div>

            {}
            <div className="space-y-2 text-right" dir="rtl">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-sans">ترجمة الذكاء الاصطناعي (AI Translation)</h3>
              <p className="text-slate-200 text-lg leading-relaxed bg-slate-900/50 p-4 rounded-xl border border-slate-800 font-sans">
                {result.humanExplanation}
              </p>
            </div>

            {}
            <div className="space-y-2 text-right" dir="rtl">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 justify-end font-sans">
                تطابق المحرك السياقي (Vector Match)
                <Database className="w-3 h-3" />
              </h3>
              <div className="bg-indigo-500/10 border border-indigo-500/20 p-4 rounded-xl text-indigo-200 text-sm flex items-start gap-3 justify-end text-right">
                <p className="flex-1 font-sans">{result.contextMatch}</p>
                <AlertTriangle className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
              </div>
            </div>

            {}
            <div className="space-y-2 text-right" dir="rtl">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-sans">محاكاة تغييرات الحالة (State Changes)</h3>
              <div className="space-y-2">
                {result.stateChanges.map((change, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-slate-900/50 p-3 rounded-lg border border-slate-800 font-mono text-sm">
                    <span className="text-slate-400">{change.asset}</span>
                    <div className="flex items-center gap-2">
                      {change.type === 'out' && <span className="text-red-400">-{change.amount}</span>}
                      {change.type === 'in' && <span className="text-emerald-400">+{change.amount}</span>}
                      {change.type === 'approve' && <span className="text-yellow-400">APPROVE {change.amount}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {}
            <div className="mt-auto pt-6 border-t border-slate-800 space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider text-right font-sans">توجيهات الدفاع (Action Layer)</h3>
              <div className="grid grid-cols-2 gap-3 font-sans">
                {result.decision === 'DANGEROUS' || result.decision === 'WARNING' ? (
                  <>
                    <button className="py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors">
                      <XCircle className="w-5 h-5" />
                      حظر المعاملة
                    </button>
                    <button className="py-3 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors">
                      <ShieldAlert className="w-5 h-5" />
                      إلغاء التراخيص
                    </button>
                  </>
                ) : (
                  <button className="col-span-2 py-3 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 border border-emerald-500/20 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors">
                    <CheckCircle2 className="w-5 h-5" />
                    المتابعة بأمان
                  </button>
                )}
              </div>
              {result.suggestedActions.length > 0 && (
                <ul className="text-xs text-slate-500 space-y-1 pr-2 text-right font-sans" dir="rtl">
                  {result.suggestedActions.map((action, idx) => (
                    <li key={idx} className="flex items-center gap-2 justify-end">
                      {action} <ArrowRight className="w-3 h-3 rotate-180" />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
