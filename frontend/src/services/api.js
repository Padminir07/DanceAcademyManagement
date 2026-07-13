import axios from "axios";

const api = axios.create({
  baseURL: "https://danceacademymanagement.onrender.com",
});

export default api;