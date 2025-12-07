# Suporte Fácil - Deployment Guide

## 🚨 SOLUÇÃO PARA ERRO 404 NA VERCEL

### O problema:
O erro 404 acontece porque a Vercel está procurando os arquivos no diretório raiz do repositório, mas o projeto Next.js está dentro da pasta `suporte-facil-nextjs`.

### ✅ SOLUÇÃO - Configure o Root Directory:

1. **Acesse seu projeto na Vercel**: https://vercel.com/dashboard
2. Clique no projeto que está dando erro 404
3. Vá em **Settings** (Configurações)
4. Clique em **General**
5. Procure por **Root Directory**
6. Clique em **Edit** (Editar)
7. Digite: `suporte-facil-nextjs`
8. Clique em **Save** (Salvar)
9. Volte para **Deployments**
10. Clique em **Redeploy** no último deployment

### 📦 Configurações corretas:

- **Root Directory**: `suporte-facil-nextjs` ⚠️ **CRÍTICO**
- **Framework Preset**: Next.js (detectado automaticamente)
- **Build Command**: `npm run build` (padrão)
- **Output Directory**: `.next` (padrão)
- **Install Command**: `npm install` (padrão)
- **Node Version**: 18.x ou superior

### 🔍 Verificando se está correto:

Após configurar o Root Directory e fazer redeploy:
- Os logs de build devem mostrar que encontrou o `package.json`
- Deve executar `npm install` com sucesso
- Deve executar `npm run build` com sucesso
- O deploy deve completar sem erros

### 🆕 Deploy do Zero (Alternativa):

Se preferir começar do zero:

1. **Delete o projeto atual na Vercel**
2. Acesse: https://vercel.com/new
3. Importe `julio-ceza/academy-chan`
4. **ANTES de clicar em Deploy**, expanda "Advanced" ou procure "Root Directory"
5. Configure: `suporte-facil-nextjs`
6. Agora clique em **Deploy**

## 🌐 URLs esperadas:

- `/` - Página de login
- `/dashboard` - Dashboard do agente
- `/client-dashboard` - Dashboard do cliente
- `/new-ticket` - Criar novo ticket
- `/ticket/[id]` - Detalhes do ticket
- `/forgot-password` - Recuperar senha
