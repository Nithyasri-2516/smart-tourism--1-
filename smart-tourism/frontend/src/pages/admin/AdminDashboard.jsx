import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaUsers, FaGlobeAmericas, FaMapMarkedAlt, FaHotel, FaPlane, FaStar } from "react-icons/fa";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar } from "recharts";
import API, { errMsg } from "../../services/api";
import { useApp } from "../../context/AppContext";
import Loading from "../../components/Loading";

const cards = [
  ["users", "Total Users", <FaUsers />, "g2", "/admin/users"], ["destinations", "Total Destinations", <FaGlobeAmericas />, "g4", "/admin/destinations"],
  ["places", "Total Tourist Places", <FaMapMarkedAlt />, "g1", "/admin/places"], ["hotels", "Total Hotels", <FaHotel />, "g5", "/admin/hotels"],
  ["trips", "Total Trips", <FaPlane />, "g3", "/admin/trips"], ["reviews", "Total Reviews", <FaStar />, "g6", "/admin/reviews"],
];
export default function AdminDashboard() {
  const { toast } = useApp();
  const [stats, setStats] = useState(null);
  const [an, setAn] = useState(null);
  useEffect(() => {
    Promise.all([API.get("/admin/stats"), API.get("/admin/analytics")])
      .then(([s, a]) => { setStats(s.data); setAn(a.data); })
      .catch((e) => toast(errMsg(e), "error"));
    // eslint-disable-next-line
  }, []);
  if (!stats) return <Loading text="Loading dashboard..." />;
  return (
    <div>
      <h3 className="mb-3">📊 Dashboard</h3>
      <div className="row g-3 mb-4">
        {cards.map(([k, label, icon, g, to]) => (
          <div className="col-12 col-sm-6 col-xl-4" key={k}>
            <Link to={to}><div className={`stat ${g}`}><div className="ico">{icon}</div><div><h3>{stats[k]}</h3><small>{label}</small></div></div></Link>
          </div>
        ))}
      </div>
      {an && (
        <div className="row g-3">
          <div className="col-lg-6"><div className="chart-card"><h5>Monthly trips</h5>
            <ResponsiveContainer width="100%" height={260}><LineChart data={an.monthlyTrips}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" /><YAxis allowDecimals={false} /><Tooltip /><Line type="monotone" dataKey="trips" stroke="#0d9488" strokeWidth={3} /></LineChart></ResponsiveContainer></div></div>
          <div className="col-lg-6"><div className="chart-card"><h5>Popular destinations</h5>
            <ResponsiveContainer width="100%" height={260}><BarChart data={an.popularDestinations}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis allowDecimals={false} /><Tooltip /><Bar dataKey="trips" fill="#f97316" radius={[8, 8, 0, 0]} /></BarChart></ResponsiveContainer></div></div>
        </div>
      )}
    </div>
  );
}
