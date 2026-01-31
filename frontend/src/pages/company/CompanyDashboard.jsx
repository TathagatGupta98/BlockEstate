import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Hammer, Clock, CheckCircle2, ChevronRight, Wallet, BadgeIndianRupee } from 'lucide-react';

// Mock Data: Proposals accepted by residents (Stage 1) waiting for company bids
const OPEN_RFPS = [
  { id: 101, title: "Clubhouse Roof Renovation", budget: "5-7 ETH", deadline: "2 Days left", desc: "Complete waterproofing and tile replacement for the main clubhouse roof." },
  { id: 102, title: "Solar Panel Installation", budget: "12-15 ETH", deadline: "5 Days left", desc: "Install 50KW solar grid for common area lighting." },
];

// Mock Data: Jobs the company has WON (Payment Stages)
const ACTIVE_JOBS = [
  { 
    id: 204, 
    title: "Gate Security System Upgrade", 
    totalVal: "4.5 ETH", 
    progress: 33,
    stages: [
      { name: "Mobilization (30%)", status: "Paid", tx: "0x123..." },
      { name: "Installation (40%)", status: "Pending", tx: "" },
      { name: "Handover (30%)", status: "Locked", tx: "" }
    ]
  }
];

export function CompanyDashboard() {
  const [activeTab, setActiveTab] = useState('opportunities');

  return (
    <div className="max-w-6xl mx-auto py-8 animate-in fade-in duration-500">
      
      {/* Header Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-10">
        <div className="bg-maroon-900 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-maroon-200 text-sm font-medium uppercase tracking-wider">Total Earnings</h3>
            <p className="text-3xl font-bold mt-1">14.2 ETH</p>
          </div>
          <Wallet className="absolute right-4 bottom-4 text-maroon-800 opacity-50" size={64} />
        </div>
        <div className="bg-white border border-maroon-100 p-6 rounded-2xl shadow-sm">
          <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Active Bids</h3>
          <p className="text-3xl font-bold text-maroon-900 mt-1">3</p>
        </div>
        <div className="bg-white border border-maroon-100 p-6 rounded-2xl shadow-sm">
          <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Reputation Score</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-3xl font-bold text-emerald-600">98/100</span>
            <span className="bg-emerald-100 text-emerald-700 text-xs px-2 py-1 rounded-full font-bold">Top Rated</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-gray-200 mb-8">
        <button 
          onClick={() => setActiveTab('opportunities')}
          className={`pb-4 text-sm font-bold transition-colors ${activeTab === 'opportunities' ? 'text-maroon-900 border-b-2 border-maroon-900' : 'text-gray-400 hover:text-gray-600'}`}
        >
          Open Opportunities
        </button>
        <button 
          onClick={() => setActiveTab('jobs')}
          className={`pb-4 text-sm font-bold transition-colors ${activeTab === 'jobs' ? 'text-maroon-900 border-b-2 border-maroon-900' : 'text-gray-400 hover:text-gray-600'}`}
        >
          Active Contracts
        </button>
      </div>

      {/* Content Area */}
      {activeTab === 'opportunities' ? (
        <div className="grid gap-6">
          {OPEN_RFPS.map((job) => (
            <div key={job.id} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="bg-maroon-50 text-maroon-800 text-xs font-bold px-3 py-1 rounded-full border border-maroon-100">RFP #{job.id}</span>
                  <span className="flex items-center gap-1 text-xs text-gray-500 font-medium"><Clock size={12} /> {job.deadline}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
                <p className="text-gray-500 mt-1 max-w-2xl">{job.desc}</p>
              </div>
              
              <div className="flex flex-col items-end gap-3 min-w-[150px]">
                <div className="text-right">
                  <p className="text-xs text-gray-400 font-bold uppercase">Est. Budget</p>
                  <p className="text-lg font-bold text-maroon-900">{job.budget}</p>
                </div>
                <Link 
                  to={`/company/bid/${job.id}`} 
                  className="bg-maroon-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-maroon-800 transition flex items-center gap-2 text-sm"
                >
                  Submit Bid <ChevronRight size={16} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {ACTIVE_JOBS.map((job) => (
            <div key={job.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="bg-gray-50 p-6 border-b border-gray-100 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{job.title}</h3>
                  <p className="text-sm text-gray-500">Contract Value: {job.totalVal}</p>
                </div>
                <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full">Active</span>
              </div>
              
              <div className="p-8">
                {/* 3-Stage Progress Tracker */}
                <div className="relative flex justify-between mb-8">
                  <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -z-10 -translate-y-1/2 rounded-full"></div>
                  
                  {job.stages.map((stage, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-2 bg-white px-2">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 ${
                        stage.status === 'Paid' ? 'border-emerald-500 bg-emerald-50 text-emerald-600' : 
                        stage.status === 'Pending' ? 'border-amber-400 bg-amber-50 text-amber-600' : 'border-gray-200 bg-gray-50 text-gray-300'
                      }`}>
                        {stage.status === 'Paid' ? <CheckCircle2 size={18} /> : <div className="w-2 h-2 bg-current rounded-full" />}
                      </div>
                      <div className="text-center">
                        <p className={`text-xs font-bold ${stage.status === 'Locked' ? 'text-gray-400' : 'text-gray-900'}`}>{stage.name}</p>
                        <p className="text-[10px] text-gray-400 font-mono mt-1">{stage.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}