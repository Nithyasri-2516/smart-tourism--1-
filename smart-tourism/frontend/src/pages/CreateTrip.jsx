import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API, { errMsg } from "../services/api";
import { useApp } from "../context/AppContext";
import SmartImg from "../components/SmartImg";
import EmptyState from "../components/EmptyState";
import { addDays, daysBetween, inr } from "../services/helpers";

export default function CreateTrip() {
  const { user, toast, draft, clearDraft } = useApp();
  const navigate = useNavigate();
  const prefs = JSON.parse(sessionStorage.getItem("tripPrefs") || "{}");
  const today = new Date().toISOString().slice(0, 10);
  const [dests, setDests] = useState([]);
  const [places, setPlaces] = useState([]);
  const firstDest = prefs.destination || draft[0]?.destination || "";
  const [f, setF] = useState({ tripName: "", destination: firstDest, startDate: prefs.startDate || today, endDate: prefs.endDate || addDays(today, 3), travelers: prefs.travelers || 2, budget: prefs.budget || 25000 });
  const [selected, setSelected] = useState(draft.filter((d) => d.destination === firstDest).map((d) => d._id));
  const [busy, setBusy] = useState(false);

  useEffect(() => { API.get("/destinations").then((r) => setDests(r.data)).catch((e) => toast(errMsg(e), "error")); /* eslint-disable-next-line */ }, []);
  useEffect(() => {
    if (!f.destination) return setPlaces([]);
    API.get(`/places?destination=${f.destination}`).then((r) => setPlaces(r.data)).catch((e) => toast(errMsg(e), "error"));
    // eslint-disable-next-line
  }, [f.destination]);

  const pickDest = (id) => { setF({ ...f, destination: id }); setSelected(draft.filter((d) => d.destination === id).map((d) => d._id)); };
  const toggle = (id) => setSelected(selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id]);
  const days = daysBetween(f.startDate, f.endDate);

  const submit = async () => {
    if (!f.tripName.trim() || !f.destination || !f.startDate || !f.endDate) return toast("Please fill all required fields", "error");
    if (f.endDate < f.startDate) return toast("End date cannot be before start date", "error");
    try {
      setBusy(true);
      const { data } = await API.post("/trips", { ...f, user: user._id, places: selected });
      clearDraft();
      toast("Trip created successfully");
      navigate(`/itinerary/${data._id}`);
    } catch (e) { toast(errMsg(e), "error"); } finally { setBusy(false); }
  };

  return (
    <div className="page">
      <div className="page-head warm"><div className="container"><h1>Create your trip 🧳</h1><p className="fs-5 opacity-75 mb-0">We will turn your places into a day-wise itinerary.</p></div></div>
      <div className="container overlap">
        <div className="panel"><div className="row g-3">
          <div className="col-md-6"><label className="form-label">Trip Name *</label><input className="form-control" placeholder="Summer escape" value={f.tripName} onChange={(e) => setF({ ...f, tripName: e.target.value })} /></div>
          <div className="col-md-6"><label className="form-label">Destination *</label><select className="form-select" value={f.destination} onChange={(e) => pickDest(e.target.value)}><option value="">Choose a destination</option>{dests.map((d) => <option key={d._id} value={d._id}>{d.name}</option>)}</select></div>
          <div className="col-6 col-md-3"><label className="form-label">Start Date *</label><input type="date" className="form-control" value={f.startDate} onChange={(e) => setF({ ...f, startDate: e.target.value, endDate: f.endDate < e.target.value ? e.target.value : f.endDate })} /></div>
          <div className="col-6 col-md-3"><label className="form-label">End Date *</label><input type="date" className="form-control" min={f.startDate} value={f.endDate} onChange={(e) => setF({ ...f, endDate: e.target.value })} /></div>
          <div className="col-6 col-md-3"><label className="form-label">Travelers</label><div className="stepper"><button type="button" onClick={() => setF({ ...f, travelers: Math.max(1, f.travelers - 1) })}>−</button><span>{f.travelers}</span><button type="button" onClick={() => setF({ ...f, travelers: f.travelers + 1 })}>+</button></div></div>
          <div className="col-6 col-md-3"><label className="form-label">Duration</label><div className="pill blue fs-6">{days} days</div></div>
          <div className="col-12 range-wrap"><label className="form-label">Budget: <b className="price">{inr(f.budget)}</b></label><input type="range" min="5000" max="200000" step="1000" value={f.budget} onChange={(e) => setF({ ...f, budget: Number(e.target.value) })} /></div>
        </div></div>

        <div className="panel">
          <h5>📍 Selected Places <span className="pill">{selected.length}</span></h5>
          {!f.destination ? <EmptyState icon="🧭" title="Choose a destination first" text="Places will appear here." /> : places.length === 0 ? <EmptyState title="No tourist places found" text="This destination has no places yet." /> : (
            <div className="row g-3">
              {places.map((p) => {
                const on = selected.includes(p._id);
                return (
                  <div className="col-sm-6 col-lg-4" key={p._id}>
                    <div className="recent-item" style={{ cursor: "pointer", border: on ? "3px solid var(--lagoon)" : "3px solid transparent" }} onClick={() => toggle(p._id)} role="checkbox" aria-checked={on} tabIndex={0} onKeyDown={(e) => e.key === "Enter" && toggle(p._id)}>
                      <SmartImg src={p.image} alt="" style={{ width: 64, height: 64, borderRadius: 12, objectFit: "cover" }} />
                      <div className="flex-grow-1"><b>{p.name}</b><div className="small text-muted">{p.category} · {p.duration}</div></div>
                      <span style={{ fontSize: "1.4rem" }}>{on ? "✅" : "⬜"}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <div className="text-center"><button className="btn-travel fs-5" disabled={busy} onClick={submit}>{busy ? "Creating..." : "✈️ Create Trip & Generate Itinerary"}</button></div>
      </div>
    </div>
  );
}
