import { useEffect, useMemo, useState } from "react";
import API from "../services/auth.js";

function BlobPanel({ children, className = "", svgClassName = "" }) {
  return (
      <div className={`relative w-full ${className}`}>
        {/* White blob */}
        <svg
            className={`absolute inset-0 w-full h-full ${svgClassName}`}
            viewBox="0 0 900 520"
            preserveAspectRatio="none"
            aria-hidden="true"
        >
          <path
              d="M70,110
             C120,20 260,30 360,70
             C430,5 560,30 650,95
             C780,150 820,250 770,330
             C730,430 600,510 470,480
             C340,520 170,470 90,360
             C20,250 10,170 70,110 Z"
              fill="#FFF7EE"
              stroke="rgba(43,27,18,0.08)"
              strokeWidth="2"
          />
        </svg>

        {/* Content */}
        <div className="relative z-10 p-6 md:p-8">{children}</div>
      </div>
  );
}

function BrownBlob({ className = "", opacity = 0.15 }) {
  return (
      <svg
          className={`absolute ${className}`}
          viewBox="0 0 600 600"
          aria-hidden="true"
      >
        <path
            d="M90,140
           C140,60 250,20 340,60
           C460,120 560,180 520,300
           C480,420 360,520 240,500
           C140,480 40,410 50,280
           C60,210 50,180 90,140 Z"
            fill="#2B1B12"
            opacity={opacity}
        />
      </svg>
  );
}

function MicroDots() {
  return (
      <svg
          className="absolute inset-0 w-full h-full opacity-[0.10] pointer-events-none"
          viewBox="0 0 1200 800"
          preserveAspectRatio="none"
          aria-hidden="true"
      >
        {Array.from({ length: 80 }).map((_, i) => {
          const x = (i * 37) % 1200;
          const y = (i * 91) % 800;
          return <circle key={i} cx={x} cy={y} r="2" fill="#2B1B12" />;
        })}
      </svg>
  );
}

export default function Companies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await API.get("/companies");
      setCompanies(res.data || []);
    } catch (err) {
      console.error("Failed to load companies:", err);
      setError(err.response?.data?.message || "Failed to load companies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const verifiedCount = useMemo(
      () => companies.filter((c) => c.verified === "verified").length,
      [companies]
  );

  return (
      <div className="min-h-screen relative overflow-hidden bg-[#F6EFE6]">
        {/* ✅ Brown blobs in background (NO text here) */}
        <BrownBlob className="-top-24 -left-24 w-[460px] h-[460px]" opacity={0.10} />
        <BrownBlob className="top-40 -right-28 w-[540px] h-[540px]" opacity={0.09} />
        <BrownBlob className="-bottom-40 left-1/4 w-[600px] h-[600px]" opacity={0.07} />

        {/* ✅ Dots only (still no text in brown) */}
        <MicroDots />

        <div className="relative z-10 max-w-6xl mx-auto px-5 py-10">
          {/* TOP ISLAND */}
          <BlobPanel className="mb-10">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div>
                <p className="text-xs font-extrabold tracking-[0.25em] uppercase text-[#6F4E37]">
                  Registry
                </p>
                <h1 className="text-3xl md:text-4xl font-extrabold text-[#2B1B12] mt-2">
                  Verified Companies
                </h1>
                <p className="text-[#2B1B12]/60 font-medium mt-2">
                  Browse trusted service providers available for resident proposals.
                </p>

                <div className="flex gap-3 mt-4">
                <span className="px-4 py-2 rounded-full bg-[#D6B38C]/35 border border-[#2B1B12]/10 text-[#2B1B12] text-sm font-extrabold">
                  Total: {companies.length}
                </span>
                  <span className="px-4 py-2 rounded-full bg-[#FFF7EE] border border-[#2B1B12]/10 text-[#2B1B12] text-sm font-extrabold">
                  Verified: {verifiedCount}
                </span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                    onClick={fetchCompanies}
                    className="px-6 py-3 rounded-2xl bg-[#2B1B12] text-[#FFF7EE] font-extrabold hover:bg-[#3B2A21] transition shadow-lg shadow-[#2B1B12]/10"
                >
                  Refresh
                </button>
              </div>
            </div>
          </BlobPanel>

          {/* CONTENT ISLANDS */}
          {loading ? (
              <BlobPanel>
                <div className="flex items-center justify-center gap-3 py-8">
                  <div className="h-8 w-8 rounded-full border-2 border-[#2B1B12]/20 border-t-[#2B1B12] animate-spin" />
                  <p className="text-[#2B1B12]/60 font-semibold">
                    Loading companies...
                  </p>
                </div>
              </BlobPanel>
          ) : error ? (
              <BlobPanel>
                <div className="py-2">
                  <p className="text-[#2B1B12] font-extrabold">Error</p>
                  <p className="text-[#2B1B12]/70 font-medium mt-1">{error}</p>
                  <button
                      onClick={fetchCompanies}
                      className="mt-4 px-6 py-3 rounded-2xl bg-[#2B1B12] text-[#FFF7EE] font-extrabold hover:bg-[#3B2A21] transition"
                  >
                    Retry
                  </button>
                </div>
              </BlobPanel>
          ) : companies.length === 0 ? (
              <BlobPanel>
                <p className="text-[#2B1B12]/60 font-semibold text-center py-10">
                  No companies found.
                </p>
              </BlobPanel>
          ) : (
              <div className="grid grid-cols-1 gap-10">
                {companies.map((c, idx) => (
                    <BlobPanel key={c._id} className="min-h-[240px]">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-3">
                            <h3 className="text-2xl font-extrabold text-[#2B1B12]">
                              {c.name}
                            </h3>

                            <span
                                className={`px-4 py-2 rounded-full text-xs font-extrabold uppercase border ${
                                    c.verified === "verified"
                                        ? "bg-[#D6B38C]/35 text-[#2B1B12] border-[#2B1B12]/10"
                                        : c.verified === "pending"
                                            ? "bg-[#FFF7EE] text-[#6F4E37] border-[#6F4E37]/25"
                                            : "bg-[#2B1B12]/10 text-[#2B1B12] border-[#2B1B12]/10"
                                }`}
                            >
                        {c.verified}
                      </span>

                            <span className="text-xs font-extrabold text-[#2B1B12]/40 tracking-widest">
                        #{String(idx + 1).padStart(3, "0")}
                      </span>
                          </div>

                          <div className="mt-4 space-y-2 text-sm font-medium text-[#2B1B12]/70">
                            <p>
                        <span className="font-extrabold text-[#2B1B12]">
                          Wallet:
                        </span>{" "}
                              {c.walletAddress || "—"}
                            </p>
                            <p>
                        <span className="font-extrabold text-[#2B1B12]">
                          Registered:
                        </span>{" "}
                              {new Date(c.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col items-start md:items-end gap-3">
                          <button className="px-6 py-3 rounded-2xl bg-[#D6B38C]/45 text-[#2B1B12] font-extrabold border border-[#2B1B12]/10 hover:bg-[#D6B38C]/70 transition">
                            View Profile
                          </button>
                        </div>
                      </div>
                    </BlobPanel>
                ))}
              </div>
          )}
        </div>
      </div>
  );
}
