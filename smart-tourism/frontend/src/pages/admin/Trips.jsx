import { FaPlane } from "react-icons/fa";
import AdminCrud from "../../components/AdminCrud";
import { TRIP_STATUS } from "../../data/destinations";
import { fmtDate, inr } from "../../services/helpers";

const fields = [
  { name: "tripName", label: "Trip name", required: true },
  { name: "status", label: "Status", type: "select", options: TRIP_STATUS },
  { name: "travelers", label: "Travelers", type: "number" },
  { name: "budget", label: "Budget (₹)", type: "number" },
];
const colors = { Upcoming: "blue", Ongoing: "green", Completed: "yellow", Cancelled: "red" };
const columns = [
  { key: "_id", label: "Trip ID", render: (r) => "#" + r._id.slice(-6).toUpperCase() },
  { key: "tripName", label: "Trip" },
  { key: "user", label: "User", sortValue: (r) => r.user?.name, render: (r) => r.user?.name || "-" },
  { key: "destination", label: "Destination", sortValue: (r) => r.destination?.name, render: (r) => r.destination?.name || "-" },
  { key: "startDate", label: "Start", render: (r) => fmtDate(r.startDate) }, { key: "endDate", label: "End", render: (r) => fmtDate(r.endDate) },
  { key: "travelers", label: "Travelers" }, { key: "budget", label: "Budget", render: (r) => inr(r.budget) },
  { key: "status", label: "Status", render: (r) => <span className={"pill " + colors[r.status]}>{r.status}</span> },
];
export default function Trips() {
  return (
    <AdminCrud title="Trips" label="Trip" icon={<FaPlane />} endpoint="/trips" columns={columns} fields={fields} canAdd={false}
      searchText={(r) => `${r._id} ${r.tripName} ${r.user?.name} ${r.destination?.name}`} filter={{ label: "Status", options: TRIP_STATUS, get: (r) => r.status }} />
  );
}
