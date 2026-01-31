import { proposalUnderstandingAgent } from "../ProposalAI/agents/proposalUnderstandingAgent.js";

const clamp01 = (n) => Math.max(0, Math.min(1, Number(n)));

function labelFeasibility(f) {
    if (f >= 0.75) return "HIGH";
    if (f >= 0.45) return "MEDIUM";
    return "LOW";
}

export const getProposalFeasibility = async (req, res, next) => {
    try {
        const { description } = req.body;

        if (!description || typeof description !== "string") {
            return res.status(400).json({
                success: false,
                message: "description is required (string)",
            });
        }

        const analysis = await proposalUnderstandingAgent(description);

        const feasibilityScore = clamp01(analysis.feasibility);
        const riskScore = clamp01(analysis.risk);

        return res.status(200).json({
            success: true,
            data: {
                feasibility: labelFeasibility(feasibilityScore),
                feasibilityScore,
                riskScore,
                approxTimeMonths: analysis.approxTimeMonths,
                approxBudgetLevel: analysis.approxBudgetLevel,
                relevanceScore: clamp01(analysis.relevance),
                impactScore: clamp01(analysis.impact),
                clarityScore: clamp01(analysis.clarity),
                keyRisks: analysis.keyRisks || [],
                requirements: analysis.requirements || [],
                suggestedChanges: analysis.suggestedChanges || [],
            },
        });
    } catch (err) {
        next(err);
    }
};
