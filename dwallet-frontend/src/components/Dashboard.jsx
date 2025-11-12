import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ProfileBlock from "./ProfileBlock";
import DepositModal from "./DepositModal";
import WithdrawModal from "./WithdrawModal";
import TransferModal from "./TransferModal";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  const [balance, setBalance] = useState("-");
  const [transactions, setTransactions] = useState([]);
  const navigate = useNavigate();
  const [showDeposit, setShowDeposit] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [showTransfer, setShowTransfer] = useState(false);

  // Fetch balance + transactions
  const refreshBalanceAndTx = () => {
    const token = localStorage.getItem("jwt");

    axios
      .get(import.meta.env.VITE_API_BASE_URL + "/wallet/balance", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setBalance(res.data))
      .catch(() => setBalance("Error"));

    axios
      .get(import.meta.env.VITE_API_BASE_URL + "/wallet/transactions", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) =>
        setTransactions(Array.isArray(res.data) ? res.data.slice(0, 10) : [])
      )
      .catch(() => setTransactions([]));
  };

  useEffect(() => {
    refreshBalanceAndTx();
  }, []);

  // ✅ Accurate Graph Data
  const graphData = (() => {
    if (!Array.isArray(transactions) || transactions.length === 0) return [];

    // Sort by oldest first (for accurate running balance)
    const sorted = [...transactions].sort(
        (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
    );

    // Relative running balance just for catalog, not actual wallet
    let runningBalance = 0;
    return sorted.map((tx, idx) => {
        if (tx.type === "CREDIT") runningBalance += Number(tx.amount);
        else if (tx.type === "DEBIT") runningBalance -= Number(tx.amount);

        return {
        name: new Date(tx.timestamp).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
        }),
        amount: Number(tx.amount) || 0,
        type: tx.type,
        balance: runningBalance,
        };
    });
    })();   


  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white items-center py-6 px-4 sm:px-8">
      <ProfileBlock />

      {/* Main dashboard content */}
      <div className="w-full max-w-7xl flex flex-col lg:flex-row gap-8 mt-6">
        {/* Left side — dashboard info */}
        <div className="flex-1 bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-yellow-400 mb-4">
            Dashboard
          </h1>

          <div className="font-semibold text-blue-100 mb-2 text-lg">
            Wallet Balance
          </div>
          <div className="text-4xl sm:text-5xl font-bold text-green-400 mb-6">
            {typeof balance === "number" ? `₹${balance}` : balance}
          </div>

          {/* Transactions Table */}
          <div className="mb-8 overflow-x-auto">
            <h2 className="text-xl font-bold text-blue-300 mb-3">
              Recent Transactions
            </h2>
            <table className="w-full text-left text-sm min-w-[350px]">
              <thead>
                <tr className="border-b border-blue-400 text-blue-200">
                  <th className="pb-2">Type</th>
                  <th className="pb-2">Amount</th>
                  <th className="pb-2">Description</th>
                  <th className="pb-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length > 0 ? (
                  transactions.map((tx, i) => (
                    <tr
                      key={i}
                      className="border-b border-blue-800 hover:bg-blue-300/15 transition"
                    >
                      <td
                        className={`font-bold ${
                          tx.type === "CREDIT"
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {tx.type}
                      </td>
                      <td>₹{tx.amount}</td>
                      <td className="truncate max-w-[120px]">
                        {tx.description || "-"}
                      </td>
                      <td className="text-[12px] text-blue-200">
                        {tx.timestamp
                          ? tx.timestamp.replace("T", " ").substring(0, 16)
                          : "-"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="text-blue-200 text-center py-4 text-lg"
                    >
                      No transactions yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 justify-center mb-4">
            <button
              onClick={() => navigate("/transactions")}
              className="bg-blue-600 hover:bg-blue-800 text-white py-2 px-5 rounded-lg shadow transition-transform active:scale-95"
            >
              All History
            </button>

            <button
              onClick={() => setShowDeposit(true)}
              className="bg-green-400 hover:bg-green-700 text-blue-900 py-2 px-5 rounded-lg shadow transition-transform active:scale-95"
            >
              Deposit
            </button>
            {showDeposit && (
              <DepositModal
                onClose={() => setShowDeposit(false)}
                onDepositSuccess={refreshBalanceAndTx}
              />
            )}

            <button
              onClick={() => setShowWithdraw(true)}
              className="bg-red-400 hover:bg-red-600 text-blue-900 py-2 px-5 rounded-lg shadow transition-transform active:scale-95"
            >
              Withdraw
            </button>
            {showWithdraw && (
              <WithdrawModal
                onClose={() => setShowWithdraw(false)}
                onWithdrawSuccess={refreshBalanceAndTx}
              />
            )}

            <button
              onClick={() => setShowTransfer(true)}
              className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 py-2 px-5 rounded-lg shadow transition-transform active:scale-95"
            >
              Transfer
            </button>
            {showTransfer && (
              <TransferModal
                onClose={() => setShowTransfer(false)}
                onTransferSuccess={refreshBalanceAndTx}
              />
            )}
          </div>

          {/* Logout */}
          <button
            onClick={() => {
              localStorage.removeItem("jwt");
              navigate("/");
            }}
            className="block w-full mt-4 bg-red-500 hover:bg-red-700 text-white font-semibold py-2.5 rounded-xl shadow transition-transform active:scale-95"
          >
            Logout
          </button>
        </div>

        {/* Right side — Graph */}
        <div className="flex-1 bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-yellow-400 mb-4 text-center">
            Balance Trend
          </h2>
          {graphData.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={graphData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="name" stroke="#ccc" />
                <YAxis stroke="#ccc" />
                <Tooltip
                    content={({ active, payload, label }) => {
                        if (active && payload && payload.length > 0) {
                        const p = payload[0].payload;
                        return (
                            <div className="bg-gray-900 p-3 rounded-lg shadow text-white">
                            <div><b>{label}</b></div>
                            <div>Balance: <b>₹{p.balance}</b></div>
                            <div>
                                Tx: {p.type === "CREDIT" ? "+" : "-"}₹{p.amount} <span className={p.type === "CREDIT" ? "text-green-400" : "text-red-400"}>{p.type}</span>
                            </div>
                            </div>
                        );
                    }
                        return null;
                    }}
                />

                <Line
                  type="monotone"
                  dataKey="balance"
                  stroke="#00FF88"
                  strokeWidth={3}
                  dot={{ fill: "#00FF88", r: 5 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-blue-200 text-lg mt-20">
              No transaction data available for graph.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
