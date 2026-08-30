import api from "@/app/config/axios.config";
import type { ProfileDto, ProfileUpdateRequest } from "@/shared/types";

const profileService = {

    async getProfileById(profileId: string): Promise<ProfileDto> {
        const res = await api.get<ProfileDto>(`/api/v1/profile/${profileId}`);
        return res.data;
    },

    async updateProfile(data: ProfileUpdateRequest): Promise<ProfileDto> {
        const res = await api.put<ProfileDto>("/api/v1/profile/me", data);
        return res.data;
    },

};

export default profileService;
