import axios, { AxiosInstance, AxiosResponse } from "axios";

// Works with both React Scripts (REACT_APP_) and Vite (VITE_)
const API_BASE_URL =
  process.env.REACT_APP_API_URL ||
  (import.meta as any).env?.VITE_BACKEND_URL ||
  'http://localhost:5000/api';

/* ===================== AXIOS INSTANCE ===================== */
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

/* ===================== REQUEST INTERCEPTOR ===================== */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


/* ===================== RESPONSE INTERCEPTOR ===================== */
/**
 * ❌ DO NOT auto-logout on every 401
 * Let AuthContext decide what to do
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Just forward the error
    return Promise.reject(error);
  }
);

/* ===================== TYPES ===================== */
interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  user?: T;
  token?: string;
  data?: any;
  errors?: any[];
}

/* ===================== AUTH API ===================== */
export const authAPI = {
  login: (credentials: {
    email: string;
    password: string;
  }): Promise<AxiosResponse<ApiResponse>> =>
    api.post("/auth/login", credentials),

  register: (userData: {
    name: string;
    email: string;
    password: string;
    role?: string;
  }): Promise<AxiosResponse<ApiResponse>> =>
    api.post("/auth/register", userData),

  googleLogin: (data: {
    token: string;
  }): Promise<AxiosResponse<ApiResponse>> =>
    api.post("/auth/google", data),

  getProfile: (): Promise<AxiosResponse<ApiResponse>> =>
    api.get("/auth/me"),

  refreshToken: (): Promise<AxiosResponse<ApiResponse>> =>
    api.post("/auth/refresh"),

  logout: (): Promise<AxiosResponse<ApiResponse>> =>
    api.post("/auth/logout"),
};

/* ===================== USERS API ===================== */
export const usersAPI = {
  getProfile: (): Promise<AxiosResponse<ApiResponse>> =>
    api.get("/users/profile"),

  updateProfile: (userData: any): Promise<AxiosResponse<ApiResponse>> =>
    api.put("/users/profile", userData),

  subscribeNewsletter: (email: string): Promise<AxiosResponse<ApiResponse>> =>
    api.post("/users/subscribe", { email }),
};

/* ===================== DOUBTS API ===================== */
export const doubtsAPI = {
  getDoubts: (params?: any): Promise<AxiosResponse<ApiResponse>> =>
    api.get("/doubts", { params }),

  createDoubt: (doubtData: any): Promise<AxiosResponse<ApiResponse>> =>
    api.post("/doubts", doubtData),
};

export default api;
/* ===================== SESSIONS API ===================== */