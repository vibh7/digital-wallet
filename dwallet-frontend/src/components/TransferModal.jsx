import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

export default function TransferModal({ onClose, onTransferSuccess }) {
  const [toUsername, setToUsername] = useState("");
  const [amount, setAmount] = useState("");
  const [msg, setMsg] = useState("");

  const handleTransfer = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      const token = localStorage.getItem("jwt");
      await axios.post(
        import.meta.env.VITE_API_BASE_URL + "/wallet/transfer",
        { toUsername, amount: parseFloat(amount) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMsg("✅ Transfer successful!");
      onTransferSuccess?.(); // <-- refresh on success
      setTimeout(() => {
        onClose?.();
      }, 700);
    } catch (err) {
      setMsg("❌ Transfer failed!");
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50 backdrop-blur">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="bg-white/40 backdrop-blur-xl border border-white/30 shadow-2xl rounded-xl w-full max-w-md p-8 text-white relative"
        >
          <button
            onClick={onClose}
            className="absolute top-3 right-5 text-white/90 hover:text-white text-2xl font-bold"
          >×</button>
          <h2 className="text-2xl text-yellow-300 font-bold mb-2 text-center">
            Transfer Funds
          </h2>
          <form className="flex flex-col gap-4" onSubmit={handleTransfer}>
            <input
              className="p-3 rounded-lg bg-white/25 border border-white/30 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="Recipient Username"
              value={toUsername}
              onChange={e => setToUsername(e.target.value)}
              required
            />
            <input
              className="p-3 rounded-lg bg-white/25 border border-white/30 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="Amount"
              type="number"
              min="1"
              step="any"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              required
            />
            <button className="bg-yellow-400 text-blue-900 py-2.5 rounded-xl font-bold hover:bg-yellow-300 hover:scale-105 transition-transform mt-2">
              Transfer
            </button>
          </form>
          {msg && <p className="text-center text-sm mt-4 text-blue-100 font-medium">{msg}</p>}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
