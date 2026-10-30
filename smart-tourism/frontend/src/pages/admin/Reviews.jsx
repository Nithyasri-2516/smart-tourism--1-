import { FaStar, FaCheck, FaTimes } from "react-icons/fa";
import AdminCrud from "../../components/AdminCrud";
import Stars from "../../components/Stars";
import API, { errMsg } from "../../services/api";
import { useApp } from "../../context/AppContext";
import { fmtDate } from "../../services/helpers";

const fields = [
  { name: "rating", label: "Rating (1-5)", type: "number" },
  { name: "status", label: "Status", type: "select", options: ["Approved", "Pending", "Rejected"] },
  { name: "comment", label: "Review", type: "textarea", required: true },
];
const colors = { Approved: "green", Pending: "yellow", Rejected: "red" };
export default function AdminReviews() {
  const { toast } = useApp();
  const setStatus = async (r, status, reload) => {
    try { await API.put(`/reviews/${r._id}`, { status }); toast(`Review ${status.toLowerCase()}`); reload(); } catch (e) { toast(errMsg(e), "error"); }
  };
  const columns = [
    { key: "user", label: "User", sortValue: (r) => r.user?.name, render: (r) => r.user?.name || "-" },
    { key: "touristPlace", label: "Tourist place", sortValue: (r) => r.touristPlace?.name, render: (r) => r.touristPlace?.name || "-" },
    { key: "rating", label: "Rating", render: (r) => <Stars value={r.rating} size={13} /> },
    { key: "comment", label: "Review", render: (r) => <span title={r.comment}>{r.comment.slice(0, 50)}{r.comment.length > 50 ? "..." : ""}</span> },
    { key: "createdAt", label: "Date", render: (r) => fmtDate(r.createdAt) },
    { key: "status", label: "Status", render: (r) => <span className={"pill " + colors[r.status]}>{r.status}</span> },
  ];
  return (
    <AdminCrud title="Reviews" label="Review" icon={<FaStar />} endpoint="/reviews" columns={columns} fields={fields} canAdd={false}
      searchText={(r) => `${r.user?.name} ${r.touristPlace?.name} ${r.comment}`} filter={{ label: "Status", options: ["Approved", "Pending", "Rejected"], get: (r) => r.status }}
      extraActions={(r, reload) => (
        <>
          <button className="icon-btn" title="Approve" onClick={() => setStatus(r, "Approved", reload)}><FaCheck /></button>
          <button className="icon-btn danger" title="Reject" onClick={() => setStatus(r, "Rejected", reload)}><FaTimes /></button>
        </>
      )} />
  );
}
