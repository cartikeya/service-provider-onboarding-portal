import React from "react";
import Modal from "../common/Modal";
import { FileText, ExternalLink, CheckCircle, XCircle } from "lucide-react";

export default function ProviderDetailModal({
  provider,
  onClose,
  onApprove,
  onRejectClick,
}) {
  if (!provider) return null;

  return (
    <Modal isOpen={!!provider} onClose={onClose} title="Application Review">
      {/* Profile Header */}
      <div className="flex items-center gap-4 mb-6 pb-4 border-b">
        <img
          src={provider.profilePhoto || "https://via.placeholder.com/60"}
          className="w-16 h-16 rounded-full object-cover border"
          alt={provider.name}
        />
        <div>
          <h3 className="text-lg font-bold text-gray-900">{provider.name}</h3>
          <p className="text-sm text-gray-500">{provider.email}</p>
          <p className="text-xs text-gray-400 mt-1">
            Location: {provider.location?.city || "N/A"},{" "}
            {provider.location?.state || "N/A"}
          </p>
        </div>
      </div>

      {/* Verification Documents */}
      <div className="mb-6">
        <h4 className="text-xs font-bold text-gray-700 uppercase mb-3">
          Uploaded Verification Documents
        </h4>
        {provider.documents?.length > 0 ? (
          <div className="space-y-2">
            {provider.documents.map((doc, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 bg-gray-50 border rounded-xl"
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
                  className="text-xs text-blue-600 hover:underline flex items-center gap-1 font-semibold"
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

      {/* Rejection Remark display if previously rejected */}
      {provider.status === "rejected" && provider.rejectionRemark && (
        <div className="mb-6 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800">
          <strong>Rejection Remark:</strong> {provider.rejectionRemark}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 justify-end pt-4 border-t">
        <button
          onClick={onRejectClick}
          className="px-4 py-2 bg-rose-600 text-white rounded-xl text-sm font-semibold hover:bg-rose-700 flex items-center gap-1.5 transition"
        >
          <XCircle className="w-4 h-4" /> Reject
        </button>
        <button
          onClick={() => onApprove(provider._id)}
          className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 flex items-center gap-1.5 transition"
        >
          <CheckCircle className="w-4 h-4" /> Approve Application
        </button>
      </div>
    </Modal>
  );
}
