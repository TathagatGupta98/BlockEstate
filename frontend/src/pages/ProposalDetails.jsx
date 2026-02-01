import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { GOVERNOR_ADDRESS, GOVERNOR_ABI } from '../abis'; 
import { 
  Loader2, ArrowLeft, BrainCircuit, CheckCircle, XCircle, 
  Building2, Wallet, Sparkles, Bot, AlertTriangle, Lightbulb, 
  ArrowRight, FileSignature
} from 'lucide-react';

const API_BASE = "http://localhost:8000/api/v1";

export function ProposalDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { address } = useAccount();

  // --- 1. DATA STATE ---
  const [proposal, setProposal] = useState(null);
  const [loading, setLoading] = useState(true);

  // Bids State
  const [bids, setBids] = useState([]);
  const [loadingBids, setLoadingBids] = useState(false);

  // AI Feasibility State (Right Column)
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  
  // AI Consensus State (Left Column)
  const [consensus, setConsensus] = useState(null);
  const [consensusLoading, setConsensusLoading] = useState(false);

  // --- 2. SMART CONTRACT HOOKS ---

  // A. Voting Hook (For the CURRENT proposal)
  const { 
    writeContract: vote, 
    data: txHash, 
    isPending: isSigning 
  } = useWriteContract();

  const { 
    isLoading: isMining, 
    isSuccess: isConfirmed 
  } = useWaitForTransactionReceipt({ hash: txHash });

  // B. Propose Next Stage Hook (For creating the Stage 3 proposal)
  const { 
    writeContract: proposeNextStage, 
    data: proposeTxHash, 
    isPending: isSigningPropose 
  } = useWriteContract();

  const { 
    isLoading: isMiningPropose, 
    isSuccess: isProposeConfirmed 
  } = useWaitForTransactionReceipt({ hash: proposeTxHash });


  // --- 3. DATA FETCHING EFFECTS ---

  // Fetch Proposal Details
  useEffect(() => {
    fetch(`${API_BASE}/proposals/${id}`)
      .then(r => r.json())
      .then(d => setProposal(d.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  // Fetch Bids (Only if proposal exists and user is logged in)
  useEffect(() => {
    if (proposal?._id) {
       setLoadingBids(true);
       const token = localStorage.getItem("token"); 
       
       fetch(`${API_BASE}/bids/proposal/${proposal._id}`, {
         headers: { 
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
         }
       })
         .then(r => {
             // Handle 401 gracefully
             if (r.status === 401) return { data: [] };
             return r.json();
         })
         .then(d => setBids(d.data || []))
         .catch(console.error)
         .finally(() => setLoadingBids(false));
    }
  }, [proposal]);


  // --- 4. ACTION HANDLERS ---

  // A. Run AI Feasibility Analysis (Right Card)
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

  // B. Run AI Consensus Agent (Left Card - Stage 2)
  const runConsensusAgent = async () => {
      if (!proposal?._id) return;
      setConsensusLoading(true);
      setConsensus(null);
      try {
          const res = await fetch(`${API_BASE}/ai/bids/consensus`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ proposalId: proposal._id }),
          });
          const json = await res.json();
          if (!json.success) throw new Error(json.message || "Consensus failed");
          setConsensus(json.data.result);
      } catch (err) {
          alert("Consensus Agent Failed: " + err.message);
      } finally {
          setConsensusLoading(false);
      }
  };

  // C. Cast Vote Handler
  const handleVote = (support) => {
     if(!proposal?.onChainProposalId) return alert("No on-chain ID found");

     // ✅ FIX: Block voting if the ID is still syncing
     if (proposal.onChainProposalId.toString().startsWith("PENDING_SYNC")) {
        return alert("⏳ The Proposal ID is currently syncing from the blockchain. Please wait a few minutes and refresh the Dashboard to get the real ID.");
     }

     try {
        vote({
            address: GOVERNOR_ADDRESS,
            abi: GOVERNOR_ABI,
            functionName: 'castVote',
            args: [BigInt(proposal.onChainProposalId), support], 
        });
     } catch (err) {
        console.error("Voting Error:", err);
        alert("Invalid Proposal ID: " + err.message);
     }
  };

  // D. Proceed to Stage 3 (Raise New Proposal)
  const handleProceedToStage3 = async () => {
    if (!consensus || !consensus.winner) return alert("No winner selected yet.");
    
    // Find the winning bid object to get the wallet address
    const winningBid = bids.find(b => b.companyId?.name === consensus.winner);
    
    if (!winningBid || !winningBid.companyId?.walletAddress) {
        return alert(`Could not find wallet address for winner: ${consensus.winner}`);
    }

    const winnerAddress = winningBid.companyId.walletAddress;
    const description = `FINAL EXECUTION VOTE: ${consensus.winner}\n\nREASONING:\n${consensus.explanation}`;

    // On-Chain: Raise Proposal
    // We propose a 0 ETH transfer to the company address as the "Action"
    proposeNextStage({
        address: GOVERNOR_ADDRESS,
        abi: GOVERNOR_ABI,
        functionName: 'propose',
        args: [
            [winnerAddress], // Target: The Company's Wallet
            [0],             // Value: 0 ETH 
            ["0x"],          // Calldata: Empty
            description      // Description: The AI's explanation
        ],
    });
  };

  // --- 5. TRANSACTION SYNC EFFECTS ---

  // Sync Vote to DB
  useEffect(() => {
     if(isConfirmed) {
        alert("Vote Confirmed on Chain!");
        // Optional: Trigger a re-fetch of proposal data here
     }
  }, [isConfirmed]);

  // Sync New Stage 3 Proposal to DB
  useEffect(() => {
    if (isProposeConfirmed && proposeTxHash && consensus) {
       const syncNewProposal = async () => {
           try {
               const token = localStorage.getItem("token");
               const response = await fetch(`${API_BASE}/proposals/create`, {
                   method: "POST",
                   headers: { 
                       "Content-Type": "application/json",
                       "Authorization": `Bearer ${token}`
                   },
                   body: JSON.stringify({
                       title: `Final Vote: ${proposal.title} - ${consensus.winner}`,
                       description: consensus.explanation,
                       txHash: proposeTxHash,
                       status_stage: "stage-3", // <--- Force Stage 3
                       // Using a temp ID until Indexer runs
                       onChainProposalId: "PENDING_SYNC_" + Date.now() 
                   })
               });

               if(response.ok) {
                   alert("Stage 3 Proposal Created Successfully! Redirecting...");
                   navigate("/dashboard");
               }
           } catch (e) {
               console.error("Backend sync failed", e);
           }
       };
       syncNewProposal();
    }
  }, [isProposeConfirmed, proposeTxHash, consensus, navigate, proposal]);


  // --- 6. RENDER ---

  if (loading) return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin text-maroon-900" size={48} /></div>;
  if (!proposal) return <div className="p-20 text-center text-gray-500">Proposal not found</div>;

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 animate-in fade-in duration-500 pb-24">
      <button onClick={() => navigate(-1)} className="flex items-center text-gray-500 hover:text-gray-900 mb-6 font-medium transition-colors">
         <ArrowLeft size={18} className="mr-1" /> Back to Dashboard
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         
         {/* ================= LEFT COLUMN ================= */}
         <div className="lg:col-span-2 space-y-8">
            
            {/* 1. Proposal Header Card */}
            <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm">
               <div className="flex items-center gap-3 mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider 
                    ${proposal.status_stage === 'stage-2' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                    {proposal.status_stage === 'stage-2' ? 'Reviewing Bids' : proposal.status_stage?.replace('-', ' ')}
                  </span>
               </div>
               <h1 className="text-3xl font-bold text-gray-900 mb-4">{proposal.title}</h1>
               <div className="prose text-gray-600 leading-relaxed whitespace-pre-wrap">
                  {proposal.description}
               </div>
               
               <div className="flex gap-4 mt-8 pt-6 border-t border-gray-100">
                  <div className="text-xs font-bold uppercase tracking-wider text-gray-400">
                     Proposed By <br/> 
                     <span className="text-gray-800 normal-case">{proposal.ownerId?.username || "Unknown"}</span>
                  </div>
                  <div className="text-xs font-bold uppercase tracking-wider text-gray-400">
                     Proposal ID <br/> 
                     <span className="text-gray-800 font-mono">
                        #{proposal.onChainProposalId?.toString().slice(0,8)}...
                     </span>
                  </div>
               </div>
            </div>

            {/* 2. BIDS & CONSENSUS SECTION (Only for Stage 2+) */}
            {['stage-2', 'stage-3', 'stage-4'].includes(proposal.status_stage) && (
              <div className="space-y-6">
                
                {/* Bids List Header */}
                <div className="flex items-center gap-2">
                   <Building2 className="text-maroon-900" />
                   <h2 className="text-2xl font-bold text-gray-900">Received Bids</h2>
                   <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-bold">{bids.length}</span>
                </div>

                {/* Bids List Content */}
                {loadingBids ? (
                   <p className="text-gray-500 italic flex items-center gap-2"><Loader2 className="animate-spin" size={16}/> Loading bids...</p>
                ) : bids.length === 0 ? (
                   <div className="bg-gray-50 border border-dashed border-gray-200 p-8 rounded-2xl text-center text-gray-400">
                      Waiting for companies to submit proposals...
                   </div>
                ) : (
                   <div className="grid gap-4">
                      {bids.map((bid) => (
                         <div key={bid._id} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:border-maroon-200 transition-colors">
                            <div className="flex justify-between items-start mb-2">
                               <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                                  <Building2 size={18} className="text-gray-400" />
                                  {bid.companyId?.name || "Unknown Company"}
                                  {bid.companyId?.verified && <CheckCircle size={14} className="text-blue-500" />}
                               </h3>
                               <div className="flex items-center gap-1 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-lg font-bold text-sm">
                                  <Wallet size={14} /> {bid.estimatedId}
                               </div>
                            </div>
                            <p className="text-gray-600 text-sm mb-4 bg-gray-50 p-3 rounded-lg border border-gray-100">
                               {bid.description}
                            </p>
                            <div className="text-xs text-gray-400 text-right">
                               Submitted: {new Date(bid.createdAt).toLocaleDateString()}
                            </div>
                         </div>
                      ))}
                   </div>
                )}

                {/* 3. AI CONSENSUS AGENT UI */}
                <div className="bg-gradient-to-r from-gray-900 to-maroon-900 p-1 rounded-3xl mt-8 shadow-xl">
                   <div className="bg-white rounded-[22px] p-6">
                      <div className="flex items-center gap-3 mb-4">
                         <div className="bg-indigo-100 p-2 rounded-xl text-indigo-600">
                            <Bot size={24} />
                         </div>
                         <div>
                            <h3 className="text-lg font-bold text-gray-900">AI Consensus Agent</h3>
                            <p className="text-xs text-gray-500">Analyzing bids for cost, reputation, and feasibility.</p>
                         </div>
                      </div>

                      {/* State: Ready to Analyze */}
                      {!consensus && (
                          <div className="text-center py-6">
                             {bids.length > 0 ? (
                                 <button
                                     onClick={runConsensusAgent}
                                     disabled={consensusLoading}
                                     className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold transition shadow-lg shadow-indigo-200 disabled:opacity-50 flex items-center gap-2 mx-auto"
                                 >
                                     {consensusLoading ? <Loader2 className="animate-spin" /> : <Sparkles size={18} />}
                                     {consensusLoading ? "Analyzing Bids..." : "Run Consensus Protocol"}
                                 </button>
                             ) : (
                                 <p className="text-gray-400">Waiting for bids...</p>
                             )}
                          </div>
                      )}

                      {/* State: Winner Selected */}
                      {consensus && (
                         <div className="mt-4 bg-indigo-50/50 rounded-xl border border-indigo-100 p-6 text-left animate-in zoom-in-95">
                             <div className="flex justify-between items-start mb-4">
                                 <div>
                                    <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Selected Winner</p>
                                    <p className="text-2xl font-black text-gray-900">{consensus.winner}</p>
                                 </div>
                                 <div className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold">
                                    Highest Score
                                 </div>
                             </div>

                             <p className="text-sm text-gray-700 whitespace-pre-wrap mb-6 border-l-4 border-indigo-500 pl-4">
                                 {consensus.explanation}
                             </p>

                             {/* PROCEED BUTTON */}
                             <div className="pt-6 border-t border-indigo-200">
                                <button 
                                    onClick={handleProceedToStage3}
                                    disabled={isSigningPropose || isMiningPropose}
                                    className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold hover:bg-black transition shadow-lg flex items-center justify-center gap-3"
                                >
                                    {isSigningPropose ? (
                                        <> <Loader2 className="animate-spin" /> Check Wallet... </>
                                    ) : isMiningPropose ? (
                                        <> <Loader2 className="animate-spin" /> Creating Stage 3 Proposal... </>
                                    ) : (
                                        <> <FileSignature size={20} /> Proceed to Final Vote (Stage 3) <ArrowRight size={20} /> </>
                                    )}
                                </button>
                                <p className="text-center text-xs text-gray-400 mt-3">
                                    This will raise a new on-chain proposal to authorize the contract for {consensus.winner}.
                                </p>
                             </div>
                         </div>
                      )}
                   </div>
                </div>

              </div>
            )}
         </div>

         {/* ================= RIGHT COLUMN ================= */}
         <div className="space-y-6">
            
            {/* 4. AI Feasibility Check Card */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-3xl border border-indigo-100">
               <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-indigo-900 flex items-center gap-2">
                     <BrainCircuit size={20} /> Feasibility Check
                  </h2>
               </div>

               {!aiAnalysis && (
                 <button 
                    onClick={runAiAnalysis}
                    disabled={analyzing}
                    className="w-full bg-indigo-600 text-white px-4 py-3 rounded-xl text-sm font-bold hover:bg-indigo-700 disabled:opacity-50 flex justify-center items-center gap-2 shadow-lg shadow-indigo-200"
                 >
                    {analyzing ? <Loader2 className="animate-spin" size={16}/> : <Sparkles size={16}/>}
                    {analyzing ? "Analyzing..." : "Run AI Check"}
                 </button>
               )}

               {aiAnalysis && (
                  <div className="space-y-4 animate-in fade-in">
                     <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white/60 p-3 rounded-xl text-center">
                           <p className="text-[10px] font-bold text-indigo-400 uppercase">Score</p>
                           <p className="text-2xl font-black text-indigo-900">{Math.round(aiAnalysis.feasibilityScore * 100)}%</p>
                        </div>
                        <div className="bg-white/60 p-3 rounded-xl text-center">
                           <p className="text-[10px] font-bold text-indigo-400 uppercase">Risk</p>
                           <p className="text-2xl font-black text-indigo-900">{Math.round(aiAnalysis.riskScore * 100)}%</p>
                        </div>
                     </div>
                     <div className="flex justify-between text-xs text-indigo-800 font-bold bg-white/40 p-2 rounded-lg">
                        <span>⏱ {aiAnalysis.approxTimeMonths} Months</span>
                        <span>💰 {aiAnalysis.approxBudgetLevel}</span>
                     </div>
                     <div className="bg-white/60 p-4 rounded-xl text-sm text-indigo-900 leading-relaxed border-l-4 border-indigo-400">
                        {aiAnalysis.feasibility}
                     </div>
                     {aiAnalysis.keyRisks?.length > 0 && (
                        <div className="bg-red-50/50 p-4 rounded-xl border border-red-100">
                           <h4 className="flex items-center gap-2 text-xs font-bold text-red-800 uppercase mb-2">
                              <AlertTriangle size={12} /> Key Risks
                           </h4>
                           <ul className="list-disc ml-4 text-xs text-red-700 space-y-1">
                              {aiAnalysis.keyRisks.slice(0, 3).map((r, i) => <li key={i}>{r}</li>)}
                           </ul>
                        </div>
                     )}
                     {aiAnalysis.suggestedChanges?.length > 0 && (
                        <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-100">
                           <h4 className="flex items-center gap-2 text-xs font-bold text-amber-800 uppercase mb-2">
                              <Lightbulb size={12} /> Suggestions
                           </h4>
                           <ul className="list-disc ml-4 text-xs text-amber-700 space-y-1">
                              {aiAnalysis.suggestedChanges.slice(0, 3).map((s, i) => <li key={i}>{s}</li>)}
                           </ul>
                        </div>
                     )}
                  </div>
               )}
            </div>

            {/* 5. Voting Card (HIDDEN IN STAGE 2) */}
            {proposal.status_stage !== 'stage-2' && (
                <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-lg shadow-gray-100 sticky top-6">
                   <h3 className="font-bold text-gray-900 mb-6 text-lg">Cast Your Vote</h3>
                   
                   {isSigning || isMining ? (
                      <div className="text-center py-8 bg-gray-50 rounded-xl">
                         <Loader2 className="animate-spin mx-auto mb-3 text-maroon-600" size={32} />
                         <p className="font-bold text-gray-700">{isSigning ? "Check Wallet..." : "Mining Vote..."}</p>
                      </div>
                   ) : (
                      <div className="space-y-3">
                         <button onClick={() => handleVote(1)} className="w-full py-3 rounded-xl bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 hover:bg-emerald-100 transition flex items-center justify-center gap-2">
                            <CheckCircle size={18} /> Approve
                         </button>
                         <button onClick={() => handleVote(0)} className="w-full py-3 rounded-xl bg-red-50 text-red-700 font-bold border border-red-200 hover:bg-red-100 transition flex items-center justify-center gap-2">
                            <XCircle size={18} /> Reject
                         </button>
                      </div>
                   )}

                   <div className="mt-8 pt-6 border-t border-gray-100">
                      <div className="flex justify-between text-xs mb-2 text-gray-500 uppercase font-bold tracking-wider">
                         <span>Results</span>
                         <span>{proposal.acceptCount} For</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                         <div 
                            className="bg-emerald-500 h-full transition-all duration-500" 
                            style={{ width: `${(proposal.acceptCount / ((proposal.acceptCount + proposal.rejectCount) || 1)) * 100}%` }} 
                         />
                      </div>
                   </div>
                </div>
            )}
         </div>

      </div>
    </div>
  );
}