import api from "@/app/config/axios.config";
import type {
    RequestEmailVerification,
    RequestPasswordReset,
    ResetPasswordRequest,
    UpdatePasswordRequest,
    UserCreateRequest,
    UserDetails,
    VerifyEmailRequest,
} from "@/shared/types";

const userService = {

    async register(data: UserCreateRequest): Promise<UserDetails> {
        const res = await api.post<UserDetails>("/api/v1/users/register", data);
        return res.data;
    },

    async requestEmailVerification(data: RequestEmailVerification): Promise<void> {
        await api.post("/api/v1/users/verification/request", data);
    },

    async verifyEmail(data: VerifyEmailRequest): Promise<void> {
        await api.post("/api/v1/users/verification/verify", data);
    },

    async requestPasswordReset(data: RequestPasswordReset): Promise<void> {
        await api.post("/api/v1/users/password/reset/request", data);
    },

    async resetPassword(data: ResetPasswordRequest): Promise<void> {
        await api.post("/api/v1/users/password/reset", data);
    },

    async updatePassword(data: UpdatePasswordRequest): Promise<void> {
        await api.put("/api/v1/users/me/password", data);
    },

    async deleteMe(): Promise<void> {
        await api.delete("/api/v1/users/me");
    },

};

export default userService;