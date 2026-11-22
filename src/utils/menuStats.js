// Shared helpers for the verified menu data.
// Every figure comes from src/data/menu.json. Nothing is invented here:
// a missing value stays null and the page renders "Not verified yet".

export function formatPrice(price) {
  if (price === null || price === undefined) return null;
  return `$${price.toFixed(2)}`;
}

export function categories(items) {
  const seen = [];
  for (const item of items) {
    if (!seen.includes(item.category)) seen.push(item.category);
  }
  return seen;
}

export function itemsByCategory(items) {
  const out = {};
  for (const cat of categories(items)) {
    out[cat] = items.filter((i) => i.category === cat);
  }
  return out;
}

export function hasVerifiedCalories(item) {
  return item.calories !== null || item.calories_low !== undefined;
}

export function caloriesLabel(item) {
  if (item.calories_low !== undefined && item.calories_high !== undefined) {
    return item.calories_low === item.calories_high
      ? `${item.calories_low} Cal`
      : `${item.calories_low}–${item.calories_high} Cal`;
  }
  if (item.calories !== null && item.calories !== undefined) return `${item.calories} Cal`;
  return null;
}

export function countVerifiedPrices(items) {
  return items.filter((i) => i.price !== null).length;
}

export function countVerifiedCalories(items) {
  return items.filter(hasVerifiedCalories).length;
}

export function countBreakfast(items) {
  return items.filter((i) => i.category === 'Breakfast').length;
}

export function lowestCalorie(items) {
  const withCal = items.filter((i) => i.calories !== null);
  return withCal.reduce((a, b) => (b.calories < a.calories ? b : a), withCal[0]);
}

export function highestCalorie(items) {
  const withCal = items.filter((i) => i.calories !== null);
  return withCal.reduce((a, b) => (b.calories > a.calories ? b : a), withCal[0]);
}

export function caloriesByCategory(items) {
  return categories(items).map((cat) => {
    const inCat = items.filter((i) => i.category === cat);
    return {
      category: cat,
      total: inCat.length,
      verified: inCat.filter(hasVerifiedCalories).length,
    };
  });
}

// Per-category header stats, computed from the data only: item count,
// verified price range (min/max of verified prices only) and the average
// Price ranges: the data structure supports a low/high/median price collected
// from many restaurants. All three are null for now (one restaurant only),
// so every item still shows its single verified price. When a range exists,
// it renders "$low–$high" with the median after it; a missing price stays
// null and the page renders "Not verified yet".
export function categorySlug(category) {
  const slugs = {
    Burgers: 'wendys-burgers-menu',
    Chicken: 'wendys-chicken-menu',
    Breakfast: 'wendys-breakfast-menu',
    Sides: 'wendys-sides-menu',
    Desserts: 'wendys-desserts-menu',
    Drinks: 'wendys-drinks-menu',
  };
  return slugs[category] || 'wendys-menu-prices';
}

// Single calorie figure for an item, or null: a range counts as its
// midpoint for averages, and as its low/high ends for min/max.
export function calorieLow(item) {
  if (item.calories !== null && item.calories !== undefined) return item.calories;
  if (item.calories_low !== undefined) return item.calories_low;
  return null;
}
export function calorieHigh(item) {
  if (item.calories !== null && item.calories !== undefined) return item.calories;
  if (item.calories_high !== undefined) return item.calories_high;
  return null;
}
export function calorieMid(item) {
  const lo = calorieLow(item);
  const hi = calorieHigh(item);
  if (lo === null || hi === null) return null;
  return (lo + hi) / 2;
}

// Per-category calorie overview, computed from the data only: verified
// count, range (lowest low to highest high), average of midpoints, and
// the lowest- and highest-calorie items in the category.
export function categoryCalorieStats(items) {
  const out = {};
  for (const cat of categories(items)) {
    const inCat = items.filter((i) => i.category === cat);
    const lows = inCat.map(calorieLow).filter((c) => c !== null);
    const highs = inCat.map(calorieHigh).filter((c) => c !== null);
    const mids = inCat.map(calorieMid).filter((c) => c !== null);
    const lowestItem = inCat
      .filter((i) => calorieLow(i) !== null)
      .reduce((a, b) => (calorieLow(b) < calorieLow(a) ? b : a), inCat.find((i) => calorieLow(i) !== null));
    const highestItem = inCat
      .filter((i) => calorieHigh(i) !== null)
      .reduce((a, b) => (calorieHigh(b) > calorieHigh(a) ? b : a), inCat.find((i) => calorieHigh(i) !== null));
    out[cat] = {
      count: inCat.length,
      verified: lows.length,
      minCalories: lows.length ? Math.min(...lows) : null,
      maxCalories: highs.length ? Math.max(...highs) : null,
      avgCalories: mids.length
        ? Math.round(mids.reduce((a, b) => a + b, 0) / mids.length)
        : null,
      lowest: lowestItem ?? null,
      highest: highestItem ?? null,
    };
  }
  return out;
}

export function formatPriceRange(item) {
  if (item.price_low !== null && item.price_low !== undefined &&
      item.price_high !== null && item.price_high !== undefined) {
    const range = `${formatPrice(item.price_low)}–${formatPrice(item.price_high)}`;
    if (item.price_median !== null && item.price_median !== undefined) {
      return `${range} · median ${formatPrice(item.price_median)}`;
    }
    return range;
  }
  return formatPrice(item.price);
}

// Photos match their dish exactly, by name. The order matters: the most
// specific names are checked first (Baconator Fries before Baconator,
// Baked Potato before Chili, so "Chili & Cheese Baked Potato" gets the
// baked-potato photo). An item with no match gets null — the card is shown
// with no photo, never a placeholder and never another dish's photo.
const PHOTOS = [
  { test: (n) => n.includes('Baked Potato'), src: '/images/baked-potato.webp' },
  { test: (n) => n.startsWith('Baconator Fries'), src: '/images/baconator-fries.webp' },
  { test: (n) => n.startsWith('Chili Cheese Fries'), src: '/images/chili-cheese-fries.webp' },
  { test: (n) => n.startsWith('Cheese Fries'), src: '/images/cheese-fries.webp' },
  { test: (n) => n.startsWith('Family Chili'), src: '/images/family-chili.webp' },
  { test: (n) => n.startsWith('Apple Bites'), src: '/images/apple-bites.webp' },
  { test: (n) => n.startsWith('Homestyle French Toast Sticks'), src: '/images/homestyle-french-toast-sticks.webp' },
  { test: (n) => n.startsWith('Honey Butter Biscuit'), src: '/images/honey-butter-biscuit.webp' },
  { test: (n) => n.startsWith('Sausage Biscuit'), src: '/images/sausage-biscuit.webp' },
  { test: (n) => n.startsWith("Dave's Single"), src: '/images/daves-single.webp' },
  { test: (n) => n.startsWith("Dave's Double"), src: '/images/daves-double.webp' },
  { test: (n) => n === 'Baconator', src: '/images/baconator.webp' },
  { test: (n) => n.startsWith('Spicy Chicken Sandwich'), src: '/images/spicy-chicken-sandwich.webp' },
  { test: (n) => n.startsWith('Classic Chicken Sandwich'), src: '/images/classic-chicken-sandwich.webp' },
  { test: (n) => n.startsWith('Chicken Nuggets'), src: '/images/chicken-nuggets.webp' },
  { test: (n) => n.startsWith('Natural-Cut Fries'), src: '/images/natural-cut-fries.webp' },
  { test: (n) => n.startsWith('Chili —'), src: '/images/chili.webp' },
  { test: (n) => n.startsWith('Breakfast Baconator'), src: '/images/breakfast-baconator.webp' },
  { test: (n) => n.startsWith('Sausage, Egg & Cheese Biscuit'), src: '/images/sausage-egg-cheese-biscuit.webp' },
  { test: (n) => n.startsWith('Bacon, Egg & Cheese Biscuit'), src: '/images/bacon-egg-cheese-biscuit.webp' },
  { test: (n) => n.startsWith('Sausage, Egg & Swiss Croissant'), src: '/images/sausage-egg-swiss-croissant.webp' },
  { test: (n) => n.startsWith('Bacon, Egg & Swiss Croissant'), src: '/images/bacon-egg-swiss-croissant.webp' },
  { test: (n) => n.startsWith('Seasoned Potatoes'), src: '/images/seasoned-potatoes.webp' },
  { test: (n) => n.startsWith('Classic Chocolate Frosty'), src: '/images/classic-chocolate-frosty.webp' },
  { test: (n) => n.startsWith('Vanilla Frosty'), src: '/images/vanilla-frosty.webp' },
  { test: (n) => n.includes('Peppermint Frosty Swirl') && n.includes('Vanilla'), src: '/images/frosty-swirl-peppermint-vanilla.webp' },
  { test: (n) => n.includes('Peppermint Frosty Swirl') && n.includes('Chocolate'), src: '/images/frosty-swirl-peppermint-chocolate.webp' },
  { test: (n) => n.includes('Brownie Batter Frosty Swirl') && n.includes('Vanilla'), src: '/images/frosty-swirl-brownie-batter-vanilla.webp' },
  { test: (n) => n.includes('Brownie Batter Frosty Swirl') && n.includes('Chocolate'), src: '/images/frosty-swirl-brownie-batter-chocolate.webp' },
  { test: (n) => n.includes('Strawberry Frosty Swirl') && n.includes('Vanilla'), src: '/images/frosty-swirl-strawberry-vanilla.webp' },
  { test: (n) => n.includes('Strawberry Frosty Swirl') && n.includes('Chocolate'), src: '/images/frosty-swirl-strawberry-chocolate.webp' },
  { test: (n) => n.includes('Caramel Frosty Swirl') && n.includes('Vanilla'), src: '/images/frosty-swirl-caramel-vanilla.webp' },
  { test: (n) => n.includes('Caramel Frosty Swirl') && n.includes('Chocolate'), src: '/images/frosty-swirl-caramel-chocolate.webp' },
  { test: (n) => n.includes('Frosty Fusion'), src: '/images/frosty-fusion.webp' },
  { test: (n) => n.startsWith('Cinnabon Pull-Apart'), src: '/images/cinnabon-pull-apart.webp' },
  { test: (n) => n.startsWith('Chocolate Chunk Cookie'), src: '/images/chocolate-chunk-cookie.webp' },
  { test: (n) => n.startsWith('Sugar Cookie'), src: '/images/sugar-cookie.webp' },
  { test: (n) => n.startsWith('5 for $5 Cookie Bundle'), src: '/images/five-cookie-bundle.webp' },
  { test: (n) => n.startsWith('Coca-Cola Freestyle'), src: '/images/freestyle.webp' },
  { test: (n) => n === 'Coca-Cola', src: '/images/coca-cola.webp' },
  { test: (n) => n === 'Coca-Cola Zero Sugar', src: '/images/coke-zero-sugar.webp' },
  { test: (n) => n === 'Diet Coke', src: '/images/diet-coke.webp' },
  { test: (n) => n.startsWith('Sprite Watermelon'), src: '/images/sprite-watermelon.webp' },
  { test: (n) => n === 'Sprite', src: '/images/sprite.webp' },
  { test: (n) => n === 'Dr Pepper', src: '/images/dr-pepper.webp' },
  { test: (n) => n === 'Diet Dr Pepper', src: '/images/diet-dr-pepper.webp' },
  { test: (n) => n === "Barq's Root Beer", src: '/images/barqs-root-beer.webp' },
  { test: (n) => n === 'Fanta Orange', src: '/images/fanta-orange.webp' },
  { test: (n) => n === 'Hi-C Flashin\' Fruit Punch', src: '/images/hi-c-flashin-fruit-punch.webp' },
  { test: (n) => n.startsWith('Watermelon Sparkling Energy'), src: '/images/watermelon-sparkling-energy.webp' },
  { test: (n) => n.startsWith('Pineapple Citrus Sparkling Energy'), src: '/images/pineapple-citrus-sparkling-energy.webp' },
  { test: (n) => n.startsWith('Pure Life Bottled Water'), src: '/images/pure-life-bottled-water.webp' },
  { test: (n) => n.startsWith('Chocolate Milk'), src: '/images/chocolate-milk.webp' },
  { test: (n) => n === 'Milk', src: '/images/milk.webp' },
  { test: (n) => n.startsWith('Honest Kids Fruit Punch'), src: '/images/honest-kids-fruit-punch.webp' },
  { test: (n) => n.startsWith('Simply Orange Juice'), src: '/images/simply-orange-juice.webp' },
  { test: (n) => n.includes('Lemonade'), src: '/images/lemonade.webp' },
  { test: (n) => n.includes('Cold Brew'), src: '/images/cold-brew.webp' },
  { test: (n) => n.startsWith('Regular Hot Coffee'), src: '/images/hot-coffee.webp' },
];
export function itemPhoto(name) {
  const match = PHOTOS.find((p) => p.test(name));
  return match ? match.src : null;
}

// Photos for deal bundles, combos and value items, which are not in the
// 150-item menu list. Exact names only — a combo is a sandwich + fries +
// drink, so it gets its own photo, never the single sandwich's photo.
const DEAL_PHOTOS = [
  { name: 'Biggie Bites', src: '/images/biggie-bites.webp' },
  { name: 'Jr. Cheeseburger Biggie Bag', src: '/images/biggie-bag-jr-cheeseburger.webp' },
  { name: 'Crispy Chicken Biggie Bag', src: '/images/biggie-bag-crispy-chicken.webp' },
  { name: 'Double Stack Biggie Bag', src: '/images/biggie-bag-double-stack.webp' },
  { name: 'Jr. Bacon Cheeseburger Biggie Bag', src: '/images/biggie-bag-jr-bacon-cheeseburger.webp' },
  { name: 'Biggie Bundle', src: '/images/biggie-bundle.webp' },
  { name: 'Jr. Hamburger', src: '/images/ev-jr-hamburger.webp' },
  { name: 'Jr. Cheeseburger', src: '/images/ev-jr-cheeseburger.webp' },
  { name: 'Crispy Chicken Sandwich', src: '/images/ev-crispy-chicken-sandwich.webp' },
  { name: 'Jr. Cheeseburger Deluxe', src: '/images/ev-jr-cheeseburger-deluxe.webp' },
  { name: 'Crispy Chicken BLT', src: '/images/ev-crispy-chicken-blt.webp' },
  { name: 'Jr. Bacon Cheeseburger', src: '/images/ev-jr-bacon-cheeseburger.webp' },
  { name: 'Double Stack', src: '/images/ev-double-stack.webp' },
  { name: 'Bacon Double Stack', src: '/images/ev-bacon-double-stack.webp' },
  { name: "Dave's Combo", src: '/images/combo-daves.webp' },
  { name: '10 PC Chicken Nugget Combo', src: '/images/combo-10pc-nuggets.webp' },
  { name: 'Son of Baconator Combo', src: '/images/combo-son-of-baconator.webp' },
  { name: 'Classic Chicken Sandwich Combo', src: '/images/combo-classic-chicken.webp' },
  { name: 'Spicy Chicken Sandwich Combo', src: '/images/combo-spicy-chicken.webp' },
  { name: 'Grilled Chicken Wrap Combo', src: '/images/combo-grilled-chicken-wrap.webp' },
  { name: '3 PC Tenders Combo', src: '/images/combo-3pc-tenders.webp' },
  { name: 'Big Bacon Classic Combo', src: '/images/combo-big-bacon-classic.webp' },
  { name: 'Asiago Ranch Club Sandwich, Classic Combo', src: '/images/combo-asiago-ranch-club.webp' },
  { name: '4 PC Tenders Combo', src: '/images/combo-4pc-tenders.webp' },
  { name: 'Baconator Combo', src: '/images/combo-baconator.webp' },
  { name: 'Frosty Key Tag', src: '/images/frosty-key-tag.webp' },
  { name: 'Holiday Box', src: '/images/holiday-box.webp' },
];
export function dealPhoto(name) {
  const match = DEAL_PHOTOS.find((p) => p.name === name);
  return match ? match.src : null;
}
export function categoryStats(items) {
  const out = {};
  for (const cat of categories(items)) {
    const inCat = items.filter((i) => i.category === cat);
    const prices = inCat
      .filter((i) => i.price !== null && i.price !== undefined)
      .map((i) => i.price);
    const cals = inCat
      .map((i) => {
        if (i.calories !== null && i.calories !== undefined) return i.calories;
        if (i.calories_low !== undefined && i.calories_high !== undefined) {
          return (i.calories_low + i.calories_high) / 2;
        }
        return null;
      })
      .filter((c) => c !== null);
    out[cat] = {
      count: inCat.length,
      minPrice: prices.length ? Math.min(...prices) : null,
      maxPrice: prices.length ? Math.max(...prices) : null,
      avgCalories: cals.length
        ? Math.round(cals.reduce((a, b) => a + b, 0) / cals.length)
        : null,
    };
  }
  return out;
}

// URL-safe slug for a dish name, used for the card's id attribute and for
// the ItemList structured data (page URL + #item-<slug>).
export function itemSlug(name) {
  return name
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// The six popular items shown on the homepage, from the same verified data.
export function popularItems(items) {
  const popularNames = [
    "Dave's Single",
    'Baconator',
    'Spicy Chicken Sandwich',
    'Chicken Nuggets — 6 pc',
    'Classic Chocolate Frosty — Small',
    'Natural-Cut Fries — Medium',
  ];
  return popularNames.map((name) => items.find((i) => i.name === name)).filter(Boolean);
}
