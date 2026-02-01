import { useState, useEffect } from "react";
import API from "../services/auth";

export default function CreateBid({ proposalId, onSuccess }) {
  const [estimatedId, setEstimatedId] = useState(""); // Match backend field name
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [companyId, setCompanyId] = useState(null);

  // Get company ID from localStorage on mount
  useEffect(() => {
    const companyStr = localStorage.getItem("company");
    if (companyStr) {
      try {
        const company = JSON.parse(companyStr);
        setCompanyId(company._id);
        console.log("Company ID loaded:", company._id);
      } catch (err) {
        console.error("Failed to parse company data:", err);
        alert("Failed to load company information. Please login again.");
      }
    } else {
      console.error("No company data in localStorage");
      alert("Company not found. Please login again.");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!companyId) {
      alert("Company ID not found. Please login again.");
      return;
    }

    if (!proposalId) {
      alert("Proposal ID is missing.");
      return;
    }

    try {
      setLoading(true);

      const bidData = {
        proposalId,
        companyId,
        estimatedId, // Backend expects this field name
        description
      };

      console.log("Submitting bid:", bidData);

      const response = await API.post("/bids/create", bidData);

      console.log("Bid created successfully:", response.data);

      // Reset form
      setEstimatedId("");
      setDescription("");

      // Call success callback
      onSuccess && onSuccess();

      alert("Bid created successfully!");

    } catch (err) {
      console.error("Error creating bid:", err);
      const errorMsg = err.response?.data?.message || "Error creating bid";
      alert(errorMsg);
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
          value={proposalId || ""}
          disabled
          className="w-full border border-gray-200 p-3 rounded-lg bg-gray-100 text-gray-500 font-mono text-sm cursor-not-allowed"
        />
      </div>

      {/* 2. Estimated Cost/ID */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1">
            Estimated Cost / Quote ID
        </label>
        <input
            type="text"
            required
            placeholder="e.g. 5.5 ETH or Quote #12345"
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-maroon-900 outline-none transition"
            value={estimatedId}
            onChange={(e) => setEstimatedId(e.target.value)}
        />
        <p className="text-xs text-gray-400 mt-1">Enter your bid amount or quote reference</p>
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

      {/* Company ID Status */}
      {!companyId && (
        <div className="bg-red-50 border border-red-200 p-3 rounded-lg text-sm text-red-700">
          ⚠️ Company not loaded. Please ensure you're logged in.
        </div>
      )}

      <button
        type="submit"
        disabled={loading || !companyId}
        className="w-full bg-maroon-900 text-white font-bold py-3 rounded-xl hover:bg-maroon-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Submitting Bid..." : "Submit Bid"}
      </button>
    </form>
  );
}