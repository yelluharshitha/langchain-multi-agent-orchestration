import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config.js";

function ProfilePage({ userId, onProfileSaved }) {
  const fullName = localStorage.getItem("full_name") || userId;

  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [meds, setMeds] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/profile/${userId}`);
        const p = res.data.profile || {};

        setHeight(p.height_cm ? String(p.height_cm) : "");
        setWeight(p.weight_kg ? String(p.weight_kg) : "");
        setMeds(p.medications || "");
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [userId]);

  const validate = () => {
    if (height && (Number(height) <= 0 || Number(height) > 300))
      return "Enter a valid height.";
    if (weight && (Number(weight) <= 0 || Number(weight) > 500))
      return "Enter a valid weight.";
    return "";
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const msg = validate();
    if (msg) {
      setStatus(msg);
      return;
    }

    setSaving(true);
    setStatus("Saving...");

    try {
      await axios.post(`${API_BASE_URL}/profile/${userId}`, {
        height_cm: height ? Number(height) : null,
        weight_kg: weight ? Number(weight) : null,
        medications: meds.trim(),
      });

      setStatus("Profile saved.");
      onProfileSaved();
    } catch (err) {
      setStatus(err.response?.data?.error || "Unable to save profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-blue-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
          <p className="text-gray-600 mt-4">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-md border border-gray-200 shadow-xl rounded-2xl p-8">
          {/* Logo and Header */}
          <div className="flex flex-col items-center mb-6">
            <img
              src="/head-logo.png"
              alt="Arogya"
              className="h-16 w-16 object-contain mb-3"
            />
            <h2 className="text-xl font-bold text-gray-900">
              Welcome, {fullName}
            </h2>
            <p className="text-gray-600 mt-2 text-sm text-center">
              Provide basic info so we can personalize your wellness support.
            </p>
          </div>

          <form onSubmit={handleSave} className="space-y-5">
            <div>
              <label className="text-sm text-gray-700 font-medium block mb-2">
                Height (cm)
              </label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="165"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5
                bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
              />
            </div>

            <div>
              <label className="text-sm text-gray-700 font-medium block mb-2">
                Weight (kg)
              </label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="64"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5
                bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
              />
            </div>

            <div>
              <label className="text-sm text-gray-700 font-medium block mb-2">
                Medications
              </label>
              <textarea
                rows={3}
                value={meds}
                onChange={(e) => setMeds(e.target.value)}
                placeholder="Any medications you take..."
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5
                bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition resize-none"
              />
            </div>

            {status && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm px-4 py-2.5 rounded-lg">
                {status}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-emerald-600 text-white py-2.5 rounded-lg font-semibold
              hover:bg-emerald-700 transition shadow-lg hover:shadow-xl disabled:opacity-50 
              disabled:cursor-not-allowed"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save & Continue"}
            </button>
          </form>
        </div>

        {/* Tagline */}
        <p className="text-xs text-gray-500 text-center mt-6">
          Powered by a multi-agent AI system for personalized wellness insights.
        </p>
      </div>
    </div>
  );
}

export default ProfilePage;
