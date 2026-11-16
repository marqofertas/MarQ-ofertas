const $ = (id) => document.getElementById(id);
const status = (message) => { $("status").textContent = message; };

$("capture").addEventListener("click", async () => {
  const button = $("capture");
  button.disabled = true;
  status("Lendo os dados públicos visíveis da página…");
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id || !/^https:\/\/(?:[^/]+\.)?shein\.com(?:\.br)?\//i.test(tab.url || "")) {
      throw new Error("Abra primeiro uma página de produto no site da SHEIN.");
    }
    const data = await chrome.tabs.sendMessage(tab.id, { type: "MARQ_CAPTURE_PRODUCT" });
    if (!data?.title) throw new Error("Não consegui identificar o nome. Confira se abriu a página de um produto.");
    $("title").value = data.title;
    if (data.price) $("price").value = data.price;
    status(data.price ? "Produto capturado. Confira o preço e cole seu link de afiliado." : "Nome capturado. Informe o preço e cole seu link de afiliado.");
  } catch (error) {
    status(error?.message || "Falha ao capturar a página. Atualize a página SHEIN e tente novamente.");
  } finally {
    button.disabled = false;
  }
});

$("copy").addEventListener("click", async () => {
  const title = $("title").value.trim();
  const price = $("price").value.trim().replace(/^R\$\s*/i, "");
  const affiliate = $("affiliate").value.trim();
  if (!title) return status("Informe o nome do produto.");
  if (!price || !/^\d{1,6}(?:[.,]\d{1,2})?$/.test(price)) return status("Informe um preço válido, por exemplo 49,90.");
  if (!/^https:\/\/onelink\.shein\.com\//i.test(affiliate)) return status("Cole o link onelink.shein.com gerado no Centro de Afiliados da sua conta.");
  const text = `🛒 ${title}\nPreço [R$${price}]\n${affiliate}`;
  try {
    await navigator.clipboard.writeText(text);
    status("Texto copiado! Abra o painel MarQ → Produtos → Importar oferta da SHEIN e cole no campo.");
  } catch {
    status("Não consegui copiar automaticamente. Selecione e copie o texto abaixo:\n\n" + text);
  }
});