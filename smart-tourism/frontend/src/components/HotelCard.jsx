import { FaMapMarkerAlt, FaPhone } from "react-icons/fa";
import SmartImg from "./SmartImg";
import Stars from "./Stars";
export default function HotelCard({ hotel }) {
  return (
    <div className="card-t">
      <div className="card-img" style={{ height: 160 }}><SmartImg src={hotel.image} alt={hotel.name} /></div>
      <div className="card-body-t">
        <h5 className="fs-6">{hotel.name}</h5>
        <div className="d-flex align-items-center gap-2"><Stars value={hotel.rating} size={14} /><small>{hotel.rating}</small></div>
        <div className="price my-1">{hotel.priceRange} <small className="text-muted fw-normal">/ night</small></div>
        <div className="loc"><FaMapMarkerAlt /> {hotel.address}</div>
        <div className="loc"><FaPhone /> {hotel.contact}</div>
      </div>
    </div>
  );
}
