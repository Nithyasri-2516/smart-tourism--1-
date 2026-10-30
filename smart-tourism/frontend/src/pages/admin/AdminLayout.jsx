import { useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import Sidebar from "../../components/Sidebar";
import { useApp } from "../../context/AppContext";

export default function AdminLayout() {
  const { user } = useApp();
  const [open, setOpen] = useState(false);
  if (!user || user.role !== "admin") return <Navigate to="/admin/login" replace />;
  return (
    <div className="admin-shell">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <div className="admin-main">
        <div className="admin-top">
          <button className="side-toggle" onClick={() => setOpen(!open)} aria-label="Toggle sidebar"><FaBars /></button>
          <b className="display fs-5">Smart Tourism Admin</b>
          <div className="d-flex align-items-center gap-2"><span className="d-none d-sm-inline small">{user.name}</span><div className="avatar">{user.name[0]}</div></div>
        </div>
        <div className="admin-body"><Outlet /></div>
      </div>
    </div>
  );
}
