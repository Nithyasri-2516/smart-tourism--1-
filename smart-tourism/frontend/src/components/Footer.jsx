import { Link } from "react-router-dom";
import { FaGlobeAsia, FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="row g-4">
          <div className="col-md-5">
            <div className="brand text-white mb-2"><span className="logo"><FaGlobeAsia /></span> Smart Tourism</div>
            <p className="small">Discover places that match your interests and plan every day of your trip in one place.</p>
          </div>
          <div className="col-6 col-md-3">
            <h6 className="text-white">Explore</h6>
            <div className="d-flex flex-column gap-1 small"><Link to="/explore">Destinations</Link><Link to="/preferences">Plan a Trip</Link><Link to="/interests">My Interests</Link></div>
          </div>
          <div className="col-6 col-md-4">
            <h6 className="text-white">Follow us</h6>
            <div className="d-flex gap-3 fs-4"><FaFacebook /><FaInstagram /><FaTwitter /></div>
          </div>
        </div>
        <hr style={{ borderColor: "rgba(255,255,255,.2)" }} />
        <div className="text-center small">© {new Date().getFullYear()} Smart Tourism – College MERN project</div>
      </div>
    </footer>
  );
}
