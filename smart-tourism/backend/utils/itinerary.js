// Builds a simple day-wise itinerary from a list of places.
const uid = () => Math.random().toString(36).slice(2, 9);
const act = (time, title, note = "") => ({ id: uid(), time, title, note });

function generateItinerary(places, days) {
  days = Math.max(1, days);
  const perDay = Math.min(4, Math.max(1, Math.ceil(places.length / days)));
  const slots = ["10:30 AM", "03:00 PM", "06:00 PM", "07:30 PM"];
  const result = [];
  let idx = 0;
  for (let d = 1; d <= days; d++) {
    const list = [];
    list.push(d === 1 ? act("09:00 AM", "Hotel Check-in", "Drop luggage and freshen up") : act("08:30 AM", "Breakfast", "Start the day with local breakfast"));
    const todays = places.slice(idx, idx + perDay);
    idx += perDay;
    todays.forEach((p, i) => {
      list.push(act(slots[i], `${p.name} Visit`, p.duration ? `Plan about ${p.duration}` : ""));
      if (i === 0) list.push(act("01:00 PM", "Lunch", "Try regional specialities"));
    });
    if (!todays.length) {
      list.push(act("11:00 AM", "Free exploration", "Walk around local markets and cafes"));
      list.push(act("01:00 PM", "Lunch"));
    }
    list.push(d === days ? act("08:30 PM", "Dinner & check-out prep", "Pack and get ready for departure") : act("08:30 PM", "Dinner"));
    result.push({ day: d, activities: list });
  }
  return result;
}
module.exports = { generateItinerary, uid };
