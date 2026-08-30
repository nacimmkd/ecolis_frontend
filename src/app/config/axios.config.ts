import axios from "axios";
import { AppError } from "@/shared/types/AppError";

const apiUrl = import.meta.env.VITE_API_URL;

export const api = axios.create({
    baseURL: apiUrl,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

let refreshPromise: Promise<unknown> | null = null;

api.interceptors.response.use(
    (response) => response,
    async (err) => {
        const originalRequest = err.config;
        const isAccessTokenExpired = err.response?.data?.code === "ACCESS_TOKEN_EXPIRED";

        if (isAccessTokenExpired && originalRequest && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                refreshPromise ??= api.post("/api/v1/auth/refresh").finally(() => { refreshPromise = null; });
                await refreshPromise;
                return api(originalRequest);
            } catch {
                const { default: authStore } = await import("@/features/auth/store/auth.store");
                authStore.getState().setUser(null);
            }
        }

        return Promise.reject(AppError.from(err));
    },
);

export default api;