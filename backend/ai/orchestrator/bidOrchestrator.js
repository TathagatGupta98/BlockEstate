import { understandingAgent } from "../agents/understandingAgent.js";
import { evaluationAgent } from "../agents/evaluationAgent.js";
import { decisionAgent } from "../agents/decisionAgent.js";

export async function runBidOrchestrator(bids) {
  const lowestAmount = Math.min(...bids.map(b => b.amount));
  const evaluated = [];

  for (const bid of bids) {
    const analysis = await understandingAgent(bid.description);
    const score = evaluationAgent(bid.amount, analysis, lowestAmount);

    evaluated.push({
      contractor: bid.contractor,
      amount: bid.amount,
      score,
      analysis
    });
  }

  evaluated.sort((a, b) => b.score - a.score);

  const explanation = await decisionAgent(evaluated);

  return {
    winner: evaluated[0].contractor,
    ranking: evaluated,
    explanation
  };
}
