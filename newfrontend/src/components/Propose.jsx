import { useWriteContract, useAccount } from 'wagmi'
import { parseEther } from 'viem'
import { GOVERNOR_ABI, GOVERNOR_ADDRESS } from '../abis'

export function Propose() {
  const { writeContract, data: hash, isPending } = useWriteContract()

  const VENDOR_ADDRESS = "0xa0Ee7A142d267C1f36714E4a8F75612F20a79720" 

  const createProposal = () => {
    // We propose that the Timelock sends 0.5 ETH to the Vendor
    writeContract({
      address: GOVERNOR_ADDRESS,
      abi: GOVERNOR_ABI,
      functionName: 'propose',
      args: [
        [VENDOR_ADDRESS],    
        [parseEther('0.5')], 
        ["0x"],             
        "Pay Gardener 0.5 ETH for January"
      ],
    })
  }

  return (
    <div style={{ border: '1px solid #ccc', padding: '10px', margin: '10px' }}>
      <h3>2. Raise Proposal (Spend Money)</h3>
      <p>Propose paying 0.5 ETH from Treasury to Vendor.</p>
      <button disabled={isPending} onClick={createProposal}>
        {isPending ? 'Proposing...' : 'Submit Proposal'}
      </button>
      {hash && <div style={{fontSize: '0.8em', background: '#eee', padding: '5px'}}>
        <strong>Tx Hash:</strong> {hash} <br/>
        <small>Check Anvil terminal for Proposal ID!</small>
      </div>}
    </div>
  )
}