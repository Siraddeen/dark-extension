import { useState, useEffect } from "react";
import "./index.css";

function App() {
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Get initial state from storage
    chrome.runtime.sendMessage({ action: "getDarkModeState" }, (response) => {
      setDarkModeEnabled(response.enabled);
    });
  }, []);

  const toggleDarkMode = () => {
    if (isAnimating) return; // Prevent multiple clicks during animation

    setIsAnimating(true);
    const newState = !darkModeEnabled;
    setDarkModeEnabled(newState);

    // Update storage
    chrome.storage.local.set({ darkModeEnabled: newState });

    // Send message to content script
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0].id) {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: "toggleDarkMode",
          enabled: newState,
        });
      }
    });

    // Reset animation state after transition
    setTimeout(() => {
      setIsAnimating(false);
    }, 300);
  };

  return (
    <div className="fixed inset-0 w-[300px] h-[200px] overflow-hidden rounded-3xl">
      <div className="absolute inset-0 bg-gradient-to-t from-blue-800 to-red-600">
        <div className="w-full h-full p-5 bg-gray-500/30 dark:bg-gray-800/30 backdrop-blur-sm transition-colors duration-300">
          <h1 className="text-xl font-bold mb-4 text-sky-500 italic transition-colors duration-300">
            Dark Mode Toggle
          </h1>
          <div className="flex items-center justify-between">
            <span className="text-white/90 dark:text-white/90 transition-colors font-bold duration-300">
              {darkModeEnabled ? "Dark Mode On " : "Dark Mode Off "}
            </span>
            <button
              onClick={toggleDarkMode}
              className={`
              relative inline-flex h-6 w-11 items-center rounded-full 
              transition-colors duration-300 ease-in-out
              focus:outline-none focus:ring-2 focus:ring-offset-2
              ${darkModeEnabled ? "bg-blue-600" : "bg-gray-200"}
              ${isAnimating ? "cursor-wait" : "cursor-pointer"}
            `}
            >
              <span
                className={`
                inline-block h-4 w-4 transform rounded-full bg-white
                transition-all duration-300 ease-in-out
                ${darkModeEnabled ? "translate-x-6" : "translate-x-1"}
                ${isAnimating ? "scale-110" : "scale-100"}
              `}
              />
              {/* Sun/Moon icons */}
              <span
                className={`
                absolute left-1 top-1/2 -translate-y-1/2
                transition-all duration-300 ease-in-out
                ${darkModeEnabled ? "opacity-40" : "opacity-100"} 
                ${isAnimating ? "scale-110" : "scale-100"}
                text-yellow-400 text-xs
              `}
              >
                ☀️
              </span>
              <span
                className={`
                absolute right-1 top-1/2 -translate-y-1/2
                transition-all duration-300 ease-in-out
                ${darkModeEnabled ? "opacity-100" : "opacity-40"}
                ${isAnimating ? "scale-110" : "scale-100"} 
                text-blue-400 text-xs
              `}
              >
                🌙
              </span>
            </button>
          </div>
          {/* Animation indicator */}
          <div className="mt-4 text-center">
            <div
              className={`
            inline-block w-4 h-4 rounded-full
            ${darkModeEnabled ? "bg-blue-600" : "bg-gray-200"}
            transition-all duration-300 ease-in-out
            ${isAnimating ? "scale-150 opacity-100" : "scale-0 opacity-0"}
          `}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
