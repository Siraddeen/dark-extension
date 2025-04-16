const fs = require("fs");
const path = require("path");

// Create manifest.json in dist folder
const manifest = {
  manifest_version: 3,
  name: "Dark Mode Toggle",
  version: "1.0",
  description: "Toggle dark mode on any website",
  permissions: ["activeTab", "scripting", "storage"],
  action: {
    default_popup: "index.html",
  },
  content_scripts: [
    {
      matches: ["<all_urls>"],
      js: ["src/content.js"],
    },
  ],
  background: {
    service_worker: "src/background.js",
  },
};

// Ensure dist directory exists
if (!fs.existsSync("dist")) {
  fs.mkdirSync("dist");
}

// Write manifest.json to dist folder
fs.writeFileSync(
  path.join("dist", "manifest.json"),
  JSON.stringify(manifest, null, 2)
);
