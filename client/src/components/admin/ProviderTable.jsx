import React from "react";
import { Eye } from "lucide-react";
import StatusBadge from "../common/StatusBadge";

export default function ProviderTable({
  providers,
  onSelect,
  page,
  totalPages,
  setPage,
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <table className="w-full text-left text-sm text-gray-600">
        <thead className="bg-gray-50 border-b border-gray-200 text-xs text-gray-500 uppercase tracking-wider">
          <tr>
            <th className="px-6 py-3">Provider</th>
            <th className="px-6 py-3">Categories</th>
            <th className="px-6 py-3">Experience</th>
            <th className="px-6 py-3">Status</th>
            <th className="px-6 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {providers.length === 0 ? (
            <tr>
              <td colSpan="5" className="px-6 py-8 text-center text-gray-400">
                No provider applications found.
              </td>
            </tr>
          ) : (
            providers.map((p) => (
              <tr key={p._id} className="hover:bg-gray-50/50">
                <td className="px-6 py-4 flex items-center gap-3">
                  <img
                    src={p.profilePhoto || "https://via.placeholder.com/40"}
                    alt={p.name}
                    className="w-10 h-10 rounded-full object-cover border"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">{p.name}</div>
                    <div className="text-xs text-gray-400">{p.email}</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-1 flex-wrap">
                    {p.category?.map((cat, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs"
                      >
                        {cat}
                      </span>
                    )) || <span className="text-gray-400 text-xs">N/A</span>}
                  </div>
                </td>
                <td className="px-6 py-4">
                  {p.experienceYears ? `${p.experienceYears} Yrs` : "N/A"}
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={p.status} />
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => onSelect(p)}
                    className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    title="View Application Details"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination Footer */}
      <div className="p-4 border-t border-gray-200 flex justify-between items-center text-xs text-gray-500">
        <span>
          Page {page} of {totalPages}
        </span>
        <div className="flex gap-2">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1 border rounded-lg disabled:opacity-40 hover:bg-gray-50"
          >
            Previous
          </button>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 border rounded-lg disabled:opacity-40 hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
