import { useBalance, useReadContract, useWriteContract, useAccount } from 'wagmi';
import { TIMELOCK_ADDRESS, GOVERNOR_ADDRESS, GOVERNOR_ABI, TOKEN_ADDRESS, TOKEN_ABI } from '../abis';
import { useState } from 'react';

export function Dashboard() {
  const { address } = useAccount();
  const [proposalIdInput, setProposalIdInput] = useState('');
  
  // 1. Fetch Treasury Balance
  const { data: treasuryBal } = useBalance({ address: TIMELOCK_ADDRESS });

  // 2. Fetch Voting Power
  const { data: votes } = useReadContract({
    address: TOKEN_ADDRESS,
    abi: TOKEN_ABI,
    functionName: 'getVotes',
    args: [address],
  });

  // 3. Delegate to Self Logic
  const { writeContract: delegate, isPending: isDelegating } = useWriteContract();

  // 4. Vote Logic
  const { writeContract: vote, isPending: isVoting } = useWriteContract();

  return (
    <div className="space-y-8">
      {/* Stats Row */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Treasury Card */}
        <div className="bg-maroon-900 text-white rounded-2xl p-8 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 opacity-10 transform translate-x-10 -translate-y-10">
            <div className="w-40 h-40 bg-white rounded-full"></div>
          </div>
          <h2 className="text-maroon-200 font-medium mb-1">Treasury Balance</h2>
          <div className="text-4xl font-bold">
            {treasuryBal ? `${Number(treasuryBal.formatted).toFixed(4)} ${treasuryBal.symbol}` : '...'}
          </div>
          <p className="text-maroon-300 text-sm mt-4">Safe Address: {TIMELOCK_ADDRESS.slice(0,6)}...{TIMELOCK_ADDRESS.slice(-4)}</p>
        </div>

        {/* User Stats Card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
          <h2 className="text-gray-500 font-medium mb-1">Your Voting Power</h2>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-gray-900">
              {votes ? Number(votes) / 1e18 : '0'}
            </span>
            <span className="text-gray-400">Votes</span>
          </div>
          
          <button 
            onClick={() => delegate({ 
              address: TOKEN_ADDRESS, abi: TOKEN_ABI, functionName: 'delegate', args: [address] 
            })}
            disabled={isDelegating}
            className="mt-6 w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition"
          >
            {isDelegating ? 'Activating...' : 'Activate Voting Power (Delegate)'}
          </button>
        </div>
      </div>

      {/* Ongoing Proposals Section */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <h3 className="text-xl font-bold text-maroon-900 mb-6">Governance Actions</h3>
        
        {/* Search Proposal to Vote */}
        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
          <label className="block text-sm font-medium text-gray-700 mb-2">Find Proposal by ID</label>
          <div className="flex gap-4">
            <input 
              type="text" 
              placeholder="Paste long ID here (e.g. 4829...)"
              value={proposalIdInput}
              onChange={(e) => setProposalIdInput(e.target.value)}
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-900 focus:outline-none"
            />
          </div>

          {proposalIdInput && (
            <div className="mt-4 flex gap-3">
              <button 
                onClick={() => vote({ address: GOVERNOR_ADDRESS, abi: GOVERNOR_ABI, functionName: 'castVote', args: [BigInt(proposalIdInput), 1] })}
                disabled={isVoting}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium"
              >
                Vote For
              </button>
              <button 
                onClick={() => vote({ address: GOVERNOR_ADDRESS, abi: GOVERNOR_ABI, functionName: 'castVote', args: [BigInt(proposalIdInput), 0] })}
                disabled={isVoting}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-medium"
              >
                Vote Against
              </button>
            </div>
          )}
        </div>
        
        {/* Mock list for UI demo */}
        <div className="mt-6">
          <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Recent Activity</h4>
          <div className="space-y-3">
            {[1,2].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 border-b border-gray-100 last:border-0">
                <div>
                  <p className="font-medium text-gray-900">Proposal #{4020 + i}: Repair Gate Lights</p>
                  <p className="text-sm text-gray-500">Status: <span className="text-green-600 font-medium">Active</span></p>
                </div>
                <button className="text-maroon-900 text-sm font-bold hover:underline">View Details</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}