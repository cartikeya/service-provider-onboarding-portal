import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { Lock, Mail, ShieldAlert } from "lucide-react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await API.post("/auth/login", { email, password });

      // Ensure user is an Admin
      if (res.data.user && res.data.user.role !== "admin") {
        setError("Access denied. Admin credentials required.");
        setLoading(false);
        return;
      }

      // Store Auth Token and User Details
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // Redirect to Admin Dashboard
      navigate("/admin/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Invalid email or password. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-gray-900 text-white rounded-xl flex items-center justify-center mx-auto mb-3 shadow-md">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Admin Portal</h2>
          <p className="text-xs text-gray-500 mt-1">
            Enter your admin credentials to access the dashboard.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs text-rose-700">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="w-full pl-9 pr-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 border-gray-300"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 border-gray-300"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-gray-900 hover:bg-black text-white text-sm font-semibold rounded-xl shadow transition disabled:opacity-50 mt-2"
          >
            {loading ? "Authenticating..." : "Sign In to Admin Panel"}
          </button>
        </form>
      </div>
    </div>
  );
}
