import React, { useState, useEffect } from 'react';
import { Wallet, Shield, Award, ExternalLink, User, BookOpen, Star, Copy, CheckCircle2, Send, X, Loader2, ArrowRight } from 'lucide-react';
import { useActiveAccount, useWalletBalance, useSendTransaction, useReadContract } from 'thirdweb/react';
import { ethereum } from 'thirdweb/chains';
import { getContract, prepareContractCall } from 'thirdweb';
import { getOwnedNFTs, ownerOf, transferFrom } from 'thirdweb/extensions/erc721';
import { thirdwebClient } from '../thirdweb-client';
import { AuthService } from '../services/db';


const cleanContractAddress = "0xb792e3853322e14c2ffa6af8a4139fd07e86c82b";
const UserDashboard: React.FC = () => {
    const account = useActiveAccount();
    
    
    const contract = getContract({
        client: thirdwebClient,
        chain: ethereum,
        address: cleanContractAddress,
    });
    const currentUser = AuthService.getCurrentUserLocal();
    const [ownedNFTs, setOwnedNFTs] = useState<any[]>([]);
    const [isLoadingNFTs, setIsLoadingNFTs] = useState(true);
    const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
    const [selectedNFT, setSelectedNFT] = useState<any>(null);
    const [recipientAddress, setRecipientAddress] = useState("");
    const [transferStatus, setTransferStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState("");

    const { mutate: sendTransaction, isPending: isTxPending } = useSendTransaction();

    const { data: balance } = useWalletBalance({
        client: thirdwebClient,
        chain: ethereum,
        address: account?.address,
    });

    
    useEffect(() => {
        const fetchNFTs = async () => {
            if (!account?.address) return;
            setIsLoadingNFTs(true);
            try {
                const nfts = await getOwnedNFTs({
                    contract,
                    owner: account.address,
                });
                setOwnedNFTs(nfts);
            } catch (err) {
                console.error("Failed to fetch NFTs:", err);
            } finally {
                setIsLoadingNFTs(false);
            }
        };

        fetchNFTs();
    }, [account?.address]);

    const [copied, setCopied] = useState<string | null>(null);
    const copyToClipboard = (text: string, type: string) => {
        navigator.clipboard.writeText(text);
        setCopied(type);
        setTimeout(() => setCopied(null), 2000);
    };

    const handleTransfer = async () => {
        if (!recipientAddress || !selectedNFT || !account) return;
        
        setTransferStatus('pending');
        setErrorMessage("");

        try {
            const transaction = transferFrom({
                contract,
                from: account.address,
                to: recipientAddress,
                tokenId: selectedNFT.id,
            });

            sendTransaction(transaction, {
                onSuccess: (txHash) => {
                    console.log("Transfer successful:", txHash);
                    setTransferStatus('success');
                    
                    setOwnedNFTs(prev => prev.filter(n => n.id !== selectedNFT.id));
                },
                onError: (err) => {
                    console.error("Transfer error:", err);
                    setTransferStatus('error');
                    setErrorMessage(err.message || "فشلت عملية التحويل");
                }
            });
        } catch (err: any) {
            setTransferStatus('error');
            setErrorMessage(err.message || "حدث خطأ غير متوقع");
        }
    };

    if (!account) {
        return (
            <div className="min-h-screen bg-[#0d1117] flex items-center justify-center p-4">
                <div className="text-center space-y-4">
                    <div className="w-20 h-20 bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Wallet size={40} className="text-blue-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">يرجى ربط المحفظة أولاً</h2>
                    <p className="text-gray-400">تحتاج لتسجيل الدخول للوصول إلى لوحة التحكم الخاصة بك.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0d1117] pt-24 pb-12 px-4 animate-fadeIn">
            <div className="max-w-6xl mx-auto space-y-12">
                
                {}
                <div className="relative overflow-hidden bg-gradient-to-r from-blue-900/20 to-eth/10 border border-white/5 rounded-3xl p-8 md:p-12">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-eth/5 blur-3xl -mr-20 -mt-20"></div>
                    <div className="relative flex flex-col md:flex-row items-center gap-8 text-right">
                        <div className="w-32 h-32 rounded-full border-4 border-eth/30 p-1 bg-black overflow-hidden bg-gradient-to-b from-eth to-blue-600">
                            <div className="w-full h-full rounded-full bg-[#161b22] flex items-center justify-center">
                                <User size={60} className="text-eth" />
                            </div>
                        </div>
                        <div className="flex-1">
                            <h1 className="text-3xl md:text-4xl font-black text-white mb-2">{currentUser?.name || 'مستكشف أمن إيثريوم'}</h1>
                            <p className="text-gray-400 mb-6">{currentUser?.email}</p>
                            <div className="flex flex-wrap justify-end gap-6 text-sm font-bold">
                                <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/5">
                                    <Star className="text-yellow-400" size={18} />
                                    <span className="text-white">{currentUser?.totalScore || 0} نقطة إجمالية</span>
                                </div>
                                <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/5">
                                    <BookOpen className="text-blue-400" size={18} />
                                    <span className="text-white">{currentUser?.completedLessons.length || 0} دروس مكتملة</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-right">
                    <div className="bg-[#161b22] border border-white/5 rounded-2xl p-6 space-y-4">
                        <div className="flex items-center justify-end gap-3 text-gray-400 text-sm font-bold">
                            <span>مفتاح الدخول (Signer Address)</span>
                            <Shield size={18} />
                        </div>
                        <div className="flex items-center justify-between bg-black/40 p-3 rounded-xl border border-white/5 flex-row-reverse text-left">
                            <code className="text-sm text-blue-300 truncate ml-2">
                                {account?.address.slice(0, 10)}...{account?.address.slice(-8)}
                            </code>
                            <button onClick={() => copyToClipboard(account?.address || '', 'signer')} className="text-gray-500 hover:text-white transition">
                                {copied === 'signer' ? <CheckCircle2 size={18} className="text-green-500" /> : <Copy size={18} />}
                            </button>
                        </div>
                        <p className="text-xs text-gray-500">هذه هي المحفظة التي استخدمتها لتسجيل الدخول. تعمل كمفتاح للتحكم في حسابك.</p>
                    </div>

                    <div className="bg-[#161b22] border border-eth/20 rounded-2xl p-6 space-y-4 relative overflow-hidden group">
                        <div className="flex items-center justify-end gap-3 text-eth text-sm font-bold">
                            <span>الخزنة الذكية (Smart Account)</span>
                            <Wallet size={18} />
                        </div>
                        <div className="flex items-center justify-between bg-eth/10 p-3 rounded-xl border border-eth/20 flex-row-reverse text-left">
                            <code className="text-sm text-eth font-bold truncate ml-2">
                                {account?.address.slice(0, 10)}...{account?.address.slice(-8)}
                            </code>
                            <div className="flex gap-2">
                                <button onClick={() => copyToClipboard(account?.address || '', 'smart')} className="text-eth/60 hover:text-eth transition">
                                    {copied === 'smart' ? <CheckCircle2 size={18} className="text-green-500" /> : <Copy size={18} />}
                                </button>
                                <a href={`https://etherscan.io/address/${account?.address}`} target="_blank" rel="noopener noreferrer" className="text-eth/60 hover:text-eth transition">
                                    <ExternalLink size={18} />
                                </a>
                            </div>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-eth font-bold">{balance?.displayValue} {balance?.symbol}</span>
                            <span className="text-gray-500">هذه هي المحفظة التي تحتوي على الأوسمة والمغطاة بـ Gas Sponsorship.</span>
                        </div>
                    </div>
                </div>

                {}
                <div className="space-y-6 text-right">
                    <div className="flex items-center justify-end gap-3">
                        <h2 className="text-2xl font-black text-white">معرض أوسمة الإنجاز (NFT Collection)</h2>
                        <Award size={24} className="text-eth" />
                    </div>

                    {isLoadingNFTs ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <Loader2 className="animate-spin text-eth" size={40} />
                            <p className="text-gray-400">جاري قراءة الأوسمة من البلوكشين...</p>
                        </div>
                    ) : ownedNFTs.length === 0 ? (
                        <div className="bg-[#161b22] border border-dashed border-white/10 rounded-3xl p-12 text-center">
                            <Award size={48} className="text-gray-700 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-gray-500 mb-2">لا توجد أوسمة بعد</h3>
                            <p className="text-gray-600 mb-6 max-w-sm mx-auto">أكمل الدروس والمهام الأمنية لتبدأ بصك أول وسام حقيقي لك على الشبكة مجاناً.</p>
                            <button onClick={() => window.location.href='/lessons'} className="text-eth font-bold hover:underline flex items-center gap-2 mx-auto justify-center">اذهب للدروس الآن <ArrowRight size={18} /></button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {ownedNFTs.map((nft) => (
                                <div key={nft.id} className="relative group aspect-square rounded-2xl overflow-hidden border-2 border-eth/30 transition-all duration-500 hover:scale-105 shadow-[0_0_20px_rgba(244,183,40,0.1)]">
                                    <img src={nft.metadata.image || "/level1.png"} alt={nft.metadata.name} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>
                                    <div className="absolute bottom-4 left-4 right-4 text-right">
                                        <h3 className="text-xl font-bold text-white mb-1">{nft.metadata.name || "وسام التميز"}</h3>
                                        <p className="text-eth text-xs font-bold uppercase tracking-widest mb-4">NFT ID #{nft.id.toString()}</p>
                                        <button 
                                            onClick={() => { setSelectedNFT(nft); setIsTransferModalOpen(true); }}
                                            className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-bold py-2 rounded-xl flex items-center justify-center gap-2 border border-white/10 transition"
                                        >
                                            <Send size={16} /> إرسال لمحفظة أخرى
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {}
            {isTransferModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-fadeIn text-right">
                    <div className="bg-[#161b22] w-full max-w-md rounded-3xl border border-white/10 shadow-2xl p-8 space-y-6 relative overflow-hidden">
                        <button onClick={() => { setIsTransferModalOpen(false); setTransferStatus('idle'); }} className="absolute top-4 left-4 text-gray-400 hover:text-white transition">
                            <X size={24} />
                        </button>

                        <div className="text-center space-y-4">
                            <div className="w-20 h-20 bg-eth/20 rounded-2xl flex items-center justify-center mx-auto border border-eth/30 mb-6">
                                <Send size={32} className="text-eth" />
                            </div>
                            <h2 className="text-2xl font-black text-white">إرسال الوسام</h2>
                            <p className="text-gray-400 text-sm">سيتم نقل ملكية الوسام #{selectedNFT?.id.toString()} من محفظتك الذكية إلى العنوان الذي ستحدده.</p>
                        </div>

                        {transferStatus === 'success' ? (
                            <div className="text-center py-6 space-y-4 animate-fadeIn">
                                <div className="text-green-500 font-bold">تم إرسال الوسام بنجاح! 🎉</div>
                                <button onClick={() => setIsTransferModalOpen(false)} className="bg-eth text-black font-bold px-8 py-2 rounded-xl">إغلاق</button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-gray-400 text-xs font-bold mb-2">عنوان المحفظة المستلمة (Ethereum Address)</label>
                                    <input 
                                        type="text" 
                                        placeholder="0x..." 
                                        value={recipientAddress}
                                        onChange={(e) => setRecipientAddress(e.target.value)}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white font-mono text-sm focus:border-eth focus:outline-none transition"
                                    />
                                </div>

                                {errorMessage && <div className="text-red-400 text-xs font-bold leading-relaxed">{errorMessage}</div>}

                                <button 
                                    onClick={handleTransfer}
                                    disabled={transferStatus === 'pending' || !recipientAddress.startsWith('0x')}
                                    className={`w-full py-4 rounded-xl font-black text-lg transition-all flex items-center justify-center gap-3 ${transferStatus === 'pending' ? 'bg-gray-700 cursor-not-allowed text-gray-500' : 'bg-eth hover:bg-eth-dark text-black shadow-[0_0_20px_rgba(244,183,40,0.3)]'}`}
                                >
                                    {transferStatus === 'pending' ? (
                                        <>
                                            <Loader2 size={24} className="animate-spin" /> جاري التحويل...
                                        </>
                                    ) : (
                                        "تأكيد التحويل الآن"
                                    )}
                                </button>
                                <p className="text-[10px] text-gray-600 text-center">تذكر: هذه العملية نهائية ولا يمكن التراجع عنها. سيتم تغطية رسوم الغاز من قبلنا.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserDashboard;
