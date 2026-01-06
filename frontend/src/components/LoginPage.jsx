import React, { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config.js";

function LoginPage({ onLogin, onBackClick }) {
  const [mode, setMode] = useState("login");
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (mode === "register" && !fullName.trim()) {
      setError("Enter your full name.");
      return;
    }
    if (!username.trim()) {
      setError("Enter username.");
      return;
    }
    if (!password.trim()) {
      setError("Enter password.");
      return;
    }

    setError("");
    setInfo("");
    setLoading(true);

    const path = mode === "register" ? "/register" : "/login";

    try {
      const payload =
        mode === "register"
          ? { username, password, full_name: fullName.trim() }
          : { username, password };

      const res = await axios.post(`${API_BASE_URL}${path}`, payload);

      if (res.data?.status === "ok") {
        if (mode === "register") {
          setInfo("Account created. Log in now.");
          setMode("login");
        } else {
          onLogin(res.data.user_id, res.data.full_name || username);
        }
      } else {
        setError(res.data?.error || "Try again.");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Unable to process request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Back Button */}
        {onBackClick && (
          <button
            onClick={onBackClick}
            className="mb-4 p-2 rounded-lg hover:bg-white/50 transition flex items-center gap-2 text-gray-700"
            aria-label="Go back"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span className="text-sm font-medium">Back</span>
          </button>
        )}

        <div className="bg-white/80 backdrop-blur-md border border-gray-200 shadow-xl rounded-2xl p-8">
          {/* Logo and Title */}
          <div className="flex flex-col items-center mb-6">
            <img
              src="/head-logo.png"
              alt="Arogya"
              className="h-20 w-20 object-contain mb-4"
            />
            <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-wide">
              Arogya
            </h1>
            <p className="text-sm text-emerald-600 font-medium uppercase tracking-widest">
              Wellness Assistant
            </p>
          </div>

          <p className="text-gray-600 mb-6 text-center text-sm">
            {mode === "login" ? "Log in to continue." : "Create a new account."}
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <div>
                <label className="text-sm text-gray-700 font-medium block mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  className="w-full border border-gray-300 bg-white rounded-lg px-4 py-2.5
                  focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your full name"
                  required
                />
              </div>
            )}

            <div>
              <label className="text-sm text-gray-700 font-medium block mb-2">
                Username <span className="text-red-500">*</span>
              </label>
              <input
                className="w-full border border-gray-300 bg-white rounded-lg px-4 py-2.5
                focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                required
              />
            </div>

            <div>
              <label className="text-sm text-gray-700 font-medium block mb-2">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                className="w-full border border-gray-300 bg-white rounded-lg px-4 py-2.5
                focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-2.5 rounded-lg">
                {error}
              </div>
            )}
            {info && (
              <div className="bg-green-50 border border-green-200 text-green-600 text-sm px-4 py-2.5 rounded-lg">
                {info}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 text-white py-2.5 rounded-lg font-semibold
              hover:bg-emerald-700 transition shadow-lg hover:shadow-xl disabled:opacity-50 
              disabled:cursor-not-allowed"
            >
              {loading
                ? mode === "login"
                  ? "Logging in..."
                  : "Creating..."
                : mode === "login"
                ? "Continue"
                : "Register"}
            </button>
          </form>

          {/* Bottom switch */}
          <div className="mt-6 text-center">
            {mode === "login" ? (
              <p className="text-sm text-gray-600">
                New here?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("register");
                    setError("");
                    setInfo("");
                  }}
                  className="text-emerald-600 font-semibold hover:text-emerald-700 hover:underline"
                >
                  Create an account
                </button>
              </p>
            ) : (
              <p className="text-sm text-gray-600">
                Already registered?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("login");
                    setError("");
                    setInfo("");
                  }}
                  className="text-emerald-600 font-semibold hover:text-emerald-700 hover:underline"
                >
                  Log in
                </button>
              </p>
            )}
          </div>
        </div>

        {/* Tagline */}
        <p className="text-xs text-gray-500 text-center mt-6">
          Powered by a multi-agent AI system for personalized wellness insights.
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
