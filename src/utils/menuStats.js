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
// verified calories. For a calorie range (e.g. Coca-Cola Freestyle 0–434)
// the midpoint stands in for the average. A category with no verified
// prices gets minPrice/maxPrice null; one with no verified calories gets
// avgCalories null. Nothing here is hard-coded or estimated from outside.
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
