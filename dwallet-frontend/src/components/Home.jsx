import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import Login from "./Login";
import Register from "./Register";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const navigate = useNavigate();

  // Disable scroll when modal open
  useEffect(() => {
    document.body.style.overflow = showLogin || showRegister ? "hidden" : "auto";
  }, [showLogin, showRegister]);

  return (
    <section
      id="home"
      className="h-screen flex flex-col justify-center items-center text-center px-6 bg-gradient-to-b from-gray-900 via-blue-900 to-gray-900 text-white relative overflow-hidden"
    >
      {/* Glow background */}
      <div className="absolute inset-0 bg-gradient-to-t from-blue-800/40 via-transparent to-transparent blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="z-10"
      >
        <h1 className="text-5xl sm:text-6xl font-extrabold mb-4">
          Welcome to <span className="text-yellow-400">dWallet</span>
        </h1>
        <TypeAnimation
          sequence={[
            "Your Digital Finance Partner 💸",
            2000,
            "Manage, Save & Grow 🚀",
            2000,
            "Secure • Fast • Smart 🔐",
            2000,
          ]}
          speed={60}
          repeat={Infinity}
          className="text-xl sm:text-2xl text-blue-200 mb-6"
        />
        <p className="text-blue-100 text-sm sm:text-base max-w-md mx-auto mb-8">
          Track transactions, manage your balance, and enjoy secure digital banking — all in one place.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowLogin(true)}
            className="bg-yellow-400 text-blue-900 font-semibold px-6 py-2.5 rounded-xl shadow-lg hover:bg-yellow-300"
          >
            Login
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowRegister(true)}
            className="bg-green-400 text-blue-900 font-semibold px-6 py-2.5 rounded-xl shadow-lg hover:bg-green-300"
          >
            Register
          </motion.button>
        </div>
      </motion.div>
      {/* Modals */}
      {showLogin && (
        <Login
          onClose={() => setShowLogin(false)}
          // After login, go to dashboard
          onLoginSuccess={() => {
            setShowLogin(false);
            navigate("/dashboard");
          }}
        />
      )}
      {showRegister && (
        <Register
          onClose={() => setShowRegister(false)}
          onSwitchToLogin={() => {
            setShowRegister(false);
            setShowLogin(true);
          }}
        />
      )}
    </section>
  );
};

export default Home;
