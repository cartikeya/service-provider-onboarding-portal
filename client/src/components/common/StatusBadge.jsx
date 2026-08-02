import React from "react";
import { CheckCircle2, Clock, XCircle } from "lucide-react";

export default function StatusBadge({ status }) {
  const styles = {
    approved: "bg-emerald-100 text-emerald-800 border-emerald-200",
    rejected: "bg-rose-100 text-rose-800 border-rose-200",
    pending: "bg-amber-100 text-amber-800 border-amber-200",
  };

  const icons = {
    approved: <CheckCircle2 className="w-3.5 h-3.5" />,
    rejected: <XCircle className="w-3.5 h-3.5" />,
    pending: <Clock className="w-3.5 h-3.5" />,
  };

  return (
    <span
      className={`px-2.5 py-1 rounded-full text-xs font-bold border capitalize inline-flex items-center gap-1.5 ${
        styles[status] || styles.pending
      }`}
    >
      {icons[status] || icons.pending}
      {status || "Pending"}
    </span>
  );
}
