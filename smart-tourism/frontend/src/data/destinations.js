// Static constants + fallback data for the Home page
export const INTERESTS = [
  { id: "Adventure", emoji: "🏔", color: "#f97316" },
  { id: "Nature", emoji: "🌿", color: "#16a34a" },
  { id: "Beaches", emoji: "🏖", color: "#0ea5e9" },
  { id: "Heritage", emoji: "🏛", color: "#b45309" },
  { id: "Culture", emoji: "🎭", color: "#a855f7" },
  { id: "Food", emoji: "🍴", color: "#ef4444" },
  { id: "Shopping", emoji: "🛍", color: "#ec4899" },
  { id: "Wildlife", emoji: "🐘", color: "#65a30d" },
  { id: "Religious", emoji: "🛕", color: "#eab308" },
  { id: "Nightlife", emoji: "🌃", color: "#6366f1" },
];
export const CATEGORIES = INTERESTS.map((i) => i.id);

export const BUDGETS = [
  { label: "₹5,000 – ₹10,000", value: 10000 },
  { label: "₹10,000 – ₹25,000", value: 25000 },
  { label: "₹25,000 – ₹50,000", value: 50000 },
  { label: "₹50,000+", value: 75000 },
];
export const budgetValue = (label) => BUDGETS.find((b) => b.label === label)?.value || 0;

export const STYLES = [
  { id: "Budget", emoji: "💰", text: "Smart savings" },
  { id: "Standard", emoji: "⭐", text: "Comfort & value" },
  { id: "Luxury", emoji: "👑", text: "Premium stays" },
];
export const ACCOMMODATION = ["Budget", "3 Star", "4 Star", "5 Star"];
export const TRANSPORT = ["Public Transport", "Cab", "Rental Car"];
export const ACTIVITIES = ["Sightseeing", "Photography", "Trekking", "Water Sports", "Shopping", "Food", "Wildlife", "Heritage"];
export const SEASONS = ["Winter", "Summer", "Monsoon", "All Year"];
export const TRIP_STATUS = ["Upcoming", "Ongoing", "Completed", "Cancelled"];

export const homeDestinations = [
  { name: "Goa", location: "Goa, India", rating: 4.7, image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=900&q=70", description: "Golden beaches, old churches and lively nights." },
  { name: "Kerala", location: "Kerala, India", rating: 4.8, image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=900&q=70", description: "Backwater houseboats, spice hills and Ayurveda." },
  { name: "Ooty", location: "Tamil Nadu, India", rating: 4.5, image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=70", description: "Cool Nilgiri hills, tea gardens and a toy train." },
  { name: "Manali", location: "Himachal Pradesh, India", rating: 4.6, image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=900&q=70", description: "Snow passes, rafting and paragliding." },
  { name: "Jaipur", location: "Rajasthan, India", rating: 4.6, image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=900&q=70", description: "The Pink City of forts, palaces and bazaars." },
  { name: "Munnar", location: "Kerala, India", rating: 4.7, image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=900&q=70", description: "Endless tea plantations and misty peaks." },
];
export const HERO_IMG = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1800&q=70";
export const AUTH_IMG = "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1400&q=70";
