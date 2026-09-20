# site_assga

## Deploy na Netlify

O projeto já inclui `netlify.toml` e a Function `netlify/functions/server.ts` para executar o portal Express com suas páginas EJS e APIs.

1. Conecte este repositório na Netlify.
2. Use `site_assga` como diretório base se o repositório contiver a pasta pai.
3. Configure as variáveis `SESSION_SECRET` e, opcionalmente, `GEMINI_API_KEY` nas variáveis de ambiente do site.
4. Faça o deploy com o comando de build `npm run build`.

O armazenamento de dados e uploads em produção usa `/tmp`, que é temporário em Functions. Para manter alterações do painel administrativo após novos deploys ou reinicializações, será necessário conectar um banco de dados e armazenamento de arquivos permanentes.