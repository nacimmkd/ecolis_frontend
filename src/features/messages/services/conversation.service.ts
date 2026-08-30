import api from "@/app/config/axios.config";
import type { ConversationSummary } from "@/shared/types";

const conversationService = {

    async getMyConversations(): Promise<ConversationSummary[]> {
        const res = await api.get<ConversationSummary[]>("/api/v1/conversations");
        return res.data;
    },

    async getUnreadCount(conversationId: string): Promise<number> {
        const res = await api.get<number>(`/api/v1/conversations/${conversationId}/unread-count`);
        return res.data;
    },

};

export default conversationService;
