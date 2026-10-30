import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import API, { errMsg } from "../services/api";
import { useApp } from "../context/AppContext";
import DestinationCard from "../components/DestinationCard";
import Loading from "../components/Loading";
import EmptyState from "../components/EmptyState";
import { CATEGORIES, SEASONS } from "../data/destinations";

export default function Explore() {
  const { toast, isFavDest, toggleFavoriteDestination } = useApp();
  const [params] = useSearchParams();
  const [list, setList] = useState(null);
  const [f, setF] = useState({ search: params.get("search") || "", category: "", budget: "", rating: "", style: "", season: "", sort: "popular" });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  useEffect(() => { API.get("/destinations").then((r) => setList(r.data.filter((d) => d.status === "Active"))).catch((e) => { toast(errMsg(e), "error"); setList([]); }); /* eslint-disable-next-line */ }, []);

  const shown = useMemo(() => {
    if (!list) return [];
    const s = f.search.toLowerCase();
    let r = list.filter((d) =>
      (!s || `${d.name} ${d.location} ${d.description}`.toLowerCase().includes(s)) && (!f.category || d.category === f.category) &&
      (!f.rating || d.rating >= Number(f.rating)) && (!f.style || d.travelStyle === f.style) && (!f.season || d.season === f.season) &&
      (!f.budget || (f.budget === "low" ? d.avgBudget < 10000 : f.budget === "mid" ? d.avgBudget >= 10000 && d.avgBudget < 20000 : d.avgBudget >= 20000)));
    const sorts = { popular: (a, b) => b.popularity - a.popularity, rated: (a, b) => b.rating - a.rating, low: (a, b) => a.avgBudget - b.avgBudget, high: (a, b) => b.avgBudget - a.avgBudget, az: (a, b) => a.name.localeCompare(b.name) };
    return [...r].sort(sorts[f.sort]);
  }, [list, f]);

  return (
    <div className="page">
      <div className="page-head blue">
        <div className="container">
          <h1>Explore Amazing Destinations 🌎</h1>
          <div className="search-bar mt-3" style={{ maxWidth: 640 }}><FaSearch className="text-muted" /><input placeholder="Search destinations..." value={f.search} onChange={set("search")} /></div>
        </div>
      </div>
      <div className="container overlap">
        <div className="sticky-filter mb-4">
          <div className="row g-2">
            <div className="col-6 col-lg-2"><select className="form-select" value={f.category} onChange={set("category")}><option value="">Category</option>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select></div>
            <div className="col-6 col-lg-2"><select className="form-select" value={f.budget} onChange={set("budget")}><option value="">Budget</option><option value="low">Under ₹10,000</option><option value="mid">₹10,000 – ₹20,000</option><option value="high">₹20,000+</option></select></div>
            <div className="col-6 col-lg-2"><select className="form-select" value={f.rating} onChange={set("rating")}><option value="">Rating</option><option value="4">4+ stars</option><option value="4.5">4.5+ stars</option></select></div>
            <div className="col-6 col-lg-2"><select className="form-select" value={f.style} onChange={set("style")}><option value="">Travel style</option><option>Budget</option><option>Standard</option><option>Luxury</option></select></div>
            <div className="col-6 col-lg-2"><select className="form-select" value={f.season} onChange={set("season")}><option value="">Best time</option>{SEASONS.map((s) => <option key={s}>{s}</option>)}</select></div>
            <div className="col-6 col-lg-2"><select className="form-select" value={f.sort} onChange={set("sort")}><option value="popular">Popular</option><option value="rated">Highest Rated</option><option value="low">Lowest Budget</option><option value="high">Highest Budget</option><option value="az">A-Z</option></select></div>
          </div>
        </div>
        {!list ? <Loading text="Loading destinations..." /> : shown.length === 0 ? (
          <EmptyState title="No destinations found" text="Try changing your search or filters."><button className="btn-travel" onClick={() => setF({ search: "", category: "", budget: "", rating: "", style: "", season: "", sort: "popular" })}>Clear filters</button></EmptyState>
        ) : (
          <div className="row g-4">
            {shown.map((d) => <div className="col-md-6 col-lg-4" key={d._id}><DestinationCard tall dest={d} fav={isFavDest(d._id)} onFav={toggleFavoriteDestination} /></div>)}
          </div>
        )}
      </div>
    </div>
  );
}
