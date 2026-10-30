import { useState } from "react";
import Stars from "./Stars";
export default function ReviewForm({ initial, onSubmit, submitLabel = "Submit Review", children }) {
  const [rating, setRating] = useState(initial?.rating || 0);
  const [comment, setComment] = useState(initial?.comment || "");
  const [busy, setBusy] = useState(false);
  const submit = async () => {
    setBusy(true);
    const ok = await onSubmit({ rating, comment });
    setBusy(false);
    if (ok && !initial) { setRating(0); setComment(""); }
  };
  return (
    <div>
      {children}
      <label className="form-label">Rating</label>
      <div className="mb-3"><Stars value={rating} onChange={setRating} size={30} /></div>
      <label className="form-label">Review</label>
      <textarea className="form-control mb-3" rows="4" placeholder="Share your experience..." value={comment} onChange={(e) => setComment(e.target.value)} />
      <button className="btn-travel" disabled={busy} onClick={submit}>⭐ {submitLabel}</button>
    </div>
  );
}
