import React from "react";
import { FileText } from "lucide-react";

export default function ActiveProfileCard({ profile }) {
  if (!profile) return null;

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
      <h2 className="text-lg font-bold text-gray-900 border-b pb-3">
        Active Provider Details
      </h2>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-xs text-gray-400 block uppercase">
            Categories
          </span>
          <p className="font-semibold text-gray-800">
            {profile.category?.join(", ") || "N/A"}
          </p>
        </div>
        <div>
          <span className="text-xs text-gray-400 block uppercase">
            Experience
          </span>
          <p className="font-semibold text-gray-800">
            {profile.experienceYears} Years
          </p>
        </div>
        <div>
          <span className="text-xs text-gray-400 block uppercase">
            Location
          </span>
          <p className="font-semibold text-gray-800">
            {profile.location?.city || "N/A"},{" "}
            {profile.location?.state || "N/A"}
          </p>
        </div>
        <div>
          <span className="text-xs text-gray-400 block uppercase">Skills</span>
          <p className="font-semibold text-gray-800">
            {profile.skills?.join(", ") || "N/A"}
          </p>
        </div>
      </div>

      <div className="pt-4 border-t">
        <span className="text-xs text-gray-400 block uppercase mb-2">
          Verified Documents
        </span>
        {profile.documents?.length > 0 ? (
          <div className="space-y-2">
            {profile.documents.map((doc, idx) => (
              <a
                key={idx}
                href={doc.fileUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 p-3 bg-gray-50 border rounded-xl text-xs text-blue-600 hover:underline font-medium"
              >
                <FileText className="w-4 h-4" /> {doc.docType}
              </a>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-400 italic">No documents on file.</p>
        )}
      </div>
    </div>
  );
}
