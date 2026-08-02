// src/components/admin/StatsOverview.jsx
import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import { Users, Clock, CheckCircle2, XCircle } from "lucide-react";

export default function StatsOverview() {
  const [stats, setStats] = useState({
    totalProviders: 0,
    pendingCount: 0,
    approvedCount: 0,
    rejectedCount: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await API.get("/admin/stats");
      if (res.data.success) {
        setStats(res.data.stats);
      }
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    }
  };

  const cards = [
    {
      title: "Total Applicants",
      count: stats.totalProviders,
      icon: Users,
      color: "text-blue-600 bg-blue-50 border-blue-200",
    },
    {
      title: "Pending Review",
      count: stats.pendingCount,
      icon: Clock,
      color: "text-amber-600 bg-amber-50 border-amber-200",
    },
    {
      title: "Approved",
      count: stats.approvedCount,
      icon: CheckCircle2,
      color: "text-emerald-600 bg-emerald-50 border-emerald-200",
    },
    {
      title: "Rejected",
      count: stats.rejectedCount,
      icon: XCircle,
      color: "text-rose-600 bg-rose-50 border-rose-200",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className={`p-4 rounded-xl border flex items-center justify-between bg-white shadow-sm`}
          >
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {card.title}
              </p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">
                {card.count}
              </h3>
            </div>
            <div className={`p-3 rounded-lg border ${card.color}`}>
              <Icon className="w-6 h-6" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
