// Run with:  npm run seed
// Clears users, destinations, places, hotels, trips and reviews, then inserts sample data.
require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");
const Destination = require("./models/Destination");
const TouristPlace = require("./models/TouristPlace");
const Hotel = require("./models/Hotel");
const Trip = require("./models/Trip");
const Review = require("./models/Review");
const { generateItinerary } = require("./utils/itinerary");

const U = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=70`;
const IMG = {
  beach: U("photo-1512343879784-a960bf40e7f2"), tropical: U("photo-1507525428034-b723cf961d3e"),
  kerala: U("photo-1602216056096-3b40cc0c9944"), nature: U("photo-1469474968028-56623f02e42e"),
  hills: U("photo-1464822759023-fed622ff2c3b"), valley: U("photo-1506744038136-46273834b3fb"),
  manali: U("photo-1626621341517-bbf3d9990a23"), jaipur: U("photo-1477587458883-47145ed94245"),
  temple: U("photo-1548013146-72479768bada"), fort: U("photo-1524492412937-b28074a5d7da"),
  city: U("photo-1582510003544-4d00b7f74220"), mountain: U("photo-1519681393784-d120267933ba"),
};

// name, location, category, rating, avgBudget, style, season, bestTime, popularity, image, gallery, description
const destinations = [
  ["Goa", "Goa, India", "Beaches", 4.7, 18000, "Standard", "Winter", "November to February", 95, "beach", ["tropical", "beach", "nature"], "Sun, sand and Portuguese-era churches. Goa mixes quiet southern beaches with lively northern nightlife."],
  ["Kerala", "Kerala, India", "Nature", 4.8, 22000, "Standard", "Winter", "September to March", 92, "kerala", ["kerala", "nature", "tropical"], "Backwater houseboats, spice hills, Ayurveda and some of the best seafood in the country."],
  ["Ooty", "Tamil Nadu, India", "Nature", 4.5, 9000, "Budget", "Summer", "March to June", 80, "hills", ["hills", "valley", "nature"], "A classic hill station in the Nilgiris with tea estates, gardens and a heritage toy train."],
  ["Munnar", "Kerala, India", "Nature", 4.7, 12000, "Standard", "Winter", "September to May", 85, "nature", ["nature", "valley", "hills"], "Rolling tea plantations, misty peaks and rare wildlife in the Western Ghats."],
  ["Manali", "Himachal Pradesh, India", "Adventure", 4.6, 20000, "Standard", "Summer", "March to June", 90, "manali", ["mountain", "valley", "hills"], "Snow passes, river rafting, paragliding and cedar forests in the Kullu valley."],
  ["Jaipur", "Rajasthan, India", "Heritage", 4.6, 17000, "Luxury", "Winter", "October to March", 88, "jaipur", ["fort", "temple", "city"], "The Pink City: royal forts, palaces, bazaars and Rajasthani food."],
  ["Chennai", "Tamil Nadu, India", "Culture", 4.2, 8000, "Budget", "Winter", "November to February", 65, "city", ["beach", "temple", "city"], "A coastal metro known for temples, classical music and dance, filter coffee and a long beach."],
  ["Madurai", "Tamil Nadu, India", "Religious", 4.4, 7000, "Budget", "Winter", "October to March", 60, "temple", ["temple", "city", "fort"], "One of India's oldest cities, built around the towering Meenakshi Amman Temple."],
];

// dest, name, location, category, rating, fee, hours, best, duration, cost, tags, description
const places = [
  ["Goa", "Baga Beach", "Baga, North Goa", "Beaches", 4.5, 0, "Open 24 hours", "November to February", "3 hours", 1500, "water sports,photography,food", "Goa's busiest beach with water sports, shacks and sunset views."],
  ["Goa", "Basilica of Bom Jesus", "Old Goa", "Heritage", 4.6, 0, "9:00 AM - 6:30 PM", "November to February", "1.5 hours", 300, "heritage,sightseeing,photography", "UNESCO World Heritage church holding the relics of St. Francis Xavier."],
  ["Goa", "Dudhsagar Falls", "Mollem, South Goa", "Adventure", 4.7, 400, "9:00 AM - 5:00 PM", "June to December", "5 hours", 2500, "trekking,photography,sightseeing", "A four-tiered waterfall reached by jeep safari through the forest."],
  ["Goa", "Tito's Lane Nightlife", "Baga, North Goa", "Nightlife", 4.3, 0, "7:00 PM - 3:00 AM", "November to February", "3 hours", 2500, "food", "Clubs, live music and late-night bars in the heart of North Goa."],
  ["Kerala", "Alleppey Backwater Houseboat", "Alappuzha", "Nature", 4.8, 0, "8:00 AM - 6:00 PM", "September to March", "6 hours", 4500, "sightseeing,photography,food", "Cruise through palm-lined canals on a traditional kettuvallam houseboat."],
  ["Kerala", "Fort Kochi", "Kochi", "Heritage", 4.5, 0, "Open all day", "October to March", "4 hours", 1200, "heritage,photography,food", "Chinese fishing nets, Dutch palaces and art cafes along the old harbour."],
  ["Kerala", "Periyar Wildlife Sanctuary", "Thekkady", "Wildlife", 4.6, 300, "6:00 AM - 5:00 PM", "October to April", "5 hours", 2200, "wildlife,trekking,photography", "Boat safaris and forest walks to spot elephants, deer and birds."],
  ["Kerala", "Kovalam Beach", "Thiruvananthapuram", "Beaches", 4.4, 0, "Open all day", "November to March", "3 hours", 1000, "water sports,photography", "Crescent-shaped beaches with a lighthouse and calm swimming waters."],
  ["Ooty", "Ooty Botanical Garden", "Ooty, Nilgiris", "Nature", 4.4, 30, "8:30 AM - 6:30 PM", "April to June", "2 hours", 400, "sightseeing,photography", "Terraced gardens with thousands of plant species and a fossil tree."],
  ["Ooty", "Nilgiri Mountain Railway", "Coonoor to Ooty", "Heritage", 4.7, 300, "7:10 AM - 3:00 PM", "October to June", "4 hours", 800, "heritage,photography,sightseeing", "A UNESCO-listed toy train climbing through tunnels and tea country."],
  ["Ooty", "Doddabetta Peak", "Ooty, Nilgiris", "Nature", 4.3, 10, "9:00 AM - 6:00 PM", "March to June", "1.5 hours", 300, "sightseeing,photography", "The highest peak in the Nilgiris with a panoramic viewing deck."],
  ["Munnar", "Eravikulam National Park", "Munnar", "Wildlife", 4.7, 200, "7:30 AM - 4:00 PM", "September to May", "3 hours", 1200, "wildlife,trekking,photography", "Home of the endangered Nilgiri tahr and sweeping grassland hills."],
  ["Munnar", "Tea Museum and Estates", "Nallathanni, Munnar", "Culture", 4.4, 125, "9:00 AM - 4:00 PM", "September to May", "2 hours", 600, "sightseeing,photography,shopping", "Learn how tea is grown and processed, then taste fresh brews."],
  ["Munnar", "Mattupetty Dam", "Munnar", "Nature", 4.3, 100, "9:00 AM - 5:00 PM", "September to May", "2 hours", 700, "water sports,photography", "Scenic reservoir with speed-boating and views of green valleys."],
  ["Manali", "Solang Valley", "Solang, Manali", "Adventure", 4.6, 0, "9:00 AM - 5:00 PM", "March to June", "5 hours", 3500, "trekking,photography,water sports", "Paragliding, zorbing and snow activities with Himalayan views."],
  ["Manali", "Hadimba Temple", "Old Manali", "Religious", 4.5, 0, "8:00 AM - 6:00 PM", "March to June", "1.5 hours", 300, "heritage,photography,sightseeing", "A wooden cave temple surrounded by tall deodar forest."],
  ["Manali", "Rohtang Pass", "Rohtang, Manali", "Adventure", 4.7, 550, "6:00 AM - 3:00 PM", "May to October", "6 hours", 4000, "photography,sightseeing", "A high mountain pass with snow, glaciers and sweeping valley views."],
  ["Jaipur", "Amber Fort", "Amer, Jaipur", "Heritage", 4.7, 200, "8:00 AM - 5:30 PM", "October to March", "3 hours", 1500, "heritage,photography,sightseeing", "A hilltop fort-palace of mirrored halls and sandstone courtyards."],
  ["Jaipur", "Hawa Mahal", "Badi Choupad, Jaipur", "Heritage", 4.5, 50, "9:00 AM - 5:00 PM", "October to March", "1 hour", 400, "heritage,photography", "The 'Palace of Winds' with its honeycomb pink sandstone facade."],
  ["Jaipur", "Chokhi Dhani Village", "Tonk Road, Jaipur", "Culture", 4.4, 800, "5:30 PM - 11:00 PM", "October to March", "3 hours", 1800, "food,sightseeing", "A Rajasthani village resort with folk dance, puppets and a thali dinner."],
  ["Jaipur", "Johari Bazaar", "Walled City, Jaipur", "Shopping", 4.3, 0, "10:00 AM - 8:00 PM", "October to March", "2.5 hours", 3000, "shopping,food", "Famous for jewellery, block-print textiles and handcrafted juttis."],
  ["Chennai", "Marina Beach", "Chennai", "Beaches", 4.2, 0, "Open all day", "November to February", "2 hours", 300, "photography,food,sightseeing", "One of the longest urban beaches in the world, lively at sunrise and evening."],
  ["Chennai", "Kapaleeshwarar Temple", "Mylapore, Chennai", "Religious", 4.6, 0, "5:00 AM - 12:00 PM, 4:00 PM - 9:00 PM", "November to February", "1.5 hours", 200, "heritage,photography", "A Dravidian-style Shiva temple with a colourful gopuram."],
  ["Chennai", "Government Museum Chennai", "Egmore, Chennai", "Culture", 4.3, 50, "9:30 AM - 5:00 PM", "November to February", "2.5 hours", 300, "heritage,sightseeing", "A museum of bronzes, archaeology and natural history."],
  ["Madurai", "Meenakshi Amman Temple", "Madurai", "Religious", 4.8, 50, "5:00 AM - 12:30 PM, 4:00 PM - 10:00 PM", "October to March", "3 hours", 500, "heritage,photography,sightseeing", "A sprawling temple complex with 14 gateway towers covered in sculpture."],
  ["Madurai", "Thirumalai Nayak Palace", "Madurai", "Heritage", 4.4, 50, "9:00 AM - 5:00 PM", "October to March", "1.5 hours", 300, "heritage,photography", "A 17th-century palace blending Dravidian and Islamic styles."],
  ["Madurai", "Madurai Night Food Street", "Near Meenakshi Temple", "Food", 4.5, 0, "7:00 PM - 12:00 AM", "October to March", "2 hours", 600, "food", "Try parotta, kari dosa and jigarthanda at late-night stalls."],
];

// dest, name, description, priceRange, rating, contact, address, imageKey
const hotels = [
  ["Goa", "Taj Fort Aguada Resort", "Clifftop luxury resort with sea views.", "₹15,000 - ₹30,000", 4.8, "+91 832 6645 858", "Sinquerim, Candolim, Goa", "tropical"],
  ["Goa", "Zostel Goa", "Social hostel with a pool near the beach.", "₹800 - ₹2,500", 4.2, "+91 98765 11001", "Anjuna, North Goa", "beach"],
  ["Kerala", "Kumarakom Lake Resort", "Heritage villas on Vembanad Lake.", "₹12,000 - ₹28,000", 4.7, "+91 481 2525 711", "Kumarakom, Kottayam", "kerala"],
  ["Kerala", "Fort House Kochi", "Boutique waterfront stay in Fort Kochi.", "₹3,500 - ₹7,000", 4.4, "+91 484 2217 103", "Fort Kochi, Kochi", "nature"],
  ["Ooty", "Savoy Ooty", "Colonial-era hotel with garden cottages.", "₹5,000 - ₹12,000", 4.5, "+91 423 2225 500", "Sylks Road, Ooty", "hills"],
  ["Ooty", "Hillview Budget Inn", "Simple clean rooms close to the lake.", "₹1,200 - ₹2,800", 4.0, "+91 98765 22002", "Charing Cross, Ooty", "valley"],
  ["Munnar", "Tea Valley Resort", "Cottages overlooking tea estates.", "₹4,000 - ₹9,000", 4.5, "+91 486 5230 400", "Chithirapuram, Munnar", "nature"],
  ["Munnar", "Misty Mountain Stay", "Homestay with mountain-facing balconies.", "₹1,800 - ₹3,500", 4.3, "+91 98765 33003", "Pothamedu, Munnar", "hills"],
  ["Manali", "The Himalayan Manali", "Castle-style hotel with valley views.", "₹9,000 - ₹20,000", 4.6, "+91 1902 252 345", "Hadimba Road, Manali", "manali"],
  ["Manali", "Snowpeak Hostel", "Backpacker hostel with a bonfire lounge.", "₹700 - ₹2,000", 4.1, "+91 98765 44004", "Old Manali", "mountain"],
  ["Jaipur", "Rambagh Palace", "Former royal residence turned luxury hotel.", "₹30,000 - ₹70,000", 4.9, "+91 141 2385 700", "Bhawani Singh Road, Jaipur", "jaipur"],
  ["Jaipur", "Haveli Guest House", "Family-run haveli near Hawa Mahal.", "₹2,500 - ₹5,500", 4.3, "+91 98765 55005", "Walled City, Jaipur", "fort"],
  ["Chennai", "Taj Coromandel", "Business-class luxury in central Chennai.", "₹9,000 - ₹18,000", 4.6, "+91 44 6600 2827", "Nungambakkam, Chennai", "city"],
  ["Chennai", "Marina Budget Lodge", "Basic rooms near the beach.", "₹1,500 - ₹3,000", 3.9, "+91 98765 66006", "Triplicane, Chennai", "beach"],
  ["Madurai", "Heritage Madurai", "Resort with pool, 15 minutes from the temple.", "₹5,500 - ₹11,000", 4.5, "+91 452 2380 050", "Alagarkoil Road, Madurai", "temple"],
  ["Madurai", "Temple View Lodge", "Rooftop rooms facing the gopuram.", "₹1,400 - ₹3,200", 4.2, "+91 98765 77007", "West Tower Street, Madurai", "city"],
];

const users = [
  ["Priya Sharma", "priya@gmail.com", "9876500001", "user123", ["Beaches", "Food", "Nightlife"], "₹10,000 – ₹25,000", "Standard", 200],
  ["Arun Kumar", "arun@gmail.com", "9876500002", "user123", ["Adventure", "Nature"], "₹25,000 – ₹50,000", "Standard", 160],
  ["Meena Iyer", "meena@gmail.com", "9876500003", "user123", ["Heritage", "Culture", "Religious"], "₹5,000 – ₹10,000", "Budget", 120],
  ["Rahul Verma", "rahul@gmail.com", "9876500004", "user123", ["Wildlife", "Nature", "Adventure"], "₹50,000+", "Luxury", 85],
  ["Sneha Reddy", "sneha@gmail.com", "9876500005", "user123", ["Shopping", "Food", "Culture"], "₹10,000 – ₹25,000", "Standard", 50],
  ["Karthik Raj", "karthik@gmail.com", "9876500006", "user123", ["Heritage", "Photography".replace("Photography", "Nature")], "₹5,000 – ₹10,000", "Budget", 20],
];

const daysAgo = (n) => new Date(Date.now() - n * 86400000);
const comments = ["Absolutely loved it, worth every rupee!", "Beautiful place, go early to avoid crowds.", "Great experience for the whole family.", "Nice views, but a bit crowded on weekends.", "A must-visit. The photos do not do it justice."];

async function run() {
  if (!process.env.MONGO_URI || process.env.MONGO_URI.includes("<MY_EXISTING")) {
    console.error("Set MONGO_URI in backend/.env first");
    process.exit(1);
  }
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB connected successfully");

  await Promise.all([User.deleteMany(), Destination.deleteMany(), TouristPlace.deleteMany(), Hotel.deleteMany(), Trip.deleteMany(), Review.deleteMany()]);

  const admin = await User.create({ name: "Admin", email: "admin@gmail.com", phone: "9999999999", password: "admin123", role: "admin" });

  const destDocs = {};
  for (const d of destinations) {
    destDocs[d[0]] = await Destination.create({
      name: d[0], location: d[1], category: d[2], rating: d[3], avgBudget: d[4], travelStyle: d[5], season: d[6], bestTime: d[7],
      popularity: d[8], image: IMG[d[9]], gallery: d[10].map((k) => IMG[k]), description: d[11], status: "Active",
    });
  }

  const placeDocs = [];
  for (const p of places) {
    const dest = destDocs[p[0]];
    const siblings = places.filter((x) => x[0] === p[0] && x[1] !== p[1]).map((x) => x[1]).slice(0, 3);
    placeDocs.push(await TouristPlace.create({
      name: p[1], destination: dest._id, location: p[2], category: p[3], rating: p[4], entryFee: p[5], openingHours: p[6], bestTime: p[7],
      duration: p[8], estimatedCost: p[9], tags: p[10].split(","), description: p[11], image: dest.gallery[placeDocs.length % 3], gallery: dest.gallery, nearby: siblings,
    }));
  }

  const imgOf = (k) => IMG[k];
  for (const h of hotels) {
    await Hotel.create({ name: h[1], destination: destDocs[h[0]]._id, description: h[2], priceRange: h[3], rating: h[4], contact: h[5], address: h[6], image: imgOf(h[7]), status: "Active" });
  }

  const userDocs = [];
  for (const u of users) {
    userDocs.push(await User.create({ name: u[0], email: u[1], phone: u[2], password: u[3], interests: u[4], budgetPreference: u[5], travelStyle: u[6], createdAt: daysAgo(u[7]), favorites: [] }));
  }

  // trips
  const destNames = Object.keys(destDocs);
  let tripNo = 0;
  for (const [ui, user] of userDocs.entries()) {
    for (let k = 0; k < 3; k++) {
      const dest = destDocs[destNames[(ui * 2 + k * 3) % destNames.length]];
      const offset = (k === 0 ? -150 : k === 1 ? -60 : 25) + ui * 7;
      const start = daysAgo(-offset);
      const days = 3 + ((ui + k) % 3);
      const end = new Date(start.getTime() + (days - 1) * 86400000);
      const destPlaces = placeDocs.filter((p) => String(p.destination) === String(dest._id));
      const chosen = destPlaces.slice(0, 2 + ((ui + k) % 2));
      const status = offset < -days ? "Completed" : "Upcoming";
      await Trip.create({
        user: user._id, tripName: `${dest.name} ${k === 2 ? "Getaway" : k === 1 ? "Holiday" : "Escape"}`, destination: dest._id, startDate: start, endDate: end,
        travelers: 1 + ((ui + k) % 4), budget: [8000, 15000, 24000, 42000, 60000][(ui + k + tripNo) % 5], places: chosen.map((c) => c._id),
        itinerary: generateItinerary(chosen, days), status, createdAt: new Date(start.getTime() - 20 * 86400000),
      });
      tripNo++;
    }
    // favorites
    user.favorites = placeDocs.filter((_, i) => (i + ui) % 6 === 0).slice(0, 4).map((p) => p._id);
    await user.save();
  }

  // reviews
  for (let i = 0; i < 16; i++) {
    await Review.create({
      user: userDocs[i % userDocs.length]._id, touristPlace: placeDocs[(i * 3) % placeDocs.length]._id, rating: 3 + (i % 3), comment: comments[i % comments.length],
      status: i % 7 === 0 ? "Pending" : "Approved", createdAt: daysAgo(i * 6),
    });
  }

  console.log(`Seed complete: ${destinations.length} destinations, ${places.length} places, ${hotels.length} hotels, ${userDocs.length + 1} users`);
  console.log("Admin login -> admin@gmail.com / admin123");
  console.log("Sample user  -> priya@gmail.com / user123");
  await mongoose.disconnect();
}
run().catch((e) => { console.error("Seed failed:", e.message); process.exit(1); });
