import React, { useState, useEffect } from 'react';
import {
    Pickaxe, Smartphone, ScanEye, Search, Gavel, Cpu,
    ShieldAlert, Database, Map, CheckCircle, XCircle,
    Lock, Shield, Eye, FileText, Check, X,
    ArrowRight, User, Server, Key, Box,
    AlertTriangle, FileKey, Globe, Wallet, RefreshCw,
    Play, LockKeyhole, Coins, Binary, Network, Fingerprint,
    HelpCircle, ChevronDown, ChevronUp, Share2
} from 'lucide-react';

// --- SHARED COMPONENTS ---

const StoryContainer: React.FC<{
    title: string;
    role: string;
    icon: React.ReactNode;
    children: React.ReactNode;
    onExit: () => void;
    color?: string;
    userName?: string;
}> = ({ title, role, icon, children, onExit, color = "border-gray-700", userName }) => (
    <div className={`w-full h-[650px] bg-[#0d1117] border-2 ${color} rounded-xl relative overflow-hidden flex flex-col font-sans animate-fadeIn shadow-2xl`}>
        {/* Header */}
        <div className="bg-[#161b22] p-4 border-b border-gray-800 flex justify-between items-center z-20 relative shadow-md">
            <div className="flex items-center gap-3">
                <div className="bg-gray-800 p-2 rounded-lg border border-gray-700 shadow-inner">{icon}</div>
                <div>
                    <h2 className="text-xl font-bold text-white leading-tight">{title}</h2>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        <p className="text-xs text-gray-400 font-mono uppercase tracking-wider flex items-center gap-2">
                            ROLE: {role}
                            {userName && <span className="text-eth border-l border-gray-600 pl-2 ml-2">{userName}</span>}
                        </p>
                    </div>
                </div>
            </div>
            <button onClick={onExit} className="text-gray-400 hover:text-red-400 hover:bg-red-900/10 p-2 rounded-full transition"><X /></button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 relative crt-screen flex flex-col scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
            {children}
        </div>
    </div>
);

const GameIntro: React.FC<{
    mission: string;
    roleDescription: string;
    objective: string;
    onStart: () => void;
    isCompleted?: boolean;
    userName?: string;
}> = ({ mission, roleDescription, objective, onStart, isCompleted, userName }) => (
    <div className="flex flex-col items-center justify-center h-full text-center space-y-8 animate-fadeIn p-4">
        {isCompleted && (
            <div className="bg-green-900/50 border border-green-500 text-green-200 px-4 py-2 rounded-lg flex items-center gap-2 mb-2 animate-bounce-small">
                <CheckCircle size={16} />
                <span className="text-sm font-bold">مهمة مكتملة!</span>
            </div>
        )}
        <div className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700 max-w-lg w-full backdrop-blur-sm shadow-xl">
            <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-eth/10 rounded-full flex items-center justify-center border-2 border-eth shadow-[0_0_30px_rgba(244,183,40,0.2)]">
                    <FileText size={40} className="text-eth" />
                </div>
            </div>
            <h3 className="text-2xl font-black text-white mb-2 tracking-tight">{mission}</h3>

            <div className="text-right space-y-4 bg-black/20 p-4 rounded-xl border border-gray-700/50 mt-6">
                <div>
                    <span className="text-xs text-blue-400 font-bold uppercase tracking-wider flex items-center gap-2 mb-1"><User size={12} /> الدور (Role)</span>
                    <p className="text-gray-300 text-sm leading-relaxed">{roleDescription}</p>
                </div>
                <div>
                    <span className="text-xs text-green-400 font-bold uppercase tracking-wider flex items-center gap-2 mb-1"><CheckCircle size={12} /> الهدف (Objective)</span>
                    <p className="text-white font-bold text-sm">{objective}</p>
                </div>
            </div>
        </div>
        <button
            onClick={onStart}
            className="group relative px-10 py-4 bg-eth hover:bg-white text-black font-black text-lg uppercase tracking-widest rounded-xl transition-all transform hover:-translate-y-1 shadow-[0_5px_0_rgb(180,130,0)] hover:shadow-[0_5px_0_rgb(200,200,200)] active:translate-y-0 active:shadow-none w-full max-w-xs"
        >
            <span className="flex items-center justify-center gap-2">ابدأ المهمة <Play size={20} className="fill-current" /></span>
        </button>
        {!userName && <p className="text-xs text-gray-500">أنت تلعب كضيف. لن يتم حفظ نتيجتك في لوحة الصدارة.</p>}
    </div>
);

const GameResult: React.FC<{
    status: 'success' | 'fail';
    title: string;
    desc: string;
    lesson: string;
    score?: number;
    onAction: () => void;
    actionText: string;
    isCompleted?: boolean;
}> = ({ status, title, desc, lesson, score, onAction, actionText, isCompleted }) => (
    <div className="flex flex-col items-center justify-center h-full text-center space-y-6 animate-fadeIn">
        <div className="relative">
            <div className={`absolute inset-0 blur-3xl opacity-30 ${status === 'success' ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <div className={`w-24 h-24 bg-gray-900 rounded-full flex items-center justify-center border-4 relative z-10 ${status === 'success' ? 'border-green-500 text-green-500' : 'border-red-500 text-red-500'}`}>
                {status === 'success' ? <CheckCircle size={60} /> : <XCircle size={60} />}
            </div>
        </div>

        <h2 className="text-3xl font-black text-white">{title}</h2>

        <div className="bg-gray-800/80 p-6 rounded-xl border border-gray-600 w-full max-w-md backdrop-blur-md">
            <p className="text-gray-200 mb-6 text-lg leading-relaxed">{desc}</p>

            <div className={`p-4 rounded-lg border-r-4 text-right ${status === 'success' ? 'bg-green-900/20 border-green-500' : 'bg-red-900/20 border-red-500'}`}>
                <h4 className={`font-bold text-sm mb-1 flex items-center gap-2 ${status === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                    <HelpCircle size={16} /> {status === 'success' ? 'الدرس المستفاد' : 'لماذا فشلت؟'}
                </h4>
                <p className="text-sm text-gray-300">{lesson}</p>
            </div>
            {score && status === 'success' && !isCompleted && (
                <div className="mt-4 flex justify-between items-center bg-black/40 p-3 rounded border border-gray-700 animate-bounce">
                    <span className="text-gray-400 font-mono text-sm">REWARD</span>
                    <span className="text-eth font-bold text-xl drop-shadow-md">+{score} XP</span>
                </div>
            )}
            {score && status === 'success' && isCompleted && (
                <div className="mt-4 flex justify-between items-center bg-blue-900/40 p-3 rounded border border-blue-500">
                    <span className="text-gray-400 font-mono text-sm">STATUS</span>
                    <span className="text-blue-400 font-bold text-sm">النقاط محتسبة مسبقاً</span>
                </div>
            )}
        </div>

        <button onClick={onAction} className={`px-8 py-3 rounded-full font-bold transition flex items-center gap-2 ${status === 'success' ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-red-600 hover:bg-red-500 text-white'}`}>
            {actionText} {status === 'success' ? <ArrowRight size={18} className="rotate-180" /> : <RefreshCw size={18} />}
        </button>
    </div>
);

const InfoBox: React.FC<{ title: string; points: string[] }> = ({ title, points }) => (
    <div className="mt-4 bg-gray-900/70 border border-blue-600/60 rounded-xl p-3 text-right animate-fadeIn">
        <div className="flex items-center gap-2 mb-2">
            <HelpCircle size={16} className="text-blue-400" />
            <span className="text-sm font-bold text-blue-300">{title}</span>
        </div>
        <ul className="space-y-1 text-xs text-gray-300 list-disc pr-4">
            {points.map((p, i) => <li key={i}>{p}</li>)}
        </ul>
    </div>
);

// --- GAME 1: MINER (UPDATED) ---
const MinerGame: React.FC<{ onComplete: (s: number, id: string) => void, onExit: () => void, isCompleted?: boolean, userName?: string }> = ({ onComplete, onExit, isCompleted, userName }) => {
    const [state, setState] = useState<'intro' | 'scanning' | 'analysis' | 'mining' | 'result'>('intro');
    const [result, setResult] = useState<{ status: 'success' | 'fail', title: string, msg: string, lesson: string }>({ status: 'fail', title: '', msg: '', lesson: '' });
    const [dialogue, setDialogue] = useState<string>("");

    const handleMine = (choice: number) => {
        setState('mining');
        setTimeout(() => {
            setState('result');
            if (choice === 3) {
                setResult({
                    status: 'fail',
                    title: "ضغط شديد على الموارد!",
                    msg: "لقد قبلت عدداً ضخماً من المعاملات المزعجة (Spam). هذا يسبب ازدحاماً في الـ Mempool وقد يبطئ عمل العقدة.",
                    lesson: "المعدن يجب أن يحافظ على صحة الشبكة بتجاهل المعاملات المزعجة (Spam) التي تهدف لإغراق النظام ببيانات غير مفيدة."
                });
            } else if (choice === 1) {
                setResult({
                    status: 'success',
                    title: "بلوك مقبول (ربح محدود)",
                    msg: "تم قبول البلوك، لكن العائد المادي كان قليلاً لأنك اخترت معاملات برسوم زهيدة.",
                    lesson: "من حق المعدن ترتيب المعاملات حسب الرسوم لتحقيق جدوى اقتصادية، ما دامت الشبكة غير مزدحمة."
                });
            } else {
                setResult({
                    status: 'success',
                    title: "بلوك ممتاز!",
                    msg: "رائع! اخترت المعاملة المحمية (Shielded). حجمها أكبر قليلاً وبالتالي رسومها مجزية، وتدعم خصوصية المستخدمين.",
                    lesson: "المعاملات المحمية غالبًا ما تكون أكبر حجمًا (Bytes)، مما يعني رسومًا أعلى في بعض الحالات، وهي الخيار الأمثل للخصوصية."
                });
            }
        }, 2500);
    };

    return (
        <StoryContainer title="مهمة: تشغيل العقدة (Miner Node)" role="Node Operator" icon={<Pickaxe className="text-yellow-500" />} onExit={onExit} userName={userName}>
            {state === 'intro' && (
                <GameIntro
                    mission="معالجة المعاملات"
                    roleDescription=" أنت تدير عقدة كاملة تقوم بالتعدين (Miner Node). 
في شبكة Ethereum توجد عقد تحقق فقط (Full Nodes)، وهذه العقدة تحديدًا تشارك في التعدين وبناء البلوكات. 
"                    objective="ستصلك 3 مجموعات من البيانات. قم بتحليلها واختر المجموعة الأنسب لإضافتها للبلوك القادم لتحقيق أفضل أداء وعائد."
                    onStart={() => {
                        setState('scanning');
                        setDialogue("النظام: جاري الاتصال... تم استقبال 3 طلبات جديدة.");
                    }}
                    isCompleted={isCompleted}
                    userName={userName}
                />
            )}

            {state === 'scanning' && (
                <div className="flex flex-col h-full justify-center items-center text-center space-y-6 animate-fadeIn">
                    <div className="w-16 h-16 border-4 border-t-yellow-500 border-gray-700 rounded-full animate-spin"></div>
                    <p className="font-mono text-green-400">{dialogue}</p>
                    <button onClick={() => setState('analysis')} className="bg-gray-700 hover:bg-gray-600 px-6 py-2 rounded text-white mt-4">
                        عرض البيانات المتاحة
                    </button>
                </div>
            )}

            {state === 'analysis' && (
                <div className="space-y-4">
                    <h3 className="text-white font-bold text-center mb-4">اختر حزمة البيانات للمعالجة:</h3>

                    <button onClick={() => handleMine(1)} className="w-full text-right p-4 bg-gray-800 border border-gray-600 hover:border-blue-400 rounded-xl group transition-all">
                        <div className="flex justify-between items-center mb-1">
                            <span className="font-bold text-blue-400">الخيار A: تحويلات بسيطة (Transparent)</span>
                            <span className="text-xs bg-gray-700 px-2 py-1 rounded">رسوم: 0.0001 ZEC</span>
                        </div>
                        <p className="text-gray-400 text-sm">معاملات شفافة صغيرة الحجم. سهلة المعالجة لكن رسومها منخفضة.</p>
                    </button>

                    <button onClick={() => handleMine(2)} className="w-full text-right p-4 bg-gray-800 border border-gray-600 hover:border-yellow-400 rounded-xl group transition-all">
                        <div className="flex justify-between items-center mb-1">
                            <span className="font-bold text-yellow-400">الخيار B: بيانات مشفرة (Shielded)</span>
                            <span className="text-xs bg-gray-700 px-2 py-1 rounded">رسوم: 0.05 ZEC (مرتفع)</span>
                        </div>
                        <p className="text-gray-400 text-sm">حزمة بيانات مشفرة. حجمها أكبر (Bytes) وبالتالي رسومها أعلى.</p>
                    </button>

                    <button onClick={() => handleMine(3)} className="w-full text-right p-4 bg-gray-800 border border-gray-600 hover:border-red-400 rounded-xl group transition-all">
                        <div className="flex justify-between items-center mb-1">
                            <span className="font-bold text-red-400">الخيار C: آلاف الرسائل الصغيرة (Spam)</span>
                            <span className="text-xs bg-gray-700 px-2 py-1 rounded">رسوم: 0.00001 ZEC</span>
                        </div>
                        <p className="text-gray-400 text-sm">عدد ضخم جداً من المعاملات الصغيرة المتكررة. تستهلك مساحة البلوك دون فائدة حقيقية.</p>
                    </button>
                </div>
            )}

            {state === 'mining' && (
                <div className="flex flex-col items-center justify-center h-full text-center">
                    <Cpu size={80} className="text-yellow-500 animate-pulse mb-4" />
                    <h3 className="text-2xl font-bold text-white mb-2">جاري المعالجة...</h3>
                    <div className="font-mono text-xs text-gray-500 space-y-1">
                        <p>Hash: 000000000019d6689c085ae165831e93...</p>
                        <p>Nonce: 481920</p>
                        <p>Solving Equihash...</p>
                    </div>
                </div>
            )}

            {state === 'result' && (
                <GameResult
                    status={result.status}
                    title={result.title}
                    desc={result.msg}
                    lesson={result.lesson}
                    score={50}
                    isCompleted={isCompleted}
                    onAction={() => result.status === 'success' ? (onComplete(50, 'miner'), onExit()) : setState('intro')}
                    actionText={result.status === 'success' ? "استلام المكافأة" : "أعد المحاولة"}
                />
            )}
        </StoryContainer>
    );
};

// --- GAME 2: SENDER (UPDATED) ---
const SenderGame: React.FC<{ onComplete: (s: number, id: string) => void, onExit: () => void, isCompleted?: boolean, userName?: string }> = ({ onComplete, onExit, isCompleted, userName }) => {
    type Step = 0 | 1 | 2 | 3 | 4;
    const [step, setStep] = useState<Step>(0);

    const [riskLevel, setRiskLevel] = useState(0);
    const [privacyScore, setPrivacyScore] = useState(0);
    const [usabilityScore, setUsabilityScore] = useState(0);

    const [lastInfo, setLastInfo] = useState<{ title: string; points: string[] } | null>(null);
    const [finalStatus, setFinalStatus] = useState<'success' | 'fail'>('success');
    const [finalDesc, setFinalDesc] = useState('');
    const [finalLesson, setFinalLesson] = useState('');

    const applyChoice = (choiceId: string) => {
        if (step === 1) {
            if (choiceId === 't-address') {
                setRiskLevel(r => r + 2);
                setPrivacyScore(p => p - 2);
                setUsabilityScore(u => u + 2);
                setLastInfo({
                    title: "العناوين الشفافة (T-Address)",
                    points: [
                        "تسجّل المرسل والمستقبل والمبلغ في السجل العام.",
                        "سهلة للفهم وتشبه نظام العملات الرقمية الشائع.",
                        "قد تكشف نمط إنفاقك ورصيدك مع الوقت."
                    ]
                });
            } else if (choiceId === 'z-address') {
                setRiskLevel(r => r - 1);
                setPrivacyScore(p => p + 3);
                setUsabilityScore(u => u + 1);
                setLastInfo({
                    title: "العناوين المحمية (Z-Address)",
                    points: [
                        "تُخفي المرسل والمستقبل والمبلغ عن السجل العام.",
                        "المعاملة تظهر كـ 'مشفر' فقط على البلوكشين.",
                        "مفيدة في المدفوعات التي تحتوي على بيانات حساسة."
                    ]
                });
            }
            setStep(2);
        } else if (step === 2) {
            if (choiceId === 'memo-plain') {
                setRiskLevel(r => r + 1);
                setPrivacyScore(p => p - 1);
                setUsabilityScore(u => u + 1);
                setLastInfo({
                    title: "ملاحظات مفصلة",
                    points: [
                        "في المعاملات المحمية، المذكرة مشفرة (Encrypted Memo).",
                        "لكن الخطر يكمن في مشاركتك لمفتاح المشاهدة لاحقاً، حيث قد تظهر هذه التفاصيل في حال مشاركة مفتاح المشادة.", "تجنّب وضع بيانات شديدة الحساسية إلا للضرورة القصوى."
                    ]
                });
            } else if (choiceId === 'memo-min') {
                setRiskLevel(r => r - 1);
                setPrivacyScore(p => p + 1);
                setUsabilityScore(u => u);
                setLastInfo({
                    title: "ملاحظات مختصرة",
                    points: [
                        "أفضل ممارسة هي كتابة أقل قدر ممكن من البيانات الشخصية.",
                        "اكتفِ بوصف مختصر للغرض (مثل: 'فاتورة 1234').",
                        "هذا يقلل المخاطر في حال قررت كشف المعاملة لجهة تدقيق."
                    ]
                });
            } else if (choiceId === 'no-memo') {
                setRiskLevel(r => r - 1);
                setPrivacyScore(p => p + 1);
                setUsabilityScore(u => u - 1);
                setLastInfo({
                    title: "بدون مذكرة",
                    points: [
                        "يوفر أقصى خصوصية من ناحية المحتوى النصي.",
                        "قد يصعب عليك تذكر سبب المعاملة لاحقاً.",
                        "مناسب للمدفوعات البسيطة."
                    ]
                });
            }
            setStep(3);
        } else if (step === 3) {
            if (choiceId === 'fixed-fee') {
                setRiskLevel(r => r - 1);
                setPrivacyScore(p => p);
                setUsabilityScore(u => u + 1);
                setLastInfo({
                    title: "الرسوم الثابتة",
                    points: [
                        "تسهل الفهم للمستخدم.",
                        "قد لا تعكس ازدحام الشبكة الفعلي.",
                        "مناسبة للتطبيقات البسيطة."
                    ]
                });
            } else if (choiceId === 'dynamic-fee') {
                setRiskLevel(r => r - 1);
                setPrivacyScore(p => p);
                setUsabilityScore(u => u);
                setLastInfo({
                    title: "الرسوم الديناميكية",
                    points: [
                        "تُحسب تلقائياً لضمان تأكيد المعاملة.",
                        "تعتمد على حجم المعاملة (Bytes) وازدحام الشبكة.",
                        "الخيار الأفضل تقنياً."
                    ]
                });
            }
            setStep(4);
        }
    };

    useEffect(() => {
        if (step === 4) {
            const privacyGood = privacyScore >= 3;
            const riskOk = riskLevel <= 1;
            const usabilityOk = usabilityScore >= 1;

            if (privacyGood && riskOk && usabilityOk) {
                setFinalStatus('success');
                setFinalDesc("أعددت عملية دفع متوازنة: درجة خصوصية عالية، مخاطرة منخفضة، وتجربة مستخدم عملية.");
                setFinalLesson("أفضل الإعدادات هي التي تستفيد من مزايا التشفير في Ethereum (Z-Address) مع الحفاظ على ملاحظات آمنة ومختصرة.");
            } else if (privacyScore < 0) {
                setFinalStatus('fail');
                setFinalDesc("الإعدادات التي اخترتها (T-Address) تجعل بيانات معاملاتك مكشوفة للعامة.");
                setFinalLesson("حاول استخدام العناوين المحمية (Shielded) كخيار افتراضي لحماية خصوصيتك المالية.");
            } else if (riskLevel > 2) {
                setFinalStatus('fail');
                setFinalDesc("قراراتك رفعت مستوى المخاطرة (مثل استخدام T-Address أو كتابة تفاصيل حساسة).");
                setFinalLesson("المذكرة المشفرة آمنة، لكنها تصبح مكشوفة عند استخدام Viewing Key. كن حذراً في ما تكتبه.");
            } else {
                setFinalStatus('fail');
                setFinalDesc("الإعدادات ليست مثالية. حاول تحسين الخصوصية أكثر.");
                setFinalLesson("Ethereum توفر أدوات قوية للخصوصية، حاول استغلالها بالكامل (Z-Address + Minimal Memo).");
            }
        }
    }, [step, riskLevel, privacyScore, usabilityScore]);

    return (
        <StoryContainer title="مهمة: التحويل الآمن المتقدم" role="Sender" icon={<Smartphone className="text-blue-500" />} onExit={onExit} userName={userName}>
            {step === 0 && (
                <GameIntro
                    mission="إعداد عملية دفع"
                    roleDescription="أنت تضبط إعدادات الدفع في تطبيق محفظة يدعم Ethereum. الهدف هو اختيار إعدادات مناسبة لخصوصية المستخدم وسهولة الاستخدام."
                    objective="ستمر على 3 مشاهد متتابعة. اختر الإعدادات التي توفر أعلى درجات الخصوصية وSecurity مع الحفاظ على سهولة الاستخدام."
                    onStart={() => setStep(1)}
                    isCompleted={isCompleted}
                    userName={userName}
                />
            )}

            {step === 1 && (
                <div className="flex flex-col h-full justify-center space-y-4">
                    <h3 className="text-center text-xl font-bold text-white mb-2">المشهد 1: نوع العنوان</h3>
                    <p className="text-gray-300 text-sm text-center mb-4">
                        تريد إرسال مبلغ إلى متجر. ما نوع العنوان الذي ستستخدمه؟
                    </p>

                    <button onClick={() => applyChoice('t-address')} className="bg-gray-800 hover:bg-red-900/20 border border-gray-600 hover:border-red-500 p-4 rounded-xl flex items-center gap-4 transition group text-right">
                        <Globe size={28} className="text-gray-500 group-hover:text-red-400" />
                        <div>
                            <h4 className="font-bold text-white">عنوان شفاف (Transparent Address)</h4>
                            <p className="text-xs text-gray-400">تظهر تفاصيل الإرسال بالكامل في السجل العام (Public Blockchain).</p>
                        </div>
                    </button>

                    <button onClick={() => applyChoice('z-address')} className="bg-gray-800 hover:bg-green-900/20 border border-gray-600 hover:border-green-500 p-4 rounded-xl flex items-center gap-4 transition group text-right">
                        <Shield size={28} className="text-gray-500 group-hover:text-green-400" />
                        <div>
                            <h4 className="font-bold text-white">عنوان محمي (Shielded Address)</h4>
                            <p className="text-xs text-gray-400">يخفي البيانات (المرسل، المستلم، المبلغ) باستخدام التشفير.</p>
                        </div>
                    </button>
                    {lastInfo && <InfoBox title={lastInfo.title} points={lastInfo.points} />}
                </div>
            )}

            {step === 2 && (
                <div className="flex flex-col h-full justify-center space-y-4">
                    <h3 className="text-center text-xl font-bold text-white mb-2">المشهد 2: المذكرة (Memo)</h3>
                    <p className="text-gray-300 text-sm text-center mb-4">
                        ماذا ستكتب في حقل المذكرة المرفق بالمعاملة؟
                    </p>

                    <button onClick={() => applyChoice('memo-plain')} className="bg-gray-800 hover:bg-yellow-900/20 border border-gray-600 hover:border-yellow-500 p-4 rounded-xl text-right transition">
                        <h4 className="font-bold text-white mb-1">ملاحظة مفصلة جداً</h4>
                        <p className="text-xs text-gray-400">وصف دقيق للمنتج والأسماء.</p>
                    </button>

                    <button onClick={() => applyChoice('memo-min')} className="bg-gray-800 hover:bg-blue-900/20 border border-gray-600 hover:border-blue-500 p-4 rounded-xl text-right transition">
                        <h4 className="font-bold text-white mb-1">ملاحظة مختصرة</h4>
                        <p className="text-xs text-gray-400">وصف بسيط مثل رقم الفاتورة فقط.</p>
                    </button>

                    <button onClick={() => applyChoice('no-memo')} className="bg-gray-800 hover:bg-gray-700 border border-gray-600 hover:border-white p-4 rounded-xl text-right transition">
                        <h4 className="font-bold text-white mb-1">بدون ملاحظة</h4>
                        <p className="text-xs text-gray-400">ترك الحقل فارغاً.</p>
                    </button>
                    {lastInfo && <InfoBox title={lastInfo.title} points={lastInfo.points} />}
                </div>
            )}

            {step === 3 && (
                <div className="flex flex-col h-full justify-center space-y-4">
                    <h3 className="text-center text-xl font-bold text-white mb-2">المشهد 3: الرسوم (Fees)</h3>
                    <p className="text-gray-300 text-sm text-center mb-4">
                        كيف تريد دفع رسوم المعاملة؟
                    </p>

                    <button onClick={() => applyChoice('fixed-fee')} className="bg-gray-800 hover:bg-purple-900/20 border border-gray-600 hover:border-purple-500 p-4 rounded-xl text-right transition">
                        <h4 className="font-bold text-white mb-1">رسوم ثابتة (Legacy)</h4>
                        <p className="text-xs text-gray-400">قيمة ثابتة قديمة (0.0001 ZEC).</p>
                    </button>

                    <button onClick={() => applyChoice('dynamic-fee')} className="bg-gray-800 hover:bg-green-900/20 border border-gray-600 hover:border-green-500 p-4 rounded-xl text-right transition">
                        <h4 className="font-bold text-white mb-1">رسوم ديناميكية (Standard)</h4>
                        <p className="text-xs text-gray-400">حساب الرسوم حسب حجم المعاملة (Standard Fee Policy).</p>
                    </button>
                    {lastInfo && <InfoBox title={lastInfo.title} points={lastInfo.points} />}
                </div>
            )}

            {step === 4 && (
                <GameResult
                    status={finalStatus}
                    title={finalStatus === 'success' ? "إعداد متوازن" : "تحتاج لتحسين الإعدادات"}
                    desc={finalDesc}
                    lesson={finalLesson}
                    score={40}
                    isCompleted={isCompleted}
                    onAction={() => finalStatus === 'success' ? (onComplete(40, 'sender'), onExit()) : (setStep(1), setRiskLevel(0), setPrivacyScore(0), setUsabilityScore(0))}
                    actionText={finalStatus === 'success' ? "إنهاء المهمة" : "إعادة التجربة"}
                />
            )}
        </StoryContainer>
    );
};

// --- GAME 3: RECEIVER ---
const ReceiverGame: React.FC<{ onComplete: (s: number, id: string) => void, onExit: () => void, isCompleted?: boolean, userName?: string }> = ({ onComplete, onExit, isCompleted, userName }) => {
    const [state, setState] = useState<'intro' | 'dialogue' | 'options' | 'result'>('intro');
    const [choice, setChoice] = useState<'private' | 'viewing' | 'image'>('image');

    return (
        <StoryContainer title="مهمة: التدقيق المالي" role="Merchant" icon={<Eye className="text-green-500" />} onExit={onExit} userName={userName}>
            {state === 'intro' && (
                <GameIntro
                    mission="مراجعة الحسابات"
                    roleDescription="أنت مدير مالي لشركة تقنية. الشركة تستخدم Ethereum للحفاظ على سرية رواتب الموظفين وصفقاتها التجارية."
                    objective="طلب منك المدقق الخارجي الاطلاع على سجلات الربع الأخير للتأكد من سلامة الحسابات. كيف تشارك البيانات معه بشكل آمن وموثوق؟"
                    onStart={() => setState('dialogue')}
                    isCompleted={isCompleted}
                    userName={userName}
                />
            )}

            {state === 'dialogue' && (
                <div className="flex flex-col h-full justify-center space-y-4 animate-fadeIn">
                    <div className="flex gap-4 items-start bg-gray-800 p-4 rounded-lg">
                        <div className="bg-blue-900 rounded-full w-10 h-10 flex items-center justify-center font-bold">م</div>
                        <div>
                            <h4 className="font-bold text-blue-400">المدقق الخارجي</h4>
                            <p className="text-gray-300 text-sm">"نحتاج للتحقق من صحة المعاملات الواردة والصادرة للمحفظة لمطابقتها مع الكشوفات. نرجو تزويدنا بصلاحية للاطلاع."</p>
                        </div>
                    </div>
                    <button onClick={() => setState('options')} className="bg-green-600 text-white py-2 rounded-lg mt-4 font-bold">
                        اختيار طريقة المشاركة
                    </button>
                </div>
            )}

            {state === 'options' && (
                <div className="flex flex-col h-full justify-center space-y-4">
                    <h4 className="text-center text-white font-bold mb-2">ماذا سترسل للمدقق؟</h4>

                    <button onClick={() => { setChoice('private'); setState('result'); }} className="bg-gray-800 border-l-4 border-red-500 p-4 rounded text-right hover:bg-gray-700 transition">
                        <h5 className="font-bold text-white">المفتاح الخاص (Private Key)</h5>
                        <p className="text-xs text-gray-400">"تفضل، هذا المفتاح يعطيك صلاحية كاملة على المحفظة."</p>
                    </button>

                    <button onClick={() => { setChoice('image'); setState('result'); }} className="bg-gray-800 border-l-4 border-yellow-500 p-4 rounded text-right hover:bg-gray-700 transition">
                        <h5 className="font-bold text-white">صورة شاشة (Screenshot)</h5>
                        <p className="text-xs text-gray-400">"سأرسل لك صوراً من تطبيق المحفظة."</p>
                    </button>

                    <button onClick={() => { setChoice('viewing'); setState('result'); }} className="bg-gray-800 border-l-4 border-green-500 p-4 rounded text-right hover:bg-gray-700 transition">
                        <h5 className="font-bold text-white">مفتاح المشاهدة (Viewing Key)</h5>
                        <p className="text-xs text-gray-400">"هذا مفتاح للقراءة فقط. يتيح لك رؤية المعاملات دون القدرة على التصرف بالأموال."</p>
                    </button>
                </div>
            )}

            {state === 'result' && (
                <GameResult
                    status={choice === 'viewing' ? 'success' : 'fail'}
                    title={choice === 'viewing' ? "إجراء صحيح!" : choice === 'private' ? "خطأ كارثي!" : "إثبات غير كافٍ"}
                    desc={
                        choice === 'viewing' ? "المدقق استطاع مراجعة السجلات والتأكد منها عبر البلوكشين مباشرة، مع بقاء أموال الشركة في أمان تام." :
                            choice === 'private' ? "تحذير! إرسال المفتاح الخاص يعني منح المدقق (أو أي شخص يعترض الرسالة) القدرة على سحب كل الأموال." :
                                "المدقق رفض الصور لأنها غير رسمية ويمكن تعديلها بسهولة. التدقيق المالي يتطلب إثباتاً رقمياً من الشبكة."
                    }
                    lesson={choice === 'viewing' ? "مفتاح المشاهدة (Viewing Key) هو أداة قوية في Ethereum تتيح 'الشفافية الاختيارية' للأغراض المحاسبية والضريبية." : "المفتاح الخاص (Private Key) هو سرك الوحيد للوصول للأموال، لا تشاركه مع أي جهة مهما كانت."}
                    score={30}
                    isCompleted={isCompleted}
                    onAction={() => choice === 'viewing' ? (onComplete(30, 'receiver'), onExit()) : setState('options')}
                    actionText={choice === 'viewing' ? "إنهاء المهمة" : "حاول مجدداً"}
                />
            )}
        </StoryContainer>
    );
};

// --- GAME 4: VERIFIER (UPDATED) ---
const VerifierGame: React.FC<{ onComplete: (s: number, id: string) => void, onExit: () => void, isCompleted?: boolean, userName?: string }> = ({ onComplete, onExit, isCompleted, userName }) => {
    const [state, setState] = useState<'intro' | 'step1' | 'step2' | 'step3' | 'result'>('intro');
    const [lastInfo, setLastInfo] = useState<{ title: string; points: string[] } | null>(null);

    const updateInfo = (stepNum: number) => {
        if (stepNum === 1) {
            setLastInfo({
                title: "التحدي: المعرفة دون كشف السر",
                points: [
                    "المُثبت (Prover) يدعي معرفة 'سر' (مثل مفتاح خاص).",
                    "المتحقق (Verifier) يريد التأكد دون رؤية السر.",
                    "هذا يشبه مشكلة 'كهف علي بابا' الشهيرة في علم التشفير."
                ]
            });
        } else if (stepNum === 3) {
            setLastInfo({
                title: "الاحتمالات الرياضية",
                points: [
                    "فرصة النجاح بالحظ في مرة واحدة هي 50%.",
                    "بعد 10 مرات متتالية من النجاح، تصبح فرصة الحظ شبه معدومة.",
                    "zk-SNARKs تعتمد على هذا المبدأ: إثبات احتمالي يقترب من اليقين التام (Probabilistic Proof)."
                ]
            });
        }
    };

    return (
        <StoryContainer title="مهمة: إثبات المعرفة (Zk-SNARKs)" role="Verifier" icon={<Network className="text-purple-500" />} onExit={onExit} userName={userName}>
            {state === 'intro' && (
                <GameIntro
                    mission="تجربة الكهف السحري"
                    roleDescription="أنت تقوم بدور (المتحقق). تريد التأكد من صحة معلومة معينة دون الاطلاع عليها، باستخدام مفهوم رياضي ذكي."
                    objective="شخص ما يدعي أنه يملك 'مفتاحاً سحرياً' يفتح باباً داخل كهف. كيف تتأكد من صدقه دون أن يعطيك المفتاح أو تراه وهو يفتح الباب؟"
                    onStart={() => { setState('step1'); updateInfo(1); }}
                    isCompleted={isCompleted}
                    userName={userName}
                />
            )}

            {state === 'step1' && (
                <div className="flex flex-col h-full justify-center items-center text_center space-y-6">
                    <p className="text-lg text-gray-300">يوجد مساران للدخول: <span className="text-yellow-400 font-bold">المسار A</span> و <span className="text-blue-400 font-bold">المسار B</span>. الباب السحري يفصل بينهما من الداخل.</p>

                    <div className="w-40 h-40 rounded-full border-4 border-gray-600 relative flex items-center justify-center bg-gray-900/50">
                        <div className="absolute top-0 w-8 h-8 bg-gray-500 -mt-4 border-2 border-gray-400 text-[10px] flex items-center justify-center text-black font-bold">مدخل</div>
                        <div className="w-1 h-full bg-gray-700/50 absolute"></div>
                        <div className="w-8 h-2 bg-purple-500 absolute rotate-90 rounded animate-pulse shadow-[0_0_10px_purple]"></div>
                        <div className="absolute text-sm font-bold top-1/2 right-4 text-yellow-500">A</div>
                        <div className="absolute text-sm font-bold top-1/2 left-4 text-blue-500">B</div>
                    </div>

                    <p className="text-white font-bold text-sm">الخطوة 1: اطلب من الشخص الدخول لأحد المسارين عشوائياً (وأنت لا تراه).</p>
                    <button onClick={() => setState('step2')} className="bg-purple-600 hover:bg-purple-500 px-6 py-2 rounded-full text-white font-bold transition">
                        "تفضل بالدخول وانتظر بالداخل"
                    </button>
                    {lastInfo && <InfoBox title={lastInfo.title} points={lastInfo.points} />}
                </div>
            )}

            {state === 'step2' && (
                <div className="flex flex-col h-full justify-center items-center text-center space-y-6">
                    <p className="text-gray-300">الشخص الآن بالداخل. أنت لا تعلم في أي جهة هو (A أم B).</p>
                    <p className="text-white font-bold">الخطوة 2: تحداه! اطلب منه الخروج من مسار محدد.</p>
                    <div className="flex gap-4">
                        <button onClick={() => { setState('step3'); updateInfo(3); }} className="bg-yellow-600 hover:bg-yellow-500 px-6 py-3 rounded-lg text-black font-bold border border-yellow-400">
                            "اخرج من المسار A!"
                        </button>
                        <button onClick={() => { setState('step3'); updateInfo(3); }} className="bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-lg text-white font-bold border border-blue-400">
                            "اخرج من المسار B!"
                        </button>
                    </div>
                </div>
            )}

            {state === 'step3' && (
                <div className="flex flex-col h-full justify-center items-center text-center space-y-6">
                    <div className="text-6xl animate-bounce">🎉</div>
                    <p className="text-xl text-white font-bold">لقد خرج من المسار الذي طلبته!</p>
                    <p className="text-sm text-gray-400 max-w-md">
                        لأنه استطاع الخروج من الجهة المطلوبة، فهذا دليل على أنه استطاع فتح الباب والمرور.
                    </p>
                    <button onClick={() => setState('result')} className="bg-green-600 hover:bg-green-500 px-8 py-3 rounded-full text-white font-bold mt-4 shadow-lg transition transform hover:scale-105">
                        أنا أصدقه الآن (Verify)
                    </button>
                    {lastInfo && <InfoBox title={lastInfo.title} points={lastInfo.points} />}
                </div>
            )}

            {state === 'result' && (
                <GameResult
                    status="success"
                    title="هذا هو zk-SNARK!"
                    desc="أنت لم ترَ كلمة السر، ولم تدخل الكهف. لكن بما أن 'أحمد' استطاع تنفيذ طلبك، فأنت متأكد بدرجة يقين عالية جدًا تقترب من 100% أنه يملك السر (Probabilistic Proof)."
                    lesson="في Ethereum، المرسل يثبت للشبكة أنه يملك العملات (يعرف السر) دون أن يكشف العملات نفسها. الشبكة تتحقق من 'صحة البرهان' رياضياً."
                    score={40}
                    isCompleted={isCompleted}
                    onAction={() => (onComplete(40, 'verifier'), onExit())}
                    actionText="خروج"
                />
            )}
        </StoryContainer>
    );
};

const GovernorGame: React.FC<{ onComplete: (s: number, id: string) => void, onExit: () => void, isCompleted?: boolean, userName?: string }> = ({ onComplete, onExit, isCompleted, userName }) => {
    const [state, setState] = useState<'intro' | 'voting' | 'result'>('intro');
    const [votes, setVotes] = useState({ p1: false, p2: false, p3: false });
    const [current, setCurrent] = useState(1);

    const proposals = [
        { id: 1, title: "تطوير واجهة المحفظة", type: "Dev", cost: "Low", good: true, desc: "فريق تطوير يقترح تحسين تجربة المستخدم وإضافة اللغة العربية لتسهيل الاستخدام." },
        { id: 2, title: "حملة تسويقية غير مدروسة", type: "Marketing", cost: "High", good: false, desc: "اقتراح بصرف مبلغ ضخم لإعلانات عشوائية دون خطة عمل واضحة أو مؤشرات أداء." },
        { id: 3, title: "تحسين أمان الشبكة", type: "Security", cost: "Medium", good: true, desc: "تمويل جهة تقنية مختصة لإجراء اختبارات أمان وتحديث البروتوكول الأساسي." },
    ];

    const handleVote = (approve: boolean) => {
        setVotes(prev => ({ ...prev, [`p${current}`]: approve }));
        if (current < 3) setCurrent(c => c + 1);
        else setState('result');
    };

    const calculateScore = () => {
        let s = 0;
        if (votes.p1) s++;
        if (!votes.p2) s++;
        if (votes.p3) s++;
        return s;
    };

    return (
        <StoryContainer title="لعبة: التصويت المجتمعي" role="Community Member" icon={<Gavel className="text-blue-400" />} onExit={onExit} userName={userName}>
            {state === 'intro' && (
                <GameIntro
                    mission="لجنة المنح (ZCG)"
                    roleDescription="أنت عضو في المجتمع تشارك في اتخاذ القرارات حول كيفية استخدام صندوق تطوير الشبكة."
                    objective="لديك 3 مقترحات وميزانية محدودة. وافق على المشاريع التي تضيف قيمة حقيقية للشبكة والمستخدمين، وارفض المشاريع غير المجدية."
                    onStart={() => setState('voting')}
                    isCompleted={isCompleted}
                    userName={userName}
                />
            )}

            {state === 'voting' && (
                <div className="flex flex-col h-full items-center justify-center">
                    <div className="w-full flex justify-between text-xs text-gray-500 mb-2 px-4">
                        <span>PROPOSAL {current}/3</span>
                        <span>STATUS: PENDING</span>
                    </div>

                    <div className="bg-gray-800 p-6 rounded-2xl border-2 border-gray-600 w-full max-w-md shadow-2xl relative overflow-hidden">
                        <div className={`absolute top-0 right-0 p-2 text-xs font-bold text-black ${proposals[current - 1].type === 'Dev' ? 'bg-blue-400' : proposals[current - 1].type === 'Security' ? 'bg-green-400' : 'bg-purple-400'}`}>
                            {proposals[current - 1].type}
                        </div>

                        <h3 className="text-xl font-bold text-white mb-4 mt-2">{proposals[current - 1].title}</h3>
                        <p className="text-gray-300 text-sm mb-6 min-h-[80px]">{proposals[current - 1].desc}</p>

                        <div className="flex justify-between items-center border-t border-gray-700 pt-4">
                            <span className="text-gray-400 text-xs">COST: {proposals[current - 1].cost}</span>
                            <div className="flex gap-3">
                                <button onClick={() => handleVote(false)} className="bg-red-900/30 hover:bg-red-600 border border-red-600 text-white px-4 py-2 rounded-lg transition text-sm">رفض 👎</button>
                                <button onClick={() => handleVote(true)} className="bg-green-900/30 hover:bg-green-600 border border-green-600 text-white px-4 py-2 rounded-lg transition text-sm">موافقة 👍</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {state === 'result' && (
                <GameResult
                    status={calculateScore() === 3 ? 'success' : 'fail'}
                    title={calculateScore() === 3 ? "قرارات صائبة!" : "مراجعة القرارات"}
                    desc={calculateScore() === 3 ? "لقد دعمت التطوير وSecurity، وتجنبت هدر الموارد. هذه القرارات تساهم في استدامة ونمو الشبكة." : "لقد وافقت على مشاريع ضعيفة أو رفضت مشاريع مهمة. إدارة الموارد تتطلب التدقيق في الجدوى والفائدة."}
                    lesson="الحوكمة (Governance) في Ethereum تعتمد على مشاركة المجتمع في اتخاذ القرارات لضمان التطور المستمر والشفافية في استخدام الموارد."
                    score={35}
                    isCompleted={isCompleted}
                    onAction={() => calculateScore() === 3 ? (onComplete(35, 'governor'), onExit()) : (setCurrent(1), setState('voting'))}
                    actionText={calculateScore() === 3 ? "خروج" : "إعادة التصويت"}
                />
            )}
        </StoryContainer>
    );
};

const EngineerGame: React.FC<{ onComplete: (s: number, id: string) => void, onExit: () => void, isCompleted?: boolean, userName?: string }> = ({ onComplete, onExit, isCompleted, userName }) => {
    const [state, setState] = useState<'intro' | 'problem' | 'success'>('intro');
    const [selection, setSelection] = useState<number | null>(null);

    return (
        <StoryContainer title="لعبة: مهندس البروتوكول" role="Core Developer" icon={<Cpu className="text-cyan-400" />} onExit={onExit} userName={userName}>
            {state === 'intro' && (
                <GameIntro
                    mission="تحديث الشبكة"
                    roleDescription="أنت تعمل ضمن فريق تطوير البرمجيات الأساسية للشبكة."
                    objective="هناك ملاحظات من المستخدمين بأن إنشاء المعاملات المشفرة يستغرق وقتاً طويلاً ويتطلب أجهزة قوية. مهمتك هي اختيار الحل التقني المناسب لتحسين الأداء."
                    onStart={() => setState('problem')}
                    isCompleted={isCompleted}
                    userName={userName}
                />
            )}

            {state === 'problem' && (
                <div className="flex flex-col h-full justify-center space-y-6">
                    <h3 className="text-center text-white font-bold mb-4">اختر الحل الهندسي:</h3>

                    <button onClick={() => setSelection(1)} className={`p-4 rounded-xl border-2 text-right transition ${selection === 1 ? 'border-red-500 bg-red-900/10' : 'border-gray-700 bg-gray-800'}`}>
                        <h4 className="font-bold text-white">إلغاء التشفير (Remove Encryption)</h4>
                        <p className="text-xs text-gray-400">سنجعل المعاملات سريعة جداً، ولكن سنضطر للتخلي عن ميزة الخصوصية.</p>
                    </button>

                    <button onClick={() => { setSelection(2); setTimeout(() => setState('success'), 1500); }} className={`p-4 rounded-xl border-2 text-right transition ${selection === 2 ? 'border-cyan-500 bg-cyan-900/10' : 'border-gray-700 bg-gray-800'}`}>
                        <h4 className="font-bold text-white">ترقية Sapling</h4>
                        <p className="text-xs text-gray-400">تطبيق خوارزميات رياضية متطورة لتحسين الكفاءة والسرعة دون التضحية بالخصوصية.</p>
                    </button>

                    {selection === 1 && <p className="text-red-400 text-center text-sm animate-bounce">تنبيه: الخصوصية هي جوهر النظام. لا ينصح بإلغائها.</p>}
                </div>
            )}

            {state === 'success' && (
                <GameResult
                    status="success"
                    title="تحديث ناجح!"
                    desc="تحديث Sapling كان نقلة نوعية. انخفض وقت إنشاء المعاملة بشكل كبير وأصبح بالإمكان إجراؤها بسهولة على الهواتف المحمولة."
                    lesson="التطوير التقني المستمر يهدف لجعْل التقنيات المعقدة (مثل التشفير) سهلة الاستخدام وسريعة للجميع."
                    score={45}
                    isCompleted={isCompleted}
                    onAction={() => (onComplete(45, 'engineer'), onExit())}
                    actionText="خروج"
                />
            )}
        </StoryContainer>
    );
};

const GuardianGame: React.FC<{ onComplete: (s: number, id: string) => void, onExit: () => void, isCompleted?: boolean, userName?: string }> = ({ onComplete, onExit, isCompleted, userName }) => {
    const [state, setState] = useState<'intro' | 'play' | 'result'>('intro');
    const [score, setScore] = useState(0);
    const [currentScenario, setCurrentScenario] = useState(0);

    const scenarios = [
        {
            text: "عميل يسأل: 'هل يمكنني مشاركة مفتاح المشاهدة (Viewing Key) مع المحاسب الخاص بي؟'",
            options: [
                { text: "نعم، هذا هو الغرض منه.", correct: true },
                { text: "لا! لا تشاركه مع أي أحد.", correct: false }
            ]
        },
        {
            text: "وصلتك رسالة تطلب 'الكلمات المفتاحية الـ 24' لتحديث المحفظة.",
            options: [
                { text: "أرسلها للدعم الفني.", correct: false },
                { text: "تجاهلها فوراً، لا أحد يطلب هذه الكلمات إلا بهدف السرقة.", correct: true }
            ]
        },
        {
            text: "شركة ترغب في استخدام النظام لدفع الرواتب بخصوصية وسهولة.",
            options: [
                { text: "استخدموا العناوين الموحدة (Unified Addresses).", correct: true },
                { text: "استخدموا التحويلات البنكية التقليدية.", correct: false }
            ]
        }
    ];

    const handleAnswer = (isCorrect: boolean) => {
        if (isCorrect) setScore(s => s + 1);
        if (currentScenario < 2) setCurrentScenario(c => c + 1);
        else setState('result');
    };

    return (
        <StoryContainer title="لعبة: الوعي الأمني" role="Support Guide" icon={<ShieldAlert className="text-orange-500" />} onExit={onExit} userName={userName}>
            {state === 'intro' && (
                <GameIntro
                    mission="توجيه المستخدمين"
                    roleDescription="أنت تقوم بدور المرشد للمستخدمين الجدد. هدفك هو مساعدتهم على استخدام النظام بشكل آمن وصحيح."
                    objective="أمامك 3 استفسارات شائعة. اختر الإجابة الصحيحة لحماية المستخدمين وضمان استخدامهم الأمثل للميزات."
                    onStart={() => setState('play')}
                    isCompleted={isCompleted}
                    userName={userName}
                />
            )}

            {state === 'play' && (
                <div className="flex flex-col h-full justify-center">
                    <div className="bg-orange-900/20 p-6 rounded-2xl border border-orange-500/50 mb-8 text-center">
                        <h4 className="text-orange-400 font-bold mb-4 text-xl">الموقف {currentScenario + 1}/3</h4>
                        <p className="text-white text-lg">{scenarios[currentScenario].text}</p>
                    </div>

                    <div className="grid gap-4">
                        {scenarios[currentScenario].options.map((opt, i) => (
                            <button
                                key={i}
                                onClick={() => handleAnswer(opt.correct)}
                                className="bg-gray-800 hover:bg-gray-700 p-4 rounded-xl text-right border border-gray-600 hover:border-white transition"
                            >
                                {opt.text}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {state === 'result' && (
                <GameResult
                    status={score === 3 ? 'success' : 'fail'}
                    title={score === 3 ? "مرشد متميز!" : "معلومات تحتاج لمراجعة"}
                    desc={score === 3 ? "أجوبتك صحيحة وتساهم في رفع الوعي الأمني لدى المستخدمين." : `لقد أجبت على ${score}/3 فقط بشكل صحيح. دقة المعلومات مهمة جداً للحفاظ على سلامة أصول المستخدمين.`}
                    lesson="الوعي الأمني هو أهم خطوة. التكنولوجيا توفر الأدوات، ولكن المستخدم هو المسؤول عن حماية بياناته ومفاتيحه."
                    score={25}
                    isCompleted={isCompleted}
                    onAction={() => score === 3 ? (onComplete(25, 'guardian'), onExit()) : (setScore(0), setCurrentScenario(0), setState('play'))}
                    actionText={score === 3 ? "خروج" : "إعادة الاختبار"}
                />
            )}
        </StoryContainer>
    );
};

const GamesHub: React.FC<{ onScore: (s: number, id: string) => void, completedGames?: string[], userName?: string, onGuestAccess?: () => void }> = ({ onScore, completedGames = [], userName, onGuestAccess }) => {
    const [selectedGame, setSelectedGame] = useState<string | null>(null);

    const games = [
        { id: 'miner', title: '1. تشغيل العقدة', desc: 'معالجة المعاملات وإنشاء البلوك', icon: <Pickaxe className="text-yellow-500" />, color: 'border-yellow-600' },
        { id: 'sender', title: '2. التحويل الآمن', desc: 'خيارات الدفع والخصوصية (متقدم)', icon: <Smartphone className="text-blue-500" />, color: 'border-blue-600' },
        { id: 'receiver', title: '3. التدقيق المالي', desc: 'المشاركة الآمنة للبيانات', icon: <Eye className="text-green-500" />, color: 'border-green-600' },
        { id: 'verifier', title: '4. إثبات المعرفة', desc: 'مفهوم المعرفة الصفرية (Zk-SNARKs)', icon: <Network className="text-purple-500" />, color: 'border-purple-600' },
        { id: 'governor', title: '5. التصويت المجتمعي', desc: 'المشاركة في اتخاذ القرارات', icon: <Gavel className="text-blue-400" />, color: 'border-blue-400' },
        { id: 'engineer', title: '6. مهندس البروتوكول', desc: 'تطوير وتحسين أداء الشبكة', icon: <Cpu className="text-cyan-400" />, color: 'border-cyan-400' },
        { id: 'guardian', title: '7. الوعي الأمني', desc: 'أفضل ممارسات الاستخدام', icon: <ShieldAlert className="text-orange-500" />, color: 'border-orange-500' },
    ];

    const isGameCompleted = (id: string) => completedGames.includes(id);

    const renderGame = () => {
        switch (selectedGame) {
            case 'miner': return <MinerGame onExit={() => setSelectedGame(null)} onComplete={onScore} isCompleted={isGameCompleted('miner')} userName={userName} />;
            case 'sender': return <SenderGame onExit={() => setSelectedGame(null)} onComplete={onScore} isCompleted={isGameCompleted('sender')} userName={userName} />;
            case 'receiver': return <ReceiverGame onExit={() => setSelectedGame(null)} onComplete={onScore} isCompleted={isGameCompleted('receiver')} userName={userName} />;
            case 'verifier': return <VerifierGame onExit={() => setSelectedGame(null)} onComplete={onScore} isCompleted={isGameCompleted('verifier')} userName={userName} />;
            case 'governor': return <GovernorGame onExit={() => setSelectedGame(null)} onComplete={onScore} isCompleted={isGameCompleted('governor')} userName={userName} />;
            case 'engineer': return <EngineerGame onExit={() => setSelectedGame(null)} onComplete={onScore} isCompleted={isGameCompleted('engineer')} userName={userName} />;
            case 'guardian': return <GuardianGame onExit={() => setSelectedGame(null)} onComplete={onScore} isCompleted={isGameCompleted('guardian')} userName={userName} />;
            default: return null;
        }
    };

    if (selectedGame) {
        return (
            <div className="max-w-4xl mx-auto py-6 px-4">
                {renderGame()}
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto py-10 px-4">
            <div className="text-center mb-12 animate-fadeIn">
                <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
                    مختبر <span className="text-eth">Ethereum</span> التعليمي
                </h1>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                    مرحباً بك يا <span className="text-white font-bold">{userName || 'زائر'}</span>. استكشف كيفية عمل التقنيات المالية الحديثة من خلال محاكاة عملية للأدوار المختلفة في الشبكة.
                </p>
                {!userName && (
                    <div className="mt-4 inline-block bg-blue-900/30 border border-blue-500/30 px-4 py-2 rounded-full text-blue-200 text-sm">
                        👋 أنت تستخدم وضع التجربة. لن يتم حفظ التقدم إلا بعد تسجيل الدخول.
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {games.map((game, idx) => {
                    const done = isGameCompleted(game.id);
                    return (
                        <div
                            key={game.id}
                            onClick={() => setSelectedGame(game.id)}
                            className={`bg-gray-800 p-6 rounded-2xl border-2 ${done ? 'border-green-500/50 bg-green-900/10' : `${game.color} border-transparent`} hover:border-white cursor-pointer transition-all hover:-translate-y-2 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] group relative overflow-hidden animate-fadeIn`}
                            style={{ animationDelay: `${idx * 0.05}s` }}
                        >
                            <div className="flex items-center gap-4 mb-3">
                                <div className="bg-gray-900 p-3 rounded-xl shadow-inner group-hover:scale-110 transition-transform">
                                    {done ? <CheckCircle className="text-green-500" /> : game.icon}
                                </div>
                                <h3 className="font-bold text-lg text-white group-hover:text-eth transition-colors">{game.title}</h3>
                            </div>
                            <p className="text-gray-400 text-sm">{game.desc}</p>

                            <div className="mt-4 flex items-center text-xs font-bold text-gray-500 group-hover:text-white transition-colors">
                                {done ? <span className="text-green-400">مكتمل</span> : <>ابدأ التجربة <Share2 size={12} className="mr-1 rotate-180" /></>}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
};

export default GamesHub;

