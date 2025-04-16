// Function to apply dark mode
function applyDarkMode() {
  // Remove any existing dark mode style
  removeDarkMode();

  const style = document.createElement("style");
  style.id = "dark-mode-style";
  style.textContent = `
    /* Base dark mode styles */
    :root {
      color-scheme: dark;
      --dark-bg: #1a1a1a;
      --dark-text: #ffffff;
      --dark-border: #333333;
      --dark-input: #2a2a2a;
      --dark-link: #4a9eff;
    }

    /* Force dark mode on all elements */
    html, body, div, span, applet, object, iframe,
    h1, h2, h3, h4, h5, h6, p, blockquote, pre,
    a, abbr, acronym, address, big, cite, code,
    del, dfn, em, img, ins, kbd, q, s, samp,
    small, strike, strong, sub, sup, tt, var,
    b, u, i, center,
    dl, dt, dd, ol, ul, li,
    fieldset, form, label, legend,
    table, caption, tbody, tfoot, thead, tr, th, td,
    article, aside, canvas, details, embed,
    figure, figcaption, footer, header, hgroup,
    menu, nav, output, ruby, section, summary,
    time, mark, audio, video {
      background-color: var(--dark-bg) !important;
      color: var(--dark-text) !important;
      border-color: var(--dark-border) !important;
    }

    /* Form elements */
    input, textarea, select, button {
      background-color: var(--dark-input) !important;
      color: var(--dark-text) !important;
      border-color: var(--dark-border) !important;
    }

    /* Links */
    a {
      color: var(--dark-link) !important;
    }

    a:visited {
      color: #a64dff !important;
    }

    /* Images and media */
    img, video {
      filter: brightness(0.8) contrast(1.2) !important;
    }

    /* Code blocks */
    pre, code {
      background-color: var(--dark-input) !important;
      color: var(--dark-text) !important;
    }

    /* Tables */
    table, th, td {
      border-color: var(--dark-border) !important;
    }

    /* Specific form elements */
    input[type="text"],
    input[type="password"],
    input[type="email"],
    input[type="search"],
    input[type="url"],
    input[type="tel"],
    input[type="number"],
    textarea {
      background-color: var(--dark-input) !important;
      color: var(--dark-text) !important;
    }

    /* Buttons */
    button, input[type="button"], input[type="submit"] {
      background-color: var(--dark-input) !important;
      color: var(--dark-text) !important;
      border-color: var(--dark-border) !important;
    }

    /* Override any inline styles */
    *[style*="background-color"] {
      background-color: var(--dark-bg) !important;
    }

    *[style*="color"] {
      color: var(--dark-text) !important;
    }

    /* Fix for transparent backgrounds */
    * {
      background-image: none !important;
    }
  `;

  // Add the style to the document
  document.head.appendChild(style);

  // Force dark mode on the document
  document.documentElement.style.setProperty("color-scheme", "dark");
  document.body.style.setProperty("background-color", "var(--dark-bg)");
  document.body.style.setProperty("color", "var(--dark-text)");
}

// Function to remove dark mode
function removeDarkMode() {
  const style = document.getElementById("dark-mode-style");
  if (style) {
    style.remove();
  }
  // Reset document styles
  document.documentElement.style.removeProperty("color-scheme");
  document.body.style.removeProperty("background-color");
  document.body.style.removeProperty("color");
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((message, _, sendResponse) => {
  if (message.action === "toggleDarkMode") {
    if (message.enabled) {
      applyDarkMode();
    } else {
      removeDarkMode();
    }
    sendResponse({ success: true });
  }
  return true;
});

// Check if dark mode is enabled when the page loads
chrome.storage.local.get(["darkModeEnabled"], (result) => {
  if (result.darkModeEnabled) {
    applyDarkMode();
  }
});

// Also check for dark mode when the page is fully loaded
window.addEventListener("load", () => {
  chrome.storage.local.get(["darkModeEnabled"], (result) => {
    if (result.darkModeEnabled) {
      applyDarkMode();
    }
  });
});
