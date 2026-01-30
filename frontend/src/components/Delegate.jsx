import { useWriteContract, useAccount } from 'wagmi'
import { TOKEN_ABI, TOKEN_ADDRESS } from '../abis'

export function Delegate() {
  const { address } = useAccount()
  const { writeContract, isPending, error } = useWriteContract()

  const handleDelegate = () => {
    writeContract({
      address: TOKEN_ADDRESS,
      abi: TOKEN_ABI,
      functionName: 'delegate',
      args: [address], // Delegate to self
    })
  }

  return (
    <div style={{ border: '1px solid #ccc', padding: '10px', margin: '10px' }}>
      <h3>1. Setup: Delegate Votes</h3>
      <p>You must delegate to yourself before voting.</p>
      <button disabled={isPending} onClick={handleDelegate}>
        {isPending ? 'Delegating...' : 'Delegate to Myself'}
      </button>
      {error && <p style={{color: 'red'}}>Error: {error.shortMessage}</p>}
    </div>
  )
}