import { FaMapMarkedAlt } from "react-icons/fa";
import AdminCrud from "../../components/AdminCrud";
import { CATEGORIES } from "../../data/destinations";

const fields = [
  { name: "name", label: "Place name", required: true },
  { name: "destination", label: "Destination", type: "ref", ref: "/destinations", required: true },
  { name: "location", label: "Location / area" },
  { name: "category", label: "Category", type: "select", options: CATEGORIES },
  { name: "rating", label: "Rating (0-5)", type: "number" },
  { name: "entryFee", label: "Entry fee (₹)", type: "number" },
  { name: "estimatedCost", label: "Estimated cost (₹)", type: "number" },
  { name: "openingHours", label: "Opening hours" },
  { name: "bestTime", label: "Best time" },
  { name: "duration", label: "Duration", placeholder: "2 hours" },
  { name: "tags", label: "Tags (comma separated)", type: "tags", placeholder: "trekking, photography" },
  { name: "image", label: "Image URL" },
  { name: "description", label: "Description", type: "textarea", required: true },
];
const columns = [
  { key: "image", label: "Image", sortable: false, render: (r) => <img className="thumb" src={r.image} alt="" onError={(e) => (e.target.style.visibility = "hidden")} /> },
  { key: "name", label: "Place" }, { key: "destination", label: "Destination", sortValue: (r) => r.destination?.name, render: (r) => r.destination?.name },
  { key: "category", label: "Category", render: (r) => <span className="pill blue">{r.category}</span> },
  { key: "rating", label: "Rating" }, { key: "entryFee", label: "Entry fee", render: (r) => (r.entryFee ? "₹" + r.entryFee : "Free") }, { key: "duration", label: "Duration" },
];
export default function TouristPlaces() {
  return (
    <AdminCrud title="Tourist Places" label="Place" icon={<FaMapMarkedAlt />} endpoint="/places" columns={columns} fields={fields}
      defaults={{ category: "Nature", rating: 4, entryFee: 0, estimatedCost: 500, openingHours: "9:00 AM - 6:00 PM", duration: "2 hours" }}
      searchText={(r) => `${r.name} ${r.destination?.name} ${r.category}`} filter={{ label: "Category", options: CATEGORIES, get: (r) => r.category }} />
  );
}
