import { useState } from 'react';
import { useWriteContract } from 'wagmi';
import { parseEther, encodeFunctionData } from 'viem';
import { GOVERNOR_ABI, GOVERNOR_ADDRESS, TOKEN_ADDRESS } from '../abis';
import { TOKEN_ABI } from '../abis'; 

export function RaiseProposal() {
  const [formData, setFormData] = useState({ title: '', description: '', amount: '', recipient: '' });
  const { writeContract, isPending, data: hash } = useWriteContract();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // 1. Encode the Transfer Action
    const transferCalldata = encodeFunctionData({
      abi: TOKEN_ABI,
      functionName: 'transfer',
      args: [formData.recipient, parseEther(formData.amount)]
    });

    // 2. Format Description
    const fullDesc = `# ${formData.title}\n\n${formData.description}`;

    // 3. Submit
    writeContract({
      address: GOVERNOR_ADDRESS,
      abi: GOVERNOR_ABI,
      functionName: 'propose',
      args: [
        [USDC_TOKEN_ADDRESS], // Target
        [0],                  // Value
        [transferCalldata],   // Action
        fullDesc
      ]
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <h2 className="text-2xl font-bold text-maroon-900 mb-6">Create New Proposal</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Proposal Title</label>
            <input 
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-900 focus:outline-none"
              placeholder="e.g. Fix Gym Equipment"
              onChange={e => setFormData({...formData, title: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description & Justification</label>
            <textarea 
              required
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-900 focus:outline-none"
              placeholder="Explain why this expense is needed..."
              onChange={e => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount (ETH/Token)</label>
              <input 
                required
                type="number"
                step="0.0001"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-900 focus:outline-none"
                placeholder="0.0"
                onChange={e => setFormData({...formData, amount: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Recipient Address</label>
              <input 
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-900 focus:outline-none"
                placeholder="0x..."
                onChange={e => setFormData({...formData, recipient: e.target.value})}
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={isPending}
            className="w-full bg-maroon-900 text-white font-bold py-4 rounded-xl hover:bg-maroon-800 transition disabled:opacity-50"
          >
            {isPending ? 'Submitting to Blockchain...' : 'Launch Proposal'}
          </button>

          {hash && (
            <div className="p-4 bg-green-50 text-green-800 rounded-lg border border-green-200 break-all text-sm">
              <strong>Success!</strong> Tx: {hash}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}