import { useEffect, useState } from "react";
import axios from "axios";
import {p} from "framer-motion/m";

const API_BASE = import.meta.env.VITE_BACKEND_URL?.trim() || "http://localhost:8000"; // change if needed
const API = `${API_BASE}/api/v1/`;
export default function VotePage({ proposalId }) {

  const [votes, setVotes] = useState([]);
  const [stats, setStats] = useState({ acceptCount: 0, rejectCount: 0 });
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token"); // or wherever you store JWT

  const headers = {
    Authorization: `Bearer ${token}`
  };

  // ---------------- FETCH VOTES ----------------

  const fetchVotes = async () => {
    const res = await axios.get(
      `${API}/votes/proposal/${proposalId}`,
      { headers }
    );
    setVotes(res.data.data);
  };

  // ---------------- FETCH STATS ----------------

  const fetchStats = async () => {
    const res = await axios.get(
      `${API}/votes/stats/${proposalId}`,
      { headers }
    );
    setStats(res.data.data);
  };

  // ---------------- CAST VOTE ----------------

  const vote = async (value) => {
    await axios.post(
      `${API}/votes`,
      { proposalId, value },
      { headers }
    );

    // refresh UI
    fetchVotes();
    fetchStats();
  };

  // ---------------- INIT ----------------

  useEffect(() => {
    Promise.all([fetchVotes(), fetchStats()])
      .then(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ padding: "20px" }}>

      <h2>📊 Proposal Votes</h2>

      {/* ===== STATS ===== */}

      <div style={{ marginBottom: "20px" }}>
        <strong>Accepted:</strong> {stats.acceptCount} <br />
        <strong>Rejected:</strong> {stats.rejectCount}
      </div>

      {/* ===== ACTION BUTTONS ===== */}

      <div style={{ marginBottom: "20px" }}>
        <button onClick={() => vote(true)}>👍 Accept</button>
        <button onClick={() => vote(false)} style={{ marginLeft: "10px" }}>
          👎 Reject
        </button>
      </div>

      {/* ===== VOTE LIST ===== */}

      <h3>All Votes</h3>

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>User</th>
            <th>Email</th>
            <th>Vote</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {votes.map(v => (
            <tr key={v._id}>
              <td>{v.userId.username}</td>
              <td>{v.userId.email}</td>
              <td>{v.value ? "Accepted" : "Rejected"}</td>
              <td>{new Date(v.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}
