const User = require("../models/User");
const safe = (u) => { const o = u.toObject(); delete o.password; return o; };

exports.register = async (req, res) => {
  try {
    const { name, email, phone, password, confirmPassword, interests, budgetPreference, travelStyle } = req.body;
    if (!name || !email || !phone || !password || !confirmPassword)
      return res.status(400).json({ message: "Please fill all required fields" });
    if (password !== confirmPassword) return res.status(400).json({ message: "Passwords do not match" });
    if (await User.findOne({ email: email.toLowerCase().trim() }))
      return res.status(400).json({ message: "Email already registered" });
    const user = await User.create({ name, email, phone, password, interests, budgetPreference, travelStyle, role: "user" });
    res.status(201).json({ message: "Registration successful", user: safe(user) });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Please fill all required fields" });
    const user = await User.findOne({ email: email.toLowerCase().trim(), password });
    if (!user) return res.status(400).json({ message: "Invalid email or password" });
    if (user.status === "Blocked") return res.status(400).json({ message: "Your account is blocked. Contact admin." });
    res.status(200).json({ message: "Login successful", user: safe(user) });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.changePassword = async (req, res) => {
  try {
    const { userId, currentPassword, newPassword } = req.body;
    if (!userId || !currentPassword || !newPassword) return res.status(400).json({ message: "Please fill all required fields" });
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.password !== currentPassword) return res.status(400).json({ message: "Current password is incorrect" });
    user.password = newPassword;
    await user.save();
    res.status(200).json({ message: "Password changed successfully" });
  } catch (e) { res.status(500).json({ message: e.message }); }
};
