import { runBidOrchestrator } from "./orchestrator/bidOrchestrator.js";

export async function evaluateBids(bids) {
  return await runBidOrchestrator(bids);
}
