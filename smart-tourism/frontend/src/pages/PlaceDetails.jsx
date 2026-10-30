import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FaHeart, FaPlus, FaStar, FaClock, FaTicketAlt, FaCalendarAlt, FaHourglassHalf, FaMapMarkerAlt } from "react-icons/fa";
import API, { errMsg } from "../services/api";
import { useApp } from "../context/AppContext";
import SmartImg from "../components/SmartImg";
import Stars from "../components/Stars";
import Loading from "../components/Loading";
import EmptyState from "../components/EmptyState";
import HotelCard from "../components/HotelCard";
import ReviewCard from "../components/ReviewCard";
import ReviewForm from "../components/ReviewForm";
import Modal from "../components/Modal";
import { inr } from "../services/helpers";

export default function PlaceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, toast, isFav, toggleFavorite, addToTrip, addRecent } = useApp();
  const [p, setP] = useState(null);
  const [hotels, setHotels] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState(false);
  const formRef = useRef(null);

  const loadReviews = () => API.get(`/reviews/place/${id}`).then((r) => setReviews(r.data)).catch(() => {});
  useEffect(() => {
    setP(null);
    API.get(`/places/${id}`).then(async ({ data }) => {
      setP(data); addRecent(data);
      API.get(`/hotels?destination=${data.destination?._id}`).then((h) => setHotels(h.data)).catch(() => {});
    }).catch((e) => { toast(errMsg(e), "error"); setError(true); });
    loadReviews();
    // eslint-disable-next-line
  }, [id]);

  if (error) return <div className="container section"><EmptyState icon="🧭" title="Place not found" /></div>;
  if (!p) return <Loading text="Loading place..." />;

  const needLogin = () => { if (!user) { toast("Please login first", "error"); navigate("/login"); return true; } return false; };
  const submit = async ({ rating, comment }) => {
    if (needLogin()) return false;
    if (!rating || !comment.trim()) { toast("Please fill all required fields", "error"); return false; }
    try { await API.post("/reviews", { user: user._id, touristPlace: id, rating, comment }); toast("Review submitted"); loadReviews(); return true; }
    catch (e) { toast(errMsg(e), "error"); return false; }
  };
  const update = async ({ rating, comment }) => {
    try { await API.put(`/reviews/${editing._id}`, { rating, comment }); toast("Review updated"); setEditing(null); loadReviews(); return true; }
    catch (e) { toast(errMsg(e), "error"); return false; }
  };
  const del = async (r) => { try { await API.delete(`/reviews/${r._id}`); toast("Review deleted"); loadReviews(); } catch (e) { toast(errMsg(e), "error"); } };

  const info = [[<FaClock />, "Opening hours", p.openingHours], [<FaTicketAlt />, "Entry fee", p.entryFee ? inr(p.entryFee) : "Free"], [<FaCalendarAlt />, "Best time", p.bestTime || "Any time"], [<FaHourglassHalf />, "Recommended duration", p.duration]];
  const avg = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : null;

  return (
    <div className="page">
      <div className="detail-hero" style={{ backgroundImage: `url(${p.image})`, backgroundColor: "#0d9488" }}>
        <div className="container">
          <span className="pill yellow mb-2">{p.category}</span>
          <h1 className="display" style={{ fontSize: "clamp(2rem,5vw,3.6rem)" }}>{p.name}</h1>
          <div className="d-flex gap-3 flex-wrap align-items-center"><span><FaMapMarkerAlt /> {p.location}{p.destination && <> · <Link to={`/destination/${p.destination._id}`} className="text-white text-decoration-underline">{p.destination.name}</Link></>}</span><span className="d-flex gap-2 align-items-center"><Stars value={p.rating} /> {p.rating}</span></div>
        </div>
      </div>
      <div className="container py-4">
        <div className="d-flex gap-2 flex-wrap mb-4">
          <button className={isFav(p._id) ? "btn-warm" : "btn-outline-travel"} onClick={() => toggleFavorite(p)}><FaHeart /> {isFav(p._id) ? "Saved" : "Save Favorite"}</button>
          <button className="btn-travel" onClick={() => addToTrip(p)}><FaPlus /> Add to Trip</button>
          <button className="btn-outline-travel" onClick={() => formRef.current?.scrollIntoView({ behavior: "smooth" })}><FaStar /> Write Review</button>
        </div>
        <p className="fs-5" style={{ maxWidth: 800 }}>{p.description}</p>
        <div className="row g-3 my-3">{info.map(([i, l, v]) => <div className="col-6 col-lg-3" key={l}><div className="info-tile"><div className="ico">{i}</div><div><small>{l}</small><b>{v}</b></div></div></div>)}</div>

        {p.gallery?.length > 0 && (<><h3 className="section-title mt-4">Image Gallery</h3><div className="gallery">{[p.image, ...p.gallery].filter(Boolean).map((g, i) => <SmartImg key={i} src={g} alt={`${p.name} ${i + 1}`} />)}</div></>)}

        {p.nearby?.length > 0 && (<><h3 className="section-title mt-5">Nearby Attractions</h3><div className="d-flex flex-wrap gap-2">{p.nearby.map((n) => <span key={n} className="pill green fs-6">📍 {n}</span>)}</div></>)}

        <h3 className="section-title mt-5">Nearby Hotels</h3>
        {hotels.length === 0 ? <EmptyState icon="🏨" title="No hotels listed" text="No hotels added for this area yet." /> : <div className="row g-4">{hotels.slice(0, 4).map((h) => <div className="col-md-6 col-lg-3" key={h._id}><HotelCard hotel={h} /></div>)}</div>}

        <h3 className="section-title mt-5">Reviews {avg && <small className="text-muted fs-6">· {avg} average from {reviews.length}</small>}</h3>
        <div className="row g-4">
          <div className="col-lg-7">
            {reviews.length === 0 ? <EmptyState icon="💬" title="No reviews yet" text="Be the first to share your experience." /> :
              reviews.map((r) => <ReviewCard key={r._id} review={r} onEdit={user?._id === r.user?._id ? setEditing : null} onDelete={user?._id === r.user?._id ? del : null} />)}
          </div>
          <div className="col-lg-5" ref={formRef}><div className="panel"><h5>Write a Review</h5>{user ? <ReviewForm onSubmit={submit} /> : <p>Please <Link to="/login">login</Link> to write a review.</p>}</div></div>
        </div>
      </div>
      {editing && <Modal title="Edit Review" onClose={() => setEditing(null)}><ReviewForm initial={editing} onSubmit={update} submitLabel="Save Changes" /></Modal>}
    </div>
  );
}
