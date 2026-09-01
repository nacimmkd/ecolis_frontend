import api from "@/app/config/axios.config.ts";
import type { PaymentResponse } from "@/shared/types";

const paymentService = {

    async createCheckoutSession(bookingId: string): Promise<PaymentResponse> {
        const res = await api.post<PaymentResponse>(`/api/v1/checkout/bookings/${bookingId}`);
        return res.data;
    },

};

export default paymentService;
