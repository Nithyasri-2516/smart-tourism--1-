const User = require("../models/User");
const Destination = require("../models/Destination");
const TouristPlace = require("../models/TouristPlace");
const Hotel = require("../models/Hotel");
const Trip = require("../models/Trip");
const Review = require("../models/Review");

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const monthKey = (d) => `${MONTHS[new Date(d).getMonth()]} ${String(new Date(d).getFullYear()).slice(2)}`;

exports.stats = async (req, res) => {
  try {
    const [users, destinations, places, hotels, trips, reviews] = await Promise.all([
      User.countDocuments(), Destination.countDocuments(), TouristPlace.countDocuments(),
      Hotel.countDocuments(), Trip.countDocuments(), Review.countDocuments(),
    ]);
    res.status(200).json({ users, destinations, places, hotels, trips, reviews });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.analytics = async (req, res) => {
  try {
    const [users, trips, places] = await Promise.all([
      User.find().sort({ createdAt: 1 }),
      Trip.find().populate("destination places"),
      TouristPlace.find(),
    ]);

    const tripsByMonth = {}; trips.forEach((t) => { const k = monthKey(t.startDate); tripsByMonth[k] = (tripsByMonth[k] || 0) + 1; });
    const monthlyTrips = Object.entries(tripsByMonth).map(([month, trips]) => ({ month, trips }));

    const usersByMonth = {}; users.forEach((u) => { const k = monthKey(u.createdAt); usersByMonth[k] = (usersByMonth[k] || 0) + 1; });
    let total = 0;
    const userGrowth = Object.entries(usersByMonth).map(([month, n]) => ({ month, users: (total += n) }));

    const dest = {}; trips.forEach((t) => { const n = t.destination?.name; if (n) dest[n] = (dest[n] || 0) + 1; });
    const popularDestinations = Object.entries(dest).map(([name, trips]) => ({ name, trips })).sort((a, b) => b.trips - a.trips);

    const cat = {}; places.forEach((p) => (cat[p.category] = (cat[p.category] || 0) + 1));
    const categories = Object.entries(cat).map(([name, value]) => ({ name, value }));

    const buckets = [["Under 10k", 0, 10000], ["10k - 25k", 10000, 25000], ["25k - 50k", 25000, 50000], ["50k+", 50000, Infinity]];
    const budgetDistribution = buckets.map(([name, lo, hi]) => ({ name, trips: trips.filter((t) => t.budget >= lo && t.budget < hi).length }));

    const visited = {}; trips.forEach((t) => t.places.forEach((p) => (visited[p.name] = (visited[p.name] || 0) + 1)));
    const mostVisitedPlaces = Object.entries(visited).map(([name, visits]) => ({ name, visits })).sort((a, b) => b.visits - a.visits).slice(0, 8);

    res.status(200).json({ monthlyTrips, userGrowth, popularDestinations, categories, budgetDistribution, mostVisitedPlaces });
  } catch (e) { res.status(500).json({ message: e.message }); }
};
