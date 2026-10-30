import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API, { errMsg } from "../services/api";
import { useApp } from "../context/AppContext";
import TouristPlaceCard from "../components/TouristPlaceCard";
import Loading from "../components/Loading";
import EmptyState from "../components/EmptyState";
import { budgetValue } from "../data/destinations";

export default function Recommendations() {
  const { user, toast, isFav, toggleFavorite, addToTrip, draft } = useApp();
  const navigate = useNavigate();
  const [list, setList] = useState(null);
  const prefs = JSON.parse(sessionStorage.getItem("tripPrefs") || "null");

  useEffect(() => {
    const body = prefs || { interests: user.interests, budget: budgetValue(user.budgetPreference), travelStyle: user.travelStyle, days: 3, travelers: 2 };
    API.post("/places/recommend", { ...body, limit: 12 }).then((r) => setList(r.data)).catch((e) => { toast(errMsg(e), "error"); setList([]); });
    // eslint-disable-next-line
  }, []);

  return (
    <div className="page">
      <div className="page-head"><div className="container">
        <h1>Your Smart Recommendations ✨</h1>
        <p className="fs-5 opacity-75">{prefs ? `Based on ${prefs.interests?.length || 0} interests, ${prefs.days} days, ${prefs.travelStyle} style.` : "Based on your profile."}</p>
        <div className="d-flex gap-2 flex-wrap"><Link to="/preferences" className="btn-ghost">Edit preferences</Link><button className="btn-warm" onClick={() => navigate("/create-trip")}>Create Trip {draft.length > 0 && `(${draft.length} places)`}</button></div>
      </div></div>
      <div className="container overlap">
        {!list ? <Loading text="Finding the best places for you..." /> : list.length === 0 ? <EmptyState title="No recommendations found" text="Try different preferences." /> : (
          <div className="row g-4">{list.map((p) => <div className="col-md-6 col-lg-4" key={p._id}><TouristPlaceCard place={p} fav={isFav(p._id)} onFav={toggleFavorite} onAdd={addToTrip} /></div>)}</div>
        )}
      </div>
    </div>
  );
}
