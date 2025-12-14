import React, { useState, useContext } from "react";
import { motion } from "framer-motion";
import { useNavigate, NavLink } from "react-router-dom";
import api from "../api/axios";
import { AuthContext } from "../auth/AuthContext";
import { ShoppingBag } from "lucide-react";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!form.email || !form.password) {
      setError("Please fill both email and password.");
      return;
    }

    try {
      setLoading(true);
      // Register using the same API namespace as Login.jsx
      const res = await api.post("/api/auth/register", {
        email: form.email,
        password: form.password,
      });

      // If backend returns a token, log the user in directly (same behavior as Login.jsx)
      if (res?.data?.token) {
        login(res.data.token);
        alert("Registration successful");
        navigate("/dashboard");
      } else {
        // Fallback: notify and redirect to login
        alert("Registration successful. Please log in.");
        navigate("/login");
      }
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFFBF2] font-sans">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl bg-white rounded-2xl shadow-2xl p-10 mx-4"
      >
        <div className="mb-6 text-center">
          <h1 className="text-4xl font-serif font-bold text-gray-900">Create an account</h1>
          <p className="text-gray-500 mt-2">Join Mithai & Co. — handcrafted sweets and exclusive hampers.</p>
        </div>

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 p-3 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200"
              placeholder="you@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200"
              placeholder="Choose a password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-full font-semibold transition-transform transform hover:scale-[1.01] shadow-lg"
          >
            <ShoppingBag size={16} />
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>

        <div className="mt-6 text-center text-gray-500 text-sm">
          Already have an account?{' '}
          <NavLink to="/login" className="text-orange-600 font-medium hover:underline">
            Log in
          </NavLink>
        </div>
      </motion.div>
    </div>
  );
}