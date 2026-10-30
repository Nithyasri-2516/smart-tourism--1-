import { createContext, useContext, useState, useCallback } from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import API, { errMsg } from "../services/api";

const Ctx = createContext(null);
export const useApp = () => useContext(Ctx);

const read = (store, key, fallback) => {
  try { return JSON.parse(store.getItem(key)) ?? fallback; } catch { return fallback; }
};

export function AppProvider({ children }) {
  // ---- logged in user (kept only for UI login state) ----
  const [user, setUserState] = useState(() => read(localStorage, "user", null));
  const setUser = (u) => {
    setUserState(u);
    if (u) localStorage.setItem("user", JSON.stringify(u)); else localStorage.removeItem("user");
  };
  const logout = () => { setUser(null); sessionStorage.clear(); };

  // ---- toast notifications ----
  const [toasts, setToasts] = useState([]);
  const toast = useCallback((message, type = "success") => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);

  // ---- trip draft (places added with "Add to Trip") ----
  const [draft, setDraftState] = useState(() => read(sessionStorage, "tripDraft", []));
  const setDraft = (d) => { setDraftState(d); sessionStorage.setItem("tripDraft", JSON.stringify(d)); };
  const addToTrip = (place) => {
    if (draft.some((p) => p._id === place._id)) return toast("Already in your trip", "error");
    setDraft([...draft, { _id: place._id, name: place.name, destination: place.destination?._id || place.destination }]);
    toast(`${place.name} added to trip`);
  };
  const removeFromDraft = (id) => setDraft(draft.filter((p) => p._id !== id));
  const clearDraft = () => setDraft([]);

  // ---- favorites ----
  const toggleFavorite = async (place) => {
    if (!user) return toast("Please login to save favorites", "error");
    try {
      const { data } = await API.put(`/users/${user._id}/favorites/${place._id}`);
      setUser({ ...user, favorites: data.favorites });
      toast(data.added ? "Favorite added" : "Favorite removed");
    } catch (e) { toast(errMsg(e), "error"); }
  };
  const toggleFavoriteDestination = async (dest) => {
    if (!user) return toast("Please login to save favorites", "error");
    try {
      const { data } = await API.put(`/users/${user._id}/favorite-destinations/${dest._id}`);
      setUser({ ...user, favoriteDestinations: data.favoriteDestinations });
      toast(data.added ? "Favorite added" : "Favorite removed");
    } catch (e) { toast(errMsg(e), "error"); }
  };
  const isFav = (id) => !!user?.favorites?.map(String).includes(String(id));
  const isFavDest = (id) => !!user?.favoriteDestinations?.map(String).includes(String(id));

  // ---- recently viewed ----
  const addRecent = (p) => {
    const list = read(localStorage, "recent", []).filter((x) => x._id !== p._id);
    list.unshift({ _id: p._id, name: p.name, image: p.image, location: p.location, category: p.category });
    localStorage.setItem("recent", JSON.stringify(list.slice(0, 6)));
  };

  const value = { user, setUser, logout, toast, draft, addToTrip, removeFromDraft, clearDraft, toggleFavorite, toggleFavoriteDestination, isFav, isFavDest, addRecent };
  return (
    <Ctx.Provider value={value}>
      {children}
      <div className="toast-stack">
        {toasts.map((t) => (
          <div key={t.id} className={`toast-item ${t.type}`}>
            {t.type === "success" ? <FaCheckCircle /> : <FaTimesCircle />} <span>{t.message}</span>
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}
