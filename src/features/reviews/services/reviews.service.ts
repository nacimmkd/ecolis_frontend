import api from "@/app/config/axios.config";
import type { CreateReviewRequest, PageReviewDto, ReviewDto } from "@/shared/types";

const reviewsService = {

    async getUserReviews(revieweeId: string, page = 0, size = 20): Promise<PageReviewDto> {
        const res = await api.get<PageReviewDto>("/api/v1/reviews", { params: { revieweeId, page, size } });
        return res.data;
    },

    async createReview(data: CreateReviewRequest): Promise<ReviewDto> {
        const res = await api.post<ReviewDto>("/api/v1/reviews", data);
        return res.data;
    },

};

export default reviewsService;
