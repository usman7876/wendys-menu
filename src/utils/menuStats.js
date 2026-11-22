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
  { test: (n) => n.includes('Baked Potato'), src: '/images/baked-potato.jpg' },
  { test: (n) => n.startsWith('Baconator Fries'), src: '/images/baconator-fries.jpg' },
  { test: (n) => n.startsWith("Dave's Single"), src: '/images/daves-single.jpg' },
  { test: (n) => n === 'Baconator', src: '/images/baconator.jpg' },
  { test: (n) => n.startsWith('Spicy Chicken Sandwich'), src: '/images/spicy-chicken-sandwich.jpg' },
  { test: (n) => n.startsWith('Classic Chicken Sandwich'), src: '/images/classic-chicken-sandwich.jpg' },
  { test: (n) => n.startsWith('Chicken Nuggets'), src: '/images/chicken-nuggets.jpg' },
  { test: (n) => n.startsWith('Natural-Cut Fries'), src: '/images/natural-cut-fries.jpg' },
  { test: (n) => n.startsWith('Chili —'), src: '/images/chili.jpg' },
  { test: (n) => n.startsWith('Breakfast Baconator'), src: '/images/breakfast-baconator.jpg' },
  { test: (n) => n.startsWith('Sausage, Egg & Cheese Biscuit'), src: '/images/sausage-egg-cheese-biscuit.jpg' },
  { test: (n) => n.startsWith('Classic Chocolate Frosty'), src: '/images/classic-chocolate-frosty.jpg' },
  { test: (n) => n.startsWith('Vanilla Frosty'), src: '/images/vanilla-frosty.jpg' },
  { test: (n) => n.includes('Frosty Fusion'), src: '/images/frosty-fusion.jpg' },
  { test: (n) => n.startsWith('Coca-Cola Freestyle'), src: '/images/freestyle.jpg' },
  { test: (n) => n.includes('Lemonade'), src: '/images/lemonade.jpg' },
  { test: (n) => n.includes('Cold Brew'), src: '/images/cold-brew.jpg' },
  { test: (n) => n.startsWith('Regular Hot Coffee'), src: '/images/hot-coffee.jpg' },
];
export function itemPhoto(name) {
  const match = PHOTOS.find((p) => p.test(name));
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
