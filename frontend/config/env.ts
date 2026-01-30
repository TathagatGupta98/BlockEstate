import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { createConfig, http } from "wagmi";
import {
  polygonAmoy,
  arbitrumSepolia,
  baseSepolia
} from "wagmi/chains";

/**
 * Supported chains
 * Pick ONE as primary later if needed
 */
export const config = createConfig(
  getDefaultConfig({
    appName: "Decentralized Housing Governance",
    projectId: "YOUR_WALLETCONNECT_PROJECT_ID", // required
    chains: [
      polygonAmoy,
      arbitrumSepolia,
      baseSepolia
    ],
    transports: {
      [polygonAmoy.id]: http(),
      [arbitrumSepolia.id]: http(),
      [baseSepolia.id]: http()
    }
  })
);
