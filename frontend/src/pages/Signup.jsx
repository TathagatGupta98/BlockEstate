import { useState } from "react";
import { registerUser } from "../services/auth";
import { useNavigate, Link } from "react-router-dom";
import AuthShell from "../components/AuthShell";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export const Signup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    walletAddress: "",
    HouseNo: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const finalValue = name === "HouseNo" ? (value ? parseInt(value) : "") : value;
    setForm((prev) => ({ ...prev, [name]: finalValue }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await registerUser(form);
      navigate("/login");
    } catch (err) {
      const errorMessage =
          err.response?.data?.message || "Signup failed. Please try again.";
      setError(errorMessage);
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
      <AuthShell
          title="Create account"
          subtitle="Join resiDAO and connect your wallet for governance access."
          bottomText={
            <>
              Already have an account?{" "}
              <Link
                  to="/login"
                  className="font-semibold text-[#6F4E37] hover:underline"
              >
                Login
              </Link>
            </>
          }
      >
        {error && (
            <div className="mb-4 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#2B1B12] mb-1">
              Username *
            </label>
            <input
                name="username"
                type="text"
                placeholder="yourname"
                value={form.username}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-[#2B1B12]/15 bg-[#fff7ee] px-4 py-3 text-[#2B1B12] placeholder:text-[#2B1B12]/40 focus:outline-none focus:ring-2 focus:ring-[#6F4E37]/50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#2B1B12] mb-1">
              Email *
            </label>
            <input
                name="email"
                type="email"
                placeholder="you@domain.com"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-[#2B1B12]/15 bg-[#fff7ee] px-4 py-3 text-[#2B1B12] placeholder:text-[#2B1B12]/40 focus:outline-none focus:ring-2 focus:ring-[#6F4E37]/50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#2B1B12] mb-1">
              Password *
            </label>

            <div className="relative">
              <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-[#2B1B12]/15 bg-[#fff7ee] px-4 py-3 pr-12 text-[#2B1B12] placeholder:text-[#2B1B12]/40 focus:outline-none focus:ring-2 focus:ring-[#6F4E37]/50"
              />
              <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#2B1B12]/50 hover:text-[#2B1B12]"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#2B1B12] mb-1">
              Wallet Address *
            </label>
            <input
                name="walletAddress"
                type="text"
                placeholder="0x..."
                value={form.walletAddress}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-[#2B1B12]/15 bg-[#fff7ee] px-4 py-3 text-[#2B1B12] placeholder:text-[#2B1B12]/40 focus:outline-none focus:ring-2 focus:ring-[#6F4E37]/50"
            />
            <p className="mt-1 text-xs text-[#2B1B12]/55">
              Your Ethereum wallet address
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#2B1B12] mb-1">
              House Number *
            </label>
            <input
                name="HouseNo"
                type="number"
                placeholder="123"
                value={form.HouseNo}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-[#2B1B12]/15 bg-[#fff7ee] px-4 py-3 text-[#2B1B12] placeholder:text-[#2B1B12]/40 focus:outline-none focus:ring-2 focus:ring-[#6F4E37]/50"
            />
          </div>

          <button
              type="submit"
              disabled={loading}
              className={`w-full rounded-xl py-3 font-semibold text-[#2B1B12] transition
            ${
                  loading
                      ? "bg-[#d6b38c]/70 cursor-not-allowed"
                      : "bg-[#d6b38c] hover:bg-[#cfa87c] shadow-lg shadow-[#6F4E37]/20"
              }`}
          >
            {loading ? (
                <span className="flex items-center justify-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              Creating User & Minting Token...
            </span>
            ) : (
                "Create Account"
            )}
          </button>
        </form>
      </AuthShell>
  );
};
