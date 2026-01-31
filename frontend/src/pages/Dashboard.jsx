import { useBalance, useReadContract, useWriteContract, useAccount } from 'wagmi';
import { TIMELOCK_ADDRESS, GOVERNOR_ADDRESS, GOVERNOR_ABI, TOKEN_ADDRESS, TOKEN_ABI } from '../abis';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Search, AlertOctagon, Lock, Loader2, RefreshCw, BarChart3 } from 'lucide-react';

const API_BASE = "http://localhost:8000";

export function Dashboard() {
  const { address } = useAccount();
  const [proposalIdInput, setProposalIdInput] = useState('');
  const [isOverdue, setIsOverdue] = useState(true);

  // ✅ proposals state
  const [proposals, setProposals] = useState([]);
  const [loadingProposals, setLoadingProposals] = useState(false);
  const [proposalError, setProposalError] = useState(null);

  // ✅ selected proposal mapping
  const [selectedMongoProposalId, setSelectedMongoProposalId] = useState(null);

  // ✅ user feedback for vote actions
  const [voteMsg, setVoteMsg] = useState("");

  // Fetch Proposals from MongoDB
  const fetchProposals = async () => {
    try {
      setLoadingProposals(true);
      setProposalError(null);

      const res = await fetch(`${API_BASE}/api/v1/proposals`);
      const json = await res.json();

      setProposals(json?.data || []);
    } catch (err) {
      setProposalError(err?.message || "Failed to fetch proposals");
    } finally {
      setLoadingProposals(false);
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
  const { writeContract: vote, isPending: isVoting } = useWriteContract();

  // ✅ Update vote count in MongoDB
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

  // ✅ Vote handler: on-chain + DB update
  const handleVote = async (support) => {
    try {
      setVoteMsg("");

      if (!proposalIdInput) {
        setVoteMsg("Please paste/select a proposal ID.");
        return;
      }

      // If user typed manually, map onChainProposalId -> mongo _id
      let mongoId = selectedMongoProposalId;
      if (!mongoId) {
        const match = proposals.find((p) => String(p.onChainProposalId) === String(proposalIdInput));
        mongoId = match?._id || null;
      }

      if (!mongoId) {
        setVoteMsg("Please select a proposal from the list so vote can be stored in database.");
        return;
      }

      // 1) Cast vote on-chain
      await vote({
        address: GOVERNOR_ADDRESS,
        abi: GOVERNOR_ABI,
        functionName: 'castVote',
        args: [BigInt(proposalIdInput), support],
      });

      // 2) Store in DB
      await updateVoteInDb(mongoId, support);

      setVoteMsg("✅ Vote recorded on-chain + stored in database.");

      // Refresh proposals list to update counts
      fetchProposals();
    } catch (e) {
      console.error(e);
      setVoteMsg(e?.message || "❌ Vote failed.");
    }
  };

  return (
      <div className="space-y-8 animate-in fade-in duration-500">

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
              <Link
                  to="/pay"
                  className="bg-red-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-red-700 transition"
              >
                Pay Dues Now
              </Link>
            </div>
        ) : (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3 text-emerald-800">
              <ShieldCheck className="text-emerald-600" size={24} />
              <span className="font-bold">Account Active • Voting Enabled</span>
            </div>
        )}

        {/* Stats Row */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Treasury Card */}
          <div className="bg-gradient-to-br from-maroon-800 to-maroon-900 text-white rounded-2xl p-8 shadow-lg relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex justify-between mb-1">
                <h2 className="text-maroon-200 font-medium">Community Treasury</h2>
                <button
                    onClick={() => refetch()}
                    className="p-1 hover:bg-white/10 rounded-full"
                >
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
                className="mt-6 w-full py-3 bg-maroon-50 text-maroon-800 rounded-xl font-bold border border-maroon-200 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isDelegating && <Loader2 size={18} className="animate-spin" />}
              {isDelegating ? 'Activating...' : 'Activate Voting Power'}
            </button>
          </div>
        </div>

        {/* Voting Section */}
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

            {!!voteMsg && (
                <p className="text-sm mb-3 text-gray-700">{voteMsg}</p>
            )}

            <div className="grid grid-cols-2 gap-4">
              <button
                  onClick={() => handleVote(1)}
                  disabled={isVoting || isOverdue || !proposalIdInput}
                  className="bg-emerald-600 text-white py-3 rounded-xl font-bold disabled:bg-gray-300 flex items-center justify-center gap-2"
              >
                {isVoting && <Loader2 size={18} className="animate-spin" />} Approve
              </button>

              <button
                  onClick={() => handleVote(0)}
                  disabled={isVoting || isOverdue || !proposalIdInput}
                  className="bg-red-600 text-white py-3 rounded-xl font-bold disabled:bg-gray-300 flex items-center justify-center gap-2"
              >
                {isVoting && <Loader2 size={18} className="animate-spin" />} Reject
              </button>
            </div>
          </div>
        </div>

        {/* Proposals from MongoDB */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
          <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <BarChart3 size={16} /> Recent Activity
          </h4>

          {loadingProposals && <p className="text-gray-500 text-sm italic">Fetching proposals...</p>}
          {proposalError && <p className="text-red-600 text-sm">Error: {proposalError}</p>}
          {!loadingProposals && proposals.length === 0 && <p className="text-gray-500 text-sm">No activity found.</p>}

          <div className="divide-y divide-gray-100">
            {proposals.map((p) => (
                <div key={p._id} className="flex items-center justify-between py-4 group">
                  <div className="min-w-0 pr-4">
                    <p className="font-bold text-gray-900 truncate">{p.title}</p>
                    <p className="text-sm text-gray-500 line-clamp-1">{p.description}</p>
                    <div className="flex gap-3 mt-1">
                      <span className="text-xs text-emerald-600 font-medium">For: {p.acceptCount || 0}</span>
                      <span className="text-xs text-red-600 font-medium">Against: {p.rejectCount || 0}</span>
                    </div>
                  </div>

                  <button
                      onClick={() => {
                        setSelectedMongoProposalId(p._id);
                        setProposalIdInput(p.onChainProposalId || "");
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="bg-maroon-50 text-maroon-900 px-4 py-2 rounded-lg text-sm font-bold hover:bg-maroon-100 transition whitespace-nowrap"
                  >
                    Use ID
                  </button>
                </div>
            ))}
          </div>
        </div>

      </div>
  );
}
