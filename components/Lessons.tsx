
import React, { useState, useEffect, useRef } from 'react';
import { Eye, EyeOff, ShieldCheck, Key, Lock, Unlock, Home, ArrowLeft, RefreshCw, MessageSquare, Database, Coins, Wallet, FileKey, Zap, Globe, Landmark, ScanEye, Check, ChevronRight, Smartphone, ArrowDown, Shuffle, Info, AlertTriangle, Lightbulb, BrainCircuit, CheckCircle, Copy, QrCode, HelpCircle, Award, TrendingUp, Gavel, ShieldAlert, User, Shield, Box, FileText, Gamepad2, Trophy, Link as LinkIcon, Unlink, Hash, Cpu, Layers, Calendar, History, Search, GitGraph, Rocket, Snowflake, Flame, File } from 'lucide-react';

// --- SHARED TYPES ---
export interface LessonProps {
  onComplete: (points: number) => void;
  isCompleted?: boolean;
  userName?: string;
}

// --- QUIZ COMPONENT ---
const LessonQuiz = ({ 
  question, 
  options, 
  correctIndex, 
  onComplete 
}: { 
  question: string, 
  options: string[], 
  correctIndex: number, 
  onComplete: (points: number) => void 
}) => {
  const [selected, setSelected] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (idx: number) => {
    if (submitted && isCorrect) return; // Already won
    setSelected(idx);
    setSubmitted(true);
    
    if (idx === correctIndex) {
      setIsCorrect(true);
      onComplete(10); // Updated to 10 points
    } else {
      setIsCorrect(false);
    }
  };

  return (
    <div className="mt-12 border-t-2 border-gray-700 pt-8 animate-fadeIn">
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-600 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <HelpCircle size={100} className="text-إيثيريوم" />
        </div>
        
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2 relative z-10">
          <BrainCircuit className="text-إيثيريوم" /> 
          اختبار سريع (10 نقاط)
        </h3>
        
        <p className="text-lg text-gray-200 mb-6 font-medium relative z-10">{question}</p>
        
        <div className="space-y-3 relative z-10">
          {options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => handleSubmit(idx)}
              disabled={submitted && isCorrect}
              className={`w-full text-right p-4 rounded-lg border transition-all duration-300 flex justify-between items-center
                ${submitted && idx === correctIndex 
                  ? 'bg-green-900/50 border-green-500 text-green-200' 
                  : submitted && idx === selected && idx !== correctIndex
                    ? 'bg-red-900/50 border-red-500 text-red-200'
                    : 'bg-gray-700 border-gray-600 hover:bg-gray-600 text-gray-200 hover:border-إيثيريوم'
                }
              `}
            >
              <span>{opt}</span>
              {submitted && idx === correctIndex && <CheckCircle className="text-green-500" />}
              {submitted && idx === selected && idx !== correctIndex && <AlertTriangle className="text-red-500" />}
            </button>
          ))}
        </div>

        {submitted && isCorrect && (
          <div className="mt-6 bg-green-500/20 border border-green-500 rounded-lg p-4 flex items-center gap-3 animate-bounce">
            <Award className="text-yellow-400 w-8 h-8" />
            <div>
              <p className="font-bold text-green-400">إجابة صحيحة! 🎉</p>
              <p className="text-sm text-green-200">تم إضافة 10 نقاط لرصيدك.</p>
            </div>
          </div>
        )}
         {submitted && !isCorrect && (
          <div className="mt-6 bg-red-500/20 border border-red-500 rounded-lg p-4 text-center animate-shake">
            <p className="font-bold text-red-400">إجابة خاطئة، حاول مرة أخرى!</p>
          </div>
        )}
      </div>
    </div>
  );
};

// --- INTERACTIVE DEMOS ---
const SecurityDemo = () => {
    const [step, setStep] = useState(0);
    // Simulating a Spending Key (Private Key)
    const spendingKey = "SK_8372_XMAL"; 
    const [inputCode, setInputCode] = useState("");
    const [proofStatus, setProofStatus] = useState<'idle' | 'generating' | 'verified' | 'failed'>('idle');
  
    const generateProof = () => {
      if (inputCode !== spendingKey) {
        setProofStatus('failed');
        return;
      }
      setProofStatus('generating');
      setTimeout(() => {
        setProofStatus('verified');
        setStep(2);
      }, 2000);
    };
  
    return (
      <div className="bg-gradient-to-br from-blue-900/20 to-gray-900 border border-blue-700/50 p-6 rounded-xl my-6 shadow-lg">
        <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-500/20 p-2 rounded-full"><BrainCircuit size={24} className="text-blue-400"/></div>
            <h3 className="text-xl font-bold text-blue-300">محاكي: إثبات ملكية المفتاح (Blockchain Security)</h3>
        </div>
        
        <div className="bg-black/30 p-4 rounded-lg mb-6 text-sm text-gray-300 border-l-2 border-blue-500">
          <strong>المهمة:</strong> أثبت للشبكة أنك تملك <strong>مفتاح الإنفاق (Spending Key)</strong> لإنفاق العملة، دون أن تكشف المفتاح نفسه.
        </div>
  
        <div className="flex flex-col items-center gap-6 bg-gray-800/50 p-6 rounded-xl border border-gray-700">
          {step === 0 && (
            <div className="w-full text-center animate-fadeIn">
              <p className="mb-4 text-gray-400">هذا هو مفتاح الإنفاق السري الخاص بك (Spending Key):</p>
              <div className="text-2xl font-mono font-black text-إيثيريوم tracking-widest mb-8 drop-shadow-[0_0_10px_rgba(244,183,40,0.5)] border border-إيثيريوم/30 p-4 rounded bg-black/50">{spendingKey}</div>
              <button onClick={() => setStep(1)} className="bg-blue-600 px-8 py-3 rounded-full hover:bg-blue-500 font-bold text-white shadow-lg transform transition hover:scale-105">
                  حسناً، أريد إجراء معاملة
              </button>
            </div>
          )}
  
          {step === 1 && (
            <div className="flex flex-col items-center w-full max-w-sm animate-fadeIn">
              <label className="text-gray-400 mb-2 text-sm">أثبت ملكية المفتاح لإنشاء "الإثبات"</label>
              <input 
                type="text" 
                placeholder="أدخل المفتاح هنا..."
                className="w-full bg-gray-900 border border-gray-600 p-4 rounded-xl text-center text-xl mb-4 focus:border-إيثيريوم focus:outline-none transition-colors text-white placeholder-gray-700 font-mono"
                value={inputCode}
                onChange={(e) => { setInputCode(e.target.value); setProofStatus('idle'); }}
              />
              <button 
                onClick={generateProof}
                disabled={proofStatus === 'generating'}
                className={`font-bold px-6 py-3 rounded-xl w-full flex justify-center items-center gap-2 shadow-lg transition-all
                  ${proofStatus === 'generating' ? 'bg-gray-600 cursor-wait' : 'bg-إيثيريوم text-black hover:bg-إيثيريوم-dark hover:scale-[1.02]'}`}
              >
                {proofStatus === 'generating' ? (
                    <><RefreshCw className="animate-spin"/> جاري إنشاء zk-Proof...</>
                ) : (
                    <><ShieldCheck size={20}/> إنشاء الإثبات الرياضي</>
                )}
              </button>
              {proofStatus === 'failed' && <p className="text-red-500 mt-3 font-bold bg-red-900/20 px-4 py-2 rounded animate-shake">❌ المفتاح خطأ! لا يمكن إنشاء إثبات صحيح.</p>}
            </div>
          )}
  
          {step === 2 && (
            <div className="text-center animate-scaleIn">
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-green-500">
                <Check size={40} className="text-green-500" />
              </div>
              <h4 className="text-2xl font-bold text-green-400 mb-2">تم التحقق من الإثبات!</h4>
              <p className="text-gray-400 text-sm">أكدت الشبكة أنك المالك الحقيقي دون أن ترى مفتاحك السري.</p>
              <button onClick={() => {setStep(0); setInputCode(''); setProofStatus('idle')}} className="mt-6 text-sm text-gray-500 hover:text-white underline">إعادة التجربة</button>
            </div>
          )}
        </div>
      </div>
    );
};

// --- BLOCKCHAIN SIMULATOR (LESSON 1 ACTIVITY) ---
const BlockchainBuilder = () => {
    // Initial data matching the lesson text
    const [b1, setB1] = useState({ id: 1, data: "تحويل: محمد يرسل 3 عملات إلى علي", prevHash: "0000", hash: "" });
    const [b2, setB2] = useState({ id: 2, data: "تحويل: سارة ترسل 2 عملة إلى محمد", prevHash: "", hash: "" });
    const [b3, setB3] = useState({ id: 3, data: "تحويل: علي يرسل 1 عملة إلى سارة", prevHash: "", hash: "" });

    // Simple hash function for simulation
    const calcHash = (id: number, data: string, prev: string) => {
        let str = id + data + prev;
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = ((hash << 5) - hash) + str.charCodeAt(i);
            hash |= 0;
        }
        return Math.abs(hash).toString(16).padStart(8, '0');
    };

    // Calculate initial hashes (only runs once logically, but UI needs state)
    useEffect(() => {
        const h1 = calcHash(1, "تحويل: محمد يرسل 3 عملات إلى علي", "0000");
        setB1(p => ({ ...p, hash: h1 }));
        
        // Block 2 starts linked to Block 1's correct hash
        const h2 = calcHash(2, "تحويل: سارة ترسل 2 عملة إلى محمد", h1);
        setB2(p => ({ ...p, prevHash: h1, hash: h2 }));

        // Block 3 starts linked to Block 2's correct hash
        const h3 = calcHash(3, "تحويل: علي يرسل 1 عملة إلى سارة", h2);
        setB3(p => ({ ...p, prevHash: h2, hash: h3 }));
    }, []);

    const handleB1Change = (val: string) => {
        const h1 = calcHash(1, val, b1.prevHash);
        setB1(p => ({ ...p, data: val, hash: h1 }));
    };

    const handleB2Change = (val: string) => {
        const h2 = calcHash(2, val, b2.prevHash); // b2.prevHash doesn't update automatically to simulate "break"
        setB2(p => ({ ...p, data: val, hash: h2 }));
    };

    const handleB3Change = (val: string) => {
        const h3 = calcHash(3, val, b3.prevHash);
        setB3(p => ({ ...p, data: val, hash: h3 }));
    };

    const isB2Valid = b1.hash === b2.prevHash;
    const isB3Valid = b2.hash === b3.prevHash && isB2Valid;

    const resetChain = () => {
         const h1 = calcHash(1, "تحويل: محمد يرسل 3 عملات إلى علي", "0000");
         setB1({ id: 1, data: "تحويل: محمد يرسل 3 عملات إلى علي", prevHash: "0000", hash: h1 });
         
         const h2 = calcHash(2, "تحويل: سارة ترسل 2 عملة إلى محمد", h1);
         setB2({ id: 2, data: "تحويل: سارة ترسل 2 عملة إلى محمد", prevHash: h1, hash: h2 });
 
         const h3 = calcHash(3, "تحويل: علي يرسل 1 عملة إلى سارة", h2);
         setB3({ id: 3, data: "تحويل: علي يرسل 1 عملة إلى سارة", prevHash: h2, hash: h3 });
    };

    const BlockCard = ({ block, isValid, onChange, prevValid }: { block: any, isValid: boolean, onChange: (v: string) => void, prevValid: boolean }) => (
        <div className={`relative p-4 rounded-xl border-2 transition-all duration-300 ${isValid ? 'bg-gray-800 border-gray-600' : 'bg-red-900/20 border-red-500'}`}>
            <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-إيثيريوم">Block #{block.id}</span>
                {!isValid && <div className="flex items-center text-red-500 text-xs font-bold gap-1"><Unlink size={14}/> سلسلة مكسورة</div>}
                {isValid && <div className="flex items-center text-green-500 text-xs font-bold gap-1"><LinkIcon size={14}/> متصل</div>}
            </div>
            
            <div className="space-y-2 text-xs font-mono">
                <div>
                    <label className="text-gray-500 block">Data (البيانات)</label>
                    <input 
                        type="text" 
                        value={block.data} 
                        onChange={(e) => onChange(e.target.value)}
                        className={`w-full bg-gray-900 border rounded p-2 focus:outline-none focus:border-إيثيريوم text-white ${!isValid && block.id === 1 ? 'border-red-500' : 'border-gray-700'}`}
                    />
                </div>
                <div>
                    <label className="text-gray-500 block">Previous Hash (هاش السابق)</label>
                    <div className={`p-2 rounded bg-black/30 border truncate ${isValid && prevValid ? 'text-green-400 border-green-900' : 'text-red-400 border-red-900'}`}>
                        {block.prevHash}
                    </div>
                </div>
                <div>
                    <label className="text-gray-500 block">Hash (الهاش الحالي)</label>
                    <div className="p-2 rounded bg-black/50 border border-gray-700 text-gray-300 truncate">
                        {block.hash}
                    </div>
                </div>
            </div>

            {/* Down Arrow connector */}
            {block.id < 3 && (
                <div className={`absolute -bottom-6 left-1/2 -translate-x-1/2 z-10 p-1 rounded-full bg-gray-900 border-2 ${isValid && isB2Valid ? 'border-gray-600 text-gray-400' : 'border-red-500 text-red-500'}`}>
                    <ArrowDown size={16}/>
                </div>
            )}
        </div>
    );

    return (
        <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-700 my-8">
            <h3 className="text-center font-bold text-white mb-2 flex justify-center items-center gap-2"><Database className="text-blue-400"/> ابنِ البلوكشين بنفسك</h3>
            <p className="text-center text-sm text-gray-400 mb-6">جرب تغيير البيانات في <strong>الكتلة 1</strong> ولاحظ كيف يتغير الهاش وينكسر الرابط مع الكتل التالية.</p>
            
            <div className="space-y-6 max-w-sm mx-auto">
                <BlockCard block={b1} isValid={true} prevValid={true} onChange={handleB1Change} />
                <BlockCard block={b2} isValid={isB2Valid} prevValid={isB2Valid} onChange={handleB2Change} />
                <BlockCard block={b3} isValid={isB3Valid} prevValid={isB3Valid} onChange={handleB3Change} />
            </div>

            {(!isB2Valid || !isB3Valid) && (
                <div className="mt-6 text-center animate-fadeIn">
                     <button onClick={resetChain} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-full font-bold flex items-center gap-2 mx-auto">
                        <RefreshCw size={16}/> إعادة ضبط السلسلة
                     </button>
                     <p className="text-red-400 text-xs mt-2">تغيير البيانات في الماضي يكسر المستقبل!</p>
                </div>
            )}
        </div>
    );
};

// --- VISUAL BLOCKCHAIN COMPONENT ---
const VisualBlockchain = () => {
    return (
        <div className="grid md:grid-cols-2 gap-6 my-8">
            <div className="bg-gray-800 p-4 rounded-xl border border-gray-600">
                <h4 className="text-center font-bold text-white mb-4 border-b border-gray-700 pb-2 flex items-center justify-center gap-2"><Eye size={16}/> دفتر عام (Bitcoin)</h4>
                <div className="space-y-2 font-mono text-xs">
                    <div className="bg-black/50 p-3 rounded border-l-4 border-green-500 text-gray-300">
                        <div className="flex justify-between"><span>From:</span> <span className="text-white">Ahmed</span></div>
                        <div className="flex justify-between"><span>To:</span> <span className="text-white">Mohamed</span></div>
                        <div className="flex justify-between"><span>Amount:</span> <span className="text-green-400 font-bold">5.0 BTC</span></div>
                    </div>
                    <div className="bg-black/50 p-3 rounded border-l-4 border-green-500 text-gray-300">
                        <div className="flex justify-between"><span>From:</span> <span className="text-white">Mohamed</span></div>
                        <div className="flex justify-between"><span>To:</span> <span className="text-white">Sara</span></div>
                        <div className="flex justify-between"><span>Amount:</span> <span className="text-green-400 font-bold">2.5 BTC</span></div>
                    </div>
                </div>
                <p className="text-center text-gray-500 text-xs mt-4">الجميع يرى كل التفاصيل.</p>
            </div>

            <div className="bg-gray-800 p-4 rounded-xl border border-إيثيريوم">
                <h4 className="text-center font-bold text-white mb-4 border-b border-gray-700 pb-2 flex items-center justify-center gap-2"><Shield size={16}/> دفتر محمي (إيثيريوم)</h4>
                <div className="space-y-2 font-mono text-xs">
                    <div className="bg-black/50 p-3 rounded border-l-4 border-إيثيريوم text-gray-500 relative overflow-hidden group">
                         <div className="absolute inset-0 bg-gray-900/90 flex items-center justify-center text-إيثيريوم/50 font-bold tracking-widest backdrop-blur-sm">
                             ZK-PROOF
                         </div>
                        <div className="flex justify-between"><span>From:</span> <span>?????</span></div>
                        <div className="flex justify-between"><span>To:</span> <span>?????</span></div>
                        <div className="flex justify-between"><span>Amount:</span> <span>??? ETH</span></div>
                    </div>
                    <div className="bg-black/50 p-3 rounded border-l-4 border-إيثيريوم text-gray-500 relative overflow-hidden">
                         <div className="absolute inset-0 bg-gray-900/90 flex items-center justify-center text-إيثيريوم/50 font-bold tracking-widest backdrop-blur-sm">
                             ZK-PROOF
                         </div>
                        <div className="flex justify-between"><span>From:</span> <span>?????</span></div>
                        <div className="flex justify-between"><span>To:</span> <span>?????</span></div>
                        <div className="flex justify-between"><span>Amount:</span> <span>??? ETH</span></div>
                    </div>
                </div>
                <p className="text-center text-إيثيريوم text-xs mt-4">إثبات رياضي فقط (Blockchain Security)</p>
            </div>
        </div>
    );
};

// --- LESSON CONTENT COMPONENTS ---

const Section = ({title, children}: {title: string, children?: React.ReactNode}) => (
    <div className="mb-8">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <div className="w-1 h-6 bg-إيثيريوم rounded-full"></div>
            {title}
        </h3>
        <div className="text-gray-300 leading-relaxed space-y-4 text-lg">
            {children}
        </div>
    </div>
);

const KeyTakeaway = ({children}: {children?: React.ReactNode}) => (
    <div className="bg-إيثيريوم/10 border-l-4 border-إيثيريوم p-4 rounded-r-lg my-6">
        <h4 className="text-إيثيريوم font-bold mb-2 flex items-center gap-2"><Lightbulb size={18}/> معلومة جوهرية</h4>
        <div className="text-gray-200 text-sm md:text-base">{children}</div>
    </div>
);

// --- LESSONS ---

export const LessonZero: React.FC<LessonProps> = ({onComplete, isCompleted, userName}) => {
    // Lesson 1: What is Blockchain?
    return (
      <div className="animate-fadeIn text-right max-w-3xl mx-auto pb-20">
        <Section title="1. مقدمة بسيطة">
          <p>
            البلوكتشين (Blockchain) هو دفتر حسابات رقمي موزع يُسجّل بيانات (غالبًا معاملات مالية) بطريقة متسلسلة، آمنة، ومقاومة للتغيير.
          </p>
          <p>
            تخيّل صفحـات دفتر تُلصق ببعضها: كل صفحة (كتلة Block) تحتوي على مجموعة سجلات ولها «بصمة» رقمية تُربطها بالصفحة التي تسبقها.
          </p>
        </Section>

        <Section title="2. العناصر الأساسية للبنية">
             <div className="space-y-4">
                 <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
                    <h4 className="text-white font-bold mb-2 flex items-center gap-2"><Box size={18} className="text-إيثيريوم"/> الكتل (Blocks)</h4>
                    <p className="text-gray-400 text-sm">تحتوي على بيانات المعاملات، توقيت، ومؤشرات تشفيرية.</p>
                 </div>
                 <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
                    <h4 className="text-white font-bold mb-2 flex items-center gap-2"><Hash size={18} className="text-إيثيريوم"/> الهاش (Hash)</h4>
                    <p className="text-gray-400 text-sm">قيمة رقمية فريدة ناتجة عن عملية تشفير للبيانات داخل الكتلة. أي تغيير صغير في البيانات يعطي هاش مختلف كليًا.</p>
                 </div>
                 <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
                    <h4 className="text-white font-bold mb-2 flex items-center gap-2"><LinkIcon size={18} className="text-إيثيريوم"/> الربط بين الكتل</h4>
                    <p className="text-gray-400 text-sm">كل كتلة تخزن هاش الكتلة السابقة. هذا يجعل السلسلة متسلسلة وغير قابلة للتعديل بسهولة.</p>
                 </div>
                 <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-1 h-full bg-blue-500"></div>
                    <h4 className="text-white font-bold mb-2 flex items-center gap-2"><Cpu size={18} className="text-blue-400"/> آلية الإجماع (Consensus)</h4>
                    <p className="text-gray-400 text-sm mb-2">هي القواعد التي تتفق عليها العقد للتأكد من صحة البيانات. أشهرها:</p>
                    <ul className="list-disc list-inside text-xs text-gray-300 space-y-1">
                        <li><strong>Proof of Work (PoW):</strong> (إثبات العمل) يعتمد على التعدين واستهلاك الطاقة (مثل بيتكوين).</li>
                        <li><strong>Proof of Stake (PoS):</strong> (إثبات الحصة) يعتمد على تجميد العملات لضمان الشبكة (مثل إيثيريوم 2.0).</li>
                    </ul>
                 </div>
             </div>
        </Section>

        <BlockchainBuilder />

        <Section title="3. كيف تُمنع الاحتيالات عمليًا؟">
            <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>عند محاولة تعديل كتلة قديمة، يتغير هاشها ← كل الكتل اللاحقة تُصبح غير متطابقة مع ما في الشبكة ← العقد ترفض التغيير.</li>
                <li>لأن النسخة موزعة بين آلاف العقد، مهاجم واحد لا يستطيع تغيير السجل بنفسه دون السيطرة على نسبة كبيرة من الشبكة.</li>
            </ul>
        </Section>

        <Section title="4. أنواع بلوكتشين شائعة">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                <div className="bg-gray-900 p-3 rounded text-center border border-green-500/30">
                    <strong className="block text-green-400 mb-1">عام (Public)</strong>
                    <span className="text-gray-500">مفتوح للجميع (مثل Bitcoin)</span>
                </div>
                <div className="bg-gray-900 p-3 rounded text-center border border-blue-500/30">
                    <strong className="block text-blue-400 mb-1">خاص (Private)</strong>
                    <span className="text-gray-500">شركة واحدة تديره</span>
                </div>
                <div className="bg-gray-900 p-3 rounded text-center border border-purple-500/30">
                    <strong className="block text-purple-400 mb-1">مختلط (Consortium)</strong>
                    <span className="text-gray-500">مجموعة منظمات</span>
                </div>
            </div>
        </Section>

        <Section title="5. تطبيقات عملية (Applications)">
            <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
                <ul className="space-y-3 text-sm text-gray-300">
                    <li className="flex items-center gap-2"><Coins className="text-إيثيريوم" size={16}/> <strong>العملات الرقمية:</strong> نقل الأموال والقيمة بلا وسيط (بنوك).</li>
                    <li className="flex items-center gap-2"><FileText className="text-blue-400" size={16}/> <strong>العقود الذكية:</strong> برامج تنفذ تلقائياً عند تحقق شروط معينة.</li>
                    <li className="flex items-center gap-2"><Layers className="text-purple-400" size={16}/> <strong>سلاسل الإمداد:</strong> تتبع المنتجات من المصنع إلى المستهلك لمنع الغش.</li>
                    <li className="flex items-center gap-2"><User className="text-green-400" size={16}/> <strong>الهوية الرقمية:</strong> حماية بيانات المستخدمين والتحقق منها بخصوصية.</li>
                </ul>
            </div>
        </Section>

        <Section title="6. مصطلحات مهمة">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="border-r-2 border-إيثيريوم pr-4">
                     <strong className="text-white block">معاملة (Transaction)</strong>
                     <span className="text-sm text-gray-400">تبادل بيانات/قيمة بين طرفين.</span>
                 </div>
                 <div className="border-r-2 border-إيثيريوم pr-4">
                     <strong className="text-white block">محفظة (Wallet)</strong>
                     <span className="text-sm text-gray-400">برنامج يخزن المفاتيح الخاصة/العامة.</span>
                 </div>
                 <div className="border-r-2 border-red-500 pr-4">
                     <strong className="text-white block">مفتاح خاص (Private Key)</strong>
                     <span className="text-sm text-gray-400">سر يوقّع به المستخدم المعاملات.</span>
                 </div>
                 <div className="border-r-2 border-green-500 pr-4">
                     <strong className="text-white block">مفتاح عام (Public Key)</strong>
                     <span className="text-sm text-gray-400">عنوان يمكن للآخرين إرسال الأموال إليه.</span>
                 </div>
             </div>
        </Section>

        <KeyTakeaway>
            <strong className="block text-white mb-2">نصائح أمان للمبتدئين:</strong>
            1. لا تشارك مفتاحك الخاص مع أحد.<br/>
            2. استخدم محافظ موثوقة.<br/>
            3. احذر من الروابط الاحتيالية ورسائل التصيّد.
        </KeyTakeaway>

        <LessonQuiz 
            question="ما هو 'إثبات العمل' (PoW)؟"
            options={["آلية إجماع تعتمد على التعدين واستهلاك الطاقة", "تطبيق للمراسلة الفورية", "نوع من أنواع المحافظ", "طريقة لسرقة العملات"]}
            correctIndex={0}
            onComplete={onComplete}
        />
      </div>
    );
};

export const LessonOne: React.FC<LessonProps> = ({onComplete, isCompleted, userName}) => {
    // Lesson 2: What is إيثيريوم?
    return (
      <div className="animate-fadeIn text-right max-w-3xl mx-auto pb-20">
        
        {/* Info Card */}
        <div className="bg-gray-800 p-6 rounded-xl border-t-4 border-إيثيريوم shadow-lg mb-8">
            <h4 className="text-white font-bold mb-4 flex items-center gap-2"><Info className="text-إيثيريوم"/> بطاقة تعريفية</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
                <div className="bg-gray-900 p-3 rounded">
                    <span className="block text-gray-500 text-xs mb-1">سنة الإطلاق</span>
                    <strong className="text-white font-mono">2016</strong>
                </div>
                <div className="bg-gray-900 p-3 rounded">
                    <span className="block text-gray-500 text-xs mb-1">الرمز (Ticker)</span>
                    <strong className="text-إيثيريوم font-mono">ETH</strong>
                </div>
                <div className="bg-gray-900 p-3 rounded col-span-2 md:col-span-1">
                    <span className="block text-gray-500 text-xs mb-1">المؤسسون</span>
                    <strong className="text-white text-xs md:text-sm">Zooko Wilcox</strong>
                </div>
            </div>
        </div>

        <Section title="1. تعريف مبسّط">
          <p>
            إيثيريوم هي عملة رقمية مفتوحة المصدر تركز على الخصوصية. تُتيح للمستخدمين اختيار مستوى الخصوصية: إما معاملات شفافة مشابهة لبيتكوين، أو معاملات محمية تخفي كل التفاصيل (المرسل، المستقبل، المبلغ).
          </p>
        </Section>

        <Section title="2. لماذا ظهرت إيثيريوم؟">
            <p>
            في بيتكوين وكل سلسلة عامة، يمكن لأي شخص مشاهدة العناوين والمبالغ (مع بعض الجهد يمكن ربطها بأشخاص حقيقيين). إيثيريوم جاءت لتمنح خيارًا قويًا للخصوصية عبر تقنيات تشفير متقدّمة.
            </p>
        </Section>

        <Section title="3. أنواع العناوين والمعاملات">
            <div className="grid md:grid-cols-2 gap-4 mb-6">
                 <div className="bg-gray-800 p-4 rounded-xl border border-red-500/50">
                    <h4 className="text-red-400 font-bold mb-2">t-address (Transparent)</h4>
                    <p className="text-sm text-gray-300">تشبه عناوين البيتكوين — معلومة ومفتوحة للجميع.</p>
                 </div>
                 <div className="bg-gray-800 p-4 rounded-xl border border-إيثيريوم/50">
                    <h4 className="text-إيثيريوم font-bold mb-2">z-address (Shielded)</h4>
                    <p className="text-sm text-gray-300">عناوين محمية تخفي المعلومات باستعمال إثباتات تشفيرية.</p>
                 </div>
            </div>
            
            <h4 className="font-bold text-white mb-4">أنواع المعاملات:</h4>
            <div className="space-y-2 text-sm font-mono">
                <div className="flex items-center gap-4 bg-gray-900 p-2 rounded">
                    <span className="text-red-400 font-bold w-12 text-center">t → t</span>
                    <span className="text-gray-400">غير محمية (مرئية بالكامل)</span>
                </div>
                <div className="flex items-center gap-4 bg-gray-900 p-2 rounded">
                    <span className="text-yellow-500 font-bold w-12 text-center">t → z</span>
                    <span className="text-gray-400">شفافية من المرسل إلى محفظة محمية (Shielding)</span>
                </div>
                <div className="flex items-center gap-4 bg-gray-900 p-2 rounded">
                    <span className="text-yellow-500 font-bold w-12 text-center">z → t</span>
                    <span className="text-gray-400">من محفظة محمية إلى شفافة (Deshielding)</span>
                </div>
                <div className="flex items-center gap-4 bg-إيثيريوم/10 border border-إيثيريوم/30 p-2 rounded">
                    <span className="text-إيثيريوم font-bold w-12 text-center">z → z</span>
                    <span className="text-white">محمية بالكامل (لا يظهر المرسل، المستقبل، أو المبلغ)</span>
                </div>
            </div>
        </Section>

        <Section title="4. التقنية الأساسية: Blockchain Security">
            <div className="bg-blue-900/20 p-6 rounded-xl border border-blue-500/30">
                <p className="mb-4">
                    هي طريقة رياضية (إثبات المعرفة الصفرية) تسمح لواحد أن يثبت صحة معلومة (مثل: "أملك رصيدًا كافيًا") بدون الكشف عن المعلومة نفسها.
                </p>
                <div className="bg-black/40 p-4 rounded-lg text-center">
                    <p className="text-blue-300 italic">"أستطيع أن أثبت لك أنني أعرف كلمة السر، دون أن أخبرك ما هي كلمة السر."</p>
                </div>
            </div>
        </Section>

        {/* Technical Evolution Section */}
        <Section title="5. تطورات تقنية فارقة">
            <div className="relative border-r-2 border-gray-700 mr-3 space-y-8 py-4">
                <div className="relative">
                    <div className="absolute -right-[21px] top-1 bg-gray-900 border-2 border-إيثيريوم rounded-full w-4 h-4"></div>
                    <div className="mr-6">
                        <h4 className="text-white font-bold flex items-center gap-2"><Calendar size={16} className="text-gray-400"/> 2018: تحديث Sapling</h4>
                        <p className="text-sm text-gray-400 mt-1">نقلة نوعية حسّنت سرعة وكفاءة المعاملات المحمية بشكل كبير، مما جعل استخدام الخصوصية ممكناً على الهواتف المحمولة.</p>
                    </div>
                </div>
                <div className="relative">
                    <div className="absolute -right-[21px] top-1 bg-gray-900 border-2 border-blue-500 rounded-full w-4 h-4"></div>
                    <div className="mr-6">
                        <h4 className="text-white font-bold flex items-center gap-2"><History size={16} className="text-gray-400"/> 2020: تحديث Halo</h4>
                        <p className="text-sm text-gray-400 mt-1">قدّم Halo الأساس التشفيري الذي أزال لاحقًا الإعداد الموثوق بالكامل مع Orchard. لما يسمى "الإعداد الموثوق" (Trusted Setup). الآن الشبكة آمنة رياضياً بشكل كامل ولا تعتمد على أي بشر في إعدادها.</p>                     </div>
                </div>
                <div className="relative">
                    <div className="absolute -right-[21px] top-1 bg-gray-900 border-2 border-purple-500 rounded-full w-4 h-4"></div>
                    <div className="mr-6">
                        <h4 className="text-white font-bold flex items-center gap-2"><TrendingUp size={16} className="text-gray-400"/> التحديثات المستمرة</h4>
                        <p className="text-sm text-gray-400 mt-1">تحسينات مستمرة (مثل Orchard و Nu5) لزيادة الكفاءة ودعم الأصول المحمية مستقبلاً (ZSA).</p>
                    </div>
                </div>
            </div>
        </Section>
  
        <Section title="6. مزايا إيثيريوم">
            <ul className="space-y-2 text-gray-300 list-disc list-inside">
                <li><strong className="text-white">خصوصية اختيارية:</strong> المستخدم يقرر متى يستعمل الخصوصية.</li>
                <li><strong className="text-white">شفافية مرنة:</strong> يمكن التدقيق في حالات معينة إذا رغب المستخدم.</li>
                <li><strong className="text-white">تطور تشفيري مستمر:</strong> مشاريع وأبحاث لتحسين الكفاءة وSecurity.</li>
            </ul>
        </Section>

        <LessonQuiz 
            question="ما هي أهمية تحديث Sapling في عام 2018؟"
            options={["إطلاق عملة جديدة", "تسريع المعاملات المحمية وجعلها خفيفة للهواتف", "إلغاء الخصوصية تماماً", "تغيير شعار العملة"]}
            correctIndex={1}
            onComplete={onComplete}
        />
      </div>
    );
};

export const LessonTwo: React.FC<LessonProps> = ({onComplete, isCompleted, userName}) => {
  return (
    <div className="animate-fadeIn text-right max-w-3xl mx-auto pb-20">
      <Section title="كيف تثبت الحقيقة دون كشف السر؟">
        <p>
          تخيل أنك تريد إثبات أنك تملك توقيعاً بنكياً معتمداً لصرف شيك، لكنك لا تريد لأي شخص (ولا حتى موظف البنك) أن يرى شكل توقيعك الأصلي خوفاً من تزويره.
        </p>
        <p>
            هنا تأتي عبقرية <strong>Blockchain Security</strong> (إثبات المعرفة الصفرية). إنها تقنية تسمح لك بإثبات أنك تملك <strong>مفتاح الإنفاق (Spending Key)</strong>، دون أن تضطر لإظهار هذا المفتاح لأي أحد.
        </p>
        <p>
            في عالم إيثيريوم، هذه التقنية تسمح للمعاملة بأن تقول للشبكة رياضياً:
            <br/>
            <span className="text-إيثيريوم font-bold">"أنا أملك مفتاحاً صحيحاً (Spending Key) يخولني لصرف هذا المبلغ، وتوقيعي سليم، ولم أنفق هذه العملة من قبل."</span>
            <br/>
            وتقوم الشبكة بالتحقق من صحة هذا "الإثبات" والموافقة عليه، دون أن تعرف الشبكة من هو صاحب المفتاح، أو لمن أرسل، أو كم أرسل.
        </p>
      </Section>

      <Section title="المكونات الأساسية لـ zk-SNARK">
          <div className="grid gap-4">
              <div className="bg-gray-800 p-4 rounded-xl border-r-4 border-إيثيريوم">
                  <h4 className="text-white font-bold mb-2 flex items-center gap-2"><Key size={20} className="text-إيثيريوم"/> Proving Key (مفتاح الإثبات)</h4>
                  <p className="text-sm text-gray-400">يستخدمه المرسل لإنشاء "الإثبات" بناءً على البيانات السرية التي يملكها.</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-xl border-r-4 border-blue-500">
                  <h4 className="text-white font-bold mb-2 flex items-center gap-2"><Search size={20} className="text-blue-400"/> Verification Key (مفتاح التحقق)</h4>
                  <p className="text-sm text-gray-400">تستخدمه الشبكة (المعدنون) للتأكد من صحة الإثبات بسرعة فائقة ودون رؤية البيانات الأصلية.</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-xl border-r-4 border-green-500">
                  <h4 className="text-white font-bold mb-2 flex items-center gap-2"><FileText size={20} className="text-green-400"/> Proof (الإثبات)</h4>
                  <p className="text-sm text-gray-400">هو الملف الرقمي الصغير الناتج عن العملية. هو ما يتم إرساله للشبكة ليقول "صدقوني، المعادلة صحيحة!".</p>
              </div>
          </div>
      </Section>

      <SecurityDemo />

      <Section title="الحوض المحمي (The Shielded Pool)">
        <p>
           فكر في الحوض المحمي كأنه "غرفة آمنة" أو صندوق أسود. تدخل العملات إليه من جهات مختلفة، وبمجرد دخولها، تفقد أي رابط تفقد أي رابط قابل للتتبع علنيًا . عندما تخرج عملة من الطرف الآخر، لا يمكن لأي محلل في العالم أن يعرف من أين جاءت هذه العملة تحديداً داخل الحوض. هذا ما يضمن الخصوصية المطلقة.
        </p>
      </Section>

      <KeyTakeaway>
          إيثيريوم لا تخفي المعاملة عن طريق "كلمة سر" (Wallet Password)، بل تستخدم رياضيات معقدة (Blockchain Security) لإنشاء دليل قاطع على أن المعاملة صحيحة، مع إبقاء بيانات المرسل والمستقبل مشفرة تماماً.
      </KeyTakeaway>

      <LessonQuiz 
            question="ما هو مفتاح التحقق (Verification Key)؟"
            options={["المفتاح الذي يوقع المعاملة", "مفتاح تستخدمه الشبكة للتأكد من صحة الإثبات دون كشف البيانات", "كلمة سر المحفظة", "عنوان المرسل"]}
            correctIndex={1}
            onComplete={onComplete}
        />
    </div>
  );
};

export const LessonThree: React.FC<LessonProps> = ({onComplete, isCompleted, userName}) => {
    return (
      <div className="animate-fadeIn text-right max-w-3xl mx-auto pb-20">
        <Section title="ما الذي يتم إخفاؤه بالضبط؟">
            <p>عندما تستخدم معاملة محمية (Shielded Transaction) في إيثيريوم، يتم تشفير البيانات الحساسة بالكامل ولا يراها أحد على البلوكشين، بينما تظل بعض البيانات التقنية ظاهرة لعمل الشبكة:</p>
            <div className="grid grid-cols-2 gap-4 my-4">
                <div className="bg-gray-800 p-4 rounded border-t-4 border-green-500">
                    <h4 className="font-bold text-green-400 mb-2 flex items-center gap-2"><Check size={18}/> ما يتم إخفاؤه (الخصوصية):</h4>
                    <ul className="text-sm text-gray-300 space-y-2">
                        <li>📍 عنوان المرسل.</li>
                        <li>📍 عنوان المستلم.</li>
                        <li>💰 مبلغ المعاملة.</li>
                        <li>📝 الملاحظات (Memo).</li>
                        <li>💵 الرصيد المتبقي.</li>
                    </ul>
                </div>
                <div className="bg-gray-800 p-4 rounded border-t-4 border-yellow-500">
                    <h4 className="font-bold text-yellow-500 mb-2 flex items-center gap-2"><Eye size={18}/> ما يبقى ظاهراً (التقني):</h4>
                    <ul className="text-sm text-gray-300 space-y-2">
                        <li>⏰ وقت المعاملة (Timestamp).</li>
                        <li>🧱 رقم البلوك (Block Height).</li>
                        <li>💸 رسوم المعاملة (Fees).</li>
                    </ul>
                </div>
            </div>
        </Section>

        <Section title="لغة العناوين في إيثيريوم">
           <p>
               على عكس البنوك التي تستخدم أرقام حسابات (IBAN) متشابهة، إيثيريوم لديها أنواع عناوين مختلفة تحدد مستوى الخصوصية الذي تريده. فهم هذه الأنواع هو مفتاح استخدام العملة بشكل صحيح:
           </p>
           <ul className="space-y-4 mt-6 text-sm text-gray-300">
               <li className="bg-gray-800 p-6 rounded-lg border-r-4 border-red-500 shadow-lg">
                   <div className="flex justify-between items-center mb-2">
                        <strong className="text-white text-lg">T-Address (الشفاف)</strong>
                        <span className="bg-red-900 text-red-200 text-xs px-2 py-1 rounded">يبدأ بـ t1...</span>
                   </div>
                   <p>يعمل تماماً مثل Bitcoin. الرصيد والمعاملات مكشوفة للجميع على البلوكشين. يُستخدم غالباً من قبل المنصات القديمة.</p>
               </li>
               <li className="bg-gray-800 p-6 rounded-lg border-r-4 border-إيثيريوم shadow-lg">
                   <div className="flex justify-between items-center mb-2">
                        <strong className="text-white text-lg">Z-Address (المحمي)</strong>
                        <span className="bg-yellow-900 text-yellow-200 text-xs px-2 py-1 rounded">يبدأ بـ zs...</span>
                   </div>
                   <p>عنوان الخصوصية. المعاملات منه وإليه مشفرة بالكامل. لا أحد يرى الرصيد ولا المبالغ.</p>
                   <p className="mt-2 text-xs text-yellow-500 font-bold bg-yellow-900/20 p-2 rounded border border-yellow-900/50">
                        ⚠️ ملاحظة: العناوين القديمة التي تبدأ بـ zc... (Sprout) لم تعد مستخدمة.
                   </p>
               </li>
               <li className="bg-gray-800 p-6 rounded-lg border-r-4 border-blue-500 shadow-lg relative overflow-hidden">
                   <div className="absolute top-0 left-0 bg-blue-600 text-white text-xs px-3 py-1 rounded-br">موصى به</div>
                   <div className="flex justify-between items-center mb-2">
                        <strong className="text-white text-lg">Unified Address (الموحد)</strong>
                        <span className="bg-blue-900 text-blue-200 text-xs px-2 py-1 rounded">يبدأ بـ u1...</span>
                   </div>
                   <p>الابتكار الأحدث. هو عنوان واحد ذكي يحتوي بداخله على جميع أنواع العناوين الأخرى. عندما يعطيك شخص عنواناً موحداً، محفظتك ستختار تلقائياً الطريقة الأكثر أماناً وخصوصية للإرسال.</p>
               </li>
           </ul>
        </Section>
        
        <Section title="الملاحظات المشفرة (Encrypted Memos)">
            <p>
                ميزة رائعة في إيثيريوم هي القدرة على إرفاق رسالة نصية مع المعاملة. في البنوك والبيتكوين، هذه الرسائل قد تكون مكشوفة. في إيثيريوم المحمية، هذه الرسائل مشفرة تماماً ولا يقرؤها إلا المستلم. يمكنك استخدامها لإرسال رقم فاتورة، رسالة شكر، أو حتى ملاحظات شخصية بأمان تام.
            </p>
        </Section>

        <KeyTakeaway>
            للحصول على أفضل تجربة، استخدم دائماً العنوان الموحد (Unified Address) لأنه يضمن لك أقصى درجات الخصوصية والتوافق مع التحديثات المستقبلية.
        </KeyTakeaway>

        <LessonQuiz 
            question="أي عنوان يوفر الخصوصية الكاملة (المحمي)؟"
            options={["العنوان الذي يبدأ بـ T", "العنوان الذي يبدأ بـ Z (أو الموحد U)", "عنوان البريد الإلكتروني", "رقم الهاتف"]}
            correctIndex={1}
            onComplete={onComplete}
        />
      </div>
    );
  };

export const LessonFour: React.FC<LessonProps> = ({onComplete, isCompleted, userName}) => {
    return (
        <div className="animate-fadeIn text-right max-w-3xl mx-auto pb-20">
            <Section title="قصة التطور التقني">
                <p>
                    مثل أي برنامج كمبيوتر، مرت إيثيريوم بمراحل تطوير هائلة. الهدف دائماً كان: <span className="text-إيثيريوم font-bold">جعل الخصوصية أسرع وأسهل للجميع.</span>
                </p>
            </Section>

            <div className="space-y-8 relative before:absolute before:inset-0 before:mr-4 before:w-0.5 before:bg-gray-700 before:z-0">
                <div className="relative z-10 mr-0">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="w-8 h-8 rounded-full bg-gray-700 border-2 border-gray-500 flex items-center justify-center shrink-0">1</div>
                        <h3 className="text-xl font-bold text-gray-400">Sprout (البداية - 2016)</h3>
                    </div>
                    <div className="mr-12 bg-gray-800/50 p-4 rounded-xl border border-gray-700">
                        <p className="text-sm text-gray-300 mb-2">الجيل الأول من الخصوصية.</p>
                        <ul className="text-xs text-gray-400 list-disc list-inside">
                            <li>العناوين تبدأ بـ <strong>zc...</strong></li>
                            <li className="text-red-400">بطيء جداً (يحتاج دقائق لإنشاء معاملة).</li>
                            <li className="text-red-400">يتطلب ذاكرة RAM عالية.</li>
                        </ul>
                    </div>
                </div>

                <div className="relative z-10 mr-0">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="w-8 h-8 rounded-full bg-إيثيريوم border-2 border-white flex items-center justify-center shrink-0 text-black font-bold shadow-[0_0_15px_#3B82F6]">2</div>
                        <h3 className="text-xl font-bold text-white">Sapling (نقطة التحول - 2018)</h3>
                    </div>
                    <div className="mr-12 bg-gray-800 p-4 rounded-xl border border-إيثيريوم/50 shadow-lg">
                        <p className="text-sm text-white mb-2">الجيل الذي جعل إيثيريوم عملية للاستخدام اليومي.</p>
                        <ul className="text-xs text-gray-300 list-disc list-inside">
                            <li>العناوين تبدأ بـ <strong>zs...</strong></li>
                            <li className="text-green-400">سريع جداً (ثواني معدودة).</li>
                            <li className="text-green-400">خفيف، يعمل على الهواتف المحمولة بكفاءة.</li>
                        </ul>
                    </div>
                </div>

                <div className="relative z-10 mr-0">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="w-8 h-8 rounded-full bg-blue-600 border-2 border-blue-400 flex items-center justify-center shrink-0">3</div>
                        <h3 className="text-xl font-bold text-blue-300">Orchard (المستقبل - 2022)</h3>
                    </div>
                    <div className="mr-12 bg-gray-800/50 p-4 rounded-xl border border-blue-900/50">
                        <p className="text-sm text-gray-300 mb-2">نظام الخصوصية الأحدث والأكثر تطوراً.</p>
                        <ul className="text-xs text-gray-400 list-disc list-inside">
                            <li>يعتمد على تقنية <strong>Halo 2</strong> الثورية.</li>
                            <li>أزال الحاجة إلى الإعداد الموثوق (Trusted Setup)، مما جعل النظام Trustless بالكامل.</li>
                            <li>يدعم العناوين الموحدة (Unified Addresses).</li>
                        </ul>
                    </div>
                </div>
            </div>

            <Section title="مقارنة الأداء">
                <div className="grid grid-cols-2 gap-4 mt-6 text-center">
                    <div className="bg-red-900/20 p-4 rounded border border-red-500/30">
                        <h4 className="text-red-400 font-bold mb-2">الماضي (Sprout)</h4>
                        <p className="text-2xl font-mono">~40 ثانية</p>
                        <p className="text-xs text-gray-500">لإنشاء الإثبات</p>
                    </div>
                    <div className="bg-green-900/20 p-4 rounded border border-green-500/30">
                        <h4 className="text-green-400 font-bold mb-2">الآن (Sapling/Orchard)</h4>
                        <p className="text-2xl font-mono text-white">~2 ثانية</p>
                        <p className="text-xs text-gray-500">لإنشاء الإثبات</p>
                    </div>
                </div>
            </Section>

            <LessonQuiz 
                question="ما الميزة الرئيسية التي قدمها تحديث Halo 2 في Orchard؟"
                options={["تغيير لون العملة", "إلغاء الحاجة للإعداد الموثوق (Trusted Setup)", "زيادة رسوم المعاملات", "إيقاف التعدين"]}
                correctIndex={1}
                onComplete={onComplete}
            />
        </div>
    );
};

export const LessonFive: React.FC<LessonProps> = ({onComplete, isCompleted, userName}) => {
    return (
        <div className="animate-fadeIn text-right max-w-3xl mx-auto pb-20">
            <Section title="أنت البنك الآن!">
                <p>
                    في عالم العملات الرقمية اللامركزية، لا يوجد "موظف بنك" لتتصل به إذا نسيت كلمة المرور. أنت المسؤول الوحيد عن أموالك. هذه مسؤولية كبيرة، لكنها تمنحك حرية مطلقة.
                </p>
            </Section>

            <div className="bg-gray-800 p-6 rounded-xl border border-purple-500/50 mb-8">
                <h4 className="text-purple-400 font-bold text-xl mb-4 flex items-center gap-2"><Key size={24}/> كلمات الاسترجاع (Seed Phrase)</h4>
                <div className="space-y-4 text-sm text-gray-300">
                    <p>هي عبارة عن 12 أو 24 كلمة إنجليزية عشوائية. هذه الكلمات هي "الجذر" الذي تنبت منه كل بياناتك.</p>
                    <div className="bg-black/40 p-4 rounded-lg font-mono text-xs border-r-2 border-purple-500 flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            <span className="bg-purple-600 text-white px-2 py-1 rounded">1. الكلمات (Seed)</span>
                            <ArrowLeft size={14} className="text-gray-500"/>
                            <span className="text-gray-400">الأصل (يجب حفظه بأمان تام)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="bg-red-600 text-white px-2 py-1 rounded">2. المفتاح الخاص (Private Key)</span>
                            <ArrowLeft size={14} className="text-gray-500"/>
                            <span className="text-gray-400">للتوقيع والإنفاق (مشتق من الكلمات)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="bg-blue-600 text-white px-2 py-1 rounded">3. المفتاح العام (Public Key)</span>
                            <ArrowLeft size={14} className="text-gray-500"/>
                            <span className="text-gray-400">للمشاهدة (مشتق من الخاص)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="bg-green-600 text-white px-2 py-1 rounded">4. العناوين (Addresses)</span>
                            <ArrowLeft size={14} className="text-gray-500"/>
                            <span className="text-gray-400">t1.., zs1.., u1.. (مشتقة من العام)</span>
                        </div>
                    </div>
                    <p className="text-red-400 font-bold text-xs mt-2">⚠️ كلمات الاسترجاع = الوصول الكامل لكل أموالك وعناوينك وتاريخك!</p>
                </div>
            </div>

            <Section title="أنواع المحافظ (من الأقل للأكثر أماناً)">
                <div className="grid gap-4">
                    <div className="bg-gray-800 p-4 rounded-xl border-r-4 border-orange-500 flex items-start gap-3">
                        <div className="bg-orange-500/20 p-2 rounded-full"><Flame size={20} className="text-orange-500"/></div>
                        <div>
                            <h4 className="font-bold text-white">1. محافظ ساخنة (Hot Wallets)</h4>
                            <p className="text-xs text-gray-400 mt-1">تطبيقات على الهاتف أو الكمبيوتر متصلة بالإنترنت. سهلة الاستخدام ومناسبة للمصروف اليومي.</p>
                            <p className="text-xs text-إيثيريوم mt-1 font-mono">أمثلة: Zashi, Nighthawk, YWallet</p>
                        </div>
                    </div>
                    
                    <div className="bg-gray-800 p-4 rounded-xl border-r-4 border-blue-500 flex items-start gap-3">
                        <div className="bg-blue-500/20 p-2 rounded-full"><Snowflake size={20} className="text-blue-500"/></div>
                        <div>
                            <h4 className="font-bold text-white">2. محافظ باردة (Cold Wallets)</h4>
                            <p className="text-xs text-gray-400 mt-1">أجهزة صغيرة تشبه الفلاش ميموري. مفاتيحك لا تلمس الإنترنت أبداً. الأفضل للمبالغ الكبيرة.</p>
                            <p className="text-xs text-إيثيريوم mt-1 font-mono">أمثلة: Ledger, Trezor</p>
                        </div>
                    </div>

                    <div className="bg-gray-800 p-4 rounded-xl border-r-4 border-gray-500 flex items-start gap-3">
                        <div className="bg-gray-500/20 p-2 rounded-full"><File size={20} className="text-gray-400"/></div>
                        <div>
                            <h4 className="font-bold text-white">3. محافظ ورقية (Paper Wallets)</h4>
                            <p className="text-xs text-gray-400 mt-1">طباعة الكلمات أو المفاتيح على ورقة وحفظها في خزنة. آمنة جداً ضد الهاكرز لكن الورق قد يتلف.</p>
                        </div>
                    </div>
                </div>
            </Section>
            
            <div className="bg-red-900/20 p-6 rounded-xl border border-red-500 mb-8 shadow-lg">
                <h4 className="text-red-400 font-bold mb-4 flex items-center gap-2"><ShieldAlert size={24}/> تحذير: أساليب الاحتيال الشائعة</h4>
                <ul className="space-y-4 text-sm text-gray-300">
                    <li className="flex items-start gap-2">
                        <span className="text-red-500 font-bold">1.</span>
                        <div>
                            <strong className="text-white block">المواقع المزيفة (Phishing)</strong>
                            تأكد دائماً من الرابط. المحتالون ينشئون مواقع تشبه الأصلية تماماً (مثلاً إيثيريوم.co بدلاً من إيثيريوم.com) لسرقة كلماتك.
                        </div>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-red-500 font-bold">2.</span>
                        <div>
                            <strong className="text-white block">خدعة "الدعم الفني"</strong>
                            <span className="bg-red-900/50 px-2 py-1 rounded text-red-200 block mt-1 border border-red-800">قاعدة ذهبية: لا يوجد موظف دعم في العالم يطلب منك كلمات الاسترجاع.</span>
                            أي شخص يطلبها منك على تيليجرام أو تويتر هو لص فوراً.
                        </div>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-red-500 font-bold">3.</span>
                        <div>
                            <strong className="text-white block">عروض "المضاعفة"</strong>
                            "أرسل لي 1 ETH وسأعيدها لك 2 ETH". هذه كذبة قديمة ومستمرة. لا أحد يوزع المال مجاناً.
                        </div>
                    </li>
                </ul>
            </div>

            <Section title="ماذا لو فقدت الكلمات؟ (سيناريوهات الرعب)">
                <div className="space-y-4">
                    <div className="bg-red-900/10 p-4 rounded border-r-4 border-red-600">
                        <strong className="text-red-400 block mb-1">❌ السيناريو 1: فقدت الورقة + هاتفك ضاع/تعطل</strong>
                        <p className="text-gray-400 text-sm">النتيجة: <span className="text-red-500 font-bold">أموالك ضاعت للأبد.</span> لا يمكن لأي قوة في الأرض استرجاعها. الرياضيات لا ترحم.</p>
                    </div>
                    <div className="bg-yellow-900/10 p-4 rounded border-r-4 border-yellow-500">
                        <strong className="text-yellow-400 block mb-1">⚠️ السيناريو 2: فقدت الورقة + هاتفك لا يزال يعمل</strong>
                        <p className="text-gray-400 text-sm">الحل: أنشئ محفظة جديدة فوراً (واكتب كلماتها)، ثم حول كل أموالك من المحفظة القديمة للجديدة بسرعة.</p>
                    </div>
                    <div className="bg-orange-900/10 p-4 rounded border-r-4 border-orange-500">
                        <strong className="text-orange-400 block mb-1">🔓 السيناريو 3: شككت أن أحداً صور كلماتك</strong>
                        <p className="text-gray-400 text-sm">الحل: اعتبر محفظتك "محروقة". انقل أموالك لمحفظة جديدة فوراً. لا تنتظر.</p>
                    </div>
                </div>
            </Section>

            <KeyTakeaway>
                الفرق بين البنك والعملات الرقمية:
                في البنك، إذا نسيت كلمة السر، الموظف يساعدك.
                في إيثيريوم، <strong>أنت البنك</strong>. إذا ضاعت المفاتيح، ضاعت الخزنة.
            </KeyTakeaway>

            <LessonQuiz 
                question="طلب منك شخص على تيليجرام 'كلمات الاسترجاع' لحل مشكلة في محفظتك. ماذا تفعل؟"
                options={["أعطيه الكلمات فوراً", "أعطيه نصف الكلمات فقط", "أقوم بحظره فوراً لأنه محتال", "أرسل له صورة منها"]}
                correctIndex={2}
                onComplete={onComplete}
            />
        </div>
    );
};

export const LessonSix: React.FC<LessonProps> = ({onComplete, isCompleted, userName}) => {
    return (
        <div className="animate-fadeIn text-right max-w-3xl mx-auto pb-20">
            <Section title="الشفافية الاختيارية: الحل الوسط الذكي">
                <p>
                    يعتقد البعض خطأً أن إيثيريوم صممت لتكون "سرية" لتسهيل الأمور غير القانونية. هذا غير صحيح. إيثيريوم صممت لتكون "خاصة" لحماية الأبرياء، لكنها توفر أدوات قوية للامتثال والشفافية عند الحاجة.
                </p>
                <p>
                    تخيل أنك شركة تستخدم إيثيريوم. تريد أن تبقى معاملاتك سرية عن المنافسين (خصوصية)، لكنك تحتاج أن تثبت دخلك لمصلحة الضرائب أو للمدقق المالي (شفافية). كيف تحل هذه المعضلة؟
                </p>
            </Section>

            <Section title="الفرق بين المفاتيح (Keys Hierarchy)">
                <div className="grid md:grid-cols-2 gap-4 my-6">
                    <div className="bg-red-900/20 p-5 rounded-xl border border-red-500/50">
                        <h4 className="font-bold text-red-400 mb-2 flex items-center gap-2"><Key size={20}/> مفتاح الإنفاق (Spending Key)</h4>
                        <p className="text-sm text-gray-300">
                            هذا هو المفتاح "الحاكم". من يملكه يستطيع <strong>إرسال وصرف الأموال</strong>. يجب أن يبقى سرياً تماماً ولا تشاركه مع أحد أبداً.
                        </p>
                    </div>
                    <div className="bg-blue-900/20 p-5 rounded-xl border border-blue-500/50">
                        <h4 className="font-bold text-blue-400 mb-2 flex items-center gap-2"><ScanEye size={20}/> مفتاح المشاهدة (Viewing Key)</h4>
                        <p className="text-sm text-gray-300">
                            هذا المفتاح "للمراقبة فقط". من يملكه يستطيع <strong>رؤية المعاملات</strong> ولكنه <strong>لا يستطيع صرف مليم واحد</strong>. هذا هو المفتاح الذي تعطيه للمحاسب أو المدقق.
                        </p>
                    </div>
                </div>
            </Section>

            <Section title="مفتاح المشاهدة (Viewing Key)">
                <p>
                    باستخدام مفتاح المشاهدة، يمكنك كشف تاريخ معاملاتك لطرف ثالث (مثل مدقق حسابات) دون تعريض أموالك للخطر. هذا يثبت أن الخصوصية في إيثيريوم مرنة وليست عائقاً أمام القانون.
                </p>
            </Section>

            <LessonQuiz 
                question="ما فائدة مفتاح المشاهدة (Viewing Key)؟"
                options={["سرقة أموال الآخرين", "كشف البيانات لطرف محدد (مثل المحاسب) دون السماح بالإنفاق", "حذف المعاملات من البلوكشين", "تغيير كلمة سر المحفظة"]}
                correctIndex={1}
                onComplete={onComplete}
            />
        </div>
    )
}

export const LessonEight: React.FC<LessonProps> = ({onComplete, isCompleted, userName}) => {
    return (
        <div className="animate-fadeIn text-right max-w-3xl mx-auto pb-20">
             <Section title="رحلة المعاملة: خلف الكواليس">
                <p>
                    عندما تضغط زر "إرسال" في محفظتك، تحدث سلسلة من العمليات المعقدة في أجزاء من الثانية لضمان أمان وخصوصية أموالك. دعنا نتتبع هذه الرحلة بدقة تقنية:
                </p>
                
                <div className="space-y-6 mt-6">
                    {/* Step 1 */}
                    <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
                        <h4 className="text-white font-bold text-lg mb-2 flex items-center gap-2">
                            <span className="bg-gray-700 w-6 h-6 rounded-full flex items-center justify-center text-sm">1</span>
                            الإنشاء والبناء (على هاتفك)
                        </h4>
                        <div className="text-sm text-gray-300 space-y-1">
                            <p>محفظتك تقوم بـ:</p>
                            <ul className="list-disc list-inside text-xs text-gray-400 pr-4">
                                <li>إنشاء <strong>Note</strong> (وحدة قيمة محمية).</li>
                                <li>توليد <strong>Nullifier</strong> (لمنع الإنفاق المزدوج).</li>
                                <li>إنشاء <strong>Commitment</strong> (التزام مشفر بالقيمة).</li>
                                <li>تشفير البيانات للمستلم فقط (Encrypted Memo).</li>
                            </ul>
                            <p className="text-xs text-إيثيريوم font-bold mt-2">🔒 لا تغادر بياناتك الحقيقية هاتفك أبداً!</p>
                        </div>
                    </div>

                    {/* Step 2 */}
                    <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
                        <h4 className="text-white font-bold text-lg mb-2 flex items-center gap-2">
                            <span className="bg-gray-700 w-6 h-6 rounded-full flex items-center justify-center text-sm">2</span>
                            بناء الإثبات (zk-Proof Generation)
                        </h4>
                        <div className="text-sm text-gray-300">
                            <p>هاتفك يثبت رياضياً 4 أشياء:</p>
                            <ul className="list-disc list-inside text-xs text-gray-400 pr-4 mb-2">
                                <li>أنك تملك المفتاح الخاص (Spending Key).</li>
                                <li>أن الرصيد كافٍ.</li>
                                <li>أنك لم تنفق هذه العملة من قبل.</li>
                                <li>أن الحسابات صحيحة (المدخلات = المخرجات).</li>
                            </ul>
                            <div className="flex gap-4 text-xs font-mono text-blue-400">
                                <span>⏱ المدة: 2-6 ثوانٍ</span>
                                <span>📊 الحجم: ~2 KB فقط!</span>
                            </div>
                        </div>
                    </div>

                    {/* Step 3 */}
                    <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
                        <h4 className="text-white font-bold text-lg mb-2 flex items-center gap-2">
                            <span className="bg-gray-700 w-6 h-6 rounded-full flex items-center justify-center text-sm">3</span>
                            البث للشبكة (Broadcasting)
                        </h4>
                        <div className="text-sm text-gray-300">
                            <p>المحفظة ترسل للشبكة:</p>
                            <div className="flex flex-wrap gap-2 my-2">
                                <span className="bg-black px-2 py-1 rounded text-xs border border-gray-600">Nullifier</span>
                                <span className="bg-black px-2 py-1 rounded text-xs border border-gray-600">Commitment</span>
                                <span className="bg-black px-2 py-1 rounded text-xs border border-gray-600">zk-Proof</span>
                                <span className="bg-black px-2 py-1 rounded text-xs border border-gray-600">Memo</span>
                            </div>
                            <p className="text-xs text-red-400 font-bold">❌ لا تُرسل: المرسل، المستلم، أو المبلغ الصريح.</p>
                        </div>
                    </div>

                    {/* Step 4 */}
                    <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
                        <h4 className="text-white font-bold text-lg mb-2 flex items-center gap-2">
                            <span className="bg-gray-700 w-6 h-6 rounded-full flex items-center justify-center text-sm">4</span>
                            التحقق والتعدين (Mining & Verification)
                        </h4>
                        <div className="text-sm text-gray-300 space-y-2">
                            <div>
                                <strong className="text-white block text-xs">أ) التحقق (Verification):</strong>
                                <span className="text-xs text-gray-400">المعدنون يتحققون من الإثبات الرياضي فقط. (سريع جداً: ~6 ملي ثانية!).</span>
                            </div>
                            <div>
                                <strong className="text-white block text-xs">ب) التعدين (Mining):</strong>
                                <span className="text-xs text-gray-400">يتم ضم المعاملة لبلوك جديد عبر خوارزمية Equihash.</span>
                            </div>
                        </div>
                    </div>

                    {/* Step 5 */}
                    <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
                        <h4 className="text-white font-bold text-lg mb-2 flex items-center gap-2">
                            <span className="bg-gray-700 w-6 h-6 rounded-full flex items-center justify-center text-sm">5</span>
                            التأكيد وفك التشفير (Confirmation)
                        </h4>
                        <div className="text-sm text-gray-300">
                            <p className="text-xs mb-2">عندما يفتح المستلم محفظته:</p>
                            <ol className="list-decimal list-inside text-xs text-gray-400 pr-4">
                                <li>المحفظة تفحص البلوكشين.</li>
                                <li>تجد الـ Commitment الموجه لها.</li>
                                <li>تستخدم Viewing Key لفك التشفير.</li>
                                <li>تعرض المبلغ والرسالة على شاشته فقط.</li>
                            </ol>
                            <p className="text-xs text-green-400 font-bold mt-2">💡 المستلم فقط يرى التفاصيل - الشبكة لم ترها أبداً!</p>
                        </div>
                    </div>
                </div>
             </Section>

             <div className="bg-إيثيريوم/10 border-l-4 border-إيثيريوم p-4 rounded-r-lg my-6">
                <h4 className="text-إيثيريوم font-bold mb-2 flex items-center gap-2"><Lightbulb size={18}/> معلومة جوهرية</h4>
                <div className="text-gray-200 text-sm">
                    <strong>أهم ما في هذه الرحلة:</strong>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                        <li><strong>كل شيء يحدث محلياً (Client-Side):</strong> مفاتيحك لا تغادر جهازك أبداً.</li>
                        <li><strong>الشبكة عمياء:</strong> المعدنون يرون فقط "إثباتاً رياضياً" بأن المعاملة صحيحة، ولا يعرفون من أرسل لمن.</li>
                        <li><strong>عكس البنوك:</strong> في البنك، السيرفر يرى كل شيء. في إيثيريوم، الرياضيات تحميك من الجميع.</li>
                    </ul>
                </div>
            </div>

             <LessonQuiz 
                question="من يستطيع رؤية تفاصيل المعاملة المحمية (المبلغ والمرسل)؟"
                options={["المعدنون (Miners)", "شركة إيثيريوم", "لا أحد سوى أطراف المعاملة (المرسل والمستلم)", "جميع مستخدمي الإنترنت"]}
                correctIndex={2}
                onComplete={onComplete}
            />
        </div>
    )
}

export const LessonNine: React.FC<LessonProps> = ({onComplete, isCompleted, userName}) => {
    return (
        <div className="animate-fadeIn text-right max-w-3xl mx-auto pb-20">
            <Section title="البلوكشين: دفتر السجلات الأبدي">
                <p>
                    لفهم إيثيريوم، يجب أن نفهم الأساس الذي بنيت عليه: <strong>البلوكشين (Blockchain)</strong>.
                </p>
                <p>
                    تخيل البلوكشين كأنه "دفتر حسابات" عملاق ومشترك.
                    كل صفحة في هذا الدفتر تسمى <strong>بلوك (Block)</strong>.
                    هذا الدفتر ليس محفوظاً في بنك واحد، بل توجد نسخة منه لدى آلاف الأشخاص حول العالم.
                </p>
            </Section>

            <Section title="كيف نمنع التزوير؟">
                <p>
                    لكي نمنع أي شخص من تمزيق صفحة قديمة أو تعديل رقم فيها، نستخدم تقنية تسمى <strong>الهاش (Hash)</strong>. الهاش هو مثل "البصمة الرقمية" أو "الختم الشمعي".
                </p>
                <p>
                    كل صفحة جديدة تحتوي على بصمة الصفحة التي قبلها. إذا حاول أي شخص تغيير حرف واحد في صفحة قديمة، ستتغير بصمتها، وبالتالي لن تتطابق مع الصفحة التي تليها، وستكتشف الشبكة التزوير فوراً وترفضه. هذا ما يجعل البلوكشين "غير قابل للتعديل" (Immutable).
                </p>
            </Section>

            <Section title="الفرق الجوهري: دفتر مفتوح vs دفتر مشفر">
                <p className="mb-4">
                    <strong>Bitcoin:</strong> هو دفتر مفتوح. أي شخص يمكنه قراءة أي سطر: "حساب أ أرسل 5 عملات لحساب ب". شفافية كاملة.
                </p>
                <div className="bg-gray-800 p-4 rounded-xl border border-إيثيريوم/50">
                    <strong className="text-إيثيريوم block mb-2">إيثيريوم (المحمية):</strong>
                    <p className="text-sm text-gray-300">
                        تستخدم نفس تقنية البلوكشين القوية، لكن في المعاملات المحمية، <span className="text-white font-bold">لا تُسجل التفاصيل نفسها</span>، بل يُسجل <span className="text-white font-bold">"إثبات رياضي" (zk-SNARK Proof)</span> يؤكد صحة المعاملة دون كشف المرسل أو المستلم أو المبلغ.
                    </p>
                    <p className="mt-2 text-xs text-gray-400">
                        السطر موجود في الدفتر، لكنه عبارة عن رموز رياضية معقدة لا يفهمها إلا من يملك مفتاح فك التشفير (المستلم).
                    </p>
                </div>
            </Section>
            
            <VisualBlockchain />
            
            <LessonQuiz 
                question="ما الذي يتم تسجيله في البلوكشين العام عند إجراء معاملة إيثيريوم محمية؟"
                options={["اسم المرسل والمستلم بوضوح", "إثبات رياضي (Proof) يؤكد الصحة دون كشف البيانات", "لا يتم تسجيل شيء إطلاقاً", "صورة للمحفظة"]}
                correctIndex={1}
                onComplete={onComplete}
            />
        </div>
    )
}

export const LessonTen: React.FC<LessonProps> = ({onComplete, isCompleted, userName}) => {
    // Interactive Wallet Simulator
    const [screen, setScreen] = useState<'welcome' | 'create' | 'seed' | 'home' | 'receive' | 'send' | 'processing'>('welcome');
    const [balance, setBalance] = useState(0);
    const [txType, setTxType] = useState<'send' | 'receive' | null>(null);

    return (
        <div className="animate-fadeIn text-right max-w-3xl mx-auto pb-20">
             <Section title="التطبيق العملي: لنجرب بأنفسنا!">
                <p>
                    الآن بعد أن فهمت النظرية، حان وقت التجربة. قمنا بتصميم "محاكي محفظة" لتعيش تجربة إنشاء حساب واستخدام إيثيريوم دون أي مخاطرة.
                </p>
                <div className="bg-yellow-900/20 border border-yellow-500/50 p-4 rounded mb-6">
                    <p className="text-yellow-400 font-bold flex items-center gap-2"><Info/> ملاحظة:</p>
                    <p className="text-gray-300 text-sm">هذا محاكي تعليمي فقط. الأموال والمعاملات هنا وهمية ولا تنتقل للشبكة الحقيقية.</p>
                </div>
             </Section>

             {/* Phone Simulator */}
             <div className="mx-auto w-[300px] h-[600px] bg-black rounded-[40px] border-8 border-gray-800 shadow-2xl relative overflow-hidden flex flex-col">
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-800 rounded-b-xl z-20"></div>
                 
                 {/* SCREEN CONTENT */}
                 <div className="flex-1 bg-gray-900 text-white relative flex flex-col">
                     
                     {screen === 'welcome' && (
                         <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-6">
                             <div className="w-20 h-20 bg-إيثيريوم rounded-full flex items-center justify-center mb-4 shadow-[0_0_20px_#3B82F6]">
                                <ShieldCheck size={40} className="text-black"/>
                             </div>
                             <h3 className="text-2xl font-bold">مرحباً بك في Z-Wallet</h3>
                             <p className="text-gray-400 text-sm">محفظتك الآمنة للخصوصية المالية.</p>
                             <button onClick={() => setScreen('create')} className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold">إنشاء محفظة جديدة</button>
                             <button className="text-gray-500 text-sm">استرجاع محفظة قديمة</button>
                         </div>
                     )}

                     {screen === 'create' && (
                         <div className="flex-1 flex flex-col p-6 text-center">
                             <h3 className="text-xl font-bold mb-4">جارٍ الإنشاء...</h3>
                             <div className="flex-1 flex items-center justify-center">
                                 <RefreshCw className="animate-spin text-إيثيريوم" size={40} />
                             </div>
                             <p className="text-xs text-gray-500">نقوم بتوليد مفاتيح التشفير الخاصة بك...</p>
                             {setTimeout(() => setScreen('seed'), 2000) && null}
                         </div>
                     )}

                     {screen === 'seed' && (
                         <div className="flex-1 flex flex-col p-6 text-center">
                             <h3 className="text-xl font-bold text-red-400 mb-2">سر للغاية!</h3>
                             <p className="text-xs text-gray-400 mb-4">هذه كلمات الاسترجاع الخاصة بك. اكتبها واحفظها في مكان آمن.</p>
                             
                             <div className="grid grid-cols-3 gap-2 mb-6">
                                 {['witch', 'collapse', 'practice', 'feed', 'shame', 'open', 'despair', 'creek', 'road', 'again', 'ice', 'least'].map((w,i) => (
                                     <div key={i} className="bg-gray-800 p-1 rounded text-[10px] text-gray-300 border border-gray-700">{i+1}. {w}</div>
                                 ))}
                             </div>
                             
                             <div className="bg-red-900/50 p-2 rounded border border-red-500 mb-4">
                                <p className="text-[10px] text-red-200 font-bold">⚠️ تحذير: هذه كلمات تجريبية فقط! لا تستخدمها أبداً لمحفظة حقيقية.</p>
                             </div>

                             <button onClick={() => setScreen('home')} className="w-full bg-إيثيريوم text-black py-3 rounded-xl font-bold mt-auto">نسختها، تابع</button>
                         </div>
                     )}

                     {screen === 'home' && (
                         <div className="flex-1 flex flex-col p-6">
                             <div className="flex justify-between items-center mb-8">
                                 <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center"><User size={16}/></div>
                                 <div className="font-bold">المحفظة الرئيسية</div>
                                 <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center"><ScanEye size={16}/></div>
                             </div>

                             <div className="bg-gradient-to-br from-gray-800 to-black p-6 rounded-2xl border border-gray-700 shadow-xl mb-8 text-center">
                                 <p className="text-gray-400 text-sm mb-1">الرصيد الكلي</p>
                                 <h2 className="text-4xl font-bold text-white mb-1">{balance.toFixed(4)} <span className="text-sm text-إيثيريوم">ETH</span></h2>
                                 <p className="text-xs text-green-500">≈ ${(balance * 30).toFixed(2)} USD</p>
                             </div>

                             <div className="grid grid-cols-2 gap-4">
                                 <button onClick={() => setScreen('receive')} className="bg-gray-800 hover:bg-gray-700 p-4 rounded-xl flex flex-col items-center gap-2 transition">
                                     <div className="bg-green-500/20 p-2 rounded-full"><ArrowDown className="text-green-500"/></div>
                                     <span className="font-bold">استلام</span>
                                 </button>
                                 <button onClick={() => setScreen('send')} className="bg-gray-800 hover:bg-gray-700 p-4 rounded-xl flex flex-col items-center gap-2 transition">
                                     <div className="bg-blue-500/20 p-2 rounded-full"><Smartphone className="text-blue-500"/></div>
                                     <span className="font-bold">إرسال</span>
                                 </button>
                             </div>
                         </div>
                     )}

                     {screen === 'receive' && (
                         <div className="flex-1 flex flex-col p-6 text-center">
                             <button onClick={() => setScreen('home')} className="absolute top-4 left-4"><ArrowLeft/></button>
                             <h3 className="font-bold mb-6 mt-4">استلام ETH</h3>
                             
                             <div className="bg-white p-4 rounded-xl mx-auto mb-4">
                                 <QrCode size={120} className="text-black"/>
                             </div>
                             
                             <p className="text-xs text-gray-500 mb-2">عنوانك الموحد (Unified Address)</p>
                             <div className="bg-gray-800 p-3 rounded-lg flex items-center justify-between text-xs text-gray-300 font-mono mb-6">
                                 <span className="truncate">u1...8x9z...2m4k</span>
                                 <Copy size={14} className="text-إيثيريوم"/>
                             </div>

                             <button 
                                onClick={() => {
                                    setTxType('receive');
                                    setScreen('processing');
                                    setTimeout(() => {
                                        setBalance(b => b + 2.5);
                                        setScreen('home');
                                    }, 3000);
                                }} 
                                className="w-full bg-green-600 text-white py-3 rounded-xl font-bold mt-auto"
                             >
                                 محاكاة وصول دفعة (2.5 ETH)
                             </button>
                         </div>
                     )}

                     {screen === 'send' && (
                         <div className="flex-1 flex flex-col p-6 text-center">
                             <button onClick={() => setScreen('home')} className="absolute top-4 left-4"><ArrowLeft/></button>
                             <h3 className="font-bold mb-6 mt-4">إرسال محمي</h3>
                             
                             <div className="bg-gray-800 p-4 rounded-xl mb-4 text-right">
                                 <label className="text-xs text-gray-500">إلى:</label>
                                 <input type="text" placeholder="zs1..." className="w-full bg-transparent border-b border-gray-600 focus:outline-none py-2 font-mono text-sm"/>
                             </div>
                             
                             <div className="bg-gray-800 p-4 rounded-xl mb-6 text-right">
                                 <label className="text-xs text-gray-500">المبلغ:</label>
                                 <div className="flex items-center gap-2">
                                    <input type="number" placeholder="0.0" className="w-full bg-transparent border-b border-gray-600 focus:outline-none py-2 text-2xl font-bold"/>
                                    <span className="text-إيثيريوم font-bold">ETH</span>
                                 </div>
                             </div>

                             <button 
                                onClick={() => {
                                    setTxType('send');
                                    setScreen('processing');
                                    setTimeout(() => {
                                        setBalance(b => Math.max(0, b - 1.0));
                                        setScreen('home');
                                    }, 4000);
                                }} 
                                className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold mt-auto"
                             >
                                 إرسال الآن
                             </button>
                         </div>
                     )}

                    {screen === 'processing' && (
                        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4 bg-black/90 absolute inset-0 z-50">
                            <div className="relative">
                                <div className="absolute inset-0 bg-إيثيريوم blur-xl opacity-20 animate-pulse"></div>
                                <ShieldCheck size={60} className="text-إيثيريوم relative z-10 animate-bounce"/>
                            </div>
                            <h3 className="text-xl font-bold text-white">جاري المعالجة بخصوصية...</h3>
                            
                            <div className="text-xs text-left w-full max-w-[200px] space-y-2 font-mono text-gray-400">
                                <p className="flex items-center gap-2"><CheckCircle size={10} className="text-green-500"/> {txType === 'send' ? 'Creating Proof...' : 'Scanning Blocks...'}</p>
                                <p className="flex items-center gap-2 opacity-50"><CheckCircle size={10}/> {txType === 'send' ? 'Encrypting Memo...' : 'Decrypting Note...'}</p>
                                <p className="flex items-center gap-2 opacity-30"><CheckCircle size={10}/> Broadcasting...</p>
                            </div>
                        </div>
                    )}

                 </div>
                 
                 {/* HOME BAR */}
                 <div className="h-1 bg-white mx-auto w-1/3 mb-2 rounded-full opacity-50"></div>
             </div>

             <div className="mt-8 text-center">
                 <p className="text-gray-400 text-sm mb-4">هل نجحت في استلام وإرسال الأموال؟</p>
                 <LessonQuiz 
                    question="ما هو أول شيء يجب عليك فعله عند إنشاء محفظة جديدة؟"
                    options={["إرسال الأموال فوراً", "كتابة كلمات الاسترجاع (Seed Phrase) وحفظها", "مشاركة العنوان مع الجميع", "حذف التطبيق"]}
                    correctIndex={1}
                    onComplete={onComplete}
                />
             </div>
        </div>
    )
}

