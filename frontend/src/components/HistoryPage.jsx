import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { API_BASE_URL } from "../config.js";
import NavBar from "./NavBar.jsx";

function HistoryPage({ onHome, onProfile, onLogout }) {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("Loading...");
  const userId = localStorage.getItem("userId");

  // ------------------------------------
  // Validate user
  // ------------------------------------
  useEffect(() => {
    if (!userId) {
      setStatus("No user session found. Please log in again.");
      return;
    }

    const loadHistory = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/history/${userId}`);
        const list = res.data.history || [];

        setItems(list);
        setStatus(list.length === 0 ? "No past sessions found." : "");
      } catch (err) {
        setStatus(`Error: ${err.response?.data?.error || err.message}`);
      }
    };

    loadHistory();
  }, [userId]);

  return (
    <>
      <NavBar
        onHome={onHome}
        onHistory={() => {}}
        onProfile={onProfile}
        onLogout={onLogout}
      />

      <div className="mx-auto max-w-5xl px-4 py-8">
        <header className="mb-4 flex items-center gap-2">
          <span
            className="iconify text-brand"
            data-icon="lucide:history"
            data-width="22"
            data-height="22"
          ></span>
          <h2 className="text-lg font-semibold">Previous Wellness Sessions</h2>
        </header>

        <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          {status && <p className="text-sm text-gray-600">{status}</p>}

          {items.length > 0 && (
            <ul className="space-y-4">
              {items.map((item, idx) => {
                const summary = item.synthesized_guidance || "";
                const preview =
                  summary.length > 400 ? summary.slice(0, 400) + "…" : summary;

                // Format timestamp
                let timestamp = "";
                if (item.timestamp) {
                  const date = new Date(item.timestamp);
                  timestamp = date.toLocaleString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  });
                }

                return (
                  <li
                    key={idx}
                    className="pb-4 border-b border-gray-100 last:border-b-0 last:pb-0"
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className="iconify text-gray-400"
                        data-icon="lucide:message-square"
                        data-width="20"
                        data-height="20"
                      ></span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <div className="text-sm text-gray-900">
                            <span className="font-medium">Query:</span>{" "}
                            {item.query || "(no query text)"}
                          </div>
                          {timestamp && (
                            <span className="text-xs text-gray-500 ml-2 whitespace-nowrap">
                              {timestamp}
                            </span>
                          )}
                        </div>
                        {summary && (
                          <div className="mt-1 text-sm text-gray-700">
                            <ReactMarkdown>{preview}</ReactMarkdown>
                          </div>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}

export default HistoryPage;
