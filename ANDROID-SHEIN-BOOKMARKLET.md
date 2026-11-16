# Atalho MarQ SHEIN para Android

O Chrome padrão no Android não instala extensões. Para usar a integração pelo celular, adicione este código como favorito (bookmarklet) no navegador. Compatibilidade depende do navegador permitir executar favoritos JavaScript.

## Código do favorito

Copie a linha abaixo inteira e use-a como **endereço/URL** de um favorito chamado **Enviar para MarQ**:

```javascript
javascript:(()=>{const m=s=>document.querySelector(s)?.content||'';const title=(m('meta[property="og:title"]')||document.querySelector('h1')?.innerText||document.title||'').replace(/\\s+/g,' ').trim().slice(0,180);const image=m('meta[property="og:image"]')||m('meta[name="twitter:image"]');const price=m('meta[property="product:price:amount"]')||m('meta[property="og:price:amount"]');const affiliate=prompt('Cole o link gerado pelo botão Ganhar no Centro de Afiliados SHEIN:');if(!affiliate)return;if(!/^https:\/\/(?:onelink\.shein\.com|shein\.onelink\.me)\//i.test(affiliate.trim())){alert('Link de afiliado SHEIN inválido.');return;}const u=new URL('https://marqofertas.github.io/MarQ-ofertas/admin.html');u.searchParams.set('marq_shein','1');u.searchParams.set('title',title);u.searchParams.set('image',image);u.searchParams.set('price',price);u.searchParams.set('affiliate',affiliate.trim());location.href=u.toString();})();
```

## Como usar
1. No navegador, abra uma página de produto SHEIN.
2. Gere o link rastreável no Centro de Afiliados usando **Ganhar**.
3. Na página do produto, execute o favorito **Enviar para MarQ** (em alguns navegadores, digite o nome do favorito na barra de endereço e selecione-o).
4. Cole o link de afiliado quando solicitado.
5. O navegador abrirá o painel MarQ com nome, preço e imagem identificados na página.
6. Confira os dados e clique em **Cadastrar na MarQ**.

O atalho não acessa sua conta SHEIN, não gera link afiliado e não contorna proteções. Ele apenas lê metadados públicos da página atual e encaminha os dados e o link fornecido por você ao painel. Se preço ou imagem não forem expostos pela página, confira/complemente os dados antes de cadastrar.
