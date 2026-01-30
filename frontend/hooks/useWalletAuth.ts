import { useCallback, useState } from "react";
import { useAccount, useSignMessage } from "wagmi";

/**
 * Wallet-based authentication hook
 *
 * Flow:
 * 1. Wallet connects
 * 2. Backend returns nonce
 * 3. User signs nonce
 * 4. Backend verifies signature + membership
 * 5. Session token issued (httpOnly cookie)
 */

export function useWalletAuth() {
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();

  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const authenticate = useCallback(async () => {
    if (!isConnected || !address) {
      setError("Wallet not connected");
      return;
    }

    try {
      setIsAuthenticating(true);
      setError(null);

      // 1️⃣ Request nonce
      const nonceRes = await fetch(
        `/api/auth/nonce?address=${address}`
      );

      if (!nonceRes.ok) {
        throw new Error("Failed to get nonce");
      }

      const { nonce } = await nonceRes.json();

      // 2️⃣ Sign message
      const message = `Sign to verify membership:\n\nNonce: ${nonce}`;
      const signature = await signMessageAsync({ message });

      // 3️⃣ Verify signature + membership
      const verifyRes = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address,
          signature,
          nonce
        })
      });

      if (!verifyRes.ok) {
        throw new Error("Authentication failed");
      }

      // Backend should set httpOnly session cookie
      setIsAuthenticated(true);
    } catch (err: any) {
      console.error(err);
      setError(err.message ?? "Authentication error");
      setIsAuthenticated(false);
    } finally {
      setIsAuthenticating(false);
    }
  }, [address, isConnected, signMessageAsync]);

  return {
    address,
    isConnected,
    isAuthenticated,
    isAuthenticating,
    error,
    authenticate
  };
}
