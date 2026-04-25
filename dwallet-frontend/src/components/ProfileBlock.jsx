import React, { useEffect, useState } from "react";
import api from "../api";

export default function ProfileBlock() {
  const [user, setUser] = useState({ username: "", registered: "" });

  useEffect(() => {
    api.get("/user/me").then(res => setUser(res.data)).catch(() => {});
  }, []);

  return (
    <div className="flex items-center gap-4 bg-white/20 backdrop-blur rounded-xl shadow p-4 mb-6">
      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-yellow-400 text-blue-900 font-bold text-lg">
        {user.username ? user.username[0].toUpperCase() : "U"}
      </div>
      <div className="flex flex-col text-left">
        <span className="font-bold text-yellow-300">{user.username}</span>
        <span className="text-blue-100 text-xs">{user.registered && `Joined: ${user.registered}`}</span>
      </div>
    </div>
  );
}
