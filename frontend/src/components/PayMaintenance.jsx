import { useSendTransaction, useBalance } from 'wagmi'
import { parseEther } from 'viem'
import { TIMELOCK_ADDRESS } from '../abis'

export function PayMaintenance() {
  const { sendTransaction, isPending, data: hash } = useSendTransaction()
  
  const { data: balance, refetch } = useBalance({
    address: TIMELOCK_ADDRESS,
  })

  const payFee = () => {
    sendTransaction({
      to: TIMELOCK_ADDRESS,
      value: parseEther('0.001'),
    }, {
      onSuccess: () => {
        setTimeout(refetch, 5000) 
      }
    })
  }

  return (
    <div style={{ border: '1px solid #ccc', padding: '10px', margin: '10px', background: '#e6f7ff' }}>
      <h3>0. Pay Maintenance (Fund Treasury)</h3>
      <p><strong>Treasury Balance:</strong> {balance ? `${balance.formatted} ${balance.symbol}` : 'Loading...'}</p>
      
      <button disabled={isPending} onClick={payFee}>
        {isPending ? 'Sending...' : 'Pay 0.001 ETH Fee'}
      </button>
      
      {hash && <p style={{fontSize: '0.8em', wordBreak: 'break-all'}}>Tx: {hash}</p>}
    </div>
  )
}