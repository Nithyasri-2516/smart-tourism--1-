




import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Friendly error text for toast messages
export const errMsg = (err) => {
  if (!err.response) return "Unable to connect to server";
  return err.response.data?.message || "Something went wrong";
};

export default API;
