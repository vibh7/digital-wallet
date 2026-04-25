import React, { useEffect, useMemo, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import ProfileBlock from "./ProfileBlock";
import DepositModal from "./DepositModal";
import WithdrawModal from "./WithdrawModal";
import TransferModal from "./TransferModal";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  const [balance, setBalance] = useState("-");
  const [transactions, setTransactions] = useState([]);
  const navigate = useNavigate();
  const [showDeposit, setShowDeposit] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [showTransfer, setShowTransfer] = useState(false);

  const refreshBalanceAndTx = () => {
    api.get("/wallet/balance").then((res) => setBalance(res.data)).catch(() => setBalance("Error"));
    api
      .get("/wallet/transactions")
      .then((res) => setTransactions(Array.isArray(res.data) ? res.data : []))
      .catch(() => setTransactions([]));
  };

  useEffect(() => {
    refreshBalanceAndTx();
  }, []);

  const recentTx = useMemo(() => {
    const sorted = [...transactions].sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );
    return sorted.slice(0, 10);
  }, [transactions]);

  const spendingData = useMemo(() => {
    if (!Array.isArray(transactions) || transactions.length === 0) return [];

    const buckets = new Map();
    for (const tx of transactions) {
      if (!tx.timestamp) continue;
      const d = new Date(tx.timestamp);
      const key = d.toISOString().slice(0, 10);
      const label = d.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
      });
      const amt = Number(tx.amount) || 0;
      if (!buckets.has(key)) {
        buckets.set(key, { key, name: label, spent: 0, received: 0 });
      }
      const bucket = buckets.get(key);
      if (tx.type === "DEBIT") bucket.spent += amt;
      else if (tx.type === "CREDIT") bucket.received += amt;
    }

    return Array.from(buckets.values())
      .sort((a, b) => a.key.localeCompare(b.key))
      .slice(-14);
  }, [transactions]);

  const totalSpent = useMemo(
    () => spendingData.reduce((sum, d) => sum + d.spent, 0),
    [spendingData]
  );
  const totalReceived = useMemo(
    () => spendingData.reduce((sum, d) => sum + d.received, 0),
    [spendingData]
  );

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white items-center py-6 px-4 sm:px-8">
      <ProfileBlock />

      <div className="w-full max-w-7xl flex flex-col lg:flex-row gap-8 mt-6">
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
                {recentTx.length > 0 ? (
                  recentTx.map((tx, i) => (
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

        <div className="flex-1 bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-yellow-400 mb-1 text-center">
            Daily Spending
          </h2>
          <p className="text-center text-blue-200 text-sm mb-4">
            Last {spendingData.length} active days
          </p>

          <div className="grid grid-cols-2 gap-4 mb-4 text-center">
            <div className="bg-red-500/20 rounded-xl p-3">
              <div className="text-xs text-red-200">Total Spent</div>
              <div className="text-xl font-bold text-red-300">₹{totalSpent.toFixed(2)}</div>
            </div>
            <div className="bg-green-500/20 rounded-xl p-3">
              <div className="text-xs text-green-200">Total Received</div>
              <div className="text-xl font-bold text-green-300">₹{totalReceived.toFixed(2)}</div>
            </div>
          </div>

          {spendingData.length > 0 ? (
            <ResponsiveContainer width="100%" height={340}>
              <BarChart data={spendingData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="name" stroke="#ccc" />
                <YAxis stroke="#ccc" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#111827",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                  formatter={(value, name) => [`₹${Number(value).toFixed(2)}`, name]}
                />
                <Legend />
                <Bar dataKey="spent" name="Spent" fill="#f87171" radius={[4, 4, 0, 0]} />
                <Bar dataKey="received" name="Received" fill="#34d399" radius={[4, 4, 0, 0]} />
              </BarChart>
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
