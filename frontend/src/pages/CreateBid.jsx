import { useState } from "react";

import API from "../services/auth";

export default function CreateBid({ proposalId, companyId, onSuccess }) {
  const [estimatedId, setEstimatedId] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await API.post("/bids/create", {
        proposalId,
        companyId,
        estimatedId,
        description
      });

      setEstimatedId("");
      setDescription("");

      onSuccess && onSuccess();

      alert("Bid created successfully");

    } catch (err) {
      alert(err.response?.data?.message || "Error creating bid");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl shadow space-y-4"
    >
      <h2 className="text-xl font-semibold">Create Bid</h2>

      <input
        type="text"
        placeholder="Estimated ID (optional)"
        className="w-full border p-2 rounded"
        value={estimatedId}
        onChange={(e) => setEstimatedId(e.target.value)}
      />

      <textarea
        required
        placeholder="Bid description"
        className="w-full border p-2 rounded h-28"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <button
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {loading ? "Submitting..." : "Submit Bid"}
      </button>
    </form>
  );
}
