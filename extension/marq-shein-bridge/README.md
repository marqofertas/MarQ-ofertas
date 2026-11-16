# MarQ SHEIN Bridge

Extensão Chrome/Edge Manifest V3 para transferir dados públicos da página de um produto SHEIN ao painel administrativo MarQ.

## Instalação
1. Baixe esta pasta do repositório (ou o ZIP do repositório) e extraia os arquivos.
2. No Chrome/Edge de computador, abra `chrome://extensions` ou `edge://extensions`.
3. Ative "Modo do desenvolvedor" e clique em "Carregar sem compactação".
4. Selecione a pasta `extension/marq-shein-bridge`.
5. Abra e entre no painel MarQ em uma aba; em outra aba, abra um produto SHEIN.

## Uso
1. Na página do produto SHEIN, clique em "＋ Enviar para MarQ".
2. Gere o link rastreável no Centro de Afiliados SHEIN pelo botão oficial "Ganhar" e cole-o quando solicitado.
3. A extensão envia nome/preço da página e link ao painel MarQ aberto.
4. Confira a oferta e clique em "Cadastrar na MarQ". O painel usa a sessão Supabase já autenticada e tenta buscar a foto.

A extensão não lê senhas/cookies, não contorna CAPTCHA, não gera links de afiliado e não publica sem confirmação no painel. Alguns produtos podem não expor preço ou imagem em metadados; nesses casos, complete os campos no painel.

## Compatibilidade
Chrome/Edge desktop. Navegadores Android normalmente não suportam extensões Manifest V3 completas.
