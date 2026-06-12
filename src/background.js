// Auto-inject content.js on every page load while bionic reading is active.
// Uses storage (not an in-memory Set) so it survives service worker restarts.
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status !== "complete") return;
  if (!tab.url || tab.url.startsWith("chrome://") || tab.url.startsWith("chrome-extension://")) return;

  chrome.storage.local.get("bionic_reading_active", (result) => {
    if (result.bionic_reading_active) {
      chrome.scripting.executeScript({
        target: { tabId },
        files: ["src/content.js"]
      });
    }
  });
});
