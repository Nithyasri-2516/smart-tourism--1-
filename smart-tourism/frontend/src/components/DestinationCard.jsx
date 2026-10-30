import { Link } from "react-router-dom";
import { FaHeart, FaMapMarkerAlt, FaStar } from "react-icons/fa";
import SmartImg from "./SmartImg";
import { inr } from "../services/helpers";

export default function DestinationCard({ dest, fav, onFav, tall }) {
  const to = dest._id ? `/destination/${dest._id}` : `/explore?search=${dest.name}`;
  return (
    <div className="card-t">
      <div className={"card-img" + (tall ? " tall" : "")}>
        <SmartImg src={dest.image} alt={dest.name} />
        {dest.category && <span className="pill warm card-badge">{dest.category}</span>}
        {onFav && <button className={"fav-btn" + (fav ? " on" : "")} onClick={() => onFav(dest)} aria-label="Favorite"><FaHeart /></button>}
      </div>
      <div className="card-body-t">
        <div className="d-flex justify-content-between align-items-start">
          <h5>{dest.name}</h5>
          <span className="pill yellow"><FaStar /> {dest.rating}</span>
        </div>
        <div className="loc"><FaMapMarkerAlt /> {dest.location}</div>
        <p className="desc">{(dest.description || "").slice(0, 110)}{dest.description?.length > 110 ? "..." : ""}</p>
        <div className="d-flex justify-content-between align-items-center">
          {dest.avgBudget ? <span className="price">From {inr(dest.avgBudget)}</span> : <span />}
          <Link to={to} className="btn-outline-travel">Explore</Link>
        </div>
      </div>
    </div>
  );
}
