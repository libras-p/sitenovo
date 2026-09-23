# site_assga

## Deploy na Netlify

O projeto já inclui `netlify.toml` e a Function `netlify/functions/server.ts` para executar o portal Express com suas páginas EJS e APIs.

1. Conecte este repositório na Netlify.
2. Use `site_assga` como diretório base se o repositório contiver a pasta pai.
3. Configure as variáveis `SESSION_SECRET` e, opcionalmente, `GEMINI_API_KEY` nas variáveis de ambiente do site.
4. Faça o deploy com o comando de build `npm run build`.

Para manter associados e notícias no painel administrativo em produção, configure também `DATABASE_URL` com a URL de um PostgreSQL (Neon, Supabase, Vercel Postgres ou outro provedor compatível). Na primeira inicialização, as tabelas `associados` e `noticias` são criadas automaticamente e, se estiverem vazias, recebem os dados existentes em `data/assga-data.json`.

Sem `DATABASE_URL`, o projeto continua usando o JSON local para desenvolvimento. Em Functions, o armazenamento local e os uploads em `/tmp` são temporários; por isso, fotos de associados ainda precisam de um storage permanente para produção.