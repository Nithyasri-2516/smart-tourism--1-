import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaUserShield, FaEye, FaEyeSlash } from "react-icons/fa";
import API, { errMsg } from "../../services/api";
import { useApp } from "../../context/AppContext";
import { AUTH_IMG } from "../../data/destinations";

export default function AdminLogin() {
  const { setUser, toast } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return toast("Please fill all required fields", "error");
    try {
      setBusy(true);
      const { data } = await API.post("/auth/login", form);
      if (data.user.role !== "admin") return toast("This account is not an admin", "error");
      setUser(data.user);
      toast("Welcome, Admin");
      navigate("/admin");
    } catch (err) { toast(errMsg(err), "error"); } finally { setBusy(false); }
  };

  return (
    <div className="auth-login" style={{ backgroundImage: `url(${AUTH_IMG})` }}>
      <form className="login-card" onSubmit={submit}>
        <div className="text-center mb-3"><div className="avatar lg mx-auto" style={{ width: 70, height: 70, fontSize: "1.8rem" }}><FaUserShield /></div></div>
        <h2 className="text-center">Admin Login</h2>
        <p className="text-center text-muted">Manage destinations, places, hotels and more</p>
        <label className="form-label">Email</label>
        <input className="form-control mb-3" type="email" placeholder="admin@gmail.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <label className="form-label">Password</label>
        <div className="input-icon mb-4">
          <input className="form-control" type={show ? "text" : "password"} placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <button type="button" className="eye" onClick={() => setShow(!show)} aria-label="Show password">{show ? <FaEyeSlash /> : <FaEye />}</button>
        </div>
        <button className="btn-travel w-100 justify-content-center" disabled={busy}>{busy ? "Signing in..." : "Login as Admin"}</button>
        <div className="text-center mt-3 small"><Link to="/login">← Back to user login</Link></div>
      </form>
    </div>
  );
}
