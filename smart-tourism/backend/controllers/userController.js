const User = require("../models/User");
const Trip = require("../models/Trip");
const Review = require("../models/Review");
const safe = (u) => { const o = u.toObject ? u.toObject() : u; delete o.password; return o; };

exports.getAll = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    const counts = await Trip.aggregate([{ $group: { _id: "$user", n: { $sum: 1 } } }]);
    const map = {};
    counts.forEach((c) => (map[String(c._id)] = c.n));
    res.status(200).json(users.map((u) => ({ ...safe(u), tripCount: map[String(u._id)] || 0 })));
  } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.getOne = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(safe(user));
  } catch (e) { res.status(404).json({ message: "User not found" }); }
};

exports.update = async (req, res) => {
  try {
    const body = { ...req.body };
    if (!body.password) delete body.password;
    const user = await User.findByIdAndUpdate(req.params.id, body, { new: true, runValidators: true });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(safe(user));
  } catch (e) { res.status(400).json({ message: e.code === 11000 ? "Email already registered" : e.message }); }
};

exports.remove = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    await Trip.deleteMany({ user: user._id });
    await Review.deleteMany({ user: user._id });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate({ path: "favorites", populate: "destination" }).populate("favoriteDestinations");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ places: user.favorites, destinations: user.favoriteDestinations });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

const toggle = (field) => async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    const target = req.params.targetId;
    const has = user[field].map(String).includes(target);
    user[field] = has ? user[field].filter((x) => String(x) !== target) : [...user[field], target];
    await user.save();
    res.status(200).json({ added: !has, favorites: user.favorites, favoriteDestinations: user.favoriteDestinations });
  } catch (e) { res.status(500).json({ message: e.message }); }
};
exports.togglePlace = toggle("favorites");
exports.toggleDestination = toggle("favoriteDestinations");
