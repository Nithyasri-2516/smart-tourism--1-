# Smart Tourism Recommendation and Trip Planning System (MERN)

React + Vite frontend, Node/Express backend, MongoDB Atlas via Mongoose. No JWT, bcrypt or middleware (college-project style).

## 1. Backend setup
```bash
cd backend
npm install
```
Open `backend/.env` and replace the placeholder with **your existing Atlas connection string**:
```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/smart_tourism?retryWrites=true&w=majority
```
(Include a database name such as `smart_tourism` before the `?`. In Atlas > Network Access, allow your IP.)

## 2. Seed the database (admin + sample data)
```bash
cd backend
npm run seed
```
Clears and refills users, destinations, places, hotels, trips and reviews.
- Admin: `admin@gmail.com` / `admin123`
- Sample users: `priya@gmail.com`, `arun@gmail.com`, `meena@gmail.com`, `rahul@gmail.com`, `sneha@gmail.com`, `karthik@gmail.com` — all with password `user123`

## 3. Run backend
```bash
cd backend
npm run dev
```
Expected console output:
```
MongoDB connected successfully
Server running on port 5000
```

## 4. Run frontend
```bash
cd frontend
npm install
npm run dev
```
Open http://localhost:5173

Admin panel: http://localhost:5173/admin/login (or the "Admin login" link on the login page).

## Install commands from scratch (if you rebuild the folders yourself)
```bash
# backend
npm init -y && npm install express mongoose dotenv cors && npm install -D nodemon
# frontend
npm create vite@latest frontend -- --template react
cd frontend && npm install axios bootstrap react-icons react-router-dom recharts
```

## Notes
- Recommendation logic: `backend/utils/recommender.js` (rule-based; swap `scorePlace` for an ML model later).
- Itinerary generator: `backend/utils/itinerary.js`.
- Frontend API base URL: `frontend/src/services/api.js`.
- Images use Unsplash URLs; broken links fall back to a gradient. Admins can change image URLs in the admin panel.
