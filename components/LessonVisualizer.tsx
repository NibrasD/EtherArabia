import React, { useState, useEffect } from 'react';
import {
    KeyRound, Zap, Shield, User as UserIcon, Ghost, Terminal, ArrowRight, SearchCode,
    Layers, Database, RefreshCw, Activity, ArrowLeftRight, Cpu, Link as LinkIcon,
    Lock, TrendingUp, Eye, Binary, FileSearch, ShieldAlert, Users, Fingerprint, DatabaseBackup, Wallet, Codesandbox, Search, Crosshair, ArrowDown, Network
} from 'lucide-react';

const BaseVisualizer: React.FC<{ children: React.ReactNode, title: string, subtitle: string, colorClass: string }> = ({ children, title, subtitle, colorClass }) => (
    <div className={`my-8 w-full bg-[#050510] p-6 md:p-8 rounded-2xl border ${colorClass} shadow-xl flex flex-col items-center justify-center relative overflow-hidden group`}>
        <div className={`absolute -inset-2 bg-gradient-to-r opacity-10 blur-xl group-hover:opacity-20 transition-opacity duration-1000 ${colorClass.replace('border-', 'from-').replace('/30', ' to-transparent')}`}></div>
        <div className="relative z-10 w-full flex flex-col items-center">
            {children}
            <div className="mt-8 text-center">
                <h4 className="text-xl font-black text-white mb-2">{title}</h4>
                <p className="text-gray-400 text-sm max-w-md mx-auto leading-relaxed">{subtitle}</p>
            </div>
        </div>
    </div>
);

const LessonVisualizer = ({ slug, sectionIndex, title }: { slug: string; sectionIndex: number; title?: string }) => {


    if (title?.includes('المفتاح الخاص')) {
        return (
            <BaseVisualizer title="المفتاح الخاص (Private Key)" subtitle="سلسلة تشفيرية تمنحك السيطرة الكاملة على أموالك. لا تدخله في أي موقع أبداً." colorClass="border-eth/30">
                <div className="relative w-32 h-32">
                    <div className="absolute inset-0 border-4 border-dashed border-eth/40 rounded-full animate-[spin_10s_linear_infinite]"></div>
                    <div className="absolute inset-2 bg-eth/10 rounded-full flex items-center justify-center animate-pulse">
                        <KeyRound size={48} className="text-eth" />
                    </div>
                </div>
            </BaseVisualizer>
        );
    }

    if (title?.includes('أنواع المحافظ')) {
        return (
            <div className="my-8 w-full grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                <div className="bg-red-900/10 border border-red-500/30 p-6 rounded-2xl flex flex-col items-center text-center group hover:border-red-500/60 transition-colors">
                    <div className="p-4 bg-red-500/20 rounded-full mb-4 group-hover:scale-110 transition-transform"><Zap size={32} className="text-red-500" /></div>
                    <h4 className="text-lg font-bold text-red-400 mb-2">محفظة ساخنة (Hot Wallet)</h4>
                    <p className="text-sm text-gray-400">برمجية متصلة بالإنترنت (مثل MetaMask). سهلة للاستخدام اليومي لكن عرضة لبرامج التصيد الخبيثة.</p>
                </div>
                <div className="bg-blue-900/10 border border-blue-500/30 p-6 rounded-2xl flex flex-col items-center text-center group hover:border-blue-500/60 transition-colors">
                    <div className="p-4 bg-blue-500/20 rounded-full mb-4 group-hover:scale-110 transition-transform"><Shield size={32} className="text-blue-500" /></div>
                    <h4 className="text-lg font-bold text-blue-400 mb-2">محفظة باردة (Cold Wallet)</h4>
                    <p className="text-sm text-gray-400">جهاز فعلي (مثل Ledger). يخزن المفتاح دون اتصال بالشبكة، يوفر Security الأقصى للأموال الكبيرة.</p>
                </div>
            </div>
        );
    }

    if (title?.includes('هجمات التصيد') || title?.includes('تحليل الموقع')) {
        return (
            <BaseVisualizer title="هجوم التصيد (Phishing Attack)" subtitle="المخترقون ينشئون واجهات مطابقة تماماً لواجهات المشاريع لسرقة توقيعك." colorClass="border-red-500/40">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 w-full px-4">
                    <div className="p-4 bg-gray-800 rounded-xl border border-gray-700 flex flex-col items-center w-28">
                        <UserIcon size={28} className="text-blue-400 mb-2" />
                        <span className="text-xs font-bold text-white">الضحية</span>
                    </div>
                    <div className="flex-1 flex flex-col items-center w-full min-w-[150px]">
                        <div className="w-full h-8 bg-gray-900 rounded border border-gray-700 flex items-center px-2 mb-2">
                            <Lock size={12} className="text-green-500 mr-2" />
                            <span className="text-gray-400 text-xs font-mono">https://</span>
                            <span className="text-red-400 text-xs font-mono font-bold border-b border-red-500 border-dashed">metamsk.io</span>
                        </div>
                        <div className="w-full relative h-1 bg-gray-800 rounded-full">
                            <div className="absolute top-0 left-0 h-full bg-red-500 w-1/2 animate-[slideRight_2s_ease-in-out_infinite_alternate]" style={{ animationName: 'pulse' }}></div>
                        </div>
                    </div>
                    <div className="p-4 bg-red-900/40 rounded-xl border border-red-500 flex flex-col items-center w-28 animate-[pulse_2s_infinite]">
                        <Ghost size={28} className="text-red-500 mb-2" />
                        <span className="text-xs font-bold text-red-200">المخترق</span>
                    </div>
                </div>
            </BaseVisualizer>
        );
    }


    if (title?.includes('غرفة الانتظار') || title?.includes('Mempool')) {
        return (
            <BaseVisualizer title="مراقبة الميمبول (The Mempool)" subtitle="جميع معاملاتك تنتظر هنا بوضوح تام للجميع قبل إدراجها في الكتلة القادمة." colorClass="border-yellow-500/30">
                <div className="flex items-center gap-4 w-full justify-between">
                    <div className="p-3 bg-blue-500/20 rounded-xl border border-blue-500"><UserIcon size={24} className="text-blue-400" /></div>
                    <div className="flex-1 h-12 bg-gray-900 rounded-xl relative overflow-hidden flex items-center justify-center px-2 gap-2 border border-yellow-500/20">
                        <div className="w-6 h-6 bg-gray-700 rounded-md"></div>
                        <div className="w-6 h-6 bg-blue-500 rounded-md animate-pulse"></div>
                        <div className="w-6 h-6 bg-red-500 rounded-md animate-bounce"></div>
                        <div className="w-6 h-6 bg-gray-700 rounded-md"></div>
                        <div className="w-6 h-6 bg-green-500 rounded-md"></div>
                        <span className="absolute top-1 left-2 text-[8px] text-gray-500 font-mono">MEMPOOL</span>
                    </div>
                    <div className="p-3 bg-yellow-500/20 rounded-xl border border-yellow-500"><Search size={24} className="text-yellow-400" /></div>
                </div>
            </BaseVisualizer>
        );
    }

    if (title?.includes('الكود هو القانون') || title?.includes('Solidity')) {
        return (
            <BaseVisualizer title="Immutable Smart Contracts" subtitle="بمجرد نزول الكود إلى بلوكشين إيثريوم، يصبح قانوناً غير قابل للتعديل." colorClass="border-purple-500/30">
                <div className="flex items-center justify-center gap-4 md:gap-8 w-full">
                    <div className="p-4 bg-gray-800 rounded-xl border border-gray-600 flex flex-col items-center">
                        <Codesandbox size={28} className="text-gray-400 mb-2" />
                        <span className="text-[10px] font-mono text-gray-400">Code.sol</span>
                    </div>
                    <ArrowRight size={20} className="text-purple-500" />
                    <div className="p-4 bg-purple-500/20 rounded-xl border border-purple-500 flex flex-col items-center animate-pulse">
                        <Terminal size={28} className="text-purple-400 mb-2" />
                        <span className="text-[10px] font-mono text-purple-300">Compile (EVM)</span>
                    </div>
                    <ArrowRight size={20} className="text-purple-500" />
                    <div className="p-4 bg-eth/20 rounded-xl border border-eth/50 flex flex-col items-center">
                        <DatabaseBackup size={28} className="text-eth mb-2" />
                        <span className="text-[10px] font-mono text-eth">Blockchain</span>
                    </div>
                </div>
            </BaseVisualizer>
        );
    }


    if (title?.includes('الهجوم التكراري') || slug === 'reentrancy-vulnerability-deepdive') {
        return (
            <BaseVisualizer title="هجوم Reentrancy المزدوج" subtitle="المهاجم يسحب الأموال مراراً وتكراراً قبل أن يقوم العقد الضحية بتحديث رصيد المهاجم." colorClass="border-red-500/40">
                <div className="flex justify-between items-center w-full px-2 md:px-8">
                    <div className="bg-red-950 border border-red-500 p-4 rounded-xl flex flex-col items-center w-1/3">
                        <Ghost className="text-red-500 mb-2" size={24} />
                        <span className="text-xs text-white font-bold mb-2">Attacker.sol</span>
                        <div className="text-[9px] font-mono text-red-300 bg-black/50 p-1 rounded w-full text-left">
                            func receive() {'{'} <br />&nbsp;&nbsp;victim.withdraw()<br />{'}'}
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col items-center justify-center relative h-32 px-4">
                        { }
                        <div className="relative w-full flex items-center justify-center mb-4">
                            <div className="absolute w-full border-t-2 border-dashed border-red-500"></div>
                            <span className="bg-[#050510] px-2 text-[10px] text-red-400 font-mono relative z-10">1. withdraw()</span>
                            <ArrowRight size={14} className="absolute right-0 text-red-500" />
                        </div>
                        { }
                        <div className="relative w-full flex items-center justify-center mb-4">
                            <div className="absolute w-full border-t-2 border-eth"></div>
                            <span className="bg-[#050510] px-2 text-[10px] text-eth font-mono relative z-10">2. send ETH</span>
                            <ArrowLeftRight size={14} className="absolute left-0 text-eth" />
                        </div>
                        { }
                        <div className="relative w-full flex items-center justify-center">
                            <div className="absolute w-full border-t-2 border-dashed border-red-500"></div>
                            <span className="bg-[#050510] px-2 text-[10px] text-red-400 font-mono relative z-10 animate-bounce">3. withdraw() LOOP!</span>
                            <ArrowRight size={14} className="absolute right-0 text-red-500" />
                        </div>
                    </div>

                    <div className="bg-blue-950 border border-blue-500 p-4 rounded-xl flex flex-col items-center w-1/3">
                        <Database className="text-blue-500 mb-2" size={24} />
                        <span className="text-xs text-white font-bold mb-2">Victim.sol</span>
                        <div className="text-[9px] font-mono text-blue-300 bg-black/50 p-1 rounded w-full text-left">
                            <span className="text-red-400">call.value()</span><br />
                            bal[msg.sender]=0
                        </div>
                    </div>
                </div>
            </BaseVisualizer>
        );
    }


    if (title?.includes('تشريح هجوم Flash Loan') || slug === 'flash-loans-security-risks') {
        return (
            <BaseVisualizer title="دورة هجوم Flash Loan" subtitle="اقتراض ملايين الدولارات دون ضمانات لتنفيذ هجوم على بروتوكول وإعادة القرض في نفس المعاملة (ثانية واحدة!)." colorClass="border-purple-500/40">
                <div className="grid grid-cols-5 gap-2 w-full text-center">
                    <div className="col-span-1 flex flex-col items-center">
                        <div className="bg-eth/20 p-3 rounded-full border border-eth/50 mb-2 animate-pulse"><Database className="text-eth" size={20} /></div>
                        <span className="text-[10px] font-bold text-gray-300">1. اقترض 10M$</span>
                    </div>
                    <div className="col-span-1 flex flex-col items-center justify-center text-purple-500"><ArrowRight size={16} /></div>
                    <div className="col-span-1 flex flex-col items-center">
                        <div className="bg-red-500/20 p-3 rounded-full border border-red-500 mb-2"><TrendingUp className="text-red-500" size={20} /></div>
                        <span className="text-[10px] font-bold text-gray-300">2. تلاعب بالسعر</span>
                    </div>
                    <div className="col-span-1 flex flex-col items-center justify-center text-purple-500"><ArrowRight size={16} /></div>
                    <div className="col-span-1 flex flex-col items-center">
                        <div className="bg-green-500/20 p-3 rounded-full border border-green-500 mb-2"><ShieldAlert className="text-green-500" size={20} /></div>
                        <span className="text-[10px] font-bold text-gray-300">3. اسحب الأرباح</span>
                    </div>
                </div>
                <div className="w-full mt-4 flex items-center justify-center">
                    <div className="w-3/4 border-b-2 border-t-2 border-purple-500/50 py-1 text-center bg-purple-900/20">
                        <span className="text-[10px] text-purple-300 font-mono">4. أعد القرض (10M$ + رسوم) وكل هذا في 1 Block</span>
                    </div>
                </div>
            </BaseVisualizer>
        );
    }

    if (title?.includes('ميكانيكا التلاعب') || title?.includes('هجوم الشطيرة') || slug === 'mev-strategies-and-sandwich-attacks') {
        return (
            <BaseVisualizer title="هجوم الشطيرة (MEV Sandwich Attack)" subtitle="الروبوت يكتشف صلاتك الكبيرة، يشتري قبلك ليرفع السعر، ثم يبيع لگ السعر المرتفع." colorClass="border-orange-500/40">
                <div className="flex flex-col gap-2 w-full max-w-sm mx-auto font-mono text-xs">
                    <div className="bg-red-900/40 border border-red-500 p-3 rounded-lg flex justify-between items-center shadow-lg transform -translate-y-1">
                        <span className="text-red-400 font-bold flex items-center"><Ghost size={14} className="mr-2" /> Bot Buy (Frontrun)</span>
                        <span className="text-gray-400">Eth Price: <span className="text-white">$3000</span></span>
                    </div>
                    <div className="bg-blue-900/40 border border-blue-500 p-3 rounded-lg flex justify-between items-center shadow-lg relative z-10 z-10 my-1">
                        <span className="text-blue-400 font-bold flex items-center"><UserIcon size={14} className="mr-2" /> User Buy</span>
                        <span className="text-gray-400">Eth Price: <span className="text-white">$3050</span></span>
                    </div>
                    <div className="bg-red-900/40 border border-red-500 p-3 rounded-lg flex justify-between items-center shadow-lg transform translate-y-1">
                        <span className="text-red-400 font-bold flex items-center"><Ghost size={14} className="mr-2" /> Bot Sell (Backrun)</span>
                        <span className="text-gray-400">Bot Profit: <span className="text-green-400">+$20K</span></span>
                    </div>
                </div>
            </BaseVisualizer>
        );
    }

    if (title?.includes('الأوراكل') || slug === 'oracle-manipulation-attacks') {
        return (
            <BaseVisualizer title="التلاعب بالأوراكل (Oracle Manipulation)" subtitle="لا تعتمد على منصة تداول واحدة (AMM) كأوراكل، السعر يمكن التلاعب به بسهولة." colorClass="border-cyan-500/40">
                <div className="flex w-full items-center justify-between">
                    <div className="flex flex-col items-center bg-gray-900 border border-gray-700 p-3 rounded-xl w-1/3">
                        <RefreshCw size={24} className="text-gray-400 mb-2" />
                        <span className="text-[10px] text-white">Uniswap V2</span>
                        <span className="text-xs font-bold text-red-500">Price: $1000 (Manipulated)</span>
                    </div>
                    <div className="text-cyan-500 flex flex-col items-center animate-pulse">
                        <Crosshair size={24} className="mb-1" />
                        <span className="text-[10px] text-cyan-400">Target Protocol</span>
                    </div>
                    <div className="flex flex-col items-center bg-gray-900 border border-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.2)] p-3 rounded-xl w-1/3">
                        <Network size={24} className="text-green-500 mb-2" />
                        <span className="text-[10px] text-white">Chainlink (Decentralized)</span>
                        <span className="text-xs font-bold text-green-400">Price: $10 (Real)</span>
                    </div>
                </div>
            </BaseVisualizer>
        );
    }


    if (title?.includes('أنواع البروكسي') || slug === 'proxy-patterns-logic-errors' || title?.includes('delegatecall')) {
        return (
            <BaseVisualizer title="نمط الترقية البروكسي (Proxy Pattern)" subtitle="يستدعي عقد الواجهة كود العقد الوظيفي عبر delegatecall، وتُحفظ البيانات في الواجهة." colorClass="border-indigo-500/40">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 w-full">
                    <div className="flex flex-col items-center w-1/4">
                        <UserIcon className="text-gray-400 mb-2" size={24} />
                        <span className="text-[10px] text-gray-500">المستخدم</span>
                    </div>
                    <ArrowRight size={16} className="text-indigo-500 hidden md:block" />
                    <div className="bg-indigo-950/50 border border-indigo-500 p-4 rounded-xl flex flex-col items-center w-1/3 shadow-[0_0_15px_rgba(99,102,241,0.3)]">
                        <Database className="text-indigo-400 mb-2" size={24} />
                        <span className="text-xs text-white font-bold">Proxy Contract</span>
                        <span className="text-[9px] text-indigo-300">يحتفظ بالحالة المتغيرة (State)</span>
                    </div>
                    <div className="flex flex-col items-center w-1/4 relative">
                        <div className="w-full flex justify-center items-center py-2">
                            <span className="text-[10px] font-mono text-yellow-500 bg-yellow-900/30 px-2 rounded-full absolute -top-2">delegatecall</span>
                            <ArrowRight size={16} className="text-yellow-500" />
                        </div>
                    </div>
                    <div className="bg-gray-800 border border-gray-600 p-4 rounded-xl flex flex-col items-center w-1/3 opacity-80 group-hover:opacity-100 transition-opacity">
                        <SearchCode className="text-gray-300 mb-2" size={24} />
                        <span className="text-xs text-white font-bold">Logic Contract (V1)</span>
                        <span className="text-[9px] text-gray-400">يحتوي كود البرمجة (Functions)</span>
                    </div>
                </div>
            </BaseVisualizer>
        );
    }

    if (title?.includes('جسور') || slug === 'cross-chain-bridge-attacks') {
        return (
            <BaseVisualizer title="آلية الجسور المتقاطعة (Cross-chain Bridge)" subtitle="يتم قفل الأصل (Lock) في السلسلة الأولى، ويتم صك (Mint) نسخة معادلة في السلسلة الثانية." colorClass="border-fuchsia-500/40">
                <div className="flex items-center justify-between w-full h-24 relative">
                    <div className="absolute top-1/2 left-0 w-full border-t border-dashed border-gray-600 -translate-y-1/2"></div>
                    <div className="bg-fuchsia-950 p-4 border border-fuchsia-500 rounded-full z-10 flex items-center justify-center flex-col shrink-0">
                        <Lock size={20} className="text-fuchsia-400 mb-1" />
                        <span className="text-[9px] font-bold text-white">Ethereum (Lock)</span>
                    </div>
                    <div className="bg-[#050510] border border-gray-700 px-4 py-2 rounded-lg z-10 shadow-lg text-[10px] text-gray-300 font-mono animate-pulse flex items-center gap-2">
                        <Activity size={14} className="text-yellow-500" /> Validators Verifying
                    </div>
                    <div className="bg-blue-950 p-4 border border-blue-500 rounded-full z-10 flex items-center justify-center flex-col shrink-0">
                        <Zap size={20} className="text-blue-400 mb-1" />
                        <span className="text-[9px] font-bold text-white">Arbitrum (Mint)</span>
                    </div>
                </div>
            </BaseVisualizer>
        );
    }

    if (title?.includes('صفر المعرفة') || slug === 'zk-proofs-and-ethereum-privacy') {
        return (
            <BaseVisualizer title="إثبات صفر المعرفة (Zero-Knowledge Proof)" subtitle="تثبت أنك تعرف السر دون الكشف عنه. ثورة في عالم الخصوصية والتوسع." colorClass="border-teal-500/40">
                <div className="flex justify-between items-center w-full px-2">
                    <div className="flex flex-col items-center">
                        <div className="bg-teal-900/30 p-4 rounded-xl border border-teal-500 mb-2"><Eye size={28} className="text-teal-400" /></div>
                        <span className="text-xs text-white font-bold">Prover (المُثبت)</span>
                        <span className="text-[9px] text-gray-400 py-1">أعرف السر (X)</span>
                    </div>
                    <div className="flex-1 flex flex-col items-center justify-center px-4 relative">
                        <ArrowRight className="text-teal-500/50 mb-1 absolute" size={40} />
                        <div className="bg-black/80 px-3 py-1 rounded border border-teal-500/30 z-10 text-[10px] text-teal-300 font-mono animate-pulse delay-75">
                            ZK Proof
                        </div>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="bg-gray-800 p-4 rounded-xl border border-gray-600 mb-2"><CheckCircle size={28} className="text-gray-400" /></div>
                        <span className="text-xs text-white font-bold">Verifier (المُتحقق)</span>
                        <span className="text-[9px] text-teal-400 py-1 font-bold">الإثبات صحيح!</span>
                    </div>
                </div>
            </BaseVisualizer>
        );
    }

    if (title?.includes('Multi-Sig') || slug === 'multisig-security-models') {
        return (
            <BaseVisualizer title="التوقيع المتعدد (Multi-Sig Wallets)" subtitle="يجب موافقة مجموعة من الموقعين (مثلاً 3 من 5) لتمرير المعاملة لحماية خزائن البروتوكول." colorClass="border-blue-500/40">
                <div className="flex w-full items-center justify-between">
                    <div className="flex flex-col gap-2 w-1/4">
                        <div className="bg-blue-900/30 p-2 rounded border border-blue-500 flex justify-center shadow-[0_0_10px_rgba(59,130,246,0.3)]"><UserIcon size={16} className="text-blue-400" /></div>
                        <div className="bg-blue-900/30 p-2 rounded border border-blue-500 flex justify-center shadow-[0_0_10px_rgba(59,130,246,0.3)]"><UserIcon size={16} className="text-blue-400" /></div>
                        <div className="bg-gray-800 p-2 rounded border border-gray-700 flex justify-center opacity-50"><UserIcon size={16} className="text-gray-500" /></div>
                    </div>
                    <div className="flex-1 flex flex-col items-center text-center">
                        <Users size={32} className="text-blue-500 mb-2" />
                        <span className="text-xs text-white font-bold">Gnosis Safe Smart Contract</span>
                        <span className="text-[10px] font-mono text-gray-400 mt-1">2/3 Signatures Collected</span>
                    </div>
                    <div className="w-1/4 flex flex-col items-center">
                        <ArrowRight size={20} className="text-green-500 mb-2 animate-bounce-small" />
                        <div className="bg-green-900/30 p-3 rounded-full border border-green-500"><Database size={20} className="text-green-400" /></div>
                        <span className="text-[9px] mt-1 text-green-300">Transaction Executed</span>
                    </div>
                </div>
            </BaseVisualizer>
        );
    }

    if (slug === 'slither-and-mythril-automation' || title?.includes('منهجية التدقيق')) {
        return (
            <BaseVisualizer title="خطوات التدقيق الأمني (Smart Contract Auditing)" subtitle="مزيج من التحليل التلقائي الساكن، الفحص العشوائي، والتحليل اليدوي المعمق." colorClass="border-emerald-500/40">
                <div className="flex items-center justify-between w-full h-16 relative px-4">
                    <div className="absolute top-1/2 left-4 right-4 border-t-2 border-emerald-500/30 -translate-y-1/2"></div>

                    <div className="bg-[#050510] z-10 p-3 flex flex-col items-center border border-emerald-500 rounded-lg shadow-lg group-hover:scale-110 transition-transform">
                        <SearchCode size={20} className="text-emerald-400 mb-1" />
                        <span className="text-[9px] text-white">Slither (Static)</span>
                    </div>
                    <div className="bg-[#050510] z-10 p-3 flex flex-col items-center border border-emerald-500 rounded-lg shadow-lg group-hover:scale-110 transition-transform delay-75">
                        <Binary size={20} className="text-emerald-400 mb-1" />
                        <span className="text-[9px] text-white">Foundry Fuzzing</span>
                    </div>
                    <div className="bg-[#050510] z-10 p-3 flex flex-col items-center border border-eth rounded-lg shadow-[0_0_15px_rgba(244,183,40,0.4)] group-hover:scale-110 transition-transform delay-150">
                        <FileSearch size={20} className="text-eth mb-1" />
                        <span className="text-[9px] text-white font-bold">Manual Review</span>
                    </div>
                </div>
            </BaseVisualizer>
        );
    }


    return (
        <div className="my-6 mx-auto w-full max-w-sm bg-gray-900/40 p-4 rounded-xl border border-eth/10 flex items-center justify-center opacity-80">
            <div className="flex gap-3 items-center">
                <Network className="text-eth/40" size={20} />
                <div className="h-1 w-12 bg-eth/20 rounded"></div>
            </div>
        </div>
    );
};

export default LessonVisualizer;
