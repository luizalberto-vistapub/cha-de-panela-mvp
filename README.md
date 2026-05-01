# Cha de Panela MVP

Landing page responsiva para convite de cha de panela com confirmacao de presenca, token local e reserva de presentes.

## Stack

- Next.js App Router
- Supabase via server-side service role
- Admin com senha unica e cookie HTTP-only

## Setup

1. Instale dependencias:

```bash
npm install
```

2. Crie `.env` a partir de `.env.example`:

```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key
ADMIN_PASSWORD=sua-senha-admin
ADMIN_SESSION_SECRET=um-segredo-longo
```

3. No Supabase SQL Editor, rode:

```text
supabase/schema.sql
supabase/seed.sql
```

4. Inicie:

```bash
npm run dev
```

## Rotas

- Convite: `/convite/joao-e-mary`
- Admin: `/admin`

## Assets

A foto do casal foi copiada para:

```text
public/images/hero-couple-optimized.jpg
```

Ela e usada no hero e na imagem Open Graph do WhatsApp. A foto original tambem foi mantida em `public/images/hero-couple.jpg`.
