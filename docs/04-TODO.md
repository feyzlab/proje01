# TODO — PROJE 01 migration

## Phase 0 — Foundation
- [x] Audit live site, extract brand tokens, copy, structure, images
- [x] Write `/docs` reference files
- [x] Scaffold Next.js 16 + TS + Tailwind v4
- [x] Install Motion, Phosphor, next-sanity, @sanity/image-url
- [x] Init shadcn/ui (config + button/accordion primitives, Phosphor icons)
- [x] Configure brand tokens in `globals.css` + fonts (Inter Tight + Inter)
- [x] `next.config.ts` remotePatterns for proje01.com images
- [x] Embed Sanity Studio at `/studio` + schemas for landing (needs real projectId)

## Phase 1 — Landing page (REVIEW GATE)
- [x] Header (sticky, responsive, dropdowns) + mobile menu (white over hero)
- [x] Hero (image + H1 + side intro + social rail)
- [x] Featured projects gallery
- [x] Services numbered list
- [x] Studio statement + animated stats (dark section)
- [x] Process section (tabs)
- [x] Testimonials
- [x] Contact CTA + form (VISUAL ONLY — not wired)
- [x] Clients/trust strip (placeholder logos — replace with real)
- [x] Footer
- [x] SEO: metadata, sitemap, robots, JSON-LD, favicons
- [x] Responsive QA (mobile/desktop) + reduced-motion handling
- [x] `npm run build` clean
- [ ] **Owner review** ⬅ STOP here until approved

## Connect CMS (after owner creates Sanity project)
- [ ] Wire landing sections to Sanity with site.ts fallback (see 05-SANITY.md §2)
- [ ] Seed singletons with current copy

## Phase 2 — Remaining pages (after approval)
- [ ] /hakkinda (About)
- [ ] /ekibimiz (Team) + /ekip/[slug] dijital kartvizit
- [ ] /memnuniyet (Testimonials)
- [ ] /sss (FAQ)
- [ ] /hizmetler (Services)
- [ ] /projeler + /projeler/[slug] (Projects collection)
- [ ] /blog + /blog/[slug] (Blog collection)
- [ ] /iletisim (Contact)

## Deferred / later
- [ ] Wire contact + footer forms (backend/email) — currently placeholders
- [ ] Download images from WP → upload to Sanity / repo
- [ ] Real stat numbers from owner
- [ ] Confirm whether to migrate demo blog/project content or author fresh
- [ ] Hand-off doc for the intern (how to edit in Sanity)

## Known notes
- Live stats show `0` (unfinished on WP). Using CMS-editable placeholders; owner
  to supply real figures.
- Blog/project items on live site are demo (English) content.
