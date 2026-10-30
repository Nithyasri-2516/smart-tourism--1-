import { FaEdit, FaTrash } from "react-icons/fa";
import Stars from "./Stars";
import { fmtDate } from "../services/helpers";
export default function ReviewCard({ review, onEdit, onDelete, showPlace }) {
  return (
    <div className="panel" style={{ padding: "1.1rem", marginBottom: "1rem" }}>
      <div className="d-flex justify-content-between align-items-start gap-2">
        <div className="d-flex gap-3 align-items-center">
          <div className="avatar">{(review.user?.name || "U")[0]}</div>
          <div>
            <b>{review.user?.name || "Traveler"}</b>
            {showPlace && review.touristPlace && <div className="small text-muted">on {review.touristPlace.name}</div>}
            <div><Stars value={review.rating} size={14} /> <small className="text-muted ms-1">{fmtDate(review.createdAt)}</small></div>
          </div>
        </div>
        <div className="d-flex gap-1">
          {onEdit && <button className="icon-btn" onClick={() => onEdit(review)} aria-label="Edit"><FaEdit /></button>}
          {onDelete && <button className="icon-btn danger" onClick={() => onDelete(review)} aria-label="Delete"><FaTrash /></button>}
        </div>
      </div>
      <p className="mt-2 mb-0">{review.comment}</p>
    </div>
  );
}
