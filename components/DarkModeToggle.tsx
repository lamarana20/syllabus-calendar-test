import React, { useState, useEffect } from "react";
import { WiDaySunny } from "react-icons/wi";
import { FiMoon } from "react-icons/fi";

export default function DarkModeToggle() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check if user has a preference stored
    const storedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    if (storedTheme === "dark" || (!storedTheme && prefersDark)) {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <button
      onClick={toggleDarkMode}
      className="fixed top-3 right-3 sm:top-4 sm:right-4 z-50 p-2 sm:p-3 rounded-full glass dark:glass-dark transition-all duration-300 hover:scale-110 group min-h-[44px] min-w-[44px] flex items-center justify-center touch-manipulation"
      aria-label="Toggle dark mode"
    >
      <div className="relative w-5 h-5 sm:w-6 sm:h-6">
        {/* Sun icon */}
        <WiDaySunny
          className={`absolute inset-0 w-5 h-5 sm:w-6 sm:h-6 text-yellow-500 transition-all duration-500 ${
            darkMode ? "opacity-0 rotate-90 scale-0" : "opacity-100 rotate-0 scale-100"
          }`}
        />
        
        {/* Moon icon */}
        <FiMoon
          className={`absolute inset-0 w-5 h-5 sm:w-6 sm:h-6 text-blue-400 transition-all duration-500 ${
            darkMode ? "opacity-100 rotate-0 scale-100" : "opacity-0 rotate-90 scale-0"
          }`}
        />
      </div>
      
      {/* Tooltip */}
      <div className="absolute right-full top-1/2 transform -translate-y-1/2 mr-2 sm:mr-3 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        {darkMode ? "Light mode" : "Dark mode"}
      </div>
    </button>
  );
}
