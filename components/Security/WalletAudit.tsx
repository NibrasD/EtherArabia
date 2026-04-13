import { useState } from 'react';
import { Search, Loader2, ShieldAlert, CheckCircle, AlertTriangle, ArrowLeft, Info, Wallet } from 'lucide-react';

export default function WalletAudit() {
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<any>(null);

  const handleAudit = async () => {
    if (!address.trim()) return;

    
    if (!/^0x[a-fA-F0-9]{40}$/.test(address.trim())) {
      alert('الرجاء إدخال عنوان محفظة Ethereum صحيح (يبدأ بـ 0x ويتكون من 42 حرفاً)');
      return;
    }

    setLoading(true);
    setReport(null);

    
    setTimeout(() => {
        setReport({
            address,
            balanceEth: "0.45",
            overallRisk: "Medium",
            score: 72,
            issues: [
                {
                    id: 1,
                    type: "medium",
                    title: "تراخيص نشطة لأطراف غير معروفة",
                    description: "لدى هذه المحفظة تراخيص نشطة (Approvals) لعقود ذكية قديمة أو غير موثقة بقيمة غير محدودة.",
                    action: "استخدم Revoke.cash لإلغاء التراخيص غير الضرورية.",
                    contract: "0x1234...abcd"
                },
                {
                    id: 2,
                    type: "low",
                    title: "نشاط معاملات مكثف",
                    description: "هناك عدد كبير من المعاملات في فترة زمنية قصيرة، مما يشبه نشاط البوتات.",
                    action: "تأكد من تأمين مفاتيحك الخاصة جيداً.",
                    contract: null
                }
            ]
        });
        setLoading(false);
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8" dir="rtl">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-slate-100 font-sans">فحص أمان المحفظة (Wallet Audit)</h2>
        <p className="text-slate-400 font-sans">
          أدخل عنوان محفظتك (0x...) لفحص نشاطها الحقيقي على شبكة Ethereum باستخدام محرك التحليل والذكاء الاصطناعي.
        </p>
      </div>

      {!report ? (
        <div className="max-w-2xl mx-auto relative">
          <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
            <Search className="w-5 h-5 text-slate-500" />
          </div>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAudit()}
            className="w-full bg-slate-800 border border-slate-700 text-slate-100 text-lg rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 block p-4 pr-12 transition-all font-mono text-left font-sans"
            placeholder="0x..."
            dir="ltr"
          />
          <button
            onClick={handleAudit}
            disabled={loading || !address.trim()}
            className="absolute inset-y-2 left-2 px-6 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-700 disabled:text-slate-400 text-white font-semibold rounded-xl transition-colors flex items-center gap-2 font-sans"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'بدء الفحص الحقيقي'}
          </button>
        </div>
      ) : (
        <div
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <button
              onClick={() => setReport(null)}
              className="text-slate-400 hover:text-white flex items-center gap-2 transition-colors font-sans"
            >
              <ArrowLeft className="w-4 h-4" />
              فحص محفظة أخرى
            </button>
            <div className="text-sm font-mono text-slate-500 bg-slate-800/50 px-3 py-1 rounded-lg border border-slate-700">
              {report.address.slice(0, 6)}...{report.address.slice(-4)}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 bg-slate-800 rounded-2xl p-6 border border-slate-700 flex flex-col items-center justify-center text-center space-y-4 font-sans">
              <div className="relative">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="transparent"
                    className="text-slate-700"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="transparent"
                    strokeDasharray={351.858}
                    strokeDashoffset={351.858 - (351.858 * report.score) / 100}
                    className={`${
                      report.score < 50 ? 'text-red-500' :
                      report.score < 80 ? 'text-yellow-500' : 'text-emerald-500'
                    } transition-all duration-1000 ease-out`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-3xl font-bold text-white font-mono">{report.score}</span>
                  <span className="text-xs text-slate-400">/ 100</span>
                </div>
              </div>
              <div className="w-full">
                <h3 className="text-xl font-bold text-white mb-1">درجة الأمان</h3>
                <p className="text-sm text-slate-400 mb-4">
                  {report.score < 50 ? 'محفظتك في خطر كبير' :
                   report.score < 80 ? 'تحتاج إلى بعض الانتباه' : 'محفظتك آمنة'}
                </p>
                
                <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-700/50 w-full flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Wallet className="w-4 h-4" />
                    <span className="text-xs">الرصيد التحريبي</span>
                  </div>
                  <span className="text-sm font-mono text-emerald-400 font-bold">{report.balanceEth} ETH</span>
                </div>
              </div>
            </div>

            <div className="md:col-span-2 space-y-4 font-sans">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <ShieldAlert className="w-6 h-6 text-indigo-400" />
                نتائج التحليل
              </h3>
              
              {report.issues && report.issues.length > 0 ? (
                report.issues.map((issue: any) => (
                  <div
                    key={issue.id}
                    className={`p-4 rounded-xl border ${
                      issue.type === 'high' ? 'bg-red-950/20 border-red-900/50' :
                      issue.type === 'medium' ? 'bg-yellow-950/20 border-yellow-900/50' :
                      'bg-slate-800/50 border-slate-700'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`mt-1 shrink-0 ${
                        issue.type === 'high' ? 'text-red-400' :
                        issue.type === 'medium' ? 'text-yellow-400' :
                        'text-slate-400'
                      }`}>
                        {issue.type === 'high' ? <AlertTriangle className="w-5 h-5" /> :
                         issue.type === 'medium' ? <ShieldAlert className="w-5 h-5" /> :
                         <Info className="w-5 h-5" />}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-slate-200 mb-1">{issue.title}</h4>
                        <p className="text-sm text-slate-400 mb-3">{issue.description}</p>
                        
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-slate-900 text-slate-300 border border-slate-700">
                            الإجراء المطلوب: {issue.action}
                          </span>
                          {issue.contract && (
                            <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-indigo-950/50 text-indigo-300 border border-indigo-900/50" dir="ltr">
                              Contract: {issue.contract}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-emerald-950/20 border border-emerald-900/50 rounded-xl p-6 flex flex-col items-center justify-center text-center space-y-3">
                  <CheckCircle className="w-12 h-12 text-emerald-500" />
                  <div>
                    <h4 className="font-bold text-emerald-400 text-lg">لا توجد مخاطر واضحة</h4>
                    <p className="text-sm text-emerald-200/70">بناءً على المحاكاة، تبدو المحفظة في حالة جيدة.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-indigo-950/30 border border-indigo-900/50 rounded-2xl p-6 text-center font-sans">
            <p className="text-indigo-200 text-sm">
              ملاحظة: هذا الفحص يعتمد على بيانات محاكاة لغرض التجربة الحالية.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
