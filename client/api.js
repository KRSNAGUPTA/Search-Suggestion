import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.BACKEND_URL || "localhost:5173",
});

export default api;
