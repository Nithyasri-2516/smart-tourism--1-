import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEdit, FaKey, FaSignOutAlt } from "react-icons/fa";
import API, { errMsg } from "../services/api";
import { useApp } from "../context/AppContext";
import InterestPicker from "../components/InterestPicker";
import { BUDGETS, STYLES } from "../data/destinations";

export default function Profile() {
  const { user, setUser, logout, toast } = useApp();
  const navigate = useNavigate();
  const [edit, setEdit] = useState(false);
  const [f, setF] = useState({ name: user.name, phone: user.phone, budgetPreference: user.budgetPreference, travelStyle: user.travelStyle, interests: user.interests || [] });
  const [pw, setPw] = useState({ currentPassword: "", newPassword: "", confirm: "" });

  const save = async () => {
    if (!f.name.trim() || !f.phone.trim()) return toast("Please fill all required fields", "error");
    try { const { data } = await API.put(`/users/${user._id}`, f); setUser({ ...user, ...data }); setEdit(false); toast("Profile updated"); } catch (e) { toast(errMsg(e), "error"); }
  };
  const changePw = async () => {
    if (!pw.currentPassword || !pw.newPassword) return toast("Please fill all required fields", "error");
    if (pw.newPassword !== pw.confirm) return toast("Passwords do not match", "error");
    try { await API.post("/auth/change-password", { userId: user._id, currentPassword: pw.currentPassword, newPassword: pw.newPassword }); toast("Password changed successfully"); setPw({ currentPassword: "", newPassword: "", confirm: "" }); } catch (e) { toast(errMsg(e), "error"); }
  };

  return (
    <div className="page">
      <div className="page-head"><div className="container text-center"><div className="avatar lg mx-auto mb-2">{user.name[0].toUpperCase()}</div><h1>{user.name}</h1><p className="opacity-75 mb-0">{user.email}</p></div></div>
      <div className="container overlap"><div className="row g-4">
        <div className="col-lg-7"><div className="panel">
          <div className="d-flex justify-content-between align-items-center mb-3"><h5 className="m-0">Profile details</h5>{!edit && <button className="btn-outline-travel" onClick={() => setEdit(true)}><FaEdit /> Edit Profile</button>}</div>
          {!edit ? (
            <div className="row g-3">
              <div className="col-6"><small className="text-muted d-block">Name</small><b>{user.name}</b></div>
              <div className="col-6"><small className="text-muted d-block">Phone</small><b>{user.phone}</b></div>
              <div className="col-12"><small className="text-muted d-block">Email</small><b>{user.email}</b></div>
              <div className="col-6"><small className="text-muted d-block">Budget preference</small><b>{user.budgetPreference || "-"}</b></div>
              <div className="col-6"><small className="text-muted d-block">Travel style</small><b>{user.travelStyle}</b></div>
              <div className="col-12"><small className="text-muted d-block mb-1">Interests</small>{user.interests?.length ? user.interests.map((i) => <span key={i} className="pill me-1 mb-1">{i}</span>) : <Link to="/interests">Choose interests</Link>}</div>
            </div>
          ) : (
            <div>
              <div className="row g-3">
                <div className="col-md-6"><label className="form-label">Full name</label><input className="form-control" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></div>
                <div className="col-md-6"><label className="form-label">Phone</label><input className="form-control" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} /></div>
                <div className="col-md-6"><label className="form-label">Budget preference</label><select className="form-select" value={f.budgetPreference} onChange={(e) => setF({ ...f, budgetPreference: e.target.value })}>{BUDGETS.map((b) => <option key={b.label}>{b.label}</option>)}</select></div>
                <div className="col-md-6"><label className="form-label">Travel style</label><select className="form-select" value={f.travelStyle} onChange={(e) => setF({ ...f, travelStyle: e.target.value })}>{STYLES.map((s) => <option key={s.id}>{s.id}</option>)}</select></div>
              </div>
              <label className="form-label mt-3">Interests</label>
              <InterestPicker value={f.interests} onChange={(v) => setF({ ...f, interests: v })} />
              <div className="d-flex gap-2 mt-3"><button className="btn-travel" onClick={save}>💾 Save</button><button className="btn-outline-travel" onClick={() => setEdit(false)}>Cancel</button></div>
            </div>
          )}
        </div></div>
        <div className="col-lg-5">
          <div className="panel">
            <h5><FaKey /> Change Password</h5>
            <input className="form-control mb-2" type="password" placeholder="Current password" value={pw.currentPassword} onChange={(e) => setPw({ ...pw, currentPassword: e.target.value })} />
            <input className="form-control mb-2" type="password" placeholder="New password" value={pw.newPassword} onChange={(e) => setPw({ ...pw, newPassword: e.target.value })} />
            <input className="form-control mb-3" type="password" placeholder="Confirm new password" value={pw.confirm} onChange={(e) => setPw({ ...pw, confirm: e.target.value })} />
            <button className="btn-warm" onClick={changePw}>Update Password</button>
          </div>
          <div className="panel"><button className="btn-outline-travel" style={{ borderColor: "#ef4444", color: "#ef4444" }} onClick={() => { logout(); navigate("/"); }}><FaSignOutAlt /> Logout</button></div>
        </div>
      </div></div>
    </div>
  );
}
