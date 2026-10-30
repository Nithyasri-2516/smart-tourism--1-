import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaHeart, FaPlane, FaMapMarkerAlt, FaCalendarAlt, FaWallet } from "react-icons/fa";
import API, { errMsg } from "../services/api";
import { useApp } from "../context/AppContext";
import SmartImg from "../components/SmartImg";
import Stars from "../components/Stars";
import Loading from "../components/Loading";
import EmptyState from "../components/EmptyState";
import TouristPlaceCard from "../components/TouristPlaceCard";
import HotelCard from "../components/HotelCard";
import { inr } from "../services/helpers";

export default function DestinationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, toast, isFav, toggleFavorite, isFavDest, toggleFavoriteDestination, addToTrip } = useApp();
  const [d, setD] = useState(null);
  const [places, setPlaces] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    setD(null);
    Promise.all([API.get(`/destinations/${id}`), API.get(`/places?destination=${id}`), API.get(`/hotels?destination=${id}`)])
      .then(([a, b, c]) => { setD(a.data); setPlaces(b.data); setHotels(c.data); })
      .catch((e) => { toast(errMsg(e), "error"); setError(true); });
    // eslint-disable-next-line
  }, [id]);

  if (error) return <div className="container section"><EmptyState icon="🧭" title="Destination not found" text="It may have been removed." /></div>;
  if (!d) return <Loading text="Loading destination..." />;

  const planTrip = () => {
    if (!user) { toast("Please login to plan a trip", "error"); return navigate("/login"); }
    sessionStorage.setItem("tripPrefs", JSON.stringify({ destination: d._id }));
    navigate("/preferences");
  };
  const info = [[<FaMapMarkerAlt />, "Location", d.location], [<FaCalendarAlt />, "Best time", d.bestTime || d.season], [<FaWallet />, "Estimated budget", inr(d.avgBudget) + " / person"], [<FaPlane />, "Category", d.category]];

  return (
    <div className="page">
      <div className="detail-hero" style={{ backgroundImage: `url(${d.image})`, backgroundColor: "#0369a1" }}>
        <div className="container">
          <span className="pill yellow mb-2">{d.category}</span>
          <h1 className="display" style={{ fontSize: "clamp(2.2rem,6vw,4rem)" }}>{d.name}</h1>
          <div className="d-flex gap-3 align-items-center flex-wrap"><span><FaMapMarkerAlt /> {d.location}</span><span className="d-flex align-items-center gap-2"><Stars value={d.rating} /> {d.rating}</span></div>
        </div>
      </div>
      <div className="container py-4">
        <div className="d-flex gap-2 flex-wrap mb-4">
          <button className={isFavDest(d._id) ? "btn-warm" : "btn-outline-travel"} onClick={() => toggleFavoriteDestination(d)}><FaHeart /> {isFavDest(d._id) ? "Saved to Favorites" : "Add to Favorites"}</button>
          <button className="btn-travel" onClick={planTrip}><FaPlane /> Plan Trip</button>
        </div>
        <p className="fs-5" style={{ maxWidth: 800 }}>{d.description}</p>
        <div className="row g-3 my-3">{info.map(([i, l, v]) => <div className="col-6 col-lg-3" key={l}><div className="info-tile"><div className="ico">{i}</div><div><small>{l}</small><b>{v}</b></div></div></div>)}</div>

        {d.gallery?.length > 0 && (<><h3 className="section-title mt-5">Image Gallery</h3><div className="gallery">{[d.image, ...d.gallery].filter(Boolean).map((g, i) => <SmartImg key={i} src={g} alt={`${d.name} ${i + 1}`} />)}</div></>)}

        <h3 className="section-title mt-5">Tourist Places & Nearby Attractions</h3>
        {places.length === 0 ? <EmptyState title="No tourist places yet" text="Check back soon." /> : (
          <div className="row g-4">{places.map((p) => <div className="col-md-6 col-lg-4" key={p._id}><TouristPlaceCard place={p} fav={isFav(p._id)} onFav={toggleFavorite} onAdd={addToTrip} /></div>)}</div>
        )}

        <h3 className="section-title mt-5">Hotels</h3>
        {hotels.length === 0 ? <EmptyState icon="🏨" title="No hotels listed" text="Hotels will appear here once added." /> : (
          <div className="row g-4">{hotels.filter((h) => h.status === "Active").map((h) => <div className="col-md-6 col-lg-3" key={h._id}><HotelCard hotel={h} /></div>)}</div>
        )}
      </div>
    </div>
  );
}
