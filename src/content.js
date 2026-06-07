function highlightText(sentenceText) {
  return sentenceText
    .split(" ")
    .map((word) => {
      if (word.includes("-")) {
        return word
          .split("-")
          .map((component) => highlightText(component))
          .join("-")
      }
      const hasNumber = /\d/;
      if (hasNumber.test(word)) return word;

      const length = word.length;
      let midPoint = 1;
      if (length > 3) midPoint = Math.round(length / 2);
      const firstHalf = word.slice(0, midPoint);
      const secondHalf = word.slice(midPoint);
      const htmlWord = `<br-bold class="br-bold">${firstHalf}</br-bold>${secondHalf}`;
      return htmlWord;
    })
    .join(" ");
}

function main() {
  const boldedElements = document.getElementsByTagName("br-bold");
  if (boldedElements.length > 0) {
    for (const element of boldedElements) {
      element.classList.toggle("br-bold");
    }
    return;
  }

  var style = document.createElement("style");
  style.textContent = ".br-bold { font-weight: bold !important; display: inline; }";
  document.head.appendChild(style);

  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    {
        acceptNode(node) {
            const parent = node.parentElement?.tagName;
            if (["SCRIPT", "STYLE", "NOSCRIPT"].includes(parent)) {
                return NodeFilter.FILTER_REJECT;
            }
            if (!node.nodeValue.trim()) {
                return NodeFilter.FILTER_SKIP;
            }
            return NodeFilter.FILTER_ACCEPT;
        }
    }
  );

  const nodes = [];
  let node;

  const parser = new DOMParser();
  while(node = walker.nextNode()) {
    nodes.push(node);
  }

  nodes.forEach((node) => {
    const span = document.createElement("span");
    span.innerHTML = highlightText(node.nodeValue);
    node.parentNode.replaceChild(span, node);
  });
}

main();