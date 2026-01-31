import { useBalance, useReadContract, useWriteContract, useAccount } from 'wagmi';
import { TIMELOCK_ADDRESS, GOVERNOR_ADDRESS, GOVERNOR_ABI, TOKEN_ADDRESS, TOKEN_ABI } from '../abis';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Search, AlertOctagon, Lock, Loader2, RefreshCw } from 'lucide-react';
import { getAddress } from 'viem';

export function Dashboard() {
  const { address } = useAccount();
  const [proposalIdInput, setProposalIdInput] = useState('');
  const [isOverdue, setIsOverdue] = useState(true); 

  useEffect(() => {
    const lastPayment = localStorage.getItem('lastMaintenancePayment');
    if (lastPayment) {
      const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
      const timeSincePayment = Date.now() - parseInt(lastPayment);
      if (timeSincePayment < thirtyDaysInMs) {
        setIsOverdue(false); 
      }
    }
  }, []);

  // Updated useBalance with refetch capability
  const { 
    data: treasuryBal, 
    isError, 
    isLoading, 
    refetch,
    isRefetching 
  } = useBalance({
    address: TIMELOCK_ADDRESS,
    chainId: 11155111,
    query: {
      refetchInterval: 5000, 
      staleTime: 0 
    }
  });

  const { data: votes } = useReadContract({
    address: TOKEN_ADDRESS, abi: TOKEN_ABI, functionName: 'getVotes', args: [address],
  });

  const { writeContract: delegate, isPending: isDelegating } = useWriteContract();
  const { writeContract: vote, isPending: isVoting } = useWriteContract();

  // Helper to format balance safely
  const formatBalance = (data) => {
    if (!data) return "0.0000";
    const parsed = parseFloat(data.formatted);
    return isNaN(parsed) ? "0.0000" : parsed.toLocaleString(undefined, {
      minimumFractionDigits: 4, 
      maximumFractionDigits: 4
    });
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
              <p className="text-red-600">You have outstanding maintenance dues. You cannot vote until resolved.</p>
            </div>
          </div>
          <Link to="/pay" className="bg-red-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-red-700 transition whitespace-nowrap">
            Pay Dues Now
          </Link>
        </div>
      ) : (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3 text-emerald-800">
          <ShieldCheck className="fill-emerald-100 text-emerald-600" size={24} />
          <span className="font-bold">Account in Good Standing</span>
          <span className="text-sm opacity-75">• Voting Enabled</span>
        </div>
      )}

      {/* Stats Row */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Treasury Card */}
        <div className="bg-gradient-to-br from-maroon-800 to-maroon-900 text-white rounded-2xl p-8 shadow-lg shadow-maroon-100 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-1">
              <h2 className="text-maroon-200 font-medium">Community Treasury</h2>
              <button 
                onClick={() => refetch()} 
                className="p-1 hover:bg-white/10 rounded-full transition-colors"
                title="Force Refresh"
              >
                <RefreshCw size={16} className={(isLoading || isRefetching) ? "animate-spin" : ""} />
              </button>
            </div>
            
            <div className="text-4xl font-bold">
              {isLoading ? (
                <span className="opacity-50">Syncing...</span>
              ) : (
                // Direct access to formatted string to bypass Number conversion if it's failing
                `${treasuryBal?.formatted?.slice(0, 8) || "0.00"}`
              )} 
              <span className="text-lg opacity-60 ml-2">ETH</span>
            </div>

            <div className="mt-6 flex items-center gap-2">
              <div className="text-maroon-300 text-xs font-mono bg-maroon-950/30 px-2 py-1 rounded">
                {TIMELOCK_ADDRESS}
              </div>
              {/* Visual confirmation that we are connected to the right address */}
              <a 
                href={`https://sepolia.etherscan.io/address/${TIMELOCK_ADDRESS}`}
                target="_blank"
                className="text-[10px] uppercase font-bold text-maroon-400 hover:text-white underline"
              >
                View on Explorer
              </a>
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
            disabled={isDelegating}
            className="mt-6 w-full py-3 bg-maroon-50 hover:bg-maroon-100 text-maroon-800 rounded-xl font-bold transition border border-maroon-200 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isDelegating && <Loader2 size={18} className="animate-spin" />}
            {isDelegating ? 'Activating...' : 'Activate Voting Power'}
          </button>
        </div>
      </div>

      {/* Voting Section */}
      <div className={`bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden transition-all ${isOverdue ? 'opacity-60 grayscale' : ''}`}>
        <div className="border-b border-gray-100 p-6 flex justify-between items-center bg-gray-50">
          <h3 className="text-xl font-bold text-maroon-900">Cast Your Vote</h3>
          {isOverdue && <Lock size={20} className="text-gray-400" />}
        </div>
        
        <div className="p-6">
          <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
            <Search size={16} /> Enter Proposal ID
          </label>
          <input 
            type="text" 
            placeholder="Paste ID from Etherscan..."
            value={proposalIdInput}
            onChange={(e) => setProposalIdInput(e.target.value)}
            disabled={isOverdue}
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-maroon-600 focus:outline-none mb-4 outline-none"
          />

          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => vote({ address: GOVERNOR_ADDRESS, abi: GOVERNOR_ABI, functionName: 'castVote', args: [BigInt(proposalIdInput), 1] })}
              disabled={isVoting || isOverdue || !proposalIdInput}
              className="bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold disabled:bg-gray-300 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
            >
               {isVoting && <Loader2 size={18} className="animate-spin" />} Approve
            </button>
            <button 
              onClick={() => vote({ address: GOVERNOR_ADDRESS, abi: GOVERNOR_ABI, functionName: 'castVote', args: [BigInt(proposalIdInput), 0] })}
              disabled={isVoting || isOverdue || !proposalIdInput}
              className="bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-bold disabled:bg-gray-300 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
            >
               {isVoting && <Loader2 size={18} className="animate-spin" />} Reject
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}