(function () {
  if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
    window.speechSynthesis.cancel();
    return;
  }

  const text = document.body.innerText.trim();
  if (!text) return;

  const utterance = new SpeechSynthesisUtterance(text);
  window.speechSynthesis.speak(utterance);
})();
