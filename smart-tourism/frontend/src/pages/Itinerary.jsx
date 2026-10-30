import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FaPlus, FaEdit, FaTrash, FaArrowUp, FaArrowDown, FaSave, FaMagic } from "react-icons/fa";
import API, { errMsg } from "../services/api";
import { useApp } from "../context/AppContext";
import Loading from "../components/Loading";
import EmptyState from "../components/EmptyState";
import Modal from "../components/Modal";
import { fmtDate, inr, to12, to24, minutes } from "../services/helpers";

const uid = () => Math.random().toString(36).slice(2, 9);

export default function Itinerary() {
  const { id } = useParams();
  const { toast } = useApp();
  const [trip, setTrip] = useState(null);
  const [days, setDays] = useState([]);
  const [dirty, setDirty] = useState(false);
  const [modal, setModal] = useState(null); // {day, act?}
  const [form, setForm] = useState({ time: "09:00", title: "", note: "", day: 1 });
  const [error, setError] = useState(false);

  useEffect(() => {
    API.get(`/trips/${id}`).then((r) => { setTrip(r.data); setDays(r.data.itinerary || []); }).catch((e) => { toast(errMsg(e), "error"); setError(true); });
    // eslint-disable-next-line
  }, [id]);

  if (error) return <div className="container section"><EmptyState icon="🧭" title="Trip not found" /></div>;
  if (!trip) return <Loading text="Loading itinerary..." />;

  const change = (d) => { setDays(d); setDirty(true); };
  const openAdd = (day) => { setForm({ time: "09:00", title: "", note: "", day }); setModal({ day }); };
  const openEdit = (day, a) => { setForm({ time: to24(a.time), title: a.title, note: a.note || "", day }); setModal({ day, act: a }); };

  const saveActivity = () => {
    if (!form.title.trim()) return toast("Please fill all required fields", "error");
    const act = { id: modal.act?.id || uid(), time: to12(form.time), title: form.title, note: form.note };
    change(days.map((d) => {
      if (d.day !== modal.day) return d;
      if (modal.act) return { ...d, activities: d.activities.map((a) => (a.id === act.id ? act : a)) };
      return { ...d, activities: [...d.activities, act].sort((a, b) => minutes(a.time) - minutes(b.time)) };
    }));
    setModal(null);
  };
  const remove = (day, aid) => change(days.map((d) => (d.day === day ? { ...d, activities: d.activities.filter((a) => a.id !== aid) } : d)));
  const move = (day, idx, dir) => change(days.map((d) => {
    if (d.day !== day) return d;
    const arr = [...d.activities]; const j = idx + dir;
    if (j < 0 || j >= arr.length) return d;
    [arr[idx], arr[j]] = [arr[j], arr[idx]];
    return { ...d, activities: arr };
  }));

  const save = async () => {
    try { await API.put(`/trips/${id}`, { itinerary: days }); setDirty(false); toast("Itinerary saved"); } catch (e) { toast(errMsg(e), "error"); }
  };
  const regenerate = async () => {
    if (!window.confirm("Regenerate the itinerary from your places? Your edits will be replaced.")) return;
    try {
      const { data } = await API.post("/trips/itinerary", { placeIds: trip.places.map((p) => p._id), startDate: trip.startDate, endDate: trip.endDate });
      change(data); toast("Itinerary regenerated");
    } catch (e) { toast(errMsg(e), "error"); }
  };

  return (
    <div className="page">
      <div className="page-head blue"><div className="container">
        <h1>{trip.tripName}</h1>
        <p className="fs-5 opacity-75 mb-3">📍 {trip.destination?.name} · {fmtDate(trip.startDate)} → {fmtDate(trip.endDate)} · 👥 {trip.travelers} · 💰 {inr(trip.budget)}</p>
        <div className="d-flex gap-2 flex-wrap">
          <button className="btn-warm" onClick={save} disabled={!dirty}><FaSave /> Save Itinerary</button>
          <button className="btn-ghost" onClick={regenerate}><FaMagic /> Regenerate</button>
          <Link to="/my-trips" className="btn-ghost">← My Trips</Link>
        </div>
      </div></div>
      <div className="container overlap">
        {days.length === 0 ? <EmptyState icon="📅" title="No itinerary yet" text="Generate one from your selected places."><button className="btn-travel" onClick={regenerate}>Generate itinerary</button></EmptyState> : days.map((d) => (
          <div key={d.day} className="panel">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
              <span className="day-tag">DAY {d.day}</span>
              <button className="btn-outline-travel" onClick={() => openAdd(d.day)}><FaPlus /> Add Activity</button>
            </div>
            <div className="timeline mt-2">
              {d.activities.length === 0 && <p className="text-muted">No activities yet.</p>}
              {d.activities.map((a, i) => (
                <div className="t-item" key={a.id}>
                  <div><div className="t-time">{a.time}</div><b>{a.title}</b>{a.note && <div className="small text-muted">{a.note}</div>}</div>
                  <div className="d-flex gap-1">
                    <button className="icon-btn" title="Move up" onClick={() => move(d.day, i, -1)} disabled={i === 0}><FaArrowUp /></button>
                    <button className="icon-btn" title="Move down" onClick={() => move(d.day, i, 1)} disabled={i === d.activities.length - 1}><FaArrowDown /></button>
                    <button className="icon-btn" title="Edit" onClick={() => openEdit(d.day, a)}><FaEdit /></button>
                    <button className="icon-btn danger" title="Delete" onClick={() => remove(d.day, a.id)}><FaTrash /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        {dirty && <div className="text-center"><button className="btn-travel" onClick={save}>💾 Save Itinerary</button></div>}
      </div>

      {modal && (
        <Modal title={modal.act ? "Edit Activity" : `Add Activity – Day ${modal.day}`} onClose={() => setModal(null)}>
          <label className="form-label">Time</label><input type="time" className="form-control mb-3" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
          <label className="form-label">Activity *</label><input className="form-control mb-3" placeholder="Sunset point" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <label className="form-label">Note</label><textarea className="form-control mb-3" rows="2" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
          <div className="d-flex justify-content-end gap-2"><button className="btn-outline-travel" onClick={() => setModal(null)}>Cancel</button><button className="btn-travel" onClick={saveActivity}>Save</button></div>
        </Modal>
      )}
    </div>
  );
}
