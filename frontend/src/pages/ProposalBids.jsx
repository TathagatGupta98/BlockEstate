import { useEffect, useState } from "react";

import API from "../services/auth";

export default function ProposalBids({ proposalId }) {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBids = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/bids/proposal/${proposalId}`);
      setBids(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBids();
  }, [proposalId]);

  if (loading) return <p>Loading bids...</p>;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Bids</h2>

      {bids.length === 0 && (
        <p className="text-gray-500">No bids yet</p>
      )}

      {bids.map((bid) => (
        <div
          key={bid._id}
          className="border rounded-lg p-4 shadow-sm"
        >
          <div className="flex justify-between items-center mb-2">
            <p className="font-medium">
              {bid.companyId?.name}
            </p>

            <span className="text-sm text-gray-500">
              {new Date(bid.createdAt).toLocaleString()}
            </span>
          </div>

          <p className="text-gray-700 mb-2">
            {bid.description}
          </p>

          {bid.estimatedId && (
            <p className="text-sm text-gray-500">
              Estimated ID: {bid.estimatedId}
            </p>
          )}

          <div className="text-sm mt-2">
            <p>Wallet: {bid.companyId?.walletAddress}</p>
            <p>Status: {bid.companyId?.verified}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
