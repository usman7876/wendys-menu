# TODO-verify — Wendy's Menu with Prices (USA)

Single source of truth: `src/data/menu.json` (155 items, checked 22–27 Nov 2026).
Price basis: one restaurant only — Wendy's, 799 S. High St, Columbus, OH 43206, Carryout, order.wendys.com, 22 Nov 2026 (Kids' Meals 27 Nov 2026).
Rule: a value not verified is `null` in `menu.json` and renders as "Not verified yet". Do not guess, do not copy a price from a third-party price site.

## 1. Prices not verified (20 items — price is null)

### Breakfast — needs a morning re-check before 10:30 AM (all checks so far were after breakfast ended)
- Breakfast Baconator
- Sausage, Egg & Cheese Biscuit
- Bacon, Egg & Cheese Biscuit
- Sausage, Egg & Swiss Croissant
- Bacon, Egg & Swiss Croissant
- Seasoned Potatoes — Small
- Homestyle French Toast Sticks — 4 PC (national menu only)
- Homestyle French Toast Sticks — 6 PC (national menu only)
- Honey Butter Biscuit (national menu only)
- Sausage Biscuit (national menu only)

Note: competitors list breakfast prices from the national menu (e.g. $3.69–$4.49 range, 19 Nov 2026), but this site does NOT copy them. Only a fresh check at the Columbus restaurant, in breakfast hours, counts.

### National drinks — not sold standalone at the Columbus restaurant
- Coca-Cola, Coca-Cola Zero Sugar, Diet Coke, Sprite, Dr Pepper, Diet Dr Pepper, Barq's Root Beer, Fanta Orange, Minute Maid Light Lemonade, Hi-C Flashin' Fruit Punch
- These are available inside Coca-Cola Freestyle; the Freestyle price is not their standalone price. Do not use the Freestyle price as theirs.

## 2. Items not found at the sample restaurant — needs a morning / re-check
- Frosty-ccino — not in Frosty or Coffee categories at Columbus; no US price/calories found on wendys.com or order.wendys.com. Breakfast item, so re-check in the morning.
- Oatmeal Bar — not found on the official site (404). Not listed as a menu item.
- Iced Coffee (standalone) — no separate item; Cold Brew is the only iced coffee-type drink there.
- Iced Tea (standalone) — no item listed; wendys.com search for "iced tea" returned nothing.
- No fluid-ounce volumes shown for any drink — only Small / Medium / Large.

## 3. Discrepancies on Wendy's own pages — shown as-is, never reconciled
- Kids' 4PC Nuggets with Apple Bites: builder showed 290 Cal, while the parts shown (170 + 35 + 90) add to 295 Cal. Shown as 290 Cal.
- Kids' Meal prices: item detail pages show no price; prices come from the category tiles only. National menu shows no Kids' Meal prices or calories.
- Jr. Cheeseburger: 260 Cal in Biggie Deals vs 270 Cal in Everyday Value.
- Family Chili: category tile 1,370 Cal vs item page 530 Cal (site shows 530, item page).
- 5 for $5 Cookie Bundle: site shows 1,670 Cal for 5 Sugar Cookies, but 5 × 330 = 1,650 Cal.
- Breakfast end: 11:00 AM "today" at this restaurant vs 10:30 AM latest nationally.
- Coca-Cola Freestyle: calories are a range 0–434 Cal, not one figure.
- No total bundle calories shown for Biggie / combos — per-component calories only, so bundle totals say "Not verified yet".
- No McDonald's prices found anywhere on mcdonalds.com — comparison page is calories only.

## 4. Allergens — 4 of 155 items verified 27 Nov 2026
- Verified from the Nutrition tab "Allergens*" section on order.wendys.com: Dave's Single (Milk, Egg, Sesame, Soy, Wheat), Spicy Chicken Sandwich (Milk, Egg, Sesame, Wheat), Chicken Nuggets — 4 pc with no dipping sauce (Wheat only), Classic Chocolate Frosty — Small (Milk, Soy; Ingredients tab: SOY Alaska/Hawaii only).
- Remaining 151 items: allergens NOT verified yet. Full per-item audit still to do, item by item from the official Nutrition tab — do not copy third-party tables.
- Nuggets allergen URL (https://order.wendys.com/us/en/menu/101/30635) differs from its menu URL in menu.json (…/101/32065) — flagged in the item note.

## 5. Done 27 Nov 2026 — Kids Menu + Price Calculator
- Kids Menu page — DONE. 5 Kids' Meals verified at Columbus 27 Nov 2026: Kids' 4PC Nuggets $4.69, Kids' 4 PC. Spicy Nuggets $4.69, Kids' Hamburger $4.19, Kids' Cheeseburger $4.49, Kids' 2 PC. Tenders $5.99. Calories shown are default meal totals (Jr Fries + Milk + toy). Page: /wendys-kids-menu.
- Price Calculator page — DONE. /wendys-price-calculator, 135 priced items, totals computed in code from menu.json only.
- Still missing:
  - Allergen Guide page — DONE 27 Nov 2026 (/wendys-allergens, 4 items verified, rest pending audit above).
  - Flagship "Wendy's Prices 2026" pattern — /wendys-menu-prices is a category listing only. Still missing: stat tiles, at-a-glance table, group-cost table, "how to pay less", 13 FAQs, methodology section.

## 6. Monthly re-check (1st of each month)
- Re-check all 135 verified prices at 799 S. High St, Columbus, OH on order.wendys.com.
- Update `menu.json` meta.price_checked / data_date and the "Checked" label on every page.
- Re-check breakfast prices in the morning, and re-check Frosty-ccino.
- Do not change a price from a competitor site or a national average.

Last updated: 27 Nov 2026, from menu.json checked 22–27 Nov 2026.
