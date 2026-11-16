# MarQ Conecta SHEIN — versão 0.1

Extensão de navegador para capturar **dados visíveis** de uma página de produto SHEIN e preparar o texto compatível com o importador SHEIN já existente no painel MarQ.

## O que faz
- Captura título e, quando disponível no HTML público da página, o preço.
- Recebe o link de afiliado que o usuário gerou no Centro de Afiliados oficial.
- Prepara e copia o texto no formato aceito pelo importador atual da MarQ.

## O que NÃO faz
- Não lê cookies, localStorage, tokens, sessão, senha ou códigos de segurança.
- Não faz login, não contorna CAPTCHA e não chama endpoints privados da SHEIN.
- Não gera por conta própria um link de afiliado. O link deve ser gerado pelo usuário no Centro de Afiliados SHEIN, porque o compartilhamento de links comuns do site pode não atribuir comissão.

## Instalação em Chrome para computador
1. Baixe o código da pasta `marq-conecta-shein` e extraia os arquivos.
2. Abra `chrome://extensions`.
3. Ative **Modo do desenvolvedor**.
4. Clique em **Carregar sem compactação** e selecione a pasta `marq-conecta-shein`.
5. Abra uma página de produto SHEIN, toque no ícone da extensão e capture os dados.

## Fluxo de importação
1. Abra o produto e capture título/preço.
2. Gere o link pelo Centro de Afiliados da sua conta SHEIN.
3. Cole o link `https://onelink.shein.com/...` na extensão.
4. Toque em **Preparar texto para importar na MarQ**.
5. No painel MarQ, abra **Produtos → Importar oferta da SHEIN**, cole o texto, confira e cadastre.

## Compatibilidade
Manifest V3. Projetada inicialmente para Chrome/Chromium em computador. O Chrome padrão no Android não instala extensões; navegadores Android de terceiros variam em suporte e precisam ser testados individualmente. Não use navegador descontinuado nem instale APK de origem desconhecida.

## Segurança
A extensão não envia dados a servidores externos. A captura é feita localmente na aba ativa e o texto é copiado para a área de transferência somente após ação explícita do usuário.
