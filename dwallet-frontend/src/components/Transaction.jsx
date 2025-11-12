import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowLeft, FaExchangeAlt } from "react-icons/fa";

export default function Transactions() {
  const [list, setList] = useState([]);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    axios
      .get(import.meta.env.VITE_API_BASE_URL + "/wallet/transactions", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setList(Array.isArray(res.data) ? res.data : []))
      .catch(() => setMsg("Could not load transactions."));
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-950 via-blue-900 to-gray-900 relative overflow-hidden">
      {/* background gradient glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_#3b82f680,_transparent_60%)] blur-3xl opacity-30" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_#facc15aa,_transparent_60%)] blur-3xl opacity-20" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative z-10 w-full max-w-4xl bg-white/15 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl p-6 sm:p-10"
      >
        {/* Header */}
        <div className="flex flex-wrap justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <FaExchangeAlt className="text-yellow-400 text-3xl drop-shadow" />
            <h1 className="text-3xl sm:text-4xl font-extrabold text-yellow-400 tracking-tight">
              Transaction History
            </h1>
          </div>
          <Link
            to="/dashboard"
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl font-semibold shadow-md hover:bg-blue-700 hover:scale-105 transition-transform duration-300"
          >
            <FaArrowLeft /> Dashboard
          </Link>
        </div>

        {/* Message */}
        {msg && (
          <div className="text-red-400 text-center mb-4 font-medium animate-pulse">
            {msg}
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-blue-300/20 shadow-inner">
          <table className="w-full text-left text-sm sm:text-base text-blue-100">
            <thead className="bg-blue-500/20 text-blue-200 uppercase tracking-wide">
              <tr>
                <th className="py-3 px-3 sm:px-4">Type</th>
                <th className="py-3 px-3 sm:px-4">Amount</th>
                <th className="py-3 px-3 sm:px-4">Description</th>
                <th className="py-3 px-3 sm:px-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {list.length > 0 ? (
                list.map((tx, i) => (
                  <motion.tr
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                    className={`border-b border-blue-400/20 hover:bg-blue-400/10 transition-all duration-200 ${
                      i % 2 === 0 ? "bg-blue-950/20" : "bg-transparent"
                    }`}
                  >
                    <td
                      className={`py-3 px-3 sm:px-4 font-bold ${
                        tx.type === "CREDIT"
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {tx.type}
                    </td>
                    <td className="py-3 px-3 sm:px-4 font-semibold">
                      ₹{tx.amount}
                    </td>
                    <td className="py-3 px-3 sm:px-4">
                      {tx.description || (
                        <span className="italic text-blue-300">—</span>
                      )}
                    </td>
                    <td className="py-3 px-3 sm:px-4 text-blue-200 text-sm">
                      {tx.timestamp
                        ? tx.timestamp.replace("T", " ").substring(0, 19)
                        : "-"}
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="text-blue-300 py-12 text-center text-lg font-semibold"
                  >
                    No transactions yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-6">
          <span className="text-blue-200 text-sm">
            💡 Secure and instant statement view
          </span>
          <Link
            to="/dashboard"
            className="bg-yellow-400 hover:bg-yellow-300 text-blue-900 px-5 py-2 rounded-xl font-bold shadow-lg hover:shadow-yellow-300/30 active:scale-95 transition-transform"
          >
            Back to Dashboard
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
