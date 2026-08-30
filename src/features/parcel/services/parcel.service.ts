import api from "@/app/config/axios.config";
import mediaService from "@/features/media/services/media.service.ts";
import type { PageParcelSummary, ParcelCreateRequest, ParcelDetails, ParcelImageDto, ParcelImageRequest, ParcelUpdateRequest } from "@/shared/types";

const parcelService = {

    async getParcels(page = 0, size = 3): Promise<PageParcelSummary> {
        const res = await api.get<PageParcelSummary>("/api/v1/parcels", { params: { page, size } });
        return res.data;
    },

    async getMyParcels(page = 0, size = 3): Promise<PageParcelSummary> {
        const res = await api.get<PageParcelSummary>("/api/v1/parcels/me", { params: { page, size } });
        return res.data;
    },

    async getParcel(id: string): Promise<ParcelDetails> {
        const res = await api.get<ParcelDetails>(`/api/v1/parcels/${id}`);
        return res.data;
    },

    async createParcel(data: ParcelCreateRequest): Promise<ParcelDetails> {
        const res = await api.post<ParcelDetails>("/api/v1/parcels", data);
        return res.data;
    },

    async updateParcel(id: string, data: ParcelUpdateRequest): Promise<ParcelDetails> {
        const res = await api.put<ParcelDetails>(`/api/v1/parcels/${id}`, data);
        return res.data;
    },

    async deleteParcel(id: string): Promise<void> {
        await api.delete(`/api/v1/parcels/${id}`);
    },

    async addParcelImage(parcelId: string, data: ParcelImageRequest): Promise<ParcelImageDto> {
        const res = await api.post<ParcelImageDto>(`/api/v1/parcels/${parcelId}/images`, data);
        return res.data;
    },

    async uploadParcelImage(parcelId: string, file: File): Promise<ParcelImageDto> {
        const media = await mediaService.uploadToStorage(file);
        return parcelService.addParcelImage(parcelId, media);
    },

    async removeParcelImage(parcelId: string, imageId: string): Promise<void> {
        await api.delete(`/api/v1/parcels/${parcelId}/images/${imageId}`);
    },

};

export default parcelService;
