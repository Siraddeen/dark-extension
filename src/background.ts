// Initialize extension state
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ darkModeEnabled: false });
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener((message, _, sendResponse) => {
  if (message.action === "getDarkModeState") {
    chrome.storage.local.get(["darkModeEnabled"], (result) => {
      sendResponse({ enabled: result.darkModeEnabled });
    });
    return true;
  }
});

// Listen for tab updates to apply dark mode to new pages
chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.status === "complete") {
    chrome.storage.local.get(["darkModeEnabled"], (result) => {
      if (result.darkModeEnabled) {
        // Wait a bit to ensure the page is fully loaded
        setTimeout(() => {
          chrome.tabs
            .sendMessage(tabId, {
              action: "toggleDarkMode",
              enabled: true,
            })
            .catch(() => {
              // Ignore errors for pages where content scripts can't run
            });
        }, 100);
      }
    });
  }
});

// Apply dark mode to all existing tabs when enabled
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === "local" && changes.darkModeEnabled) {
    const isEnabled = changes.darkModeEnabled.newValue;

    // Get all tabs and apply dark mode
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach((tab) => {
        if (tab.id) {
          chrome.tabs
            .sendMessage(tab.id, {
              action: "toggleDarkMode",
              enabled: isEnabled,
            })
            .catch(() => {
              // Ignore errors for pages where content scripts can't run
            });
        }
      });
    });
  }
});
