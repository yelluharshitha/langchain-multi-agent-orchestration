// src/config.js
// API base URL from environment variable (.env file)
const baseUrl = import.meta.env.VITE_API_BASE_URL;

if (!baseUrl) {
  console.warn("VITE_API_BASE_URL is not set in .env file");
}

console.log("API Base URL:", baseUrl);

export const API_BASE_URL = baseUrl;
