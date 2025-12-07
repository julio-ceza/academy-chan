# Suporte Fácil - Deployment Guide

## 📦 Deploy na Vercel

### Configurações importantes:

1. **Root Directory**: `suporte-facil-nextjs`
2. **Framework Preset**: Next.js
3. **Build Command**: `npm run build` (padrão)
4. **Output Directory**: `.next` (padrão)
5. **Install Command**: `npm install` (padrão)

### Passos para deploy:

1. Acesse https://vercel.com
2. Clique em "Add New Project"
3. Importe o repositório `julio-ceza/academy-chan`
4. **IMPORTANTE**: Configure o Root Directory para `suporte-facil-nextjs`
5. Deixe as outras configurações no padrão
6. Clique em "Deploy"

### Verificando o erro 404:

Se você está recebendo erro 404:

1. Verifique nas configurações do projeto na Vercel se o **Root Directory** está definido como `suporte-facil-nextjs`
2. Verifique os logs de build na Vercel para ver se houve erro
3. Certifique-se de que o build foi concluído com sucesso

### Re-deploy:

Se precisar fazer um novo deploy:
- Vá em Settings > General > Root Directory
- Confirme que está `suporte-facil-nextjs`
- Volte para Deployments e clique em "Redeploy"

## 🌐 URLs esperadas:

- `/` - Página de login
- `/dashboard` - Dashboard do agente
- `/client-dashboard` - Dashboard do cliente
- `/new-ticket` - Criar novo ticket
- `/ticket/[id]` - Detalhes do ticket
- `/forgot-password` - Recuperar senha
