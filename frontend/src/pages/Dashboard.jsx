import { useBalance, useReadContract, useWriteContract, useAccount } from "wagmi";
import {
  TIMELOCK_ADDRESS,
  GOVERNOR_ADDRESS,
  GOVERNOR_ABI,
  TOKEN_ADDRESS,
  TOKEN_ABI,
} from "../abis";
import { useEffect, useState } from "react";

const API_BASE = "http://localhost:8000";

export function Dashboard() {
  const { address } = useAccount();

  // On-chain proposal ID input (uint256-like string)
  const [proposalIdInput, setProposalIdInput] = useState("");

  // Selected Mongo proposal _id (ObjectId string) - used for DB vote endpoint
  const [selectedMongoProposalId, setSelectedMongoProposalId] = useState("");

  // Proposals list from MongoDB
  const [proposals, setProposals] = useState([]);
  const [loadingProposals, setLoadingProposals] = useState(false);
  const [proposalError, setProposalError] = useState(null);

  const [isSavingVote, setIsSavingVote] = useState(false);

  // 1) Treasury
  const { data: treasuryBal } = useBalance({ address: TIMELOCK_ADDRESS });

  // 2) Voting power
  const { data: votes } = useReadContract({
    address: TOKEN_ADDRESS,
    abi: TOKEN_ABI,
    functionName: "getVotes",
    args: address ? [address] : undefined,
  });

  // 3) Delegate to self
  const { writeContract: delegate, isPending: isDelegating } = useWriteContract();

  // 4) Vote on-chain
  const { writeContractAsync: voteAsync, isPending: isVoting } = useWriteContract();

  // Fetch proposals from MongoDB
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
  }, []);

  // Save vote to DB (Vote collection)
  const saveVoteToDb = async (valueBool) => {
    if (!selectedMongoProposalId) {
      throw new Error("Select a proposal first (MongoDB _id missing).");
    }

    setIsSavingVote(true);

    const res = await fetch(`${API_BASE}/api/v1/votes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // IMPORTANT: because verifyJWT uses cookies
      body: JSON.stringify({
        proposalId: selectedMongoProposalId, // MUST be ObjectId (mongo)
        value: valueBool,
      }),
    });

    const json = await res.json();

    if (!res.ok || json?.success === false) {
      throw new Error(json?.message || "Failed to save vote in DB");
    }

    setIsSavingVote(false);
    return json;
  };

  // Full vote handler (on-chain + DB)
  const handleVote = async (support) => {
    try {
      if (!proposalIdInput) throw new Error("Enter/select an on-chain proposal ID.");
      if (!selectedMongoProposalId) throw new Error("Select proposal from list (MongoDB id missing).");
      if (!address) throw new Error("Connect wallet first.");

      // 1) On-chain vote (support: 1 = For, 0 = Against)
      await voteAsync({
        address: GOVERNOR_ADDRESS,
        abi: GOVERNOR_ABI,
        functionName: "castVote",
        args: [BigInt(proposalIdInput), support],
      });

      // 2) Store in MongoDB
      await saveVoteToDb(support === 1);

      alert("✅ Vote cast on-chain + stored in DB");
    } catch (e) {
      console.error(e);
      alert(e?.message || "Vote failed");
    } finally {
      setIsSavingVote(false);
    }
  };

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
              {treasuryBal
                  ? `${Number(treasuryBal.formatted).toFixed(4)} ${treasuryBal.symbol}`
                  : "..."}
            </div>
            <p className="text-maroon-300 text-sm mt-4">
              Safe Address: {TIMELOCK_ADDRESS.slice(0, 6)}...{TIMELOCK_ADDRESS.slice(-4)}
            </p>
          </div>

          {/* User Stats Card */}
          <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
            <h2 className="text-gray-500 font-medium mb-1">Your Voting Power</h2>
            <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-gray-900">
              {votes ? Number(votes) / 1e18 : "0"}
            </span>
              <span className="text-gray-400">Votes</span>
            </div>

            <button
                onClick={() =>
                    delegate({
                      address: TOKEN_ADDRESS,
                      abi: TOKEN_ABI,
                      functionName: "delegate",
                      args: address ? [address] : [],
                    })
                }
                disabled={isDelegating || !address}
                className="mt-6 w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition disabled:opacity-50"
            >
              {isDelegating ? "Activating..." : "Activate Voting Power (Delegate)"}
            </button>
          </div>
        </div>

        {/* Governance Section */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h3 className="text-xl font-bold text-maroon-900 mb-6">Governance Actions</h3>

          {/* Search Proposal to Vote */}
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Find Proposal by On-chain ID
            </label>

            <div className="flex gap-4">
              <input
                  type="text"
                  placeholder="Paste on-chain proposal ID (uint256)"
                  value={proposalIdInput}
                  onChange={(e) => setProposalIdInput(e.target.value)}
                  className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-900 focus:outline-none"
              />
            </div>

            {/* Show selected mongo info */}
            {selectedMongoProposalId && (
                <p className="text-xs text-gray-500 mt-2">
                  Selected Mongo Proposal ID:{" "}
                  <span className="font-mono">{selectedMongoProposalId}</span>
                </p>
            )}

            {proposalIdInput && (
                <div className="mt-4 flex gap-3">
                  <button
                      onClick={() => handleVote(1)}
                      disabled={isVoting || isSavingVote || !selectedMongoProposalId}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium disabled:opacity-50"
                  >
                    {isVoting || isSavingVote ? "Voting..." : "Vote For"}
                  </button>

                  <button
                      onClick={() => handleVote(0)}
                      disabled={isVoting || isSavingVote || !selectedMongoProposalId}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-medium disabled:opacity-50"
                  >
                    {isVoting || isSavingVote ? "Voting..." : "Vote Against"}
                  </button>
                </div>
            )}

            {!selectedMongoProposalId && (
                <p className="text-xs text-orange-600 mt-3">
                  ⚠️ Select a proposal from the list below first (so vote can be stored in DB).
                </p>
            )}
          </div>

          {/* Proposals from MongoDB */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider">
                Recent Activity
              </h4>

              <button
                  onClick={fetchProposals}
                  className="text-sm font-bold text-maroon-900 hover:underline"
              >
                Refresh
              </button>
            </div>

            {loadingProposals && <p className="text-gray-500 text-sm">Loading proposals...</p>}
            {proposalError && <p className="text-red-600 text-sm">{proposalError}</p>}

            {!loadingProposals && !proposalError && proposals.length === 0 && (
                <p className="text-gray-500 text-sm">No proposals found.</p>
            )}

            <div className="space-y-3">
              {proposals.map((p) => (
                  <div
                      key={p._id}
                      className={`flex items-center justify-between p-4 border rounded-xl ${
                          selectedMongoProposalId === p._id
                              ? "border-maroon-900 bg-gray-50"
                              : "border-gray-100"
                      }`}
                  >
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 truncate">{p.title}</p>
                      <p className="text-sm text-gray-500 truncate">{p.description}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        Accept: {p.acceptCount ?? 0} | Reject: {p.rejectCount ?? 0}
                      </p>
                      {p.onChainProposalId ? (
                          <p className="text-xs text-gray-400 mt-1">
                            On-chain ID:{" "}
                            <span className="font-mono">{p.onChainProposalId}</span>
                          </p>
                      ) : (
                          <p className="text-xs text-red-500 mt-1">
                            Missing onChainProposalId (cannot vote on-chain)
                          </p>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button
                          onClick={() => {
                            setSelectedMongoProposalId(p._id);
                            setProposalIdInput(p.onChainProposalId || "");
                          }}
                          className="text-maroon-900 text-sm font-bold hover:underline whitespace-nowrap"
                      >
                        Select
                      </button>
                    </div>
                  </div>
              ))}
            </div>
          </div>
        </div>
      </div>
  );
}
