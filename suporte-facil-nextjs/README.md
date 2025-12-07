# Suporte Fácil - Sistema de Tickets

Sistema de gerenciamento de tickets de suporte construído com Next.js 14.

## 🚀 Deploy na Vercel

### Opção 1: Deploy via CLI

```bash
# Instalar Vercel CLI globalmente
npm install -g vercel

# Fazer login na Vercel
vercel login

# Fazer deploy do projeto
vercel
```

### Opção 2: Deploy via GitHub

1. Faça push do código para o GitHub
2. Acesse [vercel.com](https://vercel.com)
3. Clique em "Add New Project"
4. Importe o repositório do GitHub
5. Configure o diretório raiz como `suporte-facil-nextjs`
6. Clique em "Deploy"

## 📦 Estrutura do Projeto

```
suporte-facil-nextjs/
├── app/
│   ├── client-dashboard/
│   ├── dashboard/
│   ├── login/
│   ├── new-ticket/
│   └── ticket/
├── lib/
│   └── api.js
└── package.json
```

## 🛠️ Desenvolvimento Local

```bash
# Instalar dependências
npm install

# Executar servidor de desenvolvimento
npm run dev

# Build de produção
npm run build

# Iniciar servidor de produção
npm start
```

## 🌐 Acesso

- **Local**: http://localhost:3000
- **Produção**: Será fornecido após deploy na Vercel

## 📝 Notas

- O projeto usa Next.js 14 com App Router
- Estilização com Tailwind CSS
- Gerenciamento de estado com React Hooks
- API mock local para desenvolvimento
