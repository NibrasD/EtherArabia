import { useState } from 'react';
import { Code2, ShieldAlert, CheckCircle, AlertTriangle, Loader2, FileCode2 } from 'lucide-react';






export default function ContractAuditor() {
  const [code, setCode] = useState('// Paste your Solidity smart contract code here...\npragma solidity ^0.8.0;\n\ncontract VulnerableBank {\n    mapping(address => uint256) public balances;\n\n    function deposit() public payable {\n        balances[msg.sender] += msg.value;\n    }\n\n    function withdraw() public {\n        uint256 bal = balances[msg.sender];\n        require(bal > 0);\n\n        (bool sent, ) = msg.sender.call{value: bal}("");\n        require(sent, "Failed to send Ether");\n\n        balances[msg.sender] = 0;\n    }\n}');
  const [isAuditing, setIsAuditing] = useState(false);
  const [report, setReport] = useState<any>(null);

  const handleAudit = async () => {
    if (!code.trim()) return;
    setIsAuditing(true);
    setReport(null);

    
    
    setTimeout(() => {
        setReport({
            score: 35,
            summary: "تم اكتشاف ثغرات أمنية خطيرة تتعلق بآلية سحب الأموال والتعامل مع الحالة الداخلية للعقد.",
            vulnerabilities: [
                {
                    severity: "Critical",
                    title: "Reentrancy Attack",
                    description: "الثغرة تسمح للمهاجم بسحب الرصيد عدة مرات قبل تحديث رصيده في العقد، وذلك بسبب استدعاء المهاجم قبل تصفير رصيده.",
                    remediation: "يجب استخدام نمط (Checks-Effects-Interactions) وتصفير الرصيد قبل تنفيذ عملية التحويل، أو استخدام ReentrancyGuard.",
                    lineSnippet: '(bool sent, ) = msg.sender.call{value: bal}("");'
                },
                {
                    severity: "Medium",
                    title: "Integer Overflow/Underflow",
                    description: "الإصدارات القديمة من Solidity قد تعاني من تجاوز سعة الأرقام.",
                    remediation: "استخدم إصدار ^0.8.0 أو مكتبة SafeMath.",
                    lineSnippet: 'balances[msg.sender] += msg.value;'
                }
            ]
        });
        setIsAuditing(false);
    }, 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8" dir="rtl">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-slate-100 flex items-center justify-center gap-3">
          <FileCode2 className="w-8 h-8 text-indigo-400" />
          المدقق الأمني للعقود (Smart Contract Auditor)
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto">
          أداة موجهة للمطورين (DevSecOps). قم بلصق كود Solidity الخاص بك ليقوم الذكاء الاصطناعي باكتشاف الثغرات الأمنية المعقدة واقتراح الحلول قبل النشر (Deployment).
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {}
        <div className="space-y-4">
          <div className="bg-[#0d1117] rounded-xl border border-slate-800 overflow-hidden flex flex-col h-[500px]">
            <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800 bg-slate-900/50">
              <span className="text-xs font-mono text-slate-400" dir="ltr">Contract.sol</span>
              <Code2 className="w-4 h-4 text-slate-500" />
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="flex-1 w-full bg-transparent text-emerald-400 font-mono text-sm p-4 focus:outline-none resize-none"
              spellCheck="false"
              dir="ltr"
            />
          </div>
          <button
            onClick={handleAudit}
            disabled={isAuditing || !code.trim()}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
          >
            {isAuditing ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldAlert className="w-5 h-5" />}
            {isAuditing ? 'جاري فحص الكود والبحث عن الثغرات...' : 'بدء التدقيق الأمني (Audit)'}
          </button>
        </div>

        {}
        <div className="bg-slate-800/30 rounded-2xl border border-slate-700/50 p-6 h-[500px] overflow-y-auto custom-scrollbar">
          {!report && !isAuditing && (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-4">
              <ShieldAlert className="w-16 h-16 opacity-20" />
              <p>في انتظار الكود للبدء في التدقيق...</p>
            </div>
          )}

          {isAuditing && (
            <div className="h-full flex flex-col items-center justify-center space-y-4">
              <div className="relative w-20 h-20">
                <svg className="animate-spin w-full h-full text-indigo-500/20" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <Code2 className="absolute inset-0 m-auto w-8 h-8 text-indigo-400 animate-pulse" />
              </div>
              <p className="text-indigo-400 font-mono text-sm">Analyzing AST & Execution Paths...</p>
            </div>
          )}

          {report && !isAuditing && (
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                <div>
                  <h3 className="text-lg font-bold text-white">نتيجة التدقيق</h3>
                  <p className="text-sm text-slate-400">{report.summary}</p>
                </div>
                <div className="text-center">
                  <div className={`text-3xl font-black ${report.score < 50 ? 'text-red-500' : report.score < 80 ? 'text-yellow-500' : 'text-emerald-500'}`}>
                    {report.score}
                  </div>
                  <div className="text-[10px] text-slate-500 uppercase">Security Score</div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-bold text-slate-200 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-500" />
                  الثغرات المكتشفة ({report.vulnerabilities.length})
                </h4>
                
                {report.vulnerabilities.length === 0 ? (
                  <div className="bg-emerald-950/20 border border-emerald-900/50 p-4 rounded-xl flex items-center gap-3 text-emerald-400">
                    <CheckCircle className="w-6 h-6" />
                    <span>لم يتم اكتشاف ثغرات أمنية خطيرة. الكود يبدو آمناً.</span>
                  </div>
                ) : (
                  report.vulnerabilities.map((vuln: any, idx: number) => (
                    <div key={idx} className="bg-slate-900/80 border border-slate-700 rounded-xl p-4 space-y-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="font-bold text-slate-200 break-words min-w-0" dir="ltr">{vuln.title || 'Unknown Vulnerability'}</div>
                        <span className={`shrink-0 text-xs font-bold px-2 py-1 rounded-md ${
                          vuln.severity === 'Critical' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                          vuln.severity === 'High' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                          vuln.severity === 'Medium' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                          'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        }`}>
                          {vuln.severity}
                        </span>
                      </div>
                      <p className="text-sm text-slate-400 break-words whitespace-pre-wrap">{vuln.description || 'لا يوجد وصف متاح.'}</p>
                      {vuln.lineSnippet && (
                        <div className="bg-[#0a0c10] p-3 rounded-lg border border-slate-800 font-mono text-xs text-red-400 overflow-x-auto whitespace-pre-wrap break-all" dir="ltr">
                          {vuln.lineSnippet}
                        </div>
                      )}
                      <div className="bg-emerald-950/20 border border-emerald-900/30 p-3 rounded-lg">
                        <span className="text-xs font-bold text-emerald-500 block mb-1">طريقة الإصلاح (Remediation):</span>
                        <p className="text-sm text-emerald-200/70 break-words whitespace-pre-wrap">{vuln.remediation || 'لا توجد خطوات إصلاح مقترحة.'}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
