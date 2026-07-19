import axios from "axios";

const api = axios.create({
  baseURL: "https://careerpilot-ai-backend-vf5s.onrender.com",
  timeout: 120000, // 120 seconds
});

export default api;