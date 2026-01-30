import { useSendTransaction } from 'wagmi';
import { parseEther } from 'viem';
import { TIMELOCK_ADDRESS } from '../abis';
import { useState } from 'react';

export function PayDues() {
  const [amount, setAmount] = useState('0.001');
  const { sendTransaction, isPending, data: hash } = useSendTransaction();

  const handlePay = () => {
    sendTransaction({
      to: TIMELOCK_ADDRESS,
      value: parseEther(amount)
    });
  };

  return (
    <div className="max-w-xl mx-auto text-center">
      <div className="bg-white rounded-2xl shadow-lg border border-maroon-100 overflow-hidden">
        <div className="bg-maroon-900 p-6 text-white">
          <h2 className="text-2xl font-bold">Maintenance Portal</h2>
          <p className="text-maroon-200">Submit your monthly dues securely</p>
        </div>
        
        <div className="p-8">
          <div className="mb-8">
            <span className="text-5xl font-bold text-gray-900">
              Ξ {amount}
            </span>
            <span className="text-gray-400 ml-2 text-xl">ETH</span>
          </div>

          <div className="space-y-4">
            <div className="flex justify-center gap-3 mb-6">
              {['0.001', '0.01', '0.05'].map((val) => (
                <button 
                  key={val}
                  onClick={() => setAmount(val)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                    amount === val 
                    ? 'bg-maroon-100 text-maroon-900 border border-maroon-200' 
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {val} ETH
                </button>
              ))}
            </div>

            <button 
              onClick={handlePay}
              disabled={isPending}
              className="w-full bg-maroon-900 text-white font-bold py-4 rounded-xl hover:bg-maroon-800 transition shadow-md hover:shadow-lg disabled:opacity-50"
            >
              {isPending ? 'Processing Payment...' : 'Pay Maintenance Now'}
            </button>
          </div>

          {hash && (
            <p className="mt-6 text-sm text-gray-500 break-all">
              Receipt: <a href={`https://sepolia.etherscan.io/tx/${hash}`} className="text-maroon-900 underline" target="_blank">View on Etherscan</a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}