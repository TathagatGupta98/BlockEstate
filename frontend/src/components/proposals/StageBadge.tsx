import { ProposalStage } from "./ProposalCard";

interface StageBadgeProps {
  stage: ProposalStage;
}

export default function StageBadge({ stage }: StageBadgeProps) {
  const config: Record<
    ProposalStage,
    { label: string; className: string }
  > = {
    stage1: {
      label: "Stage 1 · Community Vote",
      className: "border-taupe text-taupe"
    },
    stage2: {
      label: "Stage 2 · Finalization",
      className: "border-gold text-gold"
    },
    completed: {
      label: "Completed",
      className: "border-gold text-gold"
    }
  };

  const { label, className } = config[stage];

  return (
    <span
      className={`text-xs uppercase tracking-wide border px-2 py-1 ${className}`}
    >
      {label}
    </span>
  );
}
