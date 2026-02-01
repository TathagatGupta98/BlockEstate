import { useState, useEffect } from "react";
import API from "../services/auth";

export default function CreateBid({ proposalId, onSuccess }) {
  const [estimatedId, setEstimatedId] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [companyId, setCompanyId] = useState(null);

  useEffect(() => {
    const companyStr = localStorage.getItem("company");
    if (companyStr) {
      try {
        const company = JSON.parse(companyStr);
        setCompanyId(company._id);
      } catch (err) {
        console.error("Failed to parse company data:", err);
        alert("Failed to load company information. Please login again.");
      }
    } else {
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
      <form onSubmit={handleSubmit} className="relative">
        {/* Blob shell for form */}
        <div className="relative">
          <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 900 520"
              preserveAspectRatio="none"
              aria-hidden="true"
          >
            <path
                d="M70,90
               C130,10 260,20 350,70
               C430,10 560,20 650,90
               C780,150 820,240 770,310
               C720,410 600,430 480,390
               C350,430 180,390 100,300
               C20,220 10,150 70,90 Z"
                fill="#FFF7EE"
                stroke="rgba(43,27,18,0.10)"
                strokeWidth="2"
            />
          </svg>

          <div className="relative z-10 p-6 space-y-4">
            <div>
              <label className="block text-xs font-extrabold text-[#2B1B12]/60 uppercase tracking-wide mb-1">
                Target Proposal ID
              </label>
              <input
                  type="text"
                  value={proposalId || ""}
                  disabled
                  className="w-full border border-[#2B1B12]/10 p-3 rounded-2xl bg-[#F4ECE2] text-[#2B1B12]/60 font-mono text-sm cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-extrabold text-[#2B1B12] mb-1">
                Estimated Cost / Quote ID
              </label>
              <input
                  type="text"
                  required
                  placeholder="e.g. 5.5 ETH or Quote #12345"
                  className="w-full border border-[#2B1B12]/15 p-3 rounded-2xl outline-none transition focus:ring-2 focus:ring-[#D6B38C] bg-white"
                  value={estimatedId}
                  onChange={(e) => setEstimatedId(e.target.value)}
              />
              <p className="text-xs text-[#2B1B12]/50 mt-1 font-medium">
                Enter your bid amount or quote reference
              </p>
            </div>

            <div>
              <label className="block text-sm font-extrabold text-[#2B1B12] mb-1">
                Execution Plan & Details
              </label>
              <textarea
                  required
                  placeholder="Describe how you will execute this project, timeline, and materials..."
                  className="w-full border border-[#2B1B12]/15 p-3 rounded-2xl h-32 outline-none transition focus:ring-2 focus:ring-[#D6B38C] bg-white resize-none"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {!companyId && (
                <div className="bg-[#2B1B12]/10 border border-[#2B1B12]/10 p-3 rounded-2xl text-sm text-[#2B1B12] font-semibold">
                  ⚠️ Company not loaded. Please ensure you're logged in.
                </div>
            )}

            <button
                type="submit"
                disabled={loading || !companyId}
                className="w-full bg-[#2B1B12] text-[#FFF7EE] font-extrabold py-3 rounded-2xl hover:bg-[#3B2A21] transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#2B1B12]/10"
            >
              {loading ? "Submitting Bid..." : "Submit Bid"}
            </button>
          </div>
        </div>
      </form>
  );
}
