import { runProposalOrchestrator } from "./orchestrator/proposalOrchestrator.js";

export async function evaluateProposals(proposals) {
  return runProposalOrchestrator(proposals);
}
