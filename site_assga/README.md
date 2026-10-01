# site_assga

## Deploy na Netlify

O projeto já inclui `netlify.toml` e a Function `netlify/functions/server.ts` para executar o portal Express com suas páginas EJS e APIs.

1. Conecte este repositório na Netlify.
2. Use `site_assga` como diretório base se o repositório contiver a pasta pai.
3. Configure as variáveis `SESSION_SECRET` e, opcionalmente, `GEMINI_API_KEY` nas variáveis de ambiente do site.
4. Faça o deploy com o comando de build `npm run build`.

Para manter os dados do portal em produção, configure `DATABASE_URL` com a URL de um PostgreSQL (Neon, Supabase, Vercel Postgres ou outro provedor compatível). Na primeira inicialização, o sistema cria as tabelas `associados`, `noticias` e `portal_state`; a API `/api/data` também cria `api_data_collections`. Registros enviados por formulários e alterações do painel são confirmados somente depois de gravados no banco.

Sem `DATABASE_URL`, o projeto continua usando o JSON local para desenvolvimento. Em Functions, o armazenamento local e os uploads em `/tmp` são temporários; por isso, fotos de associados ainda precisam de um storage permanente para produção.

## Deploy na Vercel

O projeto também inclui `vercel.json` e uma Function em `api/index.ts` para encaminhar as páginas do portal Express para a Vercel.

1. Importe este repositório na Vercel e defina `site_assga` como diretório raiz se o repositório contiver a pasta pai.
2. Mantenha o comando de build `npm run build` e configure `SESSION_SECRET` e, opcionalmente, `GEMINI_API_KEY` nas variáveis de ambiente.
3. Configure `DATABASE_URL` com um PostgreSQL para persistir os cadastros e dados do portal. O filesystem e uploads em `/tmp` são temporários nas Functions da Vercel.