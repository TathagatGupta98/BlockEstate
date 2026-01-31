import { ArrowRight, Shield, Users, Coins } from 'lucide-react';
import { useAccount, useConnect } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
export function Landing() {
  const { isConnected } = useAccount();
  const { connect } = useConnect();
  const navigate = useNavigate();

  // Auto-redirect if already connected
  // useEffect(() => {
  //   if (isConnected) navigate('/dashboard');
  // }, [isConnected, navigate]);

  return (
    <div className="flex flex-col items-center justify-center pt-10 pb-20">
      <div className="text-center max-w-3xl">
        <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight mb-6">
          Decentralized Living for <br/>
          <span className="text-maroon-900">Modern Societies</span>
        </h1>
        <p className="text-xl text-gray-500 mb-10">
          ResiDAO replaces traditional housing committees with transparent, 
          blockchain-based governance. Vote on repairs, manage treasury funds, 
          and pay dues instantly.
        </p>
        <Link to="/dashboard">
        <button 
          // onClick={() => connect({ connector: injected() })}
          className="bg-maroon-900 text-white text-lg px-8 py-4 rounded-xl font-bold hover:bg-maroon-800 transition shadow-lg hover:shadow-xl flex items-center gap-2 mx-auto"
        >
          Enter Resident Portal <ArrowRight />
        </button>
        </Link>
      </div>

      {/* Feature Grid */}
      <div className="grid md:grid-cols-3 gap-8 mt-24 w-full">
        {[
          { icon: <Shield className="w-8 h-8 text-maroon-900" />, title: "Secure Treasury", desc: "Funds are stored in a smart contract vault. Money only moves when the community votes 'Yes'." },
          { icon: <Users className="w-8 h-8 text-maroon-900" />, title: "Fair Voting", desc: "1 Person = 1 Vote (via Soulbound Tokens). No more backroom deals or proxy voting." },
          { icon: <Coins className="w-8 h-8 text-maroon-900" />, title: "Instant Dues", desc: "Pay maintenance fees directly to the blockchain. Real-time ledger of who paid what." },
        ].map((feature, idx) => (
          <div key={idx} className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition">
            <div className="bg-maroon-50 w-14 h-14 rounded-full flex items-center justify-center mb-4">
              {feature.icon}
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
            <p className="text-gray-500">{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}