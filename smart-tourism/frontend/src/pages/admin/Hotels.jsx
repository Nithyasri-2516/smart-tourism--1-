import { FaHotel } from "react-icons/fa";
import AdminCrud from "../../components/AdminCrud";

const fields = [
  { name: "name", label: "Hotel name", required: true },
  { name: "destination", label: "Destination", type: "ref", ref: "/destinations", required: true },
  { name: "priceRange", label: "Price range", placeholder: "₹3,000 - ₹6,000" },
  { name: "rating", label: "Rating (0-5)", type: "number" },
  { name: "contact", label: "Contact" },
  { name: "status", label: "Status", type: "select", options: ["Active", "Inactive"] },
  { name: "address", label: "Address" },
  { name: "image", label: "Image URL" },
  { name: "description", label: "Description", type: "textarea" },
];
const columns = [
  { key: "image", label: "Image", sortable: false, render: (r) => <img className="thumb" src={r.image} alt="" onError={(e) => (e.target.style.visibility = "hidden")} /> },
  { key: "name", label: "Hotel" }, { key: "destination", label: "Destination", sortValue: (r) => r.destination?.name, render: (r) => r.destination?.name },
  { key: "priceRange", label: "Price" }, { key: "rating", label: "Rating" }, { key: "contact", label: "Contact" },
  { key: "status", label: "Status", render: (r) => <span className={"pill " + (r.status === "Active" ? "green" : "red")}>{r.status}</span> },
];
export default function Hotels() {
  return (
    <AdminCrud title="Hotels" label="Hotel" icon={<FaHotel />} endpoint="/hotels" columns={columns} fields={fields}
      defaults={{ rating: 4, status: "Active" }} searchText={(r) => `${r.name} ${r.destination?.name} ${r.address}`}
      filter={{ label: "Status", options: ["Active", "Inactive"], get: (r) => r.status }} />
  );
}
