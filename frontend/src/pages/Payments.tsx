import PageShell from "../components/layout/PageShell";
import Card from "../components/ui/Card";

export default function Payments() {
  return (
    <PageShell>
      <h2 className="text-2xl mb-6">Resident Dues</h2>

      <Card title="Current Dues">
        <p>Outstanding: 0.2 ETH</p>
      </Card>

      <Card title="Payment History" className="mt-6">
        <p className="text-taupe">No payments yet.</p>
      </Card>
    </PageShell>
  );
}
