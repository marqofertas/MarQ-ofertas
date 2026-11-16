# Conexão protegida SHEIN — MarQ Ofertas

## Estado

- Edge Function `marq-shein-connect` implantada e protegida por JWT + ID do administrador.
- O painel tem o botão **Iniciar conexão protegida**.
- A integração ainda precisa da chave privada do Browserbase no Supabase.
- A sessão é limitada a 10 minutos e solicita `recordSession=false` e `logSession=false`.

## Ativar a chave (uma única configuração)

1. Crie/acesse sua conta no [Browserbase](https://www.browserbase.com/).
2. Abra [Browserbase Settings](https://www.browserbase.com/settings) e gere uma API Key.
3. Não envie essa chave pelo WhatsApp, chat, GitHub ou formulário do painel.
4. Abra [Segredos das Edge Functions no Supabase](https://supabase.com/dashboard/project/zonclgsfqtylnedxigxd/settings/functions).
5. Adicione:
   - **Key:** `BROWSERBASE_API_KEY`
   - **Value:** cole a API Key criada no Browserbase.
6. Salve. O Supabase disponibiliza o novo segredo às Edge Functions sem precisar redeploy.

Depois, abra o [Painel MarQ](https://marqofertas.github.io/MarQ-ofertas/admin.html), entre como administrador e use **Garimpo SHEIN → Conectar SHEIN pelo celular → Iniciar conexão protegida**. O navegador remoto abre pelo link temporário. Faça login diretamente nele e navegue até o Centro de Afiliados.

## Privacidade e limites

- A senha SHEIN é digitada diretamente no navegador remoto do Browserbase; nunca no painel MarQ.
- A chave Browserbase fica apenas como segredo do servidor Supabase.
- Gravação de sessão e logs do Browserbase são desativados na criação.
- A sessão termina após 10 minutos. Não há persistência de cookies implementada nesta primeira etapa.
- O navegador remoto é um teste de acesso móvel, não uma integração oficial da SHEIN.
- A geração automática de links de afiliado ainda não está implementada nem validada. Só será habilitada após verificar um método permitido e confiável no Centro de Afiliados.
- Não guardar nem reutilizar cookies/sessões SHEIN entre sessões nesta versão.
