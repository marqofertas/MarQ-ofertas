(() => {
  function first(...values) {
    return values.find(value => typeof value === "string" && value.trim())?.trim() || "";
  }

  function getProductData() {
    const title = first(
      document.querySelector('meta[property="og:title"]')?.content,
      document.querySelector('meta[name="twitter:title"]')?.content,
      document.querySelector("h1")?.textContent,
      document.title
    ).replace(/\s*[|｜-]\s*SHEIN.*$/i, "").trim();

    let price = first(
      document.querySelector('meta[property="product:price:amount"]')?.content,
      document.querySelector('meta[itemprop="price"]')?.content,
      document.querySelector('meta[property="og:price:amount"]')?.content
    );

    if (!price) {
      const offer = document.querySelector('script[type="application/ld+json"]');
      if (offer) {
        try {
          const parsed = JSON.parse(offer.textContent);
          const nodes = Array.isArray(parsed) ? parsed : [parsed];
          for (const node of nodes) {
            const offers = Array.isArray(node?.offers) ? node.offers : [node?.offers];
            const candidate = offers.find(item => item?.price);
            if (candidate?.price) { price = String(candidate.price); break; }
          }
        } catch (_) {}
      }
    }

    if (price) {
      const number = Number(String(price).replace(",", "."));
      price = Number.isFinite(number) && number > 0
        ? number.toFixed(2).replace(".", ",")
        : "";
    }

    return { title: title.slice(0, 180), price };
  }

  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message?.type === "MARQ_CAPTURE_PRODUCT") {
      sendResponse(getProductData());
    }
    return false;
  });
})();