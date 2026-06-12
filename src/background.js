// Tracks which tabs have bionic reading enabled
const enabledTabs = new Set();

// popup.js sends msg when br toggled
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "enable") {
    enabledTabs.add(msg.tabId);
  } else if (msg.action === "disable") {
    enabledTabs.delete(msg.tabId);
  }
});

// update tab when a tracked tab finishes loading a new page
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && enabledTabs.has(tabId)) {
    chrome.scripting.executeScript({
      target: { tabId },
      files: ["src/content.js"]
    });
  }
});

chrome.tabs.onRemoved.addListener((tabId) => {
  enabledTabs.delete(tabId);
});
