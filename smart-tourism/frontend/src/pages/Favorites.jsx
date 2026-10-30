import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaHeart, FaEye, FaPlus } from "react-icons/fa";
import API, { errMsg } from "../services/api";
import { useApp } from "../context/AppContext";
import SmartImg from "../components/SmartImg";
import Loading from "../components/Loading";
import EmptyState from "../components/EmptyState";
import { inr } from "../services/helpers";

export default function Favorites() {
  const { user, toast, toggleFavorite, toggleFavoriteDestination, addToTrip } = useApp();
  const [data, setData] = useState(null);
  const load = () => API.get(`/users/${user._id}/favorites`).then((r) => setData(r.data)).catch((e) => { toast(errMsg(e), "error"); setData({ places: [], destinations: [] }); });
  useEffect(() => { load(); /* eslint-disable-next-line */ }, []);

  const removePlace = async (p) => { await toggleFavorite(p); load(); };
  const removeDest = async (d) => { await toggleFavoriteDestination(d); load(); };

  return (
    <div className="page">
      <div className="page-head warm"><div className="container"><h1>My Favorites ❤️</h1><p className="fs-5 opacity-75 mb-0">Places and destinations you saved.</p></div></div>
      <div className="container overlap">
        {!data ? <Loading text="Loading favorites..." /> : data.places.length + data.destinations.length === 0 ? (
          <EmptyState icon="💔" title="No favorites yet" text="Tap the heart on any place to save it here."><Link to="/explore" className="btn-travel">Explore destinations</Link></EmptyState>
        ) : (
          <>
            {data.destinations.length > 0 && <h4 className="mb-3">Destinations</h4>}
            <div className="row g-4 mb-4">
              {data.destinations.map((d) => (
                <div className="col-md-6 col-lg-4" key={d._id}><div className="card-t">
                  <div className="card-img"><SmartImg src={d.image} alt={d.name} /></div>
                  <div className="card-body-t"><h5>{d.name}</h5><div className="loc">{d.location}</div>
                    <div className="card-actions"><button className="btn-outline-travel" onClick={() => removeDest(d)}><FaHeart /> Remove</button><Link to={`/destination/${d._id}`} className="btn-travel btn-sm-round"><FaEye /> View Details</Link></div></div>
                </div></div>
              ))}
            </div>
            {data.places.length > 0 && <h4 className="mb-3">Tourist places</h4>}
            <div className="row g-4">
              {data.places.map((p) => (
                <div className="col-md-6 col-lg-4" key={p._id}><div className="card-t">
                  <div className="card-img"><SmartImg src={p.image} alt={p.name} /><span className="pill blue card-badge">{p.category}</span></div>
                  <div className="card-body-t"><h5>{p.name}</h5><div className="loc">{p.location}</div><div className="price my-1">{inr(p.estimatedCost)}</div>
                    <div className="card-actions">
                      <button className="btn-outline-travel" onClick={() => removePlace(p)}><FaHeart /> Remove</button>
                      <Link to={`/place/${p._id}`} className="btn-outline-travel"><FaEye /> View Details</Link>
                      <button className="btn-warm btn-sm-round" onClick={() => addToTrip(p)}><FaPlus /> Add to Trip</button>
                    </div></div>
                </div></div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
