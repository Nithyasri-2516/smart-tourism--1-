import { useEffect, useState } from "react";
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import API, { errMsg } from "../../services/api";
import { useApp } from "../../context/AppContext";
import Loading from "../../components/Loading";

const COLORS = ["#0369a1", "#0d9488", "#16a34a", "#f97316", "#facc15", "#a855f7", "#ec4899", "#6366f1", "#ef4444", "#65a30d"];
const Chart = ({ title, children }) => (
  <div className="col-lg-6"><div className="chart-card"><h5>{title}</h5><ResponsiveContainer width="100%" height={280}>{children}</ResponsiveContainer></div></div>
);

export default function Analytics() {
  const { toast } = useApp();
  const [d, setD] = useState(null);
  useEffect(() => { API.get("/admin/analytics").then((r) => setD(r.data)).catch((e) => toast(errMsg(e), "error")); /* eslint-disable-next-line */ }, []);
  if (!d) return <Loading text="Loading analytics..." />;
  return (
    <div>
      <h3 className="mb-3">📈 Analytics</h3>
      <div className="row g-3">
        <Chart title="Monthly trips"><BarChart data={d.monthlyTrips}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" /><YAxis allowDecimals={false} /><Tooltip /><Bar dataKey="trips" fill="#0369a1" radius={[8, 8, 0, 0]} /></BarChart></Chart>
        <Chart title="User growth"><AreaChart data={d.userGrowth}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" /><YAxis allowDecimals={false} /><Tooltip /><Area type="monotone" dataKey="users" stroke="#0d9488" fill="#99f6e4" /></AreaChart></Chart>
        <Chart title="Popular destinations"><BarChart data={d.popularDestinations} layout="vertical"><CartesianGrid strokeDasharray="3 3" /><XAxis type="number" allowDecimals={false} /><YAxis type="category" dataKey="name" width={80} /><Tooltip /><Bar dataKey="trips" fill="#f97316" radius={[0, 8, 8, 0]} /></BarChart></Chart>
        <Chart title="Tourist categories"><PieChart><Pie data={d.categories} dataKey="value" nameKey="name" outerRadius={95} label>{d.categories.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /><Legend /></PieChart></Chart>
        <Chart title="Budget distribution"><BarChart data={d.budgetDistribution}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis allowDecimals={false} /><Tooltip /><Bar dataKey="trips" fill="#16a34a" radius={[8, 8, 0, 0]} /></BarChart></Chart>
        <Chart title="Most visited places"><LineChart data={d.mostVisitedPlaces}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} angle={-20} textAnchor="end" height={70} /><YAxis allowDecimals={false} /><Tooltip /><Line type="monotone" dataKey="visits" stroke="#a855f7" strokeWidth={3} /></LineChart></Chart>
      </div>
    </div>
  );
}
