import React, { useState, useEffect } from "react";
import API from "../api/axios";
import ProfileHeader from "../components/provider/ProfileHeader";
import ActiveProfileCard from "../components/provider/ActiveProfileCard";
import OnboardingForm from "../components/provider/OnboardingForm";
export default function ProviderOnboarding() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await API.get("/provider/profile");
      setProfile(res.data.data);
    } catch (err) {
      console.error("Failed to load profile:", err);
      setMessage({ type: "error", text: "Failed to load provider profile." });
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (formData) => {
    setSubmitting(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await API.put("/provider/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        setMessage({
          type: "success",
          text: "Profile updated and resubmitted for verification!",
        });
        setProfile(res.data.data); // Status will automatically switch back to pending
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
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <div className="max-w-3xl mx-auto">
        <ProfileHeader profile={profile} />

        {/* Feedback Alert */}
        {message.text && (
          <div
            className={`p-4 rounded-xl mb-6 text-xs font-semibold border ${
              message.type === "success"
                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                : "bg-rose-50 text-rose-800 border-rose-200"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Display Read-Only Details when Approved, or Editable Form when Pending/Rejected */}
        {profile?.status === "approved" ? (
          <ActiveProfileCard profile={profile} />
        ) : (
          <OnboardingForm
            profile={profile}
            onSubmit={handleFormSubmit}
            submitting={submitting}
          />
        )}
      </div>
    </div>
  );
}
