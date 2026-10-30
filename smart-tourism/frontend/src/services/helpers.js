export const inr = (n) => "₹" + Number(n || 0).toLocaleString("en-IN");
export const fmtDate = (d) => (d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "-");
export const toInputDate = (d) => (d ? new Date(d).toISOString().slice(0, 10) : "");
export const daysBetween = (a, b) => (a && b ? Math.max(1, Math.round((new Date(b) - new Date(a)) / 86400000) + 1) : 1);
export const addDays = (date, n) => { const d = new Date(date); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); };
export const greeting = () => { const h = new Date().getHours(); return h < 12 ? "Good Morning" : h < 17 ? "Good Afternoon" : "Good Evening"; };
export const idOf = (v) => (v && typeof v === "object" ? v._id : v);
// "09:30 AM" <-> "09:30"
export const to24 = (t = "") => {
  const m = t.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!m) return "09:00";
  let h = Number(m[1]) % 12; if (m[3].toUpperCase() === "PM") h += 12;
  return `${String(h).padStart(2, "0")}:${m[2]}`;
};
export const to12 = (t = "09:00") => {
  const [H, M] = t.split(":").map(Number);
  return `${String(H % 12 || 12).padStart(2, "0")}:${String(M).padStart(2, "0")} ${H >= 12 ? "PM" : "AM"}`;
};
export const minutes = (t) => { const [h, m] = to24(t).split(":").map(Number); return h * 60 + m; };
