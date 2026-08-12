(function () {
  const STYLE_ID = "icantread-bg-style";
  const existing = document.getElementById(STYLE_ID);
  if (existing) {
    existing.remove();
    return;
  }

  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = "html, body { background-color: #faf3e6 !important; }";
  document.head.appendChild(style);
})();
