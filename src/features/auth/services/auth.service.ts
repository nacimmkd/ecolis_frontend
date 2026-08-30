import api from "@/app/config/axios.config";
import type { AuthRequest, UserDetails } from "@/shared/types";

const apiUrl = import.meta.env.VITE_API_URL;

const authService = {

    async login(credentials: AuthRequest): Promise<UserDetails> {
        const res = await api.post<UserDetails>("/api/v1/auth/login", credentials);
        return res.data;
    },

    async refresh(): Promise<void> {
        await api.post<UserDetails>("/api/v1/auth/refresh");
    },

    async logout(): Promise<void> {
        await api.post("/api/v1/auth/logout");
    },

    getGoogleAuthUrl: () =>  {
        return `${apiUrl}/oauth2/authorization/google`;
    },

    async getMe(): Promise<UserDetails> {
        const res = await api.get<UserDetails>("/api/v1/auth/me");
        return res.data;
    }

};

export default authService;