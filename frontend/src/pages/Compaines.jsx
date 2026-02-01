import { useEffect, useState } from "react";
import API from "../services/auth.js";

export default function Companies() {
  const API = import.meta.env.VITE_BACKEND_URL?.trim() || "http://localhost:8000"; // change if needed
  const API_BASE = `${API}/api/v1/`;


  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-maroon-900"></div>
        <p className="mt-2 text-gray-600">Loading companies...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-700">{error}</p>
        <button
          onClick={fetchCompanies}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Verified Companies
          </h1>
          <button
            onClick={fetchCompanies}
            className="px-4 py-2 bg-maroon-900 text-white rounded-lg hover:bg-maroon-800 transition"
          >
            Refresh
          </button>
        </div>

        {companies.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <p className="text-gray-500">No companies found</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {companies.map((c) => (
              <div
                key={c._id}
                className="bg-white p-6 rounded-lg shadow hover:shadow-md transition flex justify-between items-center"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{c.name}</h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                        c.verified === "verified" 
                          ? "bg-green-100 text-green-800" 
                          : c.verified === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {c.verified}
                    </span>
                  </div>

                  <div className="space-y-1 text-sm text-gray-600">
                    <p>
                      <span className="font-semibold">Wallet:</span>{" "}
                      {c.walletAddress || "—"}
                    </p>
                    <p>
                      <span className="font-semibold">Registered:</span>{" "}
                      {new Date(c.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <button className="px-4 py-2 bg-maroon-50 text-maroon-900 rounded-lg hover:bg-maroon-100 transition font-semibold text-sm">
                    View Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}