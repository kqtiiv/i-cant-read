(function () {
  const BACKUP_ID = "icantread-reader-backup";

  const backup = document.getElementById(BACKUP_ID);
  if (backup) {
    const originalBody = backup.content.firstElementChild;
    document.body.replaceWith(originalBody);
    return;
  }

  function textLength(el) {
    return (el.innerText || "").trim().length;
  }

  function score(el) {
    if (["SCRIPT", "STYLE", "NAV", "HEADER", "FOOTER", "ASIDE", "NOSCRIPT", "FORM"].includes(el.tagName)) {
      return -1;
    }
    const text = textLength(el);
    if (text < 200) return -1;
    const linkText = Array.from(el.querySelectorAll("a")).reduce((sum, a) => sum + textLength(a), 0);
    return text - linkText * 1.5;
  }

  let best = null;
  let bestScore = 0;
  document.querySelectorAll("article, main, section, div").forEach((el) => {
    const s = score(el);
    if (s > bestScore) {
      bestScore = s;
      best = el;
    }
  });
  if (!best) best = document.body;

  const contentClone = best.cloneNode(true);
  contentClone
    .querySelectorAll("script, style, nav, header, footer, aside, form, iframe, button, input")
    .forEach((el) => el.remove());

  const backupTemplate = document.createElement("template");
  backupTemplate.id = BACKUP_ID;
  backupTemplate.content.appendChild(document.body.cloneNode(true));

  const wrapper = document.createElement("body");
  wrapper.setAttribute("data-icantread-reader", "");

  const page = document.createElement("div");
  page.className = "icantread-reader-page";

  const article = document.createElement("div");
  article.className = "icantread-reader-article";
  article.innerHTML = contentClone.innerHTML;

  const style = document.createElement("style");
  style.textContent = `
    body[data-icantread-reader] { background: #faf3e6 !important; margin: 0; }
    .icantread-reader-page { max-width: 680px; margin: 0 auto; padding: 48px 24px; font-family: Georgia, serif; font-size: 19px; line-height: 1.7; color: #2b2723; }
    .icantread-reader-article img, .icantread-reader-article video { max-width: 100%; height: auto; }
    .icantread-reader-article * { background: transparent !important; float: none !important; position: static !important; }
  `;

  page.appendChild(article);
  wrapper.appendChild(style);
  wrapper.appendChild(page);
  wrapper.appendChild(backupTemplate);

  document.body.replaceWith(wrapper);
})();
