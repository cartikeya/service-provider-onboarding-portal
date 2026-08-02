// src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import API from "../api/axios";
import StatsOverview from "../components/admin/StatsOverview";
import {
  Search,
  Eye,
  CheckCircle,
  XCircle,
  FileText,
  ExternalLink,
  X,
} from "lucide-react";

export default function AdminDashboard() {
  const [providers, setProviders] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [rejectionRemark, setRejectionRemark] = useState("");
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

  useEffect(() => {
    fetchProviders();
  }, [search, statusFilter, page]);

  const fetchProviders = async () => {
    try {
      const res = await API.get("/admin/providers", {
        params: { search, status: statusFilter, page, limit: 8 },
      });
      if (res.data.success) {
        setProviders(res.data.data);
        setTotalPages(res.data.totalPages);
      }
    } catch (err) {
      console.error("Failed to fetch providers:", err);
    }
  };

  const handleStatusUpdate = async (id, status, remark = "") => {
    try {
      const res = await API.patch(`/admin/providers/${id}/status`, {
        status,
        rejectionRemark: remark,
      });

      if (res.data.success) {
        setIsRejectModalOpen(false);
        setRejectionRemark("");
        setSelectedProvider(null);
        fetchProviders(); // Refresh list & stats
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Admin Control Panel
            </h1>
            <p className="text-sm text-gray-500">
              Review provider applications and verify uploaded documents.
            </p>
          </div>
        </header>

        {/* Stats Cards */}
        <StatsOverview />

        {/* Search & Filter Controls */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            {["", "pending", "approved", "rejected"].map((st) => (
              <button
                key={st}
                onClick={() => {
                  setStatusFilter(st);
                  setPage(1);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition ${
                  statusFilter === st
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {st === "" ? "All Applications" : st}
              </button>
            ))}
          </div>
        </div>

        {/* Providers Table */}
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
                  <td
                    colSpan="5"
                    className="px-6 py-8 text-center text-gray-400"
                  >
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
                        <div className="font-semibold text-gray-900">
                          {p.name}
                        </div>
                        <div className="text-xs text-gray-400">{p.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {p.category?.length > 0 ? (
                        <div className="flex gap-1 flex-wrap">
                          {p.category.map((cat, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs"
                            >
                              {cat}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-xs">
                          Unspecified
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {p.experienceYears ? `${p.experienceYears} Yrs` : "N/A"}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
                          p.status === "approved"
                            ? "bg-emerald-100 text-emerald-800"
                            : p.status === "rejected"
                              ? "bg-rose-100 text-rose-800"
                              : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedProvider(p)}
                        className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
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

          {/* Pagination */}
          <div className="p-4 border-t border-gray-200 flex justify-between items-center text-xs text-gray-500">
            <span>
              Page {page} of {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-3 py-1 border rounded disabled:opacity-40"
              >
                Previous
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1 border rounded disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Detail / Document Verification Modal */}
      {selectedProvider && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => setSelectedProvider(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Application Review
            </h2>

            {/* Profile Info */}
            <div className="flex items-center gap-4 mb-6 pb-4 border-b">
              <img
                src={
                  selectedProvider.profilePhoto ||
                  "https://via.placeholder.com/60"
                }
                className="w-16 h-16 rounded-full object-cover border"
              />
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  {selectedProvider.name}
                </h3>
                <p className="text-sm text-gray-500">
                  {selectedProvider.email}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Location: {selectedProvider.location?.city || "N/A"},{" "}
                  {selectedProvider.location?.state || "N/A"}
                </p>
              </div>
            </div>

            {/* Verification Documents */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-800 mb-2">
                Uploaded Verification Documents
              </h4>
              {selectedProvider.documents?.length > 0 ? (
                <div className="space-y-2">
                  {selectedProvider.documents.map((doc, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 bg-gray-50 border rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-blue-600" />
                        <span className="text-xs font-medium text-gray-700">
                          {doc.docType}
                        </span>
                      </div>
                      <a
                        href={doc.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                      >
                        View File <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400 italic">
                  No documents uploaded yet.
                </p>
              )}
            </div>

            {/* Status Remark if Rejected */}
            {selectedProvider.status === "rejected" &&
              selectedProvider.rejectionRemark && (
                <div className="mb-6 p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800">
                  <strong>Rejection Remark:</strong>{" "}
                  {selectedProvider.rejectionRemark}
                </div>
              )}

            {/* Action Buttons */}
            <div className="flex gap-3 justify-end pt-4 border-t">
              <button
                onClick={() => setIsRejectModalOpen(true)}
                className="px-4 py-2 bg-rose-600 text-white rounded-lg text-sm font-semibold hover:bg-rose-700 flex items-center gap-1"
              >
                <XCircle className="w-4 h-4" /> Reject
              </button>
              <button
                onClick={() =>
                  handleStatusUpdate(selectedProvider._id, "approved")
                }
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 flex items-center gap-1"
              >
                <CheckCircle className="w-4 h-4" /> Approve Application
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Remark Sub-Modal */}
      {isRejectModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Provide Rejection Remark
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Please enter the reason for rejecting {selectedProvider?.name}'s
              application.
            </p>
            <textarea
              rows="3"
              value={rejectionRemark}
              onChange={(e) => setRejectionRemark(e.target.value)}
              placeholder="e.g., ID proof is blurry or invalid..."
              className="w-full p-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-rose-500 focus:outline-none mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsRejectModalOpen(false)}
                className="px-3 py-1.5 border rounded-lg text-xs font-semibold text-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  handleStatusUpdate(
                    selectedProvider._id,
                    "rejected",
                    rejectionRemark,
                  )
                }
                className="px-4 py-1.5 bg-rose-600 text-white rounded-lg text-xs font-semibold hover:bg-rose-700"
              >
                Submit Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
