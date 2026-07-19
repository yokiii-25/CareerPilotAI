import axios from "axios";

const api = axios.create({
  baseURL: "https://careerpilot-ai-backend-vf5s.onrender.com",
});

export default api;