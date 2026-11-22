# Wendy's Menu with Prices (USA)

An independent, fan-run reference website for the USA Wendy's menu: prices and calories, clearly sourced and dated. It takes no orders and is **not** the official Wendy's site.

## What is in this folder

A proper Astro website (static, no server, no database), built from the file tree Muhammad chose:

- `src/data/menu.json` — the **one verified data list**: 150 items, with prices, calories, protein, fat, carbs, sodium and an official source URL per item. A value that was not verified is `null` and the page renders it as “Not verified yet”. Calorie ranges (`calories_low` / `calories_high`) are used where Wendy's shows a range, not one figure (Coca-Cola Freestyle, national-only drinks). A `note` on an item flags a disagreement on Wendy's own pages.
- `src/data/stage5.json` — Deals, Wendy's vs McDonald's, and Hours: bundles and comparisons that are not single menu items, with the same one-restaurant basis and dates. Nothing in it is hard-coded into a page — the boards render from it.
- `src/pages/index.astro` — the single homepage: popular prices, breakfast board, full menu board, nutrition table, deals, Wendy's vs McDonald's, hours, FAQ, sources, and the trust sections (About, Contact, Privacy, Terms, “How we source prices”).
- `src/components/` — TopNotice, Header, Footer, PopularTable, SearchBox, CategoryChips, ItemCard, GlanceTable, Faq, Sources, AdSlot, plus DealsBoard, ComparisonBoard and HoursBoard for Stage 5.
- `src/layouts/BaseLayout.astro`, `src/styles/global.css`, `src/utils/menuStats.js`.
- `public/robots.txt`, `public/favicon.svg`, `public/images/` — 19 original AI-generated natural food photos (warm cream background, no logos or brand text, drinks in plain unbranded cups), each captioned on the page “Original AI-generated image — not an official photo”. No Wendy's logo and no official food photos.

## The data rules (do not break them)

- Prices are from **one restaurant only**: Wendy's, 799 S. High Street, Columbus, OH 43206, Carryout, checked **22 Nov 2026** on order.wendys.com. Every price on the site carries that basis label. Wendy's publishes no national price list; prices vary by location.
- Breakfast hours are from Wendy's official breakfast FAQ (wendys.com): most start **6:30 AM**, latest end **10:30 AM**, delivery begins **8:00 AM**.
- Breakfast **calories** are from Wendy's official item pages. Breakfast **prices are not verified** (the check was after breakfast ended) — they render as “Not verified yet”, never guessed.
- The **Oatmeal Bar was not found** on the official site (404) — it is not a menu item, only mentioned in the sourcing note. The **Frosty-ccino was not found** at the Columbus restaurant either (not in the Frosty or Coffee categories) — it is not a menu item; a morning re-check is needed.
- No third-party price site and no UK nutrition PDF was used. Only wendys.com, order.wendys.com, locations.wendys.com (hours) and mcdonalds.com (comparison only).
- Where Wendy's own pages disagree, both figures are shown and flagged, never reconciled: Deals calories, Family Chili (1,370 vs 530 Cal), the nuggets listed as sides, the Cookie Bundle (1,670 shown vs 5 × 330 = 1,650), and the breakfast end (11:00 AM today at this restaurant vs 10:30 AM latest nationally).
- The 3 “Advertisement” boxes are empty reserved spaces. There is **no ad code** on the site. Ads stay off until Muhammad confirms Google AdSense approval.

## Run it locally

```bash
cd wendys-menu
npm install
npm run dev     # local preview, usually http://localhost:4321
npm run build   # builds into dist/
npm run preview # serves the production build
```

## Status

- Build passes (`npm run build`), homepage smoke-tested locally.
- **Stage 5 ported 22 Nov 2026:** Deals (Biggie, Everyday Value, Combos, Key Tag, app offers), Wendy's vs McDonald's (calories only — no McDonald's prices were found anywhere on mcdonalds.com), Frosty Fusion/Swirl and other desserts, Drinks (incl. national-only drinks), Hours (incl. Thursday Closed as shown, breakfast-end discrepancy flagged), and Sides (incl. Family Chili and nuggets discrepancies). 150 verified items in `menu.json` (was 26).
- **Accent is deep teal #0F766E** (changed 22 Nov 2026 from the earlier red #c8102e, per the brief's “do not copy Wendy's red”; dark mode uses light teal #2DD4BF). Contrast on white is above 4.5:1.
- **Natural food photos added 22 Nov 2026:** 19 original AI-generated images in the Taco Bell site's style (hero, burgers, chicken, breakfast, sides, desserts, drinks), wired into the homepage as a hero photo and per-category photo grids, lazy-loaded with fixed sizes, cursor-move tilt/zoom with tap/focus lift and reduced-motion support. Every image is captioned “Original AI-generated image — not an official photo”.
- **NOT deployed yet.** See `DEPLOY.md` for the deploy steps.
