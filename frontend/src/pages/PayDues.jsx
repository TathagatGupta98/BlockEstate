import { useState, useEffect } from 'react';
import { useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { TIMELOCK_ADDRESS } from '../abis';
import { Loader2, CheckCircle, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function PayDues() {
  const [hasPaid, setHasPaid] = useState(false);
  const navigate = useNavigate();

  // 1. Transaction Hooks
  const { sendTransaction, data: txHash, isPending: isSending } = useSendTransaction();
  
  const { 
    isLoading: isConfirming, 
    isSuccess: isConfirmed 
  } = useWaitForTransactionReceipt({ hash: txHash });

  // 2. Effect: On Success, update "Database" (LocalStorage for now)
  useEffect(() => {
    if (isConfirmed) {
      localStorage.setItem('lastMaintenancePayment', Date.now().toString());
      setHasPaid(true);
    }
  }, [isConfirmed]);

  const handlePay = () => {
    sendTransaction({
      to: TIMELOCK_ADDRESS,
      value: parseEther("0.004"), // Fixed 10,000 INR approx
    });
  };

  return (
    <div className="max-w-xl mx-auto py-10 animate-in fade-in duration-500">
      <div className="bg-white rounded-3xl shadow-lg border border-maroon-100 overflow-hidden">
        
        {/* Header */}
        <div className="bg-maroon-900 p-8 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent"></div>
          <h2 className="text-2xl font-bold relative z-10">Society Maintenance</h2>
          <p className="text-maroon-200 text-sm mt-1 relative z-10">Monthly Dues Portal</p>
        </div>

        <div className="p-8">
          {hasPaid ? (
            /* Success View */
            <div className="text-center py-6">
              <div className="bg-emerald-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShieldCheck size={40} className="text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Payment Successful!</h3>
              <p className="text-gray-500 mb-6">Your voting rights have been restored for 30 days.</p>
              <button 
                onClick={() => navigate('/dashboard')}
                className="bg-maroon-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-maroon-800 transition"
              >
                Return to Dashboard
              </button>
            </div>
          ) : (
            /* Payment View */
            <div className="space-y-6">
              <div className="bg-maroon-50 border border-maroon-100 rounded-2xl p-6 flex flex-col items-center">
                <span className="text-sm font-bold text-maroon-800 uppercase tracking-widest mb-1">Total Due</span>
                <span className="text-5xl font-black text-maroon-900 my-2">0.04</span>
                <span className="text-lg font-medium text-maroon-600">ETH</span>
                <p className="text-xs text-gray-400 mt-4 text-center max-w-xs">
                  (approx. ₹10,000) • Funds are transferred securely to the Society Timelock Vault.
                </p>
              </div>

              <div className="flex items-start gap-3 p-4 bg-yellow-50 text-yellow-800 rounded-xl border border-yellow-200 text-sm">
                <AlertTriangle className="shrink-0 mt-0.5" size={18} />
                <p><strong>Warning:</strong> Failure to pay dues results in immediate suspension of voting privileges on all active proposals.</p>
              </div>

              <button 
                onClick={handlePay}
                disabled={isSending || isConfirming}
                className="w-full bg-maroon-900 text-white font-bold py-4 rounded-xl hover:bg-maroon-800 transition shadow-lg shadow-maroon-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg"
              >
                {isSending ? (
                  <><Loader2 className="animate-spin" /> Check Wallet...</>
                ) : isConfirming ? (
                  <><Loader2 className="animate-spin" /> Verifying Payment...</>
                ) : (
                  'Pay 0.04 ETH Now'
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}