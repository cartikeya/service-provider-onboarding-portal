import React, { useState, useEffect } from "react";
import API from "../api/axios";
import {
  Upload,
  CheckCircle2,
  Clock,
  XCircle,
  FileText,
  User,
  MapPin,
  Briefcase,
  AlertTriangle,
} from "lucide-react";

export default function ProviderOnboarding() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [profile, setProfile] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Form states
  const [name, setName] = useState("");
  const [categories, setCategories] = useState("");
  const [skills, setSkills] = useState("");
  const [experienceYears, setExperienceYears] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");

  // File states
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await API.get("/provider/profile");
      const user = res.data.data;
      setProfile(user);

      // Populate form fields
      setName(user.name || "");
      setCategories(user.category ? user.category.join(", ") : "");
      setSkills(user.skills ? user.skills.join(", ") : "");
      setExperienceYears(user.experienceYears || "");
      setCity(user.location?.city || "");
      setState(user.location?.state || "");
    } catch (err) {
      console.error("Failed to load profile:", err);
      setMessage({ type: "error", text: "Failed to load provider profile." });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage({ type: "", text: "" });

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("experienceYears", experienceYears);

      // Convert comma-separated strings to arrays
      const catArray = categories
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const skillArray = skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      catArray.forEach((cat) => formData.append("category", cat));
      skillArray.forEach((sk) => formData.append("skills", sk));

      // Append Location JSON
      formData.append("location", JSON.stringify({ city, state }));

      // Append files
      if (profilePhoto) {
        formData.append("profilePhoto", profilePhoto);
      }

      if (documents.length > 0) {
        Array.from(documents).forEach((file) => {
          formData.append("documents", file);
        });
      }

      const res = await API.put("/provider/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        setMessage({
          type: "success",
          text: "Profile updated and submitted for verification!",
        });
        setProfile(res.data.data);
      }
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to update profile",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-sm font-semibold text-gray-500">
        Loading profile data...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <div className="max-w-3xl mx-auto">
        {/* Status Header Banner */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img
                src={profile?.profilePhoto || "https://via.placeholder.com/60"}
                alt="Profile"
                className="w-16 h-16 rounded-full object-cover border"
              />
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {profile?.name}
                </h1>
                <p className="text-xs text-gray-500">{profile?.email}</p>
              </div>
            </div>

            {/* Status Badge */}
            <div>
              {profile?.status === "approved" && (
                <span className="px-3 py-1.5 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Verified & Approved
                </span>
              )}
              {profile?.status === "pending" && (
                <span className="px-3 py-1.5 bg-amber-100 text-amber-800 rounded-full text-xs font-bold flex items-center gap-1.5">
                  <Clock className="w-4 h-4" /> Pending Approval
                </span>
              )}
              {profile?.status === "rejected" && (
                <span className="px-3 py-1.5 bg-rose-100 text-rose-800 rounded-full text-xs font-bold flex items-center gap-1.5">
                  <XCircle className="w-4 h-4" /> Application Rejected
                </span>
              )}
            </div>
          </div>

          {/* Rejection Remark Warning */}
          {profile?.status === "rejected" && profile?.rejectionRemark && (
            <div className="mt-4 p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <div>
                <strong className="font-semibold">
                  Rejection Reason from Admin:
                </strong>
                <p className="mt-1">{profile.rejectionRemark}</p>
                <span className="text-[11px] text-rose-600 block mt-1">
                  Please update the details or documents below and resubmit.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Success / Error Message Banner */}
        {message.text && (
          <div
            className={`p-4 rounded-xl mb-6 text-xs font-semibold ${
              message.type === "success"
                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                : "bg-rose-50 text-rose-800 border border-rose-200"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* If Already Approved - Display Clean Profile Overview */}
        {profile?.status === "approved" ? (
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
                  {profile?.category?.join(", ") || "N/A"}
                </p>
              </div>
              <div>
                <span className="text-xs text-gray-400 block uppercase">
                  Experience
                </span>
                <p className="font-semibold text-gray-800">
                  {profile?.experienceYears} Years
                </p>
              </div>
              <div>
                <span className="text-xs text-gray-400 block uppercase">
                  Location
                </span>
                <p className="font-semibold text-gray-800">
                  {profile?.location?.city}, {profile?.location?.state}
                </p>
              </div>
              <div>
                <span className="text-xs text-gray-400 block uppercase">
                  Skills
                </span>
                <p className="font-semibold text-gray-800">
                  {profile?.skills?.join(", ") || "N/A"}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t">
              <span className="text-xs text-gray-400 block uppercase mb-2">
                Verified Documents
              </span>
              <div className="space-y-2">
                {profile?.documents?.map((doc, idx) => (
                  <a
                    key={idx}
                    href={doc.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 p-3 bg-gray-50 border rounded-xl text-xs text-blue-600 hover:underline"
                  >
                    <FileText className="w-4 h-4" /> {doc.docType}
                  </a>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Form for Initial Application or Resubmission */
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-6"
          >
            <h2 className="text-lg font-bold text-gray-900 border-b pb-3">
              Provider Verification Form
            </h2>

            {/* Profile Photo Upload */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-2">
                Profile Photo
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setProfilePhoto(e.target.files[0])}
                className="block w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>

            {/* Basic Info Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                  Experience (Years)
                </label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="number"
                    required
                    min="0"
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Categories & Skills */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                  Categories (Comma separated)
                </label>
                <input
                  type="text"
                  placeholder="Plumbing, Electrician, Cleaning"
                  value={categories}
                  onChange={(e) => setCategories(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                  Skills (Comma separated)
                </label>
                <input
                  type="text"
                  placeholder="Wiring, Pipe Installation, Repair"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>
            </div>

            {/* Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                  City
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="New York"
                    className="w-full pl-9 pr-4 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                  State
                </label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="NY"
                  className="w-full px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>
            </div>

            {/* PDF Documents Upload */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-2">
                Verification Documents (PDFs / ID Proof)
              </label>
              <input
                type="file"
                multiple
                accept="application/pdf,image/*"
                onChange={(e) => setDocuments(e.target.files)}
                className="block w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Upload className="w-4 h-4" />
              {submitting
                ? "Uploading & Submitting..."
                : "Submit Profile for Review"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
