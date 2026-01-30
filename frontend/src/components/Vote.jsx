import { useState } from 'react'
import { useWriteContract } from 'wagmi'
import { GOVERNOR_ABI, GOVERNOR_ADDRESS } from '../abis'

export function Vote() {
  const [proposalId, setProposalId] = useState('')
  const { writeContract, isPending, data: hash } = useWriteContract()

  const castVote = (supportType) => {
    if (!proposalId) return alert("Enter a Proposal ID")

    writeContract({
      address: GOVERNOR_ADDRESS,
      abi: GOVERNOR_ABI,
      functionName: 'castVote',
      args: [BigInt(proposalId), supportType],
    })
  }

  return (
    <div style={{ border: '1px solid #ccc', padding: '10px', margin: '10px' }}>
      <h3>3. Cast Vote</h3>
      <input 
        placeholder="Paste Proposal ID here..." 
        value={proposalId}
        onChange={(e) => setProposalId(e.target.value)}
        style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
      />
      
      <div style={{ display: 'flex', gap: '10px' }}>
        <button onClick={() => castVote(1)} disabled={isPending} style={{backgroundColor: '#90EE90'}}>
          Vote For
        </button>
        <button onClick={() => castVote(0)} disabled={isPending} style={{backgroundColor: '#FFB6C1'}}>
          Vote Against
        </button>
        <button onClick={() => castVote(2)} disabled={isPending}>
          Abstain
        </button>
      </div>

      {hash && <p>Vote Submitted! Hash: {hash}</p>}
    </div>
  )
}