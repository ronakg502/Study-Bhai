import axios from "axios";
import { supabase } from "../lib/supabase";

const api = axios.create({
  baseURL: "https://study-bhai.onrender.com",
});

// Attach the Supabase auth token to every request automatically
api.interceptors.request.use(async (config) => {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;