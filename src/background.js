const enabledTabs = new Set();

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "enable") {
    enabledTabs.add(msg.tabId);
  } else if (msg.action === "disable") {
    enabledTabs.delete(msg.tabId);
  }
});

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
