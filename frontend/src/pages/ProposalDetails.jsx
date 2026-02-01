import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { GOVERNOR_ADDRESS, GOVERNOR_ABI } from '../abis'; // Import your ABIs
import { Loader2, ArrowLeft, BrainCircuit, CheckCircle, XCircle } from 'lucide-react';

const API_BASE = "http://localhost:8000/api/v1";

export function ProposalDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { address } = useAccount();

  const [proposal, setProposal] = useState(null);
  const [loading, setLoading] = useState(true);

  // AI State
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);

  // Voting State
  const { writeContract: vote, data: txHash, isPending: isSigning } = useWriteContract();
  const { isLoading: isMining, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash: txHash });

  // 1. Fetch Proposal Data
  useEffect(() => {
    fetch(`${API_BASE}/proposals/${id}`)
      .then(r => r.json())
      .then(d => setProposal(d.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  // 2. AI Fetcher
  const runAiAnalysis = async () => {
    if (!proposal?.description) return;
    setAnalyzing(true);
    try {
       const res = await fetch(`${API_BASE}/ai/proposal/feasibility`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ description: proposal.description }),
       });
       const json = await res.json();
       setAiAnalysis(json.data);
    } catch (err) {
       alert("AI Analysis Failed: " + err.message);
    } finally {
       setAnalyzing(false);
    }
  };

  // 3. Voting Handler
  const handleVote = (support) => {
     if(!proposal?.onChainProposalId) return alert("No on-chain ID found");
     
     vote({
        address: GOVERNOR_ADDRESS,
        abi: GOVERNOR_ABI,
        functionName: 'castVote',
        args: [BigInt(proposal.onChainProposalId), support], // 0=Against, 1=For
     });
  };
  
  // 4. Update DB after vote mines
  useEffect(() => {
     if(isConfirmed) {
        // Call backend to increment vote count
        // (You can implement the DB update logic here like before)
        alert("Vote Confirmed on Chain!");
     }
  }, [isConfirmed]);

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin" /></div>;
  if (!proposal) return <div className="p-20 text-center">Proposal not found</div>;

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <button onClick={() => navigate(-1)} className="flex items-center text-gray-500 hover:text-gray-900 mb-6 font-medium">
         <ArrowLeft size={18} className="mr-1" /> Back to Dashboard
      </button>

      {/* Main Layout: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         
         {/* LEFT: Proposal Content */}
         <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm">
               <h1 className="text-3xl font-bold text-gray-900 mb-4">{proposal.title}</h1>
               <div className="prose text-gray-600 leading-relaxed">
                  {proposal.description}
               </div>
               
               {/* Metadata */}
               <div className="flex gap-4 mt-8 pt-6 border-t border-gray-100">
                  <div className="text-xs font-bold uppercase tracking-wider text-gray-400">
                     Proposed By <br/> 
                     <span className="text-gray-800 normal-case">{proposal.ownerId?.username || "Unknown"}</span>
                  </div>
                  <div className="text-xs font-bold uppercase tracking-wider text-gray-400">
                     Proposal ID <br/> 
                     <span className="text-gray-800 font-mono">#{proposal.onChainProposalId?.toString().slice(0,8)}...</span>
                  </div>
               </div>
            </div>

            {/* AI Analysis Section */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-8 rounded-3xl border border-indigo-100">
               <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-indigo-900 flex items-center gap-2">
                     <BrainCircuit /> Agentic AI Analysis
                  </h2>
                  {!aiAnalysis && (
                     <button 
                        onClick={runAiAnalysis}
                        disabled={analyzing}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-700 disabled:opacity-50"
                     >
                        {analyzing ? "Analyzing..." : "Run Feasibility Check"}
                     </button>
                  )}
               </div>

               {analyzing && <div className="text-center py-10 text-indigo-400 animate-pulse">AI Agent is reviewing the proposal...</div>}

               {aiAnalysis && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                     <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/60 p-4 rounded-xl">
                           <p className="text-xs font-bold text-indigo-400 uppercase">Feasibility Score</p>
                           <p className="text-2xl font-black text-indigo-900">{Math.round(aiAnalysis.feasibilityScore * 100)}%</p>
                        </div>
                        <div className="bg-white/60 p-4 rounded-xl">
                           <p className="text-xs font-bold text-indigo-400 uppercase">Risk Level</p>
                           <p className="text-2xl font-black text-indigo-900">{Math.round(aiAnalysis.riskScore * 100)}%</p>
                        </div>
                     </div>
                     <div className="bg-white/60 p-5 rounded-xl">
                        <p className="font-bold text-indigo-900 mb-2">Key Risks Identified:</p>
                        <ul className="list-disc ml-5 text-indigo-800 text-sm space-y-1">
                           {aiAnalysis.keyRisks?.map((risk, i) => <li key={i}>{risk}</li>)}
                        </ul>
                     </div>
                     <p className="text-sm text-indigo-700 italic border-l-4 border-indigo-300 pl-4 py-1">
                        "{aiAnalysis.feasibility}"
                     </p>
                  </div>
               )}
            </div>
         </div>

         {/* RIGHT: Actions & Voting */}
         <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-lg shadow-gray-100 sticky top-6">
               <h3 className="font-bold text-gray-900 mb-6 text-lg">Cast Your Vote</h3>
               
               {isSigning || isMining ? (
                  <div className="text-center py-8 bg-gray-50 rounded-xl">
                     <Loader2 className="animate-spin mx-auto mb-3 text-maroon-600" size={32} />
                     <p className="font-bold text-gray-700">{isSigning ? "Check Wallet..." : "Mining Vote..."}</p>
                     <p className="text-xs text-gray-400 mt-1">Please wait for confirmation</p>
                  </div>
               ) : (
                  <div className="space-y-3">
                     <button 
                        onClick={() => handleVote(1)}
                        className="w-full py-4 rounded-xl bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 hover:bg-emerald-100 transition flex items-center justify-center gap-2"
                     >
                        <CheckCircle /> Vote For
                     </button>
                     <button 
                        onClick={() => handleVote(0)}
                        className="w-full py-4 rounded-xl bg-red-50 text-red-700 font-bold border border-red-200 hover:bg-red-100 transition flex items-center justify-center gap-2"
                     >
                        <XCircle /> Vote Against
                     </button>
                  </div>
               )}

               <div className="mt-8 pt-6 border-t border-gray-100">
                  <div className="flex justify-between text-sm mb-2">
                     <span className="text-gray-500">Current Support</span>
                     <span className="font-bold text-gray-900">{proposal.acceptCount} Votes</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                     <div 
                        className="bg-emerald-500 h-full" 
                        style={{ width: `${(proposal.acceptCount / (proposal.acceptCount + proposal.rejectCount || 1)) * 100}%` }}
                     />
                  </div>
               </div>
            </div>
         </div>

      </div>
    </div>
  );
}