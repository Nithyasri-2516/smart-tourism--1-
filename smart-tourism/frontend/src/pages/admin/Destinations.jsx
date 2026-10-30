import { FaGlobeAmericas } from "react-icons/fa";
import AdminCrud from "../../components/AdminCrud";
import { CATEGORIES, SEASONS } from "../../data/destinations";

const fields = [
  { name: "name", label: "Destination name", required: true },
  { name: "location", label: "Location", required: true },
  { name: "category", label: "Category", type: "select", options: CATEGORIES },
  { name: "status", label: "Status", type: "select", options: ["Active", "Inactive"] },
  { name: "bestTime", label: "Best time to visit", placeholder: "October to March" },
  { name: "season", label: "Season", type: "select", options: SEASONS },
  { name: "rating", label: "Rating (0-5)", type: "number" },
  { name: "avgBudget", label: "Average budget (₹)", type: "number" },
  { name: "travelStyle", label: "Travel style", type: "select", options: ["Budget", "Standard", "Luxury"] },
  { name: "popularity", label: "Popularity (0-100)", type: "number" },
  { name: "image", label: "Image URL" },
  { name: "description", label: "Description", type: "textarea", required: true },
];
const columns = [
  { key: "image", label: "Image", sortable: false, render: (r) => <img className="thumb" src={r.image} alt="" onError={(e) => (e.target.style.visibility = "hidden")} /> },
  { key: "name", label: "Name" }, { key: "location", label: "Location" }, { key: "category", label: "Category", render: (r) => <span className="pill warm">{r.category}</span> },
  { key: "bestTime", label: "Best time" }, { key: "rating", label: "Rating" },
  { key: "status", label: "Status", render: (r) => <span className={"pill " + (r.status === "Active" ? "green" : "red")}>{r.status}</span> },
];
export default function Destinations() {
  return (
    <AdminCrud title="Destinations" label="Destination" icon={<FaGlobeAmericas />} endpoint="/destinations" columns={columns} fields={fields}
      defaults={{ category: "Nature", status: "Active", season: "All Year", rating: 4, avgBudget: 10000, travelStyle: "Standard", popularity: 50 }}
      searchText={(r) => `${r.name} ${r.location} ${r.category}`} filter={{ label: "Category", options: CATEGORIES, get: (r) => r.category }} />
  );
}
