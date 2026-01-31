// import { useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { Send, Leaf, Clock, DollarSign, FileText } from 'lucide-react';

// export function CompanyBid() {
//   const { id } = useParams(); // Get Proposal ID
//   const navigate = useNavigate();
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const [formData, setFormData] = useState({
//     price: '',
//     duration: '',
//     description: '',
//     sustainability: '',
//     workingHours: ''
//   });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     // TODO: Send to Backend -> Backend feeds to AI Agent
//     console.log("Submitting Bid for Analysis:", formData);

//     setTimeout(() => {
//       setIsSubmitting(false);
//       alert("Bid Submitted! Our AI Agent is analyzing your proposal against others.");
//       navigate('/company/dashboard');
//     }, 2000);
//   };

//   return (
//     <div className="max-w-3xl mx-auto py-10 animate-in slide-in-from-bottom-4 duration-500">
      
//       <div className="bg-white rounded-3xl shadow-xl border border-maroon-100 overflow-hidden">
//         {/* Header */}
//         <div className="bg-maroon-900 p-8 text-white">
//           <div className="flex justify-between items-start">
//             <div>
//               <p className="text-maroon-200 text-xs font-bold uppercase tracking-widest mb-1">Submitting Counter-Proposal</p>
//               <h2 className="text-2xl font-bold">RFP #{id || '101'}</h2>
//             </div>
//             <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">
//                <FileText className="text-maroon-100" />
//             </div>
//           </div>
//         </div>

//         <form onSubmit={handleSubmit} className="p-8 space-y-8">
          
//           {/* Section 1: Core Specs */}
//           <div className="grid md:grid-cols-2 gap-6">
//             <div>
//               <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
//                 <DollarSign size={16} className="text-maroon-600" /> Bid Price (ETH)
//               </label>
//               <input 
//                 type="number" step="0.0001" required
//                 className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-maroon-600 outline-none font-mono"
//                 placeholder="e.g. 5.2"
//                 value={formData.price}
//                 onChange={e => setFormData({...formData, price: e.target.value})}
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
//                 <Clock size={16} className="text-maroon-600" /> Duration (Days)
//               </label>
//               <input 
//                 type="number" required
//                 className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-maroon-600 outline-none"
//                 placeholder="e.g. 14"
//                 value={formData.duration}
//                 onChange={e => setFormData({...formData, duration: e.target.value})}
//               />
//             </div>
//           </div>

//           {/* Section 2: AI Evaluation Metrics */}
//           <div className="space-y-4 bg-maroon-50/50 p-6 rounded-2xl border border-maroon-100">
//             <h3 className="text-sm font-black text-maroon-900 uppercase tracking-widest mb-2 flex items-center gap-2">
//               <Leaf size={16} /> For AI Evaluation
//             </h3>
            
//             <div>
//               <label className="block text-sm font-bold text-gray-700 mb-2">Sustainable Development Plan</label>
//               <textarea 
//                 rows={3} required
//                 className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-maroon-600 outline-none text-sm"
//                 placeholder="Describe eco-friendly materials or waste disposal methods..."
//                 value={formData.sustainability}
//                 onChange={e => setFormData({...formData, sustainability: e.target.value})}
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-bold text-gray-700 mb-2">Proposed Working Hours</label>
//               <input 
//                 type="text" required
//                 className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-maroon-600 outline-none text-sm"
//                 placeholder="e.g. Mon-Fri, 10 AM - 4 PM (No noise during lunch)"
//                 value={formData.workingHours}
//                 onChange={e => setFormData({...formData, workingHours: e.target.value})}
//               />
//             </div>
//           </div>

//           {/* Detailed Description */}
//           <div>
//             <label className="block text-sm font-bold text-gray-700 mb-2">Technical Description</label>
//             <textarea 
//               rows={4} required
//               className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-maroon-600 outline-none"
//               placeholder="Detailed breakdown of the work scope..."
//               value={formData.description}
//               onChange={e => setFormData({...formData, description: e.target.value})}
//             />
//           </div>

//           {/* Submit Action */}
//           <div className="pt-4 border-t border-gray-100">
//             <button 
//               type="submit"
//               disabled={isSubmitting}
//               className="w-full bg-maroon-900 text-white font-bold py-4 rounded-xl hover:bg-maroon-800 transition shadow-lg shadow-maroon-100 flex items-center justify-center gap-2"
//             >
//               {isSubmitting ? 'Sending to AI Agent...' : 'Submit Proposal for Analysis'} <Send size={18} />
//             </button>
//             <p className="text-center text-xs text-gray-400 mt-4">
//               By submitting, you agree to the ResiDAO smart contract terms regarding payment milestones.
//             </p>
//           </div>

//         </form>
//       </div>
//     </div>
//   );
// }