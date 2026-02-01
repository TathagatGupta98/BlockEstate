import { useState } from "react";
import {API} from "../services/auth.js";
import { useNavigate } from "react-router-dom";

export default function CreateCompany() {

  const [name, setName] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(!name) return alert("Name required");

    try {
      setLoading(true);

      await API.post("/companies/create", {
        name,
        walletAddress
      });

      navigate("/company/dashboard");

    } catch (err) {
      alert(err.response?.data?.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <form 
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-md w-[350px] space-y-4"
      >

        <h1 className="text-xl font-semibold text-center">
          Create Company
        </h1>

        <input
          type="text"
          placeholder="Company Name"
          className="w-full border p-2 rounded"
          value={name}
          onChange={(e)=>setName(e.target.value)}
        />

        <input
          type="text"
          placeholder="Wallet Address (optional)"
          className="w-full border p-2 rounded"
          value={walletAddress}
          onChange={(e)=>setWalletAddress(e.target.value)}
        />

        <button
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Creating..." : "Create"}
        </button>

      </form>
    </div>
  );
}
