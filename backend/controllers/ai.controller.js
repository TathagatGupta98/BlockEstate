import { proposalUnderstandingAgent } from "../ai/agents/proposalUnderstandingAgent.js";
import { Bid } from "../models/bid.model.js";
import { evaluateBids } from "../ai/index.js";


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

const parseAmount = (estimatedId) => {
    // handles "5000", "₹5000", "5,000", "5000 INR"
    const cleaned = String(estimatedId || "")
        .replace(/,/g, "")
        .replace(/[^\d.]/g, "");

    const n = Number(cleaned);
    return Number.isFinite(n) ? n : null;
};

export const getBidConsensus = async (req, res, next) => {
    try {
        const { proposalId } = req.body;

        if (!proposalId) {
            return res.status(400).json({
                success: false,
                message: "proposalId is required",
            });
        }

        const bids = await Bid.find({ proposalId })
            .populate("companyId", "name verified")
            .lean();

        if (!bids.length) {
            return res.status(200).json({
                success: true,
                data: { bidsCount: 0, result: null },
            });
        }

        // Map DB bids -> agent bids format
        const agentBids = bids
            .map((b) => {
                const amount = parseAmount(b.estimatedId);

                return {
                    bidId: b._id?.toString(),
                    contractor: b.companyId?.name || "Unknown Company",
                    amount, // must be number
                    description: b.description || "",
                    meta: {
                        companyId: b.companyId?._id?.toString(),
                        verified: !!b.companyId?.verified,
                    },
                };
            })
            .filter((b) => b.amount !== null && b.description.trim().length > 0);

        if (!agentBids.length) {
            return res.status(400).json({
                success: false,
                message:
                    "Bids exist but agent could not parse amount from estimatedId. Make sure estimatedId is numeric (example: '5000').",
            });
        }

        const result = await evaluateBids(agentBids);

        return res.status(200).json({
            success: true,
            data: {
                bidsCount: bids.length,
                analyzedCount: agentBids.length,
                result,
            },
        });
    } catch (err) {
        next(err);
    }
};

