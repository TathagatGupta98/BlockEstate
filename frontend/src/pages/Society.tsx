import PageShell from "../components/layout/PageShell";
import Card from "../components/ui/Card";

export default function Society() {
  return (
    <PageShell>
      <h2 className="text-2xl mb-6">Society Overview</h2>

      <Card title="Treasury">
        <p>Balance: 120.5 ETH</p>
      </Card>

      <Card title="Completed Proposals" className="mt-6">
        <p className="text-taupe">No completed proposals yet.</p>
      </Card>
    </PageShell>
  );
}
