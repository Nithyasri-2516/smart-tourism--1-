// Simple rule-based recommender. Each rule returns points; the total is a 0-100 match.
// To plug in an ML model later, replace `scorePlace` (or call your model inside `recommend`).
const lower = (arr = []) => arr.map((s) => String(s).toLowerCase());

function scorePlace(place, prefs) {
  const { destination, interests = [], activities = [], budget = 0, days = 1, travelers = 1, travelStyle = "Standard" } = prefs;
  let score = 0;

  // 1. Destination match (25)
  const destId = String(place.destination?._id || place.destination);
  score += destination ? (destId === String(destination) ? 25 : 5) : 15;

  // 2. Interest match (30): category (20) + activity/tag overlap (10)
  const wanted = lower(interests);
  if (wanted.length) score += wanted.includes(String(place.category).toLowerCase()) ? 20 : 4;
  else score += 10;
  const tagSet = lower(place.tags);
  const acts = lower(activities).concat(wanted);
  const overlap = acts.filter((a) => tagSet.includes(a)).length;
  score += Math.min(10, overlap * 5);

  // 3. Budget (20): cost per person per day compared to the budget available
  if (budget > 0) {
    const perPersonPerDay = budget / Math.max(travelers, 1) / Math.max(days, 1);
    const ratio = (place.estimatedCost || 0) / Math.max(perPersonPerDay, 1);
    score += ratio <= 0.5 ? 20 : ratio <= 1 ? 15 : ratio <= 2 ? 8 : 2;
  } else score += 12;

  // 4. Rating (15)
  score += ((place.rating || 0) / 5) * 15;

  // 5. Travel style (5) and number of days (5)
  const cost = place.estimatedCost || 0;
  score += travelStyle === "Budget" ? (cost <= 1000 ? 5 : 2) : travelStyle === "Standard" ? (cost <= 3000 ? 5 : 3) : 5;
  const hours = parseFloat(String(place.duration).replace(/[^0-9.]/g, "")) || 2;
  score += days >= 2 || hours <= 4 ? 5 : 2;

  return Math.max(35, Math.min(99, Math.round(score)));
}

function recommend(places, prefs, limit = 12) {
  return places
    .map((p) => ({ ...(p.toObject ? p.toObject() : p), match: scorePlace(p, prefs) }))
    .sort((a, b) => b.match - a.match)
    .slice(0, limit);
}
module.exports = { scorePlace, recommend };
