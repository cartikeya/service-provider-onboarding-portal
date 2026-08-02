import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";
import { User, Mail, Lock, ShieldAlert, ArrowRight } from "lucide-react";

export default function ProviderRegister() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "provider", // Explicitly default role to provider
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await API.post("/auth/register", formData);

      // Store Auth Token and User Details
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // Redirect to Provider Onboarding / Profile setup
      navigate("/provider/onboarding");
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            Become a Service Provider
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Create an account to submit your verification details and get
            listed.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs text-rose-700">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full pl-9 pr-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 border-gray-300"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="provider@example.com"
                className="w-full pl-9 pr-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 border-gray-300"
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
                name="password"
                required
                minLength={6}
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full pl-9 pr-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 border-gray-300"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow transition disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
          >
            {loading ? "Creating Account..." : "Create Account"}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        <p className="text-center text-xs text-gray-500 mt-6">
          Already have an account?{" "}
          <Link
            to="/provider/login"
            className="text-blue-600 font-semibold hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
