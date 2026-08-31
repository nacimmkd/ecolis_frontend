import axios from "axios";
import api from "@/app/config/axios.config.ts";
import type { PresignedUrl } from "@/shared/types";

export type StagedMedia = {
    key: string;
    contentType: string;
};

const mediaService = {

    async getPresignedUrl(content: string): Promise<PresignedUrl> {
        const res = await api.post<PresignedUrl>("/api/v1/images/presign", null, {
            params: { content },
        });
        return res.data;
    },

    async uploadToS3(url: string, file: File): Promise<void> {
        await axios.put(url, file, {
            headers: { "Content-Type": file.type },
        });
    },

    async uploadToStorage(file: File): Promise<StagedMedia> {
        const presigned = await mediaService.getPresignedUrl(file.type);
        await mediaService.uploadToS3(presigned.url!, file);
        return { key: presigned.key!, contentType: file.type };
    },

};

export default mediaService;
