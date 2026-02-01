import { useState } from "react";
import API from "../services/auth.js";
import { useNavigate, Link } from "react-router-dom";
import AuthShell from "../components/AuthShell";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export default function CompanyRegister() {
  const [form, setForm] = useState({
    name: "",
    walletAddress: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await API.post("/companies/register", form);
      navigate("/companylogin");
    } catch (err) {
      alert(err.response?.data?.message || "Error registering");
    } finally {
      setLoading(false);
    }
  };

  return (
      <AuthShell
          title="Register Company"
          subtitle="Create a company profile to participate in resiDAO proposals."
          bottomText={
            <>
              Already have an account?{" "}
              <Link
                  to="/companylogin"
                  className="font-semibold text-[#6F4E37] hover:underline"
              >
                Login
              </Link>
            </>
          }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#2B1B12] mb-1">
              Company Name
            </label>
            <input
                type="text"
                name="name"
                placeholder="Company Name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-[#2B1B12]/15 bg-[#fff7ee] px-4 py-3 text-[#2B1B12] placeholder:text-[#2B1B12]/40 focus:outline-none focus:ring-2 focus:ring-[#6F4E37]/50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#2B1B12] mb-1">
              Wallet Address
            </label>
            <input
                type="text"
                name="walletAddress"
                placeholder="0x..."
                value={form.walletAddress}
                onChange={handleChange}
                className="w-full rounded-xl border border-[#2B1B12]/15 bg-[#fff7ee] px-4 py-3 text-[#2B1B12] placeholder:text-[#2B1B12]/40 focus:outline-none focus:ring-2 focus:ring-[#6F4E37]/50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#2B1B12] mb-1">
              Password
            </label>

            <div className="relative">
              <input
                  type={showPassword ? "text" : "password"}
                  name="password"
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

          <button
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
              Registering...
            </span>
            ) : (
                "Register"
            )}
          </button>
        </form>
      </AuthShell>
  );
}
