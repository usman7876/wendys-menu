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
  { test: (n) => n.includes('Baked Potato'), src: '/images/baked-potato.jpg' },
  { test: (n) => n.startsWith('Baconator Fries'), src: '/images/baconator-fries.jpg' },
  { test: (n) => n.startsWith('Chili Cheese Fries'), src: '/images/chili-cheese-fries.jpg' },
  { test: (n) => n.startsWith('Cheese Fries'), src: '/images/cheese-fries.jpg' },
  { test: (n) => n.startsWith('Family Chili'), src: '/images/family-chili.jpg' },
  { test: (n) => n.startsWith('Apple Bites'), src: '/images/apple-bites.jpg' },
  { test: (n) => n.startsWith('Homestyle French Toast Sticks'), src: '/images/homestyle-french-toast-sticks.jpg' },
  { test: (n) => n.startsWith('Honey Butter Biscuit'), src: '/images/honey-butter-biscuit.jpg' },
  { test: (n) => n.startsWith('Sausage Biscuit'), src: '/images/sausage-biscuit.jpg' },
  { test: (n) => n.startsWith("Dave's Single"), src: '/images/daves-single.jpg' },
  { test: (n) => n.startsWith("Dave's Double"), src: '/images/daves-double.jpg' },
  { test: (n) => n === 'Baconator', src: '/images/baconator.jpg' },
  { test: (n) => n.startsWith('Spicy Chicken Sandwich'), src: '/images/spicy-chicken-sandwich.jpg' },
  { test: (n) => n.startsWith('Classic Chicken Sandwich'), src: '/images/classic-chicken-sandwich.jpg' },
  { test: (n) => n.startsWith('Chicken Nuggets'), src: '/images/chicken-nuggets.jpg' },
  { test: (n) => n.startsWith('Natural-Cut Fries'), src: '/images/natural-cut-fries.jpg' },
  { test: (n) => n.startsWith('Chili —'), src: '/images/chili.jpg' },
  { test: (n) => n.startsWith('Breakfast Baconator'), src: '/images/breakfast-baconator.jpg' },
  { test: (n) => n.startsWith('Sausage, Egg & Cheese Biscuit'), src: '/images/sausage-egg-cheese-biscuit.jpg' },
  { test: (n) => n.startsWith('Bacon, Egg & Cheese Biscuit'), src: '/images/bacon-egg-cheese-biscuit.jpg' },
  { test: (n) => n.startsWith('Sausage, Egg & Swiss Croissant'), src: '/images/sausage-egg-swiss-croissant.jpg' },
  { test: (n) => n.startsWith('Bacon, Egg & Swiss Croissant'), src: '/images/bacon-egg-swiss-croissant.jpg' },
  { test: (n) => n.startsWith('Seasoned Potatoes'), src: '/images/seasoned-potatoes.jpg' },
  { test: (n) => n.startsWith('Classic Chocolate Frosty'), src: '/images/classic-chocolate-frosty.jpg' },
  { test: (n) => n.startsWith('Vanilla Frosty'), src: '/images/vanilla-frosty.jpg' },
  { test: (n) => n.includes('Peppermint Frosty Swirl') && n.includes('Vanilla'), src: '/images/frosty-swirl-peppermint-vanilla.jpg' },
  { test: (n) => n.includes('Peppermint Frosty Swirl') && n.includes('Chocolate'), src: '/images/frosty-swirl-peppermint-chocolate.jpg' },
  { test: (n) => n.includes('Brownie Batter Frosty Swirl') && n.includes('Vanilla'), src: '/images/frosty-swirl-brownie-batter-vanilla.jpg' },
  { test: (n) => n.includes('Brownie Batter Frosty Swirl') && n.includes('Chocolate'), src: '/images/frosty-swirl-brownie-batter-chocolate.jpg' },
  { test: (n) => n.includes('Strawberry Frosty Swirl') && n.includes('Vanilla'), src: '/images/frosty-swirl-strawberry-vanilla.jpg' },
  { test: (n) => n.includes('Strawberry Frosty Swirl') && n.includes('Chocolate'), src: '/images/frosty-swirl-strawberry-chocolate.jpg' },
  { test: (n) => n.includes('Caramel Frosty Swirl') && n.includes('Vanilla'), src: '/images/frosty-swirl-caramel-vanilla.jpg' },
  { test: (n) => n.includes('Caramel Frosty Swirl') && n.includes('Chocolate'), src: '/images/frosty-swirl-caramel-chocolate.jpg' },
  { test: (n) => n.includes('Frosty Fusion'), src: '/images/frosty-fusion.jpg' },
  { test: (n) => n.startsWith('Cinnabon Pull-Apart'), src: '/images/cinnabon-pull-apart.jpg' },
  { test: (n) => n.startsWith('Chocolate Chunk Cookie'), src: '/images/chocolate-chunk-cookie.jpg' },
  { test: (n) => n.startsWith('Sugar Cookie'), src: '/images/sugar-cookie.jpg' },
  { test: (n) => n.startsWith('5 for $5 Cookie Bundle'), src: '/images/five-cookie-bundle.jpg' },
  { test: (n) => n.startsWith('Coca-Cola Freestyle'), src: '/images/freestyle.jpg' },
  { test: (n) => n === 'Coca-Cola', src: '/images/coca-cola.jpg' },
  { test: (n) => n === 'Coca-Cola Zero Sugar', src: '/images/coke-zero-sugar.jpg' },
  { test: (n) => n === 'Diet Coke', src: '/images/diet-coke.jpg' },
  { test: (n) => n.startsWith('Sprite Watermelon'), src: '/images/sprite-watermelon.jpg' },
  { test: (n) => n === 'Sprite', src: '/images/sprite.jpg' },
  { test: (n) => n === 'Dr Pepper', src: '/images/dr-pepper.jpg' },
  { test: (n) => n === 'Diet Dr Pepper', src: '/images/diet-dr-pepper.jpg' },
  { test: (n) => n === "Barq's Root Beer", src: '/images/barqs-root-beer.jpg' },
  { test: (n) => n === 'Fanta Orange', src: '/images/fanta-orange.jpg' },
  { test: (n) => n === 'Hi-C Flashin\' Fruit Punch', src: '/images/hi-c-flashin-fruit-punch.jpg' },
  { test: (n) => n.startsWith('Watermelon Sparkling Energy'), src: '/images/watermelon-sparkling-energy.jpg' },
  { test: (n) => n.startsWith('Pineapple Citrus Sparkling Energy'), src: '/images/pineapple-citrus-sparkling-energy.jpg' },
  { test: (n) => n.startsWith('Pure Life Bottled Water'), src: '/images/pure-life-bottled-water.jpg' },
  { test: (n) => n.startsWith('Chocolate Milk'), src: '/images/chocolate-milk.jpg' },
  { test: (n) => n === 'Milk', src: '/images/milk.jpg' },
  { test: (n) => n.startsWith('Honest Kids Fruit Punch'), src: '/images/honest-kids-fruit-punch.jpg' },
  { test: (n) => n.startsWith('Simply Orange Juice'), src: '/images/simply-orange-juice.jpg' },
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
