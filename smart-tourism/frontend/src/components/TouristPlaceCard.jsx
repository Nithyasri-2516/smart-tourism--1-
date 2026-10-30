import { Link } from "react-router-dom";
import { FaHeart, FaMapMarkerAlt, FaPlus } from "react-icons/fa";
import SmartImg from "./SmartImg";
import Stars from "./Stars";
import { inr } from "../services/helpers";

export default function TouristPlaceCard({ place, fav, onFav, onAdd }) {
  return (
    <div className="card-t">
      <div className="card-img">
        <SmartImg src={place.image} alt={place.name} />
        <span className="pill blue card-badge">{place.category}</span>
        {place.match != null && <span className="match-badge">{place.match}% Match</span>}
        {onFav && <button className={"fav-btn" + (fav ? " on" : "")} onClick={() => onFav(place)} aria-label="Favorite"><FaHeart /></button>}
      </div>
      <div className="card-body-t">
        <h5>{place.name}</h5>
        <div className="loc"><FaMapMarkerAlt /> {place.location || place.destination?.name}</div>
        <div className="d-flex justify-content-between align-items-center mt-2">
          <span className="d-flex align-items-center gap-2"><Stars value={place.rating} /> <small>{place.rating}</small></span>
          <span className="price">{inr(place.estimatedCost)}</span>
        </div>
        <p className="desc">{(place.description || "").slice(0, 90)}{place.description?.length > 90 ? "..." : ""}</p>
        <div className="card-actions">
          <Link to={`/place/${place._id}`} className="btn-outline-travel">View Details</Link>
          {onAdd && <button className="btn-warm btn-sm-round" onClick={() => onAdd(place)}><FaPlus /> Add to Trip</button>}
        </div>
      </div>
    </div>
  );
}
