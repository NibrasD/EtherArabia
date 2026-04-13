
import React, { useState, useEffect, useRef } from 'react';
import { View, Lesson, User, LeaderboardEntry } from './types';
import { BookOpen, Gamepad2, Home, ArrowRight, Shield, CheckCircle, Trophy, User as UserIcon, LogOut, Check, X, Lock, Loader2, Users, Mail, KeyRound, Lightbulb, Info, Share2, Sparkles, LogIn, UserPlus, FileText } from 'lucide-react';
import GamesHub from './components/ShieldGame';
import { LessonZero, LessonOne, LessonTwo, LessonThree, LessonFour, LessonFive, LessonSix, LessonEight, LessonNine, LessonTen } from './components/Lessons';
import { AuthService } from './services/db';
import Articles from './components/Articles';
import SecurityDashboard from './components/Security/SecurityDashboard';
import UserDashboard from './components/UserDashboard';

const EthLogo = ({ className }: { className?: string }) => (
    <img src="/logo.png" alt="EtherArabia" className={className} />
);

// --- INTERACTIVE NETWORK BACKGROUND ---
const PrivacyBackground = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let particles: { x: number; y: number; vx: number; vy: number; size: number }[] = [];

        const init = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            particles = [];
            // Increase particle count for a denser network
            const particleCount = Math.min(Math.floor(canvas.width * 0.1), 120);
            for (let i = 0; i < particleCount; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: (Math.random() - 0.5) * 0.5,
                    size: Math.random() * 2.5 + 1
                });
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw connections (The Network)
            ctx.lineWidth = 0.8;
            for (let i = 0; i < particles.length; i++) {
                const p1 = particles[i];
                // Move
                p1.x += p1.vx;
                p1.y += p1.vy;

                // Bounce
                if (p1.x < 0 || p1.x > canvas.width) p1.vx *= -1;
                if (p1.y < 0 || p1.y > canvas.height) p1.vy *= -1;

                // Draw Particle - Brighter Gold
                ctx.beginPath();
                ctx.arc(p1.x, p1.y, p1.size, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(244, 183, 40, 0.8)'; // Increased opacity for visibility
                ctx.fill();

                // Check connections
                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dx = p1.x - p2.x;
                    const dy = p1.y - p2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 130) { // Connection distance
                        ctx.beginPath();
                        // Opacity based on distance
                        const opacity = 1 - (dist / 130);
                        ctx.strokeStyle = `rgba(244, 183, 40, ${opacity * 0.3})`; // Gold connections
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }
            }
            animationFrameId = requestAnimationFrame(animate);
        };

        init();
        animate();

        const handleResize = () => init();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);
    return (
        <>
            {/* Dark Gradient Overlay - Reduced opacity so canvas shows */}
            <div className="fixed inset-0 bg-gradient-to-b from-[#0d1117]/90 via-[#161b22]/80 to-[#0d1117]/90 -z-20"></div>
            {/* Canvas Layer */}
            <canvas ref={canvasRef} className="fixed inset-0 w-full h-full pointer-events-none -z-10" />
            {/* Vignette */}
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.5)_100%)] pointer-events-none -z-10"></div>
        </>
    );
};

// --- LEADERBOARD COMPONENT ---
const LeaderboardView: React.FC<{ currentUser: User | null }> = ({ currentUser }) => {
    const [leaders, setLeaders] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalUsers, setTotalUsers] = useState(0);

    useEffect(() => {
        const fetchLeaders = async () => {
            const data = await AuthService.getLeaderboard();
            const count = await AuthService.getTotalUsersCount();

            // Add isUser flag
            const mapped = data.map(entry => ({
                ...entry,
                isUser: currentUser ? entry.name === currentUser.name && entry.score === currentUser.totalScore : false
            }));
            setLeaders(mapped);
            setTotalUsers(count);
            setLoading(false);
        };
        fetchLeaders();
    }, [currentUser]);

    return (
        <div className="max-w-2xl mx-auto py-10 animate-fadeIn relative z-10">
            <h2 className="text-3xl font-bold text-center mb-4 flex justify-center items-center gap-2">
                <Trophy className="text-yellow-500" /> لوحة الصدارة
            </h2>

            <div className="flex justify-center mb-6">
                <div className="bg-gray-800 border border-gray-600 px-4 py-2 rounded-full flex items-center gap-2 text-sm text-gray-300 shadow-lg">
                    <Users size={16} className="text-blue-400" />
                    <span>إجمالي المشتركين:</span>
                    <span className="font-bold text-white">{totalUsers}</span>
                </div>
            </div>

            {!currentUser && (
                <p className="text-center text-gray-400 mb-8 text-sm">
                    قم بتسجيل الدخول لتنافس وتحفظ مركزك في القائمة!
                </p>
            )}
            <div className="bg-gray-800/90 backdrop-blur rounded-xl overflow-hidden border border-gray-700 shadow-2xl">
                {loading ? (
                    <div className="p-8 text-center text-gray-400 flex justify-center items-center gap-2">
                        <Loader2 className="animate-spin" size={20} /> جاري تحميل الأبطال...
                    </div>
                ) : leaders.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">لا يوجد لاعبين بعد. كن الأول!</div>
                ) : (
                    leaders.map((entry) => (
                        <div key={entry.rank} className={`flex items-center justify-between p-4 border-b border-gray-700 ${entry.isUser ? 'bg-zcash/10 border-l-4 border-l-zcash' : ''}`}>
                            <div className="flex items-center gap-4">
                                <div className={`w-8 h-8 flex items-center justify-center font-bold rounded-full ${entry.rank === 1 ? 'bg-yellow-500 text-black' : entry.rank === 2 ? 'bg-gray-400 text-black' : entry.rank === 3 ? 'bg-orange-700 text-white' : 'bg-gray-700 text-gray-400'}`}>
                                    {entry.rank}
                                </div>
                                <span className={`font-medium ${entry.isUser ? 'text-zcash font-bold' : 'text-white'}`}>
                                    {entry.name} {entry.isUser && '(أنت)'}
                                </span>
                            </div>
                            <div className="font-mono font-bold text-lg text-zcash">{entry.score}</div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

// --- LOGIN MODAL ---
const LoginModal: React.FC<{ isOpen: boolean; onClose: () => void; onLoginSuccess: (user: User) => void }> = ({ isOpen, onClose, onLoginSuccess }) => {
    const [step, setStep] = useState<'select' | 'name' | 'method' | 'email-otp' | 'verify'>('select');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            setStep('select');
            setName('');
            setEmail('');
            setOtp('');
            setError('');
            setIsRegistering(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    // STEP 1: SELECT MODE HANDLERS
    const handleStartLogin = () => {
        setIsRegistering(false);
        setError('');
        setStep('method'); // Skip name input
    };

    const handleStartRegister = () => {
        setIsRegistering(true);
        setError('');
        setStep('name'); // Ask for name first
    };

    // STEP 2: NAME (Only for Register)
    const handleNameSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim().length < 3) {
            setError("يرجى إدخال اسم مكون من 3 أحرف على الأقل.");
            return;
        }
        setError('');
        setStep('method');
    };

    // AUTH METHODS
    const handleGoogleLogin = async () => {
        setLoading(true);
        setError('');
        try {
            // Pass name only if registering. If logging in, send empty string to not overwrite.
            await AuthService.signInWithGoogle(isRegistering ? name : undefined);
        } catch (e: any) {
            setError('فشل الاتصال بجوجل: ' + e.message);
            setLoading(false);
        }
    };

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await AuthService.signInWithOtp(email);
            setStep('verify');
        } catch (e: any) {
            setError('فشل إرسال الرمز: ' + e.message);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            // Pass name only if registering
            const user = await AuthService.verifyOtp(email, otp, isRegistering ? name : '');
            onLoginSuccess(user);
            onClose();
        } catch (e: any) {
            setError('الرمز غير صحيح أو منتهي الصلاحية.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
            <div className="bg-gray-800 w-full max-w-md rounded-2xl border border-gray-700 shadow-2xl overflow-hidden relative">
                <button onClick={onClose} className="absolute top-4 left-4 text-gray-400 hover:text-white transition">
                    <X size={24} />
                </button>

                <div className="p-8 text-center">
                    <div className="mb-6 flex justify-center">
                        <div className="bg-zcash/20 p-4 rounded-full border border-zcash/30 shadow-lg">
                            <UserIcon size={40} className="text-zcash" />
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">
                        {step === 'select' ? 'مرحباً بك' : isRegistering ? 'إنشاء حساب جديد' : 'تسجيل الدخول'}
                    </h2>
                    <p className="text-gray-400 text-sm mb-6">
                        {step === 'select' ? 'اختر طريقة المتابعة' : 'احفظ تقدمك وتنافس مع الآخرين'}
                    </p>

                    {error && <div className="bg-red-900/50 border border-red-500 text-red-200 text-sm p-3 rounded mb-4">{error}</div>}

                    {/* STEP 0: SELECTION */}
                    {step === 'select' && (
                        <div className="space-y-4 animate-fadeIn">
                            <button
                                onClick={handleStartLogin}
                                className="w-full bg-zcash hover:bg-zcash-dark text-black font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition shadow-lg hover:shadow-zcash/20"
                            >
                                <LogIn size={20} />
                                تسجيل الدخول (لدي حساب)
                            </button>
                            <button
                                onClick={handleStartRegister}
                                className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition border border-gray-600"
                            >
                                <UserPlus size={20} />
                                إنشاء حساب جديد
                            </button>
                        </div>
                    )}

                    {/* STEP 1: NAME (REGISTER ONLY) */}
                    {step === 'name' && (
                        <form onSubmit={handleNameSubmit} className="space-y-4 text-right animate-fadeIn">
                            <div className="bg-gray-700/50 p-4 rounded-xl border border-gray-600">
                                <label className="block text-white font-bold text-sm mb-2 flex items-center gap-2">
                                    <Trophy size={16} className="text-yellow-500" />
                                    اختر اسم البطل (للوحة الصدارة)
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-white focus:border-zcash focus:outline-none placeholder-gray-600 text-lg"
                                    placeholder="مثال: صائد الكتل..."
                                    autoFocus
                                />
                                <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                                    <Info size={12} /> هذا الاسم سيظهر للجميع في قائمة المتصدرين.
                                </p>
                            </div>
                            <button type="submit" className="w-full bg-zcash hover:bg-zcash-dark text-black font-bold py-3 rounded-lg transition shadow-lg hover:shadow-zcash/20">
                                التالي: اختر طريقة الدخول
                            </button>
                            <button type="button" onClick={() => setStep('select')} className="w-full text-gray-500 text-sm hover:text-white mt-2">رجوع</button>
                        </form>
                    )}

                    {/* STEP 2: METHOD */}
                    {step === 'method' && (
                        <div className="space-y-4 animate-fadeIn">
                            {isRegistering && (
                                <div className="bg-gray-700/50 p-3 rounded-lg mb-4 text-right flex justify-between items-center border border-gray-600">
                                    <div>
                                        <p className="text-xs text-gray-400">الاسم المختار:</p>
                                        <p className="font-bold text-white text-lg">{name}</p>
                                    </div>
                                    <button onClick={() => setStep('name')} className="text-zcash text-xs hover:text-white px-3 py-1 bg-gray-800 rounded border border-gray-600 transition">تغيير</button>
                                </div>
                            )}

                            <button
                                onClick={handleGoogleLogin}
                                disabled={loading}
                                className="w-full bg-white hover:bg-gray-100 text-gray-900 font-bold py-3 rounded-lg flex items-center justify-center gap-3 transition shadow-lg"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 3.02v2.34c3.83 2.65 9.69.94 9.69-6.49 0-.51-.07-.99-.2-1.48zM8.055 5.67A7.447 7.447 0 0 1 12.18 4.5c1.79 0 3.37.67 4.6 1.8l2.03-2.03C17.29 2.92 14.93 2 12.18 2 7.82 2 3.98 4.56 2.21 8.27l2.54 1.96c1.1-3.15 4.09-5.46 7.6-5.46zM2.21 15.73l2.54-1.96A7.44 7.44 0 0 0 8.05 18.33c-2.4-.64-4.2-2.3-4.84-4.66zM12.18 22c2.75 0 5.11-.92 6.63-2.27l-2.03-2.03a7.438 7.438 0 0 1-4.6 1.55c-3.5 0-6.5-2.3-7.6-5.46l-2.54 1.96C3.98 19.44 7.82 22 12.18 22z" /></svg>
                                {isRegistering ? 'تسجيل بـ Google' : 'دخول بـ Google'}
                            </button>

                            <div className="flex items-center gap-4">
                                <div className="h-px bg-gray-600 flex-1"></div>
                                <span className="text-gray-500 text-sm">أو</span>
                                <div className="h-px bg-gray-600 flex-1"></div>
                            </div>

                            <button onClick={() => setStep('email-otp')} className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition">
                                <Mail size={18} /> {isRegistering ? 'تسجيل بالبريد' : 'دخول بالبريد'}
                            </button>

                            <button onClick={() => setStep(isRegistering ? 'name' : 'select')} className="w-full text-gray-500 text-sm hover:text-white mt-2">رجوع</button>
                        </div>
                    )}

                    {/* STEP 3: EMAIL INPUT */}
                    {step === 'email-otp' && (
                        <form onSubmit={handleSendOtp} className="space-y-4 text-right animate-fadeIn">
                            <div>
                                <label className="block text-gray-400 text-sm mb-1">البريد الإلكتروني</label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-white focus:border-zcash focus:outline-none"
                                    placeholder="name@example.com"
                                    disabled={loading}
                                    autoFocus
                                />
                            </div>
                            <button type="submit" disabled={loading} className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition">
                                {loading ? <Loader2 className="animate-spin" /> : <>إرسال كود التحقق <Mail size={18} /></>}
                            </button>
                            <button type="button" onClick={() => setStep('method')} className="w-full text-gray-500 text-sm hover:text-white">رجوع</button>
                        </form>
                    )}

                    {/* STEP 4: VERIFY OTP */}
                    {step === 'verify' && (
                        <form onSubmit={handleVerifyOtp} className="space-y-4 text-right animate-fadeIn">
                            <div className="text-center text-sm text-gray-300 mb-4">
                                تم إرسال رمز التحقق إلى <span className="text-white font-bold">{email}</span>
                            </div>
                            <div>
                                <label className="block text-gray-400 text-sm mb-1">رمز التحقق (OTP)</label>
                                <input
                                    type="text"
                                    required
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-white text-center tracking-widest text-2xl font-mono focus:border-zcash focus:outline-none"
                                    placeholder="123456"
                                    autoFocus
                                    disabled={loading}
                                />
                            </div>
                            <button type="submit" disabled={loading} className="w-full bg-zcash hover:bg-zcash-dark text-black font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition">
                                {loading ? <Loader2 className="animate-spin" /> : <>تأكيد الدخول <Check size={18} /></>}
                            </button>
                            <button type="button" onClick={() => setStep('email-otp')} className="w-full text-gray-500 text-sm hover:text-white mt-2">
                                تغيير البريد الإلكتروني
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

const NavButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; text: string }> = ({ active, onClick, icon, text }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${active ? 'bg-zcash text-black font-bold shadow-[0_0_15px_rgba(244,183,40,0.4)]' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
    >
        {icon}
        <span className="hidden md:inline">{text}</span>
    </button>
);

const App: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [currentView, setCurrentView] = useState<View>(View.HOME);
    const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

    useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [currentView, activeLessonId]);

    // Init - Check for session (handles Google Redirect & Local Cache)
    useEffect(() => {
        const initAuth = async () => {
            const currentUser = await AuthService.getSession();
            if (currentUser) {
                setUser(currentUser);
            } else {
                // Fallback to local only if no auth session
                const local = AuthService.getCurrentUserLocal();
                if (local) setUser(local);
            }
        };
        initAuth();
    }, []);

    const handleLoginSuccess = (loggedInUser: User) => {
        setUser(loggedInUser);
        setShowLoginModal(false);
        if (pendingAction) { pendingAction(); setPendingAction(null); }
    };

    const handleLogout = async () => {
        if (window.confirm('هل أنت متأكد من تسجيل الخروج؟')) {
            await AuthService.logout();
            setUser(null);
            setCurrentView(View.HOME);
            setActiveLessonId(null);
        }
    };

    const requireAuth = (action: () => void) => {
        if (user) { action(); } else { setPendingAction(() => action); setShowLoginModal(true); }
    };

    // Update Score for Games
    const handleScoreUpdate = async (points: number, gameId: string) => {
        if (user) {
            if (user.completedLessons.includes(gameId)) {
                return;
            }
            const updated = await AuthService.updateUserProgress(points, gameId);
            if (updated) setUser(updated);
        }
    };

    // Update Score for Lessons
    const handleLessonComplete = async (points: number) => {
        if (user && activeLessonId) {
            const completed = user?.completedLessons || [];
            if (!completed.includes(activeLessonId)) {
                const updated = await AuthService.updateUserProgress(points, activeLessonId);
                if (updated) setUser(updated);
            }
        }
    };

    // LESSONS DEFINITIONS
    const lessons: Lesson[] = [
        { id: 'l0', title: 'الدرس 1: ما هي تقنية البولوكتشين؟', description: 'مقدمة شاملة عن الكتل، الهاش، وكيفية عمل السلاسل.', difficulty: 'مبتدئ', duration: '7 دقائق', content: (onComplete, isCompleted, userName) => <LessonZero onComplete={onComplete} isCompleted={isCompleted} userName={userName} /> },
        { id: 'l1', title: 'الدرس 2: ما هي إيثيريوم؟', description: 'تعريف شبكة إيثيريوم، العملات، والعقود الذكية.', difficulty: 'مبتدئ', duration: '8 دقائق', content: (onComplete, isCompleted, userName) => <LessonOne onComplete={onComplete} isCompleted={isCompleted} userName={userName} /> },
        { id: 'l2', title: 'الدرس 3: الخصوصية والأمان', description: 'شرح مبسط لتقنيات حماية البيانات في البلوكشين.', difficulty: 'متوسط', duration: '8 دقائق', content: (onComplete, isCompleted, userName) => <LessonTwo onComplete={onComplete} isCompleted={isCompleted} userName={userName} /> },
        { id: 'l3', title: 'الدرس 4: العناوين والمعاملات', description: 'كيفية قراءة العناوين وإرسال المعاملات بأمان.', difficulty: 'مبتدئ', duration: '6 دقائق', content: (onComplete, isCompleted, userName) => <LessonThree onComplete={onComplete} isCompleted={isCompleted} userName={userName} /> },
        { id: 'l4', title: 'الدرس 5: تطور الشبكة', description: 'رحلة إيثيريوم من البداية إلى الانتقال لإثبات الحصة.', difficulty: 'متوسط', duration: '6 دقائق', content: (onComplete, isCompleted, userName) => <LessonFour onComplete={onComplete} isCompleted={isCompleted} userName={userName} /> },
        { id: 'l9', title: 'الدرس 6: دفتر السجلات (Ledger)', description: 'الفرق التقني بين الأنظمة الشفافة والمشفرة.', difficulty: 'متوسط', duration: '5 دقائق', content: (onComplete, isCompleted, userName) => <LessonNine onComplete={onComplete} isCompleted={isCompleted} userName={userName} /> },
        { id: 'l8', title: 'الدرس 7: رحلة المعاملة', description: 'ماذا يحدث خلف الكواليس عند الضغط على إرسال؟', difficulty: 'مبتدئ', duration: '6 دقائق', content: (onComplete, isCompleted, userName) => <LessonEight onComplete={onComplete} isCompleted={isCompleted} userName={userName} /> },
        { id: 'l5', title: 'الدرس 8: المحفظة والأمان', description: 'أنواع المحافظ، كلمات الاسترجاع، وكيف تحمي أموالك.', difficulty: 'مبتدئ', duration: '7 دقائق', content: (onComplete, isCompleted, userName) => <LessonFive onComplete={onComplete} isCompleted={isCompleted} userName={userName} /> },
        { id: 'l6', title: 'الدرس 9: العقود الذكية', description: 'كيف تبرمج إيثيريوم لتنفيذ المهام تلقائياً.', difficulty: 'متوسط', duration: '6 دقائق', content: (onComplete, isCompleted, userName) => <LessonSix onComplete={onComplete} isCompleted={isCompleted} userName={userName} /> },
        { id: 'l10', title: 'الدرس 10: المحاكاة العملية', description: 'جرب استخدام محفظة إيثيريوم افتراضية بنفسك.', difficulty: 'مبتدئ', duration: '10 دقائق', content: (onComplete, isCompleted, userName) => <LessonTen onComplete={onComplete} isCompleted={isCompleted} userName={userName} /> }
    ];

    const renderContent = () => {
        switch (currentView) {
            case View.HOME:
                return (
                    <div className="max-w-4xl mx-auto text-center space-y-12 py-10 relative z-10">
                        <div className="space-y-6 animate-fade-in-up">
                            <div className="flex justify-center mb-6"><EthLogo className="w-48 h-48 drop-shadow-[0_0_30px_rgba(59,130,246,0.4)] animate-float" /></div>
                            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight drop-shadow-lg">أكاديمية <span className="text-blue-500">إيثريوم العرب</span></h1>
                            <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed font-light">المنصة العربية الأولى للأمن والخصوصية في شبكة إيثيريوم.</p>

                            {user ? (
                                <div className="bg-gray-800/80 backdrop-blur p-6 rounded-2xl border border-gray-600 inline-block shadow-xl mt-8">
                                    <p className="text-gray-300 text-lg">مرحباً <span className="text-white font-bold">{user.name}</span> 👋</p>
                                    <div className="flex items-center justify-center gap-4 mt-3">
                                        <span className="bg-blue-500/20 text-blue-400 px-4 py-1.5 rounded-full text-sm font-bold border border-blue-500/30">{user.totalScore} نقطة</span>
                                        <span className="text-sm text-gray-400">{(user.completedLessons || []).length} / {lessons.length} درس</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-blue-900/30 backdrop-blur p-4 rounded-xl border border-blue-500/30 inline-block animate-pulse mt-8"><p className="text-blue-200 text-sm">👋 أنت تتصفح كضيف. سجل الدخول لحفظ تقدمك.</p></div>
                            )}
                            <div className="flex flex-wrap justify-center gap-4 pt-8">
                                <button onClick={() => setCurrentView(View.LESSON)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-10 rounded-xl text-xl flex items-center gap-3 transition-all hover:scale-105 shadow-[0_0_20px_rgba(59,130,246,0.4)]"><BookOpen size={24} />{user && (user.completedLessons || []).length > 0 ? 'تابع مسار التعلم' : 'ابدأ الرحلة الآن'}</button>
                                <button onClick={() => setCurrentView(View.GAME)} className="bg-gray-800/80 backdrop-blur hover:bg-gray-700 text-white font-bold py-4 px-10 rounded-xl text-xl flex items-center gap-3 border border-gray-600 transition-all hover:scale-105"><Gamepad2 size={24} />مختبر الألعاب</button>
                            </div>
                        </div>
                    </div>
                );

            case View.LESSON:
                if (activeLessonId) {
                    const activeLesson = lessons.find(l => l.id === activeLessonId);
                    const completed = user?.completedLessons || [];
                    const isCompleted = completed.includes(activeLessonId);

                    return (
                        <div className="max-w-4xl mx-auto relative z-10">
                            <button onClick={() => setActiveLessonId(null)} className="mb-6 flex items-center gap-2 text-gray-400 hover:text-white transition bg-gray-800/50 px-4 py-2 rounded-lg w-fit"><ArrowRight size={20} />العودة لقائمة الدروس</button>
                            <div className="mb-8 border-b border-gray-700 pb-6 flex justify-between items-start bg-gray-900/50 p-6 rounded-2xl border border-gray-700/50 backdrop-blur-sm">
                                <div>
                                    <h1 className="text-3xl font-bold text-white mb-2">{activeLesson?.title}</h1>
                                    <p className="text-gray-400 mb-4">{activeLesson?.description}</p>
                                    <div className="flex gap-4 text-sm text-gray-400">
                                        <span className="bg-gray-800 px-3 py-1 rounded-full text-zcash font-bold border border-gray-700">{activeLesson?.difficulty}</span>
                                        <span className="bg-gray-800 px-3 py-1 rounded-full flex items-center gap-1 border border-gray-700">⏱ {activeLesson?.duration}</span>
                                    </div>
                                </div>
                                {isCompleted && (
                                    <div className="bg-green-500/20 text-green-500 px-4 py-2 rounded-lg font-bold flex items-center gap-2 border border-green-500/50 shadow-[0_0_10px_rgba(34,197,94,0.2)]"><CheckCircle size={20} /> مكتمل</div>
                                )}
                            </div>
                            <div className="bg-gray-900/80 backdrop-blur-md rounded-2xl p-2 border border-gray-800">
                                {/* Pass user.name to lesson content */}
                                {activeLesson ? activeLesson.content(handleLessonComplete, isCompleted, user?.name) : <div>Lesson not found</div>}
                            </div>
                        </div>
                    );
                }
                return (
                    <div className="max-w-4xl mx-auto py-10 relative z-10">
                        <h2 className="text-3xl font-bold mb-8 text-center flex items-center justify-center gap-2"><BookOpen className="text-zcash" /> المنهج التعليمي</h2>
                        <div className="grid gap-4">
                            {lessons.map((lesson, index) => {
                                const completed = user?.completedLessons || [];
                                const isCompleted = completed.includes(lesson.id);
                                return (
                                    <div
                                        key={lesson.id}
                                        onClick={() => {
                                            if (!user) {
                                                setShowLoginModal(true);
                                                return;
                                            }
                                            setActiveLessonId(lesson.id);
                                        }}
                                        className={`p-6 rounded-xl border transition-all duration-300 flex justify-between items-center group relative overflow-hidden cursor-pointer ${isCompleted ? 'bg-gray-900/40 border-green-900/50 opacity-80 hover:opacity-100 hover:bg-gray-800' : 'bg-gray-800/80 border-gray-700 hover:border-zcash hover:translate-x-1 shadow-lg hover:shadow-zcash/10'} backdrop-blur-sm`}
                                    >
                                        <div className="absolute top-0 right-0 w-1 h-full bg-gray-700 group-hover:bg-zcash transition-colors"></div>
                                        <div className="pr-4 flex items-start gap-4">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-base shrink-0 mt-1 transition-colors ${isCompleted ? 'bg-green-900 text-green-400' : 'bg-gray-700 text-gray-400 group-hover:text-white'}`}>{isCompleted ? <Check size={20} /> : index + 1}</div>
                                            <div>
                                                <h3 className="text-xl font-bold mb-1 group-hover:text-zcash transition-colors flex items-center gap-2">
                                                    {lesson.title}
                                                    {!user && <Lock size={16} className="text-gray-500 inline-block mr-2" />}
                                                </h3>
                                                <p className="text-gray-400 text-sm mb-2">{lesson.description}</p>
                                                <div className="flex gap-3 text-xs text-gray-500 font-mono"><span className="flex items-center gap-1 bg-black/20 px-2 py-0.5 rounded">⏱ {lesson.duration}</span></div>
                                            </div>
                                        </div>
                                        <div className={`p-3 rounded-full transition transform group-hover:-translate-x-2 ${isCompleted ? 'text-green-500' : 'bg-gray-700/50 group-hover:bg-zcash group-hover:text-black'}`}>
                                            {isCompleted ? <CheckCircle size={24} /> : !user ? <Lock size={20} className="text-gray-400" /> : <Lock size={20} className="text-gray-500 group-hover:text-black" />}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                );

            case View.GAME:
                // Changed: We no longer block the whole view. We pass a callback to handle guest clicks.
                return <div className="relative z-10"><GamesHub onScore={handleScoreUpdate} completedGames={user?.completedLessons || []} userName={user?.name} onGuestAccess={() => setShowLoginModal(true)} /></div>;

            case View.LEADERBOARD:
                return <LeaderboardView currentUser={user} />;

            case View.ARTICLES:
                return <Articles />;

            case View.ADMIN:
                return <AdminDashboard />;

            case View.SECURITY:
                return <SecurityDashboard />;

            case View.DASHBOARD:
                return <UserDashboard user={user} onUpdateUser={setUser} />;

            default:
                return <div>Page not found</div>;
        }
    };

    return (
        // REMOVED bg-[#111827] to allow canvas background to show
        <div className="min-h-screen text-white font-sans flex flex-col relative overflow-hidden">
            <PrivacyBackground />
            <LoginModal isOpen={showLoginModal} onClose={() => { setShowLoginModal(false); setPendingAction(null); }} onLoginSuccess={handleLoginSuccess} />
            <nav className="border-b border-gray-800 bg-gray-900/80 backdrop-blur-md sticky top-0 z-50 shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => { setCurrentView(View.HOME); setActiveLessonId(null); }}>
                            <EthLogo className="w-10 h-10 transition-transform group-hover:rotate-12" />
                            <span className="font-bold text-xl tracking-wide group-hover:text-blue-400 transition-colors hidden md:block">أكاديمية إيثريوم العرب</span>
                        </div>
                        <div className="flex space-x-1 space-x-reverse md:space-x-4 md:space-x-reverse items-center">
                            <NavButton active={currentView === View.LESSON} onClick={() => { setCurrentView(View.LESSON); setActiveLessonId(null); }} icon={<BookOpen size={18} />} text="الدروس" />
                            <NavButton active={currentView === View.SECURITY} onClick={() => setCurrentView(View.SECURITY)} icon={<Shield size={18} />} text="الأمان" />
                            <NavButton active={currentView === View.GAME} onClick={() => setCurrentView(View.GAME)} icon={<Gamepad2 size={18} />} text="الألعاب" />
                            <NavButton active={currentView === View.DASHBOARD} onClick={() => setCurrentView(View.DASHBOARD)} icon={<UserIcon size={18} />} text="حسابي" />
                            {user ? (
                                <div className="flex items-center gap-2 mr-2 border-r border-gray-700 pr-2">
                                    <span className="text-sm font-bold text-blue-400 hidden md:block">{user.name}</span>
                                    <button onClick={handleLogout} className="text-gray-400 hover:text-red-400 p-2" title="تسجيل خروج"><LogOut size={18} /></button>
                                </div>
                            ) : (
                                <button onClick={() => setShowLoginModal(true)} className="mr-2 bg-gray-800 hover:bg-gray-700 text-white text-xs md:text-sm px-3 py-1.5 rounded border border-gray-600 transition">دخول</button>
                            )}
                        </div>
                    </div>
                </div>
            </nav>
            <main className="flex-grow p-4 md:p-8 animate-fadeIn relative z-10">{renderContent()}</main>
            <footer className="border-t border-gray-800 bg-gray-900/90 backdrop-blur-md py-6 mt-auto relative z-10">
                <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
                    <p>© 2025 EtherArabia Academy. تعليم مجتمعي غير رسمي.</p>
                    <button
                        onClick={() => setCurrentView(View.ADMIN)}
                        className="mt-4 text-gray-700 hover:text-gray-500 transition-colors text-xs"
                    >
                        لوحة الإدارة
                    </button>
                </div>
            </footer>
        </div>
    );
};

export default App;

