import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { useApp } from "./context/AppContext";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Explore from "./pages/Explore";
import DestinationDetails from "./pages/DestinationDetails";
import PlaceDetails from "./pages/PlaceDetails";
import Interests from "./pages/Interests";
import Preferences from "./pages/Preferences";
import Recommendations from "./pages/Recommendations";
import CreateTrip from "./pages/CreateTrip";
import Itinerary from "./pages/Itinerary";
import MyTrips from "./pages/MyTrips";
import Favorites from "./pages/Favorites";
import Reviews from "./pages/Reviews";
import Profile from "./pages/Profile";

import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Destinations from "./pages/admin/Destinations";
import TouristPlaces from "./pages/admin/TouristPlaces";
import Hotels from "./pages/admin/Hotels";
import Users from "./pages/admin/Users";
import AdminReviews from "./pages/admin/Reviews";
import Trips from "./pages/admin/Trips";
import Analytics from "./pages/admin/Analytics";
import Settings from "./pages/admin/Settings";

// Only used for UI: sends logged-out visitors to /login (no real security, as required)
function UserRoute({ children }) {
  const { user } = useApp();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === "admin") return <Navigate to="/admin" replace />;
  return children;
}

export default function App() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  const bare = pathname.startsWith("/admin") || pathname === "/login" || pathname === "/register";

  return (
    <>
      {!bare && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/destination/:id" element={<DestinationDetails />} />
        <Route path="/place/:id" element={<PlaceDetails />} />

        <Route path="/dashboard" element={<UserRoute><Dashboard /></UserRoute>} />
        <Route path="/interests" element={<UserRoute><Interests /></UserRoute>} />
        <Route path="/preferences" element={<UserRoute><Preferences /></UserRoute>} />
        <Route path="/recommendations" element={<UserRoute><Recommendations /></UserRoute>} />
        <Route path="/create-trip" element={<UserRoute><CreateTrip /></UserRoute>} />
        <Route path="/itinerary/:id" element={<UserRoute><Itinerary /></UserRoute>} />
        <Route path="/my-trips" element={<UserRoute><MyTrips /></UserRoute>} />
        <Route path="/favorites" element={<UserRoute><Favorites /></UserRoute>} />
        <Route path="/reviews" element={<UserRoute><Reviews /></UserRoute>} />
        <Route path="/profile" element={<UserRoute><Profile /></UserRoute>} />

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="destinations" element={<Destinations />} />
          <Route path="places" element={<TouristPlaces />} />
          <Route path="hotels" element={<Hotels />} />
          <Route path="users" element={<Users />} />
          <Route path="reviews" element={<AdminReviews />} />
          <Route path="trips" element={<Trips />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {!bare && <Footer />}
    </>
  );
}
