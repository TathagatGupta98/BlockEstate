import { useState, useEffect } from "react";
import API from "../services/auth";

export default function CreateBid({ proposalId, onSuccess }) {
  const [estimatedId, setEstimatedId] = useState("");
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
        estimatedId,
        description,
      };

      console.log("Submitting bid:", bidData);

      const response = await API.post("/bids/create", bidData);

      console.log("Bid created successfully:", response.data);

      setEstimatedId("");
      setDescription("");

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
      <form onSubmit={handleSubmit} className="relative bg-[#FFF7EE] p-6 rounded-2xl space-y-4">
        {/* Wiggles */}
        <svg
            className="pointer-events-none absolute top-0 left-0 w-full h-14 opacity-[0.14]"
            viewBox="0 0 800 120"
            preserveAspectRatio="none"
        >
          <path
              d="M0,60 C120,10 220,110 350,60 C480,10 580,110 800,50"
              fill="none"
              stroke="#D6B38C"
              strokeWidth="10"
          />
        </svg>

        {/* Proposal ID */}
        <div className="pt-6">
          <label className="block text-xs font-extrabold text-[#2B1B12]/60 uppercase tracking-wide mb-1">
            Target Proposal ID
          </label>
          <input
              type="text"
              value={proposalId || ""}
              disabled
              className="w-full border border-[#2B1B12]/10 p-3 rounded-xl bg-[#F4ECE2] text-[#2B1B12]/60 font-mono text-sm cursor-not-allowed"
          />
        </div>

        {/* Estimated Cost */}
        <div>
          <label className="block text-sm font-extrabold text-[#2B1B12] mb-1">
            Estimated Cost / Quote ID
          </label>
          <input
              type="text"
              required
              placeholder="e.g. 5.5 ETH or Quote #12345"
              className="w-full border border-[#2B1B12]/15 p-3 rounded-xl outline-none transition focus:ring-2 focus:ring-[#D6B38C] bg-white"
              value={estimatedId}
              onChange={(e) => setEstimatedId(e.target.value)}
          />
          <p className="text-xs text-[#2B1B12]/50 mt-1 font-medium">
            Enter your bid amount or quote reference
          </p>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-extrabold text-[#2B1B12] mb-1">
            Execution Plan & Details
          </label>
          <textarea
              required
              placeholder="Describe how you will execute this project, timeline, and materials..."
              className="w-full border border-[#2B1B12]/15 p-3 rounded-xl h-32 outline-none transition focus:ring-2 focus:ring-[#D6B38C] bg-white resize-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Company ID Status */}
        {!companyId && (
            <div className="bg-[#2B1B12]/10 border border-[#2B1B12]/10 p-3 rounded-xl text-sm text-[#2B1B12] font-semibold">
              ⚠️ Company not loaded. Please ensure you're logged in.
            </div>
        )}

        <button
            type="submit"
            disabled={loading || !companyId}
            className="w-full bg-[#2B1B12] text-[#FFF7EE] font-extrabold py-3 rounded-xl hover:bg-[#3B2A21] transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#2B1B12]/10"
        >
          {loading ? "Submitting Bid..." : "Submit Bid"}
        </button>
      </form>
  );
}
