import { Link } from 'react-router-dom';
import { ChevronRight, ThumbsUp, ThumbsDown, Clock } from 'lucide-react';

export function ProposalCard({ proposal }) {
  // Status Badge Colors
  const statusStyles = {
    'stage-1': 'bg-blue-100 text-blue-800 border-blue-200',
    'stage-2': 'bg-purple-100 text-purple-800 border-purple-200',
    'stage-3': 'bg-amber-100 text-amber-800 border-amber-200',
    'stage-4': 'bg-emerald-100 text-emerald-800 border-emerald-200',
    'defeated': 'bg-red-100 text-red-800 border-red-200'
  };

  const statusLabel = {
    'stage-1': 'Voting Active',
    'stage-2': 'AI Processing',
    'stage-3': 'Work in Progress',
    'stage-4': 'Completed',
    'defeated': 'Defeated'
  };

  return (
    <div className="group bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 flex flex-col md:flex-row gap-6 items-start md:items-center">
      
      {/* 1. Status Indicator (Left) */}
      <div className="md:w-32 shrink-0">
        <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${statusStyles[proposal.status_stage] || 'bg-gray-100 border-gray-200 text-gray-500'}`}>
          {statusLabel[proposal.status_stage] || 'Pending'}
        </span>
        <div className="mt-2 flex items-center gap-1 text-xs text-gray-400 font-mono pl-1">
          #{proposal.onChainProposalId ? proposal.onChainProposalId.toString().slice(0, 6) : 'OFF-CHAIN'}...
        </div>
      </div>

      {/* 2. Main Content (Center) */}
      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-maroon-900 transition-colors truncate">
          {proposal.title}
        </h3>
        <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed">
          {proposal.description}
        </p>
        
        {/* Metadata Row */}
        <div className="flex items-center gap-6 mt-3 text-sm text-gray-400">
           <div className="flex items-center gap-1.5">
              <span className="bg-gray-100 p-1 rounded">👤</span>
              <span className="font-medium text-gray-600">{proposal.ownerId?.username || 'Resident'}</span>
           </div>
           {/* Only show votes if in voting stage or past it */}
           <div className="flex items-center gap-4 pl-4 border-l border-gray-200">
              <div className="flex items-center gap-1 text-emerald-600 font-bold">
                 <ThumbsUp size={14} /> {proposal.acceptCount || 0}
              </div>
              <div className="flex items-center gap-1 text-red-600 font-bold">
                 <ThumbsDown size={14} /> {proposal.rejectCount || 0}
              </div>
           </div>
        </div>
      </div>

      {/* 3. Action Button (Right) */}
      <div className="shrink-0 w-full md:w-auto">
        <Link 
          to={`/proposal/${proposal._id}`}
          className="flex items-center justify-center gap-2 w-full md:w-auto bg-gray-50 hover:bg-maroon-50 text-gray-700 hover:text-maroon-900 px-6 py-3 rounded-xl font-bold transition-all border border-gray-200 hover:border-maroon-200"
        >
          View Details <ChevronRight size={16} />
        </Link>
      </div>

    </div>
  );
}