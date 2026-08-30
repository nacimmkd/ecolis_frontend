import api from "@/app/config/axios.config";
import type { NotificationDto } from "@/shared/types";

const notificationService = {

    async getMyNotifications(): Promise<NotificationDto[]> {
        const res = await api.get<NotificationDto[]>("/api/v1/notifications");
        return res.data;
    },

    async markAsRead(id: string): Promise<void> {
        await api.patch(`/api/v1/notifications/${id}/read`);
    },

};

export default notificationService;
