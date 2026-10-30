import { FaCalendarAlt, FaUsers, FaWallet, FaMapMarkerAlt } from "react-icons/fa";
import { fmtDate, daysBetween, inr } from "../services/helpers";
const COLORS = { Upcoming: "blue", Ongoing: "green", Completed: "yellow", Cancelled: "red" };
export default function TripCard({ trip, onView, onEdit, onDelete }) {
  return (
    <div className="card-t">
      <div style={{ background: "var(--grad)", color: "#fff", padding: "1.2rem" }}>
        <div className="d-flex justify-content-between align-items-start gap-2">
          <h5 className="m-0 text-white">{trip.tripName}</h5>
          <span className={`pill ${COLORS[trip.status] || "blue"}`}>{trip.status}</span>
        </div>
        <div className="mt-1 small d-flex align-items-center gap-1"><FaMapMarkerAlt /> {trip.destination?.name}</div>
      </div>
      <div className="card-body-t">
        <div className="row g-2 small">
          <div className="col-6"><FaCalendarAlt className="text-info" /> {fmtDate(trip.startDate)}</div>
          <div className="col-6"><FaCalendarAlt className="text-warning" /> {fmtDate(trip.endDate)}</div>
          <div className="col-6">🗓 {daysBetween(trip.startDate, trip.endDate)} days</div>
          <div className="col-6"><FaUsers className="text-success" /> {trip.travelers} travelers</div>
          <div className="col-12"><FaWallet className="text-danger" /> Budget <b>{inr(trip.budget)}</b></div>
        </div>
        <div className="card-actions mt-3">
          <button className="btn-travel btn-sm-round" onClick={() => onView(trip)}>View Itinerary</button>
          {onEdit && <button className="btn-outline-travel" onClick={() => onEdit(trip)}>Edit</button>}
          {onDelete && <button className="btn-outline-travel" style={{ borderColor: "#ef4444", color: "#ef4444" }} onClick={() => onDelete(trip)}>Delete</button>}
        </div>
      </div>
    </div>
  );
}
