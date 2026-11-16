chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type !== "MARQ_IMPORT_SHEIN" || !message.offer) return;
  window.postMessage({ source: "MARQ_SHEIN_EXTENSION", offer: message.offer }, location.origin);
  sendResponse({ ok: true });
});