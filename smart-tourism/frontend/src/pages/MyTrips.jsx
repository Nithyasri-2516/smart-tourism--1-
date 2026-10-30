import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import API, { errMsg } from "../services/api";
import { useApp } from "../context/AppContext";
import TripCard from "../components/TripCard";
import Loading from "../components/Loading";
import EmptyState from "../components/EmptyState";
import Modal from "../components/Modal";
import { TRIP_STATUS } from "../data/destinations";
import { toInputDate } from "../services/helpers";

export default function MyTrips() {
  const { user, toast } = useApp();
  const navigate = useNavigate();
  const [trips, setTrips] = useState(null);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [edit, setEdit] = useState(null);
  const [del, setDel] = useState(null);

  const load = () => API.get(`/trips?user=${user._id}`).then((r) => setTrips(r.data)).catch((e) => { toast(errMsg(e), "error"); setTrips([]); });
  useEffect(() => { load(); /* eslint-disable-next-line */ }, []);

  const shown = (trips || []).filter((t) => (!status || t.status === status) && `${t.tripName} ${t.destination?.name}`.toLowerCase().includes(q.toLowerCase()));

  const save = async () => {
    if (!edit.tripName.trim()) return toast("Please fill all required fields", "error");
    try {
      const { _id, tripName, startDate, endDate, travelers, budget, status } = edit;
      await API.put(`/trips/${_id}`, { tripName, startDate, endDate, travelers: Number(travelers), budget: Number(budget), status });
      toast("Trip updated successfully"); setEdit(null); load();
    } catch (e) { toast(errMsg(e), "error"); }
  };
  const remove = async () => { try { await API.delete(`/trips/${del._id}`); toast("Trip deleted successfully"); setDel(null); load(); } catch (e) { toast(errMsg(e), "error"); } };

  return (
    <div className="page">
      <div className="page-head"><div className="container d-flex justify-content-between align-items-center flex-wrap gap-3">
        <h1 className="m-0">My Trips ✈️</h1><Link to="/preferences" className="btn-warm">+ Plan New Trip</Link>
      </div></div>
      <div className="container overlap">
        <div className="sticky-filter mb-4"><div className="row g-2">
          <div className="col-md-8"><div className="search-bar" style={{ boxShadow: "none", border: "2px solid #e2e8f0" }}><FaSearch className="text-muted" /><input placeholder="Search trips..." value={q} onChange={(e) => setQ(e.target.value)} /></div></div>
          <div className="col-md-4"><select className="form-select" style={{ borderRadius: 50 }} value={status} onChange={(e) => setStatus(e.target.value)}><option value="">All statuses</option>{TRIP_STATUS.map((s) => <option key={s}>{s}</option>)}</select></div>
        </div></div>
        {!trips ? <Loading text="Loading your trips..." /> : shown.length === 0 ? (
          <EmptyState icon="🧳" title="No trips found" text="Try changing your search or create a new trip."><Link to="/preferences" className="btn-travel">Plan a Trip</Link></EmptyState>
        ) : (
          <div className="row g-4">{shown.map((t) => <div className="col-md-6 col-lg-4" key={t._id}><TripCard trip={t} onView={() => navigate(`/itinerary/${t._id}`)} onEdit={(t) => setEdit({ ...t, startDate: toInputDate(t.startDate), endDate: toInputDate(t.endDate) })} onDelete={setDel} /></div>)}</div>
        )}
      </div>

      {edit && (
        <Modal title="Edit Trip" onClose={() => setEdit(null)}>
          <div className="row g-3">
            <div className="col-12"><label className="form-label">Trip name</label><input className="form-control" value={edit.tripName} onChange={(e) => setEdit({ ...edit, tripName: e.target.value })} /></div>
            <div className="col-6"><label className="form-label">Start</label><input type="date" className="form-control" value={edit.startDate} onChange={(e) => setEdit({ ...edit, startDate: e.target.value })} /></div>
            <div className="col-6"><label className="form-label">End</label><input type="date" className="form-control" min={edit.startDate} value={edit.endDate} onChange={(e) => setEdit({ ...edit, endDate: e.target.value })} /></div>
            <div className="col-6"><label className="form-label">Travelers</label><input type="number" min="1" className="form-control" value={edit.travelers} onChange={(e) => setEdit({ ...edit, travelers: e.target.value })} /></div>
            <div className="col-6"><label className="form-label">Budget (₹)</label><input type="number" className="form-control" value={edit.budget} onChange={(e) => setEdit({ ...edit, budget: e.target.value })} /></div>
            <div className="col-12"><label className="form-label">Status</label><select className="form-select" value={edit.status} onChange={(e) => setEdit({ ...edit, status: e.target.value })}>{TRIP_STATUS.map((s) => <option key={s}>{s}</option>)}</select></div>
          </div>
          <div className="d-flex justify-content-end gap-2 mt-4"><button className="btn-outline-travel" onClick={() => setEdit(null)}>Cancel</button><button className="btn-travel" onClick={save}>💾 Save</button></div>
        </Modal>
      )}
      {del && (
        <Modal title="Delete trip?" onClose={() => setDel(null)}>
          <p>“{del.tripName}” and its itinerary will be removed permanently.</p>
          <div className="d-flex justify-content-end gap-2"><button className="btn-outline-travel" onClick={() => setDel(null)}>Cancel</button><button className="btn-warm" onClick={remove}>🗑 Delete</button></div>
        </Modal>
      )}
    </div>
  );
}
