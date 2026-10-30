import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API, { errMsg } from "../services/api";
import { useApp } from "../context/AppContext";
import InterestPicker from "../components/InterestPicker";

export default function Interests() {
  const { user, setUser, toast } = useApp();
  const navigate = useNavigate();
  const [sel, setSel] = useState(user.interests || []);
  const [busy, setBusy] = useState(false);
  const save = async () => {
    if (!sel.length) return toast("Please select at least one interest", "error");
    try { setBusy(true); const { data } = await API.put(`/users/${user._id}`, { interests: sel }); setUser({ ...user, ...data }); toast("Interests saved"); navigate("/dashboard"); }
    catch (e) { toast(errMsg(e), "error"); } finally { setBusy(false); }
  };
  return (
    <div className="page">
      <div className="page-head warm"><div className="container"><h1>What do you love to do? 🎒</h1><p className="fs-5 opacity-75 mb-0">Choose your interests and we will tune every recommendation.</p></div></div>
      <div className="container overlap"><div className="panel">
        <InterestPicker big value={sel} onChange={setSel} />
        <div className="d-flex justify-content-between align-items-center mt-4 flex-wrap gap-2">
          <span className="pill">{sel.length} selected</span>
          <button className="btn-travel" disabled={busy} onClick={save}>💾 Save Interests</button>
        </div>
      </div></div>
    </div>
  );
}
