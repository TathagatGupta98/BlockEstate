import { useState, useEffect } from "react";
import { ProposalCard } from "../components/ProposalCard";
import { BarChart3, RefreshCw, Layers, History, Vote } from "lucide-react";

const API = import.meta.env.VITE_BACKEND_URL?.trim() || "http://localhost:8000"; // change if needed
const API_BASE = `${API}/api/v1`;

export function DashboardHome() {
    const [proposals, setProposals] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchProposals = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API_BASE}/proposals`);
            const json = await res.json();
            setProposals(json?.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProposals();
    }, []);

    // Filter Logic
    const activeProposals = proposals.filter((p) => p.status_stage === "stage-1");
    const processingProposals = proposals.filter((p) =>
        ["stage-2", "stage-3"].includes(p.status_stage)
    );
    const historyProposals = proposals.filter((p) =>
        ["stage-4", "defeated"].includes(p.status_stage)
    );

    return (
        <div className="relative min-h-screen w-full bg-[#f6efe6] overflow-hidden">
            {/* Map-like background (same vibe as AuthShell) */}
            <div className="absolute inset-0 pointer-events-none">
                <img
                    src="/src/assets/map-bg.jpg"
                    alt="map background"
                    className="h-full w-full object-cover opacity-[0.28]"
                />
                <div className="absolute inset-0 bg-[#f6efe6]/85" />
            </div>

            <div className="relative max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8 animate-in fade-in duration-500 pb-24">
                {/* Header Card */}
                <div className="mb-10 rounded-3xl border border-[#2B1B12]/10 bg-white/65 backdrop-blur shadow-xl overflow-hidden">
                    <div className="p-8 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                        <div>
                            <div className="inline-flex items-center gap-2 rounded-2xl border border-[#2B1B12]/10 bg-white/60 px-4 py-2 shadow-sm">
                <span className="rounded-xl bg-[#2B1B12] p-2 text-white shadow-md">
                  <BarChart3 size={18} />
                </span>
                                <span className="text-sm font-extrabold tracking-wide text-[#2B1B12]">
                  resiDAO Governance
                </span>
                            </div>

                            <h1 className="mt-5 text-3xl sm:text-4xl font-extrabold text-[#2B1B12]">
                                Community Governance
                            </h1>

                            <p className="mt-2 text-sm sm:text-base text-[#2B1B12]/65 max-w-2xl">
                                Review active proposals, track AI analysis, and monitor society
                                projects — all in one clean dashboard.
                            </p>
                        </div>

                        <button
                            onClick={fetchProposals}
                            className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#fff7ee] border border-[#2B1B12]/10
              text-sm font-extrabold text-[#2B1B12] shadow-lg shadow-[#6F4E37]/10
              hover:bg-[#f4ece2] transition active:scale-[0.99]"
                        >
                            <RefreshCw
                                size={16}
                                className={loading ? "animate-spin text-[#6F4E37]" : "text-[#2B1B12]/60"}
                            />
                            {loading ? "Syncing..." : "Sync Data"}
                        </button>
                    </div>

                    {/* Decorative footer strip */}
                    <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#d6b38c] to-transparent opacity-60" />
                </div>

                {/* SECTION 1: ACTIVE VOTING */}
                <section className="mb-12">
                    <div className="flex items-center justify-between gap-4 mb-6">
                        <div className="flex items-center gap-3">
                            <div className="rounded-2xl bg-white/70 border border-[#2B1B12]/10 p-2 shadow-sm">
                                <Vote className="text-[#6F4E37]" size={18} />
                            </div>
                            <h2 className="text-xl font-extrabold text-[#2B1B12]">
                                Active Voting Phase
                            </h2>
                            <span className="bg-[#fff7ee] border border-[#2B1B12]/10 text-[#2B1B12] px-2.5 py-0.5 rounded-full text-xs font-extrabold shadow-sm">
                {activeProposals.length}
              </span>
                        </div>

                        <span className="hidden sm:inline-flex items-center gap-2 text-xs font-bold text-[#2B1B12]/50">
              Priority section
              <span className="h-1.5 w-1.5 rounded-full bg-[#6F4E37]/60" />
            </span>
                    </div>

                    <div className="space-y-5">
                        {activeProposals.length > 0 ? (
                            activeProposals.map((p) => (
                                <div
                                    key={p._id}
                                    className="rounded-3xl border border-[#2B1B12]/10 bg-white/60 backdrop-blur shadow-lg hover:shadow-xl transition overflow-hidden"
                                >
                                    {/* subtle strip */}
                                    <div className="h-1 w-full bg-gradient-to-r from-[#6F4E37] via-[#d6b38c] to-transparent opacity-70" />
                                    <div className="p-4 sm:p-6">
                                        <ProposalCard proposal={p} />
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="rounded-3xl border border-dashed border-[#2B1B12]/15 bg-white/40 p-10 text-center text-[#2B1B12]/50 shadow-sm">
                                <p className="font-extrabold text-[#2B1B12]/70">
                                    No proposals currently require your vote.
                                </p>
                                <p className="mt-2 text-sm">
                                    When a proposal enters Stage-1, it will appear here.
                                </p>
                            </div>
                        )}
                    </div>
                </section>

                {/* SECTION 2: IN PROGRESS */}
                {processingProposals.length > 0 && (
                    <section className="mb-12">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="rounded-2xl bg-white/70 border border-[#2B1B12]/10 p-2 shadow-sm">
                                <Layers className="text-[#6F4E37]" size={18} />
                            </div>
                            <h2 className="text-xl font-extrabold text-[#2B1B12]">
                                Processing & Execution
                            </h2>
                            <span className="bg-white/60 border border-[#2B1B12]/10 text-[#2B1B12]/70 px-2.5 py-0.5 rounded-full text-xs font-extrabold shadow-sm">
                {processingProposals.length}
              </span>
                        </div>

                        <div className="space-y-5">
                            {processingProposals.map((p) => (
                                <div
                                    key={p._id}
                                    className="rounded-3xl border border-[#2B1B12]/10 bg-white/55 backdrop-blur shadow-lg hover:shadow-xl transition overflow-hidden"
                                >
                                    <div className="h-1 w-full bg-gradient-to-r from-[#d6b38c] to-transparent opacity-70" />
                                    <div className="p-4 sm:p-6">
                                        <ProposalCard proposal={p} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* SECTION 3: HISTORY */}
                {historyProposals.length > 0 && (
                    <section>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="rounded-2xl bg-white/60 border border-[#2B1B12]/10 p-2 shadow-sm opacity-80">
                                <History className="text-[#2B1B12]/60" size={18} />
                            </div>
                            <h2 className="text-xl font-extrabold text-[#2B1B12]/70">
                                Proposal History
                            </h2>
                            <span className="bg-white/40 border border-[#2B1B12]/10 text-[#2B1B12]/50 px-2.5 py-0.5 rounded-full text-xs font-extrabold shadow-sm">
                {historyProposals.length}
              </span>
                        </div>

                        <div className="space-y-5 opacity-90 hover:opacity-100 transition-opacity">
                            {historyProposals.map((p) => (
                                <div
                                    key={p._id}
                                    className="rounded-3xl border border-[#2B1B12]/10 bg-white/40 backdrop-blur shadow-md hover:shadow-lg transition overflow-hidden"
                                >
                                    <div className="h-1 w-full bg-gradient-to-r from-[#2B1B12]/40 to-transparent opacity-60" />
                                    <div className="p-4 sm:p-6">
                                        <ProposalCard proposal={p} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}
