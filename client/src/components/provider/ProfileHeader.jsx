import React from "react";
import StatusBadge from "../common/StatusBadge";
import { AlertTriangle } from "lucide-react";

export default function ProfileHeader({ profile }) {
  if (!profile) return null;

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img
            src={profile.profilePhoto || "https://via.placeholder.com/60"}
            alt={profile.name}
            className="w-16 h-16 rounded-full object-cover border"
          />
          <div>
            <h1 className="text-xl font-bold text-gray-900">{profile.name}</h1>
            <p className="text-xs text-gray-500">{profile.email}</p>
          </div>
        </div>

        {/* Reusable Status Badge */}
        <div>
          <StatusBadge status={profile.status} />
        </div>
      </div>

      {/* Admin Rejection Remark Warning */}
      {profile.status === "rejected" && profile.rejectionRemark && (
        <div className="mt-4 p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
          <div>
            <strong className="font-semibold">
              Rejection Reason from Admin:
            </strong>
            <p className="mt-1">{profile.rejectionRemark}</p>
            <span className="text-[11px] text-rose-600 block mt-1">
              Please update your details or documents below and resubmit for
              re-evaluation.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
