chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status !== "complete") return;
  if (!tab.url || tab.url.startsWith("chrome://") || tab.url.startsWith("chrome-extension://")) return;

  const flags = await chrome.storage.local.get([
    "reader_mode_active",
    "bg_active",
    "beeline_active",
    "bionic_reading_active",
  ]);

  const features = [
    ["reader_mode_active", "src/content-readermode.js"],
    ["bg_active", "src/content-bg.js"],
    ["beeline_active", "src/content-beeline.js"],
    ["bionic_reading_active", "src/content.js"],
  ];

  for (const [key, file] of features) {
    if (flags[key]) {
      await chrome.scripting.executeScript({ target: { tabId }, files: [file] });
    }
  }
});
