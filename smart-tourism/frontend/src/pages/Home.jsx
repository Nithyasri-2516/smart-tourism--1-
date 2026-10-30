import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import DestinationCard from "../components/DestinationCard";
import { HERO_IMG, homeDestinations } from "../data/destinations";
import { useApp } from "../context/AppContext";

const WHY = [
  ["✨", "Smart Recommendations", "Places ranked by your interests, budget and travel style.", "#f97316"],
  ["🗺️", "Easy Trip Planning", "Pick dates, travelers and places in a few clicks.", "#0369a1"],
  ["📅", "Day-wise Itinerary", "A timeline for every day that you can edit and reorder.", "#0d9488"],
  ["❤️", "Save Favorites", "Keep the places you love in one list.", "#ef4444"],
  ["⭐", "Reviews & Ratings", "Read honest reviews and share your own.", "#eab308"],
];

export default function Home() {
  const [dests, setDests] = useState(homeDestinations);
  const { user } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/destinations").then(({ data }) => {
      const wanted = homeDestinations.map((d) => d.name);
      const found = wanted.map((n) => data.find((d) => d.name === n)).filter(Boolean);
      if (found.length) setDests(found);
    }).catch(() => {}); // keep static fallback if the server is offline
  }, []);

  const planTo = user ? "/preferences" : "/login";
  return (
    <div>
      <section className="hero" style={{ backgroundImage: `url(${HERO_IMG})` }}>
        <div className="container">
          <h1>Explore. Discover.<br />Experience.</h1>
          <p className="mt-3">Plan your perfect journey with Smart Tourism.</p>
          <div className="hero-actions">
            <button className="btn-warm" onClick={() => navigate("/explore")}>Explore Destinations</button>
            <button className="btn-ghost" onClick={() => navigate(planTo)}>Plan My Trip</button>
          </div>
        </div>
      </section>

      <section className="section container">
        <h2 className="section-title">Popular Destinations</h2>
        <p className="section-sub">Start with the places travelers love most.</p>
        <div className="row g-4">
          {dests.map((d) => <div className="col-md-6 col-lg-4" key={d.name}><DestinationCard dest={d} /></div>)}
        </div>
      </section>

      <section className="section" style={{ background: "#e3f2f6" }}>
        <div className="container">
          <h2 className="section-title text-center">Why Choose Us</h2>
          <p className="section-sub text-center">Everything you need from idea to itinerary.</p>
          <div className="row g-4 justify-content-center">
            {WHY.map(([e, t, d, c]) => (
              <div className="col-sm-6 col-lg-4 col-xl" key={t}>
                <div className="feature"><div className="emoji" style={{ background: c + "22" }}>{e}</div><h5>{t}</h5><p className="text-muted small mb-0">{d}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section container">
        <div className="cta">
          <h2>Ready for your next adventure?</h2>
          <p className="mb-4">Tell us what you enjoy and we will build the trip.</p>
          <Link to={planTo} className="btn-warm">Start Planning</Link>
        </div>
      </section>
    </div>
  );
}
