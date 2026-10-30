import { NavLink, useNavigate } from "react-router-dom";
import { FaChartPie, FaGlobeAmericas, FaMapMarkedAlt, FaHotel, FaUsers, FaStar, FaPlane, FaChartLine, FaCog, FaSignOutAlt, FaGlobeAsia } from "react-icons/fa";
import { useApp } from "../context/AppContext";

const items = [
  ["/admin", "Dashboard", <FaChartPie />, true], ["/admin/destinations", "Destinations", <FaGlobeAmericas />],
  ["/admin/places", "Tourist Places", <FaMapMarkedAlt />], ["/admin/hotels", "Hotels", <FaHotel />],
  ["/admin/users", "Users", <FaUsers />], ["/admin/reviews", "Reviews", <FaStar />],
  ["/admin/trips", "Trips", <FaPlane />], ["/admin/analytics", "Analytics", <FaChartLine />],
  ["/admin/settings", "Settings", <FaCog />],
];
export default function Sidebar({ open, onClose }) {
  const { logout } = useApp();
  const navigate = useNavigate();
  return (
    <aside className={"sidebar" + (open ? " open" : "")}>
      <div className="brand text-white mb-4 px-2"><span className="logo"><FaGlobeAsia /></span> Admin</div>
      {items.map(([to, label, icon, end]) => (
        <NavLink key={to} to={to} end={end} onClick={onClose}>{icon} {label}</NavLink>
      ))}
      <button className="side-link" onClick={() => { logout(); navigate("/admin/login"); }}><FaSignOutAlt /> Logout</button>
    </aside>
  );
}
