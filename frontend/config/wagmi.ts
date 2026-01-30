import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { http } from "wagmi";
import { polygonAmoy, arbitrumSepolia, baseSepolia } from "wagmi/chains";

export const config = getDefaultConfig({
    appName: "Decentralized Housing Governance",
    projectId: "khaana-khazana", // ✅ real id
    chains: [polygonAmoy, arbitrumSepolia, baseSepolia],
    transports: {
        [polygonAmoy.id]: http(),
        [arbitrumSepolia.id]: http(),
        [baseSepolia.id]: http(),
    },
    ssr: true,
});

export default config;