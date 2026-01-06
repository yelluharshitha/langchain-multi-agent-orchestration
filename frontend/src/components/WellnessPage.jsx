import React, { useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { API_BASE_URL } from "../config.js";
import YouTubeRecommendations from "./YouTubeRecommendations.jsx";
import NavBar from "./NavBar.jsx";

/*
  WellnessPage.jsx
  - Modern SaaS layout (density: comfortable)
  - Accent: emerald
  - Clean cards, subtle elevation, smooth transitions
*/

function WellnessPage({ userId, userName, onLogout }) {
  const [symptoms, setSymptoms] = useState("");
  const [report, setReport] = useState("");
  const [status, setStatus] = useState("");

  // Use the provided userName (full_name from backend), or fallback to userId
  const displayName = userName || userId;

  const [recommendations, setRecommendations] = useState([]);
  const [summary, setSummary] = useState("");

  const [followUp, setFollowUp] = useState("");
  const [followUpStatus, setFollowUpStatus] = useState("");
  const [followUpAnswer, setFollowUpAnswer] = useState("");

  const [historyItems, setHistoryItems] = useState([]);
  const [historyState, setHistoryState] = useState({ loading: false, msg: "" });
  const [showHistory, setShowHistory] = useState(false);
  const [expandedHistory, setExpandedHistory] = useState(null);

  const [showProfile, setShowProfile] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);

  const [showAgentFlow, setShowAgentFlow] = useState(false);
  const [agentLogs, setAgentLogs] = useState([]);

  // streaming state
  const [thoughts, setThoughts] = useState([]);
  const [streamAnswer, setStreamAnswer] = useState("");
  const [streamLoading, setStreamLoading] = useState(false);

  const resetOutputs = () => {
    setRecommendations([]);
    setSummary("");
    setFollowUp("");
    setFollowUpStatus("");
    setFollowUpAnswer("");
    setShowAgentFlow(false);
    setAgentLogs([]);
    setThoughts([]);
    setStreamAnswer("");
    setStreamLoading(false);
  };

  // Submit main symptoms -> backend (non-streaming)
  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!symptoms.trim()) {
      setStatus("Please enter symptoms to continue.");
      return;
    }

    setStatus("Preparing your wellness guidance…");
    resetOutputs();

    try {
      const res = await axios.post(`${API_BASE_URL}/health-assist`, {
        symptoms,
        medical_report: report,
        user_id: userId,
      });

      const data = res.data || {};
      console.log("API Response:", data);
      console.log("Agent Flow:", data.agent_flow);
      setRecommendations(data.recommendations || []);
      setAgentLogs(data.agent_flow || []);

      // Auto-show agent flow if we have logs
      if (data.agent_flow && data.agent_flow.length > 0) {
        setShowAgentFlow(true);
      }

      let guidance = data.synthesized_guidance || data.final_summary || "";
      try {
        if (typeof guidance === "string" && guidance.trim().startsWith("{")) {
          guidance = JSON.parse(guidance)?.synthesized_guidance || guidance;
        }
      } catch {
        /* keep guidance as-is on parse error */
      }

      setSummary(guidance || "");
      setStatus("");
    } catch (err) {
      setStatus(
        err.response?.data?.error || "Something went wrong. Please try again."
      );
    }
  };

  // Streaming submit -> /chat_stream
  const handleStreamSubmit = async (e) => {
    e?.preventDefault();
    if (!symptoms.trim()) {
      setStatus("Please enter symptoms to continue.");
      return;
    }

    setStatus("Streaming agent collaboration…");
    setRecommendations([]);
    setSummary(""); // wellness plan will grow as we stream
    setShowAgentFlow(false);
    setAgentLogs([]);
    setThoughts([]);
    setStreamAnswer("");
    setStreamLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/chat_stream`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          symptoms,
          medical_report: report,
        }),
      });

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n\n");

        lines.forEach((line) => {
          if (!line.startsWith("data: ")) return;
          try {
            const jsonStr = line.replace("data: ", "");
            const evt = JSON.parse(jsonStr);

            if (evt.type === "thought") {
              setThoughts((prev) => [...prev, evt.content]);
            } else if (evt.type === "answer") {
              // append streaming markdown
              setStreamAnswer((prev) => prev + evt.content);
              // mirror into summary so the wellness card updates live
              setSummary((prev) => prev + evt.content);
            }
          } catch (err) {
            console.error("Stream parse error", err);
          }
        });
      }
      setStatus("");
    } catch (err) {
      setStatus(`Error while streaming: ${err.message}`);
    } finally {
      setStreamLoading(false);
    }
  };

  // Follow-up question handler
  const handleFollowUp = async (e) => {
    e?.preventDefault();
    if (!followUp.trim()) return;

    setFollowUpStatus("Thinking…");
    try {
      const res = await axios.post(`${API_BASE_URL}/follow-up`, {
        user_id: userId,
        question: followUp,
      });
      setFollowUpAnswer(res.data?.answer || "");
      setFollowUpStatus("");
    } catch (err) {
      setFollowUpStatus(
        err.response?.data?.error || "Failed to fetch follow-up answer."
      );
    }
  };

  // Load profile (+ history for health report)
  const handleLoadProfile = async () => {
    setShowProfile(true);
    setShowHistory(false);
    setProfileLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/profile/${userId}`);
      setProfileData(res.data.profile || {});

      // Also load history for health report
      const histRes = await axios.get(`${API_BASE_URL}/history/${userId}`);
      const list = histRes.data?.history || [];
      setHistoryItems([...list].reverse());
    } catch (err) {
      console.error("Failed to load profile");
    } finally {
      setProfileLoading(false);
    }
  };

  // Load history (for the dedicated history panel)
  const handleLoadHistory = async () => {
    setShowHistory(true);
    setShowProfile(false);
    setHistoryState({ loading: true, msg: "" });
    try {
      const res = await axios.get(`${API_BASE_URL}/history/${userId}`);
      const list = res.data?.history || [];
      setHistoryItems([...list].reverse());
      setHistoryState({
        loading: false,
        msg: list.length === 0 ? "No previous sessions found." : "",
      });
    } catch (err) {
      setHistoryState({
        loading: false,
        msg: err.response?.data?.error || "Failed to load history.",
      });
    }
  };

  // small helper: trimmed excerpt (currently unused but kept)
  const excerpt = (s, n = 140) =>
    s ? (s.length > n ? s.slice(0, n) + "…" : s) : "";

  return (
    <>
      <NavBar
        onHome={() => {
          setShowHistory(false);
          setShowProfile(false);
        }}
        onHistory={handleLoadHistory}
        onProfile={handleLoadProfile}
        onLogout={onLogout}
      />

      <main className="min-h-screen bg-gray-50 py-4 sm:py-8">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 space-y-6 sm:space-y-8">
          {/* Optional profile panel - Metrics */}
          {showProfile && (
            <section className="bg-white border border-gray-100 rounded-lg sm:rounded-2xl shadow-sm p-4 sm:p-6 transition">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 mb-4 sm:mb-6">
                <div className="flex items-center gap-2 sm:gap-3 flex-1">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white flex-shrink-0">
                    <svg
                      className="w-4 h-4 sm:w-6 sm:h-6"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-gray-500">Welcome,</p>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                      {displayName}
                    </h3>
                  </div>
                </div>
                <button
                  className="text-xs sm:text-sm text-gray-600 hover:text-gray-900 whitespace-nowrap flex-shrink-0"
                  onClick={() => setShowProfile(false)}
                >
                  Close
                </button>
              </div>

              {profileLoading ? (
                <p className="text-sm text-gray-500">Loading profile…</p>
              ) : profileData ? (
                <div className="space-y-3 sm:space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
                    <div className="p-3 sm:p-4 rounded-lg sm:rounded-xl border border-gray-100 bg-gray-50">
                      <p className="text-xs text-gray-500 uppercase mb-1">
                        Height
                      </p>
                      <p className="text-sm sm:text-lg font-semibold text-gray-900">
                        {profileData.height_cm
                          ? `${profileData.height_cm} cm`
                          : "Not set"}
                      </p>
                    </div>
                    <div className="p-3 sm:p-4 rounded-lg sm:rounded-xl border border-gray-100 bg-gray-50">
                      <p className="text-xs text-gray-500 uppercase mb-1">
                        Weight
                      </p>
                      <p className="text-sm sm:text-lg font-semibold text-gray-900">
                        {profileData.weight_kg
                          ? `${profileData.weight_kg} kg`
                          : "Not set"}
                      </p>
                    </div>
                    <div className="p-3 sm:p-4 rounded-lg sm:rounded-xl border border-gray-100 bg-gray-50">
                      <p className="text-xs text-gray-500 uppercase mb-1">
                        BMI
                      </p>
                      <p className="text-sm sm:text-lg font-semibold text-gray-900">
                        {profileData.height_cm && profileData.weight_kg
                          ? (
                              profileData.weight_kg /
                              ((profileData.height_cm / 100) *
                                (profileData.height_cm / 100))
                            ).toFixed(1)
                          : "—"}
                      </p>
                    </div>
                  </div>

                  {profileData.medications && (
                    <div>
                      <p className="text-xs sm:text-sm font-semibold text-gray-900 mb-2">
                        Medications & Supplements
                      </p>
                      <p className="text-xs sm:text-sm text-gray-700 p-3 rounded-lg bg-gray-50 border border-gray-100">
                        {profileData.medications}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No profile data found.</p>
              )}
            </section>
          )}

          {/* Health Report - Summary of all chats (shown in profile) */}
          {showProfile && (
            <section className="bg-white border border-gray-100 rounded-lg sm:rounded-2xl shadow-sm p-4 sm:p-6 transition">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 mb-4 sm:mb-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path
                      fillRule="evenodd"
                      d="M4 5a2 2 0 012-2 1 1 0 000-2H6a4 4 0 00-4 4v10a4 4 0 004 4h8a4 4 0 004-4V7a1 1 0 100-2 2 2 0 00-2-2h-2.5a1 1 0 00-.82.38l-1.43 1.43A1 1 0 008 5H4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Health Report
                </h3>
                <button
                  className="text-xs sm:text-sm text-gray-600 hover:text-gray-900 whitespace-nowrap flex-shrink-0"
                  onClick={() => setShowProfile(false)}
                >
                  Close
                </button>
              </div>

              {profileLoading ? (
                <p className="text-xs sm:text-sm text-gray-500">
                  Loading report…
                </p>
              ) : historyItems.length > 0 ? (
                <div className="space-y-3 sm:space-y-4">
                  {/* Summary Stats */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
                    <div className="p-3 sm:p-4 rounded-lg sm:rounded-xl border border-gray-100 bg-gradient-to-br from-emerald-50 to-white">
                      <p className="text-xs text-gray-500 uppercase mb-1">
                        Total Sessions
                      </p>
                      <p className="text-xl sm:text-2xl font-bold text-emerald-600">
                        {historyItems.length}
                      </p>
                    </div>
                    <div className="p-3 sm:p-4 rounded-lg sm:rounded-xl border border-gray-100 bg-gradient-to-br from-blue-50 to-white">
                      <p className="text-xs text-gray-500 uppercase mb-1">
                        Health Topics
                      </p>
                      <p className="text-xl sm:text-2xl font-bold text-blue-600">
                        {
                          new Set(
                            historyItems.map((h) => h.query?.split(" ")[0])
                          ).size
                        }
                      </p>
                    </div>
                    <div className="p-3 sm:p-4 rounded-lg sm:rounded-xl border border-gray-100 bg-gradient-to-br from-purple-50 to-white">
                      <p className="text-xs text-gray-500 uppercase mb-1">
                        Last Session
                      </p>
                      <p className="text-xs sm:text-sm font-semibold text-purple-600 truncate">
                        {historyItems[0]?.query || "N/A"}
                      </p>
                    </div>
                  </div>

                  {/* All Health Queries Summary */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <svg
                        className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                        <path
                          fillRule="evenodd"
                          d="M4 5a2 2 0 012-2 1 1 0 000-2H6a4 4 0 00-4 4v10a4 4 0 004 4h8a4 4 0 004-4V7a1 1 0 100-2 2 2 0 00-2-2h-2.5a1 1 0 00-.82.38l-1.43 1.43A1 1 0 008 5H4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <p className="text-xs sm:text-sm font-bold text-gray-900">
                        Your Health Concerns & Queries
                      </p>
                    </div>
                    <div className="space-y-2 sm:space-y-3">
                      {historyItems.map((item, idx) => (
                        <div
                          key={idx}
                          className="p-3 sm:p-4 rounded-lg sm:rounded-xl bg-gradient-to-br from-white to-gray-50 border border-gray-100 hover:border-emerald-300 hover:shadow-md transition-all"
                        >
                          <div className="flex items-start gap-2 sm:gap-3">
                            <div className="flex-shrink-0 h-6 w-6 sm:h-8 sm:w-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                              <span className="text-xs font-bold text-emerald-600">
                                {idx + 1}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs sm:text-sm font-semibold text-gray-900 mb-1 break-words">
                                {item.query}
                              </p>
                              {item.recommendations &&
                                item.recommendations.length > 0 && (
                                  <div className="flex flex-wrap items-center gap-2">
                                    <span className="inline-block px-2 py-1 rounded-full bg-emerald-100 text-xs font-medium text-emerald-700 whitespace-nowrap">
                                      {item.recommendations.length}{" "}
                                      {item.recommendations.length === 1
                                        ? "recommendation"
                                        : "recommendations"}
                                    </span>
                                  </div>
                                )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Key Recommendations */}
                  <div>
                    <p className="text-sm font-bold text-gray-900 mb-3">
                      Key Recommendations Across Sessions
                    </p>
                    <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-100">
                      <ul className="list-disc ml-5 space-y-1 text-sm text-gray-700">
                        <li>
                          Maintain consistent health monitoring across different
                          concerns
                        </li>
                        <li>
                          Follow personalized recommendations for each specific
                          query
                        </li>
                        <li>Track changes and improvements over time</li>
                        <li>
                          Consult healthcare professionals for persistent
                          symptoms
                        </li>
                        <li>Use this report to discuss with your doctor</li>
                      </ul>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  No sessions yet. Start by asking a wellness question.
                </p>
              )}
            </section>
          )}

          {/* Optional history panel - Hidden when profile shown */}
          {showHistory && !showProfile && (
            <section className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 transition">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Previous sessions
                </h3>
                <button
                  className="text-sm text-gray-600 hover:text-gray-900"
                  onClick={() => setShowHistory(false)}
                >
                  Close
                </button>
              </div>

              {historyState.loading ? (
                <p className="text-sm text-gray-500">Loading…</p>
              ) : historyState.msg ? (
                <p className="text-sm text-gray-500">{historyState.msg}</p>
              ) : (
                <div className="space-y-3">
                  {historyItems.map((it, idx) => (
                    <div
                      key={idx}
                      className="border border-gray-200 rounded-xl overflow-hidden transition-all"
                    >
                      {/* History item header - clickable */}
                      <button
                        onClick={() =>
                          setExpandedHistory(
                            expandedHistory === idx ? null : idx
                          )
                        }
                        className="w-full p-4 bg-gray-50 hover:bg-gray-100 transition text-left flex items-start justify-between gap-3"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-500 uppercase mb-1">
                            Query
                          </p>
                          <p className="font-medium text-gray-900">
                            {it.query}
                          </p>
                        </div>
                        <svg
                          className={`w-5 h-5 text-gray-500 transition-transform flex-shrink-0 mt-1 ${
                            expandedHistory === idx ? "rotate-180" : ""
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>

                      {/* Expanded content */}
                      {expandedHistory === idx && (
                        <div className="p-6 bg-white space-y-5 border-t border-gray-200">
                          {/* Recommendations */}
                          {it.recommendations &&
                            it.recommendations.length > 0 && (
                              <div>
                                <h4 className="text-sm font-bold text-gray-900 mb-3">
                                  Recommendations
                                </h4>
                                <ul className="list-disc ml-5 text-gray-800 space-y-2">
                                  {it.recommendations.map((rec, i) => (
                                    <li key={i} className="text-sm">
                                      {rec}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                          {/* Synthesized Guidance */}
                          {it.synthesized_guidance && (
                            <div className="prose prose-sm max-w-none text-gray-800">
                              <ReactMarkdown>
                                {it.synthesized_guidance}
                              </ReactMarkdown>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* Two-column layout - Hidden when profile or history shown */}
          {!showProfile && !showHistory && (
            <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
              {/* Left: Input */}
              <section className="bg-white border border-gray-100 rounded-lg sm:rounded-2xl shadow-sm p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 mb-4 sm:mb-6">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                    Share symptoms
                  </h2>
                  <span className="text-xs text-gray-500">
                    Private & secure
                  </span>
                </div>

                <form className="space-y-3 sm:space-y-4">
                  <div>
                    <label className="text-xs sm:text-sm font-medium text-gray-700">
                      Symptoms
                    </label>
                    <textarea
                      rows={3}
                      value={symptoms}
                      onChange={(e) => setSymptoms(e.target.value)}
                      placeholder="Describe what you feel, how long, and what makes it better/worse."
                      className="mt-2 w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition text-xs sm:text-sm text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="text-xs sm:text-sm font-medium text-gray-700">
                      Medical report (optional)
                    </label>
                    <textarea
                      rows={3}
                      value={report}
                      onChange={(e) => setReport(e.target.value)}
                      placeholder="Paste lab values, doctor's notes, or other context."
                      className="mt-2 w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition text-xs sm:text-sm text-gray-900"
                    />
                  </div>

                  {status && (
                    <p className="inline-flex items-center gap-2 text-xs sm:text-sm text-gray-600 bg-gray-50 border border-gray-100 rounded-lg px-3 py-2">
                      {status}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handleSubmit}
                      className="flex-1 sm:flex-none px-4 sm:px-5 py-2 rounded-lg sm:rounded-xl bg-emerald-600 text-white text-xs sm:text-sm font-medium hover:bg-emerald-700 transition shadow-sm"
                    >
                      Generate guidance
                    </button>
                    <button
                      type="button"
                      onClick={handleStreamSubmit}
                      disabled={streamLoading}
                      className="flex-1 sm:flex-none px-4 sm:px-5 py-2 rounded-lg sm:rounded-xl bg-white border border-gray-200 text-xs sm:text-sm font-medium text-gray-800 hover:bg-gray-50 transition"
                    >
                      {streamLoading ? "Streaming..." : "Stream with agents"}
                    </button>
                  </div>
                </form>
              </section>

              {/* Right: Results, streaming & agent flow */}
              <section className="space-y-4">
                {/* Agent Communication (Live) */}
                {(thoughts.length > 0 || streamLoading) && (
                  <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">
                      Agent Communication (Live)
                    </h4>
                    <div className="text-xs sm:text-sm text-gray-700 max-h-40 overflow-y-auto space-y-1">
                      {thoughts.map((t, idx) => (
                        <div key={idx}>
                          <strong>Step {idx + 1}:</strong> {t}
                        </div>
                      ))}
                      {streamLoading && (
                        <div className="text-gray-500">
                          Agents collaborating…
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Optional raw streaming text */}
                {streamAnswer && (
                  <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">
                      Streaming wellness plan
                    </h4>
                    <div className="prose prose-sm max-w-none text-gray-800">
                      <ReactMarkdown>{streamAnswer}</ReactMarkdown>
                    </div>
                  </div>
                )}

                {/* Agent flow toggle */}
                <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4">
                  <button
                    onClick={() => setShowAgentFlow((v) => !v)}
                    className="w-full flex items-center justify-between gap-3 text-left"
                  >
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        Agent collaboration
                      </p>
                      <p className="text-xs text-gray-500">
                        See how the system arrived at the plan
                      </p>
                    </div>
                    <div className="text-sm text-gray-500">
                      {showAgentFlow ? "Hide" : "Show"}
                    </div>
                  </button>

                  {showAgentFlow && (
                    <div className="mt-4 relative">
                      {agentLogs.length === 0 ? (
                        <p className="text-sm text-gray-500">
                          Generate a plan to see agent collaboration
                        </p>
                      ) : (
                        <div className="relative">
                          {/* Vertical connecting line */}
                          <div className="absolute left-3 top-8 bottom-8 w-0.5 bg-emerald-200" />

                          {agentLogs.map((log, i) => (
                            <div
                              key={i}
                              className="relative mb-6 last:mb-0"
                            >
                              {/* Agent circle and header */}
                              <div className="flex items-start gap-3">
                                <div className="relative z-10 h-6 w-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                                  {i + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-sm font-bold text-gray-900 mb-3">
                                    {log.agent}
                                  </h4>

                                  {/* Agent output with subheading bullets */}
                                  {log.output && (
                                    <div className="text-sm text-gray-700 space-y-3">
                                      {log.output
                                        .split("\n")
                                        .map((line, idx) => {
                                          const isHeading =
                                            line.trim().startsWith("**") &&
                                            line.trim().endsWith("**");

                                          if (isHeading) {
                                            const headingText = line
                                              .trim()
                                              .replace(/\*\*/g, "");
                                            return (
                                              <div
                                                key={idx}
                                                className="flex items-start gap-2 mt-4"
                                              >
                                                <div className="h-2 w-2 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                                                <p className="font-semibold text-gray-900">
                                                  {headingText}
                                                </p>
                                              </div>
                                            );
                                          }

                                          if (line.trim()) {
                                            return (
                                              <p
                                                key={idx}
                                                className="ml-4"
                                              >
                                                {line}
                                              </p>
                                            );
                                          }

                                          return (
                                            <div
                                              key={idx}
                                              className="h-2"
                                            />
                                          );
                                        })}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Results card */}
                <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Your wellness plan
                    </h3>
                    <span className="text-xs inline-flex items-center px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 font-medium">
                      Ready
                    </span>
                  </div>

                  {recommendations.length > 0 ? (
                    <div className="space-y-3 mb-6">
                      <p className="text-sm font-semibold text-gray-900 mb-4">
                        Key Recommendations:
                      </p>
                      <div className="space-y-2">
                        {recommendations.map((r, idx) => (
                          <div
                            key={idx}
                            className="flex gap-3 items-start"
                          >
                            <div className="flex-shrink-0 w-2 h-2 rounded-full bg-emerald-500 mt-2" />
                            <p className="text-sm text-gray-700">{r}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 mb-3">
                      No recommendations yet — submit symptoms or stream to
                      generate a plan.
                    </p>
                  )}

                  {summary && (
                    <div className="prose prose-sm max-w-none text-gray-800 prose-h1:text-lg prose-h2:text-base prose-h3:text-sm prose-p:text-sm prose-ul:text-sm prose-li:text-sm">
                      <ReactMarkdown>{summary}</ReactMarkdown>
                    </div>
                  )}
                </div>
              </section>
            </div>
          )}

          {/* YouTube recommendations */}
          {summary && (
            <section className="bg-white border border-gray-100 rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 mb-3 sm:mb-4">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                  Curated videos
                </h3>
                <span className="text-xs sm:text-sm text-gray-500">
                  Helpful content matched to your plan
                </span>
              </div>
              <YouTubeRecommendations symptom={symptoms} />
            </section>
          )}

          {/* Follow-up */}
          {(summary || recommendations.length > 0) && (
            <section className="bg-white border border-gray-100 rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                  Ask a follow-up
                </h3>
                <span className="text-[11px] sm:text-xs inline-flex items-center px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 font-medium">
                  Quick
                </span>
              </div>

              <form onSubmit={handleFollowUp} className="space-y-3">
                <textarea
                  rows={3}
                  value={followUp}
                  onChange={(e) => setFollowUp(e.target.value)}
                  placeholder="Example: Can I exercise tomorrow?"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900"
                />
                {followUpStatus && (
                  <p className="text-sm text-gray-600">{followUpStatus}</p>
                )}
                <div className="flex items-center gap-3">
                  <button className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition">
                    Ask
                  </button>
                  <p className="text-sm text-gray-500">
                    Short, focused follow-ups return quick replies.
                  </p>
                </div>
              </form>

              {followUpAnswer && (
                <div className="mt-4 prose prose-sm text-gray-800">
                  <ReactMarkdown>{followUpAnswer}</ReactMarkdown>
                </div>
              )}
            </section>
          )}
        </div>
      </main>
    </>
  );
}

export default WellnessPage;
