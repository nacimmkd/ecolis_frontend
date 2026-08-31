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

api.interceptors.response.use(
    (response) => response,
    (err) => Promise.reject(AppError.from(err))
);

export default api;