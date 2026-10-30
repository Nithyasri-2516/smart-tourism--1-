import { useEffect, useState } from "react";
import API, { errMsg } from "../services/api";
import { useApp } from "../context/AppContext";
import ReviewCard from "../components/ReviewCard";
import ReviewForm from "../components/ReviewForm";
import Modal from "../components/Modal";
import Loading from "../components/Loading";
import EmptyState from "../components/EmptyState";

export default function Reviews() {
  const { user, toast } = useApp();
  const [places, setPlaces] = useState([]);
  const [mine, setMine] = useState(null);
  const [place, setPlace] = useState("");
  const [editing, setEditing] = useState(null);

  const load = () => API.get(`/reviews?user=${user._id}`).then((r) => setMine(r.data)).catch((e) => { toast(errMsg(e), "error"); setMine([]); });
  useEffect(() => { load(); API.get("/places").then((r) => setPlaces(r.data)).catch(() => {}); /* eslint-disable-next-line */ }, []);

  const create = async ({ rating, comment }) => {
    if (!place || !rating || !comment.trim()) { toast("Please fill all required fields", "error"); return false; }
    try { await API.post("/reviews", { user: user._id, touristPlace: place, rating, comment }); toast("Review submitted"); load(); return true; } catch (e) { toast(errMsg(e), "error"); return false; }
  };
  const update = async ({ rating, comment }) => {
    try { await API.put(`/reviews/${editing._id}`, { rating, comment }); toast("Review updated"); setEditing(null); load(); return true; } catch (e) { toast(errMsg(e), "error"); return false; }
  };
  const del = async (r) => { try { await API.delete(`/reviews/${r._id}`); toast("Review deleted"); load(); } catch (e) { toast(errMsg(e), "error"); } };

  return (
    <div className="page">
      <div className="page-head blue"><div className="container"><h1>My Reviews ⭐</h1><p className="fs-5 opacity-75 mb-0">Share your experiences with other travelers.</p></div></div>
      <div className="container overlap"><div className="row g-4">
        <div className="col-lg-5"><div className="panel">
          <h5>Write a review</h5>
          <ReviewForm onSubmit={create}>
            <label className="form-label">Tourist place *</label>
            <select className="form-select mb-3" value={place} onChange={(e) => setPlace(e.target.value)}><option value="">Select a place</option>{places.map((p) => <option key={p._id} value={p._id}>{p.name} – {p.destination?.name}</option>)}</select>
          </ReviewForm>
        </div></div>
        <div className="col-lg-7">
          {!mine ? <Loading text="Loading reviews..." /> : mine.length === 0 ? <EmptyState icon="💬" title="No reviews yet" text="Your reviews will appear here." /> :
            mine.map((r) => <ReviewCard key={r._id} review={r} showPlace onEdit={setEditing} onDelete={del} />)}
        </div>
      </div></div>
      {editing && <Modal title="Edit Review" onClose={() => setEditing(null)}><ReviewForm initial={editing} onSubmit={update} submitLabel="Save Changes" /></Modal>}
    </div>
  );
}
