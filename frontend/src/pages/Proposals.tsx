import PageShell from "../components/layout/PageShell";
import Card from "../components/ui/Card";

export default function Proposals() {
  return (
    <PageShell>
      <h2 className="text-2xl mb-8">Governance</h2>

      <Card title="Stage 1 — Community Voting">
        <p className="text-taupe">No proposals yet.</p>
      </Card>

      <Card title="Stage 2 — Finalization" className="mt-6">
        <p className="text-taupe">Awaiting approvals.</p>
      </Card>

      <Card title="Create New Proposal" className="mt-6">
        <button className="text-cream hover:text-gold">
          Submit Proposal
        </button>
      </Card>
    </PageShell>
  );
}
