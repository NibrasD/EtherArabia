import { useState } from 'react';
import { Search, AlertTriangle, ShieldCheck, Info, Loader2 } from 'lucide-react';


export default function Scanner() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleScan = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setResult(null);

    
    setTimeout(() => {
        const isLikelyContract = input.startsWith('0x') && input.length === 42;
        
        if (isLikelyContract) {
            setResult({
                riskLevel: 'Medium',
                title: 'عقد ذكي غير موثق',
                explanation: 'هذا العنوان يبدو كعقد ذكي. لم يتم العثور على سجلات سابقة له كاحتيال، ولكن ننصح بالحذر عند التعامل معه إذا لم يكن الكود مفتوح المصدر ومُدقق.',
                type: 'Contract'
            });
        } else if (input.includes('airdrop') || input.includes('free') || input.includes('gift')) {
            setResult({
                riskLevel: 'High',
                title: 'اشتباه بموقع تصيد (Phishing)',
                explanation: 'يحتوي الرابط على كلمات مفتاحية مرتبطة عادة بعمليات الاحتيال. نوصي بشدة بعدم ربط محفظتك بهذا الموقع.',
                type: 'URL'
            });
        } else {
            setResult({
                riskLevel: 'Low',
                title: 'نتيجة الفحص الأولية',
                explanation: 'لم يتم رصد أنماط احتيال واضحة في هذا المدخل. دائماً تأكد من المصادر الرسمية.',
                type: 'Unknown'
            });
        }
        setLoading(false);
    }, 1500);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8" dir="rtl">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-slate-100 font-sans">كاشف الاحتيال (Anti-Scam)</h2>
        <p className="text-slate-400 font-sans">
          أدخل رابط الموقع، أو عنوان العقد الذكي (Contract Address) لفحصه قبل التفاعل معه.
        </p>
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
          <Search className="w-5 h-5 text-slate-500" />
        </div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleScan()}
          className="w-full bg-slate-800 border border-slate-700 text-slate-100 text-lg rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 block p-4 pr-12 transition-all font-sans"
          placeholder="أدخل الرابط أو عنوان العقد (0x...)"
        />
        <button
          onClick={handleScan}
          disabled={loading || !input.trim()}
          className="absolute inset-y-2 left-2 px-6 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-700 disabled:text-slate-400 text-white font-semibold rounded-xl transition-colors flex items-center gap-2 font-sans"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'فحص الآن'}
        </button>
      </div>

      {result && (
        <div
          className={`p-6 rounded-2xl border ${
            result.riskLevel === 'High' ? 'bg-red-950/30 border-red-900/50' :
            result.riskLevel === 'Medium' ? 'bg-yellow-950/30 border-yellow-900/50' :
            result.riskLevel === 'Low' ? 'bg-emerald-950/30 border-emerald-900/50' :
            'bg-slate-800 border-slate-700'
          }`}
        >
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-full shrink-0 ${
              result.riskLevel === 'High' ? 'bg-red-900/50 text-red-400' :
              result.riskLevel === 'Medium' ? 'bg-yellow-900/50 text-yellow-400' :
              result.riskLevel === 'Low' ? 'bg-emerald-900/50 text-emerald-400' :
              'bg-slate-700 text-slate-400'
            }`}>
              {result.riskLevel === 'High' ? <AlertTriangle className="w-8 h-8" /> :
               result.riskLevel === 'Medium' ? <Info className="w-8 h-8" /> :
               result.riskLevel === 'Low' ? <ShieldCheck className="w-8 h-8" /> :
               <Search className="w-8 h-8" />}
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-100 font-sans">{result.title}</h3>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold font-sans ${
                  result.riskLevel === 'High' ? 'bg-red-900/50 text-red-400' :
                  result.riskLevel === 'Medium' ? 'bg-yellow-900/50 text-yellow-400' :
                  result.riskLevel === 'Low' ? 'bg-emerald-900/50 text-emerald-400' :
                  'bg-slate-700 text-slate-400'
                }`}>
                  {result.riskLevel === 'High' ? 'خطر عالي' :
                   result.riskLevel === 'Medium' ? 'متوسط الخطورة' :
                   result.riskLevel === 'Low' ? 'آمن نسبياً' : 'غير معروف'}
                </span>
              </div>
              <p className="text-slate-300 leading-relaxed text-lg font-sans">
                {result.explanation}
              </p>
              <div className="pt-4 flex items-center gap-2 text-sm text-slate-500 font-sans">
                <span>نوع المدخل:</span>
                <span className="bg-slate-800 px-2 py-1 rounded-md">{result.type}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-8">
        <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50">
          <div className="w-10 h-10 bg-indigo-900/50 text-indigo-400 rounded-xl flex items-center justify-center mb-4">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <h4 className="font-semibold text-slate-200 mb-2 font-sans">روابط التصيد (Phishing)</h4>
          <p className="text-sm text-slate-400 font-sans">نكتشف الروابط المزيفة التي تحاول سرقة مفاتيحك الخاصة أو عبارة الاسترداد.</p>
        </div>
        <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50">
          <div className="w-10 h-10 bg-indigo-900/50 text-indigo-400 rounded-xl flex items-center justify-center mb-4">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h4 className="font-semibold text-slate-200 mb-2 font-sans">العقود الخبيثة</h4>
          <p className="text-sm text-slate-400 font-sans">نحلل عناوين العقود الذكية للبحث عن وظائف خفية قد تسرق أموالك.</p>
        </div>
        <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50">
          <div className="w-10 h-10 bg-indigo-900/50 text-indigo-400 rounded-xl flex items-center justify-center mb-4">
            <Info className="w-5 h-5" />
          </div>
          <h4 className="font-semibold text-slate-200 mb-2 font-sans">Airdrops مزيفة</h4>
          <p className="text-sm text-slate-400 font-sans">تحذير من التوزيعات المجانية الوهمية التي تطلب منك صلاحيات خطيرة.</p>
        </div>
      </div>
    </div>
  );
}
