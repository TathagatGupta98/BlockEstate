// src/config.js
import { http, createConfig } from 'wagmi'
import { sepolia } from 'wagmi/chains' 

export const config = createConfig({
  chains: [sepolia],
  transports: {
    [sepolia.id]: http('https://eth-sepolia.g.alchemy.com/v2/zmVMGA4CIv6YcpUIDSJWz'), 
  },
})  