import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API, { errMsg } from "../services/api";
import { useApp } from "../context/AppContext";
import InterestPicker from "../components/InterestPicker";
import { ACCOMMODATION, ACTIVITIES, STYLES, TRANSPORT, budgetValue } from "../data/destinations";
import { addDays, daysBetween, inr } from "../services/helpers";

export default function Preferences() {
  const { user, toast } = useApp();
  const navigate = useNavigate();
  const [dests, setDests] = useState([]);
  const saved = JSON.parse(sessionStorage.getItem("tripPrefs") || "{}");
  const today = new Date().toISOString().slice(0, 10);
  const [f, setF] = useState({
    destination: "", startDate: today, endDate: addDays(today, 3), days: 4, travelers: 2,
    budget: budgetValue(user.budgetPreference) || 25000, travelStyle: user.travelStyle || "Standard", interests: user.interests || [],
    accommodation: "3 Star", transportation: "Cab", activities: ["Sightseeing"], ...saved,
  });
  useEffect(() => { API.get("/destinations").then((r) => setDests(r.data)).catch((e) => toast(errMsg(e), "error")); /* eslint-disable-next-line */ }, []);

  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));
  const setStart = (v) => setF((p) => ({ ...p, startDate: v, endDate: p.endDate < v ? v : p.endDate, days: daysBetween(v, p.endDate < v ? v : p.endDate) }));
  const setEnd = (v) => setF((p) => ({ ...p, endDate: v, days: daysBetween(p.startDate, v) }));
  const setDays = (n) => { n = Math.max(1, Math.min(30, n)); setF((p) => ({ ...p, days: n, endDate: addDays(p.startDate, n - 1) })); };
  const toggleAct = (a) => set("activities", f.activities.includes(a) ? f.activities.filter((x) => x !== a) : [...f.activities, a]);

  const submit = () => {
    if (!f.destination) return toast("Please select a destination", "error");
    if (!f.startDate || !f.endDate) return toast("Please fill all required fields", "error");
    sessionStorage.setItem("tripPrefs", JSON.stringify(f));
    navigate("/recommendations");
  };

  return (
    <div className="page">
      <div className="page-head blue"><div className="container"><h1>Plan your perfect trip ✈️</h1><p className="fs-5 opacity-75 mb-0">Share your preferences and get smart recommendations.</p></div></div>
      <div className="container overlap">
        <div className="panel">
          <h5>📍 Where and when</h5>
          <div className="row g-3">
            <div className="col-md-6"><label className="form-label">Destination *</label>
              <select className="form-select" value={f.destination} onChange={(e) => set("destination", e.target.value)}><option value="">Choose a destination</option>{dests.map((d) => <option key={d._id} value={d._id}>{d.name} – {d.location}</option>)}</select></div>
            <div className="col-6 col-md-3"><label className="form-label">Start date</label><input type="date" className="form-control" min={today} value={f.startDate} onChange={(e) => setStart(e.target.value)} /></div>
            <div className="col-6 col-md-3"><label className="form-label">End date</label><input type="date" className="form-control" min={f.startDate} value={f.endDate} onChange={(e) => setEnd(e.target.value)} /></div>
            <div className="col-6 col-md-3"><label className="form-label">Number of days</label>
              <div className="stepper"><button type="button" onClick={() => setDays(f.days - 1)}>−</button><span>{f.days}</span><button type="button" onClick={() => setDays(f.days + 1)}>+</button></div></div>
            <div className="col-6 col-md-3"><label className="form-label">Travelers</label>
              <div className="stepper"><button type="button" onClick={() => set("travelers", Math.max(1, f.travelers - 1))}>−</button><span>{f.travelers}</span><button type="button" onClick={() => set("travelers", Math.min(20, f.travelers + 1))}>+</button></div></div>
            <div className="col-md-6 range-wrap"><label className="form-label">Budget: <b className="price">{inr(f.budget)}</b></label>
              <input type="range" min="5000" max="200000" step="1000" value={f.budget} onChange={(e) => set("budget", Number(e.target.value))} />
              <div className="d-flex justify-content-between small text-muted"><span>₹5,000</span><span>₹2,00,000</span></div></div>
          </div>
        </div>

        <div className="panel"><h5>💼 Travel style</h5>
          <div className="row g-3">{STYLES.map((s) => <div className="col-4" key={s.id}><button type="button" className={"pick big" + (f.travelStyle === s.id ? " on" : "")} style={f.travelStyle === s.id ? { background: "var(--lagoon)" } : {}} onClick={() => set("travelStyle", s.id)}><span className="e">{s.emoji}</span>{s.id}<small className="d-block fw-normal">{s.text}</small></button></div>)}</div></div>

        <div className="panel"><h5>🎯 Interests</h5><InterestPicker value={f.interests} onChange={(v) => set("interests", v)} /></div>

        <div className="panel">
          <div className="row g-4">
            <div className="col-md-6"><h5>🏨 Accommodation</h5>
              {ACCOMMODATION.map((a) => <label key={a} className="form-check d-block mb-2"><input type="radio" className="form-check-input" name="acc" checked={f.accommodation === a} onChange={() => set("accommodation", a)} /> <span className="form-check-label">{a}</span></label>)}</div>
            <div className="col-md-6"><h5>🚗 Transportation</h5>
              {TRANSPORT.map((a) => <label key={a} className="form-check d-block mb-2"><input type="radio" className="form-check-input" name="trans" checked={f.transportation === a} onChange={() => set("transportation", a)} /> <span className="form-check-label">{a}</span></label>)}</div>
          </div>
        </div>

        <div className="panel"><h5>🎈 Preferred activities</h5>
          <div className="d-flex flex-wrap gap-2">{ACTIVITIES.map((a) => <span key={a} className={"check-pill" + (f.activities.includes(a) ? " on" : "")} onClick={() => toggleAct(a)} role="checkbox" aria-checked={f.activities.includes(a)} tabIndex={0} onKeyDown={(e) => e.key === "Enter" && toggleAct(a)}>{f.activities.includes(a) ? "✓" : "+"} {a}</span>)}</div></div>

        <div className="text-center"><button className="btn-warm fs-5" onClick={submit}>✨ Get Smart Recommendations</button></div>
      </div>
    </div>
  );
}
