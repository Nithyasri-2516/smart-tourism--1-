import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API, { errMsg } from "../services/api";
import { useApp } from "../context/AppContext";
import InterestPicker from "../components/InterestPicker";
import { AUTH_IMG, BUDGETS, STYLES } from "../data/destinations";

export default function Register() {
  const { toast } = useApp();
  const navigate = useNavigate();
  const [f, setF] = useState({ name: "", email: "", phone: "", password: "", confirmPassword: "", interests: [], budgetPreference: BUDGETS[1].label, travelStyle: "Standard" });
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (!f.name || !f.email || !f.phone || !f.password || !f.confirmPassword) return toast("Please fill all required fields", "error");
    if (f.password !== f.confirmPassword) return toast("Passwords do not match", "error");
    try {
      setBusy(true);
      await API.post("/auth/register", f);
      toast("Registration successful");
      setTimeout(() => navigate("/login"), 900);
    } catch (err) { toast(errMsg(err), "error"); } finally { setBusy(false); }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-left" style={{ backgroundImage: `url(${AUTH_IMG})` }}>
        <div>
          <h1 className="display">“The world is a book, and those who do not travel read only one page.”</h1>
          <ul className="list-unstyled mt-4 fs-5">
            <li>✨ Recommendations that match your interests</li><li>📅 Day-wise itineraries you can edit</li><li>❤️ Save favorites and write reviews</li>
          </ul>
        </div>
      </div>
      <div className="auth-right">
        <form className="auth-card" onSubmit={submit}>
          <h2>Create your account</h2>
          <p className="text-muted">Tell us how you like to travel.</p>
          <div className="row g-3">
            <div className="col-12"><label className="form-label">Full Name *</label><input className="form-control" value={f.name} onChange={set("name")} /></div>
            <div className="col-md-6"><label className="form-label">Email *</label><input className="form-control" type="email" value={f.email} onChange={set("email")} /></div>
            <div className="col-md-6"><label className="form-label">Phone *</label><input className="form-control" value={f.phone} onChange={set("phone")} /></div>
            <div className="col-md-6"><label className="form-label">Password *</label><input className="form-control" type="password" value={f.password} onChange={set("password")} /></div>
            <div className="col-md-6"><label className="form-label">Confirm Password *</label><input className="form-control" type="password" value={f.confirmPassword} onChange={set("confirmPassword")} /></div>
          </div>
          <label className="form-label mt-4">Travel Interests</label>
          <InterestPicker value={f.interests} onChange={(v) => setF({ ...f, interests: v })} />
          <label className="form-label mt-4">Travel Style</label>
          <div className="row g-2">
            {STYLES.map((s) => (
              <div className="col-4" key={s.id}><button type="button" className={"pick" + (f.travelStyle === s.id ? " on" : "")} style={f.travelStyle === s.id ? { background: "var(--lagoon)" } : {}} onClick={() => setF({ ...f, travelStyle: s.id })}><span className="e">{s.emoji}</span>{s.id}</button></div>
            ))}
          </div>
          <label className="form-label mt-4">Budget Preference</label>
          <div className="row g-2">
            {BUDGETS.map((b) => (
              <div className="col-6" key={b.label}><button type="button" className={"pick" + (f.budgetPreference === b.label ? " on" : "")} style={f.budgetPreference === b.label ? { background: "var(--sunset)" } : {}} onClick={() => setF({ ...f, budgetPreference: b.label })}>{b.label}</button></div>
            ))}
          </div>
          <button className="btn-travel w-100 justify-content-center mt-4" disabled={busy}>{busy ? "Creating..." : "✨ Create Account"}</button>
          <div className="text-center mt-3">Already registered? <Link to="/login" className="fw-bold">Login</Link></div>
        </form>
      </div>
    </div>
  );
}
