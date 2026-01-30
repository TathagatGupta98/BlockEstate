import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-oxblood text-center px-6">
      <h1 className="text-4xl mb-6">Decentralized Housing Governance</h1>
      <p className="text-cream/90 max-w-xl mb-10">
        Collective decisions. Transparent funds. No admins. Trust enforced by code.
      </p>
      <ConnectButton />
      <button
        onClick={() => navigate("/society")}
        className="mt-6 text-sm text-taupe hover:text-gold"
      >
        Continue →
      </button>
    </div>
  );
}
