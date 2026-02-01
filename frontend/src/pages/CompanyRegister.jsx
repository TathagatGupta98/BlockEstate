import { useState } from "react";
import API from "../services/auth.js";
import { useNavigate } from "react-router-dom";

export default function CompanyRegister() {
  const [form, setForm] = useState({
    name: "",
    walletAddress: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form 
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">
          Register Company
        </h2>

        <input
          type="text"
          name="name"
          placeholder="Company Name"
          value={form.name}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
          required
        />

        <input
          type="text"
          name="walletAddress"
          placeholder="Wallet Address"
          value={form.walletAddress}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
          required
        />

        <button
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Registering..." : "Register"}
        </button>
         <p className="mt-4 text-center text-sm">
        Already have an account?{" "}
        <a href="/companylogin" className="text-blue-600 hover:underline">
          Login
        </a>
      </p>
      </form>
      
    </div>
  );
}
