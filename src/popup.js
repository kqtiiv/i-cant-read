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

    // add script on activate and deactivate
    chrome.scripting.executeScript({
      target: { tabId: tab.id, allFrames: true },
      files: ["src/content.js"],
    });
  });
});

// beeline gradient, reader mode, cream background
function wireToggle(buttonId, storageKey, file) {
  const toolBtn = document.getElementById(buttonId);

  chrome.storage.local.get(storageKey, (result) => {
    toolBtn.classList.toggle("is-active", !!result[storageKey]);
  });

  toolBtn.addEventListener("click", async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab.url || tab.url.startsWith("chrome://")) return;

    chrome.storage.local.get(storageKey, (result) => {
      const newState = !result[storageKey];
      chrome.storage.local.set({ [storageKey]: newState });
      toolBtn.classList.toggle("is-active", newState);

      chrome.scripting.executeScript({
        target: { tabId: tab.id, allFrames: true },
        files: [file],
      });
    });
  });
}

wireToggle("beeline_btn", "beeline_active", "src/content-beeline.js");
wireToggle("reader_mode_btn", "reader_mode_active", "src/content-readermode.js");
wireToggle("bg_btn", "bg_active", "src/content-bg.js");

const ttsBtn = document.getElementById("tts_btn");
ttsBtn.addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab.url || tab.url.startsWith("chrome://")) return;

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ["src/content-tts.js"],
  });
  ttsBtn.classList.toggle("is-active");
});
