import { useState } from "react";
import { registerUser } from "../services/auth";
import { useNavigate } from "react-router-dom";


export const Signup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    walletAddress: "",
    HouseNo: ""  
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

    // if (!form.username || !form.email || !form.password || !form.walletAddress || !form.HouseNo) {
    //   setError("All fields are required");
    //   setLoading(false);
    //   return;
    // }

    
    try {
      console.log(form, form.walletAddress)
      const response = await registerUser(form);
      console.log("Registration successful:", response);
      navigate("/login");
    } catch (err) {
      console.error("Signup error:", err);
      console.error("Error response:", err.response?.data);
      const errorMessage = err.response?.data?.message || "Signup failed. Please try again.";
      setError(errorMessage);
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Username *</label>
          <input
            name="username"
            type="text"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email *</label>
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Password *</label>
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
        
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Wallet Address *</label>
          <input 
            name="walletAddress"
            type="text"
            placeholder="0x..."
            value={form.walletAddress}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">Your Ethereum wallet address</p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">House Number *</label>
          <input 
            name="HouseNo"
            type="number"
            placeholder="123"
            value={form.HouseNo}
            onChange={handleChange}
            required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button 
          type="submit"
          disabled={loading}
          className={`w-full text-white py-3 rounded-md transition ${
             loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? (
             <span className="flex items-center justify-center gap-2">
               {/* Simple Spinner */}
               <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
               </svg>
               Creating User & Minting Token...
             </span>
          ) : (
             "Create Account"
          )}
        </button>
      </form>

      <p className="mt-4 text-center text-sm">
        Already have an account?{" "}
        <a href="/login" className="text-blue-600 hover:underline">
          Login
        </a>
      </p>

     
    </div>
  );
};