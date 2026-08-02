import React, { useState, useEffect } from "react";
import { Upload, User, Briefcase, MapPin } from "lucide-react";

export default function OnboardingForm({ profile, onSubmit, submitting }) {
  const [name, setName] = useState("");
  const [categories, setCategories] = useState("");
  const [skills, setSkills] = useState("");
  const [experienceYears, setExperienceYears] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    if (profile) {
      setName(profile.name || "");
      setCategories(profile.category ? profile.category.join(", ") : "");
      setSkills(profile.skills ? profile.skills.join(", ") : "");
      setExperienceYears(profile.experienceYears || "");
      setCity(profile.location?.city || "");
      setState(profile.location?.state || "");
    }
  }, [profile]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("experienceYears", experienceYears);

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

    formData.append("location", JSON.stringify({ city, state }));

    if (profilePhoto) {
      formData.append("profilePhoto", profilePhoto);
    }

    if (documents.length > 0) {
      Array.from(documents).forEach((file) => {
        formData.append("documents", file);
      });
    }

    onSubmit(formData);
  };

  return (
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

      {/* Basic Inputs */}
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
            placeholder="Plumbing, Electrician"
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
            placeholder="Wiring, Pipe Fitting"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            className="w-full px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
          />
        </div>
      </div>

      {/* Location Inputs */}
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
              placeholder="Visakhapatnam"
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
            placeholder="AP"
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
        {submitting ? "Uploading & Submitting..." : "Submit Profile for Review"}
      </button>
    </form>
  );
}
