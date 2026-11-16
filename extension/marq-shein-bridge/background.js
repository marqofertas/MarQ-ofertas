chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type !== "MARQ_SEND_OFFER") return;
  chrome.tabs.query({ url: "https://marqofertas.github.io/MarQ-ofertas/admin.html*" }, tabs => {
    const tab = tabs.find(t => t.id != null);
    if (!tab) {
      sendResponse({ ok: false, error: "Abra o painel administrativo MarQ em outra aba e entre na sua conta." });
      return;
    }
    chrome.tabs.sendMessage(tab.id, { type: "MARQ_IMPORT_SHEIN", offer: message.offer }, response => {
      if (chrome.runtime.lastError) {
        sendResponse({ ok: false, error: "Recarregue o painel MarQ e tente novamente." });
        return;
      }
      sendResponse(response || { ok: false, error: "O painel não confirmou o recebimento." });
    });
  });
  return true;
});