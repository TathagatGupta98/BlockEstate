import { proposalUnderstandingAgent } from "../agents/proposalUnderstandingAgent.js";
import { proposalEvaluationAgent } from "../agents/proposalEvaluationAgent.js";
import { proposalDecisionAgent } from "../agents/proposalDecisionAgent.js";

export async function runProposalOrchestrator(proposals) {
  const evaluated = [];

  for (const proposal of proposals) {
    const analysis = await proposalUnderstandingAgent(proposal.description);
    const score = proposalEvaluationAgent(analysis, proposal);

    evaluated.push({
      id: proposal.id,
      title: proposal.title,
      score,
      analysis,
    });
  }

  evaluated.sort((a, b) => b.score - a.score);

  const explanation = await proposalDecisionAgent(evaluated);

  return {
    winnerId: evaluated[0].id,
    winnerTitle: evaluated[0].title,
    ranking: evaluated,
    explanation,
  };
}
