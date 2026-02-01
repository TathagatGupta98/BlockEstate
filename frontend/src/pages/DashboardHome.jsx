import { useState, useEffect } from 'react';
import { ProposalCard } from '../components/ProposalCard';
import { BarChart3, RefreshCw, Layers, History, Vote } from 'lucide-react';

const API = import.meta.env.VITE_BACKEND_URL?.trim() || "http://localhost:8000"; // change if needed
const API_BASE = `${API}/api/v1/`;

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

  useEffect(() => { fetchProposals(); }, []);

  // Filter Logic
  const activeProposals = proposals.filter(p => p.status_stage === 'stage-1');
  const processingProposals = proposals.filter(p => ['stage-2', 'stage-3'].includes(p.status_stage));
  const historyProposals = proposals.filter(p => ['stage-4', 'defeated'].includes(p.status_stage));

  return (
    <div className="max-w-5xl mx-auto py-12 px-6 animate-in fade-in duration-500 pb-24">
      
      {/* Page Header */}
      <div className="flex items-end justify-between mb-12 border-b border-gray-100 pb-6">
         <div>
            <h1 className="text-3xl font-black text-gray-900 mb-2 flex items-center gap-3">
               <span className="bg-maroon-900 text-white p-2 rounded-lg"><BarChart3 size={24} /></span>
               Community Governance
            </h1>
            <p className="text-gray-500 text-lg">Review active proposals, track AI analysis, and monitor society projects.</p>
         </div>
         <button 
            onClick={fetchProposals} 
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-50 transition shadow-sm"
         >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Sync Data
         </button>
      </div>

      {/* SECTION 1: ACTIVE VOTING (Priority) */}
      <section className="mb-12">
         <div className="flex items-center gap-2 mb-6">
            <Vote className="text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">Active Voting Phase</h2>
            <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-bold">{activeProposals.length}</span>
         </div>
         
         <div className="space-y-4">
            {activeProposals.length > 0 ? (
               activeProposals.map(p => <ProposalCard key={p._id} proposal={p} />)
            ) : (
               <div className="bg-gray-50 border border-dashed border-gray-200 rounded-2xl p-10 text-center text-gray-400">
                  No proposals currently require your vote.
               </div>
            )}
         </div>
      </section>

      {/* SECTION 2: IN PROGRESS (AI & Execution) */}
      {processingProposals.length > 0 && (
         <section className="mb-12">
            <div className="flex items-center gap-2 mb-6">
               <Layers className="text-purple-600" />
               <h2 className="text-xl font-bold text-gray-900">Processing & Execution</h2>
            </div>
            <div className="space-y-4">
               {processingProposals.map(p => <ProposalCard key={p._id} proposal={p} />)}
            </div>
         </section>
      )}

      {/* SECTION 3: HISTORY (Completed/Defeated) */}
      {historyProposals.length > 0 && (
         <section>
            <div className="flex items-center gap-2 mb-6 opacity-75">
               <History className="text-gray-500" />
               <h2 className="text-xl font-bold text-gray-700">Proposal History</h2>
            </div>
            <div className="space-y-4 opacity-80 hover:opacity-100 transition-opacity">
               {historyProposals.map(p => <ProposalCard key={p._id} proposal={p} />)}
            </div>
         </section>
      )}

    </div>
  );
}