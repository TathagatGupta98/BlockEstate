import { useState } from "react";
import { registerUser } from "../services/auth";
import { useNavigate } from "react-router-dom";

export const Signup = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    walletAddress:"",
    HouseNo:""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await registerUser(form);
      alert("Registered successfully");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="auth-container">
      <h2>Sign Up</h2>

      <form onSubmit={handleSubmit}>
        <input
  name="username"
  placeholder="Username"
  onChange={handleChange}
  required
/>

<input
  name="email"
  type="email"
  placeholder="Email"
  onChange={handleChange}
  required
/>

<input
  name="password"
  type="password"
  placeholder="Password"
  onChange={handleChange}
  required
/>

<input 
  name="walletAddress"
  type="text"
  placeholder="Wallet Address"
  onChange={handleChange}
  required
/>

<input 
  name="HouseNo"
  type="number"
  placeholder="House No"
  onChange={handleChange}
  required
/>





        <button type="submit">Create Account</button>
      </form>
    </div>
  );
};
