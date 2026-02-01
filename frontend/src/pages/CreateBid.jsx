import { useState } from "react";
import API from "../services/auth";

export default function CreateBid({ proposalId, companyId, onSuccess }) {
  const [estimatedCost, setEstimatedCost] = useState(""); // Renamed for clarity, or keep estimatedId if backend requires it
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await API.post("/bids/create", {
        proposalId, // <--- This is auto-filled from the prop
        companyId,
        estimatedCost, // Sending the cost/bid amount
        description
      });

      setEstimatedCost("");
      setDescription("");

      onSuccess && onSuccess();

      alert("Bid created successfully");

    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error creating bid");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl space-y-4"
    >
      {/* 1. AUTO-FILLED PROPOSAL ID (Read Only) */}
      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">
            Target Proposal ID
        </label>
        <input
          type="text"
          value={proposalId}
          disabled
          className="w-full border border-gray-200 p-3 rounded-lg bg-gray-100 text-gray-500 font-mono text-sm cursor-not-allowed"
        />
      </div>

      {/* 2. Bid Amount / Cost */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1">
            Estimated Cost (ETH/INR)
        </label>
        <input
            type="text"
            required
            placeholder="e.g. 5.5 ETH"
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-maroon-900 outline-none transition"
            value={estimatedCost}
            onChange={(e) => setEstimatedCost(e.target.value)}
        />
      </div>

      {/* 3. Description / Proposal */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1">
            Execution Plan & Details
        </label>
        <textarea
            required
            placeholder="Describe how you will execute this project, timeline, and materials..."
            className="w-full border border-gray-300 p-3 rounded-lg h-32 focus:ring-2 focus:ring-maroon-900 outline-none transition resize-none"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-maroon-900 text-white font-bold py-3 rounded-xl hover:bg-maroon-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Submitting Bid..." : "Submit Bid"}
      </button>
    </form>
  );
}