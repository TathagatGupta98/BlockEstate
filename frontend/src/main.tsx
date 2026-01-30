import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { config } from "./config/wagmi";
import App from "./App";
import "./styles/globals.css";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <RainbowKitProvider>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </RainbowKitProvider>
    </WagmiProvider>
  </React.StrictMode>
);
