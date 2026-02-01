import { useEffect, useState } from "react";
import API from "../services/auth.js";

export default function Companies() {
  const API_BASE = "http://localhost:8000/api/v1/companies";


  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCompanies = async () => {
    try {
      const res = await API_BASE.get("/");
      setCompanies(res.data.data);
    } catch (err) {
      alert("Failed to load companies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  if(loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      <h1 className="text-2xl font-bold mb-4">
        Companies
      </h1>

      <div className="grid gap-4">

        {companies.map((c) => (
          <div 
            key={c._id}
            className="bg-white p-4 rounded shadow flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">{c.name}</p>
              <p className="text-sm text-gray-500">
                Wallet: {c.walletAddress || "—"}
              </p>
            </div>

            <span
              className={`px-3 py-1 rounded text-sm ${
                c.verified === "pending" && "bg-green-200"
              } ${
                c.verified === "verified" && "bg-green-200"
              } ${
                c.verified === "rejected" && "bg-red-200"
              }`}
            >
              {"verified"}
            </span>
          </div>
        ))}

      </div>
    </div>
  );
}
