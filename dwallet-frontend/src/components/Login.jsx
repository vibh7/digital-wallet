import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import Register from "./Register";

export default function LoginModal({ onClose, onLoginSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [showRegister, setShowRegister] = useState(false);

  const loginUser = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
        const res = await axios.post(
        import.meta.env.VITE_API_BASE_URL + "/auth/login",
        null,
        { params: { username, password } }
        );
        localStorage.setItem("jwt", res.data);
        console.log("Saved JWT to localStorage:", localStorage.getItem("jwt")); // <<< ADD THIS LINE
        setMsg("✅ Login successful!");
        setTimeout(() => {
        onClose?.();
        onLoginSuccess?.();
        }, 800); // closes modal, triggers Home to navigate
    } catch {
        setMsg("❌ Login failed! Check credentials.");
    }
    };

  return (
    <AnimatePresence>
      {!showRegister ? (
        <div className="fixed inset-0 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-md z-50">
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="bg-white/40 backdrop-blur-lg border border-white/30 shadow-2xl rounded-t-3xl sm:rounded-2xl w-full sm:w-[420px] p-8 text-white relative"
          >
            <button
              onClick={onClose}
              className="absolute top-3 right-4 text-white/90 hover:text-white text-2xl font-bold"
            >
              ×
            </button>
            <h2 className="text-3xl font-bold text-center mb-2 text-yellow-300">
              Welcome Back 👋
            </h2>
            <p className="text-center text-sm text-blue-100 mb-6">
              Log in to continue managing your wallet.
            </p>

            <form className="flex flex-col gap-4" onSubmit={loginUser}>
              <input
                className="p-3 rounded-lg bg-white/25 border border-white/30 focus:outline-none focus:ring-2 focus:ring-yellow-400 placeholder-white/80"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <input
                className="p-3 rounded-lg bg-white/25 border border-white/30 focus:outline-none focus:ring-2 focus:ring-yellow-400 placeholder-white/80"
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button className="mt-2 bg-yellow-400 text-blue-900 py-2.5 rounded-xl font-semibold hover:bg-yellow-300 hover:scale-105 transition-transform">
                Login
              </button>
              {msg && (
                <p className="text-center text-sm mt-3 text-blue-100 font-medium">
                  {msg}
                </p>
              )}
            </form>

            <p className="text-center mt-5 text-sm text-blue-100">
              Don’t have an account?{" "}
              <button
                onClick={() => setShowRegister(true)}
                className="text-yellow-300 font-semibold hover:underline"
              >
                Register here
              </button>
            </p>
          </motion.div>
        </div>
      ) : (
        <Register onClose={onClose} onSwitchToLogin={() => setShowRegister(false)} />
      )}
    </AnimatePresence>
  );
}
