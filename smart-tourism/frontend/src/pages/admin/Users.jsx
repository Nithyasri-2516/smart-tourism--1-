import { FaUsers } from "react-icons/fa";
import AdminCrud from "../../components/AdminCrud";
import { fmtDate } from "../../services/helpers";

const fields = [
  { name: "name", label: "Full name", required: true },
  { name: "email", label: "Email", required: true },
  { name: "phone", label: "Phone", required: true },
  { name: "password", label: "Password (leave blank to keep)", type: "password" },
  { name: "role", label: "Role", type: "select", options: ["user", "admin"] },
  { name: "status", label: "Status", type: "select", options: ["Active", "Blocked"] },
  { name: "travelStyle", label: "Travel style", type: "select", options: ["Budget", "Standard", "Luxury"] },
  { name: "budgetPreference", label: "Budget preference" },
  { name: "interests", label: "Interests (comma separated)", type: "tags" },
];
const columns = [
  { key: "name", label: "Name", render: (r) => <div className="d-flex align-items-center gap-2"><div className="avatar" style={{ width: 34, height: 34 }}>{r.name[0]}</div>{r.name}</div> },
  { key: "email", label: "Email" }, { key: "phone", label: "Phone" },
  { key: "createdAt", label: "Registered", render: (r) => fmtDate(r.createdAt) }, { key: "tripCount", label: "Trips" },
  { key: "status", label: "Status", render: (r) => <span className={"pill " + (r.status === "Active" ? "green" : "red")}>{r.status}</span> },
  { key: "role", label: "Role", render: (r) => <span className={"pill " + (r.role === "admin" ? "warm" : "blue")}>{r.role}</span> },
];
export default function Users() {
  return (
    <AdminCrud title="Users" label="User" icon={<FaUsers />} endpoint="/users" columns={columns} fields={fields} canAdd={false}
      searchText={(r) => `${r.name} ${r.email} ${r.phone}`} filter={{ label: "Role", options: ["user", "admin"], get: (r) => r.role }} />
  );
}
