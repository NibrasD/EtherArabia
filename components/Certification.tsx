import React, { useRef, useState, useEffect } from 'react';
import { Award, Download, Share2, CheckCircle, Shield, Star, Trophy, Loader2, Sparkles, Ban } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useActiveAccount, ConnectButton, useSendTransaction, useActiveWalletChain } from 'thirdweb/react';
import { prepareContractCall, getContract, readContract } from 'thirdweb';
import { thirdwebClient } from '../thirdweb-client';
import { thirdwebWallets } from '../App';
import { supabase } from '../services/db';

const Certification: React.FC<{ userName?: string }> = ({ userName }) => {
    const navigate = useNavigate();
    const certRef = useRef<HTMLDivElement>(null);
    const account = useActiveAccount();
    const activeChain = useActiveWalletChain();
    const [isMinting, setIsMinting] = useState(false);
    const [mintedTx, setMintedTx] = useState<string | null>(null);
    const [hasMintedBefore, setHasMintedBefore] = useState(false);
    const [checkingBalance, setCheckingBalance] = useState(false);

    const finalCleanAddress = "0xb792e3853322e14c2ffa6af8a4139fd07e86c82b"; 

    useEffect(() => {
        const checkBalance = async () => {
            if (!account) return;
            
            
            if (localStorage.getItem(`minted_level1_${account.address}`)) {
                setHasMintedBefore(true);
                return;
            }

            
            try {
                setCheckingBalance(true);
                const { ethereum } = await import("thirdweb/chains");
                const contract = getContract({
                    client: thirdwebClient,
                    chain: ethereum,
                    address: finalCleanAddress,
                });

                
                const balance = await readContract({
                    contract,
                    method: "function balanceOf(address owner) view returns (uint256)",
                    params: [account.address]
                });

                if (balance > 0n) {
                    setHasMintedBefore(true);
                    localStorage.setItem(`minted_level1_${account.address}`, 'true');
                }
            } catch(e) {
                console.error("Could not fetch balance:", e);
            } finally {
                setCheckingBalance(false);
            }
        };
        checkBalance();
    }, [account]);

    const handleMintNFT = async () => {
        if (!account) {
            alert('يرجى ربط محفظتك الإلكترونية (Connect Wallet) أولاً للمطالبة بـ NFT');
            return;
        }

        if (hasMintedBefore) {
            alert('لقد قمت بصك وسام هذا المستوى مسبقاً! كل مستوى له وسام واحد فريد.');
            return;
        }

        if (!activeChain) {
            alert('يرجى التأكد من اتصال المحفظة بالشبكة الصحيحة.');
            return;
        }


        setIsMinting(true);
        try {
            console.log("Requesting NFT Claim for:", account.address);

            
            const { data, error } = await supabase.functions.invoke('fund-new-user', {
                body: { walletAddress: account.address },
            });

            if (error) {
                console.error("Claim error:", error);
                throw new Error(error.message || "Failed to claim reward");
            }

            if (data?.success) {
                setMintedTx(data.transactionId);
                setHasMintedBefore(true);
                localStorage.setItem(`minted_level1_${account.address}`, 'true');
                alert('تم صيد وسام الإنجاز بنجاح! 🏆 سيظهر في محفظتك قريباً.');
            } else {
                throw new Error(data?.error || "Unknown error during claim");
            }

        } catch (error: any) {
            console.error("Minting request error:", error);
            alert("فشل طلب الصك: " + error.message);
        } finally {
            setIsMinting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0d1117] py-20 px-4 flex flex-col items-center justify-center animate-fadeIn">
            
            {}
            <div className="text-center mb-12 max-w-2xl">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-900/40 rounded-full mb-6 border-2 border-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.3)] animate-pulse">
                    <Sparkles size={40} className="text-blue-400" />
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-white mb-4">بداية مشرفة! 🛡️</h1>
                <p className="text-gray-400 text-lg">لقد أتممت درسك الأول في أكاديمية أمن إيثريوم بنجاح. هذا أول وسام رقمي لك في رحلة الاحتراف!</p>
            </div>

            {}
            <div 
                ref={certRef}
                className="relative w-full max-w-4xl aspect-[1.414/1] bg-[#161b22] border-8 border-double border-eth/40 rounded-3xl p-12 overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.5)] group"
            >
                {}
                <div className="absolute top-0 right-0 w-64 h-64 bg-eth/5 blur-3xl rounded-full -mr-20 -mt-20"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/5 blur-3xl rounded-full -ml-20 -mb-20"></div>
                <div className="absolute inset-0 border-[20px] border-eth/5 pointer-events-none"></div>

                {}
                <div className="relative h-full border-2 border-eth/20 p-8 flex flex-col items-center justify-between text-center bg-black/20 backdrop-blur-sm">
                    
                    <div className="flex flex-col items-center gap-4">
                        <div className="flex items-center gap-3">
                            <Shield size={32} className="text-eth" />
                            <h2 className="text-2xl font-black text-white uppercase tracking-[0.2em]">Ethereum Security Academy</h2>
                        </div>
                        <div className="h-0.5 w-32 bg-gradient-to-r from-transparent via-eth to-transparent"></div>
                    </div>

                    <div className="space-y-6">
                        <p className="text-eth/80 font-mono uppercase tracking-widest text-sm">Certificate of Achievement</p>
                        <h3 className="text-gray-500 italic text-xl">This is to certify that</h3>
                        <h4 className="text-5xl md:text-6xl font-black text-white drop-shadow-lg font-serif">
                            {userName || 'Certified Expert'}
                        </h4>
                        <p className="text-gray-400 text-lg max-w-xl mx-auto leading-relaxed mt-6">
                            Has successfully mastered the art of <span className="text-white font-bold">Smart Contract Security</span>, 
                            conquered all wargames, and demonstrated exceptional skill in auditing decentralized applications on the <span className="text-blue-400 font-bold">Ethereum Network</span>.
                        </p>
                    </div>

                    <div className="w-full flex justify-between items-end mt-8">
                        <div className="text-right">
                            <p className="text-xs text-gray-500 uppercase font-bold mb-1">Date Published</p>
                            <p className="text-white font-mono">{new Date().toLocaleDateString('ar-EG')}</p>
                        </div>
                        
                        <div className="relative">
                            <div className="w-24 h-24 border-4 border-eth/30 rounded-full flex items-center justify-center relative bg-eth/10">
                                <Award size={50} className="text-eth animate-spin-slow" />
                                <div className="absolute -inset-2 border-2 border-dashed border-eth/40 rounded-full"></div>
                            </div>
                        </div>

                        <div className="text-left">
                            <p className="text-xs text-gray-500 uppercase font-bold mb-1">Verify Authenticity</p>
                            <div className="flex items-center gap-1 text-blue-400 font-mono text-xs">
                                <Star size={12} />
                                <span>SEC-2026-XQW-99</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {}
            <div className="mt-12 flex flex-col items-center gap-8 w-full max-w-2xl text-center">
                
                {!account ? (
                    <div className="flex flex-col items-center gap-4 bg-blue-900/10 p-8 rounded-3xl border border-blue-500/20 w-full">
                        <p className="text-blue-200 font-bold">للمطالبة بالوسام، يجب ربط محفظتك أولاً:</p>
                        <ConnectButton 
                            client={thirdwebClient}
                            wallets={thirdwebWallets}
                            theme="dark"
                            connectButton={{
                                label: "ربط المحفظة (Connect Wallet)",
                                className: "!bg-blue-600 !text-white !font-black !py-4 !px-8 !rounded-xl !transition-all hover:!scale-105"
                            }}
                        />
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-4 w-full">
                        {(hasMintedBefore || mintedTx) && (
                            <div className="bg-green-900/20 border border-green-500/30 p-6 rounded-2xl flex flex-col items-center gap-4 text-green-400 w-full animate-fadeIn shadow-[0_0_20px_rgba(34,197,94,0.1)]">
                                <CheckCircle size={32} />
                                <span className="font-bold text-lg">الوسام موثق في محفظتك المبرمجة بنجاح!</span>
                            </div>
                        )}
                        <button 
                            onClick={handleMintNFT}
                            disabled={isMinting || checkingBalance || hasMintedBefore || mintedTx !== null}
                            className={`group relative flex items-center justify-center gap-3 font-black py-5 px-12 rounded-2xl transition-all shadow-lg overflow-hidden w-full max-w-sm
                                ${hasMintedBefore || mintedTx ? 'bg-gray-800 text-gray-400 cursor-not-allowed border border-gray-700' : 'bg-gradient-to-r from-blue-600 to-eth hover:from-eth hover:to-blue-600 text-white shadow-[0_10px_30px_rgba(0,229,255,0.3)]'}`}
                        >
                            {!hasMintedBefore && !mintedTx && <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform"></div>}
                            {isMinting || checkingBalance ? <Loader2 size={24} className="animate-spin" /> : (hasMintedBefore || mintedTx ? <CheckCircle size={24} /> : <Sparkles size={24} className="animate-bounce-small text-yellow-300" />)}
                            <span className="relative z-10">
                                {checkingBalance ? 'جاري الفحص...' : (hasMintedBefore || mintedTx ? 'تم استلام الوسام مسبقاً' : 'صيد وسام التخرج (Mint NFT)')}
                            </span>
                        </button>
                    </div>
                )}


                <div className="flex flex-wrap justify-center gap-6">
                    <button 
                        onClick={() => {
                            alert('جاري توليد ملف الشهادة عالي الجودة...');
                        }}
                        className="flex items-center gap-3 bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 px-8 rounded-xl transition-all border border-gray-600"
                    >
                        <Download size={20} /> تحميل الشهادة (PNG)
                    </button>
                    <button className="flex items-center gap-3 bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 px-8 rounded-xl transition-all border border-gray-600">
                        <Share2 size={20} /> مشاركة الإنجاز
                    </button>
                </div>
            </div>

            <button 
                onClick={() => navigate('/lessons')}
                className="mt-12 text-gray-500 hover:text-white transition flex items-center gap-2 font-bold"
            >
               العودة للرئيسية <Trophy size={18} />
            </button>
        </div>
    );
};

export default Certification;
