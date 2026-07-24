# Sanity CMS — setup & intern guide

The whole site is driven by Sanity. The intern edits almost everything (menus,
socials, copy, images, stats, services, projects, team, testimonials, FAQ) at
**`/studio`** without touching code.

- Project ID: `ekt99equ` · dataset: `production` (public read).
- Live data is already seeded. Editing in `/studio` updates the site (ISR).

## Architecture

- `sanity/schemaTypes/`
  - `objects/` — reusable: `seo`, `socialLink`, `navItem`, `statItem`.
  - `documents/` — singletons (`siteSettings`, `landingPage`, and page singletons
    `aboutPage`/`servicesPage`/`projectsPage`/`teamPage`/`testimonialsPage`/
    `faqPage`/`contactPage`) and collections (`service`, `project`, `teamMember`,
    `testimonial`, `faq`, `partnerLogo`).
- `sanity/lib/`
  - `client.ts` — public read client + server-only `getWriteClient()`.
  - `queries.ts` — GROQ for every page/collection.
  - `fetch.ts` — typed fetchers with tag-based caching; **falls back to
    `src/content/site.ts`** if the CMS is unreachable, so the site never renders
    empty. Images are normalized (URL + LQIP blur + dimensions).
  - `image.ts` — `urlForImage` + `resolveImage` helpers.
- `src/app/(site)/` — all public routes share `(site)/layout.tsx` (header/footer
  from `siteSettings`). Blog at `/blog` and `/blog/[slug]`. `src/app/studio/`
  stays outside the group.
- `src/app/api/revalidate/route.ts` — webhook that revalidates on publish.

## Environment

`.env.local` (gitignored):

```
NEXT_PUBLIC_SANITY_PROJECT_ID="ekt99equ"
NEXT_PUBLIC_SANITY_DATASET="production"
NEXT_PUBLIC_SANITY_API_VERSION="2024-10-01"
SANITY_API_WRITE_TOKEN="<server-only write token>"   # seed + revalidate only
SANITY_REVALIDATE_SECRET="<shared secret>"           # used by the webhook
```

CORS origins (`http://localhost:3000`, prod domain) are already registered.

## Editable surface (intern)

- **Site Ayarları:** logo, e-posta, telefon, adres, telif, footer metni, **Ana
  Menü** (alt menüler dahil; Hizmetler menüsü hizmetlerden otomatik dolar),
  **Sosyal Medya** (bağlantısı boş olan platform sitede hiç görünmez), varsayılan
  SEO/OG.
- **Ana Sayfa:** hero, bölüm başlıkları, stüdyo galerileri + istatistikler, süreç
  sekmeleri, iletişim başlığı/görseli, kayan yazı. Öne çıkan projeler/hizmetler/
  yorumlar ilgili kayıtlardaki "Ana sayfada öne çıkar" anahtarıyla seçilir.
- **Sayfalar:** Hakkımızda, Hizmetler, Projeler, Ekibimiz, Memnuniyet, SSS, Blog,
  İletişim (her biri başlık + giriş + SEO).
- **Koleksiyonlar:** Hizmetler, Projeler, Blog yazıları, Ekip (slug + iletişim
  alanlarıyla `/ekip/[slug]` dijital kartvizit), Yorumlar, SSS, İş Ortağı
  Logoları.
- **Blog yazıları:** Kapak görseli opsiyonel. Yüklenmezse başlık + kategoriye göre
  otomatik markalı kapak üretilir (`/api/og/blog`) — kart, hero, OpenGraph ve
  JSON-LD için aynı görsel kullanılır. Özel kapak veya SEO görseli her zaman
  önceliklidir.

Each document has an **SEO & Paylaşım** group (meta başlık/açıklama, OG görseli,
arama motorundan gizleme).

## Re-seeding (developer)

`npm run seed` downloads live images, uploads them to Sanity (content-addressed,
no duplicates), and `createOrReplace`s all documents with deterministic IDs.
IDs use hyphens (e.g. `service-anahtar-teslim-tadilat`) — never dots, because
this dataset has Content Releases enabled and treats a dotted ID as a version.

## Publish → live (ISR webhook)

Add a webhook in Sanity manage → API → Webhooks:

- URL: `https://<domain>/api/revalidate?secret=<SANITY_REVALIDATE_SECRET>`
- Trigger: create/update/delete · Projection: `{ _type }`

It revalidates the affected cache tags so intern edits go live without a rebuild.

## Notes

- Singletons use fixed IDs and are hidden from the global "create" menu.
- `/studio` is `noindex` and disallowed in `robots.ts`.
- `src/content/site.ts` remains the typed fallback. Blog is intentionally deferred.
