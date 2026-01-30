import Button from "../ui/Button";
import Divider from "../ui/Divider";
import StageBadge from "./StageBadge";

export type ProposalStage = "stage1" | "stage2" | "completed";

export interface ProposalCardProps {
  title: string;
  description: string;
  stage: ProposalStage;
  yesVotes?: number;
  noVotes?: number;
  totalVotes?: number;
  budget?: string;
  onApprove?: () => void;
  onReject?: () => void;
  onFinalize?: () => void;
}

export default function ProposalCard({
  title,
  description,
  stage,
  yesVotes = 0,
  noVotes = 0,
  totalVotes = 0,
  budget,
  onApprove,
  onReject,
  onFinalize
}: ProposalCardProps) {
  const approvalPct =
    totalVotes > 0 ? Math.round((yesVotes / totalVotes) * 100) : 0;

  return (
    <div className="bg-merlot border border-taupe p-6 mb-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg">{title}</h3>
        <StageBadge stage={stage} />
      </div>

      {/* Description */}
      <p className="text-cream/90 text-sm leading-relaxed">
        {description}
      </p>

      <Divider />

      {/* Stage 1 — Community Voting */}
      {stage === "stage1" && (
        <>
          <div className="mb-4">
            <div className="flex justify-between text-xs text-taupe mb-1">
              <span>Approval</span>
              <span>{approvalPct}%</span>
            </div>

            <div className="w-full h-2 bg-blood border border-taupe">
              <div
                className="h-full bg-gold transition-all duration-200"
                style={{ width: `${approvalPct}%` }}
              />
            </div>
          </div>

          <div className="flex gap-4">
            <Button onClick={onApprove}>Approve</Button>
            <Button variant="secondary" onClick={onReject}>
              Reject
            </Button>
          </div>
        </>
      )}

      {/* Stage 2 — Finalization */}
      {stage === "stage2" && (
        <>
          <div className="text-sm text-taupe mb-4">
            Budget Range: <span className="text-cream">{budget}</span>
          </div>

          <Button onClick={onFinalize}>
            Finalize & Execute
          </Button>
        </>
      )}

      {/* Completed */}
      {stage === "completed" && (
        <p className="text-sm text-gold">
          Proposal executed successfully.
        </p>
      )}
    </div>
  );
}
