import axios from "axios";

// ตรวจสอบและสร้าง API URL ที่เข้าถึงได้ทั้งคอมพิวเตอร์และมือถือ (iOS/Android)
function getApiBaseUrl() {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  if (typeof window !== "undefined" && window.location && window.location.hostname) {
    // ใช้ Hostname เดียวกับที่เปิดหน้าเว็บ เพื่อรองรับการเปิดจากมือถือทุกเครื่อง
    const host = window.location.hostname;
    if (host === "localhost" || host === "127.0.0.1") {
      return "http://localhost:5000/api";
    }
    // หากเปิดจาก IP มือถือ (เช่น 192.168.1.123) ให้เชื่อมต่อไปยังพอร์ต 5000 หรือ Proxy
    return `http://${host}:5000/api`;
  }
  return "http://localhost:5000/api";
}

const api = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor แนบ Token ทุก Request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor จัดการ Error และการหมดอายุของ Session
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // ถ้าพอร์ต 5000 เชื่อมต่อไม่ติด ให้ลองยิงผ่าน Vite Reverse Proxy (/api) เป็นแผนสำรองอัตโนมัติ
    if (error.code === "ERR_NETWORK" || error.message?.includes("Network Error") || error.response?.status === 0) {
      if (error.config && !error.config._retriedWithProxy) {
        error.config._retriedWithProxy = true;
        error.config.baseURL = "/api";
        return api.request(error.config);
      }
    }

    if (error.response && error.response.status === 401) {
      if (!error.config?.url?.includes("/auth/login")) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
