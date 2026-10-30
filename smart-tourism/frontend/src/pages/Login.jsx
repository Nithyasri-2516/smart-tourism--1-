import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import API, { errMsg } from "../services/api";
import { useApp } from "../context/AppContext";
import { AUTH_IMG } from "../data/destinations";

export default function Login() {
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
      setUser(data.user);
      toast(`Welcome back, ${data.user.name.split(" ")[0]}`);
      navigate(data.user.role === "admin" ? "/admin" : "/dashboard");
    } catch (err) { toast(errMsg(err), "error"); } finally { setBusy(false); }
  };

  return (
    <div className="auth-login" style={{ backgroundImage: `url(${AUTH_IMG})` }}>
      <form className="login-card" onSubmit={submit}>
        <h2>Welcome Back 👋</h2>
        <p className="text-muted mb-4">Continue your travel journey</p>
        <label className="form-label">Email</label>
        <input className="form-control mb-3" type="email" placeholder="you@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <label className="form-label">Password</label>
        <div className="input-icon mb-4">
          <input className="form-control" type={show ? "text" : "password"} placeholder="Your password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <button type="button" className="eye" onClick={() => setShow(!show)} aria-label="Show or hide password">{show ? <FaEyeSlash /> : <FaEye />}</button>
        </div>
        <button className="btn-travel w-100 justify-content-center" disabled={busy}>{busy ? "Logging in..." : "Login"}</button>
        <div className="text-center mt-3">Don't have an account? <Link to="/register" className="fw-bold">Create Account</Link></div>
        <div className="text-center mt-2 small"><Link to="/admin/login">Admin login</Link></div>
      </form>
    </div>
  );
}
