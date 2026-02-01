import { normalizeTime, normalizeBudget } from "../../utils/normalizers.js";

export function proposalEvaluationAgent(analysis, proposal) {
  const timeScore =
      proposal.estimatedTimeMonths !== undefined
          ? normalizeTime(proposal.estimatedTimeMonths)
          : normalizeTime(analysis.approxTimeMonths);

  const budgetScore =
      proposal.estimatedBudget !== undefined
          ? normalizeBudget(proposal.estimatedBudget)
          : normalizeBudget(analysis.approxBudgetLevel);

  return (
      analysis.relevance * 0.25 +
      analysis.feasibility * 0.25 +
      analysis.impact * 0.25 +
      analysis.clarity * 0.1 +
      timeScore * 0.1 +
      budgetScore * 0.1 -
      analysis.risk * 0.15
  );
}
