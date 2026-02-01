import { useState, useEffect } from "react";
import {
  Building2,
  Clock,
  CheckCircle2,
  ChevronRight,
  Wallet,
  X,
} from "lucide-react";
import CreateBid from "../CreateBid";
import { useNavigate } from "react-router-dom";

const API_BASE =
    import.meta.env.VITE_BACKEND_URL?.trim() || "http://localhost:8000";

const ACTIVE_JOBS = [
  {
    id: 204,
    title: "Gate Security System Upgrade",
    totalVal: "4.5 ETH",
    progress: 33,
    stages: [
      { name: "Mobilization (30%)", status: "Paid", tx: "0x123..." },
      { name: "Installation (40%)", status: "Pending", tx: "" },
      { name: "Handover (30%)", status: "Locked", tx: "" },
    ],
  },
];

function BlobPanel({ children, className = "" }) {
  return (
      <div className={`relative ${className}`}>
        <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 900 420"
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
              stroke="rgba(43,27,18,0.08)"
              strokeWidth="2"
          />
        </svg>
        <div className="relative z-10 p-6 md:p-8">{children}</div>
      </div>
  );
}

function BrownBlob({ className = "", opacity = 0.12 }) {
  return (
      <svg className={`absolute ${className}`} viewBox="0 0 600 600" aria-hidden="true">
        <path
            d="M100,150 C160,60 260,40 340,60 C470,90 560,200 520,320 C480,440 360,520 240,500 C120,480 40,390 60,260 C70,200 70,190 100,150 Z"
            fill="#2B1B12"
            opacity={opacity}
        />
      </svg>
  );
}

export function CompanyDashboard() {
  const [activeTab, setActiveTab] = useState("opportunities");
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProposal, setSelectedProposal] = useState(null);

  const navigate = useNavigate();
  const handleCompainesSumbit = () => navigate("/openCompany");

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/api/v1/proposals`);
        const json = await res.json();
        const stage2Proposals = (json?.data || []).filter(
            (p) => p.status_stage === "stage-2"
        );
        setProposals(stage2Proposals);
      } catch (error) {
        console.error("Failed to fetch proposals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProposals();
  }, []);

  const handleBidSuccess = () => {
    setSelectedProposal(null);
    alert("Bid submitted successfully!");
  };

  return (
      <div className="relative min-h-screen bg-[#F6EFE6] overflow-hidden">
        {/* Brown shapes only */}
        <BrownBlob className="-top-32 -left-32 w-[520px] h-[520px]" opacity={0.10} />
        <BrownBlob className="top-36 -right-28 w-[560px] h-[560px]" opacity={0.08} />
        <BrownBlob className="-bottom-56 left-1/3 w-[680px] h-[680px]" opacity={0.06} />

        <div className="max-w-6xl mx-auto py-10 px-5 relative">
          {/* STATS */}
          <div className="grid md:grid-cols-3 gap-8 mb-10">
            <div className="relative rounded-[32px] overflow-hidden shadow-lg">
              <svg
                  className="absolute inset-0 w-full h-full"
                  viewBox="0 0 900 420"
                  preserveAspectRatio="none"
                  aria-hidden="true"
              >
                <path
                    d="M60,80 C120,10 260,0 350,60 C440,0 560,20 650,80 C780,140 840,230 780,310 C700,420 520,420 420,380 C320,430 170,390 90,300 C10,220 10,140 60,80 Z"
                    fill="#2B1B12"
                />
              </svg>
              <div className="relative z-10 p-7 text-[#FFF7EE]">
                <p className="text-xs font-extrabold tracking-[0.25em] uppercase text-[#D6B38C]">
                  Total Earnings
                </p>
                <p className="text-3xl font-extrabold mt-2">14.2 ETH</p>
                <Wallet className="absolute right-6 bottom-6 opacity-50" size={60} />
              </div>
            </div>

            <BlobPanel className="min-h-[160px]">
              <p className="text-xs font-extrabold tracking-[0.25em] uppercase text-[#6F4E37]">
                Opportunities
              </p>
              <p className="text-4xl font-extrabold text-[#2B1B12] mt-2">
                {proposals.length}
              </p>
              <p className="text-[#2B1B12]/60 font-medium mt-2">
                Open proposals currently accepting bids.
              </p>
            </BlobPanel>

            <BlobPanel className="min-h-[160px]">
              <p className="text-xs font-extrabold tracking-[0.25em] uppercase text-[#6F4E37]">
                Reputation
              </p>
              <div className="flex items-center gap-3 mt-3">
              <span className="text-4xl font-extrabold text-[#6F4E37]">
                98
              </span>
                <span className="px-4 py-2 rounded-full bg-[#D6B38C]/35 border border-[#2B1B12]/10 font-extrabold text-sm text-[#2B1B12]">
                Top Rated
              </span>
              </div>
              <p className="text-[#2B1B12]/60 font-medium mt-3">
                Based on successful delivery history.
              </p>
            </BlobPanel>
          </div>

          {/* TABS ISLAND */}
          <BlobPanel className="mb-10">
            <div className="flex flex-wrap gap-3">
              <button
                  onClick={() => setActiveTab("opportunities")}
                  className={`px-5 py-3 rounded-2xl font-extrabold transition border ${
                      activeTab === "opportunities"
                          ? "bg-[#2B1B12] text-[#FFF7EE] border-[#2B1B12]"
                          : "bg-[#FFF7EE] text-[#2B1B12] border-[#2B1B12]/10 hover:bg-[#D6B38C]/30"
                  }`}
              >
                Open Opportunities
              </button>

              <button
                  onClick={() => setActiveTab("jobs")}
                  className={`px-5 py-3 rounded-2xl font-extrabold transition border ${
                      activeTab === "jobs"
                          ? "bg-[#2B1B12] text-[#FFF7EE] border-[#2B1B12]"
                          : "bg-[#FFF7EE] text-[#2B1B12] border-[#2B1B12]/10 hover:bg-[#D6B38C]/30"
                  }`}
              >
                Active Contracts
              </button>

              <button
                  onClick={handleCompainesSumbit}
                  className="px-5 py-3 rounded-2xl font-extrabold transition border bg-[#D6B38C]/40 text-[#2B1B12] border-[#2B1B12]/10 hover:bg-[#D6B38C]/65"
              >
                Companies
              </button>
            </div>
          </BlobPanel>

          {/* CONTENT */}
          {activeTab === "opportunities" ? (
              <div className="grid gap-10">
                {loading ? (
                    <BlobPanel>
                      <div className="flex items-center justify-center gap-3 py-10">
                        <div className="h-8 w-8 rounded-full border-2 border-[#2B1B12]/20 border-t-[#2B1B12] animate-spin" />
                        <p className="text-[#2B1B12]/60 font-semibold">
                          Loading opportunities...
                        </p>
                      </div>
                    </BlobPanel>
                ) : proposals.length === 0 ? (
                    <BlobPanel>
                      <p className="text-center text-[#2B1B12]/60 font-semibold py-10">
                        No proposals are currently accepting bids (Stage 2).
                      </p>
                    </BlobPanel>
                ) : (
                    proposals.map((job) => (
                        <BlobPanel key={job._id} className="min-h-[230px]">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                        <span className="px-4 py-2 rounded-full bg-[#D6B38C]/35 border border-[#2B1B12]/10 text-[#2B1B12] text-xs font-extrabold">
                          Passed Voting
                        </span>
                                <span className="flex items-center gap-1 text-xs text-[#2B1B12]/55 font-bold">
                          <Clock size={12} /> Posted:{" "}
                                  {new Date(job.createdAt).toLocaleDateString()}
                        </span>
                              </div>

                              <h3 className="text-2xl font-extrabold text-[#2B1B12]">
                                {job.title}
                              </h3>
                              <p className="text-[#2B1B12]/60 mt-2 max-w-2xl line-clamp-2 font-medium">
                                {job.description}
                              </p>

                              <div className="flex items-center gap-2 mt-4 text-xs font-extrabold text-[#2B1B12]/55">
                                <Building2 size={14} /> Ready for Bids
                              </div>
                            </div>

                            <div className="flex flex-col items-start md:items-end gap-3 min-w-[220px]">
                              <div className="text-right">
                                <p className="text-xs text-[#2B1B12]/50 font-extrabold uppercase">
                                  Proposal ID
                                </p>
                                <p className="text-sm font-mono font-extrabold text-[#2B1B12]">
                                  {job.onChainProposalId?.substring(0, 8)}...
                                </p>
                              </div>

                              <button
                                  onClick={() => setSelectedProposal(job)}
                                  className="px-7 py-4 rounded-2xl bg-[#2B1B12] text-[#FFF7EE] font-extrabold hover:bg-[#3B2A21] transition flex items-center gap-2 shadow-lg shadow-[#2B1B12]/10"
                              >
                                Submit Bid <ChevronRight size={18} />
                              </button>
                            </div>
                          </div>
                        </BlobPanel>
                    ))
                )}
              </div>
          ) : (
              <div className="grid gap-10">
                {ACTIVE_JOBS.map((job) => (
                    <BlobPanel key={job.id} className="min-h-[320px]">
                      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                        <div>
                          <h3 className="text-2xl font-extrabold text-[#2B1B12]">
                            {job.title}
                          </h3>
                          <p className="text-[#2B1B12]/60 font-medium mt-1">
                            Contract Value: {job.totalVal}
                          </p>
                        </div>

                        <span className="px-4 py-2 rounded-full bg-[#D6B38C]/35 border border-[#2B1B12]/10 font-extrabold text-sm text-[#2B1B12] w-fit">
                    Active
                  </span>
                      </div>

                      <div className="mt-8">
                        <div className="relative flex justify-between mb-6">
                          <div className="absolute top-1/2 left-0 w-full h-1 bg-[#2B1B12]/10 -z-10 -translate-y-1/2 rounded-full"></div>

                          {job.stages.map((stage, idx) => (
                              <div
                                  key={idx}
                                  className="flex flex-col items-center gap-2 bg-[#FFF7EE] px-2"
                              >
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center border-4 ${
                                        stage.status === "Paid"
                                            ? "border-[#6F4E37] bg-[#D6B38C]/25 text-[#2B1B12]"
                                            : stage.status === "Pending"
                                                ? "border-[#D6B38C] bg-[#D6B38C]/15 text-[#6F4E37]"
                                                : "border-[#2B1B12]/10 bg-[#F4ECE2] text-[#2B1B12]/30"
                                    }`}
                                >
                                  {stage.status === "Paid" ? (
                                      <CheckCircle2 size={18} />
                                  ) : (
                                      <div className="w-2 h-2 bg-current rounded-full" />
                                  )}
                                </div>
                                <div className="text-center">
                                  <p
                                      className={`text-xs font-extrabold ${
                                          stage.status === "Locked"
                                              ? "text-[#2B1B12]/40"
                                              : "text-[#2B1B12]"
                                      }`}
                                  >
                                    {stage.name}
                                  </p>
                                  <p className="text-[10px] text-[#2B1B12]/45 font-mono mt-1 font-bold">
                                    {stage.status}
                                  </p>
                                </div>
                              </div>
                          ))}
                        </div>
                      </div>
                    </BlobPanel>
                ))}
              </div>
          )}

          {/* BID MODAL */}
          {selectedProposal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                <div className="relative w-full max-w-lg">
                  {/* modal blob */}
                  <svg
                      className="absolute inset-0 w-full h-full"
                      viewBox="0 0 900 650"
                      preserveAspectRatio="none"
                      aria-hidden="true"
                  >
                    <path
                        d="M80,120 C140,30 280,30 370,80 C460,20 600,40 700,120
                     C830,220 860,350 790,470 C720,600 560,650 420,600
                     C300,650 170,600 90,500 C30,420 20,250 80,120 Z"
                        fill="#FFF7EE"
                        stroke="rgba(43,27,18,0.10)"
                        strokeWidth="2"
                    />
                  </svg>

                  <div className="relative z-10 p-6">
                    <button
                        onClick={() => setSelectedProposal(null)}
                        className="absolute top-4 right-4 text-[#2B1B12]/50 hover:text-[#2B1B12] transition z-10"
                    >
                      <X size={24} />
                    </button>

                    <div className="pb-4 border-b border-[#2B1B12]/10">
                      <h3 className="text-lg font-extrabold text-[#2B1B12]">
                        Submit Proposal Bid
                      </h3>
                      <p className="text-sm text-[#2B1B12]/60 font-medium">
                        For: {selectedProposal.title}
                      </p>
                    </div>

                    <div className="pt-4">
                      <CreateBid
                          proposalId={selectedProposal._id}
                          onSuccess={handleBidSuccess}
                      />
                    </div>
                  </div>
                </div>
              </div>
          )}
        </div>
      </div>
  );
}
