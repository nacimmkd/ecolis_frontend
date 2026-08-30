import api from "@/app/config/axios.config";
import type { MatchResultDto } from "@/shared/types";

interface MatchResultPage {
    content: MatchResultDto[];
}

const matchingService = {

    async match(parcelId: string, date: string, sort?: string): Promise<MatchResultDto[]> {
        const res = await api.get<MatchResultPage>("/api/v1/match", { params: { parcelId, date, sort } });
        return res.data.content ?? [];
    },

};

export default matchingService;
