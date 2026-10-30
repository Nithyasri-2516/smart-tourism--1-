import { useState } from "react";
import API, { errMsg } from "../../services/api";
import { useApp } from "../../context/AppContext";

export default function Settings() {
  const { user, toast } = useApp();
  const [pw, setPw] = useState({ currentPassword: "", newPassword: "" });
  const [site, setSite] = useState(localStorage.getItem("siteName") || "Smart Tourism");
  const change = async () => {
    if (!pw.currentPassword || !pw.newPassword) return toast("Please fill all required fields", "error");
    try { await API.post("/auth/change-password", { userId: user._id, ...pw }); toast("Password changed successfully"); setPw({ currentPassword: "", newPassword: "" }); }
    catch (e) { toast(errMsg(e), "error"); }
  };
  return (
    <div>
      <h3 className="mb-3">⚙️ Settings</h3>
      <div className="row g-3">
        <div className="col-lg-6"><div className="panel">
          <h5>Admin account</h5>
          <p className="mb-1"><b>{user.name}</b></p><p className="text-muted">{user.email}</p>
          <label className="form-label">Current password</label>
          <input className="form-control mb-2" type="password" value={pw.currentPassword} onChange={(e) => setPw({ ...pw, currentPassword: e.target.value })} />
          <label className="form-label">New password</label>
          <input className="form-control mb-3" type="password" value={pw.newPassword} onChange={(e) => setPw({ ...pw, newPassword: e.target.value })} />
          <button className="btn-travel" onClick={change}>Change password</button>
        </div></div>
        <div className="col-lg-6"><div className="panel">
          <h5>Site</h5>
          <label className="form-label">Site name (saved in this browser)</label>
          <input className="form-control mb-3" value={site} onChange={(e) => setSite(e.target.value)} />
          <button className="btn-warm" onClick={() => { localStorage.setItem("siteName", site); toast("Settings saved"); }}>Save settings</button>
          <hr />
          <small className="text-muted">Database seeding is done from the backend folder with <code>npm run seed</code>.</small>
        </div></div>
      </div>
    </div>
  );
}
