import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Code, Hexagon, ShieldAlert, Cpu, CheckCircle, XCircle, ArrowRight, Play, Database, Unlock, Repeat, Fingerprint } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

interface Log {
    id: number;
    text: string;
    type: 'info' | 'success' | 'error' | 'cmd';
}

interface EthernautProps {
    onScoreUpdate?: (points: number, id: string) => void;
}

const EthernautSimulator: React.FC<EthernautProps> = ({ onScoreUpdate }) => {
    const { levelId } = useParams();
    const navigate = useNavigate();
    const [currentLevel, setCurrentLevel] = useState<number>(levelId ? parseInt(levelId) : 1);
    
    
    const [logs, setLogs] = useState<Log[]>([{ id: 0, text: 'EVM Console Loaded. Ethernaut v1.0', type: 'info' }]);
    const [loading, setLoading] = useState(false);
    
    
    const [fallbackOwner, setFallbackOwner] = useState('0x9bdf...3a2');
    const [fallbackBalance, setFallbackBalance] = useState(10);
    const [fallbackMyContributions, setFallbackMyContributions] = useState(0);

    
    const [teleOwner, setTeleOwner] = useState('0x12dc...9f1');

    
    const [reenBalance, setReenBalance] = useState(50);
    const [myReenBalance, setMyReenBalance] = useState(0);

    
    const [vaultLocked, setVaultLocked] = useState(true);
    const vaultPassword = "A_very_secret_password_123"; 

    
    const [kingAddress, setKingAddress] = useState('0x5e3...112');
    const [kingPrize, setKingPrize] = useState(1);

    
    const [forceBalance, setForceBalance] = useState(0);

    const logCounter = useRef(1);

    const addLog = (text: string, type: 'info' | 'success' | 'error' | 'cmd' = 'info') => {
        setLogs(prev => [...prev, { id: logCounter.current++, text, type }]);
    };

    const runCmd = async (cmd: string, action: () => Promise<void>) => {
        addLog(`> ${cmd}`, 'cmd');
        setLoading(true);
        setTimeout(async () => {
            try {
                await action();
            } catch (e: any) {
                addLog(e.message || 'Transaction reverted', 'error');
            }
            setLoading(false);
        }, 800);
    };

    

    const levels = [
        {
            id: 1,
            title: "1. The Fallback",
            description: "سيطر على ملكية العقد ثم قم بتفريغ رصيده لـ 0. تلميح: اقرأ كود الدالة الساقطة (fallback).",
            code: `
pragma solidity ^0.8.0;

contract Fallback {
  mapping(address => uint) public contributions;
  address public owner;

  constructor() {
    owner = msg.sender;
    contributions[msg.sender] = 1000 * (1 ether);
  }

  modifier onlyOwner {
        require(
            msg.sender == owner,
            "caller is not the owner"
        );
        _;
    }

  function contribute() public payable {
    require(msg.value < 0.001 ether);
    contributions[msg.sender] += msg.value;
    if(contributions[msg.sender] > contributions[owner]) {
      owner = msg.sender;
    }
  }

  function withdraw() public onlyOwner {
    payable(owner).transfer(address(this).balance);
  }

  receive() external payable {
    require(msg.value > 0 && contributions[msg.sender] > 0);
    owner = msg.sender;
  }
}`,
            isComplete: fallbackOwner === '0xPlayer' && fallbackBalance === 0,
            renderState: () => (
                <div className="space-y-4">
                    <div className="bg-gray-900 border border-gray-700 p-4 rounded-xl font-mono text-sm shadow-inner space-y-2">
                        <div className="flex justify-between items-center pb-2 border-b border-gray-800">
                            <span className="text-gray-400">contract.owner()</span>
                            <span className={fallbackOwner === '0xPlayer' ? 'text-green-400 font-bold' : 'text-blue-400'}>{fallbackOwner}</span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b border-gray-800">
                            <span className="text-gray-400">contract.balance()</span>
                            <span className="text-yellow-400">{fallbackBalance} ETH</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-400">contributions[player]</span>
                            <span className="text-purple-400">{fallbackMyContributions} ETH</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <button onClick={() => runCmd('contract.contribute({value: 0.0001})', async () => {
                            setFallbackMyContributions(c => c + 0.0001);
                            addLog('Transaction successful', 'success');
                        })} disabled={loading} className="bg-gray-800 hover:bg-gray-700 text-white font-mono text-xs py-2 px-3 rounded text-left border border-gray-600 transition truncate" title="contribute(value: 0.0001)">
                            المساهمة (Contribute)
                        </button>
                        <button onClick={() => runCmd('contract.contribute({value: 1})', async () => {
                            throw new Error('Reverted: value must be < 0.001');
                        })} disabled={loading} className="bg-gray-800 hover:bg-gray-700 text-white font-mono text-xs py-2 px-3 rounded text-left border border-gray-600 transition truncate" title="contribute(value: 1 ETH)">
                            مساهمة فاشلة (+1 ETH)
                        </button>
                        <button onClick={() => runCmd('sendTransaction({to: contract.address, value: 0.1})', async () => {
                            if (fallbackMyContributions > 0) {
                                setFallbackBalance(b => b + 0.1);
                                setFallbackOwner('0xPlayer');
                                addLog('Fallback executed. Ownership transferred!', 'success');
                            } else {
                                throw new Error('Reverted: require(contributions[msg.sender] > 0) failed');
                            }
                        })} disabled={loading} className="bg-gray-800 hover:bg-gray-700 text-white font-mono text-xs py-2 px-3 rounded text-left border border-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.2)] transition truncate" title="sendTransaction({to: contract.address, value: 0.1})">
                            إرسال مباشر (Send)
                        </button>
                        <button onClick={() => runCmd('contract.withdraw()', async () => {
                            if (fallbackOwner === '0xPlayer') {
                                setFallbackBalance(0);
                                addLog('Withdrawal successful! Contract drained.', 'success');
                            } else {
                                throw new Error('Reverted: caller is not the owner');
                            }
                        })} disabled={loading} className="bg-gray-800 hover:bg-gray-700 text-white font-mono text-xs py-2 px-3 rounded text-left border border-red-600 shadow-[0_0_10px_rgba(220,38,38,0.2)] transition truncate" title="withdraw()">
                            سحب الأموال (Withdraw)
                        </button>
                    </div>
                </div>
            )
        },
        {
            id: 2,
            title: "2. The Telephone",
            description: "استولِ على ملكية العقد. ركز بعناية في الفرق بين `tx.origin` و `msg.sender`.",
            code: `
pragma solidity ^0.8.0;

contract Telephone {

  address public owner;

  constructor() {
    owner = msg.sender;
  }

  function changeOwner(address _owner) public {
    if (tx.origin != msg.sender) {
      owner = _owner;
    }
  }
}`,
            isComplete: teleOwner === '0xPlayer',
            renderState: () => (
                <div className="space-y-4">
                    <div className="bg-gray-900 border border-gray-700 p-4 rounded-xl font-mono text-sm shadow-inner space-y-2">
                        <div className="flex justify-between items-center pb-2 border-b border-gray-800">
                            <span className="text-gray-400">target.owner()</span>
                            <span className={teleOwner === '0xPlayer' ? 'text-green-400 font-bold' : 'text-blue-400'}>{teleOwner}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs mt-2">
                            <span className="text-gray-500">Your Wallet Address:</span>
                            <span className="text-gray-400">0xPlayer</span>
                        </div>
                    </div>
                    <div className="space-y-2">
                         <button onClick={() => runCmd('target.changeOwner(0xPlayer)', async () => {
                            
                            addLog('Transaction mined. msg.sender == tx.origin, nothing changed.', 'info');
                        })} disabled={loading} className="w-full bg-gray-800 hover:bg-gray-700 text-white font-mono text-xs py-3 px-4 rounded-lg text-left border border-gray-600 transition flex items-center justify-between" title="Direct Call: target.changeOwner(...)">
                            <span>اتصال مباشر من المحفظة (Direct Call)</span>
                            <Fingerprint size={16} className="text-gray-400"/>
                        </button>
                        <button onClick={() => runCmd('Deploy MaliciousContract & call attack()', async () => {
                            
                            setTeleOwner('0xPlayer');
                            addLog('Attacker contract deployed and executed target.changeOwner! tx.origin != msg.sender is true.', 'success');
                        })} disabled={loading} className="w-full bg-gray-800 hover:bg-blue-900 border border-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.3)] text-white font-mono text-xs py-3 px-4 rounded-lg text-left transition flex items-center justify-between" title="Via Contract: attackContract.changeOwner(...)">
                            <span>عبر عقد خبيث (Deploy Malicious Contract)</span>
                            <Hexagon size={16} className="text-blue-400"/>
                        </button>
                    </div>
                </div>
            )
        },
        {
             id: 3,
            title: "3. Reentrancy",
            description: "العقد يحتوي على ثغرة استنزاف متكرر. اسرق جميع الأموال المتبقية في العقد (Reentrancy Hack).",
            code: `
pragma solidity ^0.6.12;

contract Reentrance {
  
  mapping(address => uint) public balances;

  function donate(address _to) public payable {
    balances[_to] += msg.value;
  }

  function balanceOf(address _who) public view returns (uint balance) {
    return balances[_who];
  }

  function withdraw(uint _amount) public {
    if(balances[msg.sender] >= _amount) {
      (bool result,) = msg.sender.call{value:_amount}("");
      if(result) {
        _amount;
      }
      
      balances[msg.sender] -= _amount;
    }
  }

  receive() external payable {}
}`,
            isComplete: reenBalance === 0,
            renderState: () => (
                 <div className="space-y-4">
                    <div className="bg-gray-900 border border-gray-700 p-4 rounded-xl font-mono text-sm shadow-inner space-y-2">
                        <div className="flex justify-between items-center pb-2 border-b border-gray-800">
                            <span className="text-gray-400">target.balance()</span>
                            <span className={reenBalance === 0 ? 'text-red-500 font-bold' : 'text-yellow-400'}>{reenBalance} ETH</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-400">balances[player]</span>
                            <span className="text-blue-400">{myReenBalance} ETH</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <button onClick={() => runCmd('target.donate(0xPlayer, {value: 1})', async () => {
                            setReenBalance(b => b + 1);
                            setMyReenBalance(b => b + 1);
                            addLog('Donation successful. You now have a balance.', 'success');
                        })} disabled={loading} className="bg-gray-800 hover:bg-gray-700 text-white font-mono text-xs py-2 px-3 rounded text-left border border-gray-600 transition truncate" title="donate({value: 1})">
                            التبرع (Donate)
                        </button>
                        <button onClick={() => runCmd('target.withdraw(1)', async () => {
                            if (myReenBalance >= 1) {
                                setReenBalance(b => b - 1);
                                setMyReenBalance(b => b - 1);
                                addLog('Withdrawal of 1 ETH successful normally.', 'info');
                            } else {
                                throw new Error('Reverted: Insufficient balance');
                            }
                        })} disabled={loading} className="bg-gray-800 hover:bg-gray-700 text-white font-mono text-xs py-2 px-3 rounded text-left border border-gray-600 transition truncate" title="withdraw(1 ETH)">
                            السحب (Withdraw)
                        </button>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-800">
                         <p className="text-xs text-gray-400 mb-2">Malicious Contract Exploit (Reentrancy):</p>
                         <button onClick={() => runCmd('Deploy MaliciousReentrant & attack()', async () => {
                            if (myReenBalance < 1) {
                                throw new Error('Attack failed: You need to donate at least 1 ETH first to bypass the initial check!');
                            }
                            addLog('Attacking...', 'cmd');
                            setTimeout(() => {
                                setReenBalance(0); 
                                addLog('Reentrancy loop executed! Fallback triggered withdraw recursively. Target Drained!', 'success');
                            }, 1000);
                        })} disabled={loading || myReenBalance === 0} className={`w-full ${myReenBalance > 0 ? 'bg-red-900/30 hover:bg-red-800 border-red-600' : 'bg-gray-800 border-gray-700 opacity-50'} text-white font-mono text-xs py-3 px-4 rounded-lg text-left transition flex items-center justify-between border`} title="Deploy MaliciousReentrant & attack()">
                            <span>تنفيذ استنزاف متكرر (Reentrancy Attack)</span>
                            <Repeat size={16} className={myReenBalance > 0 ? "text-red-400 animate-spin" : "text-gray-500"}/>
                        </button>
                    </div>
                </div>
            )
        },
        {
            id: 4,
            title: "4. The Vault",
            description: "العقد مقفل بكلمة سر 'private'. هل يمكنك الوصول إليها وفتح الخزنة؟ تلميح: لا شيء خاص حقاً على البلوكشين.",
            code: `
pragma solidity ^0.8.0;

contract Vault {
  bool public locked;
  bytes32 private password;

  constructor(bytes32 _password) {
    locked = true;
    password = _password;
  }

  function unlock(bytes32 _password) public {
    if (password == _password) {
      locked = false;
    }
  }
}`,
            isComplete: !vaultLocked,
            renderState: () => (
                 <div className="space-y-4">
                    <div className="bg-gray-900 border border-gray-700 p-4 rounded-xl font-mono text-sm shadow-inner space-y-2">
                        <div className="flex justify-between items-center pb-2 border-b border-gray-800">
                            <span className="text-gray-400">vault.locked()</span>
                            <span className={vaultLocked ? 'text-red-400 font-bold' : 'text-green-400 font-bold'}>{vaultLocked ? 'TRUE' : 'FALSE'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-400">Storage (Slot 1)</span>
                            <span className="text-gray-600 italic">****** (Private)</span>
                        </div>
                    </div>
                    <div className="space-y-2 pt-2">
                         <button onClick={() => runCmd('web3.eth.getStorageAt(vault.address, 1)', async () => {
                            addLog(`Storage Slot 1: ${vaultPassword}`, 'info');
                            addLog('Found potential password in storage!', 'success');
                        })} disabled={loading} className="w-full bg-gray-800 hover:bg-gray-700 text-white font-mono text-xs py-2 px-3 rounded text-left border border-gray-600 transition truncate" title="web3.eth.getStorageAt(address, 1)">
                            قراءة مساحة التخزين الخاصة (Storage Slot 1)
                        </button>
                        <div className="flex gap-2">
                             <input id="vault-input" type="text" placeholder="أدخل كلمة المرور bytes32" className="flex-1 bg-black border border-gray-700 rounded p-2 text-xs font-mono text-blue-400 outline-none focus:border-blue-500" />
                             <button onClick={() => {
                                 const val = (document.getElementById('vault-input') as HTMLInputElement).value;
                                 runCmd(`vault.unlock("${val}")`, async () => {
                                    if (val === vaultPassword) {
                                        setVaultLocked(false);
                                        addLog('Password matches! Vault UNLOCKED.', 'success');
                                    } else {
                                        throw new Error('Reverted: Incorrect password');
                                    }
                                 });
                             }} disabled={loading} className="bg-blue-600 hover:bg-blue-500 text-white text-xs px-4 rounded font-bold" title="vault.unlock()">فتح (Unlock)</button>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 5,
            title: "5. The King",
            description: "أصبح أنت الملك (The King) وامنع أي شخص آخر من أخذ العرش منك للأبد (DoS Attack).",
            code: `
pragma solidity ^0.8.0;

contract King {
  address payable king;
  uint public prize;
  address payable public owner;

  constructor() payable {
    owner = payable(msg.sender);  
    king = payable(msg.sender);
    prize = msg.value;
  }

  receive() external payable {
    require(msg.value >= prize || msg.sender == owner);
    
    king.transfer(msg.value);
    king = payable(msg.sender);
    prize = msg.value;
  }
}`,
            isComplete: kingAddress === '0xAttackerContract',
            renderState: () => (
                 <div className="space-y-4">
                    <div className="bg-gray-900 border border-gray-700 p-4 rounded-xl font-mono text-sm shadow-inner space-y-2">
                        <div className="flex justify-between items-center pb-2 border-b border-gray-800">
                            <span className="text-gray-400">Current King</span>
                            <span className={kingAddress === '0xAttackerContract' ? 'text-green-400 font-bold' : 'text-blue-400'}>{kingAddress}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-400">Current Prize</span>
                            <span className="text-yellow-400">{kingPrize} ETH</span>
                        </div>
                    </div>
                    <div className="space-y-2">
                         <button onClick={() => runCmd('EOA.send(value: 1.1 ETH)', async () => {
                             if (kingAddress === '0xAttackerContract') {
                                 throw new Error('Transaction REVERTED! The current King (AttackerContract) has no fallback/receive and rejected the refund.');
                             }
                             setKingAddress('0xOtherUser');
                             setKingPrize(1.1);
                             addLog('New King: 0xOtherUser. Refund sent back to you.', 'info');
                         })} disabled={loading} className="w-full bg-gray-800 hover:bg-gray-700 text-white font-mono text-xs py-2 px-3 rounded text-left border border-gray-600 transition" title="Send > prize (as EOA)">
                            إرسال قيمة أكبر للملك (طبيعي)
                        </button>
                        <button onClick={() => runCmd('AttackerContract.send(value: 2 ETH)', async () => {
                             setKingAddress('0xAttackerContract');
                             setKingPrize(2);
                             addLog('You are now the King via AttackerContract!', 'success');
                             addLog('Note: AttackerContract has no receive() function. It will block all future kings.', 'info');
                         })} disabled={loading} className="w-full bg-gray-800 hover:bg-blue-900 border border-blue-600 text-white font-mono text-xs py-2 px-3 rounded text-left transition" title="Send > prize (via Malicious Contract)">
                            استلام العرش عبر عقد خبيث (DoS Contract)
                        </button>
                    </div>
                </div>
            )
        },
        {
            id: 6,
            title: "6. Force Feeding",
            description: "العقد يعتمد على رصيده (address(this).balance) في منطق برمجي حساس. هل يمكنك تدمير هذا المنطق؟ تلميح: selfdestruct.",
            code: `
pragma solidity ^0.8.0;

contract ForceFeed {
  
  

  function isHappy() public view returns (bool) {
    
    return address(this).balance == 0;
  }
}`,
            isComplete: forceBalance > 0,
            renderState: () => (
                 <div className="space-y-4">
                    <div className="bg-gray-900 border border-gray-700 p-4 rounded-xl font-mono text-sm shadow-inner space-y-2">
                        <div className="flex justify-between items-center pb-2 border-b border-gray-800">
                            <span className="text-gray-400">Contract Balance</span>
                            <span className={forceBalance > 0 ? 'text-red-400 font-bold' : 'text-green-400 font-bold'}>{forceBalance} ETH</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-400">isHappy()</span>
                            <span className={forceBalance === 0 ? 'text-green-400' : 'text-red-400'}>{forceBalance === 0 ? 'TRUE (Logic Secure)' : 'FALSE (Logic Broken)'}</span>
                        </div>
                    </div>
                    <div className="space-y-2">
                         <button onClick={() => runCmd('EOA.send(value: 1 ETH)', async () => {
                             throw new Error('Reverted: Contract has no fallback/receive and rejects Ether.');
                         })} disabled={loading} className="w-full bg-gray-800 hover:bg-gray-700 text-white font-mono text-xs py-2 px-3 rounded text-left border border-gray-600 transition" title="Direct Send (will fail)">
                            تحويل مباشر (سيُرفض)
                        </button>
                        <button onClick={() => runCmd('Malicious.selfdestruct(target)', async () => {
                             setForceBalance(1);
                             addLog('Malicious contract destroyed itself and FORCED 1 ETH into the target!', 'success');
                             addLog('Check isHappy() - The logic is now broken!', 'error');
                         })} disabled={loading} className="w-full bg-red-900/30 hover:bg-red-800 border border-red-600 text-white font-mono text-xs py-2 px-3 rounded text-left transition shadow-[0_0_15px_rgba(220,38,38,0.2)]" title="Exploit: Force Send via selfdestruct()">
                            هجوم التغذية القسرية عبر selfdestruct()
                        </button>
                    </div>
                </div>
            )
        }
    ];

    const currentData = levels.find(l => l.id === currentLevel) || levels[0];

    useEffect(() => {
        
        const term = document.getElementById('terminal-content');
        if (term) term.scrollTop = term.scrollHeight;
    }, [logs]);

    const handleNextLevel = () => {
        if (currentLevel < levels.length) {
            setCurrentLevel(c => c + 1);
            setLogs([{ id: logCounter.current++, text: `Loading Level ${currentLevel + 1}...`, type: 'info' }]);
        } else {
            navigate('/games');
        }
    };

    return (
        <div className="min-h-screen bg-[#0d1117] text-gray-300 font-sans flex flex-col pt-16">
            
            {}
            <div className="bg-[#161b22] border-b border-gray-800 px-6 py-4 flex items-center justify-between sticky top-16 z-40 shadow-xl">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/games')} className="text-gray-400 hover:text-white transition group flex items-center gap-2">
                        <ArrowRight size={20} className="rotate-180 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-bold hidden md:inline">مختبر الألعاب</span>
                    </button>
                    <div className="h-6 w-px bg-gray-700"></div>
                    <div className="flex items-center gap-3">
                        <Terminal size={24} className="text-blue-500" />
                        <h1 className="text-xl font-black text-white uppercase tracking-wider">Ethernaut<span className="text-blue-500">.Hack</span></h1>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <span className="bg-gray-800 px-4 py-1.5 rounded-full text-sm font-bold border border-gray-700 text-gray-400">Level {currentLevel}/{levels.length}</span>
                </div>
            </div>

            {}
            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden max-w-[1600px] w-full mx-auto relative z-10 p-4 gap-4">
                
                {}
                <div className="flex-1 bg-[#1e1e1e] rounded-xl border border-gray-800 flex flex-col shadow-2xl overflow-hidden relative group">
                    <div className="bg-[#2d2d2d] px-4 py-2 flex items-center justify-between border-b border-gray-800">
                        <div className="flex items-center gap-2">
                            <Code size={16} className="text-gray-400" />
                            <span className="text-xs font-mono text-gray-300">{currentData.id === 2 ? 'Telephone.sol' : currentData.id === 3 ? 'Reentrance.sol' : 'Fallback.sol'}</span>
                        </div>
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                        </div>
                    </div>
                    <div className="flex-1 overflow-auto p-4 custom-scrollbar bg-[#1e1e1e]">
                        <pre className="font-mono text-sm leading-relaxed text-gray-300">
                            <code>
                                {currentData.code.split('\n').map((line, i) => {
                                    
                                    let strMatches: string[] = [];
                                    let cMatches: string[] = [];
                                    let formattedLine = line
                                        .replace(/(".*?")/g, (m) => { strMatches.push(m); return `__STR_${strMatches.length - 1}__`; })
                                        .replace(/(\/\/.*)/g, (m) => { cMatches.push(m); return `__COM_${cMatches.length - 1}__`; });
                                    
                                    
                                    formattedLine = formattedLine
                                        .replace(/\b(contract|function|public|return|require|payable|modifier|view|returns|external|address|uint256|uint|mapping|bool|constructor|receive)\b/g, '<span class="text-blue-400 font-bold">$1</span>')
                                        .replace(/\b(msg\.sender|msg\.value|tx\.origin)\b/g, '<span class="text-purple-400">$1</span>');
                                        
                                    
                                    formattedLine = formattedLine
                                        .replace(/__STR_(\d+)__/g, (_, idx) => `<span class="text-yellow-300">${strMatches[Number(idx)]}</span>`)
                                        .replace(/__COM_(\d+)__/g, (_, idx) => `<span class="text-green-600/60">${cMatches[Number(idx)]}</span>`);
                                    
                                    return (
                                        <div key={i} className="table-row group/line hover:bg-gray-800/30">
                                            <div className="table-cell pr-4 text-right select-none opacity-30 text-xs w-8">{i + 1}</div>
                                            <div className="table-cell" dangerouslySetInnerHTML={{ __html: formattedLine }} />
                                        </div>
                                    );
                                })}
                            </code>
                        </pre>
                    </div>
                    <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-[#1e1e1e] to-transparent pointer-events-none"></div>
                </div>

                {}
                <div className="w-full lg:w-[450px] flex flex-col gap-4">
                    
                    {}
                    <div className="bg-[#161b22] border border-gray-800 rounded-xl p-5 shadow-xl relative overflow-hidden">
                        {currentData.isComplete && (
                            <div className="absolute inset-0 bg-green-900/20 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center animate-fadeIn">
                                <div className="bg-black/80 p-6 rounded-2xl border border-green-500/50 text-center shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                                    <Unlock size={48} className="text-green-500 mx-auto mb-4 animate-bounce" />
                                    <h3 className="text-2xl font-black text-white mb-2">تم اختراق العقد!</h3>
                                    <p className="text-gray-300 text-sm mb-6">لقد نجحت في استغلال الثغرة في العقد الذكي.</p>
                                    <button onClick={handleNextLevel} className="bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-8 rounded-xl shadow-lg transition-all hover:scale-105 active:scale-95 w-full">
                                        {currentLevel === levels.length ? 'العودة للمختبر' : 'المستوى التالي'}
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="flex items-center gap-3 mb-4">
                            <ShieldAlert className="text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
                            <h2 className="text-xl font-bold text-white tracking-widest">{currentData.title}</h2>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6 border-r-2 border-red-500/50 pr-4">{currentData.description}</p>
                        
                        {}
                        <div className="mt-4">
                             <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                                <Database size={14}/> Contract State
                             </h4>
                            {currentData.renderState()}
                        </div>
                    </div>

                    {}
                    <div className="flex-1 min-h-[250px] bg-black border border-gray-800 rounded-xl shadow-2xl flex flex-col overflow-hidden">
                        <div className="bg-gray-900 border-b border-gray-800 px-4 py-2 flex items-center gap-2">
                            <Terminal size={14} className="text-gray-400" />
                            <span className="text-xs font-mono text-gray-500 uppercase">EVM Simulator Console</span>
                        </div>
                        <div id="terminal-content" className="flex-1 overflow-y-auto p-4 custom-scrollbar font-mono text-xs space-y-2">
                            {logs.map((log) => {
                                let colorClass = 'text-gray-300';
                                if (log.type === 'cmd') colorClass = 'text-gray-500';
                                if (log.type === 'success') colorClass = 'text-green-400';
                                if (log.type === 'error') colorClass = 'text-red-400';
                                
                                return (
                                    <div key={log.id} className={`${colorClass} opacity-90 break-words`}>
                                        {log.text}
                                    </div>
                                );
                            })}
                            {loading && (
                                <div className="text-gray-500 animate-pulse flex items-center gap-2 font-mono mt-1">
                                     <div className="w-1.5 h-3 bg-gray-500 animate-ping"></div>
                                     Executing transaction...
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
            
        </div>
    );
};

export default EthernautSimulator;
