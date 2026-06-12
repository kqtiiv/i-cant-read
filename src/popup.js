const btn = document.getElementById("bionic_reading_btn");

chrome.storage.local.get("bionic_reading_active", (result) => {
  btn.innerText = result.bionic_reading_active ? "Deactivate" : "Activate";
});

btn.addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  // don't try change pages if not allowed
  if (!tab.url || tab.url.startsWith("chrome://")) return;

  chrome.storage.local.get("bionic_reading_active", (result) => {
    const isActive = result.bionic_reading_active;
    const newState = !isActive;

    chrome.storage.local.set({ bionic_reading_active: newState });
    btn.innerText = newState ? "Deactivate" : "Activate";

    // inject script on activate and deactivate
    chrome.scripting.executeScript({
      target: { tabId: tab.id, allFrames: true },
      files: ["src/content.js"],
    });
  });
});
