import { BookOpen, Shield, Key, AlertTriangle, ExternalLink } from 'lucide-react';


export default function Education() {
  const articles = [
    {
      id: 1,
      title: 'كيف تحمي مفاتيحك الخاصة (Private Keys)؟',
      icon: <Key className="w-6 h-6 text-indigo-400" />,
      content: 'مفتاحك الخاص هو ملكيتك لأموالك. لا تشاركه أبداً مع أي شخص، ولا تحفظه في ملف نصي على جهازك أو في السحابة. استخدم محافظ الأجهزة (Hardware Wallets) للمبالغ الكبيرة.',
      color: 'bg-indigo-950/30 border-indigo-900/50'
    },
    {
      id: 2,
      title: 'خطر الصلاحيات غير المحدودة (Unlimited Approvals)',
      icon: <Shield className="w-6 h-6 text-emerald-400" />,
      content: 'عندما تتفاعل مع منصة لامركزية (DEX)، يطلب منك العقد صلاحية لإنفاق عملاتك. العديد من العقود تطلب صلاحية "غير محدودة" لتوفير رسوم الغاز مستقبلاً. إذا تم اختراق العقد، يمكن للمخترق سحب كل عملاتك. استخدم أدوات مثل Revoke.cash لإلغاء الصلاحيات القديمة.',
      color: 'bg-emerald-950/30 border-emerald-900/50'
    },
    {
      id: 3,
      title: 'كيف تكتشف الـ Airdrops المزيفة؟',
      icon: <AlertTriangle className="w-6 h-6 text-yellow-400" />,
      content: 'إذا وجدت عملات أو NFTs غريبة في محفظتك لم تطلبها، فهذا فخ (Dusting Attack). لا تحاول بيعها أو التفاعل معها، لأن ذلك سيوجهك لموقع يطلب منك صلاحية خبيثة تسرق أموالك.',
      color: 'bg-yellow-950/30 border-yellow-900/50'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-slate-100 font-sans">الوعي الأمني (Education)</h2>
        <p className="text-slate-400 font-sans">
          تعلم كيف تحمي نفسك في عالم Web3. المعرفة هي خط دفاعك الأول.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {articles.map((article, index) => (
          <div
            key={article.id}
            className={`p-6 rounded-2xl border ${article.color} space-y-4`}
          >
            <div className="flex items-center gap-3">
              <div className="p-3 bg-slate-900/50 rounded-xl">
                {article.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-100 font-sans">{article.title}</h3>
            </div>
            <p className="text-slate-300 leading-relaxed font-sans">
              {article.content}
            </p>
          </div>
        ))}

        <div
          className="p-6 rounded-2xl border bg-slate-800/50 border-slate-700 space-y-4 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-slate-900/50 rounded-xl">
                <BookOpen className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-100 font-sans">مصادر إضافية</h3>
            </div>
            <ul className="space-y-3 text-slate-300 font-sans">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                <span>دائماً تحقق من الروابط الرسمية عبر حسابات Twitter الموثقة.</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                <span>استخدم إضافة متصفح مثل Pocket Universe لمحاكاة المعاملات.</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                <span>لا ترد على الرسائل الخاصة (DMs) التي تدعي أنها دعم فني.</span>
              </li>
            </ul>
          </div>
          <button className="mt-4 w-full py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2 font-sans">
            اقرأ المزيد من المقالات
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
