import { useState, useEffect } from 'react';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther, encodeFunctionData, parseEventLogs } from 'viem';
import { GOVERNOR_ABI, GOVERNOR_ADDRESS, TOKEN_ADDRESS } from '../abis';
import { CheckCircle, Loader2, AlertCircle, FileText, ArrowLeft } from 'lucide-react';

const ERC20_TRANSFER_ABI = [{
  type: 'function',
  name: 'transfer',
  inputs: [{ name: 'to', type: 'address' }, { name: 'amount', type: 'uint256' }],
  outputs: [{ name: '', type: 'bool' }],
  stateMutability: 'nonpayable' 
}];

const API = import.meta.env.VITE_BACKEND_URL?.trim() || "http://localhost:8000"; // change if needed
const API_BASE = `${API}/api/v1/`;


export function RaiseProposal() {
  const [formData, setFormData] = useState({ title: '', description: '', amount: '', recipient: '' });
  const [createdProposalId, setCreatedProposalId] = useState(null);

  const { writeContract, data: txHash, isPending: isSubmitting, error: writeError } = useWriteContract();

  const { 
    data: receipt, 
    isLoading: isConfirming, 
    isSuccess: isConfirmed 
  } = useWaitForTransactionReceipt({ 
    hash: txHash,
  });

  useEffect(() => {
    const saveToBackend = async (proposalId) => {
      console.log(proposalId, "this");
      const res = await fetch(`${API_BASE}/proposals/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          status: true,
          onChainProposalId: proposalId,
          txHash: String(txHash),
          status_stage: "stage-1",
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        console.log("Backend rejected:", data);
      } else {
        console.log("Saved in Mongo:", data);
      }
    };
    if (isConfirmed && receipt) {
      try {
        const logs = parseEventLogs({
          abi: GOVERNOR_ABI,
          eventName: "ProposalCreated",
          logs: receipt.logs,
        });

        if (logs.length > 0) {
          console.log(logs, logs[0], logs[0].args.proposalId.toString())
          const newId = logs[0].args.proposalId.toString();

          setCreatedProposalId(newId);
          saveToBackend(newId);
        }
      } catch (err) {
        console.error("Log parsing error:", err);
      }
    }
  }, [isConfirmed, receipt, formData, txHash]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const fullDesc = `# ${formData.title}\n\n${formData.description}`;

    writeContract({
      address: GOVERNOR_ADDRESS,
      abi: GOVERNOR_ABI,
      functionName: "propose",
      args: [[GOVERNOR_ADDRESS], [0], ["0x"], fullDesc],
    });
  };


  return (
    <div className="max-w-2xl mx-auto py-8 animate-in fade-in duration-500">
      <div className="bg-white rounded-3xl shadow-sm border border-maroon-100 overflow-hidden">
        
        {/* Maroon Header Section */}
        <div className="bg-maroon-900 p-8 text-white">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <FileText size={28} className="text-maroon-100" /> Raise Society Proposal
          </h2>
          <p className="text-maroon-100 text-sm mt-1 opacity-90">
            Submit your request to the community for on-chain voting.
          </p>
        </div>

        <div className="p-8">
          {createdProposalId ? (
            /* SUCCESS STATE */
            <div className="text-center py-10 animate-in zoom-in-95 duration-300">
              {/* Keeping Success Green (Emerald) because Maroon implies Error in UX */}
              <div className="bg-emerald-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={40} className="text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Proposal Submitted!</h3>
              <p className="text-gray-500 mb-8 px-10">Your proposal is now live for voting. Share the ID with residents.</p>
              
              <div className="bg-maroon-50 p-6 rounded-2xl border border-maroon-100 text-left mb-8">
                <label className="text-xs font-black text-maroon-800 uppercase tracking-widest block mb-2">Proposal ID</label>
                <code className="text-sm break-all font-mono text-maroon-900 font-bold">{createdProposalId}</code>
              </div>
              
              <button 
                onClick={() => setCreatedProposalId(null)}
                className="flex items-center gap-2 mx-auto text-maroon-600 font-bold hover:text-maroon-800 transition"
              >
                <ArrowLeft size={18} /> Raise another proposal
              </button>
            </div>
          ) : (
            /* FORM STATE */
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Proposal Title</label>
                  <input 
                    required
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-maroon-600 focus:bg-white outline-none transition-all"
                    placeholder="e.g. Repair Gym Equipment"
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Detailed Description</label>
                  <textarea 
                    required
                    rows={4}
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-maroon-600 focus:bg-white outline-none transition-all"
                    placeholder="Provide details on why this is needed and who will perform the work..."
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                </div>
              </div>

              <button 
                type="submit"
                disabled={isSubmitting || isConfirming}
                className="w-full bg-maroon-900 text-white font-bold py-4 rounded-2xl hover:bg-maroon-800 transition-all shadow-lg shadow-maroon-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg"
              >
                {isSubmitting ? (
                  <><Loader2 className="animate-spin" /> Check Wallet...</>
                ) : isConfirming ? (
                  <><Loader2 className="animate-spin" /> Indexing on Sepolia...</>
                ) : (
                  'Submit to Community'
                )}
              </button>

              {writeError && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-700 animate-in slide-in-from-bottom-2">
                  <AlertCircle size={20} />
                  <p className="text-sm font-medium">{writeError.shortMessage || "Transaction failed"}</p>
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}