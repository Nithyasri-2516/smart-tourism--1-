import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch, FaHeart, FaPlane, FaStar, FaMapMarkedAlt } from "react-icons/fa";
import API, { errMsg } from "../services/api";
import { useApp } from "../context/AppContext";
import TouristPlaceCard from "../components/TouristPlaceCard";
import DestinationCard from "../components/DestinationCard";
import Loading from "../components/Loading";
import EmptyState from "../components/EmptyState";
import { budgetValue } from "../data/destinations";
import { greeting, fmtDate, daysBetween, inr } from "../services/helpers";

export default function Dashboard() {
  const { user, toast, isFav, toggleFavorite, addToTrip } = useApp();
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [data, setData] = useState(null);
  const recent = JSON.parse(localStorage.getItem("recent") || "[]");

  useEffect(() => {
    (async () => {
      try {
        const [recs, trips, reviews, dests] = await Promise.all([
          API.post("/places/recommend", { interests: user.interests, budget: budgetValue(user.budgetPreference), travelStyle: user.travelStyle, days: 3, travelers: 2, limit: 6 }),
          API.get(`/trips?user=${user._id}`), API.get(`/reviews?user=${user._id}`), API.get("/destinations"),
        ]);
        setData({ recs: recs.data, trips: trips.data, reviews: reviews.data, dests: dests.data.slice(0, 4) });
      } catch (e) { toast(errMsg(e), "error"); setData({ recs: [], trips: [], reviews: [], dests: [] }); }
    })();
    // eslint-disable-next-line
  }, []);

  if (!data) return <Loading text="Loading your dashboard..." />;
  const upcoming = data.trips.filter((t) => t.status === "Upcoming").sort((a, b) => new Date(a.startDate) - new Date(b.startDate))[0];
  const visited = data.trips.filter((t) => t.status === "Completed").reduce((n, t) => n + t.places.length, 0);
  const stats = [
    ["g1", <FaHeart />, user.favorites?.length || 0, "Favorites"], ["g2", <FaPlane />, data.trips.length, "My Trips"],
    ["g3", <FaStar />, data.reviews.length, "Reviews"], ["g4", <FaMapMarkedAlt />, visited, "Places Visited"],
  ];

  return (
    <div className="page">
      <div className="page-head">
        <div className="container">
          <h1>{greeting()}, {user.name.split(" ")[0]} 👋</h1>
          <p className="fs-5 opacity-75">Where would you like to go next?</p>
          <form className="search-bar mt-3" style={{ maxWidth: 620 }} onSubmit={(e) => { e.preventDefault(); navigate(`/explore?search=${q}`); }}>
            <FaSearch className="text-muted" /><input placeholder="🔍 Search destinations..." value={q} onChange={(e) => setQ(e.target.value)} />
            <button className="btn-warm">Search</button>
          </form>
        </div>
      </div>

      <div className="container overlap">
        <div className="row g-3 mb-4">
          {stats.map(([g, icon, n, label]) => (
            <div className="col-6 col-lg-3" key={label}><div className={`stat ${g}`}><div className="ico">{icon}</div><div><h3>{n}</h3><small>{label}</small></div></div></div>
          ))}
        </div>

        <h3 className="section-title">Recommended For You</h3>
        {data.recs.length === 0 ? <EmptyState title="No recommendations yet" text="Pick your interests to get matches." /> : (
          <div className="row g-4 mb-5">
            {data.recs.map((p) => <div className="col-md-6 col-lg-4" key={p._id}><TouristPlaceCard place={p} fav={isFav(p._id)} onFav={toggleFavorite} onAdd={addToTrip} /></div>)}
          </div>
        )}

        <div className="row g-4 mb-5">
          <div className="col-lg-5">
            <h3 className="section-title">Upcoming Trip</h3>
            {upcoming ? (
              <div className="trip-hero">
                <span className="pill yellow mb-2">{upcoming.status}</span>
                <h3 className="text-white">{upcoming.tripName}</h3>
                <p className="mb-1">📍 {upcoming.destination?.name}</p>
                <p className="mb-1">📅 {fmtDate(upcoming.startDate)} → {fmtDate(upcoming.endDate)} ({daysBetween(upcoming.startDate, upcoming.endDate)} days)</p>
                <p className="mb-1">👥 {upcoming.travelers} travelers &nbsp; 💰 {inr(upcoming.budget)}</p>
                <Link to={`/itinerary/${upcoming._id}`} className="btn-warm mt-3">View Itinerary</Link>
              </div>
            ) : <EmptyState icon="✈️" title="No upcoming trip" text="Plan your next adventure now."><Link to="/preferences" className="btn-travel">Plan a Trip</Link></EmptyState>}
          </div>
          <div className="col-lg-7">
            <h3 className="section-title">Recently Viewed</h3>
            {recent.length === 0 ? <EmptyState icon="👀" title="Nothing viewed yet" text="Places you open will show up here." /> : (
              <div className="row g-3">
                {recent.map((p) => <div className="col-sm-6" key={p._id}><Link to={`/place/${p._id}`} className="recent-item"><img src={p.image} alt="" onError={(e) => (e.target.style.visibility = "hidden")} /><div><b>{p.name}</b><div className="small text-muted">{p.location}</div></div></Link></div>)}
              </div>
            )}
          </div>
        </div>

        <h3 className="section-title">Popular Destinations</h3>
        <div className="row g-4">
          {data.dests.map((d) => <div className="col-sm-6 col-lg-3" key={d._id}><DestinationCard dest={d} /></div>)}
        </div>
      </div>
    </div>
  );
}
