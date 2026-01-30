import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

/* =========================================================
   TYPES
========================================================= */

export type ProposalStage = "stage1" | "stage2" | "completed";

export interface Proposal {
  id: string;
  title: string;
  description: string;
  stage: ProposalStage;
  yesVotes: number;
  noVotes: number;
  totalVotes: number;
  budget?: string;
  createdAt: string;
}

export interface Payment {
  id: string;
  amount: string;
  date: string;
  txHash?: string;
}

/* =========================================================
   PROPOSALS
========================================================= */

/** Fetch all proposals (all stages) */
export function useProposals() {
  return useQuery<Proposal[]>({
    queryKey: ["proposals"],
    queryFn: async () => {
      const res = await fetch("/api/proposals");
      if (!res.ok) throw new Error("Failed to fetch proposals");
      return res.json();
    }
  });
}

/** Create new proposal (Stage 1, off-chain) */
export function useCreateProposal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      title: string;
      description: string;
      budget: string;
    }) => {
      const res = await fetch("/api/proposals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      if (!res.ok) throw new Error("Failed to create proposal");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proposals"] });
    }
  });
}

/** Stage 1 — soft vote (approve / reject) */
export function useVoteProposal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      proposalId: string;
      vote: "yes" | "no";
    }) => {
      const res = await fetch(
        `/api/proposals/${data.proposalId}/vote`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ vote: data.vote })
        }
      );

      if (!res.ok) throw new Error("Vote failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proposals"] });
    }
  });
}

/** Stage 2 — finalize & execute (on-chain trigger) */
export function useFinalizeProposal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (proposalId: string) => {
      const res = await fetch(
        `/api/proposals/${proposalId}/finalize`,
        { method: "POST" }
      );

      if (!res.ok) throw new Error("Finalization failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proposals"] });
    }
  });
}

/* =========================================================
   TREASURY
========================================================= */

export function useTreasury() {
  return useQuery<{
    balance: string;
    currency: string;
  }>({
    queryKey: ["treasury"],
    queryFn: async () => {
      const res = await fetch("/api/treasury");
      if (!res.ok) throw new Error("Failed to fetch treasury");
      return res.json();
    }
  });
}

/* =========================================================
   PAYMENTS
========================================================= */

export function usePayments() {
  return useQuery<Payment[]>({
    queryKey: ["payments"],
    queryFn: async () => {
      const res = await fetch("/api/payments");
      if (!res.ok) throw new Error("Failed to fetch payments");
      return res.json();
    }
  });
}

/** Optional: record payment after on-chain / gateway confirmation */
export function useRecordPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      amount: string;
      txHash?: string;
    }) => {
      const res = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      if (!res.ok) throw new Error("Failed to record payment");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      queryClient.invalidateQueries({ queryKey: ["treasury"] });
    }
  });
}
