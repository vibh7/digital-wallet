import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

export default function RegisterModal({ onClose, onSwitchToLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");

    if (password !== confirm) {
      setMsg("⚠️ Passwords do not match!");
      return;
    }

    try {
      await axios.post(import.meta.env.VITE_API_BASE_URL + "api/auth/register", null, {
        params: { username, password },
      });
      setMsg("✅ Registration successful!");
      setTimeout(() => {
        onClose();
        onSwitchToLogin?.();
      }, 1000);
    } catch {
      setMsg("❌ Registration failed!");
    }
  };

  return (
    <div className="fixed inset-0 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-md z-50">
      <motion.div
        initial={{ y: 120, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 120, opacity: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="bg-white/40 backdrop-blur-lg border border-white/30 shadow-2xl rounded-t-3xl sm:rounded-2xl w-full sm:w-[420px] p-8 text-white relative"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-white/90 hover:text-white text-2xl font-bold"
        >
          ×
        </button>

        <h2 className="text-3xl font-bold text-center mb-2 text-green-300">
          Create Your Account ✨
        </h2>
        <p className="text-center text-sm text-blue-100 mb-6">
          Join dWallet and get ₹500 welcome bonus!
        </p>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            className="p-3 rounded-lg bg-white/25 border border-white/30 focus:outline-none focus:ring-2 focus:ring-green-400 placeholder-white/80"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            className="p-3 rounded-lg bg-white/25 border border-white/30 focus:outline-none focus:ring-2 focus:ring-green-400 placeholder-white/80"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            className="p-3 rounded-lg bg-white/25 border border-white/30 focus:outline-none focus:ring-2 focus:ring-green-400 placeholder-white/80"
            placeholder="Confirm Password"
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />

          <button className="mt-2 bg-green-400 text-blue-900 py-2.5 rounded-xl font-semibold hover:bg-green-300 hover:scale-105 transition-transform">
            Register
          </button>
          {msg && (
            <p className="text-center text-sm mt-3 text-blue-100 font-medium">
              {msg}
            </p>
          )}
        </form>

        <p className="text-center mt-5 text-sm text-blue-100">
          Already have an account?{" "}
          <button
            onClick={onSwitchToLogin}
            className="text-green-300 font-semibold hover:underline"
          >
            Login here
          </button>
        </p>
      </motion.div>
    </div>
  );
}
