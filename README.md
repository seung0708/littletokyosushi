# Little Tokyo Sushi

A full-stack restaurant ordering platform built to replace my parents' third-party POS system. Features a customer-facing storefront and an admin dashboard with role-based access control.

---

## Overview

Little Tokyo Sushi is a production-grade ordering platform designed for a real business with real constraints — replacing a paid third-party service while adding features it never had. The system supports two distinct user interfaces sharing a single backend: a customer storefront for browsing and ordering, and a staff dashboard for managing orders.

Authorization is enforced at the database layer using Supabase Row Level Security, so the application is secure even if client-side logic is bypassed.

---

## Features

### Customer Storefront
- Browse full menu organized by category
- Add items to cart with modifier support
- Guest checkout with pickup order support

### Admin Dashboard
- Order queue with status management
- Menu item management: create, update, and toggle item availability
- Role-gated access — admin routes are protected at the database level, not just the UI

### Platform
- Row Level Security policies enforce authorization at the PostgreSQL layer
- Fully typed API layer with TypeScript end-to-end

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15 (App Router), React, TypeScript |
| Styling | Tailwind CSS, shadcn/ui |
| Backend | Next.js API Routes |
| Database | PostgreSQL (via Supabase), Row Level Security |
| Auth | Supabase Auth — email/password + role-based access (admin/staff only) |
| Deployment | Vercel |

---

## Getting Started

### Prerequisites
- Node.js 18+
- A [Supabase](https://supabase.com) project

### Installation

```bash
git clone https://github.com/yourusername/little-tokyo-sushi.git
cd little-tokyo-sushi
npm install
```

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Run Locally

```bash
npm run dev
# → http://localhost:3000
```

---

## Roadmap

- [ ] Clover/CardPointe payment integration
- [ ] Delivery support
- [ ] SMS notifications for order status
- [ ] Customer accounts and order history
- [ ] Weekly sales analytics for restaurant owners

---

## Motivation

My parents have run Little Tokyo Sushi for over a decade. Their current ordering system charges a monthly fee and lacks the features they actually need. This project is my attempt to build something better — and to ship software that matters to real people.

---

## License

MIT
