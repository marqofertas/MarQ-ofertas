(() => {
  if (window.__marqSheinBridgeInstalled) return;
  window.__marqSheinBridgeInstalled = true;

  const clean = value => String(value || "").replace(/\\s+/g, " ").trim();
  const meta = (...selectors) => {
    for (const selector of selectors) {
      const el = document.querySelector(selector);
      const value = el?.content || el?.getAttribute("content") || "";
      if (clean(value)) return clean(value);
    }
    return "";
  };
  const getOffer = () => {
    const title = meta('meta[property="og:title"]', 'meta[name="twitter:title"]') ||
      clean(document.querySelector("h1")?.textContent) || clean(document.title);
    const image = meta('meta[property="og:image"]', 'meta[name="twitter:image"]');
    const priceText = meta('meta[property="product:price:amount"]', 'meta[property="og:price:amount"]');
    const currency = meta('meta[property="product:price:currency"]', 'meta[property="og:price:currency"]') || "BRL";
    const price = priceText ? Number(priceText.replace(",", ".")) : 0;
    return { title: title.slice(0, 180), image, price: Number.isFinite(price) ? price : 0, currency, productUrl: location.href };
  };

  const button = document.createElement("button");
  button.type = "button";
  button.textContent = "＋ Enviar para MarQ";
  button.setAttribute("aria-label", "Enviar produto SHEIN para MarQ Ofertas");
  Object.assign(button.style, {
    position: "fixed", right: "14px", bottom: "18px", zIndex: "2147483647",
    background: "#c90024", color: "#fff", border: "0", borderRadius: "24px",
    padding: "13px 18px", font: "600 14px Arial,sans-serif",
    boxShadow: "0 3px 14px #0005", cursor: "pointer"
  });
  button.addEventListener("click", () => {
    const offer = getOffer();
    if (!offer.title) { alert("Não consegui identificar o nome do produto nesta página."); return; }
    const affiliateUrl = prompt("Cole o link de afiliado gerado pelo botão Ganhar no Centro de Afiliados SHEIN:");
    if (!affiliateUrl) return;
    if (!/^https:\/\/(?:onelink\.shein\.com|shein\.onelink\.me)\//i.test(affiliateUrl.trim())) {
      alert("Este não parece ser um link de afiliado SHEIN válido. Gere o link pelo botão Ganhar.");
      return;
    }
    offer.affiliateUrl = affiliateUrl.trim();
    chrome.runtime.sendMessage({ type: "MARQ_SEND_OFFER", offer }, response => {
      if (chrome.runtime.lastError) { alert("Falha na comunicação com a extensão. Recarregue a página."); return; }
      if (response?.ok) alert("Produto enviado ao painel MarQ. Confira os dados e clique em Cadastrar na MarQ.");
      else alert(response?.error || "Não foi possível enviar. Abra o painel MarQ e entre na sua conta.");
    });
  });
  document.documentElement.appendChild(button);
})();