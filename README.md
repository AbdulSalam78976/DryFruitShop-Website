# Swat Nayab — Website

Public storefront. No accounts, no login, no payment processing — customers
browse, build a cart, enter their name/phone/address, and "checkout" opens
WhatsApp with the full order pre-filled to send to the shop. The shop owner
confirms and fulfills it from there (and enters it into the POS register
manually).

Reads its product catalog from the **same Supabase project** as `../pos/`,
using the anon key (read-only — see the `anon read ...` policies in
`../supabase/migrations`). No order/stock writes happen from this app.

## Setup

1. Copy `.env.local.example` to `.env.local` and fill in the same
   `SUPABASE_URL` you used for `pos/.env`, plus the anon key from
   Project Settings → API.
2. For WhatsApp checkout to work, set a WhatsApp number in the POS's
   Settings tab (`whatsapp_handle`) — the website reads it from there.
3. `npm install`
4. `npm run dev` — open http://localhost:3000

## Design

`stitch_nayab_pos_inventory_system/` has the mockups this was built from
("Heritage Gold & Emerald" — deep emerald + gold, serif headlines). Design
tokens live in `app/globals.css`.

## Pages

- `/` — hero, featured products, heritage blurb.
- `/shop` — full catalog, filterable by category/subcategory.
- `/shop/[id]` — product detail, weight/variant selector, add to cart.
- `/cart` — cart, delivery details form, WhatsApp checkout.

Cart state is client-side only (`localStorage`, see `lib/cart-context.tsx`)
— there's no backend cart or account to tie it to.
