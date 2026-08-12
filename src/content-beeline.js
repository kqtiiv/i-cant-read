(function () {
  const MARK_ATTR = "data-beeline";

  const existingSpans = document.querySelectorAll(`span[${MARK_ATTR}]`);
  if (existingSpans.length > 0) {
    existingSpans.forEach((span) => {
      const parent = span.parentNode;
      if (!parent) return;
      parent.replaceChild(document.createTextNode(span.textContent), span);
      parent.normalize();
    });
    return;
  }

  const COLORS = ["#c0392b", "#1e8449", "#2464a8", "#7d3c98"];

  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;
      if (!parent) return NodeFilter.FILTER_REJECT;
      if (["SCRIPT", "STYLE", "NOSCRIPT", "TEXTAREA", "INPUT"].includes(parent.tagName)) {
        return NodeFilter.FILTER_REJECT;
      }
      if (parent.closest("textarea, input")) return NodeFilter.FILTER_REJECT;
      if (!node.nodeValue.trim()) return NodeFilter.FILTER_SKIP;
      return NodeFilter.FILTER_ACCEPT;
    },
  });

  const nodes = [];
  let node;
  while ((node = walker.nextNode())) nodes.push(node);

  const range = document.createRange();
  let colorIndex = -1;
  let lastTop = null;

  nodes.forEach((textNode) => {
    const text = textNode.nodeValue;
    const tokens = text.split(/(\s+)/); // alternates word, whitespace, word
    const frag = document.createDocumentFragment();
    let offset = 0;
    let currentSpan = null;

    tokens.forEach((token) => {
      const start = offset;
      offset += token.length;

      if (!token.trim()) {
        (currentSpan || frag).appendChild(document.createTextNode(token));
        return;
      }

      range.setStart(textNode, start);
      range.setEnd(textNode, offset);
      const rect = range.getClientRects()[0];
      const top = rect ? Math.round(rect.top) : lastTop;

      if (top !== lastTop) {
        colorIndex = (colorIndex + 1) % COLORS.length;
        lastTop = top;
      }

      const span = document.createElement("span");
      span.setAttribute(MARK_ATTR, "");
      span.style.color = COLORS[colorIndex];
      span.textContent = token;
      frag.appendChild(span);
      currentSpan = span;
    });

    textNode.parentNode.replaceChild(frag, textNode);
  });
})();
