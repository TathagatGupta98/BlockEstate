import { useBalance, useReadContract, useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import { TIMELOCK_ADDRESS, GOVERNOR_ADDRESS, GOVERNOR_ABI, TOKEN_ADDRESS, TOKEN_ABI } from '../abis';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, Search, AlertOctagon, Lock, Loader2, RefreshCw, 
  BarChart3, Vote, Bot, Hammer, CheckCircle2 
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_BACKEND_URL?.trim() || "http://localhost:8000";

export function Dashboard() {


  const { address } = useAccount();
  const [proposalIdInput, setProposalIdInput] = useState('');
  const [isOverdue, setIsOverdue] = useState(true);

  const [proposals, setProposals] = useState([]);
  const [loadingProposals, setLoadingProposals] = useState(false);
  const [proposalError, setProposalError] = useState(null);

  const [selectedMongoProposalId, setSelectedMongoProposalId] = useState(null);
  const [voteMsg, setVoteMsg] = useState("");

  // ✅ New State: Store vote context (ID + support) temporarily while waiting for blockchain
  const [pendingVoteCtx, setPendingVoteCtx] = useState(null);

  // ✅ AI feasibility tooltip state + cache
  const [openTooltipFor, setOpenTooltipFor] = useState(null); // mongo _id
  const [loadingFeasibilityFor, setLoadingFeasibilityFor] = useState(null);
  const [feasibilityCache, setFeasibilityCache] = useState({}); // { [mongoId]: result }
  const [feasibilityError, setFeasibilityError] = useState(null);


  const fetchProposals = async () => {
    try {
      setLoadingProposals(true);
      setProposalError(null);

      // 1. Initial Load (Fast)
      let res = await fetch(`${API_BASE}/api/v1/proposals`);
      let json = await res.json();
      let currentProposals = json?.data || [];

      // 2. Check for proposals that might need updating (Stage 1)
      const proposalsToSync = currentProposals.filter(p => p.status_stage === 'stage-1');

      if (proposalsToSync.length > 0) {
          console.log(`Syncing ${proposalsToSync.length} active proposals...`);
          
          const syncPromises = proposalsToSync.map(p => 
              fetch(`${API_BASE}/api/v1/proposals/${p._id}/sync`, { 
                  method: 'POST',
                  headers: { "Content-Type": "application/json" } 
              }).then(r => r.json())
          );
          
          const syncResults = await Promise.all(syncPromises);

          const hasUpdates = syncResults.some(r => r.data?.chainState === 4 || r.data?.chainState === 3);

          if (hasUpdates) {
             console.log("⚡ On-chain updates detected! Reloading data...");
             res = await fetch(`${API_BASE}/api/v1/proposals`);
             json = await res.json();
             currentProposals = json?.data || [];
          }
      }

      setProposals(currentProposals);

    } catch (err) {
      console.error(err);
      setProposalError(err?.message || "Failed to fetch proposals");
    } finally {
      setLoadingProposals(false);
    }
  };


  const fetchFeasibility = async (proposal) => {
    const mongoId = proposal?._id;
    if (!mongoId) return;

    // 1) cache hit
    if (feasibilityCache[mongoId]) {
      setOpenTooltipFor(mongoId);
      return;
    }

    try {
      setFeasibilityError(null);
      setLoadingFeasibilityFor(mongoId);

      const res = await fetch(`${API_BASE}/api/v1/ai/proposal/feasibility`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: proposal.description }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json?.message || "Failed to analyze feasibility");
      }

      setFeasibilityCache((prev) => ({
        ...prev,
        [mongoId]: json.data,
      }));

      setOpenTooltipFor(mongoId);
    } catch (err) {
      setFeasibilityError(err?.message || "AI analysis failed");
    } finally {
      setLoadingFeasibilityFor(null);
    }
  };


  useEffect(() => {
    fetchProposals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Check Maintenance Status
  useEffect(() => {
    const lastPayment = localStorage.getItem('lastMaintenancePayment');
    if (lastPayment) {
      const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
      if (Date.now() - parseInt(lastPayment) < thirtyDaysInMs) {
        setIsOverdue(false);
      }
    }
  }, []);

  const { data: treasuryBal, isLoading, refetch, isRefetching } = useBalance({
    address: TIMELOCK_ADDRESS,
    chainId: 11155111,
    query: { refetchInterval: 5000, staleTime: 0 }
  });

  const { data: votes } = useReadContract({
    address: TOKEN_ADDRESS,
    abi: TOKEN_ABI,
    functionName: 'getVotes',
    args: address ? [address] : undefined,
  });

  const { writeContract: delegate, isPending: isDelegating } = useWriteContract();

  // ✅ 1. SETUP WRITE CONTRACT & WAITER
  // We capture the hash so we can wait for it
  const { 
    writeContract: vote, 
    data: voteTxHash, 
    isPending: isSigningVote,
    error: voteError 
  } = useWriteContract();

  // ✅ 2. WAIT FOR RECEIPT
  const { 
    isLoading: isConfirmingVote, 
    isSuccess: isVoteConfirmed 
  } = useWaitForTransactionReceipt({
    hash: voteTxHash,
  });

  // Combined Loading State (Signing Wallet OR Mining Block)
  const isVoting = isSigningVote || isConfirmingVote;

  // ✅ 3. EFFECT: UPDATE DB ONLY AFTER CONFIRMATION
  useEffect(() => {
    if (isVoteConfirmed && pendingVoteCtx) {
      const completeVoteProcess = async () => {
        try {
          // Now we can safely update the backend
          await updateVoteInDb(pendingVoteCtx.mongoId, pendingVoteCtx.support);
          setVoteMsg("✅ Vote confirmed on-chain & database updated.");
          
          // Refresh UI
          fetchProposals();
        } catch (e) {
          setVoteMsg("⚠️ Vote mined, but DB update failed: " + e.message);
        } finally {
          setPendingVoteCtx(null); // Clear context to prevent double updates
        }
      };
      completeVoteProcess();
    }
  }, [isVoteConfirmed, pendingVoteCtx]); // Dependencies ensure this runs when transaction finishes

  // Handle Wallet Errors (User rejected signature)
  useEffect(() => {
    if (voteError) {
      setVoteMsg("❌ Transaction rejected or failed.");
      setPendingVoteCtx(null);
    }
  }, [voteError]);


  const updateVoteInDb = async (mongoId, support) => {
    if (!mongoId) return;

    const endpoint =
        support === 1
            ? `${API_BASE}/api/v1/proposals/${mongoId}/accept`
            : `${API_BASE}/api/v1/proposals/${mongoId}/reject`;

    const res = await fetch(endpoint, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      const json = await res.json().catch(() => null);
      throw new Error(json?.message || "Failed to store vote in DB");
    }
    return res.json();
  };

  // ✅ Vote handler: Triggers Chain Tx Only
  const handleVote = async (support) => {
    try {
      setVoteMsg("");
      if (!proposalIdInput) {
        setVoteMsg("Please paste/select a proposal ID.");
        return;
      }

      let mongoId = selectedMongoProposalId;
      if (!mongoId) {
        const match = proposals.find((p) => String(p.onChainProposalId) === String(proposalIdInput));
        mongoId = match?._id || null;
      }

      if (!mongoId) {
        setVoteMsg("Please select a proposal from the list so vote can be stored in database.");
        return;
      }

      // Store context so we can update DB later in useEffect
      setPendingVoteCtx({ mongoId, support });

      // Trigger Wallet
      vote({
        address: GOVERNOR_ADDRESS,
        abi: GOVERNOR_ABI,
        functionName: 'castVote',
        args: [BigInt(proposalIdInput), support],
      });

      // NOTE: We do NOT call updateVoteInDb here anymore.
      setVoteMsg("⏳ Please sign the transaction in your wallet...");

    } catch (e) {
      console.error(e);
      setVoteMsg(e?.message || "❌ Vote failed.");
      setPendingVoteCtx(null);
    }
  };

  // --- COLUMN CONFIGURATION ---
  const COLUMNS = [
    { id: 'stage-1', title: 'Voting Active', icon: <Vote size={18} />, color: 'bg-blue-50 border-blue-200 text-blue-900' },
    { id: 'stage-2', title: 'AI Selection', icon: <Bot size={18} />, color: 'bg-purple-50 border-purple-200 text-purple-900' },
    { id: 'stage-3', title: 'In Progress', icon: <Hammer size={18} />, color: 'bg-amber-50 border-amber-200 text-amber-900' },
    { id: 'stage-4', title: 'Completed', icon: <CheckCircle2 size={18} />, color: 'bg-emerald-50 border-emerald-200 text-emerald-900' }
  ];

  return (
      <div className="space-y-8 animate-in fade-in duration-500 pb-20">

        {/* 1. STATUS BANNER */}
        {isOverdue ? (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="bg-red-100 p-3 rounded-full text-red-600">
                  <AlertOctagon size={32} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-red-800">Voting Privileges Suspended</h2>
                  <p className="text-red-600">You have outstanding maintenance dues.</p>
                </div>
              </div>
              <Link to="/pay" className="bg-red-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-red-700 transition">
                Pay Dues Now
              </Link>
            </div>
        ) : (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3 text-emerald-800">
              <ShieldCheck className="text-emerald-600" size={24} />
              <span className="font-bold">Account Active • Voting Enabled</span>
            </div>
        )}

        {/* 2. STATS ROW */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Treasury Card */}
          <div className="bg-gradient-to-br from-maroon-800 to-maroon-900 text-white rounded-2xl p-8 shadow-lg relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex justify-between mb-1">
                <h2 className="text-maroon-200 font-medium">Community Treasury</h2>
                <button onClick={() => refetch()} className="p-1 hover:bg-white/10 rounded-full">
                  <RefreshCw size={16} className={(isLoading || isRefetching) ? "animate-spin" : ""} />
                </button>
              </div>
              <div className="text-4xl font-bold">
                {isLoading ? "Syncing..." : `${treasuryBal?.formatted?.slice(0, 8) || "0.00"}`}
                <span className="text-lg opacity-60 ml-2">ETH</span>
              </div>
            </div>
          </div>

          {/* Voting Power */}
          <div className="bg-white border border-maroon-100 rounded-2xl p-8 shadow-sm">
            <h2 className="text-gray-500 font-medium mb-1">Your Voting Power</h2>
            <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-maroon-900">
              {votes ? (Number(votes) / 1e18).toFixed(2) : '0.00'}
            </span>
              <span className="text-maroon-600 font-medium">SBT</span>
            </div>
            <button
                onClick={() => delegate({ address: TOKEN_ADDRESS, abi: TOKEN_ABI, functionName: 'delegate', args: [address] })}
                disabled={isDelegating || !address}
                className="mt-6 w-full py-3 bg-maroon-50 text-maroon-800 rounded-xl font-bold border border-maroon-200 disabled:opacity-50 flex items-center justify-center gap-2 hover:bg-maroon-100 transition"
            >
              {isDelegating && <Loader2 size={18} className="animate-spin" />}
              {isDelegating ? 'Activating...' : 'Activate Voting Power'}
            </button>
          </div>
        </div>

        {/* 3. VOTING INPUT SECTION */}
        <div className={`bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden ${isOverdue ? 'opacity-60 grayscale' : ''}`}>
          <div className="border-b border-gray-100 p-6 flex justify-between bg-gray-50">
            <h3 className="text-xl font-bold text-maroon-900">Cast Your Vote</h3>
            {isOverdue && <Lock size={20} className="text-gray-400" />}
          </div>
          <div className="p-6">
            <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
              <Search size={16} /> Paste Proposal ID
            </label>
            <input
                type="text"
                placeholder="0x..."
                value={proposalIdInput}
                onChange={(e) => {
                  setSelectedMongoProposalId(null);
                  setProposalIdInput(e.target.value);
                }}
                disabled={isOverdue}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-maroon-600 outline-none mb-4"
            />
            {!!voteMsg && <p className="text-sm mb-3 text-gray-700">{voteMsg}</p>}
            
            {/* Show extra feedback during confirmation */}
            {isConfirmingVote && (
              <div className="mb-4 bg-blue-50 text-blue-800 p-3 rounded-lg flex items-center gap-2 text-sm animate-pulse">
                 <Loader2 size={16} className="animate-spin" />
                 Transaction Sent! Waiting for blockchain confirmation...
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => handleVote(1)} disabled={isVoting || isOverdue || !proposalIdInput} className="bg-emerald-600 text-white py-3 rounded-xl font-bold disabled:bg-gray-300 flex items-center justify-center gap-2 hover:bg-emerald-700 transition">
                {isVoting && <Loader2 size={18} className="animate-spin" />} 
                {isSigningVote ? "Sign..." : isConfirmingVote ? "Mining..." : "Approve"}
              </button>
              <button onClick={() => handleVote(0)} disabled={isVoting || isOverdue || !proposalIdInput} className="bg-red-600 text-white py-3 rounded-xl font-bold disabled:bg-gray-300 flex items-center justify-center gap-2 hover:bg-red-700 transition">
                {isVoting && <Loader2 size={18} className="animate-spin" />} 
                {isSigningVote ? "Sign..." : isConfirmingVote ? "Mining..." : "Reject"}
              </button>
            </div>
          </div>
        </div>

        {/* 4. FOUR COLUMN KANBAN BOARD */}
        <div>
           <div className="flex items-center justify-between mb-6">
             <div className="flex items-center gap-2">
               <BarChart3 size={20} className="text-maroon-900" />
               <h3 className="text-2xl font-bold text-gray-900">Live Governance Board</h3>
             </div>

             {/* MANUAL SYNC BUTTON */}
             <button 
               onClick={fetchProposals}
               disabled={loadingProposals}
               className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 hover:text-maroon-900 hover:border-maroon-200 transition shadow-sm active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
             >
               <RefreshCw size={16} className={loadingProposals ? "animate-spin text-maroon-600" : "text-gray-500"} />
               {loadingProposals ? "Syncing Chain..." : "Sync Status"}
             </button>
           </div>
           
           {loadingProposals && <p className="text-center py-10">Loading proposals...</p>}
           
           {/* THE COLUMNS GRID */}
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
             {COLUMNS.map((col) => {
               // Filter proposals for this column
               // Default to stage-1 if status is missing/undefined
               const colProposals = proposals.filter(p => (p.status_stage || 'stage-1') === col.id);

               return (
                 <div key={col.id} className="flex flex-col h-full">
                   {/* Column Header */}
                   <div className={`p-4 rounded-t-xl border-t border-l border-r border-b-0 flex items-center justify-between ${col.color}`}>
                     <div className="flex items-center gap-2 font-bold">
                       {col.icon}
                       {col.title}
                     </div>
                     <span className="bg-white/50 px-2 py-0.5 rounded-full text-xs font-bold">
                       {colProposals.length}
                     </span>
                   </div>

                   {/* Column Body (Gray Background) */}
                   <div className="bg-gray-50 border border-gray-200 rounded-b-xl p-4 flex-1 space-y-4 min-h-[300px]">
                     {colProposals.length === 0 ? (
                       <div className="h-full flex items-center justify-center text-gray-400 text-sm italic">
                         No proposals
                       </div>
                     ) : (
                       colProposals.map((p) => (
                         <div key={p._id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition group">
                           <h5 className="font-bold text-gray-900 mb-1 line-clamp-2">{p.title}</h5>
                           <p className="text-xs text-gray-500 mb-3 line-clamp-3">{p.description}</p>
                           
                           {/* Vote Counts */}
                           <div className="flex gap-3 mb-3 text-xs border-t border-gray-100 pt-2">
                              <span className="text-emerald-700 font-semibold">For: {p.acceptCount || 0}</span>
                              <span className="text-red-700 font-semibold">Against: {p.rejectCount || 0}</span>
                           </div>

                           {/* Select Button */}
                           <div className="flex items-center gap-2 relative">
  {/* ✅ Feasibility */}
  <button
    type="button"
    onClick={() => fetchFeasibility(p)}
    className="w-9 h-9 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-black flex items-center justify-center"
    title="Check feasibility"
  >
    {loadingFeasibilityFor === p._id ? (
      <Loader2 size={16} className="animate-spin" />
    ) : (
      "?"
    )}
  </button>

  {/* Tooltip */}
  {openTooltipFor === p._id && (
    <div className="absolute right-0 top-11 z-50 w-[380px] bg-white border border-gray-200 rounded-2xl shadow-xl p-4">
      <div className="flex items-start justify-between gap-2">
        <p className="font-bold text-gray-900">Feasibility Report</p>
        <button
          onClick={() => setOpenTooltipFor(null)}
          className="text-gray-500 hover:text-gray-900"
        >
          ✕
        </button>
      </div>

      {feasibilityError && (
        <p className="text-sm text-red-600 mt-2">{feasibilityError}</p>
      )}

      {feasibilityCache[p._id] ? (
        <>
          <div className="mt-3 text-sm space-y-2">
            <p>
              <span className="font-bold">Feasibility:</span>{" "}
              {feasibilityCache[p._id].feasibility}{" "}
              <span className="text-gray-400">
                ({Math.round(feasibilityCache[p._id].feasibilityScore * 100)}%)
              </span>
            </p>

            <p>
              <span className="font-bold">Risk:</span>{" "}
              {Math.round(feasibilityCache[p._id].riskScore * 100)}%
            </p>

            <p>
              <span className="font-bold">Time:</span>{" "}
              {feasibilityCache[p._id].approxTimeMonths} months
            </p>

            <p>
              <span className="font-bold">Budget:</span>{" "}
              {feasibilityCache[p._id].approxBudgetLevel}
            </p>

            {!!feasibilityCache[p._id].keyRisks?.length && (
              <div>
                <p className="font-bold mb-1">Key Risks</p>
                <ul className="list-disc ml-5 text-gray-700">
                  {feasibilityCache[p._id].keyRisks.slice(0, 4).map((x, i) => (
                    <li key={i}>{x}</li>
                  ))}
                </ul>
              </div>
            )}

            {!!feasibilityCache[p._id].suggestedChanges?.length && (
              <div>
                <p className="font-bold mb-1">Suggested Changes</p>
                <ul className="list-disc ml-5 text-gray-700">
                  {feasibilityCache[p._id].suggestedChanges.slice(0, 4).map((x, i) => (
                    <li key={i}>{x}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </>
      ) : (
        <p className="text-sm text-gray-500 mt-2">No analysis yet.</p>
      )}
    </div>
  )}

  {/* ✅ existing Use ID button */}
  <button
    onClick={() => {
      setSelectedMongoProposalId(p._id);
      setProposalIdInput(p.onChainProposalId || "");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }}
    className="bg-maroon-50 text-maroon-900 px-4 py-2 rounded-lg text-sm font-bold hover:bg-maroon-100 transition whitespace-nowrap"
  >
    Use ID
  </button>
</div>
                         </div>
                       ))
                     )}
                   </div>
                 </div>
               );
             })}
           </div>
        </div>

      </div>
  );
}