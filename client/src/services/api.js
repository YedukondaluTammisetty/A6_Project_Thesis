import axios from "axios";

/* =====================================================
   AXIOS INSTANCE
===================================================== */
const API = axios.create({
  baseURL: "http://localhost:5000/api"
});

/* =====================================================
   REQUEST INTERCEPTOR
   - Attach JWT token if present
===================================================== */
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* =====================================================
   RESPONSE INTERCEPTOR
   - Safe auto logout on 401
===================================================== */
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const token = localStorage.getItem("token");
    const path = window.location.pathname;

    if (
      status === 401 &&
      token &&
      !path.startsWith("/login") &&
      !path.startsWith("/signup")
    ) {
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

/* =====================================================
   CHATBOT API
===================================================== */
export const sendMessageToBot = async (message) => {
  return API.post("/chat", { message });
};

export default API;