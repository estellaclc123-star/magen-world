# Magen World

A complete, modern e-commerce storefront built with **React 19**, **TypeScript**, **Tailwind CSS 4** and **Supabase** (products, authentication, orders, inventory and image storage).

Works out of the box in **local demo mode** with 12 sample products, a working cart, checkout and an admin dashboard. Connect Supabase to go live.

---

## Quick start

Requirements: Node.js **20+** and npm.

```bash
npm install
npm run dev
```

Open http://localhost:5173

### Demo mode vs live mode

- **Demo mode (default):** no setup needed. Products, cart, orders and admin changes are stored in your browser's localStorage so everything works immediately.
- **Live mode:** create a free project at [supabase.com](https://supabase.com), then:

```bash
# 1. copy the example env file and fill in your keys
cp .env.example .env

# 2. open supabase/schema.sql in the Supabase SQL editor and Run it
# 3. open supabase/seed.sql in the SQL editor and Run it
```

- `VITE_SUPABASE_URL` — your project URL (e.g. `https://xxxx.supabase.co`)
- `VITE_SUPABASE_ANON_KEY` — your publishable anon key

Only the **anon/publishable** key belongs in `.env`. Never expose the `service_role` key or database password.

> To make yourself an admin, update your `profiles.role` to `admin` in the Supabase dashboard (or via SQL) after signing up.

---

## Project structure

```
Magen World/
├── index.html                     # App shell, fonts, meta
├── package.json                   # Dependencies + scripts
├── vite.config.ts                 # Vite + Tailwind plugin config
├── tsconfig.json                  # TypeScript config
├── eslint.config.js               # ESLint flat config
├── .env.example                   # Supabase key template
├── supabase/
│   ├── schema.sql                 # Full DB schema, RLS, auth trigger,
│   │                              #   place_order & update_order_status RPCs,
│   │                              #   storage bucket for product images
│   └── seed.sql                   # 12 sample products in GH₵
├── public/
│   └── favicon.svg                # Logo mark
└── src/
    ├── main.tsx                   # React entry point
    ├── App.tsx                    # Router + providers + layout
    ├── index.css                  # Tailwind theme + animations
    ├── lib/
    │   ├── supabase.ts            # Supabase client (nullable => demo mode)
    │   ├── api.ts                 # Data layer: products, orders, CRUD
    │   ├── mockData.ts            # 12 sample products + categories
    │   ├── types.ts               # Shared TS types + constants
    │   └── format.ts              # Price/date formatting (GH₵)
    ├── context/
    │   ├── AuthContext.tsx        # Auth + admin role + demo session
    │   ├── CartContext.tsx        # Cart state, totals, localStorage
    │   └── ToastContext.tsx       # Success/error notifications
    ├── components/
    │   ├── Navbar.tsx             # Sticky nav, search, cart count, account
    │   ├── Footer.tsx             # Footer with links + contacts
    │   ├── ProductCard.tsx        # Product tile (price, badges, quick add)
    │   ├── QuantityStepper.tsx    # +/- quantity control
    │   ├── StatusBadge.tsx        # Order status pill
    │   ├── SectionHeader.tsx      # Homepage section heading
    │   ├── EmptyState.tsx         # Empty-cart/no-results state
    │   └── Spinner.tsx            # Loading indicator
    └── pages/
        ├── HomePage.tsx           # Hero, categories, featured, new, offers
        ├── ShopPage.tsx           # Listing: search, filters, sorting
        ├── ProductDetailsPage.tsx # Details, qty, add to cart, buy now, related
        ├── CartPage.tsx           # Cart, delivery fee, totals
        ├── CheckoutPage.tsx       # Customer form, payment, place order
        ├── OrderConfirmationPage.tsx  # Success + order reference
        ├── AuthPage.tsx           # Sign in / register / demo entry
        ├── AccountPage.tsx        # Profile + order history
        ├── AdminDashboardPage.tsx # Admin shell + tabs (guarded)
        └── admin/
            ├── ProductsPanel.tsx  # Product table, add/edit/delete
            ├── ProductFormModal.tsx  # Product form + image upload
            └── OrdersPanel.tsx    # Orders, stats, status changes
```

## Where things live (key features)

| Feature                        | File(s)                                                   |
| ------------------------------ | --------------------------------------------------------- |
| Homepage sections              | `src/pages/HomePage.tsx`                                  |
| Search / filter / sort         | `src/pages/ShopPage.tsx`                                  |
| Product details + related      | `src/pages/ProductDetailsPage.tsx`                        |
| Cart + delivery fee logic      | `src/context/CartContext.tsx`, `src/pages/CartPage.tsx`   |
| Checkout + payment methods     | `src/pages/CheckoutPage.tsx`, `src/lib/api.ts`            |
| Auth & admin role              | `src/context/AuthContext.tsx`, `src/pages/AuthPage.tsx`   |
| Admin: products & orders       | `src/pages/admin/*`, `src/pages/AdminDashboardPage.tsx`   |
| Product DB / RLS / storage     | `supabase/schema.sql`, `supabase/seed.sql`                |
| Price/currency formatting      | `src/lib/format.ts`                                       |

## Scripts

```bash
npm run dev        # start dev server
npm run build      # type-check + production build
npm run preview    # preview the production build
npm run lint       # ESLint
npm run typecheck  # TypeScript check
```

## How the Supabase backend works

- **Products** — public read; admins insert/update/delete via RLS policies.
- **Orders** — placed through the `place_order` RPC (security definer). It validates customer details, locks products, computes prices and delivery server-side, and decrements stock atomically. Delivery is **free above GH₵1,500**, otherwise GH₵35.
- **Order status** — the `update_order_status` RPC restricts transitions (`pending → processing/shipped → delivered`) and restores stock on cancellation. Admins only.
- **Auth** — Supabase email/password. A trigger creates a `profiles` row on sign-up; role escalation is blocked by a trigger that only allows database owners to change roles.
- **Images** — uploaded to the public `product-images` storage bucket by admins.

## Notes

- Sample photos are served from Unsplash; swap `image_url` values anytime in the admin dashboard.
- Prices are always displayed and calculated in **Ghana Cedis (GH₵)**.