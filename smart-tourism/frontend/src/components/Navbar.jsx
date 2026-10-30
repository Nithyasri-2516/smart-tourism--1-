import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaGlobeAsia, FaBars, FaTimes, FaUser, FaSignOutAlt, FaHeart, FaThLarge, FaStar } from "react-icons/fa";
import { useApp } from "../context/AppContext";

export default function Navbar() {
  const { user, logout, draft } = useApp();
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const navigate = useNavigate();
  const close = () => { setOpen(false); setMenu(false); };
  const link = ({ isActive }) => "nav-link-t" + (isActive ? " active" : "");
  const doLogout = () => { logout(); close(); navigate("/"); };

  return (
    <nav className="nav-travel">
      <div className="container d-flex align-items-center justify-content-between py-2 position-relative">
        <Link to="/" className="brand" onClick={close}><span className="logo"><FaGlobeAsia /></span> Smart Tourism</Link>
        <button className="nav-toggle" onClick={() => setOpen(!open)} aria-label="Menu">{open ? <FaTimes /> : <FaBars />}</button>
        <div className={"nav-menu" + (open ? " open" : "")}>
          <NavLink to="/" end className={link} onClick={close}>Home</NavLink>
          <NavLink to="/explore" className={link} onClick={close}>Explore</NavLink>
          {user && user.role === "user" && (
            <>
              <NavLink to="/dashboard" className={link} onClick={close}>Dashboard</NavLink>
              <NavLink to="/preferences" className={link} onClick={close}>Plan Trip{draft.length > 0 && <span className="nav-badge">{draft.length}</span>}</NavLink>
              <NavLink to="/my-trips" className={link} onClick={close}>My Trips</NavLink>
              <NavLink to="/favorites" className={link} onClick={close}>Favorites</NavLink>
            </>
          )}
          {!user && (
            <>
              <Link to="/login" className="btn-outline-travel" onClick={close}>Login</Link>
              <Link to="/register" className="btn-warm btn-sm-round" onClick={close}>Sign Up</Link>
            </>
          )}
          {user && (
            <div className="user-menu">
              <button className="avatar border-0" onClick={() => setMenu(!menu)} aria-label="Account">{user.name[0].toUpperCase()}</button>
              {menu && (
                <div className="user-dropdown">
                  <div className="px-3 py-2 small text-muted">{user.name}</div>
                  {user.role === "admin" ? (
                    <Link to="/admin" onClick={close}><FaThLarge /> Admin Panel</Link>
                  ) : (
                    <>
                      <Link to="/dashboard" onClick={close}><FaThLarge /> Dashboard</Link>
                      <Link to="/profile" onClick={close}><FaUser /> Profile</Link>
                      <Link to="/favorites" onClick={close}><FaHeart /> Favorites</Link>
                      <Link to="/reviews" onClick={close}><FaStar /> My Reviews</Link>
                    </>
                  )}
                  <button onClick={doLogout}><FaSignOutAlt /> Logout</button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
