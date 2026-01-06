import React, { useState } from "react";

/*
  NavBar.jsx
  - Responsive SaaS header with mobile hamburger menu
  - Emerald accent
*/

function NavBar({ onHome, onHistory, onProfile, onLogout }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const handleHome = () => {
    onHome();
    closeMobileMenu();
  };

  const handleHistory = () => {
    onHistory();
    closeMobileMenu();
  };

  const handleProfile = () => {
    onProfile();
    closeMobileMenu();
  };

  const handleLogout = () => {
    onLogout();
    closeMobileMenu();
  };

  return (
    <nav className="w-full bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <img
            src="/head-logo.png"
            alt="Arogya"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg object-cover"
          />
          <span className="text-xs sm:text-sm font-semibold text-gray-900 whitespace-nowrap">
            Arogya Wellness Assistant
          </span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden sm:flex items-center gap-2">
          <button
            onClick={onHome}
            className="px-3 py-1.5 text-sm rounded-md text-gray-700 hover:bg-gray-50 transition"
          >
            Home
          </button>
          <button
            onClick={onHistory}
            className="px-3 py-1.5 text-sm rounded-md text-gray-700 hover:bg-gray-50 transition"
          >
            History
          </button>
          <button
            onClick={onProfile}
            className="px-3 py-1.5 text-sm rounded-md text-gray-700 hover:bg-gray-50 transition"
          >
            Profile
          </button>
          <button
            onClick={onLogout}
            className="px-3 py-1.5 rounded-md bg-emerald-600 text-white text-sm hover:bg-emerald-700 transition"
          >
            Logout
          </button>
        </div>

        {/* Mobile Hamburger Menu */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="sm:hidden p-2 rounded-lg hover:bg-gray-100 transition"
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6 text-gray-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {mobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-white border-t border-gray-100 px-4 py-3 space-y-2">
          <button
            onClick={handleHome}
            className="w-full text-left px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-50 transition"
          >
            Home
          </button>
          <button
            onClick={handleHistory}
            className="w-full text-left px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-50 transition"
          >
            History
          </button>
          <button
            onClick={handleProfile}
            className="w-full text-left px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-50 transition"
          >
            Profile
          </button>
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition font-medium"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}

export default NavBar;
